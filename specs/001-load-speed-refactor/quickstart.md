# Quickstart Validation: Load Speed Refactor

**Feature**: `001-load-speed-refactor`  
**Date**: 2026-07-30

Validation guide for before/after measurements and visual parity. Implementation steps live in `tasks.md` (via `/speckit-tasks`).

## Prerequisites

- Node 22.x
- Repo root: Upraiser site
- Production reference: https://upraiser-site.vercel.app
- Contracts: [home-hero-load.md](./contracts/home-hero-load.md), [solutions-glass-load.md](./contracts/solutions-glass-load.md), [shipped-media.md](./contracts/shipped-media.md)

## Setup

```bash
npm install
npm run build
npm run preview
# or: npm run dev -- --host 127.0.0.1 --port 5173
```

## Baseline (do once before code changes)

1. Cold-load production `/` and `/solutions` (or local `preview` of current `main`).
2. Record for the same device/network:
   - Home: LCP + time until hero chrome/brand is readable
   - Solutions desktop: time until glass is non-blank (still or chassis)
3. Save numbers into a short note under this feature folder (e.g. `baseline.md`) — optional but recommended for SC-001/SC-002.

## Home validation

1. Cold-load `/`.
2. Confirm header + hero framing appear quickly (contract § Guarantees 1).
3. Desktop: wait for terrain; toggle theme — mountain + FX still correct (contract § 2–3).
4. Mobile or reduced-motion: coherent CSS hero, no hard dependency on WebGL (contract § 4).
5. Network: Solutions phone GLBs / format MP4s are **not** required before Home usable (contract § 5).

## Solutions validation

1. Cold-load `/solutions` desktop.
2. Confirm silhouette → glass without white flash; still then MP4 (contract § 1–2).
3. Scroll formats App Growth; switch OEM & CTV — parity with prod (contract § 3).
4. Mobile width / reduced-motion: CssPhone + feed (contract § 4).
5. Confirm no wheel-hijack / GSAP feel regression (contract § 6).

## Cleanup & build

1. `npm run build` succeeds.
2. Inspect `dist/` (or deploy output): no `.tmp-*`, no unused alternate phone drafts.
3. Hit live IA routes: Home, Solutions, Studio, Cases, Company, Clients, Contact.
4. Hit legacy redirects: `/clarity`, `/expertise`, `/measurement` → expected targets.

## Pass criteria

- Visual checklists for Home + Solutions: 100% pass.
- Load metrics meet SC-001 / SC-002 vs baseline.
- Shipped media contract satisfied.
- No new broken live routes.
