import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SECTION_IDS = ['about', 'projects', 'experience', 'skills', 'contact']

const counterParts = (el: HTMLElement) => ({
  target: Number.parseFloat(el.dataset.count ?? '0'),
  decimals: Number.parseInt(el.dataset.countDecimals ?? '0', 10),
  suffix: el.dataset.countSuffix ?? '',
})

const counterFinalText = (el: HTMLElement) => {
  const { target, decimals, suffix } = counterParts(el)
  return target.toFixed(decimals) + suffix
}

export function initAnimations(): void {
  const counters = gsap.utils.toArray<HTMLElement>('[data-count]')
  const mm = gsap.matchMedia()

  /* ---- UI state, not motion: runs regardless of motion preference ---- */

  // header hairline once the page moves
  ScrollTrigger.create({
    start: 8,
    end: 'max',
    toggleClass: { className: 'is-scrolled', targets: '.site-header' },
  })

  // active nav link tracking
  const navLinks = new Map<string, HTMLElement>()
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((link) => {
    const id = link.getAttribute('href')?.slice(1)
    if (id) navLinks.set(id, link)
  })
  SECTION_IDS.forEach((id) => {
    const section = document.getElementById(id)
    const link = navLinks.get(id)
    if (!section || !link) return
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    })
  })

  // Reduced motion: no animation work at all — just make sure every number
  // shows its final value. Content is never hidden by CSS, so nothing else
  // needs to be revealed.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    counters.forEach((el) => {
      el.textContent = counterFinalText(el)
    })
  })

  // If the page loads in a background tab, rAF is throttled and the intro
  // would play to nobody. Hold off until the tab is first seen — content
  // stays fully visible in the meantime because nothing is hidden by CSS.
  if (document.visibilityState === 'hidden') {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', onVisible)
      setupMotion(mm, counters)
    }
    document.addEventListener('visibilitychange', onVisible)
  } else {
    setupMotion(mm, counters)
  }
}

function setupMotion(mm: gsap.MatchMedia, counters: HTMLElement[]): void {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* ---- hero: one quiet stagger ----
       The h1 is the LCP element, so it never animates opacity — a y-drift
       only. Everything else fades up around it. */
    gsap.from('.hero-title', {
      y: 14,
      duration: 0.85,
      ease: 'power2.out',
      delay: 0.1,
    })
    gsap.from('[data-hero]:not(.hero-title)', {
      autoAlpha: 0,
      y: 18,
      duration: 0.85,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.15,
    })

    /* ---- soft reveals ---- */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((groupEl) => {
      gsap.from(groupEl.children, {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: groupEl, start: 'top 86%', once: true },
      })
    })

    /* ---- stat counters ----
       Hero counters wait for their block to finish fading in, then run as
       a staggered trio — the count-up should be seen, not happen while the
       stats are still transparent. Any future non-hero counter keeps the
       scroll-triggered behavior. */
    counters.forEach((el, i) => {
      const { target, decimals, suffix } = counterParts(el)
      const state = { value: 0 }
      const inHero = Boolean(el.closest('.hero-stats'))
      gsap.to(state, {
        value: target,
        duration: 1.2,
        ease: 'power1.inOut',
        delay: inHero ? 0.75 + i * 0.15 : 0,
        scrollTrigger: inHero
          ? undefined
          : { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = state.value.toFixed(decimals) + suffix
        },
      })
    })
  })
}
