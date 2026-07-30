# UPRAISER Site — Full AI Handoff Document

> **Purpose:** give another AI (or engineer) complete context to continue — including a **refactor-ready** map of current truth vs debt.  
> Human summary: [`README.md`](../README.md) · Solutions: [`SOLUTIONS.md`](./SOLUTIONS.md) · Hero 3D: [`HERO.md`](./HERO.md) · Assets: [`ASSETS.md`](./ASSETS.md) · Index: [`README.md`](./README.md).  
> **Updated:** 30 July 2026  
> **Local path:** `Upraiser New Website Cursor Project`  
> **Production:** https://upraiser-site.vercel.app  
> **Target domain:** https://upraiser.co.uk (SPA not on custom DNS yet)  
> **Brand doctrine:** [`BRAND-ASCENT.md`](./BRAND-ASCENT.md)  
> **HEAD (ship):** `e8ed2ef` (Solutions harden) · glass+MP4 `71ddab1` · sticky phone `c0572d8` · hero `95bcd27`  
> **Backups:** branch `backup/2026-07-23-evening` · zip `~/Downloads/Upraiser-site-backup-2026-07-23-evening.zip`

---

## 0. How to use this document

1. Read **§1–4** (who / dual-mode / **current** page map) before layout or copy edits.  
2. **Brand spirit (locked):** [`BRAND-ASCENT.md`](./BRAND-ASCENT.md) + [`.agents/product-marketing.md`](../.agents/product-marketing.md) — expedition IA, sacred CTAs/H1, Growth ↔ Infrastructure.  
3. Edit copy/metrics in `src/data/liveContent.ts` + `src/data/cases.ts` + `innerPagesData.ts` — avoid hardcoding unless Hero slogans.  
4. Preserve **dual theme = dual narrative** (`light` → growth, `dark` → infrastructure).  
5. **Do not** commit or deploy unless the human explicitly asks.  
6. Framer Motion **springs**; honour `prefers-reduced-motion`.  
7. Keep slogans: **«Charting the Ascent»** · Hero H1 **«We see how stunning / Your rise to the top / can be.»** · **Request Pilot** · **Ready to be Upraised?**  
8. UPRAISER = **agency / traffic operator** — not antifraud SaaS.  
9. UI polish → **refero-design** skill (research-first).  
10. Before a big refactor, read **§20 Refactor readiness** and trust **`App.tsx`** over stale comments.

---

## 1. Company & product

**UPRAISER Agency LLP** — London (since **17 July 2017**) premium **traffic infrastructure** / mobile & web UA.

| | |
|---|---|
| Verticals | iGaming, Fintech, premium media |
| Differentiator | Verified outcomes; pre-bid fraud filtration; **official Lenovo OEM partner** |
| Legal | 128 City Road, London EC1V 2NX · info@upraiser.co.uk · ICO **ZC000436** |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |

**Repo:** marketing SPA, English UI, B2B lead gen (Web3Forms).

---

## 2. Stack

| Layer | Choice |
|-------|--------|
| UI | React **19** + TypeScript |
| Build | Vite **8** · `engines.node: 22.x` |
| Styles | Tailwind **v4** + `src/styles/*.css` via `index.css` |
| Motion | Framer Motion **12** |
| Scroll | Lenis desktop; **native** on mobile/touch |
| Charts | Recharts (fold ambients) |
| 3D hero | `@react-three/fiber` + `@react-three/drei` + `three` (desktop) |
| Misc | `lucide-react`, `ogl` (SideRays), `react-router-dom` |
| Lint | oxlint |
| Host | Vercel **`upraiser-site-v2`** → `upraiser-site.vercel.app` |
| Contact | `VITE_WEB3FORMS_ACCESS_KEY` |

```bash
npm run dev
npm run build                 # sync → verify → tsc -b → vite
npm run deploy                # deploy-vercel.sh → upraiser-site-v2
npm run optimize:everest
npm run optimize:everest-light
npm run generate:og
npm run lint
```

