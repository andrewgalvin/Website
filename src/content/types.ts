/**
 * Shapes for the YAML content files in this directory. src/content/index.ts
 * is the only place that casts the raw YAML to these types — components
 * import from there and stay fully typed.
 */

export interface LinkRef {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
}

export interface Identity {
  name: string
  email: string
  phone: {
    display: string
    e164: string
  }
  location: string
  github: { label: string; url: string }
  linkedin: { label: string; url: string }
  resume: string
  source: string
}

export interface SiteContent {
  identity: Identity
  nav: NavItem[]
}

export interface HeroAction {
  label: string
  href: string
  style: 'primary' | 'ghost'
  external?: boolean
}

export interface Stat {
  value: number
  label: string
  suffix?: string
  decimals?: number
}

export interface HeroContent {
  eyebrow: string
  title: string
  /** Supports *emphasis* markers, rendered as <em>. */
  sub: string
  actions: HeroAction[]
  stats: Stat[]
  asOf: string
}

export interface Fact {
  term: string
  detail: string
}

export interface Principle {
  title: string
  body: string
}

export interface AboutContent {
  title: string
  lead: string
  paragraphs: string[]
  facts: Fact[]
  principles: Principle[]
}

export interface FeaturedProject {
  kicker: string
  title: string
  body: string
  tags: string[]
  links?: LinkRef[]
  figure: {
    number: string
    caption: string
  }
}

export interface ArchiveProject {
  title: string
  body: string
  /** Badge text for projects with nothing to link (e.g. "Retired"). */
  note?: string
  link?: LinkRef
}

export interface ProjectsContent {
  title: string
  featured: FeaturedProject[]
  archiveTitle: string
  archive: ArchiveProject[]
}

export interface TimelineItem {
  dates: string
  title: string
  org: string
  bullets?: string[]
  tags?: string[]
  /** One-line detail for education entries instead of bullets. */
  detail?: string
}

export interface ExperienceContent {
  title: string
  items: TimelineItem[]
  resumeLabel: string
}

export interface SkillGroup {
  title: string
  items: string[]
  featured?: boolean
}

export interface SkillsContent {
  title: string
  groups: SkillGroup[]
}

export interface ContactContent {
  title: string
  lead: string
  blurb: string
}
