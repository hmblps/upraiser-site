# The Routes — Every Format. One Supply Path.

> **Section anchor:** `/#routes`  
> **Label in nav / footer:** *The Routes*  
> **Section headline:** *Every Format. One Supply Path.*  
> **Updated:** 28 August 2026  
> **Copy SOT:** `src/components/solutions/ProgrammaticFormats.ts`  
> **Wiring SOT:** `src/components/solutions/ProgrammaticScrollSection.tsx`

---

## 1. Purpose & Position

The Routes is the central **product proof** section of the Basecamp (home page).  
It sits between the Process section and The Peaks (case studies) in the scroll order:

```
#hero → PartnersCarousel → #audience → Process → #routes → #cases → #promise → #pilot
```

**Job:** Show every ad format UPRAISER buys, with an interactive 3D device mockup + live format copy, so an advertiser can see exactly what they're buying and how it's measured — without a PDF or a sales call.

**Tone:** Operator proof. Not a feature list. Each format has a tagline, one-sentence operator description, and three infrastructure-grade bullet points (measurement trail, fraud screen, reconciliation file).

---

## 2. Two Lanes

The section is divided by a **lane switcher** (Dynamic Island–style pill tabs):

| Lane | ID | Copy label | 3D device | Formats |
|---|---|---|---|---|
| **App Growth** | `app-growth` | App Growth | Phone (iPhone GLB) | 5 programmatic formats |
| **OEM & CTV** | `oem-ctv` | OEM & CTV | Tablet (iPad GLB) + TV (custom GLB) | 5 OEM/CTV formats |

Switching lanes slides the device carousel and cross-fades the format copy with a horizontal slide animation (matching the carousel direction).

---

## 3. Lane 1 — App Growth

**Section label:** `Tools for Altitude`  
**Source file:** `src/components/solutions/ProgrammaticFormats.ts` → `AD_FORMATS`  
**3D device:** iPhone (Phone3D) — scene key `"phone"`

### Formats

| # | ID | Label | Tagline | Device |
|---|---|---|---|---|
| 1 | `banner` | Banner | Scale inside 100K+ apps | Phone |
| 2 | `native` | Native | Intent-matched, not interruptive | Phone |
| 3 | `interstitial` | Interstitial | Full-screen impact at natural breaks | Phone |
| 4 | `rich` | Rich Media | Interactive formats that earn attention | Phone |
| 5 | `video` | Video | Rewarded and skippable | Phone |

#### Format detail

**Banner**
- In-app banners bought on behavioral signals.
- Supply: 100K+ app graph with behavioral bid signals
- Fraud: Pre-bid fraud screen before auction close
- Measurement: Caps wired to MMP events: FTD, reg, subscription

**Native**
- Feed-integrated units matched to app design; intent primed at session depth.
- Supply: Feed-integrated units matched to app design
- Targeting: Session-depth and engagement-peak targeting
- Attribution: CPC / CPM with MMP conversion attribution

**Interstitial**
- Full-screen at natural breaks (level load, article end, checkout).
- Timing: Natural-break timing, not random interrupts
- Quality: Placement quality scored before bid
- Frequency: Device-level frequency caps

**Rich Media**
- Expandable and playable units; 3–5× engagement vs standard display.
- Formats: Expandable, animated, and playable units
- Engagement: 3–5× vs standard display
- Safety: Whitelist-only, MRAID-compliant supply

**Video**
- Rewarded and skippable video under one bid strategy.
- Rewarded: opt-in, near-100% completion
- Skippable: pre-roll with quality controls
- Attribution: Shared MMP attribution across both types

---

## 4. Lane 2 — OEM & CTV

**Section label:** `OEM & CTV`  
**Source file:** `src/components/solutions/ProgrammaticFormats.ts` → `OEM_CTV_FORMATS`  
**3D devices:** Tablet (iPad GLB) for OEM formats; TV (custom GLB) for CTV formats

### Formats

| # | ID | Label | Tagline | Device | scene key |
|---|---|---|---|---|---|
| 1 | `pre-install` | Pre-install | On-device before the store | Tablet | `"tablet"` |
| 2 | `oem-store` | OEM Store | Lenovo and partner storefronts | Tablet | `"tablet"` |
| 3 | `system-ui` | System UI | OS-level moments that convert | Tablet | `"tablet"` |
| 4 | `ctv-spot` | CTV Spot | Living-room scale, measured | TV | `"tv"` |
| 5 | `ctv-video` | CTV Video | Long-form attention, short proof path | TV | `"tv"` |

