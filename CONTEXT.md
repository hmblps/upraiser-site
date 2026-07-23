# UPRAISER — Context Package for External AI

> **Status (23 Jul 2026):** planning brief only — **scroll-scrub hero is NOT implemented** in production.  
> Current live hero = looping `/hero/light-mountains-loop.mp4` + theme overlay crossfade.  
> Full site handoff: **[AI_HANDOFF.md](./AI_HANDOFF.md)** · human summary: **[README.md](./README.md)**  
> Live site: https://upraiser-site.vercel.app/

> Copy this entire file into an external AI chat to implement **scroll-driven hero video + text parallax**.

---

## 1. Stack (answer: Vite + React, NOT Next.js)

| Layer | Choice |
|-------|--------|
| Framework | **Vite 8 + React 19 + TypeScript** |
| Styling | **Tailwind CSS v4** + custom CSS in `src/styles/*.css` |
| Scroll smoothing | **Lenis** (`lenis` package) — NOT GSAP, NOT Locomotive |
| Scroll-driven animation | **Framer Motion** (`useMotionValue`, `useSpring`, `useTransform`) |
| Custom scroll scenes | **`useScrollScene` hook** + `runwayProgress()` — already used in Audience/Promise sections |
| Charts | Recharts (unrelated to hero) |

**No GSAP ScrollTrigger.** Integrate with existing Lenis + `registerScrollListener`.

### package.json (dependencies only)

```json
{
  "dependencies": {
    "framer-motion": "^12.41.0",
    "lenis": "^1.3.24",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "recharts": "^3.9.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.1",
    "tailwindcss": "^4.3.1",
    "typescript": "~6.0.2",
    "vite": "^8.1.0"
  }
}
```

---

## 2. Task — UX Scenario

### Goal
Replace (or extend) the current **looping hero background video** with a **scroll-scrubbed ascent video** + **parallax on hero text**.

### Desired behavior (desktop ≥768px, motion ok)

1. `#hero` becomes a **scroll runway** (~**220vh** total height).
2. Inner hero content is **`position: sticky`** (top = site header offset).
3. While user scrolls through the runway (0→100% progress):
   - **Video** scrubs from `currentTime = 0` to `duration` (NOT autoplay loop).
   - **Hero copy** (label, H1, lede, founded, CTAs) moves at different Y speeds (parallax) and slightly fades.
   - **Stat cards** (right column) parallax slower or opposite direction.
4. After runway completes, page scroll continues normally to `#audience` (Lenovo strip + sections).
5. **Mobile / `prefers-reduced-motion`**: fallback to current behavior — static poster frame OR looping video, no runway.

### Creative direction (video content — being generated separately)

- **POV / aerial ascent** to mountain summit — NOT diving into canyons.
- Final frames: **on peak**, panoramic horizon, mountain ridges.
- Aspect **16:9**, 1080p, ~8–12 seconds, no watermark.
- Placeholder path (future): `/hero/ascent/hero-ascent.mp4`
- **Current prod asset** (loop fallback): `/hero/light-mountains-loop.mp4`

### Video asset specs (current loop)

| Property | Value |
|----------|-------|
| Path (public URL) | `/hero/light-mountains-loop.mp4` |
| Source on disk | `assets/hero/light-mountains-loop.mp4` → synced to `public/` on build |
| Resolution | **1920×1080** |
| FPS | **25** |
| Duration | **~13.04 s** |
| Format | H.264 MP4, muted, `playsInline` |

For scroll-scrub, a **shorter 8–10s non-loop** ascent clip is preferred.

### Video CSS (current — do not break edge fill)

```css
.hero-mountains-video {
  object-fit: cover;
  object-position: center 58%;
  transform: scale(1); /* NEVER scale below 1 — causes edge gaps */
}
```

---

## 3. DOM structure (current)

```tsx
// App.tsx
<main>
  <div id="hero" className="md:min-h-[calc(100dvh-4.75rem)]">
    <Hero />
  </div>
  <LenovoTrustStrip />
  <Audience />  {/* scroll scenes already below */}
  ...
</main>
```

```tsx
// Hero.tsx
<section className="hero-stage">
  <HeroAtmosphere />   {/* background video + scrims + cursor spotlight */}
  <div className="hero-content">
    <div className="hero-copy">...</div>   {/* left: text */}
    <div className="hero-stats">...</div>   {/* right: 4 stat cards */}
  </div>
</section>
```

---

## 4. Scroll infrastructure — MUST reuse

### Lenis init (`SmoothScroll.tsx`)

- Lenis wraps entire app via `<ScrollProvider>`.
- Scroll position exposed via `registerScrollListener((scrollY) => ...)`.
- **All scroll-driven hooks MUST use `registerScrollListener`**, not raw `window.scroll` alone (Lenis virtual scroll).

