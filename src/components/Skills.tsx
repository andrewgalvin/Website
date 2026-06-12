const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Go', 'Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    title: 'Backend & Platform',
    items: ['Node.js', 'REST APIs', 'PostgreSQL', 'AWS', 'Docker', 'CI/CD'],
  },
  {
    title: 'AI-Augmented Development',
    featured: true,
    items: [
      'Claude',
      'Cursor',
      'Codex',
      'ChatGPT',
      'LLM integration',
      'Local models (Ollama)',
      'AI-assisted testing',
      'AI code review',
    ],
  },
  {
    title: 'Product & Practice',
    items: ['React', 'Angular', 'Electron', 'Stripe', 'System design', 'Testing strategy'],
  },
]

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <h2 className="section-title" id="skills-title">Skills</h2>

        <div className="skills-grid" data-reveal-group>
          {SKILL_GROUPS.map(({ title, items, featured }) => (
            <div className={featured ? 'skill-group skill-group-featured' : 'skill-group'} key={title}>
              <h3>{title}</h3>
              <ul role="list">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
