import { ACTIVITY, SITE } from '@/content'
import { externalLink } from '@/lib/links'
import { useCountUp } from '@/hooks/useCountUp'
import { useGithubContributions } from '@/hooks/useGithubContributions'
import { weekdayOf } from '@/scene/githubStats'

/**
 * GitHub contribution heatmap plus a live total. Data arrives from the
 * /api/github-contributions function on mount; until then (and if the proxy is
 * unavailable) the whole section stays hidden, so it never shows an empty grid.
 * Days sit in per-week columns placed by weekday, so partial first/last weeks
 * align without padding. The palette is the site accent, not GitHub green.
 */
export function GitHubActivity() {
  const data = useGithubContributions()
  const total = useCountUp(data?.total ?? 0)

  // Reserve nothing until the feed answers: this is enrichment, not core copy,
  // so an absent proxy simply drops the section rather than dead-ending it.
  if (!data) return null

  // Month labels: mark the column where each new month first appears.
  let lastMonth = -1
  const months = data.weeks.map((week) => {
    const first = week[0]
    const month = first ? new Date(`${first.date}T00:00:00Z`).getUTCMonth() : lastMonth
    if (month !== lastMonth && week.length >= 4) {
      lastMonth = month
      return MONTHS[month]
    }
    return ''
  })

  return (
    <section className="section gh" id="activity" aria-labelledby="activity-title">
      <div className="container">
        <h2 className="section-title" id="activity-title">{ACTIVITY.title}</h2>

        <div className="gh-head" data-reveal>
          <div>
            <p className="gh-heading">{ACTIVITY.heading}</p>
            <p className="gh-blurb">{ACTIVITY.blurb}</p>
          </div>
          <p className="gh-total">
            <span className="gh-total-num">{total.toLocaleString('en-US')}</span>
            <span className="gh-total-label">{ACTIVITY.statLabel}</span>
          </p>
        </div>

        <figure className="gh-figure" data-reveal>
          <div className="gh-scroll">
            <div
              className="gh-graph"
              role="img"
              aria-label={`${data.total.toLocaleString('en-US')} GitHub contributions in the last year`}
            >
              <div className="gh-months" aria-hidden="true">
                {months.map((label, i) => (
                  <span className="gh-month" key={i}>{label}</span>
                ))}
              </div>
              <div className="gh-weeks" aria-hidden="true">
                {data.weeks.map((week, i) => (
                  <div className="gh-week" key={week[0]?.date ?? i}>
                    {week.map((day) => (
                      <span
                        key={day.date}
                        className="gh-day"
                        data-level={day.level}
                        style={{ gridRow: weekdayOf(day.date) + 1 }}
                        title={`${day.count} on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <figcaption className="gh-legend">
            <span>{ACTIVITY.asOf}</span>
            <span className="gh-scale" aria-hidden="true">
              Less
              {[0, 1, 2, 3, 4].map((level) => (
                <i className="gh-day" data-level={level} key={level} />
              ))}
              More
            </span>
          </figcaption>
        </figure>

        <p className="gh-link" data-reveal>
          <a href={SITE.identity.github.url} {...externalLink}>{ACTIVITY.linkLabel}</a>
        </p>
      </div>
    </section>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
