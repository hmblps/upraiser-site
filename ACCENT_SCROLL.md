# Accent Scroll — GROWTH & OUTCOMES

> **Проект:** UPRAISER marketing site  
> **Production:** https://upraiser-site.vercel.app  
> **Deploy:** `npm run deploy`  
> **Обновлено:** 27 июня 2026

---

## 1. Концепция

Два scroll-момента на сайте — не больше. Остальные акценты **статичные** (typography only).

| # | Секция | Слово | Цвет | Высота scroll | Смысл |
|---|--------|-------|------|---------------|--------|
| 1 | **Audience** (`#audience`) | GROWTH → *growth* | magenta | ~200vh | Пространство для роста клиента |
| 2 | **Promise** (`#promise`) | OUTCOMES → *Outcomes* | magenta | ~120vh (lite) | Verified outcomes, не impressions |

**Contact** (`#contact`): **UPRAISED** — только typographic accent (red), без scroll. Форма не должна отвлекать.

История при скролле: **growth → outcomes → contact**.

---

## 2. Поведение

### Audience — `GrowthScrollBlock.tsx`

1. Label + title: *Built for Clients Who Care About Quality &*
2. Крупное **GROWTH** по центру (magenta glow)
3. При скролле слово уменьшается и садится в строку: *And we open up space for Your* **growth**
4. Строки появляются fade + slide слева
5. CTA: **Contact →**

### Promise — `PromiseScrollBlock.tsx`

1. Label: *Why UPRAISER* (gold label)
2. Крупное **OUTCOMES** по центру (magenta glow, lite)
3. Садится в заголовок: *We Don't Sell Impressions. We Buy Verified* **Outcomes**.
4. Description + CTA *Start a Conversation →* fade in
5. Короче и быстрее, чем GROWTH (~120vh vs ~200vh)

### Reduced motion

`prefers-reduced-motion: reduce` → обе секции показывают **финальный статичный layout** без sticky/scroll-анимации.

---

## 3. Typographic accents (без scroll)

| Место | Accent | Цвет |
|-------|--------|------|
| Promise title (static / fallback) | Outcomes | red |
| Contact title | Upraised → **UPRAISED** (uppercase via `.section-title`) | red |
| Objectives cards 01–04 | номера | gold `text-orange/30` |

**Copy rule:** You / Your / Yours — с заглавной Y в клиентском тексте.

---

## 4. Файлы

```
src/components/GrowthScrollBlock.tsx   — Audience scroll
src/components/PromiseScrollBlock.tsx  — Promise scroll (lite)
src/components/PromiseSection.tsx      — wrapper → PromiseScrollBlock
src/components/AccentWord.tsx          — inline accent (gold | red)
src/components/Audience.tsx            — wrapper → GrowthScrollBlock
src/data/content.ts                    — audience, promise, contact copy
src/index.css                          — .growth-scroll-*, .accent-scroll-*, .accent-word-*
```

### CSS-классы

- `.growth-scroll-section` — 200vh sticky runway
- `.accent-scroll-section--lite` — 120vh sticky runway
- `.growth-scroll-hero-word` / `.accent-scroll-hero-word-red` — крупное hero-слово
- `.growth-word-inline` / `.accent-word-red` — inline accent в финальном тексте

---

## 5. Контент (content.ts)

```ts
audience: {
  label: "Core of Our Work",
  title: "Built for Clients Who Care About Quality &",
  line1: "We deliver results beyond client expectations.",
  line2Prefix: "And we open up space for Your",
  growthWord: "growth",
  cta: "Contact",
}

promise: {
  label: "Why UPRAISER",
  titleLead: "We Don't Sell Impressions. We Buy Verified ",
  accentWord: "Outcomes",
  scrollHeroWord: "OUTCOMES",
  // ...
}

sections.contact: {
  titleLead: "Are You Ready to Be ",
  accentWord: "Upraised",
}
```

---

## 6. Deploy

```bash
npm run build
npm run deploy
```

- Web3Forms: `VITE_WEB3FORMS_ACCESS_KEY` в Vercel env
- Rollback: Vercel Dashboard → Deployments → Promote previous

---

## 7. Не делать

- Третий scroll-moment (Upraised / Scale / Verified) — перегруз
- Neon/strobe на hero-словах — отклонено клиентом
- Красный UPRAISER в header/footer — только inline accents в copy
- Дублирующие CTA к Case Studies (hero + nav достаточно)

---

## 8. Связанные документы

- [`HERO_ATMOSPHERE.md`](./HERO_ATMOSPHERE.md) — hero, orbs, hero→Audience bridge
- [`README.md`](./README.md) — быстрый старт и deploy
- [`GEMINI_HANDOFF.md`](./GEMINI_HANDOFF.md) — полный handoff
