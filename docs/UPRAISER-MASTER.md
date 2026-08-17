# UPRAISER — Master Documentation (single file)

> **Единый документ** для человека и ИИ. Всё, что было разнесено по `AI-FULL`, `HANDOFF`, `SOLUTIONS`, `HERO`, `ASSETS`, `BRAND-ASCENT`, — собрано здесь.  
> **Updated:** 17 August 2026 (public repo, testing auto-deploy)  
> **Local path:** `НОВЫЙ САЙТ UPRAISER`  
> **Production:** [https://upraiser.co.uk](https://upraiser.co.uk) · Vercel `**upraiser-site-v2`**  
> **HEAD (committed):** `2e04d94` — Contact page layout fixes, form placeholders, charts polishing  
> **Next:** Polish remaining trust gaps and mobile typography  
> **Copy SOT (код):** `src/data/liveContent.ts` · `src/data/cases.ts` · `src/data/innerPagesData.ts`

---

## Содержание

1. [Как пользоваться](#1-как-пользоваться)
2. [Компания и продукт](#2-компания-и-продукт)
3. [Стек и сборка](#3-стек-и-сборка)
4. [Brand doctrine (заблокировано)](#4-brand-doctrine-заблокировано)
5. [Site map — текущая IA](#5-site-map--текущая-ia)
6. [Home — порядок секций](#6-home--порядок-секций)
7. [Dual theme = dual narrative](#7-dual-theme--dual-narrative)
8. [Header, footer, CTAs](#8-header-footer-ctas)
9. [Hero 3D (Everest fly)](#9-hero-3d-everest-fly)
10. [The Routes — sticky phone (`#routes`)](#10-the-routes--sticky-phone-routes)
11. [The Peaks — carousel (`#cases`)](#11-the-peaks--carousel-cases)
12. [Scroll folds (killer moments)](#12-scroll-folds-killer-moments)
13. [Scroll Scene System](#13-scroll-scene-system)
14. [Aug 14 polish (fold charts, typography)](#14-aug-14-polish-fold-charts-typography)
15. [Репозиторий — ключевые файлы](#15-репозиторий--ключевые-файлы)
16. [Assets и media](#16-assets-и-media)
17. [Deploy](#17-deploy)
18. [Marketing audit (advisory)](#18-marketing-audit-advisory)
19. [Не делать / sacred copy](#19-не-делать--sacred-copy)
20. [Refactor backlog](#20-refactor-backlog)
21. [Sanity checklist](#21-sanity-checklist)
22. [Quick reference — где менять X](#22-quick-reference--где-менять-x)

---

## 1. Как пользоваться

1. **IA и роуты** — доверяй `src/App.tsx` + `navLinks` в `liveContent.ts`, не устаревшим комментариям в page-файлах.
2. **Copy** — правь в `liveContent.ts` / `cases.ts` / `innerPagesData.ts`. Hero H1 и sacred CTAs — только с явного разрешения владельца.
3. **Commit / deploy** — **только по явной просьбе** владельца.
4. **Motion** — Framer Motion `type: "spring"`; уважай `prefers-reduced-motion`.
5. **Hover** — только в `@media (hover: hover) and (pointer: fine)`.
6. UPRAISER = **agency / traffic operator**, не antifraud SaaS.

---

## 2. Компания и продукт

**UPRAISER Agency LLP** — London (since **17 July 2017**) premium **traffic infrastructure** / mobile & web UA.


|                |                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Verticals      | iGaming, Fintech, premium media                                                                       |
| Differentiator | Verified outcomes; pre-bid fraud filtration; **official Lenovo OEM partner**                          |
| Legal          | 128 City Road, London EC1V 2NX · [info@upraiser.co.uk](mailto:info@upraiser.co.uk) · ICO **ZC000436** |
| LinkedIn       | [https://www.linkedin.com/company/upraiser/](https://www.linkedin.com/company/upraiser/)              |
| Contact form   | Web3Forms · `VITE_WEB3FORMS_ACCESS_KEY`                                                               |


**Repo:** marketing SPA, English UI, B2B lead gen.

---

## 3. Стек и сборка


| Layer   | Choice                                                         |
| ------- | -------------------------------------------------------------- |
| UI      | React **19** + TypeScript                                      |
| Build   | Vite **8** · `engines.node: 22.x`                              |
| Styles  | Tailwind **v4** + `src/styles/*.css` via `index.css`           |
| Motion  | Framer Motion **12**                                           |
| Scroll  | Lenis desktop; **native** on mobile/touch                      |
| Charts  | Bespoke SVG fold ambients; Recharts in deps, unused on folds   |
| 3D hero | `@react-three/fiber` + `@react-three/drei` + `three` (desktop) |
| Misc    | `lucide-react`, `ogl`, `react-router-dom`                      |
| Lint    | oxlint                                                         |


```bash
npm install
cp .env.example .env          # VITE_WEB3FORMS_ACCESS_KEY
npm run dev                   # localhost:5173 или следующий свободный порт
npm run build                 # sync-assets → verify → tsc → vite
npm run deploy                # → upraiser-site-v2 production
npm run optimize:everest
npm run optimize:everest-light
npm run generate:og
npm run lint
```

**Critical:** не удаляй runtime deps из `package.json` (`three`, `r3f`, `react-router`) — Vercel `npm install` сломается.

**Build requires:** `assets/hero/everest.glb`, `assets/hero/everest-light.glb`, `assets/brand/og-image.png` (+ sync в `public/`).

---

## 4. Brand doctrine (заблокировано)

UPRAISER = **expedition brand**: poetic ascent (Zero-like atmosphere) + operator proof (receipts, logs, OEM).


| Keep forever                                                | Never default to              |
| ----------------------------------------------------------- | ----------------------------- |
| Hero H1: *We see how stunning Your rise to the top can be.* | Utility-only H1               |
| *UPRAISER · Charting the Ascent*                            | Generic SaaS voice            |
| **Request Pilot**                                           | Get a demo / Start free trial |
| **Ready to be Upraised?**                                   | Contact sales                 |
| Dual theme Growth ↔ Infrastructure                          | Single flat message           |
| Capital **You / Your**                                      | Random casing                 |
| Everest hero + Routes glass (still→MP4)                     | Card-dashboard homepage       |
| Agency / traffic desk                                       | “AI fraud platform”           |


**Lexicon:** Ascent · Velocity · Fixed lines · Oxygen · The Map · The Craft · Brief the route · Death Zone · Expedition Leaders.

**Avoid:** innovative, ecosystem, seamless, leverage, cutting-edge.

**Hero pattern:** Poem (H1) → lede by mode → stats + Lenovo dock.

---

## 5. Site map — текущая IA

**Source of truth:** `src/App.tsx` + `navLinks` / `footerLinks` в `liveContent.ts`.

### Live routes


| Route / anchor        | Label              | Role                                    |
| --------------------- | ------------------ | --------------------------------------- |
| `/`                   | **The Basecamp**   | Полный pitch                            |
| `/#routes`            | **The Routes**     | Sticky phone + format lanes             |
| `/#cases`             | **The Peaks**      | Full carousel + modals                  |
| `/#pilot`             | —                  | Request Pilot (после dual-story unlock) |
| `/craft`              | **The Craft**      | Under construction stub                 |
| `/company`            | **The Expedition** | Ascent camps · FAQ · Brand Aurora       |
| `/contact`            | **Request Pilot**  | Contact form                            |
| `/cases/:slug`        | —                  | Deep-link modal на home                 |
| `/privacy` · `/terms` | Legal              | Legal                                   |


### Legacy redirects (SEO — не удалять)


| From                                             | To                 |
| ------------------------------------------------ | ------------------ |
| `/solutions`, `/studio`, `/clarity`, `/partners` | `/#routes`         |
| `/cases`, `/clients`                             | `/#cases`          |
| `/expertise`                                     | chain → `/#routes` |
| `/about`, `/how-we-work`, `/resources*`          | `/company`         |
| `/rigging`                                       | `/craft`           |


### User flows

- **Advertiser:** `/` → scroll Routes + Peaks → `#pilot` → `/contact`
- **Expedition:** `/` → `/company` → `/#pilot`
- **Case proof:** `/` → `#cases` → card → `/cases/:slug` modal → close → `/#cases`
- **Craft (future):** `/craft` (stub) → `/`

---

## 6. Home — порядок секций

`HomePage.tsx`:

```
#hero (3D fly)
→ PartnersCarousel
→ #audience (killer fold)
→ Process
→ #routes (HomeRoutesSection — sticky phone)
→ #cases (CaseStudies variant="home")
→ #promise (killer fold)
→ #pilot (HomePilotCta)
```

Lazy + idle preload: Audience → Process/Routes/Cases → Promise.

Killer folds (Audience / Promise) — **только на home**.

---

## 7. Dual theme = dual narrative


| `data-theme` | `SiteMode`       | Meaning                                |
| ------------ | ---------------- | -------------------------------------- |
| `light`      | `growth`         | Scale, revenue, markets, ascent        |
| `dark`       | `infrastructure` | Logs, fraud, bid scoring, audit, proof |


**Wiring:** `ThemeProvider` · `upraiser-theme` · anti-flash в `index.html` · `useMode()` · `*ByMode` в `liveContent.ts`.

**Light paper:** `#ffffff` (не cream). **Dark:** `#050504`.

Mode-aware bodies: `**ModeContentTransition**`.


| Fold     | Growth      | Infrastructure |
| -------- | ----------- | -------------- |
| Audience | **SCALE**   | **PROOF**      |
| Promise  | **CLARITY** | **PARITY**     |


---

## 8. Header, footer, CTAs

### Header (disk WIP)


| File            | Role                                            |
| --------------- | ----------------------------------------------- |
| `Header.tsx`    | Logo · HeaderNav · LocaleSwitcher · ThemeToggle |
| `HeaderNav.tsx` | Centered 3-link nav                             |
| `rails.css`     | Grid `1fr | auto | 1fr`                         |


**Nav:** The Craft · The Basecamp · The Expedition — по центру.  
Справа: locale + theme. **Нет** hamburger · **нет** Request Pilot.

### Footer explore

The Basecamp · The Routes (`/#routes`) · The Peaks (`/#cases`) · The Craft · The Expedition.  
**Нет** Request Pilot в footer.

### Request Pilot — где живёт


| Место                                       | Есть?                    |
| ------------------------------------------- | ------------------------ |
| `#pilot` на home (`HomePilotCta`)           | ✅ после unlock обеих тем |
| `/contact`                                  | ✅ форма                  |
| Company CTA → `/#pilot`                     | ✅                        |
| Header / footer / Cases chrome / case modal | ❌ убрано (Aug 14 IA)     |


`HomePilotCta`: пока пользователь не видел обе темы — показывает bridge «Switch to Infrastructure/Growth»; после — **Ready to be Upraised?** + Request Pilot.

---

## 9. Hero 3D (Everest fly)

**Status:** SHIPPED — desktop sticky Lenis runway + R3F Everest. Mobile = MP4, no WebGL.

### Theme FX


| Theme     | Terrain                                         | FX                                                                                                      |
| --------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Light** | Photo `everest-light.glb` (~11MB) · white paper | `BrandHazeSky` · `ScrollBeams` · `AscentHalo` · `AscentBird` (procedural silhouette) · `StudioRimLight` |
| **Dark**  | Wire `everest.glb` (~1MB)                       | `NightStars` · no halo/bird/beams                                                                       |


### Key files


| File                 | Role                                       |
| -------------------- | ------------------------------------------ |
| `Hero.tsx`           | Sticky stage, H1, stats, `HeroFlyProvider` |
| `HeroAtmosphere.tsx` | CSS sky + mobile MP4; idle-lazy canvas     |
| `hero-terrain/*`     | R3F scene graph                            |
| `Everest.tsx`        | Theme-switched GLB                         |
| `HeroFlyContext.tsx` | Runway → `progressRef`                     |
| `lib/heroModel.ts`   | URLs + Draco                               |


### Art locks (не ломать)

1. Light UI = **white paper** `#ffffff`, cool haze — не cream, не Rayleigh `Sky`.
2. **No ground disc** under mountain.
3. **Halo** camera-relative — не world-pinned sticker.
4. **Bird** = procedural silhouette, не flappy GLB.
5. **Theme switch:** single Canvas + `ThemeGlSync` — **не** `key={theme}` remount.
6. **No GSAP** / drei `useScroll` for hero.

### Mobile

`HeroAtmosphere` → `light-mountains-loop.mp4` + posters. No WebGL.

---

## 10. The Routes — sticky phone (`#routes`)

**Primary:** `HomeRoutesSection.tsx` на `/`.  
**Legacy:** `SolutionsPage.tsx`; `/solutions` → `/#routes`.

### Lanes


| Lane       | Source                                   |
| ---------- | ---------------------------------------- |
| App Growth | `AD_FORMATS` in `ProgrammaticFormats.ts` |
| OEM & CTV  | `OEM_CTV_FORMATS`                        |


Native scroll drives active format. Desktop: R3F iPhone GLB. Mobile: stacked cards + `CssPhone` + live HTML feed.

### Key files


| Path                                            | Role                    |
| ----------------------------------------------- | ----------------------- |
| `home/HomeRoutesSection.tsx`                    | Home embed              |
| `solutions/ProgrammaticScrollSection.tsx`       | Desktop sticky runway   |
| `solutions/ProgrammaticScrollSectionMobile.tsx` | Mobile / reduced motion |
| `hooks/useFormatScrollSection.ts`               | Lenis-aware progress    |
| `hooks/useRoutesLane.ts`                        | Lane state + copy       |
| `RoutesLaneSwitcher.tsx`                        | App Growth / OEM tabs   |
| `lib/formatScroll.ts`                           | Runway height helpers   |
| `solutions/Phone3D.tsx`                         | GLB · still PNG → MP4   |
| `programmatic-scroll-section.css`               | Sticky layout           |


### Glass pipeline

1. **Still:** `public/channels/programmatic-refs/screens/{banner,native,interstitial,rich-media,video}.png`
2. **Video:** `public/channels/programmatic-feed/formats/*.mp4` — same screen materials (no Suspense remount).
3. **Live HTML:** `ProgrammaticFullFeed` on `CssPhone` (mobile).

**Chassis GLBs:** `/phones/deep-blue.glb` (light) · `/phones/orange.glb` (dark).

**Do not:** GSAP ScrollTrigger; Suspense Still↔Video remount (white flash).

---

## 11. The Peaks — carousel (`#cases`)

**Component:** `CaseStudies.tsx` · `variant="home"`.


| Behavior            | Home embed                                           | Legacy viewport page         |
| ------------------- | ---------------------------------------------------- | ---------------------------- |
| Vertical scroll     | **Passes through**                                   | Locked when `viewport-route` |
| Wheel hijack        | **Off** (`wheel: false`)                             | On when viewport-locked      |
| Touch               | `touch-action: auto` (`.cases-carousel--page-embed`) | `pan-x`                      |
| Lenis prevent-touch | **Off**                                              | On                           |


**Interaction на home:** drag мышью, ← →, dots, горизонтальный свайп. **Не** перехватывает вертикальный скролл страницы.

**Modals:** `/cases/:slug` на `HomePage`; close → `/#cases` (`CaseModalContext`).

**Hook:** `useHorizontalPointerScroll.ts` · `mapVertical={false}` на home.

---

## 12. Scroll folds (killer moments)


| Section     | Growth ambient          | Infrastructure ambient                      |
| ----------- | ----------------------- | ------------------------------------------- |
| `#audience` | `ModeChart` (SVG lines) | `FraudScrollChart` + `InfrastructureGrid`   |
| `#promise`  | `CommitmentChart`       | `ParityWaterChart` + `ParityCausticsCanvas` |


Promise title: **Our Commitment**.  
**Не добавлять третий scroll-moment** без явного approval.

Fold layout (`charts.css`): chart anchored `left: 52–54%`, `width: 46vw` — copy lane clear 768–1440.

---

## 13. Scroll Scene System

`useScrollScene.ts` + `scrollScene.ts` · hero via `HeroFlyContext`.


| Mode             | Used by        | Behavior                  |
| ---------------- | -------------- | ------------------------- |
| HeroFly / runway | Hero           | Lenis sticky; camera / FX |
| runway           | Promise        | sticky fold desktop       |
| anchor           | Audience       | viewport / grid           |
| viewportBand     | Process        | band steps                |
| in-view          | Routes, Cases… | Reveal / Stagger          |
| format scroll    | `#routes`      | `useFormatScrollSection`  |


**Gate:** desktop ≥768px + not reduced motion для heavy scenes. Scroll transforms: `**spring: false`**.

---

## 14. Aug 14 polish (fold charts, typography)

### Committed (`e17776c`)


| Area        | Change                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Fold charts | Recharts → bespoke SVG: `CommitmentChart`, `ModeChart`, `InfrastructureGrid`, `ParityWaterChart` |
| Typography  | Headline weights down; `.copy` weight 300; section spacing up                                    |
| IA          | Routes + Peaks на home; slim nav; legacy redirects                                               |
| PROOF chart | Radial positioned `left: 54%`                                                                    |


### Basecamp commit (evening — after `e17776c`)


| Area          | Change                                                            |
| ------------- | ----------------------------------------------------------------- |
| Header        | `HeaderNav.tsx` — centered 3-link nav, no hamburger               |
| Routes scroll | `useFormatScrollSection`, `formatScroll.ts`, mobile section split |
| Cases scroll  | `cases-carousel--page-embed`, `wheel: false` on home              |
| Craft         | `UnderConstruction` at `/craft`                                   |
| Process CTA   | → `/#pilot`                                                       |
| Docs          | `UPRAISER-MASTER.md` single-file SoT                              |

### Contact page & Charts polish (Night — commit `2e04d94`)

| Area          | Change                                                            |
| ------------- | ----------------------------------------------------------------- |
| Contact Form  | Removed duplicate `ViewportChrome` header; fixed layout overlap   |
| Contact Form  | Removed placeholders (`Select Type...`) and set default valid opt |
| Charts        | Fixed `CommitmentChart` pulse ring dot (border-radius: 50%)       |
| Charts        | Increased `fold-area` padding-bottom to 35% to prevent clipping   |
| Router        | Fixed ContactPage crash by removing invalid `useScrollToHash`     |
| Viewport      | Added `padding-top: var(--site-header-height)` to avoid header    |

---

## 15. Репозиторий — ключевые файлы

```
src/
├── App.tsx                         ← routes
├── pages/
│   ├── HomePage.tsx                ← pitch
│   ├── CraftPage.tsx               ← stub
│   ├── CompanyPage.tsx
│   ├── ContactPage.tsx
│   └── SolutionsPage.tsx           ← legacy
├── components/
│   ├── Header.tsx · HeaderNav.tsx
│   ├── home/HomeRoutesSection.tsx
│   ├── CaseStudies.tsx
│   ├── HomePilotCta.tsx
│   ├── solutions/ProgrammaticScrollSection*.tsx
│   └── hero-terrain/*
├── hooks/
│   ├── useFormatScrollSection.ts
│   ├── useRoutesLane.ts
│   └── useHorizontalPointerScroll.ts
├── data/liveContent.ts             ← copy + nav SOT
└── context/CaseModalContext.tsx
```

### Hooks


| Hook                                         | Purpose                         |
| -------------------------------------------- | ------------------------------- |
| `useMode`                                    | theme → growth | infrastructure |
| `useScrollScene` / `useScrollMorph`          | scroll systems                  |
| `useFormatScrollSection`                     | Routes sticky (Lenis-aware)     |
| `useRoutesLane`                              | lane tabs + copy                |
| `useHorizontalPointerScroll`                 | Cases carousel                  |
| `useReducedMotion` / `usePreferNativeScroll` | a11y                            |
| `useBrandAuroraNav`                          | depth-page aurora               |


### Styles (`src/index.css` → `src/styles/`)

`base.css` · `accent-scroll.css` · `hero.css` · `charts.css` · `programmatic-scroll-section.css` · `brand-aurora.css` · `depth-pages.css` · `cross-platform.css` · `rails.css` · …

---

## 16. Assets и media

Master: `**assets/**` → `scripts/sync-assets.sh` → `**public/**`.  
`scripts/verify-assets.sh` fails build if required files missing.


| Path                             | Deployed as               | Required          |
| -------------------------------- | ------------------------- | ----------------- |
| `assets/hero/everest.glb`        | `/hero/everest.glb`       | Yes — dark wire   |
| `assets/hero/everest-light.glb`  | `/hero/everest-light.glb` | Yes — light photo |
| `assets/brand/og-image.png`      | `/og-image.png`           | Yes               |
| `assets/brand/upraiser-logo.png` | `/upraiser-logo.png`      | Yes               |
| `assets/maps/world-dots-*.svg`   | `/maps/*`                 | Yes — Company map |


**Also in `public/`:** Draco WASM · case logos · partner marks · phone GLBs · `channels/programmatic-`* (Routes glass).

**Not shipped:** `assets/hero/*.src.glb` (gitignored) · `ascent-bird.glb` (unused) · `videos/solutions-pilot/` (local HyperFrames) · root `measure_*.js` scratch scripts.

```bash
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh
npm run optimize:everest
npm run optimize:everest-light
npm run generate:og
```

---

## 17. Deploy


|             |                                                  |
| ----------- | ------------------------------------------------ |
| **URL**     | [https://upraiser.co.uk](https://upraiser.co.uk) |
| **Project** | `upraiser-site-v2`                               |
| **Team**    | `alex-3152s-projects`                            |
| **Repo**    | `github.com/hmblps/upraiser-site` · `main`       |
| **Author**  | `alex@upraiser.co.uk`                            |


```bash
npm run deploy
```

**Blockers:** missing GLBs/og-image · stripped package.json deps · unverified git author email.

---

## 18. Marketing audit (advisory)

**Not SOT** — proposals only. Live copy = `liveContent.ts`.


| Area             | Recommendation                                                      |
| ---------------- | ------------------------------------------------------------------- |
| Hero             | Optional: render `heroLede` under H1 (annotate poem, don't replace) |
| Audience         | KEEP; optional light trim on infra body length                      |
| Process          | KEEP                                                                |
| Routes `#routes` | KEEP glass; optional format bullet variety                          |
| Peaks `#cases`   | KEEP; optional headline scan pass on mobile                         |
| Promise          | KEEP CLARITY/PARITY — do not soften                                 |
| Pilot `#pilot`   | KEEP dual-story gate + earned CTA                                   |
| Contact          | KEEP Request Pilot + Ready to be Upraised?                          |


**Out of scope:** replace H1 · generic CTAs · restore Request Pilot to header.

---

## 19. Не делать / sacred copy

1. Третий scroll-moment / hero orbs без approval.
2. Commit / deploy без просьбы.
3. Vertical wheel hijack на home Cases.
4. GSAP / ScrollTrigger на Routes.
5. Suspense remount Still↔Video на phone glass.
6. `key={theme}` на hero Canvas.
7. Stripping `three` / R3F / router from `package.json`.
8. Generic slop: innovative, seamless, game-changer.
9. `:hover` без fine-pointer media query.

**Sacred copy:**

- **«Charting the Ascent»**
- Hero H1: **«We see how stunning / Your rise to the top / can be.»**
- **Request Pilot**
- **Ready to be Upraised?**

---

## 20. Refactor backlog

### Safe to quarantine


| Item                | Why                     |
| ------------------- | ----------------------- |
| `SiteMenu.tsx`      | Hamburger removed       |
| `CasesPage.tsx`     | `/cases` redirects home |
| `SolutionsPage.tsx` | `/solutions` redirects  |
| Root `measure_*.js` | Debug scratch           |


### Consolidate (optional)


| Item                                                   | Why                  |
| ------------------------------------------------------ | -------------------- |
| `LegacyRedirects` vs inline `Navigate`                 | One redirect table   |
| `innerPagesData` vs `liveContent` overlap              | Single content owner |
| Split `programmatic-scroll-section.css` (~1000+ lines) | Maintainability      |


### Do not regress

- HeroFly + Lenis (no GSAP)
- Dual narrative theme
- Killer folds on home
- Routes still→MP4 glass
- Home Cases vertical scroll pass-through
- White light paper + photo mountain + silhouette bird
- Legacy redirects until SEO cutover

### Open product debt

1. Commit disk WIP when owner asks
2. Git → Vercel auto-deploy
3. `og:image` absolute URL → `upraiser.co.uk` in meta
4. Partner logos incomplete
5. Live copy pass

---

## 21. Sanity checklist

- [ ] `npm run build`
- [ ] Light: white UI, photo mountain, halo, bird on scroll
- [ ] Dark: wire + stars
- [ ] Header: Craft · Basecamp · Expedition centered
- [ ] `/solutions`, `/cases` redirect to home hashes
- [ ] `#routes` glass never blank; formats scroll-sync
- [ ] `#cases` vertical scroll passes through on home
- [ ] `/cases/:slug` opens modal; close → `/#cases`
- [ ] Request Pilot only on `#pilot` + `/contact`
- [ ] Mobile: no WebGL hero
- [ ] Deploy **upraiser-site-v2** · alias `upraiser.co.uk`
- [ ] `package.json` lists three, R3F, router

---

## 22. Quick reference — где менять X


| Change…               | File                                               |
| --------------------- | -------------------------------------------------- |
| Hero copy / stats     | `Hero.tsx`, `liveContent.ts`                       |
| Hero 3D / camera / FX | `hero-terrain/*`, `Everest.tsx`                    |
| Nav / footer IA       | `liveContent.ts` `navLinks`, `footerLinks`         |
| Routes / formats      | `HomeRoutesSection.tsx`, `components/solutions/*`  |
| Cases carousel        | `CaseStudies.tsx`, `useHorizontalPointerScroll.ts` |
| Section copy          | `liveContent.ts` `*ByMode`                         |
| Home order            | `HomePage.tsx`                                     |
| Theme colors          | `index.css`                                        |
| Routes / redirects    | `App.tsx`                                          |
| Deploy                | `scripts/deploy-vercel.sh`                         |
| Assets                | `scripts/sync-assets.sh`, `assets/`                |


---

*End of master document. При изменении IA, hero, Routes glass или deploy — обновляй этот файл.*