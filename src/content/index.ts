/**
 * Typed gateway to the YAML content. This is the only module that touches
 * the raw imports; everything else reads these constants and gets full
 * type checking against src/content/types.ts.
 */

import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  HeroContent,
  ProjectsContent,
  SiteContent,
  SkillsContent,
} from './types'

import site from './site.yaml'
import hero from './hero.yaml'
import about from './about.yaml'
import projects from './projects.yaml'
import experience from './experience.yaml'
import skills from './skills.yaml'
import contact from './contact.yaml'

export const SITE = site as SiteContent
export const HERO = hero as HeroContent
export const ABOUT = about as AboutContent
export const PROJECTS = projects as ProjectsContent
export const EXPERIENCE = experience as ExperienceContent
export const SKILLS = skills as SkillsContent
export const CONTACT = contact as ContactContent

export type * from './types'
