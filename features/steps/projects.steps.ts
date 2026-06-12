import { expect } from '@playwright/test'
import { Then } from './fixtures'
import { projects } from './content'

Then('each featured project from projects.yaml appears with its title and tags', async ({ page }) => {
  for (const project of projects.featured) {
    const article = page
      .locator('article.featured')
      .filter({ has: page.getByRole('heading', { name: project.title, exact: true }) })
    await article.scrollIntoViewIfNeeded()
    await expect(article).toBeVisible()

    const tags = await article.locator('.featured-tags li').allTextContents()
    for (const tag of project.tags) {
      expect(tags).toContain(tag)
    }
  }
})

Then('each archive entry from projects.yaml appears with its link or badge', async ({ page }) => {
  for (const entry of projects.archive) {
    const item = page
      .locator('.archive-item')
      .filter({ has: page.getByRole('heading', { name: entry.title, exact: true }) })
    await item.scrollIntoViewIfNeeded()
    await expect(item).toBeVisible()

    if (entry.link) {
      await expect(item.getByRole('link', { name: entry.link.label })).toHaveAttribute(
        'href',
        entry.link.href,
      )
    }
    if (entry.note) {
      await expect(item.locator('.archive-private')).toHaveText(entry.note)
    }
  }
})

Then(
  'every external link in the projects section opens a new tab without leaking the opener',
  async ({ page }) => {
    const links = page.locator('#projects a[href^="http"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  },
)
