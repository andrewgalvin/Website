import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  plugins: [yaml()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
