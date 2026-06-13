import { SKILLS } from '@/content'
import { cx } from '@/lib/cx'
import { externalLink } from '@/lib/links'

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <h2 className="section-title" id="skills-title">{SKILLS.title}</h2>

        <div className="skills-grid" data-reveal-group>
          {SKILLS.groups.map(({ title, items, featured }) => (
            <div className={cx('skill-group', featured && 'skill-group-featured')} key={title}>
              <h3>{title}</h3>
              <ul role="list">
                {items.map((item) =>
                  typeof item === 'string' ? (
                    <li key={item}>{item}</li>
                  ) : (
                    <li key={item.label} className="skill-linked">
                      <a href={item.href} {...externalLink}>{item.label} ↗</a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
