import { EXPERIENCE, SITE } from '@/content'
import { externalLink } from '@/lib/links'

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <h2 className="section-title" id="experience-title">{EXPERIENCE.title}</h2>

        <ol className="timeline" role="list">
          {EXPERIENCE.items.map(({ dates, title, org, bullets, tags, detail }) => (
            <li className="timeline-item" data-reveal key={`${dates} ${title}`}>
              <p className="timeline-dates">{dates}</p>
              <div className="timeline-body">
                <h3>{title}</h3>
                <p className="timeline-org">{org}</p>
                {bullets && bullets.length > 0 && (
                  <ul className="timeline-bullets">
                    {bullets.map((bullet, i) => (
                      // index keys: build-time content, never reordered
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {tags && tags.length > 0 && (
                  <ul className="role-tags" role="list">
                    {tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                {detail && <p className="timeline-detail">{detail}</p>}
              </div>
            </li>
          ))}
        </ol>

        <p className="experience-resume" data-reveal>
          <a href={SITE.identity.resume} {...externalLink}>
            {EXPERIENCE.resumeLabel}
          </a>
        </p>
      </div>
    </section>
  )
}
