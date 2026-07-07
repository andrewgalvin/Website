import { useEffect, useState } from 'react'
import { GITHUB_STATS_URL, parseContributions, type GithubContributions } from '@/scene/githubStats'

/**
 * Fetches the GitHub contribution calendar once on mount and returns the
 * validated snapshot (or null until one arrives, and forever if the proxy is
 * unavailable — e.g. `vite dev` with no Netlify function). Unlike the eSnipe
 * feed there's no polling: the graph shifts at most once a day, and the CDN
 * caches it, so one request per load is plenty.
 */
export function useGithubContributions(): GithubContributions | null {
  const [data, setData] = useState<GithubContributions | null>(null)

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        const res = await fetch(GITHUB_STATS_URL, { signal: AbortSignal.timeout(6000) })
        if (!res.ok) return
        const parsed = parseContributions(await res.json())
        if (alive && parsed) setData(parsed)
      } catch {
        // offline, timing out, or no function in dev: leave the heatmap hidden
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  return data
}
