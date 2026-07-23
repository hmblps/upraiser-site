# UPRAISER — Marketing Site

Одностраничный лендинг **UPRAISER Agency LLP** — Premium Traffic Infrastructure для mobile/web user acquisition (iGaming, Fintech, premium media). London-based since **17 July 2017**.

| | |
|---|---|
| **Production** | https://upraiser-site.vercel.app |
| **Целевой домен** | https://upraiser.co.uk (DNS ещё не на Vercel) |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion · Lenis · Recharts |
| **Copy** | `src/data/liveContent.ts` · кейсы: `src/data/cases.ts` |
| **Deploy** | `npm run deploy` → Vercel project **`upraiser-site-v2`** |
| **Handoff для ИИ** | **[AI_HANDOFF.md](./AI_HANDOFF.md)** |
| **Hero scroll-scrub brief** | **[CONTEXT.md](./CONTEXT.md)** (план, ещё не в коде) |

**Последний production deploy:** 23 Jul 2026 · mode transitions, hero polish, case logos.  
**Git backup:** branch `backup/2026-07-23` · zip `~/Downloads/Upraiser-site-backup-2026-07-23.zip`

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

**Hero:** cursor-lit mountains video (single decode + CSS mask). Theme overlay crossfade ~400ms. Мягкий spotlight в dark theme, без orbs.

**Dual theme = dual narrative:** `light` → growth · `dark` → infrastructure (`useMode()`).

**Переключение темы:**

- **Хедер** (луна/солнце) — остаёшься на месте; секции crossfade через `ModeContentTransition`
- **ThemeBridge** внизу About — смена темы + скролл к hero

---

## Структура страницы (App.tsx)

```
SiteGrain · CustomCursor (deferred) · Header (fixed)
main:
  #hero              Hero + HeroAtmosphere
  (strip)            LenovoTrustStrip
  #audience          AccentScrollFold + ambient chart
  #difference        Why Us — header + 3 cards (anchor spawn desktop)
  #process           4-step rail (scroll band)
  #value             ValueProps bento + animated glyphs
  #channels          Traffic channels (tabs)
  #cases             Case studies carousel / mobile accordion
  #promise           AccentScrollFold + ambient area chart
  #about             About + technology panel + ThemeBridge
  #contact           Web3Forms + Lenovo strip
PartnersCarousel     Logo marquee
Footer
MobileSectionNav · SectionNav (↑↓)
```

**Nav order** (`scrollSections.ts`):  
`hero → audience → difference → process → value → channels → cases → promise → about → contact`

Секции ниже hero — **lazy-loaded** (`React.lazy` + idle preload).

---

## Product direction (23 Jul 2026)

Длинный single-page scroll обсуждался как тяжёлый для конверсии. **Согласовано направление** (ещё не реализовано):

- **Главная** = короткий pitch (Hero → proof → CTA)
- **Внутренние страницы** = depth (cases, channels, process, about)

Сжатие главной обнажит контентные дыры (сегмент, оффер, trust) — закрывать мостами, не возвращая runway-аттракционы. Подробности: `AI_HANDOFF.md` §15.

---

## Scroll Scene System

Единая модель scrollytelling — `src/hooks/useScrollScene.ts` + `src/lib/scrollScene.ts`.

| Режим | Секции | Поведение |
|-------|--------|-----------|
| `runway` | Audience, Promise | sticky fold, 135vh desktop, progress 0→1 |
| `anchor` | Difference (Why Us) | карточки spawn от grid ref, без лишней высоты |
| `viewportBand` | Process | шаги по полосе viewport |
| in-view | Value, Channels, Cases, Contact | `Reveal` / `Stagger` |
| mode wait | mode-aware sections | `ModeContentTransition` при смене темы |

**Desktop ≥768px:** fold + charts + anchor spawn.  
**Mobile / reduced motion:** static copy или Stagger in-view. Hero stats — snap carousel + dots (только mobile).

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
| `hero.css` | mountains video, cursor spotlight, stats dots |
| `charts.css` | fold charts, ghost bubbles |
| `components.css` | contact form, theme bridge, value bento, UI |
| `layout.css` | cases carousel, channels |
| `typography.css` | section titles, copy rhythm |
| `site-shell.css` | section bands, spacing |
| `surfaces.css` | cards, panels |
| `ambience-responsive.css` | breakpoints 1280–1440 |

---

## Ключевые UX-паттерны

| Область | Поведение |
|---------|-----------|
| Scroll desktop | Lenis (`lerp: 0.14`) |
| Scroll mobile/touch | Native (`usePreferNativeScroll`) |
| Fold charts | Desktop only; Recharts scroll-morph via `useScrollMorph` |
| Theme mid-scroll | Header stays; Bridge returns to hero; sections wait-crossfade |
| `#cases` carousel | Manual · seamless loop · drag + horizontal wheel |
| Custom cursor | Fine pointer · modes: default/link/cta/card |
| Reduced motion | Static folds, no Lenis effects, no cursor light |

---

## Performance

- Hero entrance — **CSS** (main bundle ~72 KB gzip)
- `framer-motion`, `lenis`, `recharts` — manual chunks в `vite.config.ts`
- `CustomCursor` — deferred via `requestIdleCallback`
- Hero video ~7 MB 1080p — **без re-encode** (owner rejected quality loss)
- Atmosphere — один video; theme меняет overlays

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
- Missing `assets/brand/og-image.png` → build fails (`npm run generate:og`)

**Fix:** `git config --global user.email "alex@upraiser.co.uk"` + push **или** `npm run deploy` (CLI prebuilt).

---

## SEO & legal

- `public/robots.txt`, `public/sitemap.xml`
- JSON-LD `Organization` в `index.html`
- Legal: `upraiser.co.uk/privacy` · `upraiser.co.uk/terms` · ICO **ZC000436**

---

## Assets

**Master:** `assets/` → `scripts/sync-assets.sh` → `public/` перед build.

| `assets/` / `public/` | Deploy |
|-----------------------|--------|
| `hero/light-mountains-loop.mp4` | ~7 MB hero video |
| `brand/og-image.png` | OG card |
| `brand/favicon.png` | Favicon |
| `brand/upraiser-logo.png` | Logo |
| `public/cases/logos/*.png` | Case brand marks |

```bash
bash scripts/restore-hero-from-prod.sh
npm run generate:og
```

---

## Не делать (без явного запроса)

- Orbs / sweep glows в hero bridge
- Третий scroll-moment
- Hero video re-encode без visual QA
- Commit / deploy без просьбы
- Автоскролл карусели кейсов
- React Router / IA split без утверждённой карты URL
- GSAP / ScrollTrigger (проект на Lenis + `useScrollScene`)

---

## Остаётся на стороне клиента / бэклог

- Финальные **логотипы** partners (~5 SVG из 18)
- **Живой copy** вместо AI-текста
- Перенос **upraiser.co.uk** на Vercel + fix `og:image` URL
- Smoke test contact form → `info@upraiser.co.uk`
- Подключить Git → **upraiser-site-v2** для auto-deploy на push
- **IA split** (короткая главная + depth pages) — согласовано направление
- **Hero ascent scroll-scrub** — brief в `CONTEXT.md`, нужен финальный MP4

---

## Контакты

| | |
|---|---|
| Email | info@upraiser.co.uk |
| Address | 128 City Road, London EC1V 2NX, UK |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |
