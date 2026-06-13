import { useEffect, useState } from 'react'
import { parseLiveStats, STATS_REFRESH_MS, STATS_URL, type LiveStats } from '@/scene/liveStats'

/**
 * Polls the eSnipe portfolio-stats feed on the same cadence as the WebGL
 * console and returns the latest validated snapshot (or null until one
 * arrives). `enabled` gates the network entirely so the desktop hero,
 * which renders the console instead, never double-fetches. A failed poll
 * keeps the last good snapshot on screen.
 */
export function useLiveStats(enabled: boolean): LiveStats | null {
  const [stats, setStats] = useState<LiveStats | null>(null)

  useEffect(() => {
    if (!enabled) return
    let alive = true

    const fetchStats = async () => {
      try {
        const res = await fetch(STATS_URL, { cache: 'no-store', signal: AbortSignal.timeout(4000) })
        if (!res.ok) return
        const parsed = parseLiveStats(await res.json())
        if (alive && parsed) setStats(parsed)
      } catch {
        // offline or slow: keep the last good snapshot
      }
    }

    fetchStats()
    const id = window.setInterval(fetchStats, STATS_REFRESH_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [enabled])

  return stats
}
