import { expect } from '@playwright/test'
import { Then, When } from './fixtures'

When('I click the {string} link in the header', async ({ page }, label: string) => {
  await page.locator('.nav-links').getByRole('link', { name: label }).click()
})

Then('the {word} section is scrolled into view', async ({ page }, section: string) => {
  await expect(page.locator(`#${section}`)).toBeInViewport()
})

Then('the {string} nav link is highlighted as active', async ({ page }, label: string) => {
  await expect(page.locator('.nav-links').getByRole('link', { name: label })).toHaveClass(/is-active/)
})

When('I open the menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Menu' }).click()
})

Then('the menu button reads {string} and reports expanded', async ({ page }, text: string) => {
  const toggle = page.locator('.nav-toggle')
  await expect(toggle).toHaveText(text)
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
})

Then('focus moves to the first link in the menu', async ({ page }) => {
  await expect(page.locator('#site-menu a').first()).toBeFocused()
})

When('I press Escape', async ({ page }) => {
  await page.keyboard.press('Escape')
})

Then('the menu closes and focus returns to the menu button', async ({ page }) => {
  await expect(page.locator('#site-menu')).not.toHaveClass(/is-open/)
  await expect(page.locator('.nav-toggle')).toBeFocused()
})

When('I click the {string} link in the menu', async ({ page }, label: string) => {
  await page.locator('#site-menu').getByRole('link', { name: label }).click()
})

Then('the menu is closed', async ({ page }) => {
  await expect(page.locator('#site-menu')).not.toHaveClass(/is-open/)
  await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false')
})
