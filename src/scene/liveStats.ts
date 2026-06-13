/**
 * The contract for the eSnipe portfolio-stats feed and the guard that
 * decides whether a payload is trustworthy enough to put on screen. Kept
 * free of Three.js so the validation path — the gate between "show
 * production truth" and "fall back to the simulation" — is unit-testable
 * on its own.
 */

/** public aggregate stats from eSnipe production (counts only, 10s cache) */
export const STATS_URL = 'https://xdpizcaopjvulpoyyxum.supabase.co/functions/v1/portfolio-stats'
export const STATS_REFRESH_MS = 10_000

export interface LiveStats {
  /** distinct registered accounts (null if the endpoint omits it) */
  registeredUsers: number | null
  /** distinct users with an active subscription */
  activeUsers: number | null
  /** distinct active search definitions */
  activeSearches: number
  /** searches with an active subscriber: the set actually polled, and the
   *  denominator the on-schedule SLO is measured against (null if omitted) */
  monitoredSearches: number | null
  /** new listings discovered in the trailing hour (fleet-wide) */
  findsLastHour: number
  /** seconds since the most recent find — the freshness heartbeat */
  secondsSinceLastFind: number | null
  /** % of monitored (subscribed) searches polled within cadence (an operated SLO) */
  pollOnSchedulePct: number | null
}

const finiteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/**
 * Validate a portfolio-stats response into LiveStats, or null when it is
 * unusable so the console keeps simulating. The two counts are required;
 * freshness is optional and accepts the `secondsSinceLastPoll` alias the
 * first version of the endpoint shipped.
 */
export function parseLiveStats(data: unknown): LiveStats | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  if (!finiteNumber(d.activeSearches) || !finiteNumber(d.findsLastHour)) return null

  const freshRaw = finiteNumber(d.secondsSinceLastFind)
    ? d.secondsSinceLastFind
    : finiteNumber(d.secondsSinceLastPoll)
      ? d.secondsSinceLastPoll
      : null

  const pct = finiteNumber(d.pollOnSchedulePct) ? d.pollOnSchedulePct : null

  return {
    registeredUsers: finiteNumber(d.registeredUsers) ? Math.max(0, Math.round(d.registeredUsers)) : null,
    activeUsers: finiteNumber(d.activeUsers) ? Math.max(0, Math.round(d.activeUsers)) : null,
    activeSearches: d.activeSearches,
    monitoredSearches: finiteNumber(d.monitoredSearches)
      ? Math.max(0, Math.round(d.monitoredSearches))
      : null,
    findsLastHour: d.findsLastHour,
    secondsSinceLastFind: freshRaw !== null ? Math.max(0, freshRaw) : null,
    pollOnSchedulePct: pct !== null ? Math.max(0, Math.min(100, Math.round(pct))) : null,
  }
}

/**
 * Searches actually being polled (those with an active subscriber): the count
 * the on-schedule SLO is measured against, and what "monitored" should mean on
 * screen. Falls back to the active-definition count if the endpoint predates
 * the field, so the display degrades to the old behavior rather than blanking.
 */
export const monitoredCount = (s: LiveStats): number =>
  s.monitoredSearches ?? s.activeSearches
