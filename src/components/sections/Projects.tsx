import { PROJECTS } from '@/content'
import { externalLink } from '@/lib/links'
import { useLiveStats } from '@/hooks/useLiveStats'

export function Projects() {
  const live = useLiveStats(true)
  // a featured figure flagged `live` shows the production number once the
  // feed answers, falling back to its static value until then
  const figureNumber = (figure: { number: string; live?: 'registered' | 'activeSearches' }) => {
    const value = figure.live === 'registered' ? live?.registeredUsers : undefined
    return typeof value === 'number' ? value.toLocaleString('en-US') : figure.number
  }

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <h2 className="section-title" id="projects-title">{PROJECTS.title}</h2>

        <div className="featured-list">
          {PROJECTS.featured.map(({ kicker, title, body, tags, links, figure }) => (
            <article className="featured" data-reveal key={title}>
              <div className="featured-info">
                <p className="featured-kicker">{kicker}</p>
                <h3>{title}</h3>
                <p>{body}</p>
                <ul className="featured-tags" role="list">
                  {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {links && links.length > 0 && (
                  <p className="featured-links">
                    {links.map(({ label, href }) => (
                      <a key={href} href={href} {...externalLink}>{label}</a>
                    ))}
                  </p>
                )}
              </div>
              <div className="featured-figure" aria-hidden="true">
                <span className="featured-number">{figureNumber(figure)}</span>
                <span className="featured-caption">{figure.caption}</span>
              </div>
            </article>
          ))}
        </div>

        <h3 className="subsection-title" data-reveal>{PROJECTS.archiveTitle}</h3>
        <ul className="archive-list" role="list" data-reveal-group>
          {PROJECTS.archive.map(({ title, body, note, link }) => (
            <li className="archive-item" key={title}>
              <h4>{title}</h4>
              <p>{body}</p>
              {note && <span className="archive-private">{note}</span>}
              {link && (
                <a href={link.href} {...externalLink}>{link.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
