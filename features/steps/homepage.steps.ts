import { expect } from '@playwright/test'
import { Then } from './fixtures'
import { hero, site } from './content'
import { formatCount } from '../../src/lib/format'

Then('the hero shows the name and eyebrow from the content files', async ({ page }) => {
  await expect(page.locator('.hero-title')).toHaveText(hero.title)
  await expect(page.locator('.hero-eyebrow')).toHaveText(hero.eyebrow)
})

Then('the hero stats finish counting to their configured values', async ({ page }) => {
  for (const stat of hero.stats) {
    await expect(page.locator(`[data-count="${stat.value}"]`)).toHaveText(
      formatCount(stat.value, stat.decimals, stat.suffix),
      { timeout: 10_000 },
    )
  }
})

Then('the contact email on the page matches site.yaml', async ({ page }) => {
  const link = page.locator('.contact-list a[href^="mailto:"]')
  await expect(link).toHaveAttribute('href', `mailto:${site.identity.email}`)
  await expect(link).toHaveText(site.identity.email)
})

Then('the structured data matches the identity in site.yaml', async ({ page }) => {
  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(raw ?? '{}') as { email?: string; telephone?: string; sameAs?: string[] }
  expect(data.email).toBe(`mailto:${site.identity.email}`)
  expect(data.telephone).toBe(site.identity.phone.e164)
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
  // the count-up animation would not reach the final string this quickly,
  // so a short timeout proves the reduced-motion path rendered it directly
  for (const stat of hero.stats) {
    await expect(page.locator(`[data-count="${stat.value}"]`)).toHaveText(
      formatCount(stat.value, stat.decimals, stat.suffix),
      { timeout: 1500 },
    )
  }
})
