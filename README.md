# UPRAISER — Marketing Site

Одностраничный лендинг **UPRAISER Agency LLP** — Premium Traffic Infrastructure для mobile/web user acquisition (iGaming, Fintech, premium media). London-based since **17 July 2017**.

| | |
|---|---|
| **Production** | https://upraiser-site.vercel.app |
| **Целевой домен** | https://upraiser.co.uk (DNS ещё не на Vercel) |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion · Lenis · Recharts · R3F / Three |
| **Copy** | `src/data/liveContent.ts` · кейсы: `src/data/cases.ts` |
| **Deploy** | `npm run deploy` → Vercel project **`upraiser-site-v2`** |
| **Handoff для ИИ** | **[AI_HANDOFF.md](./AI_HANDOFF.md)** |
| **Hero 3D / fly brief** | **[CONTEXT.md](./CONTEXT.md)** (актуальная архитектура героя) |

**Последний production deploy:** 25 Jul 2026 · 3D Everest hero (cream haze + scroll beams / night stars), glass header, yellow wire contrast.  
**Git backup:** branch `backup/2026-07-23-evening` (`3b46222`) · zip `~/Downloads/Upraiser-site-backup-2026-07-23-evening.zip`

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

**Env:** `VITE_WEB3FORMS_ACCESS_KEY` — contact form ([web3forms.com](https://web3forms.com)). `scripts/deploy-vercel.sh` синхронизирует ключ в Vercel env.

**Git author (важно для Vercel):** commit email должен совпадать с **verified email на GitHub** (`hmblps`):

```bash
git config --global user.email "alex@upraiser.co.uk"
git config --global user.name "hmblps"
```

**Правило:** commit и deploy — **только по явной просьбе** владельца проекта.

---

## Концепт (кратко)

**Позиционирование:** не «generic agency», а **traffic infrastructure** — DMP, fraud layer, OEM access, event-verified buying.

**Два scroll-момента (не добавлять третий):**

| Секция | Light (growth) | Dark (infrastructure) | Ambient |
|--------|----------------|----------------------|---------|
| `#audience` | SCALE | PROOF | Line chart / fraud radial |
| `#promise` | RESULTS | CLARITY | Area mass chart |

**Hero (desktop):** sticky Lenis runway + **React Three Fiber** Everest wireframe (`HeroTerrainCanvas`). Camera drone-ascent по `HeroFly` progress.

| Theme | Sky / FX |
|-------|----------|
| **Light** | Custom cream→gold haze dome (`BrandHazeSky`) + scroll-linked drei `SpotLight` beams (`ScrollBeams`) |
| **Dark** | Opaque night clear + camera-centered star dome (`NightStars`) |

Mobile / reduced motion: CSS sky only (no WebGL).

**Dual theme = dual narrative:** `light` → growth · `dark` → infrastructure (`useMode()`).

**Переключение темы:**

- **Хедер** (луна/солнце) — остаёшься на месте; секции crossfade через `ModeContentTransition`
- **ThemeBridge** внизу About — смена темы + скролл к hero

**Header:** frosted glass (`bg-bg/45` + blur при скролле).

---

## Структура (React Router)

```
/              Pitch + killer folds + ThemeBridge (dual-mode home)
/solutions     Value · Channels · Process
/technology    Stack + MMP (mode-agnostic)
/partners      Supply track (mode-agnostic)
/cases         Архив · /cases/:slug деталь
/about         London · ICO · tech preview → /technology
/contact       Request Pilot
```

Header: Solutions · Technology · Partners · Cases · About · theme · **Request Pilot**  
Partners strip — внизу перед Footer. **Блог не ведём.**

**Home order:** `hero → audience → difference → process → channels → cases → promise → pilot → mode-bridge`

---

## Scroll Scene System

Единая модель scrollytelling — `src/hooks/useScrollScene.ts` + `src/lib/scrollScene.ts`.

| Режим | Секции | Поведение |
|-------|--------|-----------|
| `runway` | Hero (`HeroFly`), Promise | sticky fold / camera progress |
| `anchor` | Audience, Difference | progress от входа в viewport / grid |
| `viewportBand` | Process | шаги по полосе viewport |
| in-view | Value, Channels, Cases, Contact | `Reveal` / `Stagger` |
| mode wait | mode-aware sections | `ModeContentTransition` при смене темы |

**Desktop ≥768px:** fold + charts + 3D hero.  
**Mobile / reduced motion:** CSS sky, static copy / Stagger. Hero stats — snap carousel + dots (только mobile).

---

## Бренд и copy

| Правило | Пример |
|---------|--------|
| UPRAISER | ALL CAPS в labels, nav, logo |
| You / Your / Yours | Capitalized **Y** в клиентском тексте |
| Section labels | gold (growth) / magenta (infrastructure) |
| Тон | Infrastructure, hard metrics, verified outcomes |

**Тема:** `localStorage` key `upraiser-theme` · anti-flash в `index.html`

**Favicon:** `/favicon.png` · **Logo:** `/upraiser-logo.png`

**OG/Twitter:** `og-image.png` — URL пока `upraiser-site.vercel.app/og-image.png` (обновить при переносе на `upraiser.co.uk`)

**Акценты:** `src/lib/accent.ts`

---

## Стили (CSS modules)

`src/index.css` импортирует модули из `src/styles/`:

| Файл | Содержание |
|------|------------|
| `base.css` | tokens, scroll-margin, card utilities, `--hero-stat-min-h` |
| `accent-scroll.css` | sticky fold layout |
| `scroll-scene.css` | runway sticky (fold only) |
| `hero.css` | CSS sky, terrain shell, sticky copy, stats |
| `charts.css` | fold charts, ghost bubbles |
| `components.css` | contact form, theme bridge, value bento, UI |
| `layout.css` | cases carousel, channels |
| `typography.css` | section titles, copy rhythm |
| `site-shell.css` | section bands, spacing |
| `surfaces.css` | cards, panels |
| `ambience-responsive.css` | breakpoints 1280–1440 |
| `depth-pages.css` | depth route layouts |

---

## Ключевые UX-паттерны

| Область | Поведение |
|---------|-----------|
| Scroll desktop | Lenis (`lerp: 0.14`) |
| Scroll mobile/touch | Native (`usePreferNativeScroll`) |
| Hero 3D | Desktop only; idle-mount canvas; opaque clear per theme |
| Fold charts | Desktop only; Recharts scroll-morph via `useScrollMorph` |
| Theme mid-scroll | Header stays; Bridge returns to hero; sections wait-crossfade |
| `#cases` carousel | Manual · seamless loop · drag + horizontal wheel |
| Custom cursor | Fine pointer · modes: default/link/cta/card |
| Reduced motion | No WebGL hero, static folds, no Lenis effects |

---

## Performance

- Hero 3D — lazy `HeroTerrainCanvas` + Draco GLB (`assets/hero/everest.glb`)
- `three` chunk is large (~255 KB gzip) — desktop-only gate
- `framer-motion`, `lenis`, `recharts` — manual chunks в `vite.config.ts`
- `CustomCursor` — deferred via `requestIdleCallback`
- No looping hero MP4 in the live canvas path (optional OG tooling may still read a mountains frame)

---

## Deploy (Vercel)

| | |
|---|---|
| **Vercel project** | `upraiser-site-v2` (alias → `upraiser-site.vercel.app`) |
| **Team** | `alex-3152s-projects` |
| **CLI** | `alex-3152` · email `alex@upraiser.co.uk` |
| **Repo** | `github.com/hmblps/upraiser-site` · branch `main` |

```bash
npm run deploy    # prebuilt local build → production
vercel alias ls   # проверить alias
```

**Типичные блокеры:**

- Git commit author ≠ verified GitHub email → **Blocked**
- CLI deploy с `homeboyleps@gmail.com` → team access error
- Git push не триггерит deploy, если Git не подключён к **upraiser-site-v2** в dashboard
- Missing `assets/brand/og-image.png` или `assets/hero/everest.glb` → build fails

**Fix:** `git config --global user.email "alex@upraiser.co.uk"` + push **или** `npm run deploy` (CLI prebuilt).

---

## SEO & legal

- `public/robots.txt`, `public/sitemap.xml`
- JSON-LD `Organization` в `index.html`
- Legal: `upraiser.co.uk/privacy` · `upraiser.co.uk/terms` · ICO **ZC000436**

---

## Assets

**Master:** `assets/` → `scripts/sync-assets.sh` → `public/` перед build. См. **[assets/README.md](./assets/README.md)**.

| `assets/` / `public/` | Deploy |
|-----------------------|--------|
| `hero/everest.glb` | Live 3D terrain |
| `brand/og-image.png` | OG card |
| `brand/favicon.png` | Favicon |
| `brand/upraiser-logo.png` | Logo |
| `maps/world-dots-*.svg` | Map dots |
| `public/cases/logos/*.png` | Case brand marks |
| `public/draco/gltf/*` | Draco WASM (in place) |

```bash
npm run optimize:everest   # optional GLB optimize
npm run generate:og
```

---

## Не делать (без явного запроса)

- Orbs / sweep glows в hero bridge
- Третий scroll-moment
- Commit / deploy без просьбы
- Автоскролл карусели кейсов
- React Router / IA split без утверждённой карты URL
- GSAP / ScrollTrigger (проект на Lenis + `useScrollScene` / `HeroFly`)
- Physically-based drei `<Sky>` в light theme (даёт грязный сине-серый + horizon seam) — только `BrandHazeSky`

---

## Остаётся на стороне клиента / бэклог

- Финальные **логотипы** partners (~5 SVG из 18)
- **Живой copy** вместо AI-текста
- Перенос **upraiser.co.uk** на Vercel + fix `og:image` URL
- Smoke test contact form → `info@upraiser.co.uk`
- Подключить Git → **upraiser-site-v2** для auto-deploy на push
- Подкрутка `ScrollBeams` intensity / volumetric opacity по вкусу

---

## Контакты

| | |
|---|---|
| Email | info@upraiser.co.uk |
| Address | 128 City Road, London EC1V 2NX, UK |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |
