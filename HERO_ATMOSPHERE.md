# Hero Atmosphere — документация

> **Проект:** UPRAISER marketing site  
> **Production:** https://upraiser-site.vercel.app  
> **Deploy:** `npm run deploy`  
> **Обновлено:** 27 июня 2026

---

## 1. Текущее состояние (approved · production)

| Тема | Фон hero | Orbs | Статус |
|------|----------|------|--------|
| **Light** | `light-mountains-loop.mp4` + warmwash + scrim | Orange + magenta, CSS drift | ✅ |
| **Dark** | Тот же video + dark scrim (без warmwash) | **Только orange**, cursor follow | ✅ |

Общее:
- `SiteGrain` — SVG noise на весь сайт
- `hero-bottom-fade-bridge` — нейтральный fade снизу hero (обе темы)
- `#audience::before` — нейтральный overlap hero → Audience (обе темы, dark чуть плотнее)
- **Не использовать gold radial** в bridge — даёт жёлтые полосы на тёмном фоне (отклонено 27.06)

### Ключевые файлы

```
src/components/HeroAtmosphere.tsx      — theme split, mountains, orbs, bridge
src/hooks/useHeroOrbCursorFollow.ts    — dark orb cursor follow (rAF lerp)
src/components/Hero.tsx                — контент поверх atmosphere
src/index.css                          — .hero-*, .hero-bottom-fade-bridge, #audience bridge
public/hero/light-mountains-loop.mp4   — shared video (~7 MB, обе темы)
```

---

## 2. Light theme

### Слои (снизу вверх)
1. `hero-mountains-media` — video, opacity **30%**
2. `hero-mountains-warmwash` — soft-light tint
3. `hero-mountains-scrim` — градиенты под текст
4. Orbs: orange (drift 18s) + magenta (drift 22s)
5. `hero-bottom-fade-bridge` — 7rem neutral fade

### Video
- `object-position: center 72%`
- `prefers-reduced-motion` → pause + `currentTime = 0`

---

## 3. Dark theme

### Слои (снизу вверх)
1. `hero-dark-mountains-media` — тот же video, opacity **32%**, filter `contrast(1.1) saturate(0.88) brightness(0.82)`
2. `hero-dark-mountains-scrim` — смягчённая виньетка (верх ~92% bg, не 100% solid)
3. **Один** `hero-orb-orange` — без drift, **следует за курсором** (~40px max, lerp 0.05)
4. `hero-bottom-fade-bridge` — 8rem neutral fade

### Cursor follow (dark only)
- Hook: `useHeroOrbCursorFollow`
- Только `pointer: fine`, только внутри hero bounds
- `prefers-reduced-motion` → статичный orb
- Light theme: drift вместо cursor follow (намеренно)

---

## 4. Hero → Audience bridge

Мягкий стык без гор на всю страницу:

| Элемент | Light | Dark |
|---------|-------|------|
| `.hero-bottom-fade-bridge` | 7rem, `--theme-bg` gradient | 8rem, чуть плотнее |
| `#audience.section-band::before` | overlap −4rem, height 6rem | overlap −5rem, height 7rem |
| `#hero` border-bottom | 28% opacity border | то же |

**Правило:** только нейтральные `color-mix(..., var(--theme-bg))`. Без `--theme-card-hover-mid` / gold radial.

---

## 5. HeroAtmosphere.tsx (актуальный)

```tsx
// Light: mountains + warmwash + scrim + 2 orbs (drift) + bridge
// Dark:  mountains + dark scrim + 1 orange orb (cursor follow) + bridge

useHeroOrbCursorFollow(containerRef, orbRef, !isLight && !reduced);
```

---

## 6. Design tokens

```css
/* Dark */
--theme-bg: #0a0a0a;
--theme-accent: #ffcc00;
--theme-accent-secondary: #e63558;

/* Light */
--theme-bg: #fffbf7;
--theme-accent: #e8a500;
```

### Orb opacity
| Theme | Orange | Magenta |
|-------|--------|---------|
| Light | 0.55 | 0.45 |
| Dark  | 0.52 | — (нет) |

---

## 7. Хронология экспериментов (не повторять без запроса)

| Эффект | Вердикт | Причина |
|--------|---------|---------|
| Dark mesh / traffic rays / SVG noise / canvas grid | ❌ | Слабо или лагает cursor |
| Dark 114MB hero video над stat cards | ❌ | Тяжёло, отвлекает |
| DarkTopographyAtmosphere (CSS spotlight) | ❌ | «Колхоз» |
| Animated spotlight mask + sweep gold/magenta | ❌ | Заменено на cursor orb |
| Magenta orb в dark | ❌ | Один источник света — orange |
| Gold radial в hero→audience bridge | ❌ | Жёлтые горизонтальные полосы |
| Light theme cursor follow на orb | ⏸ | Отложено — достаточно drift |

---

## 8. Performance

| Техника | Cursor lag? | Заметность |
|---------|-------------|------------|
| CSS orbs + gradients | Нет | Средняя |
| 1× mountains video loop | Нет | Высокая |
| Orb cursor follow (1 rAF) | Нет* | Низкая |
| SVG feTurbulence ×3 | **Да** | — |

\*Отдельный rAF от CustomCursor — нагрузка минимальна при одном orb transform.

---

## 9. Чеклист для агента

- [ ] Video: `public/hero/light-mountains-loop.mp4` — обе темы
- [ ] Dark: один orange orb + cursor follow, **без** magenta / sweep / spotlight
- [ ] Bridge: **только neutral** `--theme-bg` gradients
- [ ] `prefers-reduced-motion` — video pause, no drift, no cursor follow
- [ ] Новый dark motion — тест cursor lag на MacBook + Chrome
- [ ] Deploy только по просьбе пользователя
- [ ] Copy → `src/data/content.ts`

---

## 10. Команды

```bash
npm run dev
npm run build
npm run deploy    # Vercel → upraiser-site
```

---

*См. также: `ACCENT_SCROLL.md`, `GEMINI_HANDOFF.md`, `README.md`*
