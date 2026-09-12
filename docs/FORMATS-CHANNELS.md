# Formats page — `/channels`

> **SOT for the live Formats experience.**  
> Last synced: **11 Sep 2026** — Antigravity pass `dc8f65a` + local Rich inset tweak (`height: 80%`).  
> Brand / IA / deploy: `docs/UPRAISER-MASTER.md` (§4, §5, §10, §25).  
> When MASTER §10/§25 lag, **this file + the source paths below win**.

---

## 1. What this page is

| | |
| --- | --- |
| **URL** | `http://localhost:5173/channels` · prod `https://upraiser.co.uk/channels` |
| **Route** | `ChannelsPage` → `ProgrammaticScrollSection` |
| **Job** | Product proof: every ad format on a real device mockup (Phone / Tablet / TV) |
| **Nav** | Not in header — home `#routes` CTA → `/channels`; fixed “Back to The Routes” → `/#routes` |
| **Tone** | Operator proof — tagline + one sentence + three infrastructure bullets |

Home **does not** mount Formats 3D (Everest race). Legacy `/solutions` → `/#routes`.

---

## 2. Two lanes

| Lane | ID | Header title | Header description | Formats |
| --- | --- | --- | --- | --- |
| **App Growth** | `app-growth` | Every Format / *One Supply Path* | Equipment for altitude. Formats on a direct supply path You can defend. | `AD_FORMATS` |
| **OEM & CTV** | `oem-ctv` | OEM & CTV / *Measured Supply* | Pre-install, OEM storefronts, and CTV. Fixed lines that survive procurement. | `OEM_CTV_FORMATS` |

- State: `src/hooks/useRoutesLane.tsx`
- Tumbler: `RoutesLaneSwitcher` → `SlideTabs` (`layoutId="channels-solutions-lane-pill"`)
- Copy + `scene`: `src/components/solutions/ProgrammaticFormats.ts` (**copy SOT**)
- Header label: **The Routes**

---

## 3. Format catalog

### 3.1 App Growth — all `scene: "phone"` (default)

| # | `id` | Label | Tagline |
| --- | --- | --- | --- |
| 1 | `banner` | Banner | Scale inside 100K+ apps |
| 2 | `native` | Native | Intent-matched, not interruptive |
| 3 | `interstitial` | Interstitial | Full-screen impact at natural breaks |
| 4 | `rich` | Rich Media | Interactive formats that earn attention |
| 5 | `video` | Video | Rewarded and skippable |

Full body + bullets: `ProgrammaticFormats.ts` → `AD_FORMATS`.

### 3.2 OEM & CTV

| # | `id` | Label | Tagline | `scene` |
| --- | --- | --- | --- | --- |
| 1 | `pre-install` | Pre-install | On-device before the store | `tablet` |
| 2 | `oem-store` | OEM Store | Lenovo and partner storefronts | `tablet` |
| 3 | `system-ui` | System UI | OS-level moments that convert | `tablet` |
| 4 | `ctv-spot` | CTV Spot | Living-room scale, measured | `tv` |
| 5 | `ctv-video` | CTV Video | Long-form attention, short proof path | `tv` |

---

## 4. Glass media SOT — `src/data/deviceScreens.ts`

**One feed** for 3D, lite, and CSS fallback. Do not invent a second creative set.

### Still (`FORMAT_STILL`)

| Format | Path |
| --- | --- |
| `banner` / `native` / `interstitial` | `/channels/programmatic-refs/screens/{id}.png` |
| `rich` | `/channels/programmatic-refs/screens/rich-media.png` |
| `video` | `/channels/programmatic-refs/screens/video.png` |
| `pre-install` | `/channels/oem/screens/pre-install-oobe.png?v=4` · **900×1200** |
| `oem-store` | `/channels/oem/screens/oem-store.png?v=3` · **900×1200** |
| `system-ui` | `/channels/oem/screens/system-ui.png?v=3` · **900×1200** |
| `ctv-spot` / `ctv-video` poster | `/channels/oem/screens/ctv-spot.png` · **1920×1080** |

### Video (`FORMAT_VIDEO`)

| Format | Path |
| --- | --- |
| `rich` | `/channels/programmatic-feed/formats/rich.mp4` (lite/fallback only) |
| `video` | `/channels/programmatic-feed/formats/video.mp4` |
| `ctv-video` | `/channels/oem/screens/ctv-spot.mp4` |

### Live HTML (`FORMAT_HTML`)

