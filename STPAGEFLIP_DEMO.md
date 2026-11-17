# StPageFlip paper-curl demo

This branch tests **Nodlik/StPageFlip** via the official `react-pageflip` React wrapper. It does not replace `main` until the interaction is reviewed.

## Changes
- Replaced the previous CSS-only rigid page rotation with StPageFlip's real corner fold and soft leaf shadows.
- Landscape two-page and mobile portrait page layouts.
- Kept chapter page contract and three existing chapter mini-games; games are displayed as overlays and kept mounted to preserve in-session progress.
- Preserved no chapter jump menu, on-demand browser TTS, corner navigation and keyboard fallback.
- Existing illustrations are placeholders; approved illustration style remains undecided.

## Run
```bash
npm install
npm run dev
npm run build
```

## Manual acceptance checklist
1. Desktop: fold/drag upper and lower paper corners forward and backward; verify shadow changes naturally.
2. Mobile narrow view: one portrait page at a time; ensure swipe works.
3. Chapter 1, 2, 3: tapping the interactive choices must work without accidentally turning pages.
4. Explore a clue, turn away, return: the game choice should remain.
5. Read-aloud only starts on clicking the button and stops on a turn.
6. End of book: celebration spread; no chapter index or navigation arrows.
7. Check long story text visibility, reduced-motion behavior and keyboard operation.

## Known limitations
- Game screens are currently React overlays over the page-flip leaves. These prevent some fold gestures in the center of the pages; interact by grabbing visible corners. As the paper turns, the overlay may update independently of the curling sheet.
- The standard StPageFlip wrapper can clone page DOM in portrait mode; the game components are outside it to avoid duplicate game state.
- This branch has not yet been run in a browser or production-built; test before merging.
- The wrapper's disableFlipByClick behavior needs device/browser verification.
- A cross-spread game overlay is a prototype; the final implementation may need extra care to make game visuals feel embedded in the bending page.

Documentation: https://github.com/Nodlik/react-pageflip
