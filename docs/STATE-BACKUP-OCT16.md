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
