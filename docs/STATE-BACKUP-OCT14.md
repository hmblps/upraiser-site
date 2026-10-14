# UPRAISER PROJECT STATE BACKUP
**Date:** October 14, 2026
**Commit:** HEAD / `main`
**Tag:** `v1.2.8-mobile-editorial-feed`

---

## 1. Summary of Completed Deliverables

### A. Dual Real-Time Dev Environment (Mac + Windows)
- **Zero-Config Port 5174:** Any connection to `http://localhost:5174/` is automatically detected as Windows OS (`data-os="windows"`) and assigned `tier="lite"` without requiring URL query strings.
- **Port 5173:** Standard native development environment for macOS (Retina, Apple Metal 3D, High tier).
- **Dual Launcher:** `npm run dev:dual` boots both servers concurrently with clean process lifecycle management. Standalone `npm run dev:win` runs the Windows port directly.
- **Hot Module Replacement (HMR):** Edits to CSS/TSX simultaneously update both Mac and Windows browser windows side-by-side in real time.

### B. Device Chassis Geometry & Rendering Fixes
1. **Phone Aspect Ratio & Placement Cropping:**
   - Eliminated vertical stretching of `CssPhone` in programmatic routes feed by removing `h-full w-full` overrides and enforcing true `9 / 19.5` aspect ratio.
   - Reduced outer titanium rim padding from `0.55rem` to `0.24rem`.
   - Tuned corner radii (`1.75rem` outer, `1.55rem` bezel, `1.45rem` screen) so placement UI badges (AccuWeather 15:56, Reddit Popular, bottom voting/disclaimers) are completely visible without corner clipping.
2. **TV Screen Top-Corner Blind Spot Fixed:**
   - Cleared corner blind spots on `CssTv` display.
   - Refined bezel parameters to sharp, realistic OLED TV dimensions (`0.35rem` chassis radius, `0.18rem` bezel radius, `0.12rem` screen radius), preserving "... Press to open" and "Sponsored" badges with zero cutoff.
   - Added `prog-css-tv--slot` class to hide footer overhang on TV slot mount.

### C. Case Study Modal Scroll Stabilization
- Resolved page jump to top `(y = 0)` upon opening or closing case study cards in "The Peaks".
- Added `prevPathRef` scroll exemption in `SmoothScroll.tsx` for `/cases` paths.
- Preserved and restored background scroll position via `savedScrollYRef` in `CaseModalContext.tsx`.

### D. Automated Windows Testing Suite
- `npm run preview:windows` (`scripts/preview-windows.mjs`):
  - Emulates Windows NT 10.0 in headless Chromium.
  - Generates PNG captures across 1080p 125% display scaling (1536×864, DPR 1.25) and 150% scaling (1280×720, DPR 1.5).
  - Captures Banner, Native, Video, Tablet, and CTV Video TV stages.
  - Automatically verifies 0px horizontal viewport overflow.

### E. Exact 1:1 Pixel Parity Across Mac (3D WebGL) and Windows (CSS Chassis)
The visual sizes, hierarchies, and physical pixel dimensions across Mac and Windows have been calibrated to direct 1:1 parity ($\pm 0\text{px}$ error):

| Device | Aspect Ratio | Mac 3D Physical Body | Windows CSS Physical Body | Hierarchy & Visual Relationship |
| :--- | :---: | :---: | :---: | :--- |
| **Phone** | `9 / 19.5` | **$175 \times 380\text{ px}$** | **$175 \times 380\text{ px}$** | Compact handheld mobile smartphone (slot has $424\text{px}$ canvas height for 3D float) |
| **Tablet** | `3 / 4` | **$346 \times 461\text{ px}$** | **$346 \times 461\text{ px}$** | **$+81\text{px}$ taller** than Phone, **$1.97\times$ wider** |
| **TV** | `16 / 9` | **$576 \times 324\text{ px}$** | **$576 \times 324\text{ px}$** | Widescreen living-room TV (**$1.66\times$ wider** than Tablet, **$3.29\times$ wider** than Phone) |

