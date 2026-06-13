import { HERO, SITE, resolveHref } from '@/content'
import { withEmphasis } from '@/lib/emphasis'
import { formatCount } from '@/lib/format'
import { cx } from '@/lib/cx'
import { externalLink } from '@/lib/links'
import { Icon } from '@/components/ui/Icon'
import { HeroScene } from './HeroScene'
import { HeroLiveCard } from './HeroLiveCard'

export function Hero() {
  const { identity } = SITE
  const socials = [
    { name: 'github' as const, href: identity.github.url, label: 'GitHub profile', external: true },
    { name: 'linkedin' as const, href: identity.linkedin.url, label: 'LinkedIn profile', external: true },
    { name: 'mail' as const, href: `mailto:${identity.email}`, label: `Email ${identity.name.split(' ')[0]}`, external: false },
  ]

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <HeroScene />

      <div className="container">
        <p className="hero-eyebrow" data-hero>{HERO.eyebrow}</p>
        <h1 className="hero-title" data-hero>{HERO.title}</h1>
        <p className="hero-sub" data-hero>{withEmphasis(HERO.sub)}</p>

        <div className="hero-actions" data-hero>
          {HERO.actions.map(({ label, href, style, external }) => (
            <a
              key={label}
              className={cx('button', style === 'primary' ? 'button-primary' : 'button-ghost')}
              href={resolveHref(href)}
              {...(external ? externalLink : {})}
            >
              {label}
            </a>
          ))}
          <div className="hero-social">
            {socials.map(({ name, href, label, external }) => (
              <a key={name} href={href} aria-label={label} {...(external ? externalLink : {})}>
                <Icon name={name} />
              </a>
            ))}
          </div>
        </div>

        <HeroLiveCard />

        <dl className="hero-stats" data-hero>
          {HERO.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>
                <span data-count={stat.value} data-count-suffix={stat.suffix} data-count-decimals={stat.decimals}>
                  {formatCount(stat.value, stat.decimals, stat.suffix)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="stats-asof" data-hero>{HERO.asOf}</p>
      </div>
    </section>
  )
}
