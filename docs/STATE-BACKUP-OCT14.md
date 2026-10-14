# UPRAISER PROJECT STATE BACKUP
**Date:** October 14, 2026
**Commit:** HEAD / `main`
**Tag:** `v1.2.5-locale-menu-full-height`

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

---

## 2. Verification Status
- `npx tsc -b`: 0 errors.
- `npm run build`: built in 3.78s with zero errors.
- Live measurements confirmed identical pixel sizes: Phone $175\times 380$, Tablet $346\times 461$, TV $576\times 324$.
- Viewport check: $1536\text{px}$ width, horizontal overflow: NO.
- Clipping check: 3D Tablet and 3D Phone fully unclipped across all formats and hover tilt angles.
- Both dev servers running: `http://localhost:5173/` (Mac) and `http://localhost:5174/` (Windows).