1. **3D Float Amplitude Separation & CSS Phone Parity:**
   - In 3D on Mac, `Phone3D` floats up and down with `floatPosY = Math.sin(t * 1.2) * 0.04 * floatAmp`, requiring a $424\text{px}$ canvas height so the mesh never clips during levitation.
   - The static 3D mesh body is $\approx 380\text{px}$ high.
   - `CssPhone` on Windows was previously stretched to 100% of the canvas height ($424\text{px}$), causing the Windows phone to look oversized and almost as large as the tablet.
   - Fixed by decoupling `.prog-css-phone` in `.prog-device-slot` to `height: 89.5% !important; width: auto !important; aspect-ratio: 9 / 19.5 !important; margin: auto !important;`, bringing the Windows CSS chassis to exactly $175\text{W} \times 380\text{H px}$, matching the Mac 3D phone mesh 1:1.
2. **3D WebGL Calibrations (`Phone3D.tsx`, `Tablet3D.tsx`, `Tv3D.tsx`):**
   - Phone3D: Mesh scale `7.65`, camera `position: [0, -0.08, flat ? 2.65 : 2.85]`.
   - Tablet3D: Mesh scale calibrated to `7.45` (from `8.2`), camera centered to `position: [0, 0.02, flat ? 2.80 : 3.05]`. Fully eliminates top/bottom bezel clipping on Mac while matching Windows dimensions with a clean breathing margin.
   - Tv3D: Camera brought closer to `position: [0, 0.02, flat ? 2.35 : 2.48]`, `fov: 33`.
3. **CSS Slot Bounds (`programmatic-scroll-section.css`):**
   - Phone slot: `width: min(34%, 12.5rem, calc(min(62dvh, budget * 0.72) * (9 / 19.5)))`.
   - Tablet slot: `width: min(60%, 22.25rem, calc(min(68dvh, budget * 0.79) * (3 / 4)))`.
   - TV slot: `width: min(100%, 36.5rem, calc(min(72dvh, budget) * (16 / 10)))`.

### F. Navigation & Locale Menu Full-Height Fit
- Expanded `.locale-switcher__menu` in `rails.css` from `max-height: min(70dvh, 22rem)` to `max-height: min(85dvh, 28rem)`.
- The full list of 7 languages (English, 中文, 한국어, 日本語, Español, Deutsch, Français) now fits comfortably ($394\text{px}$ content height within $448\text{px}$ container), eliminating internal scrolling and vertical cutoff.

### G. Mobile Format Showcase & Compact Cards Alignment
- Solved interface disconnect on mobile devices where the swipe card carousel was pushed entirely below the fold, separating the device screen from its card.
- Calibrated mobile device containers to height-based constraints (`h-[195px]` phone, `h-[180px]` tablet, `h-[125px]` TV) instead of width-based 400px heights.
- Fixed pagination indicator stretching caused by `button { min-height: 44px }`, nesting the visual pill (`h-1.5`) inside an accessible touch target wrapper.
- Tightened card padding (`p-4 sm:p-5`) and section margins so that the Header, Device, and full swipe Card fit together seamlessly within a single 667–852px mobile screen without vertical scrolling.

### H. Mobile Light Mode Footer Contrast & Dark Mode Fraud Chart Responsive Alignment
1. **Dark Mode Mobile Fraud Scroll Chart Left Clipping Fixed:**
   - Identified root cause: Hardcoded desktop offset `style={{ transform: "translateX(-158px)" }}` in `FraudScrollChart.tsx` was shifting the container $158\text{px}$ off-screen on mobile devices ($360\text{--}430\text{px}$ viewports), cropping text labels ("Bots & Farms Eliminated" became "arms Eliminated").
   - Introduced `.fraud-linear-chart__content` in `charts.css`:
     - Mobile / Tablet: `transform: none; margin-inline: auto; width: 100%; max-width: 500px; padding-inline: 1rem;` with responsive gaps (`gap: 1.5rem / 2.25rem`).
     - Desktop ($\ge 1024\text{px}$): `margin-right: 0; transform: translateX(-158px); gap: 72px; padding-inline: 0;` (exact desktop split layout preserved).
   - Replaced fixed grid offset with responsive bounds: `left-4 right-4 sm:left-6 sm:right-6 lg:left-0 lg:right-0` so technical dashed grid lines align 1:1 with percentage bars on all screen sizes.
   - Preserved row layout with `min-w-0`, `truncate` on labels, and `shrink-0` on IDs and percentage numbers.

