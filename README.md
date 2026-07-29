# UPRAISER — Marketing Site

SPA **UPRAISER Agency LLP** — Premium Traffic Infrastructure для mobile/web user acquisition (iGaming, Fintech, premium media). London-based since **17 July 2017**.

| | |
|---|---|
| **Production** | https://upraiser-site.vercel.app |
| **Целевой домен** | https://upraiser.co.uk (DNS ещё не на Vercel) |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion · Lenis · Recharts · R3F / Three · ogl |
| **Copy** | `src/data/liveContent.ts` · кейсы: `src/data/cases.ts` |
| **Deploy** | `npm run deploy` → Vercel **`upraiser-site-v2`** |
| **Handoff для ИИ** | **[docs/HANDOFF.md](./docs/HANDOFF.md)** |
| **Solutions** | **[docs/SOLUTIONS.md](./docs/SOLUTIONS.md)** |
| **Hero 3D** | **[docs/HERO.md](./docs/HERO.md)** |
| **Assets** | **[docs/ASSETS.md](./docs/ASSETS.md)** |
| **Docs index** | **[docs/README.md](./docs/README.md)** |

**Последний production deploy:** 29 Jul 2026 · `e8ed2ef` — `/solutions` DPI/touch/transform harden; prior glass+MP4 `71ddab1`.  
**Checkpoint:** Solutions sticky phone `c0572d8` · hero light Everest `95bcd27`.  
**Git backups:** `backup/2026-07-23-evening` · zip `~/Downloads/Upraiser-site-backup-2026-07-23-evening.zip`

---

## Быстрый старт

```bash
npm install
cp .env.example .env          # VITE_WEB3FORMS_ACCESS_KEY
npm run generate:og           # если нет assets/brand/og-image.png
npm run dev                   # http://localhost:5173
npm run build                 # sync-assets + verify-assets + tsc + vite
npm run deploy                # local build → Vercel production
```

