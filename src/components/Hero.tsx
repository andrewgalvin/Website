import { HeroScene } from './HeroScene'

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/andrewgalvin',
    label: 'GitHub profile',
    path: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
  },
  {
    href: 'https://www.linkedin.com/in/andrew-galvin-0000001/',
    label: 'LinkedIn profile',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z',
  },
  {
    href: 'mailto:andrew@andrewgalvin.dev',
    label: 'Email Andrew',
    path: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z',
  },
]

const STATS = [
  { label: 'peak requests a day, Ticket Monitor', count: '50', suffix: 'M', display: '50M' },
  { label: 'active users on eSnipe', count: '194', display: '194' },
  { label: 'searches monitored around the clock', count: '285', display: '285' },
]

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <HeroScene />

      <div className="container">
        <p className="hero-eyebrow" data-hero>
          Senior Software Engineer · Center Stage · Boston, MA
        </p>
        <h1 className="hero-title" data-hero>Andrew Galvin</h1>
        <p className="hero-sub" data-hero>
          I build <em>scalable systems</em> and <em>real-time market monitors</em>{' '}
          for the live-events resale industry. I work AI-first and ship
          production software fast, with the tests to prove it's right.
        </p>

        <div className="hero-actions" data-hero>
          <a className="button button-primary" href="#projects">See my work</a>
          <a className="button button-ghost" href="/Andrew-Galvin-Resume.pdf" target="_blank" rel="noopener">
            View résumé
          </a>
          <div className="hero-social">
            {SOCIAL_LINKS.map(({ href, label, path }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener' })}
              >
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path fill="currentColor" d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <dl className="hero-stats" data-hero>
          {STATS.map(({ label, count, suffix, display }) => (
            <div className="stat" key={label}>
              <dt>{label}</dt>
              <dd>
                <span data-count={count} data-count-suffix={suffix}>{display}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="stats-asof" data-hero>Numbers current as of June 2026</p>
      </div>
    </section>
  )
}
