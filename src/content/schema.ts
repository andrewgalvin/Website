/**
 * Single source of truth for content shapes. The build-time validator in
 * vite.config.ts parses every YAML file against these schemas (so a wrong
 * type, a blank value, an unquoted date, or a typo'd key fails the build),
 * and the TypeScript types below derive from the same schemas via z.infer.
 *
 * IMPORTANT: only `import type` from this module in browser code — a value
 * import would pull zod into the bundle. content/index.ts does this right.
 */
import { z } from 'zod'

const link = z.strictObject({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const siteSchema = z.strictObject({
  identity: z.strictObject({
    name: z.string().min(1),
    email: z.string().includes('@'),
    phone: z.strictObject({
      display: z.string().min(1),
      e164: z.string().regex(/^\+\d{7,15}$/, 'E.164, e.g. +17819275667'),
    }),
    location: z.string().min(1),
    github: z.strictObject({ label: z.string().min(1), url: z.string().min(1) }),
    linkedin: z.strictObject({ label: z.string().min(1), url: z.string().min(1) }),
    resume: z.string().min(1),
    source: z.string().min(1),
  }),
  nav: z.array(
    z.strictObject({
      label: z.string().min(1),
      href: z.string().startsWith('#', 'nav hrefs are section anchors'),
    }),
  ),
})

export const heroSchema = z.strictObject({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  sub: z.string().min(1),
  actions: z.array(
    z.strictObject({
      label: z.string().min(1),
      // "@resume" resolves to identity.resume (see content/index.ts)
      href: z.string().min(1),
      style: z.enum(['primary', 'ghost']),
      external: z.boolean().optional(),
    }),
  ),
  stats: z.array(
    z.strictObject({
      value: z.number(),
      label: z.string().min(1),
      suffix: z.string().optional(),
      decimals: z.number().int().optional(),
    }),
  ),
  asOf: z.string().min(1),
})

export const aboutSchema = z.strictObject({
  title: z.string().min(1),
  lead: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  facts: z.array(z.strictObject({ term: z.string().min(1), detail: z.string().min(1) })),
  principles: z.array(z.strictObject({ title: z.string().min(1), body: z.string().min(1) })),
})

export const projectsSchema = z.strictObject({
  title: z.string().min(1),
  featured: z.array(
    z.strictObject({
      kicker: z.string().min(1),
      title: z.string().min(1),
      body: z.string().min(1),
      tags: z.array(z.string().min(1)),
      links: z.array(link).optional(),
      figure: z.strictObject({
        number: z.string().min(1, 'quote numeric figures, e.g. "194"'),
        caption: z.string().min(1),
      }),
    }),
  ),
  archiveTitle: z.string().min(1),
  archive: z.array(
    z.strictObject({
      title: z.string().min(1),
      body: z.string().min(1),
      note: z.string().optional(),
      link: link.optional(),
    }),
  ),
})

export const experienceSchema = z.strictObject({
  title: z.string().min(1),
  items: z.array(
    z.strictObject({
      // a string like "Apr 2026 – Present"; an unquoted YYYY-MM-DD would
      // parse as a Date and is rejected here on purpose
      dates: z.string().min(1),
      title: z.string().min(1),
      org: z.string().min(1),
      bullets: z.array(z.string().min(1)).optional(),
      tags: z.array(z.string().min(1)).optional(),
      detail: z.string().optional(),
    }),
  ),
  resumeLabel: z.string().min(1),
})

export const skillsSchema = z.strictObject({
  title: z.string().min(1),
  groups: z.array(
    z.strictObject({
      title: z.string().min(1),
      items: z.array(z.string().min(1)),
      featured: z.boolean().optional(),
    }),
  ),
})

export const contactSchema = z.strictObject({
  title: z.string().min(1),
  lead: z.string().min(1),
  blurb: z.string().min(1),
})

/** filename → schema, consumed by the validator plugin in vite.config.ts */
export const CONTENT_SCHEMAS = {
  'site.yaml': siteSchema,
  'hero.yaml': heroSchema,
  'about.yaml': aboutSchema,
  'projects.yaml': projectsSchema,
  'experience.yaml': experienceSchema,
  'skills.yaml': skillsSchema,
  'contact.yaml': contactSchema,
} as const

export type SiteContent = z.infer<typeof siteSchema>
export type HeroContent = z.infer<typeof heroSchema>
export type AboutContent = z.infer<typeof aboutSchema>
export type ProjectsContent = z.infer<typeof projectsSchema>
export type ExperienceContent = z.infer<typeof experienceSchema>
export type SkillsContent = z.infer<typeof skillsSchema>
export type ContactContent = z.infer<typeof contactSchema>
