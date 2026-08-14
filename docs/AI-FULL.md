# UPRAISER Site — Full AI Handoff & Architecture Document

> **Purpose:** Give another AI (or engineer) complete context to evaluate the state of the project, its architecture, look, and everything.  
> **Updated:** 14 August 2026  
> **Local path:** `НОВЫЙ САЙТ UPRAISER`  
> **Production:** https://upraiser.co.uk (Vercel alias · project **`upraiser-site-v2`**)  
> **Brand doctrine:** [`BRAND-ASCENT.md`](./BRAND-ASCENT.md)  
> **HEAD (committed):** `e951e9e` — brand aurora, simpler Expedition, Routes glass assets restored  
> **WIP (disk, not committed):** August 14 Antigravity/Gemini polish — bespoke fold charts, spacing/typography, home channels grid

---

## 1. Company & Product Context

**UPRAISER Agency LLP** — London-based (since 17 July 2017) premium **traffic infrastructure** for mobile & web UA.

| | |
|---|---|
| Verticals | iGaming, Fintech, premium media |
| Differentiator | Verified outcomes; pre-bid fraud filtration; official Lenovo OEM partner |
| Target audience | CMOs, Growth Leads, Founders looking for premium, verified traffic scaling |

UPRAISER = **agency / traffic operator** — not antifraud SaaS.

---

## 2. Technical Stack & Architecture

| Layer | Choice |
|-------|--------|
| UI | React **19** + TypeScript |
| Build | Vite **8** · `engines.node: 22.x` |
| Styles | Tailwind **v4** + `src/styles/*.css` via `index.css` |
| Motion | Framer Motion **12** (`type: "spring"`) |
| Scroll | Lenis desktop; **native** on mobile/touch |
| Charts | **Bespoke SVG** fold ambients (Framer scroll-morph); Recharts remains in deps but fold plots no longer use it |
| 3D hero | `@react-three/fiber` + `@react-three/drei` + `three` (desktop) |
| Misc | `lucide-react`, `ogl` (SideRays, ParityCausticsCanvas), `react-router-dom` |

**Architecture highlights:**

- **Dual theme = dual narrative:** `light` → Growth (scale, revenue); `dark` → Infrastructure (logs, fraud, audit). `useMode()` + CSS variables.
- **Fluid typography & spacing:** `clamp()` tokens in `base.css` / `typography.css`.
- **Scroll Scene System:** `useScrollScene.ts` — Lenis sticky runway vs native IO reveals.
- **Copy SOT:** `src/data/liveContent.ts`, `src/data/innerPagesData.ts`, `src/data/cases.ts`.

---

## 3. UI/UX Refinements (14 August 2026 — Antigravity / Gemini)

Premium technical polish pass. **On disk, pending commit** unless noted as shipped in `e951e9e`.

### 3.1 Spacing & typography (tokens)

| Token / class | Change |
|---------------|--------|
| `--section-y`, `--section-y-dense`, `--section-y-statement`, `--section-stack-gap` | Increased for more breathing room |
| `--card-pad`, `--card-pad-md` | `2rem` / `2.5rem` (cards use `p-8 lg:p-10` on home channels) |
| Headlines | Weights scaled back (800→700, 700→600) |
| `.copy` | `font-weight: 300`, `line-height: 1.6` |
| `.section-lead`, `.card-title`, `.stat-value` | Lighter weights for less “shouting” |

### 3.2 Home channels grid (`TrafficChannels.tsx`)

- Home teaser: **2×2 grid** (was 4 columns) — OEM, Programmatic, Performance + “Explore All 9 Lanes”.
- Desktop: **hover-reveal** — description + CTA collapse until `:hover` (wrap in `@media (hover: hover) and (pointer: fine)` via Tailwind `lg:` gates).
- Whole card clickable; CTA uses `stopPropagation`.

### 3.3 Fold charts — Recharts → bespoke SVG

| Component | Fold | Role |
|-----------|------|------|
| `ModeChart` (`FoldChart`) | Audience · growth | Catmull-Rom smooth dual lines, barcode tick layer, ghost bubbles, horizontal edge mask |
| `FraudScrollChart` | Audience · infra | Radial arcs; ghosts repositioned right (48–92%); arc drop-shadows |
| `InfrastructureGrid` | Audience · infra | Five curved SVG paths morph → flat order lines + floating ghost metrics (RAW LOGS, CLEANSED, …) |
| `CommitmentChart` | Promise · growth | Ascending Bezier stroke + barcode ticks + inline ghost metrics (DAY 7 ROAS, CPA HELD, …) |
| `ParityWaterChart` | Promise · infra | Gold invoice / red log mirror bars; lake scanlines on **data layer only**; `ParityCausticsCanvas` on top with `mix-blend-screen` |
| `FoldAreaMass` | Promise | Routes to `CommitmentChart` (growth) or `ParityWaterChart` (dark infra); outer ghost layer removed (charts own ghosts) |

**Layout (`charts.css`):** fold chart/area anchored `left: 52%`, `width: 46vw`, `top: 5%`, `bottom: -15%` — keeps copy lane clear on 768–1440.

**Ghost typography:** fold ambient numbers use **`IBM Plex Mono`** + breathing float (`GhostBubble` / `GhostBubbleMotion`).

### 3.4 Scroll fold rhythm (`accent-scroll.css`)

