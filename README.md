# andrewgalvin.net

Personal portfolio of **Andrew Galvin**, a senior software engineer in Boston
building scalable systems and real-time market monitors with an AI-first
development workflow.

Rebuilt from the ground up in 2026 (previously Create React App + Material-UI)
as a clean, minimal, light design, then migrated to React 19 later that year.
All copy lives in YAML under `src/content/` — components are pure renderers.
Head metadata (meta/OG/JSON-LD) stays static in `index.html` so crawlers and
link unfurlers never depend on JavaScript; the page body is a React tree. The
3D hero accent is a lazy-loaded progressive enhancement that phones never
download (the canvas is hidden below 64rem).

## Stack

| Layer      | Choice                                                       |
| ---------- | ------------------------------------------------------------ |
| Build      | [Vite](https://vite.dev) + TypeScript (strict, project refs) |
| UI         | [React 19](https://react.dev) — function components + hooks  |
| Content    | YAML via `@rollup/plugin-yaml`, typed in `content/types.ts`  |
| 3D hero    | [Three.js](https://threejs.org) — lazy-loaded chunk          |
| Animation  | [GSAP](https://gsap.com) + ScrollTrigger                     |
| Styling    | Hand-rolled CSS custom-property design system                |
| Contact    | Netlify Forms — same-origin AJAX post, no third-party        |

## Develop

```sh
npm install
npm run dev        # dev server with HMR
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
```

## Structure

```
index.html                  static head (meta/OG/JSON-LD), React root,
                            Netlify form registration
public/                     favicon, resume PDF, robots.txt, sitemap.xml
src/
  main.tsx                  entry — mounts <App />
  App.tsx                   page composition + GSAP animation lifecycle
  content/                  ALL site copy, as YAML + the types that gate it
    types.ts                content interfaces
    index.ts                typed exports (the only place YAML is cast)
    site.yaml               identity (email/phone/links) + nav
    hero.yaml … contact.yaml  one file per section
  components/
    layout/                 Header, Footer
    sections/               one component per page section
    ui/                     small shared primitives (Icon)
  hooks/                    useMediaQuery
  lib/                      animations (GSAP), emphasis (inline *em* markers)
  scene/heroScene.ts        Three.js network-graph hero (own chunk)
  styles/main.css           design tokens + component styles
```

Imports use the `@/` alias for `src/` (wired in `vite.config.ts` and
`tsconfig.app.json`).

## Editing content

Everything a visitor reads is YAML in `src/content/` — no JSX edits needed:

- **Add/remove a project**: edit `projects.yaml`. Featured projects take
  `kicker/title/body/tags/figure` (+ optional `links`); archive entries take
  `title/body` plus either a `link` or a `note` badge. Order in the file is
  display order.
- **Experience, skills, about, hero**: same idea in their files; timeline
  roles use `bullets` + `tags`, education entries use `detail`.
- **Identity (email, phone, profiles, résumé path)**: change once in
  `site.yaml`. The React tree reads it at runtime and `vite.config.ts`
  injects the same values into the static `index.html` (JSON-LD + noscript)
  at build time, so there is exactly one source of truth.
- In `hero.yaml`'s `sub`, `*single asterisks*` render as `<em>`.
- Section ids (`#about`, `#projects`, …) are owned by the section components;
  `nav` hrefs in `site.yaml` must match them.

Two guards keep edits safe: `content/types.ts` types every field where
components consume it, and a build-time validator in `vite.config.ts` checks
the YAML itself — a missing required field fails `npm run build` with the
file, entry index, and field named, instead of rendering blank.

## Contact form

The form posts urlencoded to `/` and Netlify routes it; the hidden form in
`index.html` is what Netlify's deploy crawler reads to provision it. Two
one-time dashboard steps: enable **Site configuration → Forms → Form
detection**, and add an email notification so submissions get forwarded.
Local previews have no Netlify layer, so a local submit shows the error
fallback by design.

## Performance & accessibility notes

- The Three.js chunk loads on `requestIdleCallback`; the page is fully usable
  before (and without) it. No WebGL → the canvas unmounts and the hero
  stays typographic.
- The render loop pauses when the tab is hidden or the hero scrolls offscreen;
  pixel ratio is capped at 2.
- Fonts are self-hosted variable woff2 latin subsets (preloaded); the page
  makes zero third-party requests — including the contact form, which posts
  same-origin.
- `prefers-reduced-motion` disables GSAP animations and the 3D render loop
  (a single static frame is drawn instead).
- The body renders client-side; a `noscript` notice with direct contact info
  covers JS-off visitors, and all SEO-relevant metadata is static HTML.
- GSAP hooks onto `data-hero`, `data-reveal`, `data-reveal-group`, and
  `data-count` attributes — keep them when restyling sections.
- Update the resume by replacing `public/Andrew-Galvin-Resume.pdf`.
- Add a portrait by dropping `public/portrait.jpg` (4:5 crop, ~800px wide)
  and uncommenting the `about-photo` figure in
  `src/components/sections/About.tsx`.
