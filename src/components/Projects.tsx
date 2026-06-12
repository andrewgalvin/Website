const ARCHIVE = [
  {
    title: 'Sneaker Checkout Logs',
    body: 'Dashboard monitoring bot checkout logs and Shopify bot protection.',
    note: 'Retired',
  },
  {
    title: 'Supreme Tool',
    body: 'Authenticated carting tool that adds items to cart in milliseconds.',
    link: { href: 'https://www.youtube.com/watch?v=WghDFZ097Ys', label: 'Video demo ↗' },
  },
  {
    title: 'Discord Ticket Tool',
    body: 'Decision-tree support automation with full conversation logging.',
    note: 'Private build',
  },
  {
    title: 'Sneaker Profile Manager',
    body: 'Creates and converts checkout profiles across major sneaker bots.',
    link: { href: 'https://github.com/andrewgalvin/DiscordProfileConverter', label: 'Source ↗' },
  },
  {
    title: 'Fooji Twitter Monitor',
    body: 'Watches for Fooji giveaways with one-click entry on launch.',
    link: { href: 'https://twitter.com/WithoutRemorse/status/1386756971559280641', label: 'Example entry ↗' },
  },
  {
    title: 'Base Monitor Service',
    body: 'Reusable Go foundation for multi-threaded monitors. The skeleton my crawlers start from.',
    link: { href: 'https://github.com/andrewgalvin/base-monitor-service', label: 'Source ↗' },
  },
]

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <h2 className="section-title" id="projects-title">Projects</h2>

        <div className="featured-list">
          <article className="featured" data-reveal>
            <div className="featured-info">
              <p className="featured-kicker">Retired · it landed me my current job</p>
              <h3>Ticket Monitor</h3>
              <p>
                A distributed monitoring platform that watched event
                inventory and alerted users to in-stock tickets in near real
                time. Concurrency controls, rate limiting, and fault-tolerant
                retries kept it reliable while it processed around 50 million
                requests a day. Now retired, but it opened the door to the
                work I do today.
              </p>
              <ul className="featured-tags" role="list">
                <li>Distributed systems</li>
                <li>Concurrency</li>
                <li>Rate limiting</li>
                <li>Real-time alerting</li>
              </ul>
            </div>
            <div className="featured-figure" aria-hidden="true">
              <span className="featured-number">50M</span>
              <span className="featured-caption">requests per day at peak</span>
            </div>
          </article>

          <article className="featured" data-reveal>
            <div className="featured-info">
              <p className="featured-kicker">In production since launch</p>
              <h3>eSnipe</h3>
              <p>
                An eBay monitoring and alerting platform serving 194 active
                users, with native iOS and Android apps and Discord alerts
                that land in seconds. It tracks 285 searches a day, each
                polling on a user-chosen cadence from every 5 seconds to
                every 60 minutes, and stays accurate inside strict external
                API limits.
              </p>
              <ul className="featured-tags" role="list">
                <li>Production operations</li>
                <li>API integration</li>
                <li>Notifications</li>
              </ul>
              <p className="featured-links">
                <a href="https://esnipe.app" target="_blank" rel="noopener">esnipe.app ↗</a>
                <a href="https://apps.apple.com/app/id6758319934" target="_blank" rel="noopener">App Store ↗</a>
                <a href="https://play.google.com/store/apps/details?id=com.automate.esnipe.app" target="_blank" rel="noopener">Google Play ↗</a>
              </p>
            </div>
            <div className="featured-figure" aria-hidden="true">
              <span className="featured-number">194</span>
              <span className="featured-caption">active users today</span>
            </div>
          </article>
        </div>

        <h3 className="subsection-title" data-reveal>Earlier work</h3>
        <ul className="archive-list" role="list" data-reveal-group>
          {ARCHIVE.map(({ title, body, note, link }) => (
            <li className="archive-item" key={title}>
              <h4>{title}</h4>
              <p>{body}</p>
              {note && <span className="archive-private">{note}</span>}
              {link && (
                <a href={link.href} target="_blank" rel="noopener">{link.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
