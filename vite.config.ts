import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { load } from 'js-yaml'

const contentDir = fileURLToPath(new URL('./src/content', import.meta.url))

const get = (obj: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (o, key) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[key] : undefined),
      obj,
    )

/**
 * Identity (email, phone, profile links) lives once in src/content/site.yaml.
 * The React tree imports it; this plugin injects the same values into the
 * static parts of index.html (JSON-LD, the noscript notice), so changing an
 * address never means hunting through markup.
 */
function htmlIdentity(): Plugin {
  return {
    name: 'html-identity',
    transformIndexHtml: {
      order: 'pre', // run before Vite's own %ENV% substitution
      handler(html) {
        const { identity } = load(readFileSync(join(contentDir, 'site.yaml'), 'utf8')) as {
          identity: {
            email: string
            phone: { e164: string }
            github: { url: string }
            linkedin: { url: string }
          }
        }
        return html
          .replaceAll('%IDENTITY_EMAIL%', identity.email)
          .replaceAll('%IDENTITY_PHONE%', identity.phone.e164)
          .replaceAll('%IDENTITY_GITHUB%', identity.github.url)
          .replaceAll('%IDENTITY_LINKEDIN%', identity.linkedin.url)
      },
    },
  }
}

/**
 * Fail the build (and dev startup) when a content file drops a required
 * field, instead of letting the site render blanks. The TypeScript types in
 * src/content/types.ts cover component usage; this covers the YAML itself.
 */
const REQUIRED_FIELDS: Record<string, string[]> = {
  'site.yaml': [
    'identity.name',
    'identity.email',
    'identity.phone.display',
    'identity.phone.e164',
    'identity.location',
    'identity.github.label',
    'identity.github.url',
    'identity.linkedin.label',
    'identity.linkedin.url',
    'identity.resume',
    'identity.source',
    'nav',
  ],
  'hero.yaml': ['eyebrow', 'title', 'sub', 'actions', 'stats', 'asOf'],
  'about.yaml': ['title', 'lead', 'paragraphs', 'facts', 'principles'],
  'projects.yaml': ['title', 'featured', 'archiveTitle', 'archive'],
  'experience.yaml': ['title', 'items', 'resumeLabel'],
  'skills.yaml': ['title', 'groups'],
  'contact.yaml': ['title', 'lead', 'blurb'],
}

const LIST_ITEM_FIELDS: Record<string, Array<[list: string, fields: string[]]>> = {
  'site.yaml': [['nav', ['label', 'href']]],
  'hero.yaml': [
    ['actions', ['label', 'href', 'style']],
    ['stats', ['value', 'label']],
  ],
  'about.yaml': [
    ['facts', ['term', 'detail']],
    ['principles', ['title', 'body']],
  ],
  'projects.yaml': [
    ['featured', ['kicker', 'title', 'body', 'tags', 'figure.number', 'figure.caption']],
    ['archive', ['title', 'body']],
  ],
  'experience.yaml': [['items', ['dates', 'title', 'org']]],
  'skills.yaml': [['groups', ['title', 'items']]],
}

function contentValidation(): Plugin {
  return {
    name: 'content-validation',
    buildStart() {
      const problems: string[] = []
      for (const [file, fields] of Object.entries(REQUIRED_FIELDS)) {
        const data = load(readFileSync(join(contentDir, file), 'utf8'))
        for (const field of fields) {
          if (get(data, field) === undefined) problems.push(`${file}: missing "${field}"`)
        }
        for (const [list, itemFields] of LIST_ITEM_FIELDS[file] ?? []) {
          const items = get(data, list)
          if (!Array.isArray(items)) continue // absence already reported above
          items.forEach((item, i) => {
            for (const field of itemFields) {
              if (get(item, field) === undefined) {
                problems.push(`${file}: ${list}[${i}] missing "${field}"`)
              }
            }
          })
        }
      }
      if (problems.length > 0) {
        throw new Error(`Content validation failed:\n  ${problems.join('\n  ')}`)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), yaml(), contentValidation(), htmlIdentity()],
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
