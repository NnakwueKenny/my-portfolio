# Portfolio design presets

The site keeps content and design separate:

- Portfolio content lives in `src/data/site.ts`.
- The active design is selected in `src/config/design.ts`.
- Shared visual rules live in `src/styles/global.css`.
- Page-specific composition stays beside each Astro page.

## Current preset

`personal-engineering-notebook` is the selected and implemented direction. It is based on the second approved visual concept: warm editorial surfaces, Fraunces display typography, Instrument Sans body text, Caveat handwritten details, restrained paper texture, and contained project imagery.

## Reserved directions

The registry also names `editorial-portrait` and `quiet-kinetic`. They are intentionally marked as planned; selecting either should happen only after its component-level treatments are implemented and verified. This avoids duplicating content or presenting an unfinished token swap as a complete design.
