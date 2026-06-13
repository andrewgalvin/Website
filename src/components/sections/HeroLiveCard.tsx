import { useLiveStats } from '@/hooks/useLiveStats'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { monitoredCount } from '@/scene/liveStats'

/**
 * The WebGL telemetry console is desktop-only (the canvas is display:none
 * below 64rem and never downloads on phones). This is its mobile counterpart:
 * a plain-DOM card on the same live eSnipe feed, so the differentiator
 * survives where most recruiters actually open the link. Renders nothing
 * until real data arrives, so a flaky connection just leaves the hero text.
 */
export function HeroLiveCard() {
  const mobile = !useMediaQuery('(min-width: 64rem)')
  const stats = useLiveStats(mobile)
  if (!mobile || !stats) return null

  const monitored = monitoredCount(stats)
  const rows: Array<[string, string]> = [
    ['Last find', `${stats.secondsSinceLastFind ?? 0}s ago`],
    [
      'Searches',
      stats.pollOnSchedulePct !== null
        ? `${monitored} · ${stats.pollOnSchedulePct}% on time`
        : `${monitored}`,
    ],
    ['New listings · 1h', stats.findsLastHour.toLocaleString('en-US')],
  ]

  return (
    <div className="hero-live-card" aria-label="eSnipe live status">
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="hero-live-caption">live · eSnipe production</p>
    </div>
  )
}
