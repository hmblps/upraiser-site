# UPRAISER — Hero Context (3D Everest fly)

> **Status (25 Jul 2026):** **SHIPPED** — desktop hero is a sticky Lenis runway + React Three Fiber Everest fly-through.  
> Legacy plan (scroll-scrub MP4) is **superseded**; do not reintroduce looping mountains video into the live canvas path without an explicit ask.  
> Full site handoff: **[AI_HANDOFF.md](./AI_HANDOFF.md)** · human summary: **[README.md](./README.md)**  
> Live: https://upraiser-site.vercel.app/

---

## 1. Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite 8 + React 19 + TypeScript |
| 3D | `@react-three/fiber` + `@react-three/drei` + `three` |
| Scroll | Lenis (desktop) + `HeroFlyContext` progress (not drei `useScroll`) |
| Styles | Tailwind v4 + `src/styles/hero.css` |
| Motion (UI) | Framer Motion springs |

**No GSAP.** Hero camera / beams / fog read `progressRef` from `HeroFlyProvider`.

---

## 2. What shipped

### Desktop (≥768px, motion ok)

1. `#hero` is a **sticky runway** driven by `HeroFlyProvider` (Lenis-aware).
2. Inner stage stays viewport-locked while progress 0→1.
3. **Camera** flies Path C (“Low approach”) in `HeroTerrainCanvas` (`HERO_ASCENT_DEFAULTS`).
4. **Headline** micro-floats with climb; soft exit toward landing pad before Audience.
5. After runway: short `.hero-landing-pad`, then `#audience` (anchor fold).

### Theme FX (same canvas)

| Theme | Implementation |
|-------|----------------|
| **Light** | Opaque clear `#f2ebe0` · `BrandHazeSky` cream→gold shader dome (not drei `<Sky>`) · `ScrollBeams` — two drei `SpotLight`s from viewport corners, aim sweeps with progress |
| **Dark** | Opaque clear `#050504` · `NightStars` — camera-centered point dome behind ridges |

### Mobile / reduced motion

CSS sky only (`HeroAtmosphere`). No WebGL mount.

---

## 3. DOM / component map

```tsx
// HomePage.tsx
<div id="hero">
  <Hero />                    {/* HeroFlyProvider wraps stage */}
</div>
<div className="hero-landing-pad" />
<Audience runway="anchor" />
```

```tsx
// Hero.tsx
<HeroFlyProvider>
  <HeroAtmosphere />          {/* CSS sky + idle-lazy HeroTerrainCanvas */}
  <div className="hero-stage">…headline + ghost stats…</div>
  <LenovoTrustStrip />
</HeroFlyProvider>
```

```tsx
// HeroTerrainCanvas Scene (light)
Atmosphere (fog) → HorizonGlow → SunRig → ScrollBeams → HeroCamera → BrandHazeSky → Everest
// dark: NightStars instead of BrandHazeSky / ScrollBeams
```

| File | Role |
|------|------|
| `src/context/HeroFlyContext.tsx` | Sticky runway progress → `progressRef` |
| `src/components/HeroAtmosphere.tsx` | CSS sky; lazy-mount canvas on desktop |
| `src/components/HeroTerrainCanvas.tsx` | Camera, fog, sun, haze/stars, scroll beams |
| `src/components/Everest.tsx` | GLB wire + ghost fill materials |
| `src/styles/hero.css` | Atmosphere, sticky copy, terrain fade |

---

## 4. Assets

| Path | Role |
|------|------|
| `assets/hero/everest.glb` → `/hero/everest.glb` | Live terrain (required for build) |
| `public/draco/gltf/*` | Draco decoders (in place) |
| `assets/hero/light-mountains-loop.mp4` | **Optional** — OG tooling / legacy; **not** synced to public by default |

```bash
npm run optimize:everest
bash scripts/sync-assets.sh
```

---

## 5. Art direction locks (do not regress)

1. **Light sky:** cream / beige / soft gold only. Never re-enable physical Rayleigh `Sky` (dirty blue-grey + horizon seam).
2. **No ground disc** under the mountain — rim + fog = hard horizon line.
3. **Fog color** must match clear / haze base (`#f2ebe0` light, `#050504` dark).
4. **Wire (light):** yellow-gold (`#efb400`) for contrast on cream.
5. **ScrollBeams:** must be **readable** on scroll (viewport-corner sources + visible volumetric). Dial intensity with owner — do not hide them again by default.
6. **Stars:** camera-position-following dome; opaque night clear so additive/points composite cleanly.

---

## 6. Camera path (Path C — Low approach)

Defaults in `HERO_ASCENT_DEFAULTS` (`HeroTerrainCanvas.tsx`):

- Start low / left-offset, look toward peak right of center
- Climb + FOV tighten (46 → 34)
- Soft bank through mid arc + idle drone drift

Tune positions carefully — small Y/Z changes break headline/sky balance.

---

## 7. What NOT to do

- ❌ Bring back looping MP4 as the primary hero background without an ask
- ❌ drei `<Sky>` / cool grey fog on light theme
- ❌ Ground `circleGeometry` horizon fill
- ❌ drei `useScroll` for hero progress (Lenis + `HeroFly` own the runway)
- ❌ GSAP ScrollTrigger

---

## 8. Tuning knobs (quick)

| Want… | Where |
|-------|--------|
| Beam visibility | `ScrollBeams` opacity / intensity / angle in `HeroTerrainCanvas.tsx` |
| Sky warmth | `BrandHazeSky` uniforms `uZenith` / `uMid` / `uHorizon` / `uGlow` |
| Wire yellow | `Everest.tsx` light accent + emissive |
| Fog depth | `FOG.light` / `FOG.dark` |
| Camera path | `HERO_ASCENT_DEFAULTS` |
| Header glass | `Header.tsx` `headerSurface` classes |

---

*Update this file when hero architecture changes. Prefer this over stale video-scrub notes.*
