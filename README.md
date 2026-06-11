# andrewgalvin.net

Personal portfolio of **Andrew Galvin** — senior software engineer in Boston
building scalable systems and real-time market monitors, with an AI-augmented
development workflow.

Rebuilt from the ground up in 2026 (previously Create React App + Material-UI)
as a clean, minimal, light design. The site is a single static page with no
framework: semantic HTML carries all content (good for SEO and screen
readers), TypeScript modules add behavior, and the 3D hero accent is a
lazy-loaded progressive enhancement that phones never download (the canvas is
hidden below 64rem).

## Stack

| Layer      | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Build      | [Vite](https://vite.dev) + TypeScript (strict)             |
| 3D hero    | [Three.js](https://threejs.org) — lazy-loaded chunk        |
| Animation  | [GSAP](https://gsap.com) + ScrollTrigger                   |
| Styling    | Hand-rolled CSS custom-property design system              |
| Contact    | EmailJS REST API (same service/template as the old site)   |

## Develop

```sh
npm install
npm run dev        # dev server with HMR
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
```

## Structure

```
index.html              all content + meta/OG/JSON-LD (single page)
public/                 favicon, resume PDF, robots.txt, sitemap.xml
src/main.ts             entry — wires everything up
src/styles/main.css     design tokens + component styles
src/scene/heroScene.ts  Three.js network-graph hero (own chunk)
src/lib/animations.ts   GSAP scroll animations & microinteractions
src/lib/navigation.ts   mobile menu + a11y
src/lib/contactForm.ts  EmailJS submission + validation
```

## Performance & accessibility notes

- The Three.js chunk loads on `requestIdleCallback`; the page is fully usable
  before (and without) it. No WebGL → the CSS gradient backdrop stays.
- The render loop pauses when the tab is hidden or the hero scrolls offscreen;
  pixel ratio is capped (2 desktop / 1.5 mobile).
- `prefers-reduced-motion` disables GSAP animations, the role cycler, and the
  3D render loop (a single static frame is drawn instead).
- Content is never hidden by CSS awaiting JavaScript — reveals are
  JS-applied, so a broken script can't blank the page.
- Update the resume by replacing `public/Andrew-Galvin-Resume.pdf`.
