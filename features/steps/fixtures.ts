import { test as base, createBdd } from 'playwright-bdd'

/**
 * Tracks every form submission the page attempts (POSTs to "/", which is
 * where Netlify Forms listens). Auto-instantiated so the listener is armed
 * before any scenario step runs.
 */
export interface SubmissionLog {
  posts: Array<{ body: string }>
}

export const test = base.extend<{ submissions: SubmissionLog }>({
  submissions: [
    async ({ page }, use) => {
      const log: SubmissionLog = { posts: [] }
      page.on('request', (request) => {
        if (request.method() === 'POST' && new URL(request.url()).pathname === '/') {
          log.posts.push({ body: request.postData() ?? '' })
        }
      })
      await use(log)
    },
    { auto: true },
  ],
})

export const { Given, When, Then } = createBdd(test)
