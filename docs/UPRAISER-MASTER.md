# UPRAISER — Master Documentation (single file)

> **Единый документ** для человека и ИИ. Других проектных `.md` нет — только этот файл + короткий `README.md` на GitHub.  
> **Updated:** 7 September 2026 (evening)  
> **Local path:** `НОВЫЙ САЙТ UPRAISER`  
> **Production:** [https://upraiser.co.uk](https://upraiser.co.uk) · Vercel `upraiser-site-v2`  
> **HEAD:** this ritual — light home JPEG recapture, lite flash fix, PROOF ghosts (see §25) 
> **Copy SOT (код):** `src/data/liveContent.ts` · `src/data/cases.ts` · `src/data/innerPagesData.ts` · `src/data/clients.ts`  
> **Brand doctrine:** §4 ниже (файл `docs/BRAND-ASCENT.md` удалён).

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
10. [The Routes — Every Format. One Supply Path. (`#routes`)](#10-the-routes--every-format-one-supply-path-routes)
11. [The Peaks — carousel (`#cases`)](#11-the-peaks--carousel-cases)
12. [Scroll folds (killer moments)](#12-scroll-folds-killer-moments)
13. [Scroll Scene System](#13-scroll-scene-system)
14. [Shipped polish log](#14-shipped-polish-log)
15. [Репозиторий — ключевые файлы](#15-репозиторий--ключевые-файлы)
16. [Assets и media](#16-assets-и-media)
17. [Deploy, backup, commit](#17-deploy-backup-commit)
18. [Marketing audit (advisory)](#18-marketing-audit-advisory)
19. [Не делать / sacred copy](#19-не-делать--sacred-copy)
20. [Refactor backlog](#20-refactor-backlog)
21. [Sanity checklist](#21-sanity-checklist)
22. [Quick reference — где менять X](#22-quick-reference--где-менять-x)
23. [Windows + dark-theme ops](#23-windows--dark-theme-ops)
24. [Cross-platform prompt](#24-cross-platform-prompt)
25. [Antigravity handoff](#25-antigravity-handoff)
26. [Pre-launch checklist](#26-pre-launch-checklist)
27. [Recent Session Logs (September 2026)](#27-recent-session-logs-september-2026)

---

## 1. Как пользоваться

1. **IA и роуты** — доверяй `src/App.tsx` + `navLinks` в `liveContent.ts`, не устаревшим комментариям в page-файлах.
2. **Copy** — правь в `liveContent.ts` / `cases.ts` / `innerPagesData.ts`. Hero H1 и sacred CTAs — только с явного разрешения владельца.
3. **Commit / deploy** — **только по явной просьбе** владельца.
4. **Motion** — Framer Motion `type: "spring"`; уважай `prefers-reduced-motion`.
5. **Hover** — только в `@media (hover: hover) and (pointer: fine)`.
6. UPRAISER = **agency / traffic operator**, не antifraud SaaS.
7. **Документация** — только этот файл. Скиллы агентов (`.agents/skills`, `.claude/skills`) не трогать и **не коммитить** дампы.
8. **Продолжение в другом агенте** — читай §25, потом §9 / §10 / §17. Не поднимай удалённые `docs/*.md`.

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


| Route / anchor        | Label                | Role                                                          |
| --------------------- | -------------------- | ------------------------------------------------------------- |
| `/`                   | **The Agency**       | Полный pitch (hero + folds + AboutUs + pilot)                 |
| `/#routes`            | **The Routes** (CTA) | CSS `ChannelsCtaSection` → `/channels` (не 3D formats)        |
| `/#cases`             | **The Peaks**        | Full carousel + modals                                        |
| `/#pilot`             | —                    | Request Pilot (после dual-story unlock)                       |
| `/channels`           | — (не в header)      | 3D `ProgrammaticScrollSection` · Phone/Tablet/TV              |
| `/craft`              | **Creative Studio**  | Under construction stub (`noindex`)                           |
| `/contact`            | **Request Pilot**    | Contact form                                                  |
| `/contact/sent`       | —                    | Thank-you after Web3Forms                                     |
| `/cases/:slug`        | —                    | Deep-link modal на home                                       |
| `/privacy` · `/terms` | Legal                | Legal                                                         |
| `/dev/hero-capture`   | DEV only             | Everest frame capture                                         |

**Нет живых страниц** `/expedition`, `/company`, `/solutions`. Footer всё ещё пишет «The Basecamp» на `/` — label отстаёт от header.

### Legacy redirects (SEO — не удалять)


| From                                             | To                         |
| ------------------------------------------------ | -------------------------- |
| `/solutions`, `/studio`, `/clarity`, `/partners` | `/#routes` (home CTA fold) |
| `/cases`, `/clients`                             | `/#cases`                  |
| `/expertise`                                     | chain → `/#routes`         |
| `/about`, `/how-we-work`, `/resources*`, `/company` | `/`                     |
| `/rigging`                                       | `/craft`                   |


### User flows

- **Advertiser:** `/` → `#routes` CTA → `/channels` (formats) → back `#cases` → `#pilot` → `/contact`
- **About / Expedition:** `/` → `AboutUsSection` (перед `#pilot`) — отдельной страницы нет
- **Case proof:** `/` → `#cases` → card → `/cases/:slug` modal → close → `/#cases`
- **Craft (future):** `/craft` (stub) → `/`

---

## 6. Home — порядок секций

`HomePage.tsx` (live, Sept 2026):

```
#hero (3D fly, eager desktop)
→ PartnersCarousel          React.Suspense
→ #audience                 Audience
→ #process                  Process
→ #routes                   ChannelsCtaSection (CSS glass cards → /channels)
→ #cases                    CaseStudies
→ Outlet                    case modal /cases/:slug
→ #promise                  PromiseSection
→ AboutUsSection            Expedition / about (не отдельный роут)
→ #pilot                    HomePilotCta
```

`LazySection` / `heroOk` **сняты** с home: 3D formats живут на `/channels`, folds монтируются сразу. `scrollPreload.ts` всё ещё греет Routes JS, но home его больше не ждёт через gate.

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

### Header (live)

| File | Role |
| --- | --- |
| `Header.tsx` | Fixed bar · `HeaderIsland` left · logo right |
| `HeaderIsland.tsx` | `navLinks` + locale + theme tumbler |
| `rails.css` | Grid `1fr \| auto \| 1fr` |

**Nav (live `navLinks`):** The Agency (`/`) · Creative Studio (`/craft`, `underConstruction`, hidden on small screens).  
**Нет** Channels / Expedition / Basecamp в header. Справа в острове: locale + theme. **Нет** hamburger · **нет** Request Pilot. `HeaderNav.tsx` / `ThemeToggle.tsx` удалены.

### Footer explore

The Basecamp (`/`) · The Routes (`/#routes`) · The Peaks (`/#cases`) · The Craft (`/craft`).  
Company: только Careers inquiry → `/contact`. **Нет** Expedition. **Нет** Request Pilot в footer.

### Request Pilot — где живёт


| Место                                       | Есть?                    |
| ------------------------------------------- | ------------------------ |
| `#pilot` на home (`HomePilotCta`)           | ✅ после unlock обеих тем |
| `/contact`                                  | ✅ форма                  |
| AboutUs on home → `/#pilot`                 | ✅                        |
| Header / footer / Cases chrome / case modal | ❌ убрано (Aug 14 IA)     |


`HomePilotCta`: пока пользователь не видел обе темы — показывает bridge «Switch to Infrastructure/Growth»; после — **Ready to be Upraised?** + Request Pilot.

---

## 9. Hero 3D (Everest fly)

**Status:** SHIPPED — two paths, same fly.

| Path | Who | What |
| --- | --- | --- |
| **Live WebGL** | Mac / discrete GPU, `useHardwareTier() === "high"` | One Canvas, theme-swapped GLB, sticky Lenis runway |
| **JPEG sequence** | Mobile, Intel / integrated GPU, `?lite=1`, `prefers-reduced-motion` | `HeroVideoFallback` — 150 JPEGs drawn to `<canvas>` on scroll |

Do **not** force Windows back onto live WebGL. Intel → lite is intentional.

### Theme FX

| Theme     | Terrain                                         | FX                                                                                                      |
| --------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Light** | Photo `everest-light.glb` (~11MB) · white paper | `BrandHazeSky` · `ScrollBeams` · `AscentHalo` · `AscentBird` · `StudioRimLight` · `MistSheets` · `fogExp2`. `SeaOfClouds` **returns null** (horizontal-line artifact). Haze/halo is the Growth look — not a missing cloud mesh. |
| **Dark**  | Wire `everest.glb` (~1.0 MB Draco, **planet curve baked**) | `NightStars` · `FloatingVoyager` in the live scene (and **baked into** dark JPEG frames) |

### Key files

| File | Role |
| --- | --- |
| `Hero.tsx` | Sticky stage, H1, stats, `HeroFlyProvider` |
| `HeroAtmosphere.tsx` | CSS sky; `HeroTerrainCanvas` |
| `lib/heroBoot.ts` | `index.html` + `main.tsx` preload of theme GLB + Draco wasm |
| `lib/heroDesktop.ts` | `DESKTOP_HERO_QUERY` is currently `"(min-width: 0px)"` (preload gate — do not “fix” without owner) |
| `hooks/useHardwareTier.ts` | Intel / UHD / Iris / Mali / Adreno → **lite**. Override: `?lite=1` |
| `lib/scrollPreload.ts` | Scroll-synced warm: hero owns network until `markHeroReady` |
| `hero-terrain/*` | R3F scene graph |
| `Everest.tsx` | Theme-switched GLB; dark skips runtime vertex bend |
| `HeroFlyContext.tsx` | Runway → `progressRef` |
| `lib/heroModel.ts` | URLs + Draco |
| `HeroVideoFallback.tsx` | JPEG sequence player (Windows / mobile / lite) |
| `CaptureDriver.tsx` | `/dev/hero-capture` PNG dump |
| `scripts/capture-home-dark.js` | Puppeteer driver (WebGL + Metal) — used for both themes |
| `scripts/encode-frames.sh` | PNG → JPEG |

### Art locks (не ломать)

1. Light UI = **white paper** `#ffffff`, cool haze — не cream, не Rayleigh `Sky`.
2. **No ground disc** under mountain.
3. **Halo** camera-relative — не world-pinned sticker.
4. **Bird** = procedural silhouette, не flappy GLB.
5. **Theme switch:** single Canvas + `ThemeGlSync` — **не** `key={theme}` remount. Hide until `drawnTheme === theme`.
6. **No GSAP** / drei `useScroll` for hero.
7. **No desktop posters** — owner rejected stills; mountain must boot itself.
8. **Do not** import Phone/Tablet/TV GLBs (or `ProgrammaticScrollSection`) until `markHeroReady` + the section is approaching.
9. Dark `everest.glb` extras `planetCurved: true`. After `npm run optimize:everest` run `npm run bake:everest-curve`. Do **not** bake `everest-light.glb` (inflates ~2 MB).
10. **No EffectComposer** / N8AO / Bloom on hero.

### Boot (desktop high-tier)

1. Inline `index.html` script: theme + `preload` everest GLB + Draco (`fetchpriority=low` so HTML/JS win).
2. `main.tsx` → `preloadHeroTerrain(theme)`.
3. Eager Home + eager `HeroTerrainCanvas` (three/r3f in the modulepreload graph).
4. Canvas: `frameloop="never"` when offscreen; `events.disconnect()`; no raycast on terrain.
5. Theme tokens apply in `useLayoutEffect` (`ThemeContext`) so `data-theme` matches the first paint after toggle.

### JPEG sequence (lite / Windows / mobile)

Same WebGL fly, frozen to 150 stills. Closest bake to live 3D that still loads in seconds.

| Sequence | Settle | Encode | Player size | Approx weight |
| --- | --- | --- | --- | --- |
| `home-dark` | 1400 ms | qscale **5** + lanczos | 1280×720 | ~30 MB |
| `home-light` | 1400 ms | qscale **2** + lanczos | 1280×720 | ~11 MB |
| `home-mobile-dark` | 1400 ms | qscale **5** | 540×960 | ~21 MB |
| `home-mobile-light` | 1400 ms | qscale **2** | 540×960 | ~6.5 MB |

- Capture PNG is 1920×1080 (desktop) / 720×1280 (mobile) via `lib/heroCapture.ts`.
- Player cache-bust: `HeroVideoFallback` `?v=9`.
- Player **idle-loads all 150** (`IDLE_CONCURRENCY = 8`). Loads are generation-scoped: a light `onload` must not commit into the dark cache (that was the white-flash bug).
- Draw only images whose `src` belongs to the current `shotFolder`; otherwise fill paper `#ffffff` / `#050504`.
- Remaining gap vs live 3D (not a hole in the bake): 720p stretched to retina, JPEG, 150 stops, no mouse parallax, no dark-wire idle breathe.

**Recapture (dev only):**

```bash
npm run dev   # 5173, hero-capture plugin
node scripts/capture-home-dark.js 'http://127.0.0.1:5173/dev/hero-capture?shot=home&theme=dark&frames=150' 'Done home dark' 1920 1080
node scripts/capture-home-dark.js 'http://127.0.0.1:5173/dev/hero-capture?shot=home&theme=light&frames=150' 'Done home light' 1920 1080
node scripts/capture-home-dark.js 'http://127.0.0.1:5173/dev/hero-capture?shot=home&theme=dark&frames=150&mobile=1' 'Done home-mobile dark' 720 1280
node scripts/capture-home-dark.js 'http://127.0.0.1:5173/dev/hero-capture?shot=home&theme=light&frames=150&mobile=1' 'Done home-mobile light' 720 1280
# then encode only the shot you recaptured — see scripts/encode-frames.sh
```

PNG folders are `captures/{shot}-{theme}/` with `frame_0000.png`…`frame_0149.png`. ffmpeg `-start_number 0` → public `frame_0001.jpg`…`frame_0150.jpg`.

---

## 10. The Routes — Every Format. One Supply Path. (`#routes`)

**Headline:** *Every Format. One Supply Path.*  
**Home anchor:** `/#routes` = CSS `ChannelsCtaSection` → Link `/channels`.  
**Formats 3D (live):** `/channels` · `ChannelsPage` · `ProgrammaticScrollSection` (desktop WebGL + mobile sticky phone).  
**Не** монтировать `ProgrammaticScrollSection` на home — это снимает гонку с Everest.  
**Legacy:** `/solutions` → `/#routes` (`App.tsx`). `HomeRoutesSection.tsx` **deleted**.  
**Copy SOT:** `src/components/solutions/ProgrammaticFormats.ts`  
**Wiring SOT:** `src/components/solutions/ProgrammaticScrollSection.tsx`

### Purpose

The Routes is the central **product proof** of the Agency pitch. Live 3D lives on `/channels`; home `#routes` is the CSS CTA into that page. Job: show every ad format UPRAISER buys with an interactive 3D device mockup + live copy, so an advertiser sees exactly what they're buying and how it's measured — without a PDF or a sales call.

**Tone:** Operator proof. Not a feature list. Each format has a tagline, one-sentence operator description, and three infrastructure-grade bullet points (measurement trail, fraud screen, reconciliation file).

### Two Lanes

| Lane | ID | 3D device | Formats | Source |
| --- | --- | --- | --- | --- |
| **App Growth** | `app-growth` | Phone (iPhone GLB) | 5 programmatic | `AD_FORMATS` |
| **OEM & CTV** | `oem-ctv` | Tablet (OEM) + TV (CTV) | 3 OEM + 2 CTV | `OEM_CTV_FORMATS` |

Native scroll (`useFormatScrollSection`) drives the active format index.  
Desktop: `DeviceCarousel3` — spatial 3-device slide carousel (Phone · Tablet · TV).  
Mobile (Sept 7): **sticky sidebar** — large phone locked under the header (~35–40%) + scrolling format cards (~60–65%). The old bottom dock is gone.

Switching lanes slides the device carousel and cross-fades format copy with a **horizontal** slide animation matching the carousel direction.

---

### Lane 1 — App Growth (all formats on Phone)

| # | ID | Label | Tagline |
| --- | --- | --- | --- |
| 1 | `banner` | Banner | Scale inside 100K+ apps |
| 2 | `native` | Native | Intent-matched, not interruptive |
| 3 | `interstitial` | Interstitial | Full-screen impact at natural breaks |
| 4 | `rich` | Rich Media | Interactive formats that earn attention |
| 5 | `video` | Video | Rewarded and skippable |

**Banner** — In-app banners on behavioral signals. Supply: 100K+ app graph · Fraud: pre-bid screen · Caps wired to MMP events: FTD, reg, subscription.

**Native** — Feed-integrated, session-depth targeted. Units matched to app design · Session-depth and engagement-peak targeting · CPC/CPM with MMP conversion attribution.

**Interstitial** — Full-screen at natural breaks (level load, article end, checkout). Natural-break timing · Placement quality scored before bid · Device-level frequency caps.

**Rich Media** — Expandable and playable units; 3–5× engagement vs standard display. Expandable, animated, and playable units · Whitelist-only, MRAID-compliant supply.

**Video** — Rewarded and skippable under one bid strategy. Rewarded: opt-in, near-100% completion · Skippable pre-roll with quality controls · Shared MMP attribution across both types.

---

### Lane 2 — OEM & CTV

| # | ID | Label | Tagline | Device | scene key |
| --- | --- | --- | --- | --- | --- |
| 1 | `pre-install` | Pre-install | On-device before the store | Tablet | `"tablet"` |
| 2 | `oem-store` | OEM Store | Lenovo and partner storefronts | Tablet | `"tablet"` |
| 3 | `system-ui` | System UI | OS-level moments that convert | Tablet | `"tablet"` |
| 4 | `ctv-spot` | CTV Spot | Living-room scale, measured | TV | `"tv"` |
| 5 | `ctv-video` | CTV Video | Long-form attention, short proof path | TV | `"tv"` |

**Pre-install** *(Tablet)* — OEM at unboxing / first boot. Factory/first-boot placement inventory · Install and activation postback trails · Reconciliation file finance can read.

**OEM Store** *(Tablet)* — Featured slots inside Lenovo + partner OEM stores. Partner storefront featured slots · Pre-bid filtration on every clear · MMP-aligned activation events.

**System UI** *(Tablet)* — OS-level surfaces at natural device moments (setup complete, update done). Natural OS transition timing · Device-level frequency control · Brand-safe whitelist inventory.

**CTV Spot** *(TV)* — Connected TV spots with household reach. Premium CTV publisher whitelist · Household reach with frequency caps · Post-flight file for finance review.

**CTV Video** *(TV)* — Long-form CTV bought to the same outcome stack as OEM. Completion and viewability controls · Shared outcome taxonomy with OEM · One finance-readable reconciliation file.

---

### 3D Device Carousel (`DeviceCarousel3`)

Each format carries `scene?: "phone" | "tablet" | "tv"` in `ProgrammaticFormats.ts` (default `"phone"`).  
A Framer Motion spring (`stiffness: 340, damping: 32, mass: 0.6`) drives `phase` 0→1→2.  
Devices slide via `x: (slotIndex − phase) × 100%` + opacity fade. No `scale` or `filter:blur` on WebGL canvas (causes bilinear→native pixel snap artifact).

**Mount policy:** only the **active** slot (plus the outgoing slot for ~720ms during the spring). App Growth = phone canvas only. Tablet/TV GLBs warm on the **next** format (`warmStage("routes-tablet"|"routes-tv")`), not at parse.

| Device | Width in col | Camera | GLB |
| --- | --- | --- | --- |
| Phone | 62% | Phone3D default | `/phones/deep-blue.glb` (light) · `/phones/orange.glb` (dark) |
| Tablet | 85% | fov 30, z=3.8 | `/channels/oem/tablet.glb` |
| TV | 100% | fov 34, z=5.5 | `/channels/oem/tv.glb` (8.7 MB Draco, no legs) |

**Drag limits (all 3 devices, unified):** Y ±0.45 rad · X ±0.15 rad · sensitivity dx×0.006 / dy×0.004 · spring 260/30/0.7 · release snaps 35% toward REST.

---

### Phone3D

File: `src/components/solutions/Phone3D.tsx`

**Entrance (scroll-driven, 3 phases):** macro flyover → lift & rotate → lock face-forward (`REST_Y 0.07`, `REST_X −0.04` rad, ~4° depth hint).

**Screen glass:** Still PNG (`programmatic-refs/screens/{format}.png`) → Video MP4 (`programmatic-feed/formats/{format}.mp4`) promoted on `readyState >= HAVE_CURRENT_DATA`. No Suspense remount (white flash).

---

### Tablet3D

File: `src/components/channel-visuals/Tablet3D.tsx`  
Model: iPad GLB, `drei/Center` auto-centering, `rotation={[Math.PI/2, 0, 0]} scale={6.8}`.  
Screen: material named `"glass"` → `VideoTexture` via `traverse()`.  
No `ContactShadows` (white oval artifact on transparent canvas).

---

### Tv3D

File: `src/components/channel-visuals/Tv3D.tsx`  
Model: custom `newtv.glb` (Sketchfab / FBX export, centimeter scale).

**Transform chain** — GLTF applies two rotations before Three.js world space:
```
Sketchfab_model  rotation: −90°X
  FBX node       rotation: +180°X
    RootNode ← meshes (screen faces −Z in Three.js)
```
Corrected with `rotation={[0, Math.PI, 0]}` on the scale group (screen now faces +Z / camera).

**Runtime centering** — computed synchronously in `useState` initializer (before first render):
```ts
scene.updateMatrixWorld(true);
const box = new Box3().setFromObject(scene, true);
const scale = TARGET_HEIGHT / size.y;   // TARGET_HEIGHT = 1.91
position = [−center.x, −center.y, −center.z];
```
Fallback if box empty: `{ scale: 0.022, cx: 99.25, cy: −69.52, cz: −2.13 }`.

**Leg removal** — `Layer 03` (Object_22, ~14K verts, stand) and `Layer 05` (corner nub) hidden via `scene.traverse()` + `obj.visible = false` in `useEffect`. Identified because their bounding Y extends ~7% below TV body minimum.

**Lighting boosted** (TV panels have ~4% albedo): ambient 2.2 · key directional 3.0 · fill 0.8 · spot 1.5 · env city 1.3 (growth); slightly lower for infra.

Do not hide `Layer 06` — it is the back panel face (needed after π-Y flip to show front).

---

### Sticky Scroll Runway

Hook: `useFormatScrollSection.ts`

| Constant | Value | Purpose |
| --- | --- | --- |
| `SCROLL_PX_PER_FORMAT` | 650 | Scroll pixels per format step |
| `INTRO_SCROLL_PX` | 650 | Extra runway for phone entrance |

`entranceProgress` is a `MotionValue<number>` — passed to `DeviceCarousel3` and `FormatCopy`. **Do not pass plain `number`** (TS2322).

---

### Format Copy & Transitions (`FormatCopy.tsx`)

| Trigger | Animation |
| --- | --- |
| Scroll within lane | Vertical — exit ↑, enter ↓ · spring 220/28/0.85 |
| Lane switch | Horizontal — matches device slide direction |

---

### Tumbler / Lane Switcher (`SlideTabs.tsx`)

Style: Dynamic Island — `bg-bg-elevated/70 backdrop-blur-xl rounded-full border border-border/40 shadow-sm`.  
Pill (`motion.span layoutId`) is a **sibling** of the button (not a child) — prevents `inline-flex` baseline from nudging position.  
Spring: `{ type: "spring", bounce: 0.15, duration: 0.5 }`.

Lives in `.prog-scroll-copy-stack` (copy column, not the phone grid). Island is `inline-flex` + `w-max` / `shrink-0` so labels never compress. Live tumbler is **relative** in-flow (`flex-shrink: 0`), not absolute:
```css
.prog-scroll-copy-tumbler {
  position: relative;
  flex-shrink: 0;
  z-index: 2;
  line-height: 0;
}
```
Widening the island cannot shift the device column. Format copy sits below it.

---

### Glass pipeline

1. **Still (App Growth):** `public/channels/programmatic-refs/screens/{format}.png`
2. **Video (App Growth):** `public/channels/programmatic-feed/formats/{format}.mp4`
3. **Still (OEM):** `public/channels/oem/screens/{format}.png`
4. **Video (OEM):** `public/channels/oem/screens/{format}.mp4`

Promoted on `readyState >= HAVE_CURRENT_DATA`. No Suspense remount (white flash).

---

### Mobile (`ProgrammaticScrollSectionMobile.tsx`)

Trigger: `< 1024px` or `prefers-reduced-motion`. No WebGL — large sticky CSS phone (~35–40% left, locked under header) + scrolling format cards (~60–65% right). Native scroll drives the active format. The old `.prog-mobile-sticky` bottom dock is gone.

---

### Key Files — Routes

| File | Role |
| --- | --- |
| `solutions/ProgrammaticFormats.ts` | **Copy SOT** — all format definitions, scene keys |
| `solutions/ProgrammaticScrollSection.tsx` | Desktop sticky section + `DeviceCarousel3` |
| `solutions/ProgrammaticScrollSectionMobile.tsx` | Mobile section |
| `solutions/Phone3D.tsx` | iPhone 3D scene |
| `channel-visuals/Tablet3D.tsx` | iPad 3D scene |
| `channel-visuals/Tv3D.tsx` | TV 3D scene (runtime-centered) |
| `solutions/FormatCopy.tsx` | Animated format text block |
| `SlideTabs.tsx` | Dynamic Island lane switcher |
| `hooks/useFormatScrollSection.ts` | Sticky scroll + format progress |
| `hooks/useRoutesLane.ts` | Lane state + copy resolver |
| `styles/programmatic-scroll-section.css` | Sticky layout, all variants |
| `public/phones/deep-blue.glb` | iPhone GLB — light / growth |
| `public/phones/orange.glb` | iPhone GLB — dark / infra |
| `public/channels/oem/tablet.glb` | iPad GLB |
| `public/channels/oem/tv.glb` | TV GLB (8.7 MB Draco; source `assets/channels/oem/tv.src.glb`) |
| `public/channels/programmatic-feed/formats/*.mp4` | App Growth screen videos |
| `public/channels/oem/screens/*.mp4` | OEM / CTV screen videos |

---

### Do not (Routes)

1. GSAP / ScrollTrigger on Routes — hook is Lenis-native
2. Suspense remount between Still ↔ Video glass — white flash
3. CSS `scale` or `filter:blur` on WebGL canvas wrappers — bilinear snap
4. `ContactShadows` on Tablet3D / Tv3D — white oval artifact
5. `key={theme}` remount on Canvas — kills WebGL context
6. Plain `number` where `MotionValue<number>` expected (`entranceProgress`)
7. Hide `Layer 06` on TV — it is the front face after π-Y flip
8. Softening format bullets — must be infrastructure-grade (measurement trails, fraud screens, reconciliation files)
9. Eager `void import(Tv3D|Phone3D|Tablet3D)` at `ProgrammaticScrollSection` module eval — races Everest
10. `LazySection` that only wraps `Suspense` without IntersectionObserver — mounts Routes 3D on first paint

---

### Routes Sanity Checklist

- [ ] Both lanes load without blank glass
- [ ] Phone entrance completes before first format activates
- [ ] App Growth → OEM: device slides left, text slides left
- [ ] OEM → App Growth: device slides right, text slides right
- [ ] pre-install / oem-store / system-ui → Tablet visible
- [ ] ctv-spot / ctv-video → TV visible, screen facing camera, no legs
- [ ] Tumbler pill never jumps between format switches
- [ ] Mobile: sticky split phone + cards (`ProgrammaticScrollSectionMobile`); no tiny bottom dock
- [ ] `npm run build` passes — no TS errors on MotionValue / unused imports

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

**PROOF ghosts (Infrastructure `#audience`):** `FraudScrollChart` floats metrics around the radial. Desktop origins sit in the **chart column** (`left` 58–84% of the 100vw overlay). `.accent-scroll-section--split-copy .fold-chart-ghosts` + `.fraud-radial-chart__ghosts` use a left mask/`clip-path` from 768px up so 47% / Device farms cannot drift onto the copy. Do not park ghosts at 15%/35% on desktop — that was the overlap.

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

## 14. Shipped polish log

### 7 Sep 2026 evening — hero JPEG bake + theme flash

| Area | Change |
| --- | --- |
| Dark bake | Recaptured `home-dark` + `home-mobile-dark` with Voyager on; idle-preload all 150 frames (`?v=8` then `?v=9`) |
| Light bake | Recaptured `home-light` + `home-mobile-light`, settle 1400 ms, JPEG qscale 2 + lanczos (~11 MB / ~6.5 MB) |
| Flash | Lite player: per-folder cache + cancelled loads. 3D: hide until `drawnTheme === theme`. `applyTheme` in `useLayoutEffect` |
| PROOF | Desktop fraud ghosts stay in the radial column; left mask so they don’t sit on copy |
| Windows | Intel integrated GPU → lite JPEG (do not re-enable live WebGL) |

Dark bake shipped as **`37988f9`**. Light recapture + flash/ghosts ship in **this commit**.

### 28 Aug 2026 evening (`60478fe` → `3e11fb5` → `7484527`) — **live on prod**

| Area | Change |
| --- | --- |
| Hero | No desktop posters; eager Home + eager terrain canvas; `heroBoot.ts` + `index.html` preload GLB/Draco |
| Race | `LazySection` is two-phase (warm ~90% / show ~30%) + `gate="hero"`; Routes 3D cannot start until `markHeroReady` |
| Preload | `src/lib/scrollPreload.ts`: hero → mid → routes phone → tablet → tv → cases → promise |
| Devices | `DeviceCarousel3` mounts only the active (+720ms outgoing) WebGL canvas |
| TV | `tv.glb` 28 MB → **8.7 MB** Draco; `Tv3D` uses `DRACO_PATH`; source `assets/channels/oem/tv.src.glb` (gitignored) |
| Everest | Dark mesh planet-curve **baked** (`npm run bake:everest-curve`); runtime vertex loop skipped on dark |
| Bytes | Deleted unused `macbook.glb` (42 MB) + dead TSX (`SiteMenu`, `ThemeToggle`, `HeaderNav`, stub sections) |
| CSS | `font-weight: 650` → `600`; `vh` → `dvh`; hover gated on island/pilot/locale |
| Docs | Single SoT this file; extra project md + `specs/001-load-speed-refactor` removed |

Verified on Vercel: boot = 1 canvas + `everest.glb` only; Routes Banner = phone canvas, no `tv.glb` until CTV.

### 28 Aug 2026 (`1d85882` → `8e0dd82`)

| Area | Change |
| --- | --- |
| Type | Inter 400/600/700/800; `.copy { font-weight: 400 }`; `html[data-os="windows"]` skips fake-light |
| Hero | Stats rail sits above Lenovo dock via `--hero-stats-lenovo-gap` |
| Contact | Viewport-route fill; no nested `100dvh`; Windows 125% DPI no longer clips the form |
| Case modal | Body copy 76% fg (Mac); **90% fg + solid panel, no blur** on Windows |
| Clients tape | Pointer-drag scrubs CSS marquee; hover does not pause |
| Dark logos | Invert **only** black SVGs (OKX, TikTok, Liobank, Bybit) — never app-icon PNGs |
| Promise chart | Alpha WebGL caustics; Windows 8px scan overlay; no mix-blend fog |
| Ritual | rsync backup → commit site only → push → `npm run deploy` |

### Aug 14 (`e17776c`)

Fold charts became bespoke SVG; Routes + Peaks on home; slim nav; typography tightened.

### Later (`2e04d94` and Basecamp)

HeaderNav 3-link island; format sticky scroll; home cases `wheel: false`; contact viewport chrome; Craft stub.

---

## 15. Репозиторий — ключевые файлы

```
src/
├── App.tsx                         ← routes (eager HomePage)
├── main.tsx                        ← preloadHeroTerrain
├── pages/HomePage.tsx              ← pitch · Suspense folds · ChannelsCta · AboutUs
├── pages/ChannelsPage.tsx          ← 3D formats (off home)
├── pages/CraftPage.tsx · ContactPage.tsx
├── components/
│   ├── Header.tsx · HeaderIsland.tsx
│   ├── Hero.tsx · HeroAtmosphere.tsx
│   ├── hero-terrain/* · Everest.tsx
│   ├── AboutUsSection.tsx · HomePilotCta.tsx
│   ├── CaseStudies.tsx
│   └── solutions/ChannelsCtaSection.tsx · ProgrammaticScrollSection*.tsx
├── lib/
│   ├── heroBoot.ts · heroDesktop.ts · heroModel.ts
│   └── scrollPreload.ts            ← warmStage / markHeroReady
├── hooks/useFormatScrollSection.ts · useRoutesLane.ts
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
| `useMarqueePointerDrag`                      | Clients tape click-drag scrub   |
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


**Also in `public/`:** Draco WASM · `public/clients/*` · partner marks · phone GLBs · `channels/programmatic-*` (Routes glass) · **`public/hero/frames/{home,home-mobile}-{dark,light}/`** (150 JPEGs each, lite player).

**Hero frame weights (home only, Sept 2026):** dark desktop ~30 MB · light desktop ~11 MB · dark mobile ~21 MB · light mobile ~6.5 MB. Expedition sequences exist on disk; home is the live bake.

**Local backup (outside git):** `~/Downloads/upraiser-assets-backup/`  
`rsync -a public/{hero,channels,phones,draco,clients,maps,images} ~/Downloads/upraiser-assets-backup/`  
`scripts/restore-assets.sh` fills missing files on `npm run dev`.

**Not shipped / not committed:** `assets/hero/*.src.glb` · `public/timesst.mp4` · `.agents/skills/*` · `.claude/skills/*` · root `measure_*.js`.

```bash
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh
npm run optimize:everest && npm run bake:everest-curve
npm run optimize:everest-light
npm run optimize:tv
npm run generate:og
```

---

## 17. Deploy, backup, commit

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **URL**     | [https://upraiser.co.uk](https://upraiser.co.uk) |
| **Project** | `upraiser-site-v2`                               |
| **Team**    | `alex-3152s-projects`                            |
| **Repo**    | `github.com/hmblps/upraiser-site` · `main`       |
| **Author**  | `alex@upraiser.co.uk`                            |

**Ритуал (только по просьбе владельца):**

1. Backup: rsync `public/{hero,channels,phones,draco,clients,maps,images}` → `~/Downloads/upraiser-assets-backup/`
2. Commit **site only** (не skills, не `timesst.mp4`)
3. `git push origin HEAD`
4. `npm run deploy` → `scripts/deploy-vercel.sh` (local `tsc`+vite, then `vercel deploy --prebuilt --prod`)

GitHub auto-deploy **не** канон — прод идёт с локального prebuilt, чтобы GLB/media не потерялись.

**Verify:** Cursor/sandbox DNS for apex `upraiser.co.uk` may hit a non-Vercel IP (wrong TLS). Confirm the unique `*.vercel.app` URL from `npm run deploy`, then alias. Owner browser on real DNS is the source of truth for the apex.

**Blockers:** missing GLBs/og-image · stripped `package.json` deps · unverified git author email · `tsc` errors (union types on `PartnersCarousel`).

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

**Parked (needs owner yes):** Expedition as “Operators Spec” (no headshots) · case-modal technical payload (MMP / events) · testimonials only if real quotes exist · no fake awards · FAQ accordion · vertical routing · ROAS calculator. Do not ship without approval.

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
10. Гонка Routes 3D / `tv.glb` с первым кадром Everest.
11. Пересборка dark `everest.glb` без `bake:everest-curve`.
12. Коммит `.agents/skills` дампов или `public/timesst.mp4`.

**Sacred copy:**

- **«Charting the Ascent»**
- Hero H1: **«We see how stunning / Your rise to the top / can be.»**
- **Request Pilot**
- **Ready to be Upraised?**

---

## 20. Refactor backlog

### Already done (do not resurrect)

`SiteMenu.tsx` · `ThemeToggle.tsx` · `HeaderNav.tsx` · `HomeRoutesSection.tsx` · `public/channels/oem/macbook.glb` · extra project markdown / `specs/001-*`.

### Consolidate (optional)

| Item | Why |
| --- | --- |
| `LegacyRedirects` vs inline `Navigate` | One redirect table |
| `innerPagesData` vs `liveContent` overlap | Single content owner |
| Split `programmatic-scroll-section.css` (~1000+ lines) | Maintainability |
| Phone3D module `useGLTF.preload(MODEL_LIGHT)` always + active chassis | Can fetch both phone GLBs on Routes |

### Do not regress

- HeroFly + Lenis (no GSAP)
- Dual narrative theme
- Killer folds on home
- Routes still→MP4 glass
- Home Cases vertical scroll pass-through
- White light paper + photo mountain + silhouette bird
- Legacy redirects until SEO cutover
- Scroll-synced preload (`gate="hero"`, no parse-time TV import)
- Dark Everest baked curve

### Perf (do not regress)

- Scroll subscribers: prefer `useScroll` / `useTransform`, not a global `scrollY` React context that re-renders the tree every pixel.
- Pause `useFrame` / set `frameloop="never"` when a 3D canvas is offscreen.
- Animate `transform` / `opacity`, never `width` / `height` / `padding` / `margin`.
- `backdrop-filter` is expensive on mobile — Windows case modal already drops it.
- One WebGL context on hero boot; Routes devices mount on demand.

### Open product debt

1. OEM / CTV live screen videos still deferred
2. Git → Vercel auto-deploy (intentionally off; see §17)
3. Merge three Routes canvases into one (quality/smoothness risk — only with owner yes)
4. `everest-light.glb` still ~11 MB (do not Draco-curve-bake; inflates)
5. Partner / client marks: remaining dark PNGs (e.g. Betking) may still sit quiet on charcoal
6. Live copy pass / Routes OEM screens
7. Optional: Playable/Carousel tiles only if desk has SKUs (InMobi-adjacent, parked §18)

---

## 21. Sanity checklist

- [ ] `npm run build`
- [ ] Light: white UI, photo mountain, halo, bird on scroll (haze is Growth, not a bug)
- [ ] Dark: wire + stars + Voyager (live **and** in JPEG bake)
- [ ] Header: The Agency + Creative Studio only
- [ ] `/solutions` → `/#routes`; no `/expedition` / `/company` pages
- [ ] Home `#routes` is CSS CTA → `/channels`; formats 3D only on `/channels`
- [ ] `#cases` vertical scroll passes through on home
- [ ] `/cases/:slug` opens modal; close → `/#cases`
- [ ] Request Pilot only on `#pilot` + `/contact`
- [ ] High-tier desktop: Everest canvas on first paint; no `tv.glb` until `/channels`
- [ ] Lite / Windows Intel / mobile: JPEG sequence, both themes; toggle dark after light must not flash white frames
- [ ] `#audience` Infrastructure: ghost % stay on the radial, not on copy
- [ ] Deploy **upraiser-site-v2** · alias `upraiser.co.uk`
- [ ] `package.json` lists three, R3F, router

---

## 22. Quick reference — где менять X


| Change…               | File                                               |
| --------------------- | -------------------------------------------------- |
| Hero copy / stats     | `Hero.tsx`, `liveContent.ts`                       |
| Hero 3D / camera / FX | `hero-terrain/*`, `Everest.tsx`                    |
| Hero JPEG bake        | `/dev/hero-capture`, `scripts/capture-home-dark.js`, `scripts/encode-frames.sh` |
| Lite / Windows hero   | `HeroVideoFallback.tsx`, `useHardwareTier.ts`      |
| Nav / footer IA       | `liveContent.ts` `navLinks`, `footerLinks`         |
| Routes / formats      | `ProgrammaticFormats.ts`, `ProgrammaticScrollSection.tsx` |
| Preload / hero boot   | `lib/scrollPreload.ts`, `lib/heroBoot.ts`, `HeroAtmosphere.tsx` |
| Page titles / SEO     | `src/data/pageMeta.ts`, `PageMeta.tsx`, `index.html` |
| Legal copy            | `public/privacy/index.html`, `public/terms/index.html` |
| Cases carousel        | `CaseStudies.tsx`, `useHorizontalPointerScroll.ts` |
| Section copy          | `liveContent.ts` `*ByMode`                         |
| Home order            | `HomePage.tsx`                                     |
| Theme colors          | `index.css`                                        |
| Routes / redirects    | `App.tsx`                                          |
| Clients tape / logos  | `clients.ts`, `PartnersCarousel.tsx`, `base.css` `.partner-logo` |
| Promise / parity chart| `ParityWaterChart.tsx`, `ParityCausticsCanvas.tsx`, `charts.css` |
| Case modal copy       | `surfaces.css` `.case-detail-modal__body .copy`                  |
| Windows type / OS     | `index.html` `dataset.os`, `base.css` `html[data-os="windows"]`  |
| Deploy                | `scripts/deploy-vercel.sh`                                       |
| Assets                | `scripts/sync-assets.sh`, `assets/`                              |


---

## 23. Windows + dark-theme ops

`index.html` sets `html[data-os="windows"]` from UA.

| Surface | Mac | Windows |
| --- | --- | --- |
| Hero | Live WebGL if discrete GPU | **JPEG sequence** if Intel / integrated (`useHardwareTier` lite). Same fly, baked frames. `?lite=1` to force. |
| Body copy | `-webkit-font-smoothing: antialiased` | ClearType (`smoothing: auto`); real Inter 400 — no fake-light |
| Case modal `.copy` | 76% `--theme-fg` + glass panel | 90% fg + solid `--theme-bg-elevated`, **no** `backdrop-filter` |
| Parity water | 3px CSS mask scanlines + `mix-blend: screen` | 8px overlay scan; caustics **alpha** canvas; `mix-blend: normal` |
| Client logos | grayscale | same, plus invert on `ink: "black"` (OKX, TikTok, Liobank, Bybit) |
| Theme toggle | `useLayoutEffect` applyTheme | same — do not leave `data-theme` a frame behind React |

Contact `/contact` is a **viewport-route**: `html.viewport-route { overflow: hidden }`. Do not nest another `min-h-[100dvh]` inside the padded frame.

Lite player must not mix folders: after Growth → Infrastructure, in-flight light JPEGs used to paint white paper into the dark cache. Fix is generation-scoped `onload` in `HeroVideoFallback`.

Do **not** globally invert `.partner-logo` — filled app icons become white rounded squares.

---

## 24. Cross-platform prompt

Paste into Agent when writing or rewriting UI:

> Соблюдай `.cursorrules`: `100dvh`, `env(safe-area-inset-*)`, `@media (hover: hover) and (pointer: fine)`, `touch-action: manipulation`, 44×44 touch targets, `:focus-visible`, `overscroll-behavior: contain` on modals. Framer `type: "spring"`. Dual theme Growth ↔ Infrastructure. Copy SOT `liveContent.ts` / `innerPagesData.ts`. Brand: §4 of this file. Don’t break Everest hero or Routes still→MP4 glass.

---

## 25. Antigravity handoff

Open this repo on the same disk (`Downloads/НОВЫЙ САЙТ UPRAISER`). **Read this file first** — other project `.md` files do not exist. Then §4 (brand), §5 (IA), §9 (hero), §10 (formats on `/channels`), §17 (deploy), §19 (sacred). Copy: `src/data/liveContent.ts`.

Trust **`src/App.tsx` + `navLinks`**, not comments in `innerPagesData.ts` (they still list `/company`).

### Live architecture (Sept 2026 — this is current)

- **Home = The Agency (`/`):** Everest hero stays. Formats 3D **removed** from home. `#routes` is CSS `ChannelsCtaSection` → `/channels`. About / Expedition is `AboutUsSection` on home, before `#pilot`. No `/expedition` route.
- **`/channels`:** `ProgrammaticScrollSection` (Phone3D / Tablet3D / Tv3D). Not in header — reach it from the home CTA.
- **Header:** The Agency + Creative Studio only.
- **Home loading:** no `LazySection` / `heroOk` on Audience / Process / Cases / Promise. Single `React.Suspense` per fold.
- **Hero split:** high-tier = live R3F. Lite (mobile, Intel, `?lite=1`) = JPEG sequence. Dark frames include Voyager. Light frames recaptured 7 Sep evening (settle 1400 ms, qscale 2).

### Git / disk (7 Sep 2026 late evening)

- **This commit** ships light home JPEG recapture, lite theme-flash lock, PROOF ghost clip, MASTER sync, Audience/Promise spacing. Parent dark bake: `37988f9`.
- After push + `npm run deploy`: prod alias **https://upraiser.co.uk**.
- **Leave untracked:** `modal-open.png`, `modal-scrolled.png`, `oem-mobile.png`, `test-modal-scroll.mjs`, `test-oem-mobile.mjs`.

### Everest (light) — leave / continue here

Light path uses `everest-light.glb` + AmbientCG **Snow005** (`src/lib/heroModel.ts` → `/hero/snow005/…`). Shader: `snowSparkle.ts` (`everest-snow-poly-v25` when maps bind). `SnowSplatBinder` must stay a **child** of the mesh — putting the mesh inside `Suspense fallback={null}` hides the mountain while textures load.

Scene graph (`Scene.tsx`): keep **both** `StudioRimLight` and `MistSheets` imports. `SeaOfClouds` is a stub (`return null`). There is a leftover `console.log("FirstFrameGate mounted!")` and `console.log("Everest rendering!")` — safe to delete.

**Do not:** EffectComposer / N8AO / Bloom / GSAP ScrollTrigger on hero / `transparent: true` on the four GLB chunks / second Everest canvas / resurrect `macbook.glb` on Routes / force Windows onto live WebGL.

Open visual debt: **right steep face UV smear** on scroll (grazing + mips). Next 3D pass = stronger world-space triplanar / `steepRockMask`, without covering the mesh again. Light JPEG haze/halo is **on purpose** (Growth fog + `AscentHalo`).

### Do first in a new session

1. `git log -1 --oneline` — light JPEG recapture commit (parent `37988f9`). Working tree should be clean except leftover test pngs/mjs.
2. `npm run dev` → `http://localhost:5173/`
3. Desktop **high-tier** light: live mountain on first paint. Desktop **lite** / `?lite=1`: JPEG sequence, both themes, no white flashes after toggle.
4. Header = Agency + Craft. `/channels` reachable from `#routes` CTA. About is on home, not `/company`.
5. Do not commit `.agents/skills`, `.claude/skills`, `public/timesst.mp4`.

### Next work (needs owner yes)

Parked / in-flight:

1. Everest light: kill right-face UV stretch on the 300vh fly
2. OEM / CTV **live screen videos** (TimesST is local-only `public/timesst.mp4`)
3. Merge three Routes canvases into one (quality risk)
4. Recompress `everest-light.glb` (~11 MB) — **do not** bake the light curve
5. Dual phone GLB fetch on `/channels` — observed, not asked
6. Analytics / cookie banner — parked until owner + privacy update
7. `public/sitemap.xml` still listed `/expedition` (404) — replace with `/` + `/channels` if owner wants SEO truth
8. Footer label «The Basecamp» vs header «The Agency» — copy drift, not a bug until asked
9. `DESKTOP_HERO_QUERY = "(min-width: 0px)"` — documented, do not silently revert to 900px

Do **not** start a new “load-speed refactor spec folder”. Keep notes in this file.

### Sacred (do not break)

Everest **one** canvas · Routes still→MP4 glass on `/channels` · dual theme Growth ↔ Infrastructure · Inter · white light paper · Request Pilot only on `#pilot` + `/contact` · Framer `type: "spring"` · `.cursorrules` hover/dvh/44px · H1 *We see how stunning / Your rise to the top / can be.* · Windows lite stays JPEG.

### Deploy if the owner asks

rsync backup → commit **site only** → `git push origin HEAD` → `npm run deploy` (`upraiser-site-v2`). GitHub auto-deploy is not canonical.

---

## 26. Pre-launch checklist

Status as of 7 Sep 2026. Conversion items that would put **Request Pilot** in the hero or a sticky mobile bar are **not** shipped — sacred §8 / §19.

| # | Item | Status |
| --- | --- | --- |
| 1 | Custom 404 | **Done** — `NotFoundPage`, Home + Routes. SPA HTTP status stays 200 (Vite). `noindex` via PageMeta. |
| 2 | CTA above the fold | **Intentional skip** — H1 + stats + Lenovo strip. Request Pilot only at `#pilot` and `/contact`. |
| 3 | Title per page | **Done** — `PageMeta` + `src/data/pageMeta.ts` |
| 4 | Description per page | **Done** — same |
| 5 | Open Graph image | **Done** — `/og-image.png` 1200×630. Was missing locally; restored from git into `assets/brand/` + `public/`. |
| 6 | Favicon set | **Done** — ico, 16, 32, 180 apple, 192, `site.webmanifest` |
| 7 | robots.txt | **Done** — Allow `/`, Disallow `/contact/sent`, Sitemap |
| 8 | sitemap.xml | **Stale** — file still lists `/expedition` (no route). Live URLs: `/`, `/channels`, `/contact`, `/privacy`, `/terms`. Craft stub is `noindex`. |
| 9 | Alt text | **Done** — named logos have alt; in-ad mockups use empty alt (decorative). Header mark is decorative (`aria-label` on the link). |
| 10 | Mobile breakpoints | **Done** — existing `900px` hero / Routes mobile stack / 44px targets |
| 11 | Sticky mobile CTA | **Intentional skip** — would put Request Pilot on every scroll. Mobile Routes already has a format dock. |
| 12 | Loading states | **Partial** — contact `Transmitting…`, route `sr-only` Loading. Home folds use `React.Suspense` slots, not LazySection. |
| 13 | Form errors | **Done** — field `aria-invalid` + captions; submit alert; file-size error (no `alert()`). |
| 14 | Thank-you page | **Done** — `/contact/sent` after Web3Forms success |
| 15 | Privacy Policy | **Done** — full UK GDPR notice at `/privacy` (SPA wraps `public/privacy/index.html`) |
| 16 | Terms of Service | **Done** — `/terms` |
| 17 | Cookie banner | **N/A** — policy: no analytics/marketing cookies; only `localStorage` theme. Do **not** add a banner until analytics ships. |
| 18 | Analytics | **N/A / parked** — same. Owner yes + privacy update + consent banner required before GA/Metrika. |
| 19 | Real contact address | **Done** — 128 City Road, EC1V 2NX · `info@upraiser.co.uk` · JSON-LD · footer · contact |
| 20 | Compressed images | **Done** — raster logos/CTA jpgs already <100 KB. GLBs are Draco, not photos. |

---

## 27. Recent Session Logs (September 2026)

### Sept 6 2026 Updates
- **Expedition Grid (`AboutUsSection`) Redesign & Alignment:**
  - Rewrote the intro text to span two paragraphs for better visual balance against the right-side grid, ensuring "magazine-style" typography with `text-balance`.
  - Tuned down grid title/description font sizes (`text-sm`, `text-[13px]`) and adjusted max-widths to perfectly align the left column and right grid heights.
  - Replaced the abstract background SVG topographic map with a highly accurate, realistic SVG trace of Mount Everest (based on a user-provided technical reference photo). 
    - Plotted realistic climbing routes with labels for Lhotse, South Col, Khumbu Glacier, etc.
    - Thickened mountain silhouette lines to 4px and red route lines to 6px using `var(--accent)`.
    - Included correctly placed route nodes (`r=16`) and numbers (`16px`).
    - Wrapped the entire schematic in an ambient container (`opacity-[0.15]`) without `mix-blend` to ensure it works beautifully in both Light (Growth) and Dark (Infrastructure) modes.
- **`FraudScrollChart` Layout Fix:** 
  - Fixed an issue where the last ghost number ("Bots 7.1%") was touching/overflowing the right edge of the screen. Clustered the layout points closer together (`15%` to `75%` instead of `92%`), matching the aesthetic of past builds.
- **Typography & Rich Titles:**
  - Refactored `ProgrammaticScrollSection` and `SectionHeader` to accept `ReactNode` instead of just strings.
  - Split "Every Format. One Supply Path." onto two lines in the Channels section and applied `text-accent` to the second line.
  - Removed trailing periods from all major section titles across the site (`liveContent.ts` and React components), maintaining them only on descriptive paragraphs.

### Sept 7 2026 Updates
- **Mobile Channels (Routes) UX Overhaul (`ProgrammaticScrollSectionMobile.tsx`):**
  - Completely removed the tiny, hard-to-read "docked" phone at the bottom of the screen.
  - Implemented a "sticky sidebar" split-screen layout for mobile:
    - **Left (35-40%):** A large, fully visible sticky phone locked directly beneath the header.
    - **Right (60-65%):** A scrolling column of format description cards.
  - The phone now dynamically switches formats (Playable, Native, Interstitial, etc.) as the user scrolls through the cards, perfectly mirroring the desktop experience on a narrower screen.
- **Mobile HomePilotCta (Ready to be Upraised) Fixes:**
  - Fixed an issue where the absolute mountain background (`cta-mountain-bg`) overlapped or was severely cropped by short text containers on mobile.
  - Added explicit bottom spacing (`pb-[60vw]`) to the text wrapper on mobile, forcing the mountain to render below the text and buttons.
  - Centered the mountain peak (`background-position: center bottom`) for maximum impact.
  - Removed the `background: #ffffff` override from mobile light mode, restoring the "metallic sky" gradient so the visual sequence (Hero Metallic -> White Content -> Footer Metallic) is unbroken across all devices.
- **Mobile Parallax Charts (`Audience.tsx`, `PromiseSection.tsx`):**
  - Added `y: useTransform(scrollYProgress, [0, 0.4], [100, 0])` to the chart containers on mobile (`AudienceStatic` and `PromiseClean`).
  - Mobile charts now physically slide up into view and lower on reverse scroll, matching the desktop's fluid interaction instead of just animating in place.

### 7 Sep 2026 evening — handoff after Antigravity / Cursor

MASTER header / §5 / §6 / §8 / §10 / §25 first synced to `12a623e`. Then:

- Dark home JPEG recapture with Voyager; idle-preload 150 frames. Commit **`37988f9`**, pushed, deployed to **upraiser.co.uk**.
- Lite player mixed light JPEGs into dark after theme toggle → generation-scoped loads + hide 3D until `drawnTheme` matches.
- Light home JPEG recapture (desktop + mobile), settle 1400 ms, qscale 2.
- PROOF (`#audience`) ghost numbers no longer overlap left copy on desktop dark.
- This ritual commits the light bake + flash/ghosts + MASTER. Everest light UV smear still the open 3D ticket. `sitemap.xml` still advertises `/expedition`.

---

*End of master document. При изменении IA, hero, Routes glass, Windows quirks, preload или deploy — обновляй **этот** файл. Других проектных md нет.*
