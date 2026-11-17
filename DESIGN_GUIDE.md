# Shared Design Guide — Lily and the Mystery of the Missing Butterflies

## Status
Confirmed team design decisions as of 2026-11-17. This document defines the page layout and game placement. Other visual and behavior choices remain open until the team approves them.

## Confirmed (LOCKED)

1. **Book format:** Two-page spread on desktop (left and right pages shown together).
2. **Page aspect ratio:** Each individual page is **4:5 portrait**.
3. **Spread aspect ratio:** Two side-by-side pages form an **8:5 landscape** spread, excluding the optional spine and outer frame.
4. **Game placement:** **Option B — full-spread interactive games**. A game can use both left and right pages as one coherent interactive canvas, inside the existing storybook website. No navigation to another website.
5. **Page-turn animation:** Option A — realistic paper page-flip with a visible turning sheet (not a simple fade or slide). Respect reduced-motion preferences with a non-animated fallback.
6. **Game navigation:** Option C — free page navigation. Children can turn pages at any time without completing a game and without confirmation or warning dialogs. Do not gate story progression on game completion. Preserve game progress within the current reading session as specified in the session-state rule below.
7. **Responsive design:** Option A — desktops and sufficiently wide landscape tablets show the full two-page spread; narrow/portrait mobile screens switch to a single-page reading view. Full-spread games must use a usable narrow-screen adaptation within the same site, with readable text and touch targets. No external navigation or forced landscape orientation. Breakpoints and exact game reflow are yet to be specified.
8. **Story-page composition:** Option C — mixed layout. Each story page or spread can have its own composition (image-led, text-led, split, or integrated) rather than a mandatory illustration-left/text-right template. All variations must stay within the shared 4:5 page / 8:5 spread geometry, remain readable, and respect book spine and safe margins. This flexibility does not change the required full-spread design for mini-games.
9. **Content safe area:** Option A — compact. Keep critical story text, primary character details, and interactive targets at least **5% of each page's width/height** from the outer edges (reference page 800×1000 → 40 horizontal and 50 vertical units). Full-bleed backgrounds and decorative illustrations may extend to all edges. Treat the center spine/gutter as a separate obstruction: do not place vital text or hit targets across it, and review spread games for spine-safe hit areas.
10. **Chapter length:** Option B — each of the three chapters may contain **4–7 two-page spreads** (8–14 individual pages), chosen by the chapter author. Keep one continuous story across all three chapters; the number of spreads does not have to match between chapters. Covers and ending pages are outside each chapter's allowance. Each chapter must include a game spread and a transition into the next chapter, but exact pacing and content are flexible.
11. **Game progress (Option B):** Preserve each game's partial progress when readers freely turn to another spread and then return **during the same reading session**. No account, backend, or cross-visit save is required. A page change must not reset unfinished game state. Refreshing or closing the tab may reset progress. The shared application layer should own session game state; chapter games must communicate their progress through the integration lead's agreed API once implemented. A deliberate Restart/Reset control may reset a game.
12. **Game entry (Option C):** Interactive games are woven naturally into the story spread. **No separate Start Game button, launch screen, or external navigation.** As soon as readers reach the relevant spread, objects in the illustrated scene are interactive. Provide clear, age-appropriate visual affordances/instructions so children understand what can be tapped or clicked. Keep the interactive scene visible and support full-spread interaction, responsive narrow-screen adaptation, free navigation, and in-session progress preservation.
13. **Game feedback (Option B):** Use **Pip's short, age-appropriate dialogue together with an animated change in the illustrated scene** to respond to children's actions. Feedback should explain *why* a choice matters, not simply say right/wrong. Examples: Pip reacts in a speech bubble and a flower blooms, leaves move, or a clue highlights. Keep feedback integrated in the current spread (no external screens or mandatory modal). Provide readable text alternatives to animation, support reduced-motion preferences, and avoid sound-only feedback. The precise animation style, timing, and visual palette remain undecided.
14. **Shared implementation ownership:** The integration lead maintains the global book, spread rendering, page-flip behavior, and responsive layout. Chapter developers work inside their own `src/chapters/chapterN/` folders.

## Reference design coordinate system (not fixed screen pixel sizes)

- Single page: **800 × 1000 reference units**.
- Full spread: **1600 × 1000 reference units** before gutter/spine.
- Responsive scaling is required; these numbers are design coordinates, not hardcoded CSS screen sizes.
- Critical content has a **5% page-edge safe area**: 40 units horizontally and 50 units vertically on the 800 × 1000 reference page. Background art can bleed to the edges.
- The central book spine may obscure content; keep vital text and interaction targets clear of it (precise spine clearance remains to be determined).
- Touch and keyboard alternatives are required for interactions.

## Chapter contract for future full-spread games

- Existing code exports `chapterNPages` from `src/chapters/chapterN/pages.jsx` and uses a `Content` React component for each page.
- Existing games receive `onComplete` and call `onComplete('chapterN')`.
- **The current shared `Book.jsx` is a single-page prototype.** It does NOT yet implement a true two-page spread or spread-level game rendering.
- **Do not make independent incompatible changes to `Book.jsx` or `App.jsx`.** The integration lead must upgrade the shared interface first; then the team should agree on a shared `Spread` / full-spread game contract.
- Navigation must remain freely available during games; gameplay clicks/touches/drags must not accidentally trigger a page flip. Only explicit navigation controls or deliberate page-turn gestures should turn pages.
- Keep chapter state and game results usable after returning to the spread during the same reading session. Do not assume component-local state survives unmounting; the integration lead will define a shared state API for chapter developers.

## Decisions still open

1. Text minimum sizes/readability standards and exact extra spine clearance (5% page-edge safe margin confirmed).
2. Lily & Pip character bible, illustration style, color palette, typography (**visual style decision deferred**, not approved yet).
3. Detailed storytelling beats, game spread positions, and chapter-to-chapter transitions (4–7 spreads per chapter confirmed).
4. Specific component API for spread games and in-session progress state (persistence behavior confirmed).
5. Exact responsive breakpoints and narrow-screen reflow for each full-spread game.

## Collaboration

All teammates and their coding assistants should read **AGENTS.md** and **DESIGN_GUIDE.md**. Avoid redefining the confirmed dimensions or creating standalone sites per chapter. Merge updates from `main` into chapter branches before making changes that depend on this guide.
