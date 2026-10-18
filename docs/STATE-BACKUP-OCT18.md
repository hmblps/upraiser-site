# UPRAISER PROJECT STATE BACKUP
**Date:** October 18, 2026
**Commit:** HEAD / `main`

---

## 1. Summary of Completed Deliverables (October 17–18, 2026)

### A. Cross-Platform WebGL, Memory & Runtime Performance Hardening
- **WebGL Context Loss & VRAM Disposal (`Phone3D.tsx`, `Tablet3D.tsx`, `Tv3D.tsx`):**
  - Attached `webglcontextlost` (with `event.preventDefault()`) and `webglcontextrestored` listeners on all Three.js `<Canvas>` instances so Windows ANGLE / D3D11 drivers recover gracefully without blank screen freezes.
  - Added deterministic unmount cleanup (`texture.dispose()`, `video.pause()`, `video.removeAttribute("src")`, `video.load()`) for video and image textures across all 3D device scenes.
- **Frame-Rate Independent Smoothing (`tabletGlassAnim.ts`):**
  - Replaced raw `delta * speed` interpolation with exponential decay `1 - Math.exp(-speed * dt)` so 3D glass/tilt animations behave identically at 30Hz, 60Hz, 144Hz, and 240Hz.
- **Offscreen Canvas & Video Lifecycle Gating (`GlobalSnowfall.tsx`, `CreativeStudioVideo.tsx`, `HeroVideoFallback.tsx`, `GradientTraceBorder.tsx`):**
  - Wired `IntersectionObserver` and `document.visibilitychange` listeners to pause `requestAnimationFrame` loops and `<video>` playback when scrolled offscreen or when the browser tab is backgrounded.
- **Code-Splitting & Lite-Tier Asset Gating (`HomePage.tsx`, `scrollPreload.ts`):**
  - Removed eager barrel import of `FoldChart` from `HomePage.tsx` so `ModeChart.tsx` loads strictly as an async chunk.
  - Gated 3D GLB/WebGL preloading in `scrollPreload.ts` behind `getHardwareTier() === "full"` so Lite-tier Windows notebooks never download unused 3D models.

### B. Windows DPI Scaling (125% / 150%), Viewport Route & CSS Hardening
- **Short Viewport Overflow Protection (`useViewportRoute.ts`, `index.css`):**
  - Added height check (`window.innerHeight >= 700`) in `useViewportRoute.ts` and `@media (max-height: 700px)` rules in `index.css` so Windows laptops at 150% DPI scaling (`1280×720` CSS viewport, ~600–640px browser height) or `1366×768` screens allow natural vertical scrolling on `/craft` and `/contact` instead of clipping content inside `100dvh`.
- **Responsive Telemetry Chart Offset (`charts.css`):**
  - Replaced fixed `transform: translate(-158px, -44px)` on `.fraud-linear-chart__content` with `transform: translate(clamp(-158px, -10vw, -24px), -44px)`, preventing horizontal collision with left copy on `1024px–1366px` viewports.
- **Eliminated Horizontal Seam Under Clients (`hero.css`):**
  - Removed `#audience.section-band::before` gradient pseudo-element in `src/styles/hero.css`, creating a clean transition between "Our Clients" (`LenovoTrustStrip`) and "Who We Serve" (`#audience`).

### C. 2D Lite CSS Devices Chassis & Strict Flat 2D Rendering (`/channels`)
- **Flat 2D Device Enforcement (`CssPhone.tsx`):**
  - Removed `useCssDrag()` (`perspective: 1200`, `rotateX/Y` tilt) from `src/components/solutions/CssPhone.tsx` so Lite-tier devices (`CssPhone`, `CssTablet`, `CssTv`) render as crisp, flat 2D mockups with zero 3D tilt distortion.
- **Visible Chassis Bezel in Dark & Light Themes (`programmatic-scroll-section.css`):**
  - Added `.prog-css-phone--orange` and metallic bezel/button rules in `src/styles/programmatic-scroll-section.css` so all 2D devices (`CssPhone`, `CssTablet`, `CssTv`) display a distinct physical frame in both Dark and Light modes.
- **Hardware Tier Detection (`useHardwareTier.ts`):**
  - Added Firefox `privacy.resistFingerprinting` masked-renderer detection (`GTX 980 / R9 200` on `<= 8` cores -> `"lite"`), entry-level mobile discrete GPU filtering (`GeForce MX`, `MX110–MX450`, `GT 710–1030`, `920M–940M` -> `"lite"`), and port `:5174` Lite-tier preview binding.

### D. Copywriting, Case Studies, Contact Form & 8-Locale i18n Synchronization
- **Case Studies (`src/data/cases.ts`, `src/data/performanceData.ts`, `src/components/CaseStudies.tsx`):**
  - **Section Subtitle:** *"View from the top: High-impact outcomes from live flights — tap any card for the full story."*
  - **Fanatics:** `$15M+` (`Lifetime Revenue`), `30K` (`FTDs`), `800K` (`Installs`); approach: *"Whitelisted age-gated inventory with sub-second latency limits, state-level targeting, and creative QA tied directly to FTD payload instead of install volume."*; result: *"800K installs, 30K FTDs, $15M+ lifetime revenue. An average of seven additional bets per bettor."*
  - **Block Blast:** Updated Day-7 retention metric and narrative to `37%`.
  - **Fiverr:** Updated `kpiEvent` to `>1% of installs to FTB's`.
  - **Banco Azteca:** Updated `paymentModel` to `CPA`.
  - **Azar:** Updated `kpiEvent` to `Sales & Video Chats participation` and `paymentModel` to `CPR`.
- **Our Commitment (`src/data/liveContent.ts`):**
  - Updated closing sentence to *"...giving you the absolute confidence to scale budgets extensively with complete peace of mind regarding hidden markups or invisible fraud."*
- **Home Pilot CTA (`src/components/HomePilotCta.tsx`):**
  - Updated copy to *"Brief the route: vertical, GEO, KPI event — we map Your exact route to profit."*
- **Contact Form (`src/components/Contact.tsx`):**
  - Renamed 3rd `Company Type` option from `Ad Tech Platform / Vendor` to **`Ad Tech / Supply Partner`**.
- **Global 8-Locale i18n Parity (`src/locales/{en,de,es,fr,ja,ko,pt,zh}.json` & `src/locales/strings.json`):**
  - Synchronized all copy updates across all 8 languages and `strings.json` (`npm run i18n:audit` passes with 0 missing keys and 0 untranslated discrepancies).
