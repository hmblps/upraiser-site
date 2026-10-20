# UPRAISER PROJECT STATE BACKUP
**Date:** October 20, 2026
**Commit:** HEAD / `main`

---

## 1. Summary of Completed Deliverables (October 19–20, 2026)

### A. Snowfall Particle Physics & Hero Velocity Warp Elimination
- **Hero Video Snow Warp & Meteor Shower Elimination (`HeroVideoFallback.tsx`):**
  - **Root Cause:** When `video.paused` was triggered (or when video finished playback), particle velocity calculation evaluated `Math.pow((dur - cur) / 4.2, 2)` without clamping when paused mid-video. This caused forward flight acceleration to explode by up to `30x`, generating a disorienting laser/meteor streak shower when scrolling or pausing.
  - **Remediation:** Enforced calm ambient drift on pause (`forwardFlight = 0.05`), clamped forward flight strictly to `[0.05, 3.5]`, and added a smooth scroll fade-out past 380px of scroll (`Math.max(0, 1 - (window.scrollY - 380) / 240)`), eliminating particle streaks under the Hero fold.
- **Ambient Snowfall Scale & Color Optimization Under Hero (`GlobalSnowfall.tsx`):**
  - Reduced particle radius from heavy flakes (`size = 1.0–2.8px`) to micro-crystals (`size = 0.6px–1.4px`), matching the fine particle scale of the Hero video.
  - Particle body rendered in crisp pure white `rgba(255, 255, 255, 0.96)` with a subtle `0.4px` soft drop-shadow (`rgba(15, 23, 42, 0.22)`), ensuring crystal visibility across bright snow and light surfaces without muddy grey tinting.

### B. Production Stale Chunk 404 Auto-Recovery & Zero-Downtime Deployment
- **Static Footer Import Elimination of White Screen (`SiteLayout.tsx`):**
  - Switched `Footer` from a dynamic lazy import (`React.lazy(() => import("../components/Footer"))`) to a static import. Because `Footer` is only 2.8 kB, dynamically loading it when scrolling triggered fatal 404 chunk errors on active browser tabs after new production builds replaced hashes on Vercel.
- **Vite Preload & Module Error Auto-Reload Handler (`main.tsx`):**
  - Registered window listeners for `vite:preloadError` and module script fetch errors. Stale browser sessions hitting missing chunk hashes now automatically trigger a graceful reload with a 10-second cooldown (`sessionStorage.getItem("upraiser_last_chunk_reload")`) to eliminate white screens without infinite reload loops.
- **Link Preload Header Compliance (`index.html`):**
  - Replaced non-standard `rel="preload" as="video"` with `rel="preload" as="fetch" crossOrigin="anonymous"` to silence browser console warnings.

### C. Design Token & Button Color Parity
- **Home Pilot CTA Button Colors (`HomePilotCta.tsx`):**
  - Aligned the "Infrastructure story →" button border and hover tint to the canonical Header Active Gold token `#F7C806` (`rgb(247, 200, 6)`) instead of `#eab308`.
  - Replaced dark/muddy crimson `#cb310d` on the "Request Pilot" primary CTA with the official brand red `#ff003b` (`rgb(255, 0, 59)`).

### D. Contact Form Mobile Layout Polish
- **Single-Row Navigation Pills (`Contact.tsx`):**
  - Wrapped the 4 navigation pills (`The Agency`, `See Cases`, `The Routes`, `The Expedition`) into a single-row horizontal scroll container (`flex-nowrap overflow-x-auto no-scrollbar`, `text-[10px] sm:text-xs`) with touch zone $\ge 44$px via `after:` pseudo-element, eliminating awkward single-pill wrapping on mobile screens.
- **Form Card Bottom Void Elimination (`Contact.tsx`):**
  - Added `flex-1` spacer below "Direct Communications" and anchored legal compliance (`mt-auto pt-6 border-t`) to the bottom of the card, filling the card height symmetrically and removing the empty white space.

### E. Hero Interaction Guards & Performance
- **Hero Auto-Scroll User Interaction Guard (`Hero.tsx`):**
  - Added event listeners for user scroll, touch, and wheel inputs. If a user interacts with the page before the hero video finishes, the automated 2.5s programmatic scroll-down is cleanly aborted to prevent layout hijacking.
- **Legacy PNG Sequence Pruning (`public/hero/`):**
  - Removed ~44 MB of deprecated frame sequence folders (`public/hero/frames/`, etc.), streamlining build bundles and repository storage.
- **CTV Video Prewarm (`Tablet3D.tsx`, `Tv3D.tsx`):**
  - Restored CTV prewarming to ensure zero frame latency when scrolling into the Channels format visualizer.
- **Documentation & Strict Content Integrity:**
  - Preserved original copy in `liveContent.ts` without unauthorized modification.

### F. Typography & Punctuation Polish
- **Promise Lead Trailing Period Removal (`PromiseSection.tsx`):**
  - Removed trailing period dot and its `<motion.span className="inline">.</motion.span>` wrapper from the Promise lead banner so it reads clean and open: *"We bring CLARITY"* (and *"We guarantee PARITY"* in infrastructure mode) with zero trailing punctuation or whitespace separation.

### G. Asset Pruning & Video Size Reduction
- **Unused 3D Model Pruning (`public/channels/oem/`):**
  - Deleted unmounted 29 MB model `macbook-draco.glb` and disabled eager `useGLTF.preload` in `Macbook3DModel.tsx`.
- **Hero Video Bitrate Optimization (`public/hero/`):**
  - Optimized `home-dark-idle.mp4` (from 8.9 MB to 7.1 MB) and `home-light-idle.mp4` (from 11.9 MB to 9.5 MB) via x264 CRF encoding with faststart headers, bringing total `public/` size down to 73 MB (from 160 MB).

### H. Hero Camera Flight Snow Restoration
- **3D FPV Drone Ascent Particle Dynamics (`HeroVideoFallback.tsx`):**
  - Restored full 160-particle density (80 on mobile) with dynamic forward velocity (`0.007 * forwardFlight + 0.001`), mountain ridge crosswind, and directional speed streaks during flight.
  - Enforced zero-acceleration calm drift (`forwardFlight = 0.05`) with streak suppression on pause/summit hold.
  - Extended scroll visibility across the full Hero pinned scene (`window.innerHeight * 1.15`).
