import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { SITE } from '@/content'
import {
  CONTACT_FORM_FIELDS,
  EMAILJS_ENDPOINT,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from '@/content/contactFields'
import { cx } from '@/lib/cx'

/**
 * Contact form → EmailJS REST. The service sends from the Google Workspace
 * account behind identity.email; the template brands the subject with
 * [andrewgalvin.net] and sets Reply-To to the visitor. Reconnected and
 * rebranded June 2026 after the original Gmail OAuth grant expired.
 */

const REQUIRED_FIELDS = ['name', 'email', 'message'] as const
type RequiredField = (typeof REQUIRED_FIELDS)[number]

interface Status {
  message: string
  kind?: 'success' | 'error'
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ message: '' })
  const [sending, setSending] = useState(false)
  const [invalid, setInvalid] = useState<ReadonlySet<RequiredField>>(new Set())
  const readyAtRef = useRef(Date.now())

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return

    const form = e.currentTarget
    const data = new FormData(form)
    const value = (name: string) => String(data.get(name) ?? '').trim()

    // Honeypot, time-gated: only a submission that BOTH filled the hidden
    // field AND arrived implausibly fast is treated as a bot. A password
    // manager autofilling the field on a human's submit sails through, so a
    // real message can never be silently dropped.
    if (value('website') !== '' && Date.now() - readyAtRef.current < 3000) {
      form.reset()
      setStatus({ message: 'Thanks! Your message is on its way.', kind: 'success' })
      return
    }

    let firstInvalid: HTMLElement | null = null
    let firstProblem: string | null = null
    const nextInvalid = new Set<RequiredField>()
    for (const name of REQUIRED_FIELDS) {
      const field = form.elements.namedItem(name)
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement)) continue
      const missing = value(name) === ''
      if (missing || !field.checkValidity()) {
        nextInvalid.add(name)
        if (!firstProblem) {
          firstInvalid = field
          firstProblem = missing
            ? `Please fill in your ${name}.`
            : `Please enter a valid ${name}.`
        }
      }
    }
    setInvalid(nextInvalid)
    if (firstProblem) {
      setStatus({ message: firstProblem, kind: 'error' })
      firstInvalid?.focus()
      return
    }

    setSending(true)
    setStatus({ message: 'Sending…' })

    try {
      const res = await fetch(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // a hung connection should fail visibly, not spin forever
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          // params come from contactFields.ts — the same list the tests
          // assert against — so form and template can't drift silently
          template_params: {
            ...Object.fromEntries(
              CONTACT_FORM_FIELDS.filter((field) => !field.honeypot).map(({ name }) => [
                name,
                value(name),
              ]),
            ),
            subject: value('subject') || 'Portfolio contact',
          },
        }),
      })
      if (!res.ok) throw new Error(`EmailJS responded ${res.status}`)
      form.reset()
      setStatus({ message: "Thanks! Your message is on its way. I'll get back to you soon.", kind: 'success' })
    } catch {
      setStatus({
        message: `Something went wrong. Please email me directly at ${SITE.identity.email}.`,
        kind: 'error',
      })
    } finally {
      setSending(false)
    }
  }

  // clear the error state as soon as the visitor starts fixing a field
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return
    const name = target.name as RequiredField
    if (!invalid.has(name)) return
    const next = new Set(invalid)
    next.delete(name)
    setInvalid(next)
  }

  const fieldProps = (name: RequiredField) => ({
    className: invalid.has(name) ? 'is-invalid' : undefined,
    'aria-invalid': invalid.has(name) || undefined,
  })

  const statusClass = cx(
    'form-status',
    status.kind === 'success' && 'is-success',
    status.kind === 'error' && 'is-error',
  )

  return (
    <form
      className="contact-form"
      data-reveal
      noValidate
      aria-label="Send a message"
      onSubmit={onSubmit}
      onInput={onInput}
    >
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required {...fieldProps('name')} />
        </div>
        <div className="form-field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required {...fieldProps('email')} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="cf-company">
          Company <span className="optional">(optional)</span>
        </label>
        <input id="cf-company" name="companyName" type="text" autoComplete="organization" />
      </div>

      <div className="form-field">
        <label htmlFor="cf-subject">
          Subject <span className="optional">(optional)</span>
        </label>
        <input id="cf-subject" name="subject" type="text" />
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required {...fieldProps('message')} />
      </div>

      <div className="form-field hp-field" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="button button-primary form-submit" type="submit" disabled={sending}>
        Send message
      </button>
      <p className={statusClass} role="status" aria-live="polite">{status.message}</p>
    </form>
  )
}
