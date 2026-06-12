import { SITE } from '@/content'
import { externalLink } from '@/lib/links'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {SITE.identity.name}</p>
        <p>
          Built with <a href="https://react.dev" {...externalLink}>React</a>,{' '}
          <a href="https://threejs.org" {...externalLink}>Three.js</a>,{' '}
          <a href="https://gsap.com" {...externalLink}>GSAP</a> &amp;{' '}
          <a href="https://vite.dev" {...externalLink}>Vite</a>, plus an AI pair or two ·{' '}
          <a href={SITE.identity.source} {...externalLink}>Source</a> ·{' '}
          <a href="#top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}