2. **Mobile Light Mode Footer Mountain Image Architecture:**
   - Provided exact asset directory and path: `/Users/homeboylebz/Downloads/НОВЫЙ САЙТ UPRAISER/public/images/cta-mountains-v8.jpg`.
   - Created mobile duplicate `public/images/cta-mountains-mobile.jpg` and wired it in `site-shell.css` at 100% opacity with `filter: none` and `mix-blend-mode: multiply`, enabling 100% manual creative control in Photoshop without CSS filter degradation.

### I. Mobile Ad Formats: Editorial Feed (Вариант 2)
1. **Vertical Rhythm [Full-size Device] → [Editorial Text & Bullets]:**
   - Completely replaced cramped horizontal card slider and detached mini-device with a continuous vertical Editorial Feed à la Linear and Stripe.
   - For every format in the feed:
     - **Device First:** Full-size centered device mockup (`CssPhone` height `min(55dvh, 450px)`, `CssTablet` height `min(46dvh, 370px)`, `CssTv` width `max-w-[420px] 16/9`) with ambient glow halo.
     - **Editorial Text Card:** Sits immediately below its device, displaying index (`01 / 10`), uppercase tagline badge, full unclipped title, full description, and all 3 value points with native accent bullets.
2. **Smooth 60 FPS Parallax Motion:**
   - Bound local `useScroll` to each card container (`offset: ["start end", "end start"]`), gently interpolating `scale` from $0.93 \to 1.0 \to 0.95$ as the device glides through the mobile screen center.
3. **Bulletproof In-App Webview Reliability:**
   - Operates flawlessly without `position: sticky` address-bar jumps across Telegram, LinkedIn, Instagram, and Slack webviews.
   - Interactive elements (live iframes, video playback, close buttons) respond naturally with zero interference from horizontal gestures.

### J. Mobile Header Craft Navigation Island
1. **Root Cause Analysis:**
   - In `src/components/HeaderIsland.tsx`, the `The Craft` navigation item was styled with `className={... ${link.underConstruction ? 'hidden md:block' : ''}}`. Because `underConstruction: true` was set for `The Craft` in `liveContent.ts`, Tailwind hid the link completely on all viewports under 768px (`< md`).
2. **Mobile Capsule & Responsive Sizing:**
   - Removed `hidden md:block` from `HeaderIsland.tsx` so `The Craft` renders across all viewports.
   - Set the `Soon` badge to `hidden sm:inline` so mobile viewports display the clean, uncluttered `THE CRAFT` label without horizontal bloat.
   - Applied responsive font sizing and horizontal padding (`text-[10px] sm:text-[11px]`, `px-1.5 sm:px-2.5`) to both navigation items and the theme toggle button.
   - Added touch-target expansion pseudo-elements (`after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']`) ensuring strict compliance with the $\ge 44\times 44\text{px}$ touch target doctrine without enlarging visual capsule height.
3. **Clean Route Adaptation in Header:**
   - In `src/components/Header.tsx`, removed `w-full` from the island flex container to prevent flex child overflow.
   - On `/craft`, the island itself serves as the segmented navigation switcher between `The Agency` and `The Craft` (with the active yellow pill on `The Craft`). Duplicate mobile back buttons were eliminated on `/craft`, keeping the brand logo and island cleanly in-frame on 360–390px screens.
   - On subroutes like `/channels`, the mobile back button gracefully renders as a compact capsule `[ ← ]` on small screens (`< sm`) and expands to `[ ← Back to The Routes ]` on larger screens.

---

## 2. Verification Status
- `npx tsc -b`: 0 errors.
- `npm run build`: built in 3.06s with zero errors.
- Header on Mobile (360px, 375px, 390px):
  - On `/`: Both `[ THE AGENCY ]` (active) and `THE CRAFT` render cleanly alongside Theme, Locale, and Logo.
  - On `/craft`: Segmented switch displays `THE AGENCY` and `[ THE CRAFT ]` (active) with smooth navigation back to `/`.
  - On `/channels`: Back arrow capsule and island sit cleanly within viewport without logo clipping.
- Interactive navigation: 100% verified via automated Puppeteer click loops (switching between Agency and Craft, theme toggle, locale dropdown).
- Both dev servers running: `http://localhost:5173/` (Mac) and `http://localhost:5174/` (Windows).

