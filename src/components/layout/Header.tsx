import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/content'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * Mobile menu open/close with the small a11y contract that goes with it:
 * aria-expanded stays truthful, Esc closes, and focus returns to the toggle.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 56rem)')

  // opening hands focus to the first link in the menu
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // leaving the mobile breakpoint clears any leftover overlay state
  useEffect(() => {
    if (wide) setOpen(false)
  }, [wide])

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
          className={open ? 'nav-menu is-open' : 'nav-menu'}
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
              <a className="nav-resume" href={SITE.identity.resume} target="_blank" rel="noopener">
                Résumé
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
