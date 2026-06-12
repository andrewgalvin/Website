/**
 * Mobile menu open/close with the small a11y contract that goes with it:
 * aria-expanded stays truthful, Esc closes, and focus returns to the toggle.
 */
export function initNavigation(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
  const menu = document.getElementById('site-menu')
  if (!toggle || !menu) return

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true'

  const setOpen = (open: boolean, { restoreFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open))
    menu.classList.toggle('is-open', open)
    if (open) {
      menu.querySelector<HTMLElement>('a')?.focus()
    } else if (restoreFocus) {
      toggle.focus()
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()))

  menu.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a')) setOpen(false)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false, { restoreFocus: true })
  })

  // leaving the mobile breakpoint clears any leftover overlay state
  matchMedia('(min-width: 48rem)').addEventListener('change', (e) => {
    if (e.matches && isOpen()) setOpen(false)
  })
}