| Format | Path | Notes |
| --- | --- | --- |
| `rich` | `/rich-media-ad.html` | ING unit on glass (`/ing-ad-15s.mp4`) |
| `oem-store` | `/channels/oem/oem-store.html` | Lite / mobile interactive |

### Per-format glass behaviour (live)

| Format | Desktop high-tier | Notes |
| --- | --- | --- |
| `banner` / `native` / `interstitial` | Still on Phone3D screen | No idle breathing |
| **`rich`** | **3D GLB** + **`.phone-rich-on-glb` iframe** | Dark screen (`applyDarkScreen`). Never flat CSS phone. Drag off. Pose `rotY=0.12`, `rotX=-0.05` |
| `video` | Poster → MP4 on `HAVE_CURRENT_DATA` | Only App Growth glass motion |
| `pre-install` | CanvasTexture + live clock | Revolut partner row; HTML bake `?bake=1` |
| `oem-store` | **CanvasTexture still** (same path as pre-install) | `isAnimatedTabletGlass` includes `oem-store` — no TextureLoader crop mismatch |
| `system-ui` | CanvasTexture + live clock | Notif settle-in **off** (old `SYS.notif` cut sushi) |
| `ctv-spot` | Still on outer TV plane | |
| `ctv-video` | MP4 loop | |

Painters: `src/lib/tabletGlassAnim.ts`  
`isAnimatedTabletGlass` → `pre-install` \| `system-ui` \| `oem-store`.

---

## 5. Architecture

### Wiring

| File | Role |
| --- | --- |
| `src/pages/ChannelsPage.tsx` | Shell, back link, lane |
| `ProgrammaticScrollSection.tsx` | Sticky runway + lift + carousel + copy |
| `ProgrammaticScrollSectionMobile.tsx` | `<1024` / reduced-motion |
| `FormatCopy.tsx` | Tagline, title, body, bullets, `n / 5` |
| `useFormatScrollSection.ts` | Native sticky → active index |
| `programmatic-scroll-section.css` | Layout, slots, **TV absolute breakout** |
| `phone-css-3d.css` | Phone stage + **`.phone-rich-on-glb`** |


### Cross-Canvas Animation Sync
Phone, Tablet, and TV live in separate, lazily-loaded `<Canvas>` elements inside `ProgrammaticScrollSection`.
**Rule:** Never use local `state.clock.elapsedTime` for animations that need to match across devices! Since canvases mount at different times during scrolling, their internal clocks start at `0` asynchronously, leading to severe phase desynchronization (devices floating out of rhythm).
**Fix:** Always use the global absolute wall-clock: `const t = performance.now() / 1000;`. This ensures all isolated 3D contexts float like synchronized swimmers.

### DeviceLoadStage & Suspense Architecture
We deliberately **decouple** texture loading from React's `<Suspense>` boundary to prevent the 3D chassis from disappearing ("white hole" effect) on slow networks.
1. `useGLTF(MODEL_PATH)` suspends the mesh. This is aggressive-preloaded globally in `App.tsx` so the GLB is cached long before the user scrolls to it.
2. We use `TextureLoader` inside a `useEffect` for screen images/videos, rather than `useTexture`. This ensures the TV/Tablet chassis renders instantly (as a black matrix) even if the poster image is still downloading in the background.
3. **`DeviceLoadStage` Spring Trap:** The `DeviceLoadStage` wrapper defaults to a 2-second CSS spring fade-in (`opacity` from `0.02` to `1.0`). For heavy 3D models like the TV that perfectly match their CSS optical size, this creates an illusion of a 2-3 second "network delay". Always pass `placeholder={null} instant` for Tablet and TV so they snap in instantly once the mesh is ready.

### Device stage hierarchy (Antigravity)

```
.prog-scroll-sticky          (overflow: visible)
  ambience + BrandAurora
  .prog-scroll-device-lift    ← sibling ABOVE sticky-inner (z-index 24)
    .prog-scroll-device-lift__frame  [data-scene=phone|tablet|tv]
      .prog-scroll-phone-col--lifted
        DeviceCarousel3
  .prog-scroll-sticky-inner
    headline
    .prog-scroll-layout
      .prog-scroll-phone-col--spacer
      .prog-scroll-copy-col
```

**TV breakout** (`data-scene="tv"`):

