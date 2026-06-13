import { describe, expect, it } from 'vitest'
import { parseLiveStats } from './liveStats'

/**
 * The console's best engineering artifact is its degrade-to-simulation
 * path: only a trustworthy payload flips it to "live", everything else
 * keeps the seat warm. These pin that gate.
 */
describe('parseLiveStats', () => {
  it('accepts a well-formed live payload', () => {
    expect(
      parseLiveStats({
        activeSearches: 286,
        findsLastHour: 6190,
        secondsSinceLastFind: 4,
        pollOnSchedulePct: 93,
      }),
    ).toEqual({
      activeSearches: 286,
      findsLastHour: 6190,
      secondsSinceLastFind: 4,
      pollOnSchedulePct: 93,
    })
  })

  it('defaults pollOnSchedulePct to null and clamps it to 0..100', () => {
    expect(parseLiveStats({ activeSearches: 1, findsLastHour: 2 })?.pollOnSchedulePct).toBeNull()
    expect(
      parseLiveStats({ activeSearches: 1, findsLastHour: 2, pollOnSchedulePct: 140 })
        ?.pollOnSchedulePct,
    ).toBe(100)
  })

  it('honors the secondsSinceLastPoll alias from the first endpoint', () => {
    const stats = parseLiveStats({ activeSearches: 1, findsLastHour: 2, secondsSinceLastPoll: 9 })
    expect(stats?.secondsSinceLastFind).toBe(9)
  })

  it('prefers secondsSinceLastFind over the alias when both are present', () => {
    const stats = parseLiveStats({
      activeSearches: 1,
      findsLastHour: 2,
      secondsSinceLastFind: 3,
      secondsSinceLastPoll: 99,
    })
    expect(stats?.secondsSinceLastFind).toBe(3)
  })

  it('allows a null freshness (missing or non-numeric)', () => {
    expect(parseLiveStats({ activeSearches: 1, findsLastHour: 2 })?.secondsSinceLastFind).toBeNull()
    expect(
      parseLiveStats({ activeSearches: 1, findsLastHour: 2, secondsSinceLastFind: null })
        ?.secondsSinceLastFind,
    ).toBeNull()
  })

  it('clamps a negative freshness to zero', () => {
    expect(
      parseLiveStats({ activeSearches: 1, findsLastHour: 2, secondsSinceLastFind: -5 })
        ?.secondsSinceLastFind,
    ).toBe(0)
  })

  it('falls back (null) when a required count is missing', () => {
    expect(parseLiveStats({ activeSearches: 1 })).toBeNull()
    expect(parseLiveStats({ findsLastHour: 2 })).toBeNull()
  })

  it('falls back when a count is the wrong type or not finite', () => {
    expect(parseLiveStats({ activeSearches: '286', findsLastHour: 6190 })).toBeNull()
    expect(parseLiveStats({ activeSearches: Number.NaN, findsLastHour: 2 })).toBeNull()
    expect(parseLiveStats({ activeSearches: 1, findsLastHour: Infinity })).toBeNull()
  })

  it('falls back on an error payload or non-object', () => {
    expect(parseLiveStats({ error: 'stats unavailable' })).toBeNull()
    expect(parseLiveStats(null)).toBeNull()
    expect(parseLiveStats(undefined)).toBeNull()
    expect(parseLiveStats('nope')).toBeNull()
    expect(parseLiveStats(42)).toBeNull()
  })
})
