import type { Stat } from '@/content'
import { monitoredCount, type LiveStats } from '@/scene/liveStats'
import { formatCount } from '@/lib/format'
import { useCountUp } from '@/hooks/useCountUp'

/**
 * One hero stat. Its target is the live eSnipe value when the stat is
 * flagged `live` and the feed has answered; otherwise the static value
 * from content (which is also the count-up fallback before data loads, and
 * the value forever for the retired Ticket Monitor figure). `liveSub`
 * appends a second live figure to the label (e.g. "· 92 active now").
 */
export function HeroStat({ stat, live }: { stat: Stat; live: LiveStats | null }) {
  const liveValue =
    stat.live === 'registered'
      ? live?.registeredUsers
      : stat.live === 'searches'
        ? (live ? monitoredCount(live) : null)
        : null
  const target = typeof liveValue === 'number' ? liveValue : stat.value
  const shown = useCountUp(target)

  const subValue = stat.liveSub === 'active' ? live?.activeUsers : null

  return (
    <div className="stat">
      <dd>{formatCount(shown, stat.decimals, stat.suffix)}</dd>
      <dt>
        {stat.label}
        {typeof subValue === 'number' && (
          <span className="stat-sub">{subValue.toLocaleString('en-US')} active right now</span>
        )}
      </dt>
    </div>
  )
}
