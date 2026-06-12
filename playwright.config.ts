import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'features/steps/**/*.ts',
})

export default defineConfig({
  testDir,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4317',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // serves the dist/ that `npm run test:e2e` builds right before this runs
  webServer: {
    command: 'npm run preview -- --port 4317 --strictPort',
    url: 'http://localhost:4317',
    reuseExistingServer: !process.env.CI,
  },
})