#### Format detail

**Pre-install** *(scene: tablet)*
- OEM placements at unboxing / first boot. Install trails that survive procurement.
- Inventory: Factory / first-boot placement
- Trail: Install and activation postback trails
- Reconciliation: Finance-readable reconciliation file

**OEM Store** *(scene: tablet)*
- Featured slots inside OEM app stores (Lenovo + partners). Intent already high.
- Supply: Partner storefront featured slots
- Fraud: Pre-bid filtration on every clear
- Attribution: MMP-aligned activation events

**System UI** *(scene: tablet)*
- OS-level surfaces at natural device moments (setup complete, update done).
- Timing: Natural OS transition timing
- Control: Device-level frequency control
- Safety: Brand-safe whitelist inventory

**CTV Spot** *(scene: tv)*
- Connected TV spots with household reach and post-flight proof.
- Supply: Premium CTV publisher whitelist
- Reach: Household reach with frequency caps
- File: Post-flight file for finance review

**CTV Video** *(scene: tv)*
- Long-form CTV video bought to the same outcome stack as OEM.
- Controls: Completion and viewability controls
- Taxonomy: Shared outcome taxonomy with OEM
- Finance: One finance-readable reconciliation file

---

## 5. 3D Device Carousel

The left column of the sticky section shows a **spatial 3-device carousel**:  
Phone (slot 0) · Tablet (slot 1) · TV (slot 2)

### Component

`DeviceCarousel3` — defined in `ProgrammaticScrollSection.tsx`

### Switching mechanic

1. Active format's `scene` field (`"phone"` | `"tablet"` | `"tv"`) maps to a slot index (0 / 1 / 2).
2. A Framer Motion spring drives `phase` (MotionValue) toward the target slot.
3. Each device is a `motion.div` with `x: (slotIndex - phase) * 100%` and `opacity` fade.
4. Devices slide in/out horizontally — Emil Kowalski's spatial consistency principle: horizontal tabs → horizontal device switch.
5. No CSS `scale` or `filter:blur` on WebGL canvases (causes bilinear-to-native pixel snap artifact).

### Spring parameters

```ts
{ stiffness: 340, damping: 32, mass: 0.6 }
```

### Per-device sizing

| Device | Column width | Camera | Notes |
|---|---|---|---|
| Phone | 62% of left col | default Phone3D camera | Narrow stage communicates "small device" |
| Tablet | 85% of left col | fov 30, z=3.8 | Mid-size |
| TV | 100% of left col | fov 34, z=5.5 | Fills stage; TARGET_HEIGHT 1.91 scene units |

---

## 6. Phone3D

**File:** `src/components/solutions/Phone3D.tsx`  
**GLBs:** `/phones/deep-blue.glb` (light/growth) · `/phones/orange.glb` (dark/infra)  
**Chassis:** iPhone with Dynamic Island, draggable

### Entrance animation

Scroll-driven 3-phase:
1. **Macro flyover** — phone rises from below
2. **Lift & rotate** — yaw/pitch to "presentation" angle
3. **Lock** — settles face-forward, slight Y tilt (REST_Y 0.07 rad, REST_X −0.04 rad)

### Drag interaction

| Parameter | Value |
|---|---|
| Y limit | ±0.45 rad |
| X limit | ±0.15 rad |
| Sensitivity (Y) | dx × 0.006 |
| Sensitivity (X) | dy × 0.004 |
| Spring | stiffness 260, damping 30, mass 0.7 |
| Release snap | 35% toward REST position |

### Screen glass

- **Still:** `public/channels/programmatic-refs/screens/{format}.png` — instant, no Suspense
- **Video:** `public/channels/programmatic-feed/formats/{format}.mp4` — promoted when `readyState >= HAVE_CURRENT_DATA`
- No Suspense remount between still and video (prevents white flash)

---

## 7. Tablet3D

**File:** `src/components/channel-visuals/Tablet3D.tsx`  
**GLB:** `/channels/oem/tablet.glb` (Draco-compressed)  
**Model:** iPad — uses `drei/Center` for auto-centering, `rotation={[Math.PI/2, 0, 0]} scale={6.8}`

### Screen glass

