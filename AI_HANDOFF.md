# UPRAISER Site — AI Handoff Document

> **Назначение:** полный контекст проекта для других ИИ-ассистентов.  
> Шарить вместе с репозиторием. Краткая версия — в [README.md](./README.md).

**Последнее обновление:** July 2026  
**Production:** https://upraiser-site.vercel.app  
**Repo path:** `Upraiser New Website Cursor Project`

---

## 1. Кто такие UPRAISER

**UPRAISER Agency LLP** — UK-based **premium traffic infrastructure** / mobile & web user acquisition agency.

**Вертикали:** iGaming, Fintech, premium media  
**УТП:** не «impressions agency», а **verified outcomes** — CPI/CPA/CPL tied to deposits, registrations, subscriptions; proprietary DMP; zero-tolerance fraud; **official Lenovo agency partner** (OEM pre-installs).

**Юридическое лицо:**
- UPRAISER Agency LLP
- 128 City Road, London EC1V 2NX, United Kingdom
- info@upraiser.co.uk
- ICO registration: **ZC000436** (в `public/privacy/index.html`)
- LinkedIn: https://www.linkedin.com/company/upraiser/

**Целевой production domain:** `upraiser.co.uk` (сейчас сайт на Vercel preview URL; Apache на .co.uk не отдаёт SPA).

---

## 2. Продукт: что это за сайт

**Тип:** одностраничный marketing landing (SPA), anchor navigation  
**Язык UI:** English  
**Цель:** B2B lead gen для brands / app owners / publishers — contact form + credibility (cases, tech, Lenovo partnership)

**Не является:**
- Многостраничным CMS
- Блогом / careers portal (Careers = mailto stub)
- Dashboard / client portal

---

## 3. Концепт и позиционирование

### 3.1 Narrative arc (путь пользователя по странице)

1. **Hero** — эмоциональный hook: «Charting the Ascent», mountains + cursor light → премиум, рост
2. **GROWTH** (`#audience`) — первый scroll-момент: space for Your growth
3. **Value props** — fraud / LTV / OEM — почему infrastructure, не agency slides
4. **OUTCOMES** (`#promise`) — второй scroll-момент: verified outcomes, не vanity metrics
5. **4 Ts** (`#difference`) — Tech, Team, Tactics, Transparency
6. **Objectives** — что инфраструктура доставляет
7. **Traffic channels** — 8 каналов, omnichannel story
8. **Testimonials** — social proof (анонимные пока)
9. **Case studies** — hard metrics, sparklines, storytelling cards
10. **Technology** — DMP, fraud shield, attribution
11. **About + Process** — trust + how we work
12. **Contact** — UPRAISED CTA + Web3Forms
13. **Partners marquee** — ecosystem credibility

### 3.2 Референсы (структура, не копипаст контента)

