# Shared AI coding rules — Lily and the Missing Butterflies

This is **one integrated React + Vite storybook**, NOT three standalone sites.

## Rules
1. Edit only your assigned folder under `src/chapters/chapter1`, `chapter2`, or `chapter3`.
2. Do not edit shared `src/App.jsx`, `src/components/`, `src/styles/`, or `package.json` without discussing with the integration lead.
3. Export `chapterNPages` from your `pages.jsx`. Each page has a unique `id`, `title`, `chapterLabel`, `theme`, `Content`; optional `subtitle` and `illustration`.
4. Games render in story pages and never navigate away. On completion call `onComplete('chapterN')`.
5. Use a consistent Lily/Pip visual style and age-appropriate Grade 2–3 wording.
6. Ensure games work with keyboard, mouse and touch (no drag-only game).
7. Do not add dependencies or change shared APIs without team approval.
8. Before editing, list files to modify; after editing run `npm run build`.

## Learning objectives
- Chapter 1: Machine learning learns patterns from examples and can make mistakes.
- Chapter 2: Reinforcement learning uses actions and rewards; demo is rule-based, not a trained model.
- Chapter 3: Bias and fairness depend on examples, goals and who is affected.

## Branch ownership
- `chapter-1-ml`: `src/chapters/chapter1/**`
- `chapter-2-rl`: `src/chapters/chapter2/**`
- `chapter-3-fairness`: `src/chapters/chapter3/**`
- Open PRs into `main`. Integration lead reviews and tests.
