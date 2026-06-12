import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { Given, Then, When } from './fixtures'
import { site } from './content'
import {
  CONTACT_FORM_FIELDS,
  EMAILJS_ENDPOINT,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from '../../src/content/contactFields'

const fillValidForm = async (page: Page) => {
  await page.locator('#cf-name').fill('Playwright Visitor')
  await page.locator('#cf-email').fill('visitor@example.com')
  await page.locator('#cf-message').fill('Hello from the BDD suite.')
}

const submit = async (page: Page) => {
  await page.locator('.contact-form .form-submit').click()
}

/* ---- endpoint doubles: never let a test hit the real EmailJS quota ---- */

Given('the form endpoint will accept the submission', async ({ page }) => {
  await page.route(EMAILJS_ENDPOINT, (route) => route.fulfill({ status: 200, body: 'OK' }))
})

Given('the form endpoint is unavailable', async ({ page }) => {
  await page.route(EMAILJS_ENDPOINT, (route) => route.fulfill({ status: 503, body: '' }))
})

/* ---- actions ---- */

When('I submit the contact form without filling anything', async ({ page }) => {
  await submit(page)
})

When('I submit the contact form', async ({ page }) => {
  await submit(page)
})

When('I start typing my name', async ({ page }) => {
  await page.locator('#cf-name').fill('A')
})

When('I fill the form but mistype the email address', async ({ page }) => {
  await page.locator('#cf-name').fill('Playwright Visitor')
  await page.locator('#cf-email').fill('not-an-email')
  await page.locator('#cf-message').fill('Hello from the BDD suite.')
})

When('I fill in a valid message and submit', async ({ page }) => {
  await fillValidForm(page)
  await submit(page)
})

When(
  'a bot fills every field including the hidden one and submits immediately',
  async ({ page }) => {
    // fresh load so the scripted submit lands inside the form's bot window;
    // the honeypot input is hidden from people, so it is set via script,
    // exactly the way naive bots do it
    await page.goto('/')
    await page.evaluate(() => {
      const set = (selector: string, value: string) => {
        const el = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement
        const proto =
          el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
        Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
      set('#cf-name', 'Spam Bot')
      set('#cf-email', 'bot@spam.example')
      set('#cf-message', 'Limited time offer')
      set('#cf-website', 'https://spam.example')
      ;(document.querySelector('.contact-form') as HTMLFormElement).requestSubmit()
    })
  },
)

/* ---- outcomes ---- */

Then('I see the form message {string}', async ({ page }, message: string) => {
  await expect(page.locator('.form-status')).toHaveText(message)
})

Then('the name field is marked invalid and focused', async ({ page }) => {
  const name = page.locator('#cf-name')
  await expect(name).toHaveClass(/is-invalid/)
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(name).toBeFocused()
})

Then('the name field is no longer marked invalid', async ({ page }) => {
  const name = page.locator('#cf-name')
  await expect(name).not.toHaveClass(/is-invalid/)
  await expect(name).not.toHaveAttribute('aria-invalid')
})

Then('I see a thank-you confirmation', async ({ page }) => {
  const status = page.locator('.form-status')
  await expect(status).toHaveText("Thanks! Your message is on its way. I'll get back to you soon.")
  await expect(status).toHaveClass(/is-success/)
})

Then('the submission was posted with the registered field names', async ({ submissions }) => {
  expect(submissions.posts).toHaveLength(1)
  const payload = JSON.parse(submissions.posts[0].body) as {
    service_id?: string
    template_id?: string
    user_id?: string
    template_params?: Record<string, string>
  }
  expect(payload.service_id).toBe(EMAILJS_SERVICE_ID)
  expect(payload.template_id).toBe(EMAILJS_TEMPLATE_ID)
  expect(payload.user_id).toBe(EMAILJS_PUBLIC_KEY)
  for (const field of CONTACT_FORM_FIELDS.filter((f) => !f.honeypot)) {
    expect(payload.template_params, `field "${field.name}" missing from payload`).toHaveProperty(
      field.name,
    )
  }
  // the honeypot is a client-side decision and never reaches the wire
  expect(payload.template_params).not.toHaveProperty('website')
})

Then("I see an apology that includes Andrew's direct email address", async ({ page }) => {
  const status = page.locator('.form-status')
  await expect(status).toContainText(site.identity.email)
  await expect(status).toHaveClass(/is-error/)
})

Then('the form pretends the message was sent', async ({ page }) => {
  const status = page.locator('.form-status')
  // exactly the short decoy text — the real success message is longer
  await expect(status).toHaveText('Thanks! Your message is on its way.')
  await expect(status).toHaveClass(/is-success/)
})

Then('no submission was sent', async ({ submissions }) => {
  expect(submissions.posts).toHaveLength(0)
})
