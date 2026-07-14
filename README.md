# UPRAISER — Marketing Site

Одностраничный лендинг **UPRAISER Agency LLP** — Premium Traffic Infrastructure для mobile/web user acquisition (iGaming, Fintech, premium media).

| | |
|---|---|
| **Production** | https://upraiser-site.vercel.app |
| **Целевой домен** | https://upraiser.co.uk (пока не на Vercel) |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion · Lenis |
| **Copy** | `src/data/content.ts` · кейсы: `src/data/cases.ts` |
| **Deploy** | `npm run deploy` |

> **Полный handoff для других ИИ** — концепт, история решений, все детали реализации:  
> **[AI_HANDOFF.md](./AI_HANDOFF.md)** ← шарить этот файл вместе с репозиторием.

---

## Быстрый старт

```bash
npm install
cp .env.example .env          # VITE_WEB3FORMS_ACCESS_KEY
npm run dev                   # http://localhost:5173
npm run build                 # sync-assets + verify-assets + tsc + vite
npm run deploy                # Vercel → upraiser-site
```

**Env:** `VITE_WEB3FORMS_ACCESS_KEY` — contact form ([web3forms.com](https://web3forms.com)). `scripts/deploy-vercel.sh` синхронизирует ключ в Vercel.

**Правило:** commit и deploy — **только по явной просьбе** владельца проекта.

---

## Концепт (кратко)

**Позиционирование:** не «generic agency», а **traffic infrastructure** — DMP, fraud layer, OEM access, event-verified buying.

**Референсы по структуре (не копипаст):**
- [Z2A Digital](https://www.z2adigital.com/) — promise, 4 Ts, technology, case studies
- [Hike](https://gohike.com.br/) — value props, objectives, traffic channels, process
- Медиакит UPRAISER — бренд, low-poly mountains, луч ascent, gold + magenta

**Два scroll-момента (больше не добавлять):** `#audience` → **GROWTH** · `#promise` → **OUTCOMES**

**Hero:** cursor-lit mountains video (без orbs). Курсор «подсвечивает» горы через CSS mask.

---

## Структура страницы

```
SiteGrain · CustomCursor (deferred) · Header (fixed)
main:
  #hero              Hero (CSS entrance) + HeroAtmosphere + LenovoTrustStrip
  #audience          GROWTH scroll block
  #value             ValueProps (3 pillars)
  #promise           OUTCOMES scroll block
  #difference        4 Ts bento grid
  #objectives        4 objectives
  #channels          Traffic channels (tabs + detail)
  #testimonials      Client quotes carousel (mobile)
  #cases             Case studies infinite carousel
  #technology        Proximity glow cards
  #about             About + stats
  #process           4-step process
  #contact           Form (Web3Forms) + Lenovo strip
PartnersCarousel     Infinite logo marquee
Footer               Explore / Company / Legal
MobileSectionNav · SectionNav (↑↓ keyboard)
```

Секции ниже hero — **lazy-loaded** (`React.lazy` + `Suspense` + idle preload).

---

## Бренд и copy

| Правило | Пример |
|---------|--------|
| UPRAISER | ALL CAPS в labels, nav, logo |
| You / Your / Yours | Capitalized **Y** в клиентском тексте |
| Section labels | gold (`section-label`) или red (`section-label-red`) |
| Card titles | gold (`text-orange`) по умолчанию |
| Contact accent | **UPRAISED** (red/magenta в title) |
| Тон | Infrastructure, hard metrics, verified outcomes |

**Тема:** light/dark · `localStorage` key `upraiser-theme` · anti-flash script в `index.html`

**Favicon:** `/favicon.png` (192×192) · **Logo:** `/upraiser-logo.png`

**OG/Twitter:** hand-crafted `og-image.png` (1024×537) · пока `og:image` → `upraiser-site.vercel.app/og-image.png`

**Акценты:** `src/lib/accent.ts` — gold = orange · red = magenta

---

## Ключевые UX-паттерны

| Область | Поведение |
|---------|-----------|
| Scroll desktop | Lenis (`lerp: 0.085`, `allowNestedScroll: true`) |
| Scroll mobile/touch | Native (`usePreferNativeScroll`) |
| `#cases` carousel | Manual only · seamless loop · 2 DOM copies (clone hidden) · drag + horizontal wheel |
| Partners strip | CSS marquee, infinite |
| Custom cursor | Fine pointer only · modes: default/link/cta/card |
| Reduced motion | Отключает Lenis effects, video lit, marquee, entrances |

---

## Performance (v1)

- Hero entrance — **CSS**, не framer-motion (main bundle ~69 KB gzip)
- `framer-motion` — отдельный chunk (~47 KB gzip), грузится с lazy-секциями
- `lenis` — отдельный chunk (~5 KB gzip)
- `CustomCursor` — deferred via `requestIdleCallback`

**Не делали (без visual QA):** hero video re-encode (~7 MB 1080p остаётся как есть)

---

## SEO

- `public/robots.txt`
- `public/sitemap.xml` — `/`, `/privacy`, `/terms`
- JSON-LD `Organization` в `index.html`
- Legal canonical: `upraiser.co.uk/privacy` · `upraiser.co.uk/terms`
- ICO в privacy: **ZC000436**

---

## Статические файлы

**Master:** `assets/` → sync → `public/` перед build (`scripts/sync-assets.sh`)

| `assets/` | Deploy |
|-----------|--------|
| `hero/light-mountains-loop.mp4` | ~7 MB 1080p hero |
| `brand/og-image.png` | OG card |
| `brand/favicon.png` | Favicon |
| `brand/upraiser-logo.png` | Logo |

```bash
bash scripts/restore-hero-from-prod.sh   # hero с prod
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh          # в npm run build
```

---

## Откат

```bash
bash scripts/rollback-perf.sh          # → pre-perf-opt
bash scripts/rollback-polish.sh        # → pre-polish-opt
bash scripts/rollback-interaction.sh   # → pre-interaction-opt
```

---

## Не делать (без явного запроса)

- Orbs, sweep glows, gold radial в hero→audience bridge
- Третий scroll-moment
- Hero video re-encode без visual QA
- Красный UPRAISER в header/footer wordmark
- Защита hero copy от cursor-lit (убивает «прожектор»)
- Автоскролл карусели кейсов (только manual)
- Commit без явной просьбы

---

## Остаётся на стороне клиента

- Финальные **логотипы** partners (сейчас ~5 SVG из 18 в `public/partners/`)
- **Переделанные кейсы** (дизайн карточек, client logos)
- **Живой copy** вместо AI-текста (testimonials, descriptions)
- Перенос **upraiser.co.uk** на Vercel + обновление `og:image` URL
- Smoke test contact form → `info@upraiser.co.uk`
- Careers: сейчас `mailto:` — опционально секция `#careers`

---

## Контакты

| | |
|---|---|
| Email | info@upraiser.co.uk |
| Address | 128 City Road, London EC1V 2NX, UK |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |
