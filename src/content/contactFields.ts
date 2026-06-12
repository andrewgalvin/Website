/**
 * Single source for the contact form's wire format. ContactForm.tsx builds
 * its POST body from this list, and vite.config.ts generates the hidden
 * Netlify registration form in index.html from it — so the fields Netlify
 * provisions at deploy time can never drift from what the site posts.
 * (Plain TS on purpose: imported by both browser and build code.)
 */

export const CONTACT_FORM_NAME = 'contact'

export interface ContactFormField {
  name: string
  type: 'text' | 'email' | 'textarea'
  honeypot?: boolean
}

export const CONTACT_FORM_FIELDS: readonly ContactFormField[] = [
  { name: 'name', type: 'text' },
  { name: 'email', type: 'email' },
  { name: 'companyName', type: 'text' },
  { name: 'subject', type: 'text' },
  { name: 'message', type: 'textarea' },
  { name: 'website', type: 'text', honeypot: true },
]
