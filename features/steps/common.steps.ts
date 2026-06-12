import { expect } from '@playwright/test'
import { Given, Then } from './fixtures'

Given('I open the homepage', async ({ page }) => {
  await page.goto('/')
})

Given('I prefer reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

Given('I open the homepage on a phone-sized screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
})

// Content scenarios run motion-free via the site's own reduced-motion
// support: scroll reveals never hide anything, so below-fold elements are
// actionable immediately. Motion-specific scenarios keep animations on.
Given('I open the homepage with animations off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
})

Then('the page title contains {string}', async ({ page }, text: string) => {
  await expect(page).toHaveTitle(new RegExp(text))
})
