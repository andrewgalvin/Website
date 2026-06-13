import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { load } from 'js-yaml'
import { ZodError } from 'zod'
import { CONTENT_SCHEMAS, siteSchema } from './src/content/schema'

const contentDir = fileURLToPath(new URL('./src/content', import.meta.url))

const loadYaml = (file: string): unknown => load(readFileSync(join(contentDir, file), 'utf8'))

/**
 * Parse every content file against its schema (src/content/schema.ts), so a
 * missing field, wrong type, blank value, unquoted date, or typo'd key fails
 * the build naming the file and path — instead of rendering blank or
 * crashing the page at runtime.
 */
function contentValidation(): Plugin {
  return {
    name: 'content-validation',
    buildStart() {
      const problems: string[] = []
      for (const [file, schema] of Object.entries(CONTENT_SCHEMAS)) {
        try {
          schema.parse(loadYaml(file))
        } catch (err) {
          if (!(err instanceof ZodError)) throw err
          for (const issue of err.issues) {
            problems.push(`${file}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
          }
        }
      }
      if (problems.length > 0) {
        throw new Error(`Content validation failed:\n  ${problems.join('\n  ')}`)
      }
    },
  }
}

/**
 * index.html is templated from the same source the app uses: %IDENTITY_*%
 * tokens fill from site.yaml (JSON-LD, noscript), so identity lives once.
 * Any token left unreplaced fails the build (Vite alone only warns).
 */
function htmlTemplate(): Plugin {
  return {
    name: 'html-template',
    transformIndexHtml: {
      order: 'pre', // run before Vite's own %ENV% substitution
      handler(html) {
        const { identity } = siteSchema.parse(loadYaml('site.yaml'))

        const out = html
          .replaceAll('%IDENTITY_EMAIL%', identity.email)
          .replaceAll('%IDENTITY_GITHUB%', identity.github.url)
          .replaceAll('%IDENTITY_LINKEDIN%', identity.linkedin.url)

        const leftover = out.match(/%IDENTITY_[A-Z_]+%/g)
        if (leftover) {
          throw new Error(`index.html: unreplaced template tokens: ${[...new Set(leftover)].join(', ')}`)
        }
        return out
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), yaml(), contentValidation(), htmlTemplate()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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