**Critical:** do **not** strip runtime deps from `package.json`. Checkpoint `3fc2205` briefly removed three/r3f/router; Vercel `npm install` then emptied `node_modules` and broke deploy. Restored in `83a04c8`.

**Build requires:** `assets/brand/og-image.png`, `assets/hero/everest.glb`, `assets/hero/everest-light.glb` (+ synced public copies).

---

## 3. Dual theme = dual SiteMode (CRITICAL)

| `data-theme` | `SiteMode` | Meaning |
|--------------|------------|---------|
| `light` | `growth` | Scale, revenue, markets, ascent |
| `dark` | `infrastructure` | Logs, fraud, bid scoring, audit, proof |

**Wiring:** `ThemeProvider` · `upraiser-theme` · anti-flash in `index.html` · `useMode()` · `*ByMode` in `liveContent.ts`.

**Light paper (28 Jul):** `#ffffff` / cool elevates — **not** cream. Hero fog/haze cool white (`FOG.light` ≈ `#f4f6f9`).  
**Dark:** `#050504`.

| Control | Behavior |
|---------|----------|
| Header `ThemeToggle` | Toggle **in place** |
| Company / bridge strips | May toggle + scroll to hero |

Mode-aware bodies: **`ModeContentTransition`**. Header: frosted glass.

---

## 4. Site map — expedition IA (30 Jul 2026)

**Source of truth:** `src/App.tsx` + `navLinks` in `liveContent.ts`.  
**Brand doctrine:** [`BRAND-ASCENT.md`](./BRAND-ASCENT.md).

| Route | Nav label | Role | Dual-mode? |
|-------|-----------|------|------------|
| `/` | — | Pitch + killer folds | **Yes** |
| `/solutions` | **The Routes** | Format lanes + sticky phone glass | Soft (chassis + copy) |
| `/studio` | **The Gear** | Tech kit: Fixed Line · Oxygen · Map (`GEAR_CONTENT`) | **Yes** (Growth scale vs Infra audit) |
| `/craft` | **The Craft** | Full-spectrum: Creative Lab · Proprietary (`CRAFT_CONTENT`) | **Yes** |
| `/clients` | — | Client roster | Soft |
| `/company` | **The Expedition** | Leaders / story / Why Us | Soft |
| `/cases` · `/cases/:slug` | **The Peaks** | Archive + detail | Soft |
| `/contact` | **Request Pilot** | Final push | No |
| `/privacy` · `/terms` | Legal | Legal | No |

**Nav:** The Routes · The Gear · The Craft · The Peaks · The Expedition · theme · Request Pilot.

**Legacy redirects (keep for SEO until refactor decides):**

| From | To |
|------|----|
| `/expertise` | `/solutions` |
| `/clarity`, `/measurement`, `/technology` | `/solutions` helpers / retired Clarity |
| `/partners` | `/solutions?channel=oem#channels` |
| `/about`, `/how-we-work`, `/resources*` | `/company` |

**Flows:**
- Advertiser: `/` → `/solutions` (Routes) → `/contact`
- Gear depth: `/` → `/studio` → `/contact`
- Craft: `/` → `/craft` → `/contact`
- Proof: `/` → `/cases` (Peaks) → `/cases/:slug` → `/contact`
- Expedition: `/` → `/company` → `/contact`

**Solutions detail:** [`SOLUTIONS.md`](./SOLUTIONS.md).

```
SiteGrain · DeferredCustomCursor · Header
Outlet → routes above
PartnersCarousel · Footer
```

**Home (`/`):**
```
#hero (3D fly) → #audience → Difference → Process → Channels → Cases teaser → #promise → Pilot CTA
```

Killer folds (Audience / Promise) stay on **home**.

---

## 5. Scroll Scene System

`useScrollScene.ts` + `scrollScene.ts` · hero via `HeroFlyContext`.

