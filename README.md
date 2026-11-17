# Lily and the Mystery of the Missing Butterflies 🦋

A collaborative Grade 2–3 interactive digital storybook: **one website, three chapters, three in-page demo games**.

## Quick start
Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
npm run build
```

## Collaboration
- `main`: shared foundation / integration
- `chapter-1-ml`: edit `src/chapters/chapter1/` only
- `chapter-2-rl`: edit `src/chapters/chapter2/` only
- `chapter-3-fairness`: edit `src/chapters/chapter3/` only

Read [AGENTS.md](AGENTS.md) for AI-assisted editing rules and [TEAM_SETUP.md](TEAM_SETUP.md) for Chinese team instructions. Open pull requests from your chapter branch into `main`; do not edit `main` directly.

## Chapter interface
Each chapter exports `chapterNPages` in `pages.jsx`. Every page includes `id`, `title`, `chapterLabel`, `theme`, and a React `Content` component. Optional `subtitle` and `illustration`. Game components accept `onComplete` and call it with their chapter identifier.

## Deployment
Import this repository into Vercel, select Vite, build command `npm run build`, output directory `dist`.

## Limitations
This is a **starter prototype**: the CSS page flip is a single-page effect, the three games are rule-based interaction demos (not ML models), the art uses emoji placeholders, and game state is not persisted after leaving the page. Replace or expand the content with your teammates.
