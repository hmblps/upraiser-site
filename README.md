# UPRAISER — Marketing Site

Одностраничный лендинг **UPRAISER Agency LLP** — Premium Traffic Infrastructure.

| | |
|---|---|
| **Production** | https://upraiser-site.vercel.app |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion · Lenis |
| **Deploy** | `npm run deploy` |

---

## Быстрый старт

```bash
npm install
cp .env.example .env    # VITE_WEB3FORMS_ACCESS_KEY
npm run dev             # http://localhost:5173
npm run build
npm run deploy          # Vercel → upraiser-site
```

---

## Документация

| Файл | Содержание |
|------|------------|
| [`HERO_ATMOSPHERE.md`](./HERO_ATMOSPHERE.md) | Hero: mountains, orbs, dark cursor follow, hero→Audience bridge |
| [`ACCENT_SCROLL.md`](./ACCENT_SCROLL.md) | Scroll-акценты GROWTH & OUTCOMES |
| [`GEMINI_HANDOFF.md`](./GEMINI_HANDOFF.md) | Полный handoff: структура, copy rules, история решений |

---

## Статические файлы (`public/`)

Vite отдаёт всё из **`public/`** как корень сайта (`public/hero/foo.mp4` → `/hero/foo.mp4`).  
**Не храни медиа в Downloads или других папках** — только здесь, иначе при деплое файлы пропадут.

| Файл | Назначение |
|------|------------|
| `public/hero/light-mountains-loop.mp4` | Hero mountains (light + dark), ~7 MB |
| `public/upraiser-logo.png` | Logo в header / footer |
| `public/favicon.png` | Favicon |
| `public/partners/*` | Логотипы интеграций |

Перед `npm run build` скрипт `scripts/verify-assets.sh` проверяет обязательные файлы.

---

## Структура страницы

```
Header (fixed)
#hero          Hero + LenovoTrustStrip
#audience      GROWTH scroll block
#value         ValueProps
#promise       OUTCOMES scroll block
#difference · #objectives · #channels · #testimonials
#cases · #technology · #about · #process · #contact
PartnersCarousel · Footer
```

---

## Ключевые правила

- **Copy** — только `src/data/content.ts`
- **You / Your / Yours** — с заглавной Y
- **UPRAISER** — caps в labels; Contact accent: **Upraised** (red)
- **Light hero** — mountains + 2 orbs (drift)
- **Dark hero** — mountains + 1 orange orb (cursor follow)
- **Deploy / commit** — только по явной просьбе

---

## Env

```bash
VITE_WEB3FORMS_ACCESS_KEY=   # contact form → web3forms.com
```

Скрипт deploy синхронизирует ключ в Vercel env автоматически.
