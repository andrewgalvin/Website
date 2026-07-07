import { describe, expect, it } from 'vitest'
import { parseContributions, weekdayOf } from './githubStats'

const day = (over: Record<string, unknown> = {}) => ({ date: '2026-01-05', count: 3, level: 2, ...over })

/**
 * The heatmap either renders trustworthy counts or renders nothing; these pin
 * that gate, and the drop-the-bad-day-but-keep-the-payload degradation.
 */
describe('parseContributions', () => {
  it('accepts a well-formed calendar', () => {
    const parsed = parseContributions({ total: 5, weeks: [[day(), day({ date: '2026-01-06', count: 0, level: 0 })]] })
    expect(parsed).toEqual({
      total: 5,
      weeks: [[
        { date: '2026-01-05', count: 3, level: 2 },
        { date: '2026-01-06', count: 0, level: 0 },
      ]],
    })
  })

  it('rounds and clamps count and level into range', () => {
    const parsed = parseContributions({ total: 2, weeks: [[day({ count: -4, level: 9 })]] })
    expect(parsed?.weeks[0][0]).toEqual({ date: '2026-01-05', count: 0, level: 4 })
  })

  it('defaults a missing or non-finite level to 0', () => {
    expect(parseContributions({ total: 1, weeks: [[day({ level: undefined })]] })?.weeks[0][0].level).toBe(0)
    expect(parseContributions({ total: 1, weeks: [[day({ level: 'x' })]] })?.weeks[0][0].level).toBe(0)
  })

  it('drops malformed days and prunes the emptied week', () => {
    const parsed = parseContributions({
      total: 4,
      weeks: [[day(), { date: '', count: 1 }, { count: 2 }], [{ nope: true }]],
    })
    expect(parsed?.weeks).toHaveLength(1)
    expect(parsed?.weeks[0]).toHaveLength(1)
  })

  it('falls back (null) when total is missing or not finite', () => {
    expect(parseContributions({ weeks: [[day()]] })).toBeNull()
    expect(parseContributions({ total: Number.NaN, weeks: [[day()]] })).toBeNull()
  })

  it('falls back when weeks is absent or every day is unusable', () => {
    expect(parseContributions({ total: 3 })).toBeNull()
    expect(parseContributions({ total: 3, weeks: [] })).toBeNull()
    expect(parseContributions({ total: 3, weeks: [[{ bad: 1 }]] })).toBeNull()
  })

  it('falls back on an error payload or non-object', () => {
    expect(parseContributions({ error: 'GITHUB_TOKEN not configured' })).toBeNull()
    expect(parseContributions(null)).toBeNull()
    expect(parseContributions('nope')).toBeNull()
  })
})

describe('weekdayOf', () => {
  it('maps ISO dates to Sunday=0 … Saturday=6', () => {
    expect(weekdayOf('2026-01-04')).toBe(0) // Sunday
    expect(weekdayOf('2026-01-05')).toBe(1) // Monday
    expect(weekdayOf('2026-01-10')).toBe(6) // Saturday
  })
})
