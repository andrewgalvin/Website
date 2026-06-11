import './styles/main.css'
import { initNavigation } from './lib/navigation'
import { initAnimations } from './lib/animations'
import { initContactForm } from './lib/contactForm'

initNavigation()
initAnimations()
initContactForm()

const yearEl = document.getElementById('footer-year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

/**
 * The Three.js scene is a progressive enhancement: it lives in its own lazy
 * chunk, loads at browser idle, and only on viewports wide enough to show it
 * (the canvas is display:none below 64rem, so phones never pay for the
 * download). If WebGL is unavailable the hero simply stays typographic.
 */
const canvas = document.getElementById('hero-canvas')
if (canvas instanceof HTMLCanvasElement) {
  const start = () => {
    import('./scene/heroScene')
      .then(({ initHeroScene }) => initHeroScene(canvas))
      .catch(() => canvas.remove())
  }
  const schedule = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(start, { timeout: 1500 })
    } else {
      setTimeout(start, 300)
    }
  }

  const wide = matchMedia('(min-width: 64rem)')
  if (wide.matches) {
    schedule()
  } else {
    // if the viewport later grows past the breakpoint, load the scene then
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) return
      wide.removeEventListener('change', onChange)
      schedule()
    }
    wide.addEventListener('change', onChange)
  }
}
