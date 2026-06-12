import { describe, expect, it } from 'vitest'
import {
  CONTACT_FORM_FIELDS,
  EMAILJS_ENDPOINT,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from './contactFields'

/**
 * This list is the wire contract between ContactForm.tsx (what the site
 * posts to EmailJS) and the BDD scenarios that assert the payload. These
 * tests pin its invariants.
 */
describe('contact form wire format', () => {
  it('points at the EmailJS REST endpoint over https', () => {
    expect(EMAILJS_ENDPOINT).toMatch(/^https:\/\/api\.emailjs\.com\//)
  })

  it('carries non-empty publishable identifiers', () => {
    for (const id of [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY]) {
      expect(id.length).toBeGreaterThan(0)
    }
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
})