| Mode | Used by | Behavior |
|------|---------|----------|
| HeroFly / runway | Hero | Lenis sticky; drives camera / beams / halo / bird / copy |
| runway | Promise | sticky fold desktop |
| anchor | Audience, Difference | viewport / grid |
| viewportBand | Process | band steps |
| in-view | Channels, Cases, Contact… | Reveal / Stagger |

**Gate:** desktop ≥768px + not reduced motion. Scroll transforms: **`spring: false`**. Charts: `useScrollMorph`.

---

## 6. Repository layout

```
/
├── README.md · docs/ (HANDOFF · HERO · ASSETS)
├── assets/                 → sync → public/
│   └── hero/everest.glb · everest-light.glb · brand/ · maps/
├── _local_drafts/          ← orphan drafts moved out of src (gitignored)
├── scripts/
│   ├── sync-assets.sh · verify-assets.sh · deploy-vercel.sh
│   ├── optimize-everest-glb.mjs · optimize-everest-light-glb.mjs
│   └── generate-og-image.mjs
└── src/
    ├── App.tsx             ← route source of truth
    ├── index.css           ← tokens (white light / charcoal dark)
    ├── styles/
    ├── context/            Theme · Scroll · HeroFly · CaseModal
    ├── data/               liveContent · cases · clients · partners · innerPagesData
    ├── lib/                heroModel · motion · scrollScene · accent · …
    ├── pages/              Home · Solutions · Clarity · Studio · Clients · Company · Cases · Contact · Legal · LegacyRedirects
    └── components/
        ├── Hero · HeroAtmosphere · Everest
        ├── hero-terrain/   Scene · Camera · Halo · Bird · Beams · Haze · Stars · Fog · Rim
        ├── solutions/      Phone3D · CssPhone · ProgrammaticScrollSection · FormatCopy · …
        └── …
```

---

## 7. Components (key)

### Hero (3D — 28 Jul)

| File | Role |
|------|------|
| `Hero.tsx` | Sticky stage, H1, stats, `HeroFlyProvider` |
| `HeroAtmosphere.tsx` | CSS sky; idle-lazy canvas |
| `hero-terrain/HeroTerrainCanvas.tsx` | R3F root |
| `hero-terrain/Scene.tsx` | Theme scene graph |
| `Everest.tsx` | Dark wire vs light photo GLB + planet bend |
| `hero-terrain/AscentHalo.tsx` | Camera-relative ice halo (light) |
| `hero-terrain/AscentBird.tsx` | Procedural soar silhouette (light) |
| `hero-terrain/BrandHazeSky.tsx` | Light sky dome |
| `hero-terrain/ScrollBeams.tsx` | Scroll spotlights (light) |
| `hero-terrain/NightStars.tsx` | Dark stars |
| `hero-terrain/StudioRimLight.tsx` | Light Environment / rim |
| `HeroFlyContext.tsx` | Runway progress |
| `lib/heroModel.ts` | URLs + Draco path |
| `LenovoTrustStrip.tsx` | Under hero |

**Art locks:** see [`HERO.md`](./HERO.md) (no Rayleigh Sky, no ground disc, bird ≠ GLB character, white light paper).

### Scroll folds

`AccentScrollFold` · `Audience` · `PromiseSection` · `ModeChart` · `FoldAreaMass` · `FraudScrollChart`

### Depth / IA pages

`SolutionsPage` + `components/solutions/*` · `ClarityReconcile` · `Studio` / `StudioCraftVisual` · `Clients` · `Company` · `CompanyFootprint` · `CompanyStoryTimeline` · `CaseStudies` · `CasesTeaser` · `Contact`  
(Expertise hub superseded by `/solutions` — see [`SOLUTIONS.md`](./SOLUTIONS.md).)

### Shell / motion

`Header` · `Footer` · `SmoothScroll` · `CustomCursor` · `ThemeToggle` · `motion/Reveal` · `Stagger` · `ModeContentTransition`

