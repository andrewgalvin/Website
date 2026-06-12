interface Role {
  dates: string
  title: string
  org: string
  bullets?: string[]
  tags?: string[]
  detail?: string
}

const TIMELINE: Role[] = [
  {
    dates: 'Apr 2026 – Present',
    title: 'Senior Software Engineer',
    org: 'Center Stage, LLC · Remote',
    bullets: [
      'Architect the fleet of Go services behind inventory management for a high-volume ticket-resale operation.',
      'Design real-time market monitors that turn noisy marketplace data into buying signal: what to buy, where, and when.',
      'Ship rapidly with an AI-first workflow and build LLM-powered internal tooling, holding the line on code quality and testability.',
      "Own platform work end to end: design, build, deploy, operate. The interesting details are proprietary, but I'm happy to talk at a high level.",
    ],
    tags: ['Go', 'Microservices', 'LLM tooling'],
  },
  {
    dates: 'Jan 2025 – Apr 2026',
    title: 'Software Engineer',
    org: 'Fidelity · Boston, MA',
    bullets: [
      'Led the design and build of internal platforms that streamline production deployments.',
      'Acted as de facto technical lead through team transitions: guiding system design, mentoring through code review, and keeping multi-service initiatives delivering.',
      'Resolved production issues with root-cause analysis and durable fixes; a regular voice in cross-team architecture discussions.',
    ],
    tags: ['Java', 'Deployment platforms', 'Root-cause analysis'],
  },
  {
    dates: 'Jun 2023 – Dec 2024',
    title: 'Associate Software Engineer',
    org: 'Fidelity · Boston, MA',
    bullets: [
      'Implemented CI/CD pipelines for Java and Python services: reusable, documented foundations adopted by later projects.',
      'Standardized build enforcement and dependency management across teams; owned role-based access configuration, service upgrades, and cross-system integrations.',
      'Strengthened acceptance and component testing strategy while promoting a design-first mindset in reviews.',
    ],
    tags: ['Java', 'Python', 'CI/CD'],
  },
  {
    dates: '2022 – 2023',
    title: 'M.S. Applied Computer Science',
    org: 'Wentworth Institute of Technology · Boston, MA',
    detail: '4.0 GPA · Concentration in Artificial Intelligence & Machine Learning',
  },
  {
    dates: '2018 – 2022',
    title: 'B.S. Computer Science',
    org: 'Wentworth Institute of Technology · Boston, MA',
    detail: "3.6 GPA · Minor in Applied Mathematics · Dean's List every semester",
  },
]

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <h2 className="section-title" id="experience-title">Experience &amp; Education</h2>

        <ol className="timeline" role="list">
          {TIMELINE.map(({ dates, title, org, bullets, tags, detail }) => (
            <li className="timeline-item" data-reveal key={`${dates} ${title}`}>
              <p className="timeline-dates">{dates}</p>
              <div className="timeline-body">
                <h3>{title}</h3>
                <p className="timeline-org">{org}</p>
                {bullets && (
                  <ul className="timeline-bullets">
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {tags && (
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
          <a href="/Andrew-Galvin-Resume.pdf" target="_blank" rel="noopener">
            View full résumé (PDF) ↗
          </a>
        </p>
      </div>
    </section>
  )
}
