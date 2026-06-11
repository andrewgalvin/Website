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
  'Something went wrong — please email me directly at andrewggalvin@gmail.com.'

export function initContactForm(): void {
  const form = document.getElementById('contact-form')
  if (!(form instanceof HTMLFormElement)) return

  const status = form.querySelector<HTMLElement>('.form-status')
  const submit = form.querySelector<HTMLButtonElement>('.form-submit')

  const setStatus = (message: string, kind?: 'success' | 'error') => {
    if (!status) return
    status.textContent = message
    status.classList.toggle('is-success', kind === 'success')
    status.classList.toggle('is-error', kind === 'error')
  }

  const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'] as const
  const labels: Record<(typeof requiredFields)[number], string> = {
    firstName: 'first name',
    lastName: 'last name',
    email: 'email',
    subject: 'subject',
    message: 'message',
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const value = (name: string) => String(data.get(name) ?? '').trim()

    // honeypot: bots fill it, humans can't see it — quietly drop the message
    if (value('website') !== '') {
      form.reset()
      setStatus('Thanks — your message is on its way!', 'success')
      return
    }

    let firstProblem: string | null = null
    for (const name of requiredFields) {
      const field = form.elements.namedItem(name)
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement)) continue
      const missing = value(name) === ''
      const invalid = missing || !field.checkValidity()
      field.classList.toggle('is-invalid', invalid)
      if (invalid && !firstProblem) {
        firstProblem = missing
          ? `Please fill in your ${labels[name]}.`
          : `Please enter a valid ${labels[name]}.`
      }
    }
    if (firstProblem) {
      setStatus(firstProblem, 'error')
      return
    }

    submit?.setAttribute('disabled', '')
    setStatus('Sending…')

    try {
      const res = await fetch(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            name: `${value('firstName')} ${value('lastName')}`,
            email: value('email'),
            companyName: value('companyName'),
            subject: value('subject'),
            message: value('message'),
          },
        }),
      })
      if (!res.ok) throw new Error(`EmailJS responded ${res.status}`)
      form.reset()
      setStatus("Thanks — your message is on its way. I'll get back to you soon!", 'success')
    } catch {
      setStatus(FALLBACK_MESSAGE, 'error')
    } finally {
      submit?.removeAttribute('disabled')
    }
  })

  // clear the error highlight as soon as the visitor starts fixing a field
  form.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      e.target.classList.remove('is-invalid')
    }
  })
}