---

## 8. Hooks (current)

| Hook | Purpose |
|------|---------|
| `useMode` | theme → growth \| infrastructure |
| `useScrollScene` / `useScrollMorph` / `useSectionScrollProgress` | scroll systems |
| `useScrollRunwayEnabled` | desktop runway gate |
| `useReducedMotion` / `usePreferNativeScroll` | a11y / Lenis |
| `useViewportRoute` | route-aware viewport chrome |
| `useCountUp` / `useCarouselActiveIndex` | stats / carousels |
| `useInView` / `useInViewOnce` | IO |

---

## 9. Data layer

**Primary:** `src/data/liveContent.ts` — hero, folds, nav, footer, Lenovo, `*ByMode`.  
**Cases:** `cases.ts` · **Clients:** `clients.ts` · **Partners:** `partners.ts` · **Inner pages:** `innerPagesData.ts` · **Scroll ids:** `scrollSections.ts`.

Copy rules: UPRAISER ALL CAPS · You/Your capital Y · hard metrics · not antifraud SaaS.

---

## 10. Design tokens

`src/index.css` `@theme` + `[data-theme]`.  
Layout: `styles/base.css`. Motion: `lib/motion.ts` (`SPRING`, `SPRING_SOFT`).

---

## 11. Performance

- Lazy routes + idle preload on home  
- Manual chunks: framer-motion, lenis, recharts, three  
- Hero desktop-only; Draco; idle-mount canvas  
- Light GLB ~11MB — expected; dark ~1MB wire  

---

## 12. Contact

`.env` → `VITE_WEB3FORMS_ACCESS_KEY`. `Contact.tsx` + fields. Deploy script syncs to Vercel env.

---

## 13. Deploy / Vercel

| | |
|---|---|
| **URL** | https://upraiser-site.vercel.app |
| **Project** | **`upraiser-site-v2`** |
| **Team** | `alex-3152s-projects` |
| **GitHub** | `hmblps/upraiser-site` · `main` |
| **Author** | `alex@upraiser.co.uk` (verified) |

```bash
npm run deploy
```

**Last production:** 29 Jul 2026 — `/solutions` phone glass (still→MP4) + DPI/touch/transform harden (`e8ed2ef` / `71ddab1`).

---

## 14. Known gaps / polish backlog

### ⚠️ Theme switch ↔ textured light mountain — **SHIPPED 28 Jul**

Was: `key={theme}` remount + heavy light GLB + dark-only prefetch → dirty/late mountain.  
Now: single Canvas + `ThemeGlSync` + preload both + `hero-terrain-fade` veil. Optional later: compress light maps (2K/KTX2).

### UI polish audit (28 Jul) — next pass after theme fix

Prompt assumptions to **correct** before coding:

| Prompt said | Reality in repo |
|-------------|-----------------|
| `normalizeWheel: true` on Lenis | **Removed in Lenis 1.x** — not in API; use `wheelMultiplier` + avoid double `duration`+`lerp` |
| `smoothTouch: false` | Already ≈ `syncTouch` default false; Lenis **off** on mobile/coarse (`usePreferNativeScroll`) |
| PartnersCarousel / CasesTeaser Framer `drag="x"` | Partners = **CSS marquee**; CasesTeaser = **static grid**; real deck = **CaseStudies** native `overflow-x` + pointer hook |
| Sync Lenis rAF with R3F `useFrame` | Separate loops today; tear is mostly **triple lag** (Lenis → HeroFly +1 rAF → `MathUtils.damp`) |

**Priority backlog (do not touch HeroTerrainCanvas internals):**