### `useScrollScene` — pattern for hero runway

Already exists. Example usage:

```tsx
const runwayRef = useRef<HTMLElement>(null);
const progress = useScrollScene(runwayRef, { mode: "runway", spring: true });
// progress: MotionValue<number> 0→1 while section scrolls through viewport
```

```ts
// lib/scrollScene.ts
export function runwayProgress(sectionTop, sectionHeight, viewportHeight, enterOffset = 0) {
  const scrollRange = sectionHeight - viewportHeight;
  if (scrollRange <= 0) return 0;
  return clamp((-sectionTop - enterOffset) / scrollRange, 0, 1);
}
```

### Gate for desktop-only runway

```tsx
const runwayEnabled = useScrollRunwayEnabled(); // false on mobile or reduced-motion
```

---

## 5. Key files to modify / create

| File | Role |
|------|------|
| `src/components/Hero.tsx` | Add runway ref, parallax on copy via `useTransform(progress, ...)` |
| `src/components/HeroAtmosphere.tsx` | Video scrub OR swap `HeroMountainsLoop` → `HeroScrollVideo` |
| `src/hooks/useScrollScene.ts` | Reuse as-is |
| `src/components/SmoothScroll.tsx` | Reuse as-is — sync video scrub to Lenis listener |
| `src/styles/hero.css` | `.hero-runway`, `.hero-runway-sticky` |
| `src/App.tsx` | Optionally move `#hero` height to runway wrapper |

### Suggested new component

`src/components/HeroScrollVideo.tsx`:

```tsx
// Pseudocode — implement against real project
useMotionValueEvent(progress, "change", (p) => {
  if (!videoRef.current || !videoRef.current.duration) return;
  videoRef.current.currentTime = p * videoRef.current.duration;
});
```

Preload: `video.preload = "auto"`, pause loop, `muted playsInline`.

---

## 6. Parallax speeds (starting point)

```tsx
const labelY = useTransform(progress, [0, 1], [0, -40]);
const titleY = useTransform(progress, [0, 1], [0, -120]);
const ledeY  = useTransform(progress, [0, 1], [0, -180]);
const titleOpacity = useTransform(progress, [0, 0.75, 1], [1, 1, 0.35]);
const bgScale = useTransform(progress, [0, 1], [1, 1.06]); // subtle, keep >= 1
```

Use Framer Motion `motion.*` with `style={{ y, opacity }}`. Spring type `"spring"` for micro-interactions.

---

## 7. Constraints — do NOT

- ❌ Add GSAP / ScrollTrigger (not in project)
- ❌ Use `window.scroll` without `registerScrollListener` when Lenis active
- ❌ `transform: scale()` below 1 on full-bleed video (causes edge gaps)
- ❌ Break mobile — keep `useScrollRunwayEnabled()` gate
- ❌ Break `prefers-reduced-motion` — static fallback
- ❌ Remove existing scrims/spotlight in `HeroAtmosphere` without replacement
- ❌ YouTube embed — self-hosted MP4 only

---

## 8. Hero copy (for layout reference)

```
Label:  UPRAISER · Charting the Ascent
H1:     We see how stunning / Your rise / to the top / can be.
Lede:   Pre-bid fraud filtration, OEM distribution, and verified outcomes.
Footer: Founded 17 July 2017 · Based in London
CTAs:   Contact | View Case Studies
Stats:  4 cards (mode-dependent metrics) — right column on desktop
```

---

## 9. Deliverables expected from AI

1. `HeroScrollVideo.tsx` (or extend `HeroAtmosphere.tsx`)
2. Updated `Hero.tsx` with runway + parallax
3. CSS additions in `hero.css`
4. Fallback path for mobile/reduced-motion
5. TypeScript, no new deps unless justified
6. Brief note on where to drop final MP4 (`assets/hero/ascent/`)

---

## 10. Reference — AccentScrollFold (existing scroll pattern)

Other sections use sticky runway via `AccentScrollFold` + `useScrollScene`. Hero should follow the same architecture for consistency.

---

## 11. Prompt for AI (paste as task)

```
Implement scroll-scrubbed hero video for UPRAISER (Vite/React/Lenis/Framer Motion).

Use existing useScrollScene({ mode: "runway" }) and registerScrollListener from ScrollContext.
Hero runway ~220vh, sticky inner viewport, video currentTime = progress * duration.
Parallax hero text layers at different Y speeds. Desktop only (useScrollRunwayEnabled).
Mobile/reduced-motion: keep looping /hero/light-mountains-loop.mp4.

Return full code for new/modified files. Match existing TypeScript + Tailwind conventions.
Do not add GSAP.
```
