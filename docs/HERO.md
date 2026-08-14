# UPRAISER — Hero Context (3D Everest fly)

> **Status:** **SHIPPED** — desktop sticky Lenis runway + R3F Everest fly.  
> Light = white paper + photoreal `everest-light.glb` + ice halo + atmospheric soar silhouette.  
> Dark = wire Everest + night stars.  
> Mobile / reduced = **`light-mountains-loop.mp4`** (not a flat CSS-only sky).  
> Legacy scroll-scrub MP4 as the *desktop* hero is **superseded** — do not bring it back without an explicit ask.  
> Full site: **[AI-FULL.md](./AI-FULL.md)** · **[HANDOFF.md](./HANDOFF.md)** · Solutions: **[SOLUTIONS.md](./SOLUTIONS.md)** · human: **[README.md](../README.md)** · assets: **[ASSETS.md](./ASSETS.md)**  
> Live: https://upraiser.co.uk/  
> **Docs sync:** 14 August 2026 · code tip `e951e9e` (+ fold SVG polish on disk — see HANDOFF §22).

---

## 1. Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite 8 + React 19 + TypeScript |
| 3D | `@react-three/fiber` + `@react-three/drei` + `three` |
| Scroll | Lenis (desktop) + `HeroFlyContext` progress (**not** drei `useScroll`) |
| Styles | Tailwind v4 + `src/styles/hero.css` + theme tokens in `src/index.css` |
| Motion (UI) | Framer Motion springs |

**No GSAP.** Camera / beams / fog / halo / bird read `progressRef` from `HeroFlyProvider`.

---

## 2. What shipped

### Desktop (≥768px, motion ok)

1. `#hero` sticky runway via `HeroFlyProvider` (Lenis-aware).
2. Stage viewport-locked while progress 0→1.
3. Camera Path C (“Low approach”) — `HERO_ASCENT_DEFAULTS` in `shared.ts` / canvas.
4. Headline micro-floats with climb; soft exit before Audience.
5. After runway: `.hero-landing-pad` → `#audience`.

### Theme FX (same canvas)

| Theme | Clear / terrain | Sky / FX |
|-------|-----------------|----------|
| **Light** | Clear ~white / cool haze · **photo** `everest-light.glb` (albedo + normal + derived roughness) · planet-bend normals | `BrandHazeSky` · `ScrollBeams` · **`AscentHalo`** (camera-relative ice ring) · **`AscentBird`** (procedural soar silhouette on halo) · `StudioRimLight` |
| **Dark** | Clear `#050504` · stripped **wire** `everest.glb` | `NightStars` (camera-centered) · no halo / bird / beams |

### Mobile / reduced motion

`HeroAtmosphere` → `HeroMountainsMobile`: looping **`/hero/light-mountains-loop.mp4`** + light/dark posters. No WebGL. Poster-only when `prefers-reduced-motion`.

---

## 3. DOM / component map

```tsx
// HomePage.tsx
<div id="hero"><Hero /></div>
/* landing pad then Audience… */
```

```tsx
// Hero.tsx
<HeroFlyProvider>
  <HeroAtmosphere />   {/* CSS sky + idle-lazy HeroTerrainCanvas */}
  <div className="hero-stage">…headline + ghost stats…</div>
  <LenovoTrustStrip />
</HeroFlyProvider>
```

```tsx
// Scene.tsx (light)
Atmosphere → HorizonGlow → SunRig → ScrollBeams → StudioRimLight → AscentHalo
→ HeroCamera → BrandHazeSky → Everest → AscentBird
// dark: NightStars; no ScrollBeams / Halo / Bird / StudioRim
```

| File | Role |
|------|------|
| `src/context/HeroFlyContext.tsx` | Sticky runway → `progressRef` |
| `src/components/HeroAtmosphere.tsx` | CSS sky + mobile mountains MP4; idle-mount canvas on desktop |
| `src/components/hero-terrain/*` | Canvas scene graph (camera, fog, FX) |
| `src/components/Everest.tsx` | Theme-switched GLB (wire vs photo) |
| `src/lib/heroModel.ts` | `MODEL_URL` / `MODEL_URL_LIGHT` / `DRACO_PATH` |
| `src/styles/hero.css` | Atmosphere shell, sticky copy |

---

