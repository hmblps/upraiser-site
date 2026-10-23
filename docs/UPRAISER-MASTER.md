# UPRAISER — Master Documentation (single file)

> **Единый документ** для человека и ИИ. Других проектных `.md` нет — только этот файл + короткий `README.md` на GitHub.  
> **Updated:** 13 October 2026  
> **Local path:** `НОВЫЙ САЙТ UPRAISER`  
> **Production:** [https://upraiser.co.uk](https://upraiser.co.uk) · Vercel `upraiser-site-v2`  
> **HEAD:** this ritual — OEM/CTV glass SOT + single active WebGL device on `/channels` (see §25)  
> **Copy SOT (код):** `src/data/liveContent.ts` · `src/data/cases.ts` · `src/data/innerPagesData.ts` · `src/data/clients.ts`  
> **Brand doctrine:** §4 ниже (файл `docs/BRAND-ASCENT.md` удалён).
> **Glass SOT:** `src/data/deviceScreens.ts` · painters `src/lib/tabletGlassAnim.ts`

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
| `/craft`              | **Creative Studio**  | Fullscreen atmospheric video loops (light/dark) (`noindex`)   |
| `/contact`            | **Request Pilot**    | Contact form                                                  |
| `/contact/sent`       | —                    | Thank-you after Web3Forms                                     |
| `/cases/:slug`        | —                    | Deep-link modal на home                                       |
| `/privacy` · `/terms` | Legal                | Legal                                                         |
| `/dev/hero-capture`   | DEV only             | Everest frame capture                                         |
| `/dev/hero-lite`      | DEV only             | Redirect → `/?lite=1&theme=light` — real home JPEG fly        |
| `/dev/hero-dark`      | DEV only             | Redirect → `/?lite=1&theme=dark` — same, Infrastructure       |

**Нет живых страниц** `/expedition`, `/company`, `/solutions`. Footer explore на `/` = **The Agency** (синхрон с header).

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

The Agency (`/`) · The Routes (`/#routes`) · The Peaks (`/#cases`) · Creative Studio (`/craft`).  
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
- Player cache-bust: `HeroVideoFallback` `?v=10`.
- Player **idle-loads all 150** (`IDLE_CONCURRENCY = 8`). Cache the decoded `<img>` immediately — do not wait on `createImageBitmap` (that hole painted paper on Windows light). Never `fillRect` paper mid-scroll if a frame is already on the canvas; pick the closest cached index.
- Opaque 2d context, **no** `desynchronized: true` (Intel Windows flickered blank).
- Light JPEG foot: **no** `.hero-bottom-fade-bridge`. Baked paper fade is cropped in `drawCoverFrame` (mobile `-18%`, desktop/Windows `-22%`) then cover-fit. Do not put the milky wash back — it reads as a blur on Growth, including Intel Windows.
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
A Framer Motion spring (`stiffness: 160, damping: 28, mass: 0.95`) drives `phase` 0→1→2.  
Devices slide via `x: (slotIndex − phase) × 100%` + opacity fade (`1 - d * 1.15`). No `scale` or `filter:blur` on WebGL canvas (causes bilinear→native pixel snap artifact).

**Mount policy:** only the **active** slot (plus the outgoing slot for ~720ms during the spring). App Growth = phone canvas only. On OEM & CTV, warm **both** `routes-tablet` and `routes-tv` as soon as the lane is active (`tv.glb` is ~500 KB Draco — do not wait until CTV Spot). Off `/` (`/channels`), `whenHeroReady` must **not** wait for Everest (`scrollPreload.ts`).

**Graceful degradation (same as Everest):** width `< 1024` or `prefers-reduced-motion` → `ProgrammaticScrollSectionMobile`. Desktop lite (Intel / `?lite=1`) keeps the **two-column sticky** layout with **flat GLB** phone/tablet/TV (same `DeviceCarousel3`, `flat`) — not CSS chassis stand-ins (those caused big→small snap). High-tier → perspective GLB. `DeviceLoadStage` reveals settled WebGL only (`placeholder={null}`, instant). No full-page spinner.

| Device | Width in col | Camera | GLB |
| --- | --- | --- | --- |
| Phone | `min(48%, 21.5rem)` | Phone3D default | `/phones/deep-blue.glb` (light) · `/phones/orange.glb` (dark) |
| Tablet | `min(60%, 23rem)` | fov 36, z=3.48 | `/channels/oem/tablet.glb` |
| TV | `min(100%, 54rem)` | fov 31, targetHeight 1.25 | `/channels/oem/tv.glb` |

**Drag limits (all 3 devices, unified):** Y ±0.45 rad · X ±0.15 rad · sensitivity dx×0.006 / dy×0.004 · spring 260/30/0.7 · release snaps 35% toward REST.

---

### Phone3D

File: `src/components/solutions/Phone3D.tsx`

**Entrance (scroll-driven, 3 phases):** macro flyover → lift & rotate → lock face-forward (`REST_Y 0.07`, `REST_X −0.04` rad, ~4° depth hint).

**Screen glass:** Still PNG (`programmatic-refs/screens/{format}.png`) → Video MP4 (`programmatic-feed/formats/{format}.mp4`) promoted on `readyState >= HAVE_CURRENT_DATA`. No Suspense remount (white flash).

---

### Tablet3D

File: `src/components/channel-visuals/Tablet3D.tsx`  
Model wrapper: `Tablet3DModel.tsx` — **`primitive` of the GLB scene**. Current `tablet.glb` is iPad Air 4 (`body` / `frame` / `Ipad Air 4`). The old gltfjsx graph (`큐브`, `큐브_1`, …) **does not exist** in this file; reading `nodes.큐브.geometry` throws and `CanvasErrorBoundary` left an empty column.

Framing: `Center` + `rotation={[0.08, 0, 0]}` `scale={5.6}`. **Do not** add `rotation X = π/2` on this GLB (it is already face-forward; +90° shows the edge).  
Screen: materials whose `name` matches `/glass/i`. OEM stills: `public/channels/oem/screens/{pre-install,oem-store,system-ui}.png`. OEM **mp4s are not in git** (only `ctv-spot.mp4` / `.png` are tracked).  
Load UX: `DeviceLoadStage` — no CSS placeholder; reveal GLB only after size settles (kills big→small). No full-page spinner.  
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
3. **Still (OEM):** `public/channels/oem/screens/{format}.png` — `ctv-spot.png` is git-tracked; `pre-install` / `oem-store` / `system-ui` stills are local stand-ins until real OEM art exists.  
4. **Video (OEM):** only `ctv-spot.mp4` is in git. Do not point `<video>` at missing OEM mp4s (Vite returns HTML).

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

**Mobile (<768px):** `AudienceStatic` / `PromiseClean`. Framer `useScroll` misses Lenis, so rings/bars used to freeze. Drive them with `useMobileChartProgress` (Lenis-aware `useScrollScene` anchor on the chart). Scrub reverses on scroll up. Keep `chartRef` on an untransformed wrapper; put `y` on the inner motion node. PROOF sits lower (`mt-28`) so the outer ring is not cut by the copy above.

---

## 13. Scroll Scene System

`useScrollScene.ts` + `scrollScene.ts` · hero via `HeroFlyContext`.


| Mode             | Used by                         | Behavior                  |
| ---------------- | ------------------------------- | ------------------------- |
| HeroFly / runway | Hero                            | Lenis sticky; camera / FX |
| runway           | Promise                         | sticky fold desktop       |
| anchor           | Audience desktop + **mobile charts** | viewport / chart travel |
| viewportBand     | Process                         | band steps                |
| in-view          | Routes, Cases…                  | Reveal / Stagger          |
| format scroll    | `#routes`                       | `useFormatScrollSection`  |


**Gate:** desktop ≥768px + not reduced motion для heavy scenes. Scroll transforms: `**spring: false`**. Mobile Audience/Promise charts use the same Lenis bus (`useMobileChartProgress`) — do not go back to Framer `useScroll({ target })` while Lenis is on (`NATIVE_SCROLL_QUERY` is `max-width: 0px`).

---

## 14. Shipped polish log

### 7 Sep 2026 night — mobile chart scrub + light JPEG foot

| Area | Change |
| --- | --- |
| Mobile charts | `#audience` + `#promise` scrub on Lenis via `useMobileChartProgress`. Both themes. PROOF dropped (`mt-28`) so the red ring is not cut by copy |
| Light JPEG | No bottom fade-bridge. Player crops baked paper fade on **all** light sequences (`home-light` Windows + `home-mobile-light`) |
| Windows | Still JPEG / Intel lite. Same crop as mobile light — do not treat the foot fog as iPhone-only |

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
- **Hero split:** high-tier = live R3F. Lite (mobile, Intel, `?lite=1`) = JPEG sequence. Dark frames include Voyager. Light frames recaptured 7 Sep evening (settle 1400 ms, qscale 2). Light player crops the baked paper fade at the foot (Windows `home-light` and mobile). No CSS bottom wash on Growth.

### Git / disk (8 Sep 2026 — evening OEM glass)

- **This commit** ships OEM/CTV glass SOT + tablet/TV load fixes (see OEM block below). Parent includes Windows light JPEG hold (`7f5ffc0`).
- After push + `npm run deploy`: prod alias **https://upraiser.co.uk**.
- **Leave untracked:** `modal-open.png`, `modal-scrolled.png`, `oem-mobile.png`, `test-modal-scroll.mjs`, `test-oem-mobile.mjs`.
- **Do not commit** mass `D` on `public/hero/**` from a depleted local disk — restore via `restore-assets.sh` / `git restore`, do not treat as intentional product delete.

### Everest (light) — leave / continue here

Light path uses `everest-light.glb` + AmbientCG **Snow005** (`src/lib/heroModel.ts` → `/hero/snow005/…`). Shader: `snowSparkle.ts` (`everest-snow-poly-v25` when maps bind). `SnowSplatBinder` must stay a **child** of the mesh — putting the mesh inside `Suspense fallback={null}` hides the mountain while textures load.

Scene graph (`Scene.tsx`): keep **both** `StudioRimLight` and `MistSheets` imports. `SeaOfClouds` is a stub (`return null`).

**Do not:** EffectComposer / N8AO / Bloom / GSAP ScrollTrigger on hero / `transparent: true` on the four GLB chunks / second Everest canvas / resurrect `macbook.glb` on Routes / force Windows onto live WebGL.

Open visual debt: **right steep face UV smear** on scroll (grazing + mips). Next 3D pass = stronger world-space triplanar / `steepRockMask`, without covering the mesh again. Light **sky** haze/halo is on purpose (`AscentHalo`). The **foot** paper fade is not — crop it in the lite player; do not add `.hero-bottom-fade-bridge` on Growth.

### Local assets that vanish (read this before “3D is broken”)

`public/hero/**`, `public/draco/gltf/draco_decoder.wasm`, `public/channels/**`, `public/phones/**` keep disappearing from disk (`git status` mass `D`). Vite then **200s `index.html`** for the missing URL (`Content-Type: text/html`, ~5 KB). `useGLTF` / `useTexture` hang or throw; canvases stay empty or the compass spinner never clears.

- `scripts/restore-assets.sh` (`predev`) uses rsync `--ignore-existing`. A **folder can exist while a file inside is gone**, and the backup can also lack the file → script prints “All assets present”.
- Critical list in that script now includes Draco WASM, Everest GLBs, `tablet.glb`, `tv.glb`. Backup: `~/Downloads/upraiser-assets-backup/`.
- If a tracked binary is still missing: `git restore -- public/…` then copy into the backup.
- `draco_decoder.wasm` was **not** in the backup (only the two JS files). Without WASM, **dark Everest** and **TV** (Draco) hang in Suspense. `tablet.glb` is **not** Draco.

### Hero boot — compass “Rendering Terrain” (8 Sep)

Cause: `FirstFrameGate` sits in the same `Suspense` as Everest. If the GLB never decodes, the gate never mounts, overlay never clears.

1. Missing `public/draco/gltf/draco_decoder.wasm` (Vite served HTML).
2. Light: missing Snow005 JPG → `SnowSplatBinder` throw → empty sky (error boundary now falls back to JPEG).
3. Voyager (~13 MB) must **not** share that Suspense (`Scene.tsx` sibling). `whenHeroTerrainBytes` waits on the **mountain** GLB + Draco WASM only. Force-boot canvas at **2500 ms**. Overlay auto-hides at **4000 ms** (`bootStuck` in `HeroTerrainCanvas`) so the compass cannot stick forever.

Apple / Metal / NVIDIA / Radeon → hardware tier **high** even if Chrome reports 4 cores / 4 GB (`useHardwareTier.ts`). Intel/UHD/Iris/Mali/Adreno → lite. `?lite=1` still forces lite.

### OEM & CTV glass (9 Sep — snap / fill / rich polish)

Owner: `/channels` → **OEM & CTV** lane. Reveal GLB after size settle — **no** CSS chassis stand-in, **no** full-page spinner.

#### Glass SOT (`src/data/deviceScreens.ts`)

| Format id | Still | Video / HTML | Notes |
| --- | --- | --- | --- |
| `rich` | `…/rich-media.png` | **still only** | Full-bleed static creative (no HTML / no MP4 loop) |
| `banner` / `native` / `interstitial` | matching PNGs | **still only** | Restored PNGs; no idle float on phone |
| `video` | `…/video.png` poster | `video.mp4` | Only App Growth format that plays motion |
| `pre-install` | `…/pre-install-oobe.png` (cropped fill 900×1200) | canvas OS ticks | Side letterbox removed; clock + progress remapped in `tabletGlassAnim` |
| `oem-store` | `…/oem-store.png` (zoomed dense fill) | lite: `oem-store.html`; 3D: canvas marquee | Featured icons = unique `cases/logos` + `clients` |
| `system-ui` | `…/system-ui.png` | canvas OS ticks | Shade inset is intentional |
| `ctv-spot` | `…/ctv-spot.png` | — | Smart TV still |
| `ctv-video` | same PNG as poster | `…/ctv-spot.mp4` (~19 s loop) | Spot ≠ Video on glass |

Shared painters: `src/lib/tabletGlassAnim.ts` (lite `FormatGlass` + Tablet3D `CanvasTexture`).

**OS-like motion only (no sheen):**

- `oem-store` — slow horizontal ribbon on large icon rows
- `pre-install` — live clock + install progress under Apex Pay
- `system-ui` — live clock + one notification settle-in
- Prefer `prefers-reduced-motion` → still + clock only

#### Tablet / TV load (bugs fixed)

| Symptom | Cause | Fix |
| --- | --- | --- |
| CSS chassis stuck / flash on format change | StrictMode cancelled `rAF` + `readySent`; `setMeshReady(false)` + `setScreenMap(null)` on every format | Reveal only after GLB first paint (double-rAF); **do not** clear map until next texture commits; no meshReady bounce on format id |
| Tablet/TV **big→small snap** + TV chassis vanish | `ForceCanvasSize` / `useEffect(() => setMeshReady(true))` revealed empty canvas; CSS filled slot while camera framed smaller | Never mark ready from size alone; wait for mesh; pull camera closer / larger `getTargetHeight`; softer `DeviceLoadStage` spring |
| Glass content letterboxed | Side-padded PNGs + screen plane 0.90 | Crop/zoom stills to fill; screen plane ≈0.98 |
| Harsh phone↔tablet↔TV cut | `stiffness: 340`, opacity `1−dist×1.9` | Softer spring (`160/28/0.95`) + opacity `1−dist×1.15` |
| Empty / 300×150 WebGL buffer | Phone+tablet+TV canvases concurrent; canvas mounted before slot box | **One active WebGL device** in `ProgrammaticScrollSection` (others = CSS); mount Canvas only after slot ≥64×64; `ForceCanvasSize` sizes buffer only |
| Decorative “marketing” pulses | Earlier sheen experiments | Removed; OS ticks only |

Helpers: `DeviceLoadStage.tsx`, `FormatGlass` in `CssPhone.tsx`, `Tablet3DModel` screen plane (`MeshBasicMaterial`, GLB `glass` = camera lens only).

#### Verify

1. Desktop ≥1024, high tier: `/channels` → App Growth → banner/native/interstitial/rich = **static full-bleed stills** (no breathing); Video format = mp4.
2. OEM & CTV → Pre-install / OEM Store glass fills the iPad screen (no fat side pads).
3. Tablet/TV first paint: no oversized CSS→tiny GLB snap; TV keeps chassis.
4. Scroll phone → tablet → TV feels soft (longer opacity overlap).
5. CTV Spot = still; CTV Video = mp4 loop. `?lite=1` = same `deviceScreens` files.

#### Still open (owner yes)

1. Optional Lenovo ZUI first-boot stitch instead of phone-style PAI (owner previously preferred keep/naturalize PAI).
2. Everest light right-face UV smear (separate ticket).
3. Deploy only when owner asks (`npm run deploy`).

### Do first in a new session

1. Restore missing `public/` binaries **before** debugging WebGL (`git restore`, `restore-assets.sh`, check WASM `Content-Type: application/wasm`).
2. `npm run dev` → `http://localhost:5173/` and `http://localhost:5173/channels` (desktop ≥1024).
3. Desktop **high-tier** light: live mountain on first paint. Desktop **lite** / Windows / `?lite=1`: JPEG sequence, both themes; Growth foot is mountain, not a milky wash.
4. Mobile `<768`: `#audience` + `#promise` charts scrub forward/back on scroll (both themes). PROOF ring not jammed into the copy above.
5. Header = Agency + Craft. `/channels` reachable from `#routes` CTA. About is on home, not `/company`.
6. Do not commit `.agents/skills`, `.claude/skills`, `public/timesst.mp4`, `modal-open.png`, `modal-scrolled.png`, `oem-mobile.png`.

### Next work (needs owner yes)

Parked / in-flight:

1. Optional Lenovo ZUI pre-install stitch (vs current PAI naturalize)
2. Everest light: kill right-face UV stretch on the 300vh fly
3. Merge three Routes canvases into one (quality risk) — currently **one WebGL at a time** by scene
4. Recompress `everest-light.glb` (~11 MB) — **do not** bake the light curve
5. Dual phone GLB fetch on `/channels` — observed, not asked
6. Analytics / cookie banner — parked until owner + privacy update
7. `DESKTOP_HERO_QUERY = "(min-width: 0px)"` — documented, do not silently revert to 900px

Do **not** start a new “load-speed refactor spec folder”. Keep notes in this file.

### Sacred (do not break)

Everest **one** canvas · Routes still→MP4 glass on `/channels` · dual theme Growth ↔ Infrastructure · Inter · white light paper · Request Pilot only on `#pilot` + `/contact` · Framer `type: "spring"` · `.cursorrules` hover/dvh/44px · H1 *We see how stunning / Your rise to the top / can be.* · Windows lite stays JPEG.

### Deploy if the owner asks

rsync backup → commit **site only** → `git push origin HEAD` → `npm run deploy` (`upraiser-site-v2`). GitHub auto-deploy is not canonical.

---


### 3D Performance, Preloading, and Sync (Sep 2026 Update)
1. **Aggressive Preloading:** Large models (`tv-draco.glb`, `tablet.glb`) must be aggressively preloaded in the root `App.tsx` (`useGLTF.preload`) to bypass React Suspense network delays during scroll.
2. **Synchronized Phases:** Separate `<Canvas>` components (Phone, Tablet, TV) mount asynchronously. Animations driven by `state.clock.elapsedTime` will desynchronize. Always use global `performance.now() / 1000` for `Math.sin()` floats to keep all devices breathing in perfect unison.
3. **Instant Reveal:** Avoid `DeviceLoadStage` CSS spring fade-ins for models without a fallback silhouette. Use `placeholder={null} instant` so the chassis pops in instantly.
4. **Texture Loading & "White Holes" Anti-Pattern:**
   - ❌ **FAILED:** `useTexture(stillSrc)` suspends the entire React tree. On a slow network, the 9MB chassis waits for a 100KB PNG, leaving a "white hole" (emptiness) in the layout.
   - ❌ **FAILED:** `TextureLoader` inside `useEffect` (blindly). Chassis mounts instantly, but the screen is black for 200ms. Result: an ugly "pop-in" effect where the screen appears after the chassis.
   - ✅ **SOLUTION:** Use `TextureLoader` inside `useEffect`, but **delay** calling `onReady?.()` until `screenMap` is loaded. `DeviceLoadStage` keeps the CSS `opacity: 0` until `onReady` fires. This guarantees the chassis and poster appear simultaneously, but without blocking the main React thread (no Suspense).

5. **Video Hardware Decode Stutter Anti-Pattern:**
   - ❌ **FAILED:** Calling `video.play()` and immediately swapping to `VideoTexture`. The browser's `loadeddata` event triggers `gl.initTexture()`, which blocks the main thread for 200–500ms on weak hardware. If this happens while the TV is sliding in via CSS, the animation stutters horribly.
   - ✅ **SOLUTION:** 
     1. Delay `video.play()` by 850ms (let the CSS slide-in animation finish at 60 FPS).
     2. Call `video.play()`.
     3. Wait for `video.requestVideoFrameCallback` (guarantees the GPU has fully decoded and uploaded the frame).
     4. Only *then* swap the material to `VideoTexture`. Zero black flashes, zero scroll stutter.

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
| 8 | sitemap.xml | **Done** — live URLs: `/`, `/channels`, `/contact`, `/privacy`, `/terms`. No `/expedition`. Craft stub is `noindex`. |
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
- This ritual commits the light bake + flash/ghosts + MASTER. Everest light UV smear still the open 3D ticket.
- 7 Sep evening: `sitemap.xml` drops `/expedition`, adds `/channels`. Footer / contact / thank-you / craft / 404 now say **The Agency**. Format tabs/taglines no longer clamp. Dark muted token bumped for body contrast.
- Same evening, owner pass: hero stat cards restored to gold→red (do not flatten to single gold). Light lite no longer has the 46% white scrim over the mountain base; light fog/mist pulled back; `home-light` + `home-mobile-light` recaptured (`?v=10`). Dark JPEG player draws on the same sticky progress as live 3D (no Lenis+rect mix), nearest-frame fallback, ImageBitmap. PROOF ghosts stay clipped off copy.
- Same night: mobile `#audience` / `#promise` charts were static again (Framer `useScroll` vs Lenis). Wired `useMobileChartProgress`. PROOF lowered on mobile. Light JPEG foot crop on **Windows `home-light` and mobile** — no CSS fade-bridge on Growth.
- 8 Sep: Windows light JPEG looked like a reload on scroll — missing frames filled white paper (dark hid the same hole). Player now keeps the last decoded frame, caches `<img>` immediately, closest-index fallback, no `desynchronized` 2d.

### 8 Sep 2026 evening — hero hang + OEM/CTV 3D

- Home compass spinner hung: missing `draco_decoder.wasm` (Vite served HTML). Restored from git; overlay timeout 4 s; Voyager not on the first-paint Suspense. Apple GPU stays hardware **high**.
- Light mountain empty: Snow005 JPG 404 crashed the canvas → JPEG fallback on `CanvasErrorBoundary`.
- `/channels` 3D phone: `native.png` 404 killed `useTexture` of all stills.
- OEM tablet empty: `Tablet3DModel` still targeted deleted `큐브_*` nodes. Wrapper is now scene clone + screen plane. TV is Draco ~500 KB — same WASM hole.
- No full-page OEM spinner. `DeviceLoadStage` holds empty then reveals settled GLB (no CSS→3D size snap). `/channels` no longer waits 4 s on hero before warming GLBs.

### 8 Sep 2026 night — OEM glass SOT + WebGL isolation

- `deviceScreens.ts` is the only glass feed: PAI pre-install, OEM store (HTML + unique case icons), system-ui, CTV Spot still / CTV Video mp4.
- `tabletGlassAnim.ts`: store marquee + OS clock/progress/notification only.
- Routes carousel mounts **one** Phone3D | Tablet3D | Tv3D at a time (inactive slots = CSS) to stop 300×150 / context starvation.
- Tablet: slot-box gate + `ForceCanvasSize`; keep previous screen map across format changes (no black-glass flash).

---

*End of master document. При изменении IA, hero, Routes glass, Windows quirks, preload или deploy — обновляй **этот** файл. Других проектных md нет.*

### Background Warming (September 2026 Fix)
To prevent severe main-thread freezing (up to 2.5s) on Intel GPUs when scrolling to the TV formats in the programmatic feed, we implemented **Background Warming**. 
- The TV component (`Tv3D`) is deliberately mounted off-screen (`x: 100%`) when the user reaches the **Tablet** stage (`scene === "tablet"`).
- A hidden mesh with `videoTex` forces the browser to compile the WebGL shaders and upload the heavy MP4 first frame to the GPU *while* the user is reading the tablet copy.
- When the user scrolls to TV, it slides in with 60FPS. 
- See `docs/LESHA-PAIN-POINTS.md` for full context on why `frameloop="always"` or `gl.compile` failed.

**Update (Late September 2026):**
The background warming strategy failed because browsers pause `requestAnimationFrame` for off-screen canvases, even if `frameloop="demand"`. To force the GPU compilation while the canvas is off-screen, we introduced `<WarmupRenderer>`. It listens for `meshReady` and synchronously calls `gl.render(scene, camera)`. This synchronous JS call forces WebGL to compile all shaders and upload the `VideoTexture` to VRAM without waiting for the deferred `rAF` loop. Because `<Tv3D>` is preserved in the React tree during the transition to the TV stage, this exact WebGL context is reused, preventing any main-thread blocking when the TV slides into view.

### 3D Performance & React-Three-Fiber Architecture Rules (September 2026)
We successfully debugged a major issue where the 3D TV component would cause a massive scroll stutter and a 2-second "emptiness" (pop-in) when sliding into view on weak devices. The root cause was a combination of CSS ResizeObservers, Framer Motion starvation, and TextureLoader main-thread blocking.

#### 1. The WebGL ResizeObserver Scroll Stutter (The "Squish" Bug)
**Anti-Pattern:** Gating physical CSS dimensions of a WebGL container behind a scroll-triggered state, e.g., `[data-scene="tv"] .prog-device-slot--tv`.
**Why it fails:** When the container has no explicit dimensions (or falls back to a default "squished" state) while off-screen, it renders the `<Canvas>` at a tiny size. When the user scrolls past the threshold, `data-scene` updates, the container expands, and R3F's `ResizeObserver` detects the change. This forces a synchronous WebGL projection matrix recalculation and re-rendering of the 9MB GLB mid-scroll, blocking the main thread for 50-150ms.
**Solution:** Define fixed or responsive dimensions (e.g. `aspect-ratio: 16/12`) **unconditionally** on WebGL wrappers. The Canvas must be its true size even while off-screen to prevent `ResizeObserver` recalculations mid-transition.

#### 2. The DeviceLoadStage 2-Second Emptiness (Framer Motion Starvation)
**Anti-Pattern:** Wrapping heavy WebGL models in a Framer Motion `opacity` fader like `<DeviceLoadStage>` to hide the "chassis-first, texture-second" pop-in.
**Why it fails:** Even with `instant={true}` (`duration: 0`), Framer Motion's animation queue can get starved when the main thread is busy with Draco decoding or shader compilation. This leaves the opacity stuck at `0.02` for a literal 2 seconds, creating a phantom "emptiness" where the model is rendered but invisible.
**Solution:** Do not use `<DeviceLoadStage>` or `motion.div` opacity wrappers on TV/Tablet slots. Instead, use standard CSS classes (`<div className="prog-device-load">`) so the canvas is natively visible the exact millisecond WebGL renders it.

#### 3. The TextureLoader Main-Thread Lag Spike & Preloading
**Anti-Pattern:** Running `new TextureLoader().load()` dynamically during scroll events (e.g., when `formatId` changes).
**Why it fails:** `TextureLoader` decodes PNGs and calls `gl.initTexture()`. This is a synchronous main-thread operation. Even if the image is in the browser cache, uploading it to the GPU takes ~50-100ms, causing a stutter and a delayed texture pop-in.
**Solution:** 
1. Preload the raw images globally in `index.html` (`<link rel="preload" as="image" href="/channels/oem/screens/ctv-spot.png" />`) to eliminate network latency.
2. For devices with identical fallback images (like TV using `ctv-spot.png` for both `ctv-spot` and `ctv-video`), hardcode the `stillSrc` in the mesh component so `TextureLoader` only runs once on page load, not during scroll transitions.
3. Use a `useRef` (e.g., `stillTexRef`) to cache the loaded texture. When switching back from a video format to a still format, instantly apply `stillTexRef.current` to the material instead of re-triggering a load.


### WebGL Fallbacks & Cross-Platform Stability (Windows/Intel)
- **Zero-Tolerance Crash Handling:** Never assume `tier === "high"` guarantees a stable WebGL context. On Windows, graphics drivers can freeze the main thread if they fail to compile Draco shaders or allocate buffers.
- **Bypass 3D Mount on Fallback:** If `!use3d` (e.g. `tier === "lite"` or `reduced === true`), **never** mount a `<Canvas>` just to show a "flat" model. Always mount the lightweight DOM CSS equivalent (`<CssPhone>`).
- **CanvasErrorBoundary Fallback:** Wrap every critical 3D scene in `<CanvasErrorBoundary>`. If WebGL crashes, the fallback must be a fully functional CSS layout (e.g. `fallback={<CssPhone />}`), not `null`. Otherwise, the page goes blank and the browser stalls.
- **R3F Camera Memoization:** In React-Three-Fiber, passing an inline object to the `<Canvas>` camera prop (`camera={{ position: [x,y,z] }}`) forces a camera reset on every React parent re-render. Always memoize the camera object using `useMemo` if the parent can re-render (e.g., from scroll state changes), otherwise the camera will violently snap to start and jump back.


### 8 October 2026 — Windows Metalness Blackout, Flat Mode, & Hero Legibility
- **Weak Windows 3D Blackout Fix:** On Windows laptops with integrated graphics (e.g., AMD Ryzen, older NVIDIA), `detect-gpu` often classified the device as `tier = "high"`. However, weak WebGL implementations or missing HDR environments caused perfectly metallic objects (`metalness = 1`) to render completely pitch black, and heavy `transmission` (refraction) materials to fail. Patched `Phone3D.tsx` (`applyScreenTexture`) to aggressively limit `metalness` to a maximum of `0.75` and convert `transmission > 0` to standard `transparent = true`, `opacity = 0.15`. This ensures 3D models ALWAYS receive some diffuse lighting and never turn into black voids, even if the PMREM environment map fails.
- **Hero Video & Auto-Scroll Tweaks:** Removed a 10s CSS `scale` "breathing" animation from `.hero-video-canvas` to fix severe frame-dropping and micro-stuttering on weak machines. Added a `2.5s` delay (`setTimeout`) before the automatic cinematic scroll-down is triggered by `hero-video-ended` so users have time to read the Lenovo trust badge.
- **Hero Video Text Legibility:** Switched the floating hero lede text (`hero-lede`) and the `HeroHighlights` "Explore" chips from `text-muted` to `text-fg font-medium`/`font-bold`. Because the new video background (bright snowy mountain) is overwhelmingly white in light mode, `text-muted` was invisible. `text-fg` correctly adapts to be solid black on light mode (snow) and bright white on dark mode (space terrain).
- **CSS Phone Realistic Inset & Alignment Fix:** Disabled the WebGL `Phone3D` fallback entirely for weak devices by letting `tier === "lite"` mount `<CssPhone>`. Fixed `<CssPhone>` styling where the iframe (`.prog-css-phone__screen`) was using `inset: 0`, completely covering the black bezel and causing the iframe content to collide with the dynamic island. Changed to `inset: 0.35rem` with `border-radius: 1.8rem` to simulate a realistic inner black glass frame. Centered the live HTML iframe vertically (`top: "50%", transform: translate(-50%, -50%)`) to create natural letterboxing and avoid UI clipping.
- **Lenis Modal Scroll Bug:** Lenis completely intercepts `wheel` events globally. If a modal (like "Our Clients") is opened and the body is locked, Lenis prevents all scrolling inside the modal too. Fixed by adding the `data-lenis-prevent` attribute to `.case-detail-modal__panel` and locking the body via `overflow: hidden` instead of `position: fixed`.
 
### 13 October 2026 — 3D Devices Upright Alignment, Channels Sticky Clearance, Snowfall Deactivation, & Full i18n Translation Layer
- **3D Devices Upright Normalization:** Eliminated artificial resting pitch/yaw tilts (`REST_Y`, `REST_X`) and perpetual rotational wobble (`floatRotX`, `floatRotY`) across `Phone3D.tsx`, `Tablet3D.tsx`, and `Tv3D.tsx`. All devices now sit perfectly upright, level, and symmetrical at `REST_Y = 0, REST_X = 0`, keeping gentle vertical float only. Interactive 3D parallax on pointer drag/hover remains active and smoothly springs back to upright (0, 0) upon pointer leave.
- **WebGL Canvas Geometry & Scaling:** Removed the fragile `width: 150% !important` and `110%` canvas width hacks and `inset: 0.35rem` shifts from `.prog-device-load__canvas`. Canvases now strictly use `width: 100%` and `inset: 0`. Camera FOV and distance were mathematically calibrated (`fov: 36, z: 3.52` for phone) within the expanded phone slot budget (`max-width: min(42%, 18.5rem)`), ensuring 0px mesh edge clipping and authentic aspect ratios across Windows 125%/150% display scaling.
- **Channels Page Header Overlap Fix:** `.channels-page .prog-scroll-sticky-inner` was previously set to `padding-top: 1rem` (16px), causing the section header ("LANES" / "EVERY FORMAT. ONE SUPPLY PATH.") to render directly underneath the fixed `< Back to The Routes` pill button. Adjusted padding-top to `calc(var(--site-header-height, 72px) + 0.5rem)` to guarantee generous optical clearance on all viewports, and ensured `min-h-[44px]` touch target compliance on the Back button.
- **Deactivation of GlobalSnowfall on Channels:** Snowfall particle animation was completely disabled on the `/channels` route via `useLocation` checks in both `SiteLayout.tsx` (unmounting `<GlobalSnowfall />`) and `GlobalSnowfall.tsx` (bypassing flake generation, scroll hooks, and `requestAnimationFrame` render loops), freeing GPU fill rate and CPU cycles for the 3D device stage.
- **About Us Mountain Schematic Opacity Softening:** The wireframe ascent SVG in `AboutUsSection.tsx` was reduced from `opacity-80` to `opacity-25 dark:opacity-20`, with line strokes thinned and softened (`mountain-line` 0.3, `route-line` 0.55), transforming it into a subtle architectural watermark that preserves body copy readability.
- **Automated Full-Site i18n Architecture:** Deployed an automated DOM-level translation layer (`src/lib/domTranslate.ts`) backed by `strings.json` and 7 language locale dictionaries (`en`, `zh`, `ja`, `ko`, `es`, `de`, `fr`). Created developer CLI tooling:
  - `npm run text -- "<phrase>"`: Instantly locates text across all code files and shows translation status across all 7 languages.
  - `npm run i18n:audit`: Scans JSX text, locale key discrepancies, and Cyrillic leaks.
  - `npm run i18n:dict`: Manages dictionary extraction, synchronization, and merge workflows.
  - Clarified eliminated fraud metrics in `FraudScrollChart.tsx` and `FraudParticleFilter.tsx` to "Bots & Farms Eliminated" (47%) and "Click Flood Blocked" (35%) with full multilingual coverage.
- **Channels CTA Ghost Metrics Standardization:** In `ChannelsCtaSection.tsx` (the rotating omni-channel wheel section at `#routes`), ghost floating nodes (45% Programmatic, 22% CTV, 18% Social Ads, 15% OEM) previously used raw Tailwind classes (`text-fg/30`, `text-fg/20`, `text-fg/10`) with low peak opacities (0.2–0.4), resulting in nearly invisible black silhouettes on Windows dark mode. Standardized them to canonical `ChartGhostValue` and `fold-chart-ghost-label` components with `peakOpacity={0.78}`. They now automatically inherit IBM Plex Mono tabular numerals, standard site-wide ghost styling, and dedicated high-contrast Windows dark mode accent tints (`html[data-os="windows"][data-theme="dark"] .fold-chart-ghost-value`).
- **Case Modal Regression Fix (14 Oct 2026):** Cases stopped opening (only the ambient star/mountain background showed). Root cause: the 9 Oct z-index refactor (`ec087b08`) replaced literals with `var(--z-max)`, `var(--z-header)`, `var(--z-grain)` but never declared those tokens, so `z-index` computed to `auto` and `GlobalAmbientModalBackground` (inline `z-index: 990`) covered the modal panel. Tokens are now declared in the `:root` block of `base.css` with the original values (`--z-grain: 30`, `--z-header: 120`, `--z-max: 10050`). **Rule:** never reference a `--z-*` token in CSS without checking it exists in `base.css`; `--z-max` must stay above 990.
- **Unified Header Back Button & Mobile Compression (14 Oct 2026):** Replaced divergent back buttons in `ChannelsPage.tsx` and `CreativeStudioVideo.tsx` with a unified, mirrored capsule Back button rendered inside `Header.tsx`. Aligned on the exact same row (`h-[var(--site-header-bar)]` + `mt-2`) on both desktop (`lg:`) and mobile (`< lg`). On mobile, `HeaderIsland` compresses by hiding the verbose theme label (`hidden sm:inline`), keeping only the Sun/Moon icon, which frees over 120px and allows `[ ← The Routes ]` / `[ ← Explore ]`, `HeaderIsland`, and the logo to sit cleanly on a single row without wrapping or collision.
- **Naming Standardization to "The Craft" (14 Oct 2026):** Standardized all navigation, typography, and locale entries from "Creative Studio" / "Creative Lab" to **"The Craft"**, aligning with the official brand lexicon (The Agency, The Routes, The Peaks, The Craft).
- **Channels CTA Mobile Stacking Order (14 Oct 2026):** In `ChannelsCtaSection.tsx`, changed the 800px wheel wrapper from `z-50` to `z-0`, keeping it strictly behind the text (`relative z-10`) and primary CTA button (`relative z-20`). On mobile (`< lg`), adjusted positioning to `-translate-x-[65%]` and lowered opacity to 0.4 so the "Explore All Channels" button is 100% visible and interactive.
- **Expedition Mountain Collision Resolution (14 Oct 2026):** In `HomePilotCta.tsx`, increased mobile bottom clearance to `pb-[85vw] sm:pb-0`, reduced mobile `.cta-mountain-bg` scale to `135% auto`, and elevated `pilot-story-switch` with `bg-bg-elevated/90 backdrop-blur-md border border-border/60 shadow-xs min-h-[44px] relative z-20`, ensuring the climbers and mountain graphics never cut across the "Infrastructure story →" button.
- **Mac 3D Device Rendering Restoration (14 Oct 2026):** Restored 3D tilts, rotational float, overshoot, camera perspective, and canvas bounds in `Phone3D.tsx` (`REST_Y = 0.07`, `REST_X = -0.04`, `fov: 35`), `Tablet3D.tsx` (`REST_Y = 0.06`, `REST_X = -0.03`, `rotation: [0.08, 0, 0]`), `Tv3D.tsx` (`REST_Y = 0.04`, `REST_X = 0.008`, `rotation: [0.06, 0, 0]`), and `programmatic-scroll-section.css` (`width: 150% !important` for phone/tablet, `width: 110% !important` for TV), eliminating squishing and restoring realistic perspective on Mac.
- **Case Modal Scroll Jump & Preservation Fix (14 Oct 2026):** Opening or closing a case study card in "The Peaks" (`#cases`) previously triggered an unwanted reset of page scroll to top `(y = 0)`. Root cause: commit `0ea516e8` added a route change listener in `SmoothScroll.tsx` that unconditionally called `lenis.scrollTo(0)` and `window.scrollTo(0, 0)` on every route transition without a hash, bypassing the exemptions in `ScrollToTop.tsx`. Resolved by:
  1. Adding `prevPathRef` to `SmoothScroll.tsx` to strictly bypass scroll resetting on `/cases` transitions (`pathname.startsWith("/cases") || (prevPath.startsWith("/cases") && pathname === "/")`).
  2. Adding `savedScrollYRef` in `CaseModalContext.tsx` to capture the exact background page scroll before modal opening and restore it upon closing.
  3. Specifying `preventScrollReset: true` on both `openCase` and `closeCase` router navigation calls.
- **Windows Emulation & Preview Tooling (14 Oct 2026):** Implemented automated multi-viewport verification tooling for Windows devices without needing physical Windows hardware:
  - Added URL parameter support: `?os=windows` and `?os=mac` (enables `html[data-os="windows"]` and Windows ClearType styles in any browser with sessionStorage persistence), plus `?tier=lite` and `?tier=high` (toggles flat CSS mockups vs 3D WebGL).
  - Added `npm run dev:windows` (`vite --open '/?os=windows'`) to boot local development directly in Windows mode.
  - Shipped `npm run preview:windows` (`scripts/preview-windows.mjs`), which automatically launches headless Chromium emulating Windows NT 10.0, captures 1080p 125% display scaling (1536×864, DPR 1.25), 150% scaling (1280×720, DPR 1.5), and Intel GPU Lite fallback, saving inspection PNGs to `preview-windows/`.
- **Flat Mode / CssPhone Aspect-Ratio & Stretching Fix (14 Oct 2026):** Resolved extreme vertical stretching of `CssPhone` in lite/fallback mode (where the phone rendered as an elongated tube with a distorted Dynamic Island). Root cause: `h-full w-full` on `motion.div` in `ProgrammaticScrollSection.tsx` forced 100% width and height, overriding `aspect-ratio: 9 / 19.5`, while nested `inset: 0.35rem` in `.prog-format-glass` and `.prog-css-phone__live-ad` reduced horizontal width by another 34px. Fixed by:
  1. Removing `h-full w-full` from fallback devices so `.prog-css-phone` respects intrinsic `aspect-ratio: 9 / 19.5` with `height: 100%; width: auto; max-width: 100%;`.
  2. Expanding `.prog-device-slot--phone` `max-width` to `min(42%, 18.5rem)` so a 522px tall chassis has the 241px width budget required for an authentic 9:19.5 iPhone aspect ratio.
  3. Setting nested `.prog-format-glass` and `.prog-css-phone__live-ad` to `inset: 0` inside `.prog-css-phone__screen`.
- **Simultaneous Dual-Dev Server for Mac & Windows (14 Oct 2026):**
  - Added `npm run dev:dual` (`scripts/dev-dual.mjs`) to concurrently host both development environments in real time:
    - **Mac Server (`http://localhost:5173/`):** Native Retina DPR 2, Apple WebGL Metal, high hardware tier, Mac system typography.
    - **Windows Server (`http://localhost:5174/`):** Automated `data-os="windows"`, subpixel ClearType font rendering, Windows scrollbars, and lite CSS chassis.
  - Implemented zero-configuration port detection in `index.html`, `src/main.tsx`, and `src/hooks/useHardwareTier.ts`: any request arriving on port `5174` automatically defaults to Windows mode and lite tier without requiring any URL query parameters.
  - Added standalone `npm run dev:win` command for launching only the Windows port 5174.
- **TV Bezel Blind-Spot Resolution (14 Oct 2026):**
  - Resolved a prominent black triangular cutout/blind spot in the upper-left (and upper-right) corner of the TV screen in `CssTv`.
  - Root cause: `.prog-css-tv__bezel .prog-css-phone__live-ad` had legacy phone chassis properties (`inset: 0.35rem; border-radius: 1.8rem; transform: scale(1.04);`), rounding off the rectangular video with giant phone corners and offsetting it downward-right, exposing the black `#050505` TV chassis underneath.
  - Fixed in `src/styles/programmatic-scroll-section.css` by setting `inset: 0; border-radius: 0.25rem; transform: none; width: 100%; height: 100%; object-fit: cover;`, achieving flush edge-to-edge video presentation with realistic OLED panel corners.
- **Phone Chassis Placement Cropping & Island Cleanup (14 Oct 2026):**
  - Resolved an issue where the drawn phone chassis borders were eating into ad placements (e.g. cutting off AccuWeather bottom navigation tabs, Reddit "Vote" and comment buttons, and side margins).
  - Root cause: Outer `.prog-css-phone` had `padding: 0.55rem`, the bezel had `border: 2px`, and `.prog-css-phone__screen` was inset by another `0.35rem` with a `1.8rem` corner radius, creating ~16px of black border on all sides and heavily distorting the screen aspect ratio (0.425 vs true 0.462), forcing `object-fit: cover` to crop the sides of creatives.
  - Fixed by:
    1. Reducing the outer titanium frame padding to `0.28rem` (ultra-thin flagship bezel).
    2. Setting `.prog-css-phone__screen` to `inset: 0; border-radius: 1.95rem;`, matching the exact `9 / 19.5` aspect ratio of `780 × 1688` screenshots so no side cropping occurs.
    3. Setting `.prog-css-phone__island` and `.prog-css-phone__home-glow` to `display: none;`, preventing the floating black island pill from obscuring headers (e.g. Reddit "Popular", AccuWeather radar titles), matching the clean screen presentation of the 3D phone model.
- **Dynamic Aspect-Ratio Lock Across All Display Zoom Levels (14 Oct 2026):**
  - Resolved an issue where CSS devices (Phone & Tablet) stretched vertically into elongated tubes on Windows/Lite tier when zooming to 100% or on tall screens (height > 864px), while looking normal only at 125%.
  - Root cause: `.prog-device-slot--phone` had `height: 100%` and `max-width: min(42%, 18.5rem)`. On 1080p monitors at 100% scale, height expanded to 822px while width was clamped to 241px. Because `height` was an explicit 100% constraint, CSS `aspect-ratio` could not shrink the height, forcing the phone into an 822×241 tube (ratio 0.294 vs true 0.462). At 125% scale (`1536×864`), the height budget coincidentally landed at 522px (`522 * (9 / 19.5) = 240.9px`), which barely fit within the 241px width cap.
  - Fixed in `src/styles/programmatic-scroll-section.css`:
    - `.prog-device-slot--phone`: `width: min(42%, 18.5rem, calc(min(80dvh, var(--prog-phone-budget, 80dvh)) * (9 / 19.5))); height: auto; max-height: min(80dvh, var(--prog-phone-budget, 80dvh)); aspect-ratio: 9 / 19.5;`.
    - `.prog-device-slot--tablet`: `width: min(60%, 23rem, calc(min(75dvh, var(--prog-phone-budget, 75dvh)) * (3 / 4))); height: auto; max-height: min(75dvh, var(--prog-phone-budget, 75dvh)); aspect-ratio: 3 / 4;`.
  - Now, width dynamically bounds itself against the height budget *and* column width, allowing `height: auto` to strictly preserve the exact mathematical ratio (`0.462` for Phone, `0.750` for Tablet) with 0.00% error across 80%, 100%, 125%, 150%, and all viewport sizes.
- **Mac 3D Device Asset Enlargement & Windows Hierarchy Duplication (14 Oct 2026):**
  - **Mac 3D WebGL Enlargement (~18–20%):** Resolved the issue where 3D assets felt slightly too small floating on the stage. Enlarged Phone3D mesh scale from `7.0` to `7.45` and brought camera `z` closer from `3.48` to `3.08`; enlarged Tablet3D mesh scale from `6.2` to `6.9` and moved camera `z` from `3.48` to `3.18`; brought Tv3D camera `z` from `4.65` to `3.98` with `fov: 32`. All three assets now command the stage with richer detail, zero edge clipping, and smooth floating parallax.
  - **Windows Proportions & Hierarchy Parity (Phone < Tablet < TV):** Resolved the inversion on Windows/Lite tier where the CSS Phone rendered taller (524px) than the Tablet (405px) and TV (332px).
    - Root cause: `.prog-css-tablet` retained legacy overrides (`height: min(88%, var(--prog-tablet-budget)); max-height: min(70dvh)`), shrinking it inside its slot, and `.prog-css-tv` had `max-height: min(58dvh, 100%)`.
    - Removed conflicting internal clamps from `.prog-css-tablet` and `.prog-css-tv`, setting them to cleanly fill 100% of their proportional slots.
    - Sized device slots to mathematically duplicate the Mac hierarchy:
      - **Phone:** `aspect-ratio: 9 / 19.5; width: min(40%, 15.5rem, calc(min(74dvh, calc(var(--prog-phone-budget, 80dvh) * 0.85)) * (9 / 19.5))); height: auto; max-height: min(74dvh, calc(var(--prog-phone-budget, 80dvh) * 0.85));` -> **230px W × 499px H** (~115k px²).
      - **Tablet:** `aspect-ratio: 3 / 4; width: min(72%, 27rem, calc(min(80dvh, var(--prog-phone-budget, 80dvh)) * (3 / 4))); height: auto; max-height: min(80dvh, var(--prog-phone-budget, 80dvh));` -> **415px W × 553px H** (~229k px², **+100% area and +54px taller than phone**).
      - **TV:** `aspect-ratio: 16 / 10; width: min(118%, 48rem, calc(min(80dvh, var(--prog-phone-budget, 80dvh)) * (16 / 10))); height: auto; max-height: min(80dvh, var(--prog-phone-budget, 80dvh));` -> **576px W × 360px H (canvas 634px)** widescreen cinematic footprint.
    - Verified through automated Puppeteer multi-viewport captures on both Mac (`:5173`) and Windows (`:5174`) across 100%, 125%, and 150% scales with 0px horizontal overflow (`scrollWidth === innerWidth`).
- **Windows LTSC Reduced-Motion Graph Restoration (16 Oct 2026):**
  - Resolved an issue where Windows LTSC machines with `prefers-reduced-motion` enabled completely hid the SVG graphs in the **Clarity** and **Parity** sections.
  - Replaced display suppression with clean static vector presentation (`strokeDashoffset: 0`), preserving all visual indicators and metrics.
  - Restored continuous ambient levitation to ghost stat numbers on Windows.
- **Mouse Wheel 1-Format Discrete Stepping in Routes (16 Oct 2026):**
  - Updated `useFormatScrollSection.ts` so discrete physical mouse wheel gestures (`absY >= 15 && absX === 0`, including Windows 125% DPI `deltaY = 96`) step exactly 1 format per gesture with a 460ms lock, while touchpad gestures retain natural smooth inertia.
  - Eliminated 5-second loader freeze on Windows Lite/CSS fallback by auto-dismissing after 400ms when Three.js `useProgress()` is inactive.
- **Device Screen Zoom Preview Modal in Routes (16 Oct 2026):**
  - Added `RoutesDeviceModal.tsx` allowing clicking/tapping on any device (Phone, Tablet, TV in both 3D WebGL and CSS chassis) to open an enlarged modal view with true aspect-ratio preservation (`9 / 19.5`, `3 / 4`, `16 / 9`), backdrop blur, and Esc/click-outside dismiss.
- **Mac 3D iPhone Screen Material Glass Fix (16 Oct 2026):**
  - Fixed `Phone3D.tsx` where `PaletteMaterial002` (the front cover glass over `17ProMax_Screen`) was rendered opaque gray on macOS Safari/Chrome instead of transparent protective glass (`opacity: 0.06, depthWrite: false`), restoring full visibility of phone screen textures.
- **Hero Stat Captions Red-Orange Light Theme Color (16 Oct 2026):**
  - Replaced harsh neon crimson `--logo-red` (`#ff003b`) with warm **красно-оранжевый** (`#e4450b`) from user palette for `.hero-stat-ghost__label` and `.hero-fly-label` in light theme, improving legibility across snow and rock mountains.
- **Zero-Division (`NaN%`) Stat Counter Fix on Windows (16 Oct 2026):**
  - Resolved `NaN%` appearing on Windows machines for `POST-FLIGHT LOG DRIFT` (`0%`).
  - Guarded against `0 / 0 = NaN` during Windows timer tick coalescing (`now === start`) when `duration = 0`.
  - Added immediate raw text return for `parsed.end === 0` and `duration <= 0`, plus fallback protections in `formatValue`.
- **Lenovo Trust Strip Dark Theme Contrast Enhancement (16 Oct 2026):**
  - Made the Lenovo partnership copy in dark theme pure crisp white (`#ffffff` at 0.95 opacity) via `.lenovo-copy-text` and `dark:text-white`, maximizing readability against the dark bottom dock.
- **Entry-Level Discrete GPU Classification to Lite Tier (16 Oct 2026):**
  - In `useHardwareTier.ts`, filtered out low-power entry mobile discrete GPUs (`geforce mx`, `mx110–mx450`, `gt 710–1030`, `920m–940m`) so office laptops (e.g. ASUS VivoBook i5-8250U + GeForce MX130) correctly receive `tier = "lite"`, ensuring fluid 60fps CSS device rendering.
- **3D iPhone Titanium Chassis Lighting & PBR Material Sculpting (16 Oct 2026):**
  - In `Phone3D.tsx`, added left, right, and bottom rim directional lights (`intensity: 2.2 / 1.4`) plus `hemisphereLight`, and adjusted chassis material to `metalness: 0.45`, `roughness: 0.34`, and `envMapIntensity: 1.6` for natural polished titanium reflections.
- **Native Ad Creative Safe Area & Status Bar Composition (16 Oct 2026):**
  - Recomposed `public/channels/programmatic-refs/screens/native.png` with authentic iOS status bar (`15:56`, wifi, battery), calculated safe area margins, and bottom Home Indicator bar, preventing Dynamic Island and rounded corner clipping.
- **Removal of Persistent Yellow Focus Frame on Modal Dismiss (16 Oct 2026):**
  - In `programmatic-scroll-section.css` and `RoutesDeviceModal.tsx`, removed active yellow focus-visible outline and added `activeElement.blur()` on modal close.
- **Footer Navigation Alignment to "Creative Studio" & Mobile "Craft" Prerogative (16 Oct 2026):**
  - Updated `footerLinks.explore` and `navLinks` in `liveContent.ts` from `"The Craft"` to **`"Creative Studio"`** (`/craft`), ensuring the footer renders `<a class="footer-link" href="/craft" data-discover="true">Creative Studio</a>` in alignment with the desktop header.
  - Updated page metadata in `pageMeta.ts` to `"Creative Studio | UPRAISER"`.
  - Preserved the compact **`"Craft"`** moniker on mobile phone header islands (`HeaderIsland.tsx`), maintaining crisp layout fit on 360–390px screens.
- **Infrastructure Telemetry Chart Vertical Alignment in "WHO WE SERVE" (16 Oct 2026):**
  - In `charts.css`, lifted `.fraud-linear-chart__content` on desktop (`@media (min-width: 1024px)`) with `transform: translate(clamp(-158px, -10vw, -24px), -44px)` and tightened `gap: 66px`.
  - The top telemetry bar (`SYS_ERR_01 BOTS & FARMS ELIMINATED`) now aligns directly with the lead copy (*"When Your MMP and media bills diverge, we rebuild Your data pipelines."*), and the bottom metric (`18.5% RECOVERED SPEND`) sits comfortably above the section boundary.
- **Cross-Platform WebGL, Memory & Runtime Performance Hardening (18 Oct 2026):**
  - Added `webglcontextlost` and `webglcontextrestored` recovery listeners and deterministic texture/video unmount disposal across `Phone3D.tsx`, `Tablet3D.tsx`, and `Tv3D.tsx`.
  - Replaced frame-dependent lerp in `tabletGlassAnim.ts` with exponential decay `1 - Math.exp(-speed * dt)`.
  - Gated offscreen `requestAnimationFrame` loops and `<video>` playback in `GlobalSnowfall.tsx`, `CreativeStudioVideo.tsx`, `HeroVideoFallback.tsx`, and `GradientTraceBorder.tsx` using `IntersectionObserver` and `document.visibilitychange`.
  - Split `ModeChart.tsx` into a pure async chunk by removing static `FoldChart` barrel import in `HomePage.tsx`, and gated 3D asset preloading in `scrollPreload.ts` to `getHardwareTier() === "full"`.
- **Windows DPI Scaling (125% / 150%) & Short Viewport Protection (18 Oct 2026):**
  - Updated `useViewportRoute.ts` and `index.css` so viewports shorter than `700px` (e.g., Windows 1080p at 150% DPI scaling) allow natural vertical scrolling on `/craft` and `/contact` instead of clipping content inside `100dvh`.
  - Removed `#audience.section-band::before` in `src/styles/hero.css`, eliminating the horizontal white/grey seam below "Our Clients".
- **2D Lite CSS Devices Chassis & Strict Flat 2D Rendering (18 Oct 2026):**
  - Removed `useCssDrag()` 3D perspective tilt from `src/components/solutions/CssPhone.tsx` so Lite-tier devices (`CssPhone`, `CssTablet`, `CssTv`) render strictly flat 2D.
  - Added `.prog-css-phone--orange` and metallic bezel/button rules in `src/styles/programmatic-scroll-section.css` so all 2D devices display a crisp physical frame in both Dark and Light modes.
  - Added Firefox masked-renderer fallback (`GTX 980 / R9 200` on `<= 8` cores -> `"lite"`) and `:5174` Lite-tier port check in `src/hooks/useHardwareTier.ts`.
- **Copywriting, Case Studies, Contact Form & 8-Locale i18n Synchronization (18 Oct 2026):**
  - Updated CaseStudies subtitle, Fanatics (`$15M+`, `30K FTDs`, `800K installs`, sub-second latency approach), Block Blast (`37%` D7 retention), Fiverr (`>1% of installs to FTB's`), Banco Azteca (`CPA`), Azar (`Sales & Video Chats participation`, `CPR`), PromiseSection closing guarantee, HomePilotCta (*"we map Your exact route to profit."*), and Contact form Company Type (`Ad Tech / Supply Partner`).
  - Synchronized all 8 locale files (`src/locales/{en,de,es,fr,ja,ko,pt,zh}.json`) and `src/locales/strings.json` with 0 missing keys.
- **Hero Flight Snow Warp Elimination, Ambient Flake Parity & Stale Chunk 404 Auto-Recovery (20 Oct 2026):**
  - **Hero Velocity Warp Fix (`HeroVideoFallback.tsx`):** Fixed acceleration explosion where paused video mid-flight squared un-clamped `(dur - cur) / 4.2`, triggering hypersonic laser/meteor particle streaks up to 30x speed on scroll. Pausing now enforces calm ambient drift (`forwardFlight = 0.05`), speed clamp `[0.05, 3.5]`, and smooth scroll fade-out past 380px (`Math.max(0, 1 - (window.scrollY - 380) / 240)`).
  - **Ambient Snowfall Particle Tuning (`GlobalSnowfall.tsx`):** Reduced particle radius to fine micro-crystals (`size = 0.6px–1.4px`, matching Hero scale) rendered in pure white `rgba(255, 255, 255, 0.96)` with a soft `0.4px` drop-shadow (`rgba(15, 23, 42, 0.22)`) for high-contrast visibility on white surfaces without grey tinting.
  - **Stale Chunk 404 Auto-Recovery & Static Footer (`SiteLayout.tsx`, `main.tsx`):** Replaced lazy dynamic `import("../components/Footer")` with a static import (2.8 kB), preventing scroll-triggered chunk 404s after new Vercel deployments. Added `vite:preloadError` and module script error listeners in `main.tsx` that trigger an automatic clean reload with a 10s cooldown to eliminate white screens for active users.
  - **Token Color Parity (`HomePilotCta.tsx`):** Aligned "Infrastructure story →" button border and hover tint to Header Active Gold `#F7C806` (`rgb(247, 200, 6)`) and restored primary "Request Pilot" button to official brand red `#ff003b` (`rgb(255, 0, 59)`).
  - **Contact Form Mobile Layout Polish (`Contact.tsx`):** Wrapped navigation pills into a single horizontal row (`overflow-x-auto no-scrollbar`, `flex-nowrap`, `min-h-[44px]`) to prevent single-item wrapping, and added `flex-1` spacer with bottom compliance anchoring (`mt-auto pt-6 border-t`) to eliminate empty void in card layout.
  - **Hero Interaction Guard & Legacy Asset Pruning (`Hero.tsx`, `public/hero/`):** Added user scroll/touch/wheel interaction guards to cancel the 2.5s cinematic programmatic scroll-down if the user manually navigates, and deleted 44 MB of legacy PNG frame sequences (`public/hero/frames/`, etc.).
  - **Hero Camera Flight Snow Restoration (`HeroVideoFallback.tsx`):** Restored 160-particle 3D camera-correlated flight snow with directional motion streaks during flight, mountain ridge crosswind, and zero-streak calm drift on pause (`forwardFlight = 0.05`). Removed the 380px premature cutoff so flight snow stays active across the full Hero scene.
  - **Promise Lead Trailing Period Removal (`PromiseSection.tsx`):** Removed trailing period dot span (`<motion.span className="inline">.</motion.span>`) after "We bring CLARITY" / "We guarantee PARITY".
  - **Asset Pruning & Video Compression (`public/`):** Deleted unmounted `macbook-draco.glb` (29 MB) and re-encoded hero idle loops (`home-dark-idle.mp4` 7.1 MB, `home-light-idle.mp4` 9.5 MB), reducing `public/` directory size to 73 MB.
- **Conference Hub, Global 20-Language Architecture, Telemetry Footprint & Revisit Signal (23 Oct 2026):**
  - **Conference Hub Mobile Terminal (`/connect` · `ConferenceHubPage.tsx`):** Engineered lightweight on-site conference networking page with 60 FPS CSS parallax starfield ascent, tactile vibration feedback (`navigator.vibrate(18)`), and hyperspace warp burst on reciprocal lead dispatch.
  - **20 Global Languages for AdTech Summits (`conferenceHubI18n.ts`):** Implemented native localization across 20 languages (`en, zh, hi, es, ar, fr, pt, ru, id, de, ja, fil, tr, vi, ko, th, it, pl, uk, he`), sorted strictly by global demographic speaker population without bias. All buttons, roles, slogans, and telemetry badges are 100% translated.
  - **Infinite Loading & iOS Timer Suspension Resolution:** Eliminated artificial delay promises that froze on iOS Safari when presenting the native Contacts sheet. Added immediate state transitions, a 2.8s safety watchdog timer, and `visibilitychange` / `focus` auto-recovery.
  - **Minimalist Telemetric Success State:** Streamlined success container into an uppercase monospace badge (`✓ COORDINATES RECEIVED` / `✓ КООРДИНАТЫ ПРИНЯТЫ`) matching input height (46px) with zero layout shift.
  - **Device Telemetry Footprint & Silent Revisit Beacon:** Submissions collect timestamp (local + IANA timezone + UTC), viewport and screen resolution with DPR and orientation, browser locale, and session state. Returning visitors automatically trigger a debounced revisit signal alert email to the desk.
  - **1-Screen Native Contact Sheet & Safari/Chrome iOS Fix (`Alex_Upraiser.vcf`):** Eliminated the `NOTE` block completely (saving 110px of vertical space) and migrated Telegram handle (`@homeboylebz`) into `ORG` (`Oleksii Ostroukhov · UPRAISER Agency LLP · TG @homeboylebz`), guaranteeing `Create New Contact` fits on screen 1 without scroll. Headline formatted strictly as **Alex Upraiser** (`N:Upraiser;Alex;;;`, `FN:Alex Upraiser`). Replaced `data:` URI navigation (which WebKit/Safari blocks by security policy) with verified static HTTP endpoint `/Alex_Upraiser.vcf?v=7` with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline`, natively opening the contact poster in Safari and Chrome iOS. Embedded JPEG photo with Apple RFC 2426 74-character line folding.

