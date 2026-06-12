import { EXPERIENCE, SITE } from '@/content'

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
                    {bullets.map((bullet) => (
                      <li key={bullet.slice(0, 32)}>{bullet}</li>
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
          <a href={SITE.identity.resume} target="_blank" rel="noopener">
            {EXPERIENCE.resumeLabel}
          </a>
        </p>
      </div>
    </section>
  )
}
