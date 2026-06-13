import { expect } from '@playwright/test'
import { Then } from './fixtures'
import { hero, site } from './content'
import { formatCount } from '../../src/lib/format'

Then('the hero shows the name and eyebrow from the content files', async ({ page }) => {
  await expect(page.locator('.hero-title')).toHaveText(hero.title)
  await expect(page.locator('.hero-eyebrow')).toHaveText(hero.eyebrow)
})

const statNumbers = (page: import('@playwright/test').Page) =>
  page.locator('.hero-stats .stat dd')

Then('the hero stats finish counting to their configured values', async ({ page }) => {
  const dds = statNumbers(page)
  await expect(dds).toHaveCount(hero.stats.length)
  for (let i = 0; i < hero.stats.length; i++) {
    const stat = hero.stats[i]
    if (stat.live) {
      // a live figure settles on whatever production reports; assert it
      // counted up to a real positive number rather than a fixed string
      await expect
        .poll(
          async () => Number(((await dds.nth(i).textContent()) ?? '').replace(/[^\d]/g, '')),
          { timeout: 10_000 },
        )
        .toBeGreaterThan(0)
    } else {
      await expect(dds.nth(i)).toHaveText(formatCount(stat.value, stat.decimals, stat.suffix), {
        timeout: 10_000,
      })
    }
  }
})

Then('the contact email on the page matches site.yaml', async ({ page }) => {
  const link = page.locator('.contact-list a[href^="mailto:"]')
  await expect(link).toHaveAttribute('href', `mailto:${site.identity.email}`)
  await expect(link).toHaveText(site.identity.email)
})

Then('the structured data matches the identity in site.yaml', async ({ page }) => {
  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(raw ?? '{}') as { email?: string; sameAs?: string[] }
  expect(data.email).toBe(`mailto:${site.identity.email}`)
  expect(data.sameAs).toContain(site.identity.github.url)
  expect(data.sameAs).toContain(site.identity.linkedin.url)
})

Then('every resume link on the page points at the same PDF from site.yaml', async ({ page }) => {
  const hrefs = await page
    .locator('a[href$=".pdf"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  // header pill and experience footer — at minimum
  expect(hrefs.length).toBeGreaterThanOrEqual(2)
  for (const href of hrefs) {
    expect(href).toBe(site.identity.resume)
  }
})

Then('the hero stats show their final values without animating', async ({ page }) => {
  // a static stat would not reach its final string this quickly if it were
  // counting up, so a short timeout proves the reduced-motion path rendered
  // it directly. (Live stats arrive via fetch regardless of motion.)
  const dds = statNumbers(page)
  for (let i = 0; i < hero.stats.length; i++) {
    const stat = hero.stats[i]
    if (stat.live) continue
    await expect(dds.nth(i)).toHaveText(formatCount(stat.value, stat.decimals, stat.suffix), {
      timeout: 1500,
    })
  }
})
