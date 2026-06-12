import { describe, expect, it } from 'vitest'
import { formatCount } from './format'

describe('formatCount', () => {
  it('renders a plain integer count', () => {
    expect(formatCount(194)).toBe('194')
  })

  it('appends the suffix directly to the number', () => {
    expect(formatCount(50, undefined, 'M')).toBe('50M')
  })

  it('honors a fixed number of decimals', () => {
    expect(formatCount(4.2, 1)).toBe('4.2')
    expect(formatCount(4, 1, '%')).toBe('4.0%')
  })

  it('rounds animation midpoints the same way as final values', () => {
    // animations.ts feeds interpolated values through this exact function,
    // so the count-up must land on the same string the page first rendered
    expect(formatCount(12.345, 0, 'M')).toBe('12M')
    expect(formatCount(49.999, 0, 'M')).toBe('50M')
  })
})