- **Still:** `public/channels/oem/screens/{pre-install,oem-store,system-ui}.png`
- **Video:** `public/channels/oem/screens/{pre-install,oem-store,system-ui}.mp4`
- Applied to material named `"glass"` via `traverse()` + `VideoTexture`

### Drag interaction (identical to Phone)

| Parameter | Value |
|---|---|
| Y limit | ±0.45 rad |
| X limit | ±0.15 rad |
| Spring | stiffness 260, damping 30, mass 0.7 |

---

## 8. Tv3D

**File:** `src/components/channel-visuals/Tv3D.tsx`  
**GLB:** `/channels/oem/tv.glb` (29 MB, no legs)  
**Source model:** custom newtv.glb (Sketchfab export, FBX origin, centimeter scale)

### Transform chain

The GLTF hierarchy applies two rotations before reaching Three.js world space:

```
Sketchfab_model  rotation: −90°X (quaternion [−0.7071, 0, 0, 0.7071])
  FBX node       rotation: +180°X (quaternion [1, 0, 0, 0])
    RootNode ← meshes live here
```

Net effect: original model vertex `[x, y, z]` → Three.js `[x−1.053, −z+1.442, y+0.785]`.  
The TV screen faces **−Z** in Three.js (away from camera at +Z) → corrected with `rotation={[0, Math.PI, 0]}` on the scale group.

### Runtime centering

`computeTransform(scene)` runs synchronously in `useState` initializer (before first render):

```ts
scene.updateMatrixWorld(true);
const box = new Box3().setFromObject(scene, /* precise */ true);
const scale = TARGET_HEIGHT / size.y;   // TARGET_HEIGHT = 1.91
const position = [-center.x, -center.y, -center.z];
```

Fallback (if box empty): `{ scale: 0.022, cx: 99.25, cy: −69.52, cz: −2.13 }` — derived from manual Python GLB analysis.

### Leg removal

`Layer 03` (Object_22, 13 918 vertices) and `Layer 05` (440 verts, corner nub) are hidden via `scene.traverse()` + `obj.visible = false` in `useEffect` after mount. Identified as stand geometry because their bounding Y in Three.js world space extends below the TV body minimum (~7%).

### Drag interaction (identical to Phone)

| Parameter | Value |
|---|---|
| Y limit | ±0.45 rad |
| X limit | ±0.15 rad |
| Spring | stiffness 260, damping 30, mass 0.7 |

### Lighting (boosted — TV materials ~4% albedo)

| Light | Growth intensity | Infra intensity |
|---|---|---|
| `ambientLight` | 2.2 | 1.8 |
| `directionalLight` (key) | 3.0 | 2.5 |
| `directionalLight` (fill) | 0.8 | 0.8 |
| `spotLight` | 1.5 | 1.5 |
| `Environment` (city) | 1.3 | 1.0 |

---

## 9. Sticky Scroll Runway

**Hook:** `useFormatScrollSection.ts`  
**Runway height:** `SCROLL_PX_PER_FORMAT × numFormats + INTRO_SCROLL_PX`

| Constant | Value | Purpose |
|---|---|---|
| `SCROLL_PX_PER_FORMAT` | 650 | Scroll pixels per format step |
| `INTRO_SCROLL_PX` | 650 | Extra runway for phone entrance animation |

`activeIndex` is derived from `entranceProgress` (a `MotionValue<number>`) — passed down to `DeviceCarousel3` and `FormatCopy`.

---

## 10. Format Copy & Transitions

**Component:** `FormatCopy.tsx`

### Text animation variants

| Trigger | Direction | Easing |
|---|---|---|
| Scroll (next/prev format within lane) | Vertical — exit ↑, enter ↓ | Spring 220/28/0.85 |
| Lane switch (App Growth ↔ OEM) | Horizontal — matches device slide direction | Spring 220/28/0.85 |

### No-jump guarantee

The lane switcher (`SlideTabs`) is rendered **absolutely** inside `.prog-scroll-copy-col` via `.prog-scroll-copy-tumbler` — **outside** `FormatCopy` and outside `AnimatePresence`. This means it never participates in vertical centering flex layout, so it never jumps when format text height changes.

```css
.prog-scroll-copy-tumbler {
  position: absolute;
  top: clamp(4rem, calc(50% - 12rem), 11rem);
  left: 0.25rem;
}
```

---

## 11. Lane Switcher (SlideTabs)

