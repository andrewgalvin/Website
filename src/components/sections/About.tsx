import { ABOUT } from '@/content'

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <h2 className="section-title" id="about-title">{ABOUT.title}</h2>

        <div className="about-grid">
          <div className="about-copy flow" data-reveal>
            <p className="lead">{ABOUT.lead}</p>
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <aside className="about-facts" data-reveal aria-label="Quick facts">
            {/*
              Portrait slot: drop a photo at public/portrait.jpg (4:5 crop
              works best, ~800px wide), then uncomment. Styles already exist.

            <figure className="about-photo">
              <img
                src="/portrait.jpg"
                alt="Andrew Galvin"
                width={640}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </figure>
            */}
            <dl>
              {ABOUT.facts.map(({ term, detail }) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="principles" data-reveal-group>
          {ABOUT.principles.map(({ title, body }, i) => (
            <div className="principle" key={title}>
              <span className="principle-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
