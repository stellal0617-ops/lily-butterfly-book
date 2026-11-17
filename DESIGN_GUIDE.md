# Shared Design Guide — Lily and the Mystery of the Missing Butterflies

## Status
Confirmed team design decisions as of 2026-11-17. This document defines the page layout and game placement. Other visual and behavior choices remain open until the team approves them.

## Confirmed (LOCKED)

1. **Book format:** Two-page spread on desktop (left and right pages shown together).
2. **Page aspect ratio:** Each individual page is **4:5 portrait**.
3. **Spread aspect ratio:** Two side-by-side pages form an **8:5 landscape** spread, excluding the optional spine and outer frame.
4. **Game placement:** **Option B — full-spread interactive games**. A game can use both left and right pages as one coherent interactive canvas, inside the existing storybook website. No navigation to another website.
5. **Page-turn animation:** Option A — realistic paper page-flip with a visible turning sheet (not a simple fade or slide). Respect reduced-motion preferences with a non-animated fallback.
6. **Game navigation:** Option C — free page navigation. Children can turn pages at any time without completing a game and without confirmation or warning dialogs. Do not gate story progression on game completion. Preserve game progress when possible; the precise persistence method is still to be determined.
7. **Responsive design:** Option A — desktops and sufficiently wide landscape tablets show the full two-page spread; narrow/portrait mobile screens switch to a single-page reading view. Full-spread games must use a usable narrow-screen adaptation within the same site, with readable text and touch targets. No external navigation or forced landscape orientation. Breakpoints and exact game reflow are yet to be specified.
8. **Story-page composition:** Option C — mixed layout. Each story page or spread can have its own composition (image-led, text-led, split, or integrated) rather than a mandatory illustration-left/text-right template. All variations must stay within the shared 4:5 page / 8:5 spread geometry, remain readable, and respect book spine and safe margins. This flexibility does not change the required full-spread design for mini-games.
9. **Shared implementation ownership:** The integration lead maintains the global book, spread rendering, page-flip behavior, and responsive layout. Chapter developers work inside their own `src/chapters/chapterN/` folders.

## Reference design coordinate system (not fixed screen pixel sizes)

- Single page: **800 × 1000 reference units**.
- Full spread: **1600 × 1000 reference units** before gutter/spine.
- Responsive scaling is required; these numbers are design coordinates, not hardcoded CSS screen sizes.
- Important content should have safe margins around the center spine and outer edges; exact margins are still to be decided.
- Touch and keyboard alternatives are required for interactions.

## Chapter contract for future full-spread games

- Existing code exports `chapterNPages` from `src/chapters/chapterN/pages.jsx` and uses a `Content` React component for each page.
- Existing games receive `onComplete` and call `onComplete('chapterN')`.
- **The current shared `Book.jsx` is a single-page prototype.** It does NOT yet implement a true two-page spread or spread-level game rendering.
- **Do not make independent incompatible changes to `Book.jsx` or `App.jsx`.** The integration lead must upgrade the shared interface first; then the team should agree on a shared `Spread` / full-spread game contract.
- Navigation must remain freely available during games; gameplay clicks/touches/drags must not accidentally trigger a page flip. Only explicit navigation controls or deliberate page-turn gestures should turn pages.
- Keep chapter state and game results usable after returning to the spread; exact persistence strategy has not yet been confirmed.

## Decisions still open

1. Text safe areas, minimum readability standards and exact margins (mixed compositions confirmed).
2. Lily & Pip character bible, illustration style, color palette, typography.
3. Number of spreads per chapter and transitions.
4. Specific component API for spread games and progress persistence.
5. Exact responsive breakpoints and narrow-screen reflow for each full-spread game.

## Collaboration

All teammates and their coding assistants should read **AGENTS.md** and **DESIGN_GUIDE.md**. Avoid redefining the confirmed dimensions or creating standalone sites per chapter. Merge updates from `main` into chapter branches before making changes that depend on this guide.