1. **HIGH — `/cases` horizontal deck:** vertical→horizontal when `viewport-route` — **shipped** (`useHorizontalPointerScroll`)  
2. **HIGH — Fold ghosts under copy (768–1024):** clip left lane — **shipped** (`charts.css`)  
3. **HIGH — Case modal z-index:** `110` above header `100` — **shipped**  
4. **MED — Lenis feel:** single `lerp` + `wheelMultiplier: 1`; HeroFly sync publish — **shipped**  
5. **MED — Typography tokens:** fluid `--text-*`, fold padding tokens, ghost float keyframes, fold `dvh` — **shipped** (kickers still have some `text-[0.65rem]` leftovers)  
6. **LOW —** Partners marquee (non-interactive by design); hero short-viewport crowding; dead `setScrollLocked` API.

### Other product debt

1. Git → Vercel auto-deploy for `upraiser-site-v2`  
2. `og:image` host when `upraiser.co.uk` live  
3. Partner logos incomplete  
4. Case overlap review (Thing Or Two clients)  
5. ScrollBeams / halo / bird fine-tuning by taste  
6. Live copy pass  
7. Leftover `ascent-bird.glb` in assets/public (unused)  
8. Stale page files still under `src/pages/` (see §20)  
9. Docs hub — **done** (`docs/`)

---

## 15. Product direction — IA (shipped)

Expedition Basecamp IA. Doctrine: [`BRAND-ASCENT.md`](./BRAND-ASCENT.md).

| Route | Content |
|-------|---------|
| `/` | Hero 3D → ascent folds → Peaks teaser → Promise → Pilot |
| `/solutions` | **The Routes** — sticky format glass |
| `/studio` | **The Gear** — Fixed Line · Oxygen · Map (`GEAR_CONTENT`, dual-mode) |
| `/craft` | **The Craft** — Creative Lab · Proprietary Layer |
| `/company` | **The Expedition** — Leaders / Why Us / footprint |
| `/clients` | Clients |
| `/cases` | **The Peaks** |
| `/contact` | Request Pilot |

---

## 16. Recent decisions

### Jul 21–23

Scroll Scene System · ModeContentTransition · IA split v1 · deploy target `upraiser-site-v2`.

### Jul 25

R3F Everest fly · BrandHazeSky + ScrollBeams / NightStars · reject Rayleigh Sky · glass header.

### Jul 28

- Light → **white paper** + **photoreal** `everest-light.glb`  
- **AscentHalo** camera-relative ice ring  
- **AscentBird** atmospheric silhouette (GLB bird abandoned)  
- Restored maps + og-image for verify  
- Restored full `package.json` deps after accidental strip  
- Orphan unused components moved to `_local_drafts/` (gitignored)

### Jul 29

- **`/solutions` live again** (nav Solutions; `/expertise` redirects here)  
- Sticky phone: GLB still PNG → format MP4 on same materials (no Suspense flash)  
- Format feed MP4s + stills under `public/channels/programmatic-*`  
- DPI / touch / transform-only harden (`e8ed2ef`) — see [`SOLUTIONS.md`](./SOLUTIONS.md)  
- Docs hub + `SOLUTIONS.md`

---

## 17. Agent rules (owner)

- Commit / push / deploy **only when asked**  
- UI copy English; chat with owner may be Russian  
- No third scroll-moment / hero orbs without approval  
- Trust **App.tsx** + this file over stale HomePage comments  
- Prefer springs; check 21st.dev when relevant  
- Never strip three/R3F/router from package.json  

---

## 18. Quick “where do I change X?”

| Change… | File |
|---------|------|
| Hero copy / stats | `Hero.tsx`, `liveContent.ts` |
| Hero 3D / camera / FX | `hero-terrain/*`, `Everest.tsx`, [`HERO.md`](./HERO.md) |
| Halo / bird | `AscentHalo.tsx`, `AscentBird.tsx` |
| Model URLs | `lib/heroModel.ts` |
| Runway progress | `HeroFlyContext.tsx` |
| Routes / IA | `App.tsx`, `liveContent.ts` `navLinks` |
| Solutions glass / formats | `components/solutions/*`, [`SOLUTIONS.md`](./SOLUTIONS.md) |
| Section copy | `liveContent.ts` `*ByMode` |
| Theme colors | `index.css` |
| Home order | `HomePage.tsx`, `scrollSections.ts` |
| Deploy | `scripts/deploy-vercel.sh` |
| Assets | [`ASSETS.md`](./ASSETS.md), sync/verify scripts |

