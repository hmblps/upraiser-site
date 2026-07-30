# Baseline — Load Speed Refactor

**Date**: 2026-07-30  
**Branch**: `001-load-speed-refactor`  
**Prod reference**: https://upraiser-site.vercel.app

## Pre-work incident

Working tree had **deleted** required Hero/Solutions assets (Everest GLBs, phone GLBs, format MP4s, OG, Draco). Restored via `git restore` before any refactor. Site was broken locally until restore.

## Baseline note

Cold-load numbers should be taken against **production** (or local `npm run preview` after restore) on the same device/network for before/after.

| Route | Metric | Before | After | Notes |
|-------|--------|--------|-------|-------|
| `/` | Time to usable hero chrome | _(fill)_ | _(fill)_ | SC-001 ≥20% |
| `/` | LCP | _(fill)_ | _(fill)_ | |
| `/solutions` | Time to non-blank glass | _(fill)_ | _(fill)_ | SC-002 |

**Profile**: _(device / network)_

## Safe levers applied (no intentional visual redesign)

1. Prefetch/preload **active-theme** Hero GLB first; defer alternate + Voyager.
2. Delete unused page modules (`AboutPage`, `ExpertisePage`) and unused `PixelSnow`.
3. Ignore scratch (`.tmp-*`, `videos/`) so they cannot ship.
