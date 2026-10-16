# UPRAISER PROJECT STATE BACKUP
**Date:** October 16, 2026
**Commit:** HEAD / `main`

---

## 1. Summary of Completed Deliverables (October 16, 2026)

### A. Windows 125% DPI & LTSC System Accessibility Fixes
- **Static Vector Fallback for Reduced-Motion:** Resolved an issue where Windows LTSC machines with `prefers-reduced-motion` enabled completely hid the SVG graphs in the **Clarity** and **Parity** sections. Instead of collapsing animations to invisible paths, the graphs now render in a fully visible, static state (`strokeDashoffset: 0`).
- **Ghost Bubble Ambient Float:** Fixed floating bubble ambient motion on Windows so stat figures levitate with smooth continuous movement.

### B. Discrete Mouse Wheel 1-Format Stepping in Routes (`/channels`)
- **Discrete Wheel vs. Touchpad Separation:** Updated [`src/hooks/useFormatScrollSection.ts`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/hooks/useFormatScrollSection.ts):
  - Discrete physical mouse wheel ticks (`absY >= 15 && absX === 0`, including Windows 125% DPI `deltaY = 96`) advance exactly **1 format per scroll gesture** (`jumpTo(nextIdx, { duration: 0.46 })`) with a debounce lock.
  - Touchpad gesture streams (`absX > 0 || absY < 15`) preserve native momentum and smooth inertia scrolling.
- **Channels Loader Fast-Dismiss:** Updated [`src/components/ChannelsLoader.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/ChannelsLoader.tsx) to auto-dismiss after 400ms when Three.js `useProgress()` is idle (`!active`), preventing a 5-second loading stall on Windows Lite/CSS fallback mode.

### C. Enlarged Device Screen Preview Modal in Routes
- **Tap-to-Enlarge:** Added [`src/components/solutions/RoutesDeviceModal.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/solutions/RoutesDeviceModal.tsx) wired into Phone, Tablet, and TV stages across both 3D WebGL and CSS chassis.
- **Aspect Ratio Fidelity:** Renders enlarged device views preserving true physical ratios:
  - Phone: `9 / 19.5`
  - Tablet: `3 / 4`
  - TV: `16 / 9`
- Includes backdrop blur, keyboard `Esc` listener, and click-outside dismiss.

