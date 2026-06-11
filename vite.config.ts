import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    // three.js is only pulled in by the dynamically imported hero scene,
    // so Rollup already splits it into its own lazily-loaded chunk.
    sourcemap: false,
  },
  server: {
    open: false,
  },
})
