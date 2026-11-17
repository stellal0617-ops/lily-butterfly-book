# Shared Design Guide — Lily and the Mystery of the Missing Butterflies

## Status
Confirmed team design decisions as of 2026-11-17. This document defines the page layout and game placement. Other visual and behavior choices remain open until the team approves them.

## Confirmed (LOCKED)

1. **Book format:** Two-page spread on desktop (left and right pages shown together).
2. **Page aspect ratio:** Each individual page is **4:5 portrait**.
3. **Spread aspect ratio:** Two side-by-side pages form an **8:5 landscape** spread, excluding the optional spine and outer frame.
4. **Game placement:** **Option B — full-spread interactive games**. A game can use both left and right pages as one coherent interactive canvas, inside the existing storybook website. No navigation to another website.
5. **Shared implementation ownership:** The integration lead maintains the global book, spread rendering, page-flip behavior, and responsive layout. Chapter developers work inside their own `src/chapters/chapterN/` folders.

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
- A full-spread game must preserve in-page navigation and avoid page flips while the child is clicking or dragging within the game.
- Keep chapter state and game results usable after returning to the spread; exact persistence strategy has not yet been confirmed.

## Decisions still open

1. Flip mechanism: realistic paper fold vs simplified page transition.
2. During game: whether navigation is locked, merely warned, or always allowed.
3. On small screens: single-page mode, pan/zoom, or alternate game layout.
4. Text / illustration layout and safe areas.
5. Lily & Pip character bible, illustration style, color palette, typography.
6. Number of spreads per chapter and transitions.
7. Specific component API for spread games and progress persistence.

## Collaboration

All teammates and their coding assistants should read **AGENTS.md** and **DESIGN_GUIDE.md**. Avoid redefining the confirmed dimensions or creating standalone sites per chapter. Merge updates from `main` into chapter branches before making changes that depend on this guide.