### D. Mac 3D iPhone Screen Material Glass Fix
- **Front Glass Opacity Fix:** In [`src/components/solutions/Phone3D.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/solutions/Phone3D.tsx), `PaletteMaterial002` (front cover glass layer over `17ProMax_Screen`) is now correctly configured as thin transparent glass (`opacity: 0.06, depthWrite: false`) rather than an opaque gray blocker, restoring phone screen textures on macOS Apple Metal/WebGL.

### E. Hero Stat Captions Red-Orange Light Theme Color
- Replaced the high-saturation crimson `--logo-red` (`#ff003b`) with warm **красно-оранжевый** (`#e4450b` / `rgb(228, 69, 11)`) from the reference palette:
  - Added token `--hero-light-stat-label: #e4450b;` in [`src/index.css`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/index.css#L126).
  - Applied to [`.hero-stat-ghost__label`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/styles/typography.css#L259-L264) and [`.hero-fly-label`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/styles/hero.css#L302-L307).
  - Stat labels now provide crisp, natural contrast across both dark rock and white snow backgrounds.

### F. Zero-Division (`NaN%`) Fix in Stat Counter
- **Root Cause:** When stats were revealed via user scroll (`videoDriven = false`), `Hero.tsx` set `durationRef.current.val = 0`. On Windows machines where `requestAnimationFrame(tick)` executed on the same system timer tick (`now === start`), `(now - start) / duration` evaluated to `0 / 0 = NaN`. Because `NaN < 1` is `false`, the rAF loop halted immediately and froze `"NaN%"` on screen for `POST-FLIGHT LOG DRIFT` (`0%`).
- **Remediation:**
  - In [`src/hooks/useCountUp.ts`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/hooks/useCountUp.ts): immediately returns raw text if `duration <= 0` or `parsed.end === 0`.
  - Guarded progress computation against non-finite values and division by zero.
  - Added safe numeric fallbacks in `formatValue`.
  - In [`src/components/Hero.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/Hero.tsx#L84), added finite duration check `Number.isFinite(v.duration) && v.duration > 0`.

### G. Lenovo Trust Strip Dark Theme Contrast
- Added `.lenovo-copy-text` with `dark:text-white` in [`src/components/LenovoTrustStrip.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/LenovoTrustStrip.tsx#L60-L64) and rule `[data-theme="dark"] .lenovo-copy-text { color: #ffffff !important; opacity: 0.95; }` in [`src/styles/hero.css`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/styles/hero.css#L246-L250).
- Delivers clean, high-contrast white text against the dark bottom dock.

### H. Low-End Mobile GPU Classification (GeForce MX / GT) to Lite Tier
- In [`src/hooks/useHardwareTier.ts`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/hooks/useHardwareTier.ts), filtered out entry-level low-power mobile discrete GPUs (`geforce mx`, `mx110–mx450`, `gt 710–1030`, `920m–940m`) so office laptops (e.g. ASUS VivoBook with i5-8250U + GeForce MX130) correctly receive `tier = "lite"`, rendering the optimized 2D CSS Phone instead of heavy WebGL.

### I. 3D iPhone Titanium Chassis Lighting & PBR Material Sculpting
- In [`src/components/solutions/Phone3D.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/solutions/Phone3D.tsx):
  - Added left, right, and bottom rim lights (`intensity: 2.2 / 1.4`) and `hemisphereLight` to sculpt the phone's physical form against dark backgrounds.
  - Rebalanced titanium chassis material to `metalness: 0.45`, `roughness: 0.34`, and `envMapIntensity: 1.6` so the phone body renders as polished natural titanium with crisp physical bevels rather than an invisible black silhouette.

### J. Native Ad Creative Safe Area & Status Bar Composition
- In [`public/channels/programmatic-refs/screens/native.png`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/public/channels/programmatic-refs/screens/native.png):
  - Added authentic iOS status bar (clock `15:56`, cellular, wifi, battery icons) on `#ffffff` background, shifting the Reddit header ("Popular" and back arrow `<`) down below the Dynamic Island.
  - Provided clean horizontal safe area margins and bottom iOS Home Indicator bar so Reddit content, Kalshi chart, and action buttons are never clipped by the phone's curved screen corners.

### K. Removal of Persistent Yellow Focus Frame on Modal Dismiss
- In [`src/styles/programmatic-scroll-section.css`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/styles/programmatic-scroll-section.css#L1504-L1513):
  - Replaced `.prog-device-slot--interactive:focus-visible` yellow outline with `outline: none !important; box-shadow: none !important;`.
- In [`src/components/solutions/RoutesDeviceModal.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/solutions/RoutesDeviceModal.tsx#L40-L46):
  - Added active element blurring on modal close (`document.activeElement.blur()`), ensuring no residual selection box remains on macOS or Windows upon closing.

### L. Footer Navigation Alignment to "Creative Studio" & Mobile "Craft" Prerogative
- In [`src/data/liveContent.ts`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/data/liveContent.ts#L24-L320), updated `footerLinks.explore` and `navLinks` from `"The Craft"` to **`"Creative Studio"`** (`/craft`), ensuring the footer renders `<a class="footer-link" href="/craft" data-discover="true">Creative Studio</a>` in alignment with the desktop header.
- In [`src/data/pageMeta.ts`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/data/pageMeta.ts#L26), updated page title to `"Creative Studio | UPRAISER"`.
- Preserved the compact **`"Craft"`** moniker on mobile phone header islands ([`src/components/HeaderIsland.tsx`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/components/HeaderIsland.tsx#L63)), maintaining crisp layout fit on 360–390px screens.

### M. Infrastructure Telemetry Chart Vertical Alignment in "WHO WE SERVE"
- In [`src/styles/charts.css`](file:///Users/homeboylebz/Downloads/%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A1%D0%90%D0%99%D0%A2%20UPRAISER/src/styles/charts.css#L944-L951), lifted `.fraud-linear-chart__content` on desktop (`@media (min-width: 1024px)`) with `transform: translate(-158px, -44px)` and tightened `gap: 66px`.
- **Visual Parity:** The top telemetry bar (`SYS_ERR_01 BOTS & FARMS ELIMINATED`) now aligns directly with the lead copy (*"When Your MMP and media bills diverge, we rebuild Your data pipelines."*), and the bottom metric (`18.5% RECOVERED SPEND`) sits comfortably above the section boundary.

