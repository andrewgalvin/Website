import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
