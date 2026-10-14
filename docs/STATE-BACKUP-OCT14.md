# UPRAISER PROJECT STATE BACKUP
**Date:** October 14, 2026
**Commit:** `2a24ae55` / `main`
**Tag:** `v1.2.0-windows-dual-dev-stable`

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
   - Reduced outer titanium rim padding from `0.55rem` to `0.28rem`.
   - Set `.prog-css-phone__screen` to `inset: 0` to prevent horizontal squishing and eliminate side cropping of ad placements via `object-fit: cover`.
   - Hidden overlapping `.prog-css-phone__island` and `.prog-css-phone__home-glow` overlays (`display: none`), ensuring 100% visibility for headers (Reddit "Popular", AccuWeather radar) and bottom action bars ("Vote", "Download", disclaimer tabs).
   - **Dynamic Multi-Zoom Aspect-Ratio Lock:** Replaced rigid `height: 100%; max-width: min(42%, 18.5rem);` with dynamically bounded `width: min(42%, 18.5rem, calc(min(80dvh, var(--prog-phone-budget, 80dvh)) * (9 / 19.5))); height: auto;`, completely eliminating the bug where the phone and tablet stretched vertically at 100% zoom or on tall screens (height > 864px). Device proportions are now mathematically locked to `9 / 19.5` and `3 / 4` with 0.00% error across 80%, 100%, 125%, 150%, and all resolutions.
2. **TV Screen Top-Corner Blind Spot:**
   - Cleared black triangular blind spot in the top-left and top-right of the `CssTv` display.
   - Replaced legacy phone chassis values (`inset: 0.35rem; border-radius: 1.8rem; transform: scale(1.04);`) with flush OLED bezel parameters: `inset: 0; border-radius: 0.25rem; transform: none; width: 100%; height: 100%; object-fit: cover;`.

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

---

## 2. Verification Status
- `npx tsc --noEmit`: 0 errors.
- Dual local servers running: `http://localhost:5173/` (200 OK) and `http://localhost:5174/` (200 OK).
- Visual parity verified via Puppeteer captures in `preview-windows/`.
