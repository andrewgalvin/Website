const QUICK_FACTS = [
  ['Currently', 'Senior Software Engineer, Center Stage, LLC'],
  ['Previously', 'Software Engineer, Fidelity'],
  ['Education', 'M.S. Applied CS, 4.0 GPA, Wentworth'],
  ['Base', 'Boston, MA'],
  ['Workflow', 'AI-first: Claude, Cursor, Codex'],
  ['Stack', 'Go · Python · Java · TypeScript'],
] as const

const PRINCIPLES = [
  {
    index: '01',
    title: 'AI leverage, human judgment',
    body: 'Assistants accelerate the typing. Design decisions, reviews, and the final word on correctness stay human.',
  },
  {
    index: '02',
    title: 'Tests are the contract',
    body: "Speed only counts when it's safe to keep. Code that can't prove itself doesn't ship.",
  },
  {
    index: '03',
    title: 'Built for production',
    body: 'Concurrency, rate limits, retries, observability. Designed in from day one, not patched in after the incident.',
  },
]

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <h2 className="section-title" id="about-title">About</h2>

        <div className="about-grid">
          <div className="about-copy flow" data-reveal>
            <p className="lead">
              I'm a senior software engineer at Center Stage, a ticket-resale
              company. I build the systems that manage inventory at scale and
              the monitors that find new angles on what to buy and where.
            </p>
            <p>
              My own projects taught me production the hard way. Ticket
              Monitor ran at a scale where concurrency, rate limiting, and
              retries stopped being theory, and it's a big part of how I
              landed this job. eSnipe is live today on web, iOS, and
              Android, and still growing.
            </p>
            <p>
              I work AI-first. Claude, Cursor, Codex, and ChatGPT are in my
              daily loop for scaffolding, tests, and review. I also build
              with LLMs directly: local-model pipelines with human review
              where it matters. The tools buy speed. The discipline keeps
              quality and testability non-negotiable.
            </p>
            <p>
              Before this I was at Fidelity, building internal deployment
              platforms and often acting as de facto tech lead. M.S. in
              Applied Computer Science (AI/ML, 4.0 GPA) from Wentworth. Off
              the clock: portrait photography.
            </p>
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
              {QUICK_FACTS.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="principles" data-reveal-group>
          {PRINCIPLES.map(({ index, title, body }) => (
            <div className="principle" key={index}>
              <span className="principle-index" aria-hidden="true">{index}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
