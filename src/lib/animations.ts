import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SITE } from '@/content'
import { formatCount } from '@/lib/format'

gsap.registerPlugin(ScrollTrigger)

// scrollspy targets derive from the nav, so adding a section to site.yaml
// can't silently miss the highlight tracking
const SECTION_IDS = SITE.nav.map(({ href }) => href.slice(1))

const counterParts = (el: HTMLElement) => ({
  target: Number.parseFloat(el.dataset.count ?? '0'),
  decimals: Number.parseInt(el.dataset.countDecimals ?? '0', 10),
  suffix: el.dataset.countSuffix ?? '',
})

const counterFinalText = (el: HTMLElement) => {
  const { target, decimals, suffix } = counterParts(el)
  return formatCount(target, decimals, suffix)
}

export function initAnimations(): () => void {
  const counters = gsap.utils.toArray<HTMLElement>('[data-count]')
  const mm = gsap.matchMedia()
  const uiTriggers: ScrollTrigger[] = []

  /* ---- UI state, not motion: runs regardless of motion preference ---- */

  // header hairline once the page moves
  uiTriggers.push(
    ScrollTrigger.create({
      start: 8,
      end: 'max',
      toggleClass: { className: 'is-scrolled', targets: '.site-header' },
    }),
  )

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
    uiTriggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => link.classList.toggle('is-active', self.isActive),
      }),
    )
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
  let cancelDeferred: (() => void) | undefined
  if (document.visibilityState === 'hidden') {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      document.removeEventListener('visibilitychange', onVisible)
      setupMotion(mm, counters)
    }
    document.addEventListener('visibilitychange', onVisible)
    cancelDeferred = () => document.removeEventListener('visibilitychange', onVisible)
  } else {
    setupMotion(mm, counters)
  }

  return () => {
    cancelDeferred?.()
    uiTriggers.forEach((trigger) => trigger.kill())
    mm.revert()
  }
}

function setupMotion(mm: gsap.MatchMedia, counters: HTMLElement[]): void {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Reveal tweens hide below-fold content until scrolled. Non-scrolling
    // renderers (print, full-page capture, some crawlers) never scroll, so
    // a failsafe completes every pending reveal after a few seconds —
    // offscreen content becoming visible is imperceptible to a reader, and
    // the page can no longer be captured blank.
    const revealTweens: gsap.core.Tween[] = []
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
      revealTweens.push(
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      )
    })
    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((groupEl) => {
      revealTweens.push(
        gsap.from(groupEl.children, {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: groupEl, once: true, start: 'top 86%' },
        }),
      )
    })

    const failsafe = window.setTimeout(() => {
      // kill the pending tweens and clear their inline styles: elements
      // fall back to the stylesheet, which never hides content
      for (const tween of revealTweens) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
      gsap.set(['[data-reveal]', '[data-reveal-group] > *'], {
        clearProps: 'opacity,visibility,transform',
      })
    }, 5000)
    return () => clearTimeout(failsafe)

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
          el.textContent = formatCount(state.value, decimals, suffix)
        },
      })
    })
  })
}