**Component:** `SlideTabs.tsx`  
**Style:** Dynamic Island — `bg-bg-elevated/70 backdrop-blur-xl rounded-full border border-border/40 shadow-sm`

The pill (`motion.span` with `layoutId`) is a sibling of the button (not a child) — prevents `inline-flex` baseline from nudging its position:

```tsx
<div className="relative">
  {active && <motion.span layoutId="..." className="absolute inset-0 rounded-full bg-accent" />}
  <button ...>{label}</button>
</div>
```

Spring: `{ type: "spring", bounce: 0.15, duration: 0.5 }`

---

## 12. Mobile Version

**Component:** `ProgrammaticScrollSectionMobile.tsx`  
**Trigger:** `< 1024px` viewport width or `prefers-reduced-motion`

- No WebGL — uses `CssPhone` (CSS-rendered chassis) with live HTML feed
- Stacked format cards with tap-to-expand
- Lane switcher in a fixed bottom dock (`prog-mobile-sticky`)
- No sticky scroll runway; native scroll

---

## 13. Key Files

| File | Role |
|---|---|
| `src/components/solutions/ProgrammaticFormats.ts` | **Copy SOT** — all format definitions, scene keys |
| `src/components/solutions/ProgrammaticScrollSection.tsx` | Desktop sticky section + `DeviceCarousel3` |
| `src/components/solutions/ProgrammaticScrollSectionMobile.tsx` | Mobile section |
| `src/components/solutions/Phone3D.tsx` | iPhone 3D scene |
| `src/components/channel-visuals/Tablet3D.tsx` | iPad 3D scene |
| `src/components/channel-visuals/Tv3D.tsx` | TV 3D scene (runtime-centered) |
| `src/components/solutions/FormatCopy.tsx` | Animated format text block |
| `src/components/SlideTabs.tsx` | Dynamic Island lane switcher |
| `src/hooks/useFormatScrollSection.ts` | Sticky scroll + format progress |
| `src/hooks/useRoutesLane.ts` | Lane state + copy resolver |
| `src/styles/programmatic-scroll-section.css` | Sticky layout, all variants |
| `public/phones/deep-blue.glb` | iPhone GLB (light/growth chassis) |
| `public/phones/orange.glb` | iPhone GLB (dark/infra chassis) |
| `public/channels/oem/tablet.glb` | iPad GLB |
| `public/channels/oem/tv.glb` | TV GLB (29 MB, newtv model, no legs) |
| `public/channels/programmatic-feed/formats/*.mp4` | App Growth screen videos |
| `public/channels/oem/screens/*.mp4` | OEM screen videos |
| `public/channels/programmatic-refs/screens/*.png` | App Growth still fallbacks |
| `public/channels/oem/screens/*.png` | OEM still fallbacks |

---

## 14. Do Not

1. **GSAP / ScrollTrigger** on Routes — hook is Lenis-native
2. **Suspense remount** between Still ↔ Video glass — causes white flash
3. **CSS `scale` or `filter:blur`** on WebGL canvas wrappers — causes bilinear→native pixel snap
4. **`ContactShadows`** on Tablet3D or Tv3D — renders white oval artifact on transparent canvas
5. **`key={theme}`** remount on any Canvas — kills WebGL context
6. **Pass a plain `number`** where `MotionValue<number>` is expected for `entranceProgress`
7. **Hide `Layer 06`** on TV model — it's the back panel face (needed for front render after π-Y flip)
8. **Softening format bullets** — they must be infrastructure-grade (measurement trails, fraud screens, reconciliation)

---

## 15. Sanity Checklist

- [ ] Both lanes load without blank glass
- [ ] Phone entrance scroll animation completes before first format is active
- [ ] Switching App Growth → OEM: device slides left, text slides left
- [ ] Switching OEM → App Growth: device slides right, text slides right
- [ ] OEM formats (pre-install, oem-store, system-ui) show Tablet
- [ ] CTV formats (ctv-spot, ctv-video) show TV
- [ ] TV renders face-on (screen visible), no legs
- [ ] Tumbler pill never jumps between format switches
- [ ] Mobile: no WebGL, CSS phone visible, lane switcher in bottom dock
- [ ] `npm run build` passes (no TS errors on `MotionValue` / unused imports)

---

*End of Routes document. Copy changes → `ProgrammaticFormats.ts`. Architecture changes → update this file and `§10` of `UPRAISER-MASTER.md`.*
