import { test as base, createBdd } from 'playwright-bdd'
import { EMAILJS_ENDPOINT } from '../../src/content/contactFields'

/**
 * Tracks every form submission the page attempts (POSTs to the EmailJS
 * endpoint). Auto-instantiated so the listener is armed before any
 * scenario step runs.
 */
export interface SubmissionLog {
  posts: Array<{ body: string }>
}

export const test = base.extend<{ submissions: SubmissionLog }>({
  submissions: [
    async ({ page }, use) => {
      const log: SubmissionLog = { posts: [] }
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.url() === EMAILJS_ENDPOINT) {
          log.posts.push({ body: request.postData() ?? '' })
        }
      })
      await use(log)
    },
    { auto: true },
  ],
})

export const { Given, When, Then } = createBdd(test)
