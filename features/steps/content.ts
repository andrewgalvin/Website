import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import { heroSchema, projectsSchema, siteSchema } from '../../src/content/schema'

/**
 * The scenarios assert the page against the same YAML the site renders
 * from, parsed through the same schemas — content and page can't drift
 * apart without a failing test.
 */
const contentDir = fileURLToPath(new URL('../../src/content', import.meta.url))
const loadYaml = (file: string): unknown => load(readFileSync(join(contentDir, file), 'utf8'))

export const site = siteSchema.parse(loadYaml('site.yaml'))
export const hero = heroSchema.parse(loadYaml('hero.yaml'))
export const projects = projectsSchema.parse(loadYaml('projects.yaml'))
