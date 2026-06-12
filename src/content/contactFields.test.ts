import { describe, expect, it } from 'vitest'
import { CONTACT_FORM_FIELDS, CONTACT_FORM_NAME } from './contactFields'

/**
 * This list is the wire contract between ContactForm.tsx (what the site
 * posts) and the hidden registration form vite.config.ts generates into
 * index.html (what Netlify provisions). These tests pin its invariants.
 */
describe('contact form wire format', () => {
  it('names the form "contact"', () => {
    expect(CONTACT_FORM_NAME).toBe('contact')
  })

  it('declares exactly one honeypot field, called website', () => {
    const honeypots = CONTACT_FORM_FIELDS.filter((field) => field.honeypot)
    expect(honeypots.map((field) => field.name)).toEqual(['website'])
  })

  it('keeps field names unique', () => {
    const names = CONTACT_FORM_FIELDS.map((field) => field.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('carries every field the form validates as required', () => {
    const names = CONTACT_FORM_FIELDS.map((field) => field.name)
    for (const required of ['name', 'email', 'message']) {
      expect(names).toContain(required)
    }
  })

  it('only uses input types the generated registration form can render', () => {
    for (const field of CONTACT_FORM_FIELDS) {
      expect(['text', 'email', 'textarea']).toContain(field.type)
    }
  })
})