**Env:** `VITE_WEB3FORMS_ACCESS_KEY` — contact ([web3forms.com](https://web3forms.com)). Deploy script syncs key to Vercel.

**Git author (Vercel):** verified GitHub email for `hmblps`:

```bash
git config --global user.email "alex@upraiser.co.uk"
git config --global user.name "hmblps"
```

**Правило:** commit / deploy — **только по явной просьбе** владельца.

---

## Концепт (кратко)

**Позиционирование:** traffic infrastructure — DMP, fraud layer, OEM access, event-verified buying (не generic agency, не antifraud SaaS).

**Два scroll-момента (не добавлять третий):**

| Секция | Light (growth) | Dark (infrastructure) | Ambient |
|--------|----------------|----------------------|---------|
| `#audience` | SCALE | PROOF | Line chart / fraud radial |
| `#promise` | RESULTS | CLARITY | Area mass chart |

**Hero (desktop):** sticky Lenis runway + R3F Everest (`HeroTerrainCanvas` / `hero-terrain/*`).

| Theme | Terrain / FX |
|-------|----------------|
| **Light** | Photo `everest-light.glb` · white UI · `BrandHazeSky` · `ScrollBeams` · ice **`AscentHalo`** · soar **`AscentBird`** (silhouette) |
| **Dark** | Wire `everest.glb` · `NightStars` |

Mobile / reduced motion: CSS sky only (no WebGL).

**Dual theme = dual narrative:** `light` → growth · `dark` → infrastructure (`useMode()`).

**Тема:** header toggle — stay in place + `ModeContentTransition`; About/Company bridge may scroll home.

**Header:** frosted glass · Klay-style menu rail.

---

## Структура (React Router)

**Nav:** Solutions · Clarity · Studio · Cases · About (`/company`) · theme · **Request Pilot**

```
/              Pitch + killer folds (dual-mode home)
/solutions     Format lanes + sticky phone glass (App Growth / OEM & CTV)
/clarity       Measurement / reconcile story
/studio        Craft / studio surface
/clients       Client roster
/company       About / story / footprint (legacy /about → here)
/cases         Archive · /cases/:slug
/contact       Request Pilot
/privacy|/terms
```

**Legacy redirects (keep until SEO settled):**

| Old | New |
|-----|-----|
| `/expertise` | → `/solutions` |
| `/measurement`, `/technology` | → Clarity / Solutions helpers |
| `/partners` | → `/solutions?channel=oem#channels` |
| `/about`, `/how-we-work`, `/resources` | → `/company` |

**Home order:** `hero → audience → difference → process → channels → cases teaser → promise → pilot`  
(Theme bridge / company depth live on `/company`.)

**Блог не ведём.**

---

## Scroll Scene System

`src/hooks/useScrollScene.ts` + `src/lib/scrollScene.ts` (+ `HeroFly` for hero).

| Режим | Секции | Поведение |
|-------|--------|-----------|
| `runway` | Hero (`HeroFly`), Promise | sticky fold / camera progress |
| `anchor` | Audience, Difference | viewport / grid progress |
| `viewportBand` | Process | steps vs viewport bands |
| in-view | Channels, Cases, Contact… | `Reveal` / `Stagger` |

**Desktop ≥768px:** folds + charts + 3D hero.  
**Mobile:** CSS sky, Stagger / static. Hero stats — snap + dots on mobile when shown.

**Solutions:** native sticky scroll (`FORMAT_HEIGHT` virtual runway) — see **[docs/SOLUTIONS.md](./docs/SOLUTIONS.md)**.

---

## Бренд и copy

| Правило | Пример |
|---------|--------|
| UPRAISER | ALL CAPS в labels, nav, logo |
| You / Your / Yours | Capital **Y** |
| Section labels | gold (growth) / magenta (infrastructure) |
| Тон | Infrastructure, hard metrics, verified outcomes |

**Тема:** `localStorage` `upraiser-theme` · anti-flash в `index.html`  
**Light paper:** `#ffffff` (не cream). **Dark:** `#050504`.  
**Favicon / logo:** `/favicon.png` · `/upraiser-logo.png`  
**OG:** `og-image.png` (URL пока vercel.app)  
**Акценты:** `src/lib/accent.ts`

---

## Стили

`src/index.css` → `@import` из `src/styles/`:

| Файл | Содержание |
|------|------------|
| `base.css` | tokens, scroll-margin, card utils |
| `accent-scroll.css` | sticky fold |
| `scroll-scene.css` | runway sticky |
| `hero.css` | CSS sky, terrain shell, sticky copy |
| `charts.css` | fold charts |
| `components.css` | forms, bridge, UI |
| `layout.css` | cases, channels |
| `typography.css` | titles, rhythm |
| `site-shell.css` | bands, spacing |
| `surfaces.css` | cards, panels |
| `ambience-responsive.css` | 1280–1440 |
| `depth-pages.css` | depth routes |
| `programmatic-scroll-section.css` | Solutions sticky / phone |
| `programmatic-full-feed.css` | In-phone HTML feed |
| `phone-css-3d.css` | GLB phone stage |

---

## Performance

- Hero 3D — lazy canvas + Draco (`everest.glb` / `everest-light.glb` ~1MB / ~11MB)
- Solutions Phone3D — lazy + IntersectionObserver; still→MP4 without Suspense remount
- `three` chunk large — desktop-only gate
- Manual chunks: `framer-motion`, `lenis`, `recharts`, `three` (`vite.config.ts`)
- No looping hero MP4 in live path

---

## Deploy (Vercel)

| | |
|---|---|
| **Project** | `upraiser-site-v2` → `upraiser-site.vercel.app` |
| **Team** | `alex-3152s-projects` |
| **Repo** | `github.com/hmblps/upraiser-site` · `main` |

```bash
npm run deploy
vercel alias ls
```

**Блокеры:** author email ≠ verified GitHub · missing `og-image` / Everest GLBs · **stripped `package.json` deps** (three/r3f/router must stay — Vercel `npm install` uses the lockfile).

---

## Assets

Master: `assets/` → sync → `public/`. Solutions phones + format media live under `public/` (see **[docs/ASSETS.md](./docs/ASSETS.md)**).

```bash
npm run optimize:everest
npm run optimize:everest-light
npm run generate:og
```

---

## Не делать (без явного запроса)

- Orbs / sweep glows в hero  
- Третий scroll-moment  
- Commit / deploy без просьбы  
- Автоскролл карусели кейсов  
- GSAP / ScrollTrigger  
- Physically-based drei `<Sky>` в light  
- Animated bird GLB вместо силуэта  
- Резать runtime deps из `package.json`  
- Suspense remount Still↔Video на стекле телефона (эпилепсия / flash)

---

## Рефактор (следующий этап) — кратко

Детали: **[docs/HANDOFF.md](./docs/HANDOFF.md)** §14 + §20–21.

Theme/terrain swap и UI polish folds — shipped. Дальше: мёртвые pages/assets · Git auto-deploy · live copy · DNS.  
**Docs:** hub в `docs/` (+ `SOLUTIONS.md`) — актуально на 29 Jul 2026.

---

## Остаётся на клиенте / бэклог

- Финальные логотипы partners  
- Живой copy вместо AI-черновика  
- DNS `upraiser.co.uk` + fix `og:image`  
- Smoke test contact → `info@upraiser.co.uk`  
- Git → **upraiser-site-v2** auto-deploy  

---

## Контакты

| | |
|---|---|
| Email | info@upraiser.co.uk |
| Address | 128 City Road, London EC1V 2NX, UK |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |
