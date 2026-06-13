/**
 * The contract for the eSnipe portfolio-stats feed and the guard that
 * decides whether a payload is trustworthy enough to put on screen. Kept
 * free of Three.js so the validation path — the gate between "show
 * production truth" and "fall back to the simulation" — is unit-testable
 * on its own.
 */

export interface LiveStats {
  /** distinct active search definitions being monitored */
  activeSearches: number
  /** new listings discovered in the trailing hour (fleet-wide) */
  findsLastHour: number
  /** seconds since the most recent find — the freshness heartbeat */
  secondsSinceLastFind: number | null
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

  return {
    activeSearches: d.activeSearches,
    findsLastHour: d.findsLastHour,
    secondsSinceLastFind: freshRaw !== null ? Math.max(0, freshRaw) : null,
  }
}
