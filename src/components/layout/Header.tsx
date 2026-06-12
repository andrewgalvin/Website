import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/content'
import { cx } from '@/lib/cx'
import { externalLink } from '@/lib/links'

/**
 * Mobile menu open/close with the small a11y contract that goes with it:
 * aria-expanded stays truthful, Esc closes, and focus returns to the toggle.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // opening hands focus to the first link in the menu
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [open])

  // while open: Esc closes (restoring focus), and growing past the mobile
  // breakpoint clears the overlay state — no listeners while closed
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const wide = matchMedia('(min-width: 56rem)')
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    wide.addEventListener('change', onBreakpoint)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      wide.removeEventListener('change', onBreakpoint)
    }
  }, [open])

  return (
    <header className="site-header">
      <nav className="container site-nav" aria-label="Primary">
        <a className="brand" href="#top">{SITE.identity.name}</a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div
          ref={menuRef}
          className={cx('nav-menu', open && 'is-open')}
          id="site-menu"
          onClick={(e) => {
            if (e.target instanceof Element && e.target.closest('a')) setOpen(false)
          }}
        >
          <ul className="nav-links" role="list">
            {SITE.nav.map(({ href, label }) => (
              <li key={href}>
                <a href={href} data-nav>{label}</a>
              </li>
            ))}
            <li>
              <a className="nav-resume" href={SITE.identity.resume} {...externalLink}>
                Résumé
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
