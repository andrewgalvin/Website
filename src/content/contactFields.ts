/**
 * Single source for the contact form's wire format. ContactForm.tsx builds
 * its EmailJS payload from this list, and the BDD steps assert against the
 * same constants, so code and tests can't drift. The IDs are EmailJS
 * *publishable* values; they were always shipped to the browser.
 *
 * Delivery configuration (To, From Name, subject prefix, Reply-To) lives in
 * the EmailJS template; emails go to identity.email in site.yaml.
 */

export const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
export const EMAILJS_SERVICE_ID = 'service_zen7pkn'
export const EMAILJS_TEMPLATE_ID = 'template_dot2nfc'
export const EMAILJS_PUBLIC_KEY = 'user_rqdP5rFOtwU0LAcueNtOr'

export interface ContactFormField {
  name: string
  /** Hidden bot trap: filled fast, the submit is silently swallowed client-side. */
  honeypot?: boolean
}

/** Fields the form collects; non-honeypot names become template_params. */
export const CONTACT_FORM_FIELDS: readonly ContactFormField[] = [
  { name: 'name' },
  { name: 'email' },
  { name: 'companyName' },
  { name: 'subject' },
  { name: 'message' },
  { name: 'website', honeypot: true },
]
