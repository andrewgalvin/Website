/**
 * Contact form → EmailJS, kept from the original site (same service and
 * template, so existing email routing keeps working) but called through the
 * REST endpoint instead of the deprecated SDK. These IDs are EmailJS
 * *publishable* keys — they were always shipped to the browser.
 */
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAILJS_SERVICE_ID = 'service_zen7pkn'
const EMAILJS_TEMPLATE_ID = 'template_dot2nfc'
const EMAILJS_PUBLIC_KEY = 'user_rqdP5rFOtwU0LAcueNtOr'

const FALLBACK_MESSAGE =
  'Something went wrong. Please email me directly at andrew@andrewgalvin.dev.'

export function initContactForm(): void {
  const form = document.getElementById('contact-form')
  if (!(form instanceof HTMLFormElement)) return

  const status = form.querySelector<HTMLElement>('.form-status')
  const submit = form.querySelector<HTMLButtonElement>('.form-submit')
  const readyAt = Date.now()

  const setStatus = (message: string, kind?: 'success' | 'error') => {
    if (!status) return
    status.textContent = message
    status.classList.toggle('is-success', kind === 'success')
    status.classList.toggle('is-error', kind === 'error')
  }

  const requiredFields = ['name', 'email', 'message'] as const
  const labels: Record<(typeof requiredFields)[number], string> = {
    name: 'name',
    email: 'email',
    message: 'message',
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (submit?.hasAttribute('disabled')) return

    const data = new FormData(form)
    const value = (name: string) => String(data.get(name) ?? '').trim()

    // Honeypot, time-gated: only a submission that BOTH filled the hidden
    // field AND arrived implausibly fast is treated as a bot. A password
    // manager autofilling the field on a human's submit sails through, so a
    // real message can never be silently dropped.
    if (value('website') !== '' && Date.now() - readyAt < 3000) {
      form.reset()
      setStatus('Thanks! Your message is on its way.', 'success')
      return
    }

    let firstInvalid: HTMLElement | null = null
    let firstProblem: string | null = null
    for (const name of requiredFields) {
      const field = form.elements.namedItem(name)
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement)) continue
      const missing = value(name) === ''
      const invalid = missing || !field.checkValidity()
      field.classList.toggle('is-invalid', invalid)
      if (invalid) {
        field.setAttribute('aria-invalid', 'true')
      } else {
        field.removeAttribute('aria-invalid')
      }
      if (invalid && !firstProblem) {
        firstInvalid = field
        firstProblem = missing
          ? `Please fill in your ${labels[name]}.`
          : `Please enter a valid ${labels[name]}.`
      }
    }
    if (firstProblem) {
      setStatus(firstProblem, 'error')
      firstInvalid?.focus()
      return
    }

    submit?.setAttribute('disabled', '')
    setStatus('Sending…')

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
          template_params: {
            name: value('name'),
            email: value('email'),
            companyName: value('companyName'),
            subject: value('subject') || 'Portfolio contact',
            message: value('message'),
          },
        }),
      })
      if (!res.ok) throw new Error(`EmailJS responded ${res.status}`)
      form.reset()
      setStatus("Thanks! Your message is on its way. I'll get back to you soon.", 'success')
    } catch {
      setStatus(FALLBACK_MESSAGE, 'error')
    } finally {
      submit?.removeAttribute('disabled')
    }
  })

  // clear the error state as soon as the visitor starts fixing a field
  form.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      e.target.classList.remove('is-invalid')
      e.target.removeAttribute('aria-invalid')
    }
  })
}