- `.prog-scroll-phone-col--lifted` → `position: relative; inset: auto` (stays in left column, doesn't absolute-takeover)
- `.prog-device-slot--tv` → `width: min(112%, 52rem); max-height: min(84dvh, 100%)`
- Fixes canvas framebuffer crop while keeping copy text aligned

### `DeviceCarousel3`

- Phase `0|1|2` = phone | tablet | tv  
- Spring: `stiffness: 160, damping: 28, mass: 0.95`  
- Opacity: `1 − dist × 1.15`  
- **One WebGL device at a time** — inactive slots = `null` (no CssPhone/Tablet/Tv stand-ins)  
- No CSS `scale` / `filter:blur` on WebGL wrappers  
- Carousel wrapper: `overflow: visible`

### Degradation

| Condition | Behaviour |
| --- | --- |
| `<1024` or reduced-motion | Mobile section, same `deviceScreens` |
| Desktop lite / `?lite=1` | Flat GLB on phone · tablet · TV (no CSS chassis) |
| High tier | Perspective GLB + drag |

`DeviceLoadStage`: `placeholder={null}`, `instant` — reveal after mesh double-rAF.

---

## 6. Devices — live constants

### Optical slots (CSS)

| Slot | Width | Aspect | Max height |
| --- | --- | --- | --- |
| Phone | `min(48%, 21.5rem)` | 9 / 19.5 | ~82dvh |
| Tablet | `min(74%, 26rem)` | 3 / 4 | ~72dvh |
| TV (idle) | `min(118%, 52rem)` | 16 / 11 | `min(84dvh, 100%)` |
| TV (`data-scene=tv`) | `min(112%, 52rem)` | 16 / 11 | `min(84dvh, 100%)` |

### Phone3D

| | |
| --- | --- |
| File | `src/components/solutions/Phone3D.tsx` |
| Growth / Infra | `/phones/deep-blue.glb` · `/phones/orange.glb` |
| Default REST | `REST_Y ≈ 0.36`, `REST_X ≈ -0.08` |
| **Rich pose** | `rotY = 0.12` (~6.87°), `rotX = -0.05` (~−2.86°) |
| Rich glass | Dark material + HTML overlay (not VideoTexture) |

### `.phone-rich-on-glb` (current — post-Antigravity tweak)

```css
height: 80%;           /* inset so chassis bezel reads on all sides */
width: auto;
aspect-ratio: 9 / 19.45;
left: 50%; top: 50%;
transform: perspective(1200px)
  translate(-50%, -50%)
  rotateX(-2.86deg) rotateY(6.87deg)
  translateZ(8px);
border-radius: clamp(1.4rem, 2.8vw, 1.9rem);
```

**Critical:** `perspective` lives **only** on the overlay.  
`.phone-glb-stage { perspective: none !important; }` — parent perspective sinks the WebGL canvas.

Committed Antigravity values were `height: 87%` / `translate(-50%, -50.5%)` / larger radius; working tree inset further to `80%` / `-50%`.

### ING HTML (`public/rich-media-ad.html`)

Compressed so video + brand + CTA fit without inner scroll:

| Element | Size |
| --- | --- |
| Headline | `18px` |
| Shredder wrap | `190×168` |
| Machine | `122×134` |

### Tablet3D

| | |
| --- | --- |
| Model | `Tablet3DModel.tsx` → `/channels/oem/tablet.glb` |
| Glass / content plane | `size × 0.94` / `0.955` |
| Maps | CanvasTexture via `tabletGlassAnim` for all three OEM ids |

Pre-install source: `public/channels/oem/pre-install-oobe.html` (`?bake=1` densifies for 3:4).

### Tv3D

| | |
| --- | --- |
| GLB | `/channels/oem/tv.glb` (+ Draco wasm) |
| `getTargetHeight()` | `min(2.2, 1.95 × aspect)` |
| Screen plane | `w = h×(16/9)×0.94`, `h = h×0.88`, `y=0.012`, `z=0.1` |
| Camera | `[0, 0.04, flat ? 5.2 : 5.75]`, fov `30|31` |
| Mesh lift | `position.y ≈ 0.14` |
| Drag limits | yaw ±0.18, pitch ±0.08 |
| Hidden | legs + stock crystal (`Object_1`, …) — ad on **outer** plane |

Do **not** push camera inside ~3.8–4.2 — plane fills frustum and Plastic disappears.

---

## 7. Theme

| Mode | Phone chassis | Paper |
| --- | --- | --- |
| Growth | deep-blue GLB | Light |
| Infrastructure | orange GLB | Dark `#06090e` |

---

## 8. Preload

- On `/channels`, do **not** wait for Everest  
- OEM & CTV lane: warm **both** tablet + TV early (`tv.glb` is heavy)  
- Phone: `preloadPhone3DAssets(mode)`

---

## 9. Public assets checklist

```
public/phones/{deep-blue,orange}.glb
public/channels/oem/{tablet,tv}.glb
public/channels/oem/screens/{pre-install-oobe,oem-store,system-ui,ctv-spot}.{png,mp4}
public/channels/oem/{pre-install-oobe,oem-store}.html
public/channels/programmatic-refs/screens/{banner,native,interstitial,rich-media,video}.png
public/channels/programmatic-feed/formats/{rich,video}.mp4
public/rich-media-ad.html
public/ing-ad-15s.mp4
public/draco/gltf/draco_decoder.wasm
```

Missing files → Vite serves `index.html` as the “asset” → empty glass. Restore via `scripts/restore-assets.sh` / `git restore`.

---

## 10. Do not

1. Mount Formats 3D on home  
2. Flat CSS phone for Rich on desktop  
3. `perspective` on `.phone-glb-stage` (kills WebGL)  
4. Fixed `%` width on `.phone-rich-on-glb` (use height + `aspect-ratio`)  
5. Concurrent phone+tablet+TV WebGL canvases  
6. CssPhone / CssTablet / CssTv as load stand-ins (big→small snap)  
7. CSS `scale` / `blur` on WebGL wrappers  
8. Camera Z ≲ 4.5 on TV (chassis vanishes)  
9. Stretch OEM PNGs — keep **900×1200** cover crops  
10. Re-enable System UI notif settle without re-measuring `SYS.notif` on the current PNG  
11. Second glass feed outside `deviceScreens.ts`

---

## 11. Sanity checklist

- [ ] App Growth: Banner → Native → Interstitial → **Rich = GLB + working Open ING** (no inner scroll) → Video motion  
- [ ] Rich overlay tracks glass at mild yaw; chassis bezel readable (`height ~80%`)  
- [ ] Lane tumbler App Growth ↔ OEM & CTV  
- [ ] Pre-install: Revolut clean, no caret lines  
- [ ] OEM Store: dense icons + dock, CanvasTexture path, no stretch  
- [ ] System UI: no black seam across sushi  
- [ ] CTV Spot still / CTV Video loop; **Plastic bezel + stand visible**; TV larger than tablet  
- [ ] `data-scene=tv` absolute breakout — no canvas corner crop  
- [ ] Mobile `<1024` + `?lite=1` still work  
- [ ] Growth / Infra chassis swap  
- [ ] `npm run build` clean  

---

## 12. Code map

```
ChannelsPage
 └─ useRoutesLane
 └─ ProgrammaticScrollSection
     ├─ .prog-scroll-device-lift [data-scene]
     │   └─ DeviceCarousel3
     │       ├─ Phone3D + .phone-rich-on-glb
     │       ├─ Tablet3D → Tablet3DModel + tabletGlassAnim
     │       └─ Tv3D
     └─ FormatCopy + RoutesLaneSwitcher

deviceScreens.ts          glass paths
ProgrammaticFormats.ts    copy + scene
tabletGlassAnim.ts        OEM painters + isAnimatedTabletGlass
phone-css-3d.css          rich overlay + no stage perspective
programmatic-scroll-section.css  slots + TV breakout
rich-media-ad.html        ING unit (compressed)
```

---

## 13. Recent change log (Formats only)

| When | What |
| --- | --- |
| **11 Sep — `dc8f65a` (Antigravity)** | Rich overlay height/center/radius; ING HTML compress; tablet slot `74%/72dvh`; **TV `data-scene` absolute breakout** (`95%/70rem`, `80dvh`) |
| **13 Sep — Antigravity V2** | Fixed Canvas clock phase desync (t = performance.now()), removed TV 2-second spring delay (instant), added aggressive App.tsx preload for Tv3D/Tablet3D, removed TV CSS clip (overflow: visible), fixed video pause state mutation bug when switching to ctv-spot. |
| **9–10 Sep** | CanvasTexture for oem-store; System UI settle-in disabled; TV camera pullback + screen plane lip; device-lift sibling |

---

## 14. Optional polish

- Fine-tune Rich `height` (78–87%) if bezel vs glass gap feels off on a specific viewport  
- Re-bake `system-ui.png` smaller in Figma if QS tiles read too large  
- Re-enable notif settle only after measuring card box on the exported PNG  

---

*Prefer this file + the listed sources over MASTER §10/§25 when they disagree, then update MASTER.*
