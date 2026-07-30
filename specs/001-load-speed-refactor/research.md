# Research: Load Speed Refactor

**Feature**: `001-load-speed-refactor`  
**Date**: 2026-07-30

## R1 — How to speed Home without changing Everest visuals

**Decision**: Keep the existing Hero architecture (HeroFly + single canvas + dual GLB theme swap + CSS sky fallback). Optimize **when** terrain/chunk work starts (defer below-fold and non-critical work; ensure first paint of chrome/copy is not blocked by GLB decode). Do **not** replace photoreal/wire GLBs with a redesign or bring back scroll-scrub MP4 hero.

**Rationale**: HERO.md marks the fly experience as shipped; visual parity is a hard product constraint (FR-002, SC-004). Most Home weight is terrain + idle-lazy canvas already partially deferred — tightening boundaries beats rewriting FX.

**Alternatives considered**:
- Swap Everest for static poster only on all devices → rejected (violates “full preservation” of graphics).
- Aggressive mesh/texture downscale without parity check → rejected until measured + owner visual OK.
- Reintroduce video hero → rejected (explicitly superseded).

## R2 — How to speed Solutions without glass regression

**Decision**: Preserve Phone3D still→MP4-on-same-materials pipeline, existing silhouette boot, and CssPhone/live feed for mobile/reduced. Focus on: route-level isolation (Solutions chunk not on critical Home path), keep `preloadPhone3DAssets` scoped to Solutions mount (already), avoid remount/Suspense patterns that flash white, optional media delivery tweaks only if stills/MP4s stay visually identical.

**Rationale**: SOLUTIONS.md / milestone commits treat glass parity as non-negotiable (FR-003, SC-003). Prior white-flash bugs came from Suspense Still↔Video swaps — must not return.

**Alternatives considered**:
- Always show CssPhone on desktop until GLB ready (live feed under canvas) → rejected (already caused HMR/crash history; silhouette is the approved stand-in).
- Drop MP4s and use only stills → rejected (video is primary glass content).
- Eager global preload of all Solutions assets from Home → rejected (hurts Home SC-001).

## R3 — Bundle / async loading strategy

**Decision**: Prefer route-based code splitting already present in `App.tsx`; audit Home for accidental static imports of Solutions/3D/deep pages; keep idle preload of near Home sections only; do not preload Solutions GLB/MP4 from Home. Measure with cold Network + Lighthouse before/after.

**Rationale**: Spec SC-001/SC-002 are relative improvements; splitting and deferral are the lowest-risk levers that preserve graphics.

**Alternatives considered**:
- Remove three/R3F from dependencies and dynamic-import from CDN → rejected (HANDOFF: stripping runtime deps broke deploy).
- Micro-frontend split → rejected (out of scope / overkill).

## R4 — Dead pages and assets

**Decision**: Delete or stop shipping confirmed-unused modules and scratch media:
- Page modules not referenced from `App.tsx` (e.g. `AboutPage.tsx`, `ExpertisePage.tsx` if unused).
- Local scratch: `.tmp-*`, unused alternate phone GLBs (`copper-opt`, `deep-blue-full`, `silver` if unused), unused bird source GLB if unused.
- Keep required build assets (og, everest GLBs used by Hero, phone GLBs used by Phone3D, format stills/MP4s).
- Keep `videos/solutions-pilot/` as **local** HyperFrames source — ensure it is not copied into `dist` (verify `.gitignore` / deploy inputs).

**Rationale**: HANDOFF §20 lists this as next refactor step; FR-005/SC-005 require shipped payload without scratch.

**Alternatives considered**:
- Quarantine-only (`_legacy/`) forever → acceptable interim, but prefer delete for unused pages.
- Large media LFS migration → out of scope for this feature (optional follow-up).

## R5 — Measurement protocol

**Decision**: Capture baseline on production (or local prod build) once: cold load `/` and `/solutions` on the same machine/network; record LCP / time-to-hero-chrome / time-to-non-blank-glass; repeat after changes with identical profile. Side-by-side visual checklist from HERO.md + SOLUTIONS.md.

**Rationale**: SC-001/SC-002 need a comparable before/after; no automated e2e exists.

**Alternatives considered**: Synthetic CI-only budgets without visual check → rejected (misses FR visual constraints).

## R6 — Constitution template

**Decision**: Proceed with HANDOFF/product gates; schedule constitution ratification separately (not blocking this plan).

**Rationale**: Template constitution has no enforceable principles yet; inventing fake gates would be noise.
