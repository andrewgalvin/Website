/**
 * The contract for the GitHub contribution calendar and the guard that
 * decides whether a payload is trustworthy enough to render. The feed comes
 * from our own /api/github-contributions function (which holds the token), so
 * this only ever sees counts — never repo names. Kept dependency-free so the
 * validation path stays unit-testable on its own, same as liveStats.ts.
 */

/** our serverless proxy; same-origin, so no token or CORS in the browser */
export const GITHUB_STATS_URL = '/api/github-contributions'

/** 0 (no activity) … 4 (top quartile), GitHub's own bucketing */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, YYYY-MM-DD */
  date: string
  /** contributions on that day (public + private counts, never itemized) */
  count: number
  level: ContributionLevel
}

export interface GithubContributions {
  /** total contributions across the calendar window (trailing ~year) */
  total: number
  /** columns, oldest first; each a run of days, Sunday-first */
  weeks: ContributionDay[][]
}

const finiteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const clampLevel = (value: unknown): ContributionLevel => {
  if (!finiteNumber(value)) return 0
  return Math.min(4, Math.max(0, Math.round(value))) as ContributionLevel
}

const parseDay = (value: unknown): ContributionDay | null => {
  if (typeof value !== 'object' || value === null) return null
  const d = value as Record<string, unknown>
  if (typeof d.date !== 'string' || !d.date) return null
  if (!finiteNumber(d.count)) return null
  return { date: d.date, count: Math.max(0, Math.round(d.count)), level: clampLevel(d.level) }
}

/**
 * Validate a contributions response into GithubContributions, or null when it
 * is unusable so the heatmap stays hidden rather than rendering a broken grid.
 * `total` is required; malformed days are dropped and empty weeks pruned, so a
 * partially bad payload degrades instead of throwing.
 */
export function parseContributions(data: unknown): GithubContributions | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  if (!finiteNumber(d.total) || !Array.isArray(d.weeks)) return null

  const weeks = d.weeks
    .map((week) => (Array.isArray(week) ? week.map(parseDay).filter((x): x is ContributionDay => x !== null) : []))
    .filter((week) => week.length > 0)

  if (weeks.length === 0) return null
  return { total: Math.max(0, Math.round(d.total)), weeks }
}

/** Sunday=0 … Saturday=6, from the ISO date, for grid-row placement. */
export const weekdayOf = (isoDate: string): number => new Date(`${isoDate}T00:00:00Z`).getUTCDay()
