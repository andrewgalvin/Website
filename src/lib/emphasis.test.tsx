import { describe, expect, it } from 'vitest'
import { isValidElement } from 'react'
import type { ReactElement } from 'react'
import { withEmphasis } from './emphasis'

const asParts = (node: ReturnType<typeof withEmphasis>) => node as Array<string | ReactElement<{ children: string }>>

describe('withEmphasis', () => {
  it('leaves text without markers untouched', () => {
    expect(withEmphasis('no markers here')).toEqual(['no markers here'])
  })

  it('wraps a *marked* span in an <em> element', () => {
    const [before, em, after] = asParts(withEmphasis('ships *fast* always'))
    expect(before).toBe('ships ')
    expect(isValidElement(em) && em.type).toBe('em')
    expect(isValidElement(em) && em.props.children).toBe('fast')
    expect(after).toBe(' always')
  })

  it('handles several emphasised spans in one string', () => {
    const parts = asParts(withEmphasis('*scalable systems* and *market monitors*'))
    const emphasised = parts.filter(isValidElement).map((el) => (el as ReactElement<{ children: string }>).props.children)
    expect(emphasised).toEqual(['scalable systems', 'market monitors'])
  })

  it('falls back to the raw string when markers are unbalanced', () => {
    expect(withEmphasis('an odd * marker')).toBe('an odd * marker')
  })
})
