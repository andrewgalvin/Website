import { describe, expect, it } from 'vitest'
import { load } from 'js-yaml'
import { CONTENT_SCHEMAS, contactSchema, experienceSchema, heroSchema } from './schema'

// the exact modules the app imports, loaded through the same YAML plugin
const contentModules = import.meta.glob<{ default: unknown }>('./*.yaml', { eager: true })

const validHero = {
  eyebrow: 'e',
  title: 't',
  sub: 's',
  actions: [{ label: 'l', href: '#x', style: 'primary' }],
  stats: [{ value: 1, label: 'l' }],
  asOf: 'now',
}

describe('content schemas', () => {
  describe('every shipped content file is valid', () => {
    for (const file of Object.keys(CONTENT_SCHEMAS) as Array<keyof typeof CONTENT_SCHEMAS>) {
      it(`${file} parses against its schema`, () => {
        const module = contentModules[`./${file}`]
        expect(module, `${file} should exist in src/content`).toBeDefined()
        expect(() => CONTENT_SCHEMAS[file].parse(module.default)).not.toThrow()
      })
    }
  })

  it('has a schema for every YAML file in src/content', () => {
    const yamlFiles = Object.keys(contentModules).map((key) => key.replace('./', ''))
    expect(yamlFiles.sort()).toEqual(Object.keys(CONTENT_SCHEMAS).sort())
  })

  describe('guard rails', () => {
    it('rejects a blank value left behind after an edit', () => {
      // YAML parses a bare `lead:` to null, which must not reach the page
      const result = contactSchema.safeParse({ title: 'Contact', lead: null, blurb: 'b' })
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error.issues[0]?.path).toEqual(['lead'])
    })

    it('rejects an unquoted YAML date, which js-yaml coerces to a Date object', () => {
      const item = load('dates: 2026-04-01') as { dates: unknown }
      expect(item.dates).toBeInstanceOf(Date)

      const result = experienceSchema.safeParse({
        title: 'Experience',
        items: [{ ...item, title: 'Engineer', org: 'Somewhere' }],
        resumeLabel: 'r',
      })
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error.issues[0]?.path).toEqual(['items', 0, 'dates'])
    })

    it('rejects a string where a stat needs a number', () => {
      const result = heroSchema.safeParse({
        ...validHero,
        stats: [{ value: '50M', label: 'requests' }],
      })
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error.issues[0]?.path).toEqual(['stats', 0, 'value'])
    })

    it('rejects a typo’d key outright', () => {
      const result = contactSchema.safeParse({ title: 't', lead: 'l', blurb: 'b', blrub: 'oops' })
      expect(result.success).toBe(false)
    })

    it('accepts a minimal well-formed document', () => {
      expect(heroSchema.safeParse(validHero).success).toBe(true)
    })
  })
})