| Источник | Что взяли |
|----------|-----------|
| [Z2A Digital](https://www.z2adigital.com/) | Promise block, 4 pillars, technology, case studies placement, partners strip |
| [Hike](https://gohike.com.br/) | Value props framing, objectives, traffic channel tabs, 4-step process |
| UPRAISER media kit PDF | Visual: low-poly mountains, diagonal light beam, gold `#FFD740` + magenta `#E91E63`, «rise to the top» |

### 3.3 Визуальная метафора

- **Mountains** = путь наверх, ascent
- **Cursor light** = интерактивный «прожектор» на hero video — пользователь буквально «освещает» rise
- **Gold** = primary brand accent (orange token `--theme-accent`)
- **Magenta/red** = secondary accent (`--theme-accent-secondary`) — точечно, не в wordmark
- **Grain overlay** (`SiteGrain`) — тактильность, не sterile corporate
- **Card lift** — subtle hover elevation на интерактивных карточках

### 3.4 Тон copy

- **Infrastructure language:** DMP, ROM-level, verified buys, event economics
- **Hard numbers:** 97.3% bots filtered, 100+ territories, 0% fraud on verified buys
- **Client-centric You:** всегда `Your` с capital Y (бренд-правило)
- **Avoid:** generic «we're passionate», vague «full-service agency»

---

## 4. Бренд-правила (строго)

| Элемент | Правило |
|---------|---------|
| Название | **UPRAISER** — ALL CAPS в nav, labels, logo text |
| Client pronoun | **You / Your / Yours** — capital Y |
| Section labels | `section-label` (gold) или `section-label-red` |
| Card titles | `text-orange` (gold) по умолчанию |
| `#technology` titles | все gold (без red alternate) |
| `#difference` bento | gold/red чередование через `toneAt()` |
| Contact title | «Are You Ready to Be **Upraised**?» — accent word red |
| Header/footer logo | **не** красить UPRAISER в red — только inline accents |
| Primary CTA | `bg-orange` filled pill |
| Secondary CTA | `.btn-secondary` — border + blur |

**Accent system:** `src/lib/accent.ts` — helpers `accentTitle`, `accentLink`, `accentSectionLabel`, `toneAt`, etc.

---

## 5. Тема light / dark

- Toggle в header (`ThemeToggle`)
- Persistence: `localStorage` key **`upraiser-theme`**
- Anti-flash: inline script в `index.html` до CSS
- CSS variables в `src/index.css` под `[data-theme="light"]` / `[data-theme="dark"]`
- `theme-color` meta sync в `ThemeContext`
- Legal pages: `public/legal/theme-init.js` — тот же key

---

## 6. Полная карта секций

| ID | Компонент | Файл | Описание |
|----|-----------|------|----------|
| `hero` | Hero + HeroAtmosphere + LenovoTrustStrip | `Hero.tsx`, `HeroAtmosphere.tsx`, `LenovoTrustStrip.tsx` | Full viewport hero, stats grid, video atmosphere |
| `audience` | GrowthScrollBlock | `GrowthScrollBlock.tsx` | Scroll-driven **GROWTH** typography (120vh lite) |
| `value` | ValueProps | `ValueProps.tsx` | 3 cards: Fraud, LTV, OEM |
| `promise` | PromiseScrollBlock | `PromiseScrollBlock.tsx` | Scroll-driven **OUTCOMES** (120vh lite) |
| `difference` | Difference | `Difference.tsx` | Asymmetric bento — 4 Ts |
| `objectives` | Objectives | `Objectives.tsx` | 4 objective cards |
| `channels` | TrafficChannels | `TrafficChannels.tsx` | 8 channel pills + animated detail panel |
| `testimonials` | Testimonials | `Testimonials.tsx` | 3 quotes; horizontal snap on mobile |
| `cases` | CaseStudies | `CaseStudies.tsx` | Infinite manual carousel, 4 cases |
| `technology` | Technology | `Technology.tsx` | 3 cards + `ProximitySurface` glow |
| `about` | About | `About.tsx` | Company story + 4 highlights |
| `process` | Process | `Process.tsx` | 4 steps |
| `contact` | Contact | `Contact.tsx` | Web3Forms + privacy checkbox |
| — | PartnersCarousel | `PartnersCarousel.tsx` | Below main, above footer |
| — | Footer | `Footer.tsx` | Links, legal, address |

**Keyboard nav:** `SectionNav` — ↑/↓ jumps between `scrollSectionIds` (`src/data/scrollSections.ts`)  
**Mobile nav:** `MobileSectionNav` — sticky horizontal pills after scroll

---

## 7. Hero atmosphere (критично — много итераций)

### Текущее production-состояние

- **Один video:** `assets/hero/light-mountains-loop.mp4` → `public/hero/` (~7 MB, 1080p)
- **Обе темы** используют этот же clip (light mountains)
- **Два слоя video:**
  - **base** — dimmed
  - **lit** — bright, видимый только в CSS mask около курсора
- **Без orbs**, без SVG polygon terrain overlay (отвергнуто пользователем)
- **Mobile / coarse pointer** (`useHeroMobileLite`): один слой, без lit, pause offscreen
- **Reduced motion:** pause video, no cursor-lit rAF

### Файлы

- `src/components/HeroAtmosphere.tsx`
- `src/hooks/useHeroCursorLight.ts`
- `src/hooks/useHeroMobileLite.ts`
- CSS: `.hero-mountains-lit`, `.hero-cursor-light-active`, etc. in `index.css`

### Hero → Audience bridge

- Только нейтральные `--theme-bg` градиенты (`.hero-bottom-fade-bridge`, `#audience::before`)
- **ЗАПРЕЩЕНО:** gold radial gradients в bridge — даёт жёлтые полосы

### Hero entrance animation

- **CSS-only** (`hero-entrance-*` classes in `index.css`) — **не** framer-motion
- Причина: perf — framer-motion вынесен из critical path

### Lenovo trust strip

- Absolute bottom of hero viewport
- Scroll-reveal: slides up after `scrollY > 88px`
- Lazy-loaded chunk
- Uses framer-motion for slide animation

---

## 8. Scroll-акценты (ровно два)

| Section | Hero word | Mechanism |
|---------|-----------|-----------|
| `#audience` | **GROWTH** | `useScroll` + `useSpring(120, 30)` + sticky stage |
| `#promise` | **OUTCOMES** | Same lite pattern |

Classes: `.accent-scroll-section--lite`, `.accent-scroll-sticky`, `.accent-scroll-float`

**Contact** uses typographic **UPRAISED** only — no scroll animation.

**Правило:** не добавлять третий scroll-moment (Upraised / Scale / Verified) без явного запроса.

---

## 9. Case Studies carousel (`#cases`)

### Поведение (финальная версия после итераций)

- **Только manual scroll** — нет autoplay
- **Seamless infinite loop** при ручном скролле
- **2 DOM copies** технически (`CASE_CAROUSEL_COPIES = 2`):
  - Copy 0 — видимая лента, доступна для a11y
  - Copy 1 — `aria-hidden`, для бесшовного wrap без видимого «рывка»
  - На экране пользователь видит **4 уникальных кейса**, не «8 карточек»
- Wrap logic: `useInfiniteCaseCarousel.ts` — when `scrollLeft >= setWidth`, subtract `setWidth`
- **Drag** (mouse): `useHorizontalPointerScroll.ts`
- **Wheel:** только horizontal delta (`deltaX > deltaY`); vertical всегда идёт в Lenis (page scroll)
- **Touch:** native `pan-x pan-y`, `data-lenis-prevent-touch` on carousel
- **Dots + arrows:** navigate within 4 real cases (`data-case-copy="0"`)

### Карточка кейса

- Category badge, client name, headline
- Letter avatar (placeholder until client logos)
- Channel tags
- `CaseSparkline` — SVG draw-on-scroll + hero metric
- `CaseResultStat` — count-up on intersect
- Challenge / Approach / Outcome sections

### Данные

`src/data/cases.ts` — 4 cases: Fanatics, Snoop, Vantage, Wall Street Journal  
Metrics from original media kit, copy rewritten for UPRAISER voice.

**Pending (client):** redesigned cards, real client logos, non-AI copy refresh.

---

## 10. Другие интерактивные паттерны

### Smooth scroll (Lenis)

- `src/components/SmoothScroll.tsx`
- Desktop only; `usePreferNativeScroll` for touch/coarse
- Config: `duration: 1.05`, `lerp: 0.085`, `allowNestedScroll: true`
- `ScrollContext` — `scrollTo`, `jumpToSection`, `registerScrollListener`

### Custom cursor

- `CustomCursor.tsx` — lazy + deferred ~900ms
- Fine pointer only; body class `custom-cursor-active`
- Modes: default, link, cta, card (`.card-lift`)
- Lag: dot/ring `0.18` lerp

### Proximity glow (`#technology`)

- `ProximitySurface.tsx` + `useProximityGlow.ts`
- Radial glow follows pointer inside card

### Partners marquee

- `PartnersCarousel.tsx` — duplicate array, CSS `partners-marquee` 45s linear infinite
- Pause on hover
- Logos monochrome, brighten on hover
- Data: `src/data/partners.ts` — **18 partners listed, only ~5 SVG exist** in `public/partners/`

### Traffic channels

- Tab pills + `AnimatePresence` detail panel
- Horizontal scroll pills on narrow screens

### Contact form

- Web3Forms API (`VITE_WEB3FORMS_ACCESS_KEY`)
- Fields: name, email, company, vertical select, message
- Required privacy checkbox → `/privacy`
- Deploy script syncs key to Vercel env

---

## 11. Performance architecture

### Code splitting (`App.tsx`)

**Eager (critical path):**
- Hero, Header, SmoothScroll, SiteGrain, SectionNav

**Lazy + Suspense:**
- All sections from Audience downward
- PartnersCarousel, Footer, MobileSectionNav
- CustomCursor (idle), LenovoTrustStrip, ApplePreviewPanel

**Idle preload:** `usePreloadBelowFold` — `requestIdleCallback` ~2.5s imports all lazy chunks

### Vite chunks (`vite.config.ts`)

- `framer-motion` — separate chunk (~47 KB gzip)
- `lenis` — separate chunk (~5 KB gzip)
- Main `index` bundle ~69 KB gzip (was ~132 KB before perf pass)

### Fonts

- Self-hosted Inter woff2 in `public/fonts/`
- Preload `inter-latin-400.woff2` in `index.html`

### Not optimized (intentionally)

- Hero video ~7 MB — re-encode was tried and **reverted** by user (needs visual QA before retry)

---

## 12. SEO & meta

| Asset | Location |
|-------|----------|
| `robots.txt` | `public/robots.txt` |
| `sitemap.xml` | `public/sitemap.xml` — `/`, `/privacy`, `/terms` |
| JSON-LD Organization | `index.html` |
| OG image | `assets/brand/og-image.png` (1024×537, hand-crafted) |
| OG image URL | **Temporary:** `upraiser-site.vercel.app/og-image.png` — switch to `upraiser.co.uk` after domain cutover |
| `og:url` | Already `upraiser.co.uk` |
| Favicon | `/favicon.png` |
| Title | `UPRAISER` |
| OG title | `UPRAISER charting the ascent` |

**Generate OG fallback from hero:** `npm run generate:og` (script exists; hand-crafted PNG is canonical)

---

## 13. Legal pages

Static HTML (not React):

- `public/privacy/index.html` — Privacy Policy, ICO ZC000436
- `public/terms/index.html` — Terms & Conditions
- `public/legal/legal.css` + `theme-init.js`
- Canonical URLs point to `upraiser.co.uk`
- No cookie banner (no analytics cookies — stated in privacy policy)

---

## 14. Assets pipeline

```
assets/                    ← master copies (source of truth)
  hero/light-mountains-loop.mp4
  brand/og-image.png
  brand/favicon.png
  brand/upraiser-logo.png

scripts/sync-assets.sh     ← copies assets/ → public/ before build
scripts/verify-assets.sh   ← fails build if required files missing
scripts/restore-hero-from-prod.sh
scripts/deploy-vercel.sh   ← vercel deploy --prod + Web3Forms env sync
```

**Only in public/ (not synced from assets):** fonts, partner SVGs, legal HTML, robots, sitemap

---

## 15. Data layer

| File | Contents |
|------|----------|
| `src/data/content.ts` | Nav, sections copy, value props, channels, testimonials, footer, highlights, audience/promise copy |
| `src/data/cases.ts` | 4 case studies with metrics, trends, heroMetric |
| `src/data/partners.ts` | Integration partner logos config |
| `src/data/scrollSections.ts` | Ordered section IDs for keyboard nav |

**All marketing copy changes should go through these files** — not hardcoded in components.

---

## 16. История ключевых решений (decision log)

| Decision | Why |
|----------|-----|
| React + Vite, not Next.js | Simple static SPA deploy on Vercel |
| Lenis desktop only | Mobile scroll sync issues; native feels better on touch |
| Cursor-lit hero video | Media kit mountains + interactivity; rejected SVG/orbs alternatives |
| Two scroll moments only | Avoid scroll fatigue; GROWTH + OUTCOMES are brand words |
| Cases as horizontal cards | User rejected MVP Agency PDF screenshot copy; own card design |
| Cases infinite loop via hidden clone | Seamless wrap without visible duplicate cards on screen |
| No vertical wheel hijack on carousel | Was blocking page scroll down; snap made carousel appear stuck |
| Lazy sections + CSS hero entrance | ~50% main bundle reduction |
| OG image hand-crafted | Generated from hero was fallback; user provided final PNG |
| Hero video re-encode reverted | User wanted original 7 MB quality back |
| Careers = mailto | No `#careers` section yet |
| Testimonials anonymous | Awaiting real quotes + permissions |
| Commit only on request | User preference |

---

## 17. Git rollback tags

| Tag | State |
|-----|-------|
| `pre-perf-opt` | Before perf (fonts, Lenis mobile, CSS trim) |
| `pre-polish-opt` | Before OG meta, focus-visible, footer polish |
| `pre-interaction-opt` | Before bento #difference, proximity #technology, cases storytelling |

Scripts: `scripts/rollback-*.sh`

---

## 18. Что НЕ сделано / pending

### Блокеры launch

- [ ] DNS `upraiser.co.uk` → Vercel
- [ ] Update `og:image` / `twitter:image` to production domain
- [ ] Contact form smoke test on production
- [ ] Cross-device QA (Safari, iPhone)

### Контент (владелец)

- [ ] Partner logo SVGs (13+ missing)
- [ ] Case study card redesign + client logos
- [ ] Replace AI/generic copy (especially testimonials)
- [ ] Optional `#careers` section vs remove nav item
- [ ] Dedicated favicon design (currently same 192px asset as logo)

### Техническое (опционально)

- [ ] Hero video optimization with visual QA
- [ ] Analytics + cookie banner (when needed)
- [ ] Git commit of current production state
- [ ] Careers page / structured JobPosting schema

---

## 19. Инструкции для других ИИ

### Перед любыми изменениями

1. Прочитай этот файл и `README.md`
2. Проверь `src/data/content.ts` и `src/data/cases.ts` — copy lives there
3. **Не коммить и не деплоить** без явной просьбы пользователя
4. Минимальный diff — не рефакторить unrelated code

### Безопасные зоны редактирования

- Copy: `src/data/content.ts`, `src/data/cases.ts`
- Styling: `src/index.css`, Tailwind classes in components
- New section content: add component + wire in `App.tsx` lazy imports

### Опасные зоны (трогать только с пониманием)

- `HeroAtmosphere.tsx` + cursor light hooks — много edge cases
- `useInfiniteCaseCarousel.ts` + `useHorizontalPointerScroll.ts` — scroll conflicts с Lenis
- `SmoothScroll.tsx` — affects entire page feel
- `accent-scroll-*` blocks — precisely tuned scroll math
- `assets/` → `public/` sync pipeline

### Тестирование после изменений

```bash
npm run build          # must pass verify-assets
npm run dev            # manual scroll QA at #cases, hero cursor, theme toggle
```

Deploy only when user says «деплой» / «deploy».

### Типичные запросы пользователя

| Запрос | Где смотреть |
|--------|--------------|
| Поменять текст секции | `src/data/content.ts` → `sections.*` |
| Добавить кейс | `src/data/cases.ts` |
| Поменять скорость carousel | `useInfiniteCaseCarousel.ts` (no autoplay currently) |
| Поменять hero video | `assets/hero/` + `sync-assets.sh` |
| OG image | `assets/brand/og-image.png` + `index.html` meta |
| Privacy/legal | `public/privacy/`, `public/terms/` |
| Партнёры в карусели | `src/data/partners.ts` + SVG in `public/partners/` |

---

## 20. File map (complete)

```
index.html                 Meta, OG, JSON-LD, theme anti-flash
vite.config.ts             manualChunks: framer-motion, lenis

src/
  App.tsx                  Lazy sections, preload, layout
  main.tsx                 React mount + ThemeProvider
  index.css                All theme tokens, hero, scroll, grain, carousel
  data/
    content.ts             Marketing copy
    cases.ts               Case studies
    partners.ts            Partner logos
    scrollSections.ts      Keyboard nav order
  lib/
    accent.ts              Gold/red accent helpers
    motion.ts              Framer motion variants
  context/
    ThemeContext.tsx       Light/dark
    ScrollContext.tsx      Lenis scroll API
  hooks/
    useInfiniteCaseCarousel.ts   Cases seamless loop
    useHorizontalPointerScroll.ts Cases drag + horizontal wheel
    useHeroCursorLight.ts        Hero cursor mask
    useHeroMobileLite.ts         Mobile hero degradation
    useProximityGlow.ts          Technology cards
    usePreferNativeScroll.ts     Skip Lenis on touch
    useReducedMotion.ts          a11y
    useCountUp.ts                Animated numbers
    ...
  components/
    Hero.tsx                 CSS entrance, stats, CTAs
    HeroAtmosphere.tsx       Video layers
    GrowthScrollBlock.tsx    GROWTH scroll
    PromiseScrollBlock.tsx   OUTCOMES scroll
    CaseStudies.tsx          Cases carousel UI
    CaseSparkline.tsx        SVG sparkline
    Contact.tsx              Web3Forms
    PartnersCarousel.tsx     Logo marquee
    CustomCursor.tsx
    SmoothScroll.tsx         Lenis wrapper
    motion/ProximitySurface.tsx
    ...

public/
  hero/light-mountains-loop.mp4
  og-image.png
  favicon.png
  upraiser-logo.png
  robots.txt
  sitemap.xml
  privacy/index.html
  terms/index.html
  partners/*.svg
  fonts/

scripts/
  sync-assets.sh
  verify-assets.sh
  deploy-vercel.sh
  restore-hero-from-prod.sh
  generate-og-image.mjs
  rollback-*.sh

assets/                      Master media (synced to public/)
```

---

## 21. Environment

```bash
# .env (local)
VITE_WEB3FORMS_ACCESS_KEY=your_key_here
```

Vercel project: `upraiser-site` under `alex-3152s-projects`  
Deploy: `npm run deploy` → `scripts/deploy-vercel.sh`

---

## 22. Apple preview mode (dev only)

- URL param: `?applePreview=1`
- Lazy loads `ApplePreviewPanel` + `HeroHighlights`
- For internal design comparison — not shown in production by default

---

*End of handoff. For questions about visual intent, prefer media kit mountains + ascent metaphor. For scroll feel, test on real device before shipping.*