---

## 19. Sanity checklist

- [ ] `npm run build` (og + both Everest GLBs)  
- [ ] Light: white UI, photo mountain, halo, soft bird on scroll  
- [ ] Dark: wire + stars, no bird/halo/beams  
- [ ] Header theme stay-in-place  
- [ ] Nav hits Solutions / Clarity / Studio / Cases / Company  
- [ ] `/solutions` glass never blank; formats scroll-sync  
- [ ] Legacy URLs redirect (`/expertise` → Solutions)  
- [ ] Mobile: no WebGL  
- [ ] Deploy **upraiser-site-v2** · alias `upraiser-site.vercel.app`  
- [ ] `package.json` still lists three, R3F, router, recharts, lucide, ogl  

---

## 20. Refactor readiness (next pass)

Use this as the backlog when the owner says “рефактор”.

### A. Delete / quarantine (safe after confirming unused)

| Item | Why |
|------|-----|
| ~~`AboutPage.tsx`, `ExpertisePage.tsx`~~ | **Removed** on `001-load-speed-refactor` (dead; redirects remain) |
| ~~`PixelSnow`~~ | **Removed** (unused) |
| Local `ascent-bird*.glb` under assets | Unused; bird is procedural — keep gitignored `*.src.glb` |
| `_local_drafts/` | Already outside `src`; optional purge |
| Scratch `.tmp-*` / `videos/` (HyperFrames) | **gitignored** — do not ship |

### B. Consolidate

| Item | Why |
|------|-----|
| `LegacyRedirects` vs inline `Navigate` in `App.tsx` | One redirect table |
| `innerPagesData` vs `liveContent` overlap | Single content owner per surface |
| Hero CSS vs R3F fog colors | Keep one light clear/fog contract |
| Duplicate UI primitives (`BorderBeam`, SlideTabs paths) | Dedupe after draft purge |

### C. Harden for deploy

| Item | Why |
|------|-----|
| Connect GitHub → `upraiser-site-v2` auto-deploy | Avoid CLI-only |
| CI `npm run build` on PR | Catch stripped deps early |
| Document required GLB sizes / LFS if needed | `everest-light.glb` ~11MB |

### D. Do not regress in refactor

- HeroFly + Lenis (no drei ScrollControls / GSAP)  
- Dual narrative theme  
- Killer folds on home  
- Clarity/Studio IA routes + **live `/solutions`** + legacy redirects until SEO cutover  
- White light paper + photoreal light mountain + silhouette bird  
- Solutions still→MP4 glass pipeline (no Suspense Still↔Video remount)  

### E. Suggested refactor order

1. Theme/terrain swap — **shipped**  
2. UI polish pass (cases wheel, ghosts, modal z, Lenis, type tokens) — **shipped 28 Jul**  
3. Dead-page + dead-asset cleanup  
4. Content ownership pass (`liveContent` vs page data)  
5. Optional: remaining `text-[0.65rem]` kicker sweep  
6. DNS / OG / auto-deploy  
7. Docs hub — done (§21)  

---

## 21. Docs layout (**done — `docs/` hub**)

```
README.md                 # short human entry + links
docs/
  README.md               # index
  HANDOFF.md              # IA, stack, refactor (this file)
  SOLUTIONS.md            # /solutions sticky phone + format media
  HERO.md                 # 3D Everest only
  ASSETS.md               # media sync / verify
```

Root `AI_HANDOFF.md` / `CONTEXT.md` / `assets/README.md` are **stubs** that point here. Edit only under `docs/`.

---

*End of handoff. Update when architecture, IA, deploy, Solutions glass, or hero FX change — especially before a refactor.*