- Fold lite `min-height`: `125dvh` → **`100dvh`**
- Anchor sections: `min-height: 0 !important` (lite + dark)
- Anchor sticky: `min-height: clamp(320px, 45vh, 500px)`
- `#audience` / `#promise` quiet bands: top padding only (no bottom double-gap)
- Promise fold pair: `-mb-[14px]` micro-alignment in `PromiseSection.tsx`

### 3.5 Copy tweaks (`liveContent.ts` — disk)

**Audience · growth:** hero word **SCALE** (was PROOF); label/line1/description refreshed toward unit-economics / ROAS control.  
**Promise · clarity:** description extended with budget-confidence close.

---

## 4. Shipped 14 August 2026 (`e951e9e`)

| Feature | Files |
|---------|-------|
| **Brand Aurora** | `BrandAurora.tsx`, `brand-aurora.css`, `useBrandAuroraNav.ts` — Routes, Contact, Company, Cases; navbar glass via `data-brand-aurora="1"` |
| **Gradient trace borders** | `GradientTraceBorder.tsx` replaces BorderBeam on Lenovo strip, Contact, form fields |
| **Expedition simplification** | `Company.tsx`, `company/AscentCamps.tsx` — ascent camps visual, lean FAQ, plain CTA; less terminal/node noise |
| **Routes glass assets** | Restored `public/channels/programmatic-refs/screens/*.png`, `formats/*.mp4` after merge regression |

---

## 5. Current Site Map

| Route | Nav / role |
|-------|------------|
| `/` | Pitch + killer folds (Hero 3D → Audience → Difference → Process → Channels → Cases teaser → Promise → Pilot) |
| `/solutions` | **The Routes** — format lanes + sticky phone glass |
| `/studio` | **The Gear** — Fixed Line · Oxygen · Map |
| `/craft` | **The Craft** — Creative Lab · Proprietary Layer |
| `/company` | **The Expedition** — Ascent camps · lean story · FAQ |
| `/cases` | **The Peaks** — archive + detail |
| `/contact` | **Request Pilot** |

**Nav:** The Routes · The Gear · The Craft · The Peaks · The Expedition · theme · Request Pilot.

**Legacy redirects:** `/expertise` → `/solutions`; `/about` → `/company`; etc. (see [`HANDOFF.md`](./HANDOFF.md)).

---

## 6. Scroll Folds (home)

| Section | Growth (light) | Infrastructure (dark) | Ambient |
|---------|------------------|----------------------|---------|
| `#audience` | **SCALE** | **PROOF** | `FoldChart` / `FraudScrollChart` + `InfrastructureGrid` |
| `#promise` | **CLARITY** | **PARITY** | `CommitmentChart` / `ParityWaterChart` |

Promise section title: **Our Commitment**.

---

## 7. Hero 3D

- **Light:** Photoreal `everest-light.glb` (~11MB) · `AscentHalo` · `ScrollBeams` · `AscentBird` silhouette · cool white paper `#ffffff`.
- **Dark:** Wire `everest.glb` (~1MB) · `NightStars`.
- **Mobile / reduced motion:** CSS sky + `light-mountains-loop.mp4`; no WebGL.
- **Theme switch:** single Canvas + `ThemeGlSync` — do not remount with `key={theme}`.

Details: [`HERO.md`](./HERO.md).

---

## 8. Solutions (`/solutions`)

Sticky native scroll · GLB phone still→MP4 on same materials · format MP4s under `public/channels/`.  
Brand aurora on page shell. Details: [`SOLUTIONS.md`](./SOLUTIONS.md).

---

## 9. What You Should NOT Do

1. Do **not** add a third scroll-moment or hero orbs without explicit approval.
2. Do **not** strip runtime deps (`three`, `r3f`, `react-router`) from `package.json`.
3. Do **not** put generic Tailwind on surfaces that rely on BEM-style `src/styles/*.css` without checking existing patterns.
4. Do **not** commit or deploy unless the human explicitly asks.
5. Do **not** use generic marketing slop (“innovative”, “seamless”, “game-changer”). Ogilvy-style: verifiable infrastructure, hard metrics.
6. Wrap `:hover` styles in `@media (hover: hover) and (pointer: fine)`.
7. Sacred copy: **«Charting the Ascent»** · Hero H1 **«We see how stunning / Your rise to the top / can be.»** · **Request Pilot** · **Ready to be Upraised?**

---

## 10. Build & Deploy

```bash
npm run dev          # Vite (5173 or next free port)
npm run build        # sync-assets → verify → tsc → vite
npm run deploy       # → upraiser-site-v2 production
```

**Requires:** `assets/hero/everest.glb`, `assets/hero/everest-light.glb`, `assets/brand/og-image.png` (+ synced `public/` copies).  
**Env:** `VITE_WEB3FORMS_ACCESS_KEY` for contact.

---

## 11. AI Audit Checklist

1. **Aesthetics:** Premium, high-contrast, technical; hover gated for touch; ghost metrics don’t overlap body copy on 768–1024.
2. **Performance:** Hero 3D lazy + Draco; Lenis off on mobile; fold charts are SVG (no Recharts layout thrash).
3. **Dual narrative:** Theme toggle preserves expedition IA — Growth ↔ Infrastructure.
4. **Copy:** Edit `liveContent.ts` / `innerPagesData.ts` — not hardcoded JSX strings (except locked hero slogans).

*End of document. Human summary: [`README.md`](../README.md) · deep handoff: [`HANDOFF.md`](./HANDOFF.md).*
