import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins class names with single spaces', () => {
    expect(cx('button', 'button-primary')).toBe('button button-primary')
  })

  it('drops false and undefined parts', () => {
    expect(cx('form-status', false, undefined)).toBe('form-status')
  })

  it('keeps conditional modifiers when their condition holds', () => {
    const open = true
    expect(cx('nav-menu', open && 'is-open')).toBe('nav-menu is-open')
  })
})