## 4. Assets

| Path | Role |
|------|------|
| `assets/hero/everest.glb` → `/hero/everest.glb` | Dark wire terrain (**required**) |
| `assets/hero/everest-light.glb` → `/hero/everest-light.glb` | Light photo terrain (**required**) |
| `public/draco/gltf/*` | Draco WASM |
| `assets/hero/*.src.glb` | Heavy Sketchfab sources — **gitignored**, not shipped |
| `ascent-bird.glb` | **Unused** leftover; live bird is procedural canvas silhouette |

```bash
npm run optimize:everest        # dark / wire pipeline
npm run optimize:everest-light  # light photo + roughness bake
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh
```

Source reference (Mt. Everest Sketchfab yyao39) → optimize into the two public GLBs. Do not confuse with quarantined `snowy-mountain-v2.src.glb`.

---

## 5. Art direction locks (do not regress)

1. **Light UI / sky:** white paper (`#ffffff`) + cool haze — **not** cream `#f2ebe0` regression, **not** Rayleigh `Sky`.
2. **Fog** matches clear / haze (`FOG.light` ≈ `#f4f6f9`, dark `#050504`).
3. **No ground disc** under the mountain.
4. **Dark wire:** brand gold; **light:** photo maps, no wire overlay as primary read.
5. **Halo:** camera-relative (`camera + sunDir × dist`) — never world-pinned “sticker”.
6. **Bird:** atmospheric silhouette near halo — one slow scroll gesture + rare wingbeats; **not** a flappy GLB character.
7. **ScrollBeams:** readable on scroll (light only).
8. **Stars:** follow camera; opaque night clear.

---

## 6. Camera path (Path C — Low approach)

Defaults in `HERO_ASCENT_DEFAULTS` (`shared.ts`):

- Start low / left-offset; look toward peak
- Climb + FOV tighten (46 → 34)
- Soft bank + idle drone drift

Small Y/Z edits break headline / sky balance — tune carefully.

---

## 7. AscentBird (light only)

- Procedural `CanvasTexture` soar mark + `Billboard`
- Placed on same sun-ray family as `AscentHalo` (`BIRD_CAM_DIST ≈ 158`)
- Soft damp + long progress window (no bullet cross)
- Envelope: appear ~0.10–0.26 · fade ~0.58–0.86 of HeroFly progress
- Occasional deep wingbeat via silhouette redraw — mostly locked glide

---

## 8. Theme switch (fixed 28 Jul)

**Was:** light textured mountain dirty/late; dark also lagged after toggle (`key={theme}` remounted WebGL; light GLB ~11MB; dark-only prefetch).

**Now:**

1. Single Canvas — `ThemeGlSync` updates clear/exposure; no remount.  
2. Prefetch + `useGLTF.preload` for **both** GLBs.  
3. `hero-terrain-fade` veil until `SceneReady key={theme}` fires.  

Further map compression (2K / KTX2) is optional polish — see **[HANDOFF §14](./HANDOFF.md)**.

---

## 9. What NOT to do

- ❌ Looping MP4 as primary hero background without an ask  
- ❌ drei `<Sky>` / cool grey fog on light  
- ❌ Ground `circleGeometry` horizon fill  
- ❌ drei `useScroll` / GSAP ScrollTrigger for hero  
- ❌ Animated Sketchfab bird GLB as the live metaphor  
- ❌ Stripping `three` / R3F / router from `package.json` (breaks Vercel `npm install`)  
- ❌ Full-site loading screen just to swap light/dark hero  
- ❌ `key={theme}` on the hero Canvas (regresses the dirty flash)  

---

## 10. Tuning knobs

| Want… | Where |
|-------|--------|
| Beam visibility | `ScrollBeams.tsx` |
| Sky warmth | `BrandHazeSky` uniforms |
| Halo opacity / ring | `AscentHalo.tsx` |
| Bird speed / flap / window | `AscentBird.tsx` |
| Light PBR / wire | `Everest.tsx` + optimize scripts |
| Fog depth | `FOG` in `shared.ts` |
| Camera path | `HERO_ASCENT_DEFAULTS` |
| Model URLs | `src/lib/heroModel.ts` |

---

*Update this file when hero architecture changes. Prefer this over stale video-scrub or cream-sky notes.*
