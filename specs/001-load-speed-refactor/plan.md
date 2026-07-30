# Implementation Plan: Load Speed Refactor

**Branch**: `001-load-speed-refactor` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-load-speed-refactor/spec.md`

## Summary

Refactor the UPRAISER marketing SPA so Home and `/solutions` become usable sooner **without** changing the settled look of the Everest hero/theme pipeline or the Solutions glass (still → MP4 formats, mobile CSS phone). Approach: isolate heavy route chunks, keep existing progressive fallbacks (silhouette / CSS sky), purge dead pages and scratch media from the ship set, and only compress large media when visual parity holds.

## Technical Context

**Language/Version**: TypeScript + React 19  

**Primary Dependencies**: Vite 8, React Router 7, Framer Motion 12, Lenis, Three + R3F/drei (Hero + Solutions desktop), Tailwind v4 + project CSS  

**Storage**: Static files under `public/` / `assets/` (synced for build); no backend DB  

**Testing**: Manual visual + Lighthouse/Web Vitals cold-load baselines; `npm run build` + oxlint; no automated e2e suite required for this feature  

**Target Platform**: Modern desktop + mobile browsers; production on Vercel (`upraiser-site-v2` → `upraiser-site.vercel.app`)  

**Project Type**: Single-page marketing web application (SPA)  

**Performance Goals**: ≥20% faster time-to-usable Home (SC-001); Solutions first non-blank glass ≥20% faster or within 10% of baseline (SC-002); zero visual regressions on Hero/Solutions checklists  

**Constraints**: Preserve Hero Everest + dual-theme FX; preserve Solutions still→MP4 (no Suspense Still↔Video remount flash); no GSAP/ScrollTrigger on Solutions; mobile/reduced-motion must not force desktop WebGL; do not strip runtime deps from `package.json`  

**Scale/Scope**: ~10 live routes + legacy redirects; heavy assets: Everest GLBs, phone GLBs, 5 format MP4s + stills; dead candidates: unused page modules, `.tmp-*`, unused alternate phone GLBs  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Project `.specify/memory/constitution.md` is still a **template** (not ratified). Until ratified, gates are taken from **docs/HANDOFF.md §0 / §20** and live product constraints:

| Gate | Status | Notes |
|------|--------|-------|
| Dual theme = dual narrative preserved | PASS | Plan forbids theme/visual redesign |
| HeroFly + Lenis (no drei ScrollControls / GSAP) | PASS | No motion-stack swap |
| Solutions sticky + still→MP4 character | PASS | Explicit non-regression |
| App.tsx is route source of truth | PASS | Dead-page cleanup keyed off live routes |
| Do not strip three/R3F/router from package.json | PASS | Isolation via code-splitting, not dep removal |
| Prefer delete unused over speculative rewrites | PASS | P2 cleanup scoped to confirmed unused |

**Post-design re-check**: Still PASS — design artifacts do not introduce banned stacks or visual redesigns.

## Project Structure

### Documentation (this feature)

```text
specs/001-load-speed-refactor/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── home-hero-load.md
│   ├── solutions-glass-load.md
│   └── shipped-media.md
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks (not this command)
```

### Source Code (repository root)

```text
src/
├── App.tsx                          # Live route map + lazy pages
├── pages/                           # Route pages (purge unused modules)
├── components/
│   ├── Hero.tsx / hero-terrain/     # Everest + theme pipeline
│   ├── solutions/Phone3D.tsx …      # Glass chassis + preload
│   └── channel-visuals/…            # Mobile live feed
├── styles/                          # CSS (keep; no redesign)
└── data/                            # Content (untouched unless cleanup refs)

public/ + assets/                    # Media ship set (sync/verify on build)
scripts/
├── sync-assets.sh / verify-assets.sh
├── optimize-everest*.mjs
└── deploy-vercel.sh
```

**Structure Decision**: Single Vite SPA at repo root. Feature work touches route loading, Hero/Solutions load boundaries, and media/page cleanup — not a new package layout.

## Complexity Tracking

> No constitution violations requiring justification.
