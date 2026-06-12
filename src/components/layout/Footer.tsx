import { SITE } from '@/content'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {SITE.identity.name}</p>
        <p>
          Built with <a href="https://react.dev" target="_blank" rel="noopener">React</a>,{' '}
          <a href="https://threejs.org" target="_blank" rel="noopener">Three.js</a>,{' '}
          <a href="https://gsap.com" target="_blank" rel="noopener">GSAP</a> &amp;{' '}
          <a href="https://vite.dev" target="_blank" rel="noopener">Vite</a>, plus an AI pair or two ·{' '}
          <a href={SITE.identity.source} target="_blank" rel="noopener">Source</a> ·{' '}
          <a href="#top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}
