# UPRAISER PROJECT STATE BACKUP
**Date:** October 26, 2026  
**Commit:** HEAD / `main`  
**Tag:** `v2.2.93-stable`  
**Target Environment:** Production [https://upraiser.co.uk](https://upraiser.co.uk) (Vercel `upraiser-site-v2`)

---

## 1. Executive Summary: Creative Studio, Victory Flow & Connect Hub Hardening

Between October 24 and October 26, 2026, the project underwent significant feature additions and production hardening:
1. **Restoration of Original Studio Background Videos & Targeted Victory Video Re-timing (v2.2.93-stable):**
   - Reverted Creative Studio intro/ambient background videos (`light-loop.mp4` and `dark-loop.mp4`) and `CreativeStudioVideo.tsx` timings back to their exact original baseline.
   - Victory videos after contact form submission on `/contact/sent` remain cleanly re-timed to dynamic 6.0s cuts ending on the panoramas:
     - **Day (`studio-success-day.mp4`):** Cut from 2.0s to 8.0s of `Дневное.mov` (6.0s duration), ending on the radiant sunrise mountain panorama.
     - **Night (`studio-success-night.mp4`):** Cut from 6.0s to 12.0s of `Ночное.mov` (6.0s duration), ending on the cliff/abyss under climber's feet with aurora borealis.
2. **Form Submit Button Grounding & Magnetic Clamping (v2.2.91-stable):**
   - Removed `<Magnetic>` wrapper from the full-width "REQUEST PILOT" submit button in `Contact.tsx`. Replaced with grounded `motion.button` with subtle spring hover (`scale: 1.01`) and tap (`scale: 0.98`), completely preventing the button from sliding sideways into the adjacent column or being clipped.
   - Hardened `Magnetic.tsx` with max offset clamps (`maxOffsetX`, `maxOffsetY`) defaulting to 8px max on full-width elements.
2. **Universal Victory Summit Video Across Themes (v2.2.91-stable):**
   - Enabled the cinematic victory celebration video across all Pilot Brief submissions on `/contact/sent`.
   - Light theme plays the radiant golden daylight summit (`studio-success-day.mp4`, 8.0s), while dark theme plays the celestial aurora summit (`studio-success-night.mp4`, 8.0s).
   - Derives `activeTheme` directly from `?theme=` query parameters, navigation state, and theme context.
   - Fixed reload protection to prevent accidental bounce-backs to `/craft` on legitimate submissions.
   - Guaranteed WebKit / Safari video autoplay by enforcing `v.muted = true` and `v.defaultMuted = true` on the DOM node.
3. **Connect Hub Notification De-Noising & Click ID Unification:**
   - Suppressed email and Telegram notifications on `vcf_download` (One-Tap Save / Clip In) because downloading a `.vcf` file does not guarantee the contact was saved in phone contacts.
   - Retained instant notifications strictly for submitted forms (`form_submit` via `/api/contact`) and verified return visits.
   - Equated visitor token to `click_id` across the platform: captures incoming URL parameters (`?click_id=`, `?clickid=`, `?cid=`, `?token=`) or defaults to the timestamped token (`hub_YYYYMMDD_HHMM_xxxx`).
   - Telegram alerts and email notifications now clearly display `🎯 Click ID: <clickId>`.
   - Identified root cause of GitHub Actions email: account billing lock on GitHub account `hmblps`. Paused cron schedule in `.github/workflows/supabase-keepalive.yml` to stop automated failure spam. Supabase DB verified 100% online (HTTP 200).
2. **Creative Studio (`/craft`) Intro Synchronization & Scroll-to-Advance:**
   - Both Day (`light-loop.mp4`) and Night (`dark-loop.mp4`) ambient intro video ascents now reach the basecamp summit and reveal interactive cards at **exactly 5.0 seconds**.
   - The night ascent was re-timed with a 2.12x speedup curve, eliminating the previous 5.6-second delay gap between themes.
   - **Scroll-to-Advance Gesture:** Users can scroll down (mouse wheel, touch swipe, or arrow keys) at any point during the intro climb to immediately advance to the capability cards and "Request the Pilot" button.
2. **Post-Brief Victory Video Flow (`/contact/sent?source=studio`):**
   - Brief submissions originating from Creative Studio (`/craft` $\to$ `/contact?source=studio`) trigger an immersive full-screen alpine victory video celebration matching the active theme (Day summit vs. Night celestial aurora).
   - Standard submissions from the main site remain lightning-fast and minimalist without video.
   - Both victory videos normalized to exactly **6.00 seconds** at 60 FPS, CRF 20, with a custom camera deceleration curve (speed gently dropping from 1.08x at 3.2s down to 0.18x at 6.0s) for a smooth summit landing without abrupt halting.
   - **Silky Entrance Dissolve & Theme Background Harmony:** The victory video smoothly dissolves in over 900ms (`motion.div` with `ease: [0.22, 1, 0.36, 1]`) against matching theme backgrounds (`#f8fafc` light / `#06070a` dark), completely eliminating harsh cuts or black flashes after submitting.
   - Confirmation cards emerge progressively starting at **3.4s**, giving viewers 2.6s of comfortable reading time.
   - Reload protection: Refreshing the victory screen returns the user directly to `/craft` in their active theme.
3. **Studio Ambiance & Lighting Calibration:**
   - Light theme: Brilliant golden sunrise bloom (`screen` & `color-dodge`) without blanket darkening, highlighting the alpine daylight around the climber.
   - Dark theme: High-contrast emerald and violet Aurora Borealis (северное сияние) spectral emission layers grounded by dark alpine bedrock.
4. **Copywriting Refinement (Ogilvy Doctrine):**
   - Post-brief confirmation header updated to **`Basecamp Reached`**.
   - Kicker updated to **`Let us guide You now to the top. Big milestone ahead.`**
5. **Desktop Clickability & Input Focus Hardening:**
   - Completely eradicated experimental parallax `requestAnimationFrame` re-render loops and synthetic focus stealer logic that previously froze mouse clicks and keyboard focus on desktop browsers.
6. **Conference Hub & Multilingual Deck Polish:**
   - 22-language modular architecture (`src/pages/deckI18n/`), interaction-gated telemetry alerts, clean URL referrer attribution, and 1-screen iOS Contacts sheet integration (`Alex_Upraiser.vcf?v=8`).

---

## 2. Creative Studio Intro Ascent Synchronization (Option A)

### A. The Challenge
- In the initial implementation of Creative Studio (`/craft`):
  - **Light Theme (`light-loop.mp4`):** Climber ascended to the summit ledge in **5.0 seconds**, paused, and smoothly revealed the interactive showcase cards.
  - **Dark Theme (`dark-loop.mp4`):** Ascent took **10.6 seconds** before reaching the summit and pausing.
- This created a pacing disparity of ~5.6 seconds where dark theme visitors had to wait more than double the time before interacting with the cards.

### B. The Solution: Accelerated Night Climb
1. **Video Re-Encoding via FFmpeg:**
   - Applied a hardware-accurate PTS re-timing filter:
     ```bash
     ffmpeg -i dark-loop.mp4 -filter:v "setpts=0.4717*PTS" \
       -c:v libx264 -preset slow -crf 20 -movflags +faststart \
       -pix_fmt yuv420p dark-loop-fast.mp4
     ```
   - Scaled the total night clip duration from 11.01s down to **5.24s**, placing the summit arrival frame precisely at **5.00s**.
2. **Component Synchronization (`src/components/CreativeStudioVideo.tsx`):**
   - Unified `pauseTime = 5.0` across both Day and Night modes.
   - Calibrated golden wall decel/illumination curves (`goldenStartTime = 3.0s`, `decelStartTime = 3.8s`).
   - Synchronized telemetry altitude counter progression:
     ```typescript
     // Over 5.0 seconds in both themes:
     const currentAlt = 899.0 + (progress * 1.0); // 899.0M -> 900.0M
     ```
   - Result: Both Day and Night visitors experience an identical 5.0-second cinematic build-up followed by an immediate card reveal.

---

## 3. Creative Studio Victory Confirmation Flow (`/contact/sent?source=studio`)

### A. Dynamic Source-Gated Routing
- When a user clicks **"Request the Pilot"** in Creative Studio (`/craft`), the button forwards the parameter:
  ```typescript
  navigate(`/contact?source=studio&theme=${activeTheme}`);
  ```
- The contact form (`src/components/Contact.tsx`) preserves this origin through form state and transmits it during submission.
- On successful brief submission, the user is navigated to:
  ```
  /contact/sent?source=studio&theme=${activeTheme}
  ```
- Standard visitors who submit through `/contact` or the main site do not receive the `source=studio` parameter. They are presented with the clean, ultra-fast minimalist confirmation screen without video backgrounds.

### B. Victory Video Architecture, Camera Deceleration & Silky Card Revelation
- **Source Assets:**
  - Day: `/Users/homeboylebz/Downloads/Дневное.mov` $\to$ `public/creative/studio-success-day.mp4`
  - Night: `/Users/homeboylebz/Downloads/Ночное.mov` $\to$ `public/creative/studio-success-night.mp4`
- **Normalization & Camera Deceleration:**
  - Video length synchronized to exactly **6.00 seconds** (1.6 MB Day / 3.0 MB Night at 60 FPS, CRF 20, H.264 `+faststart`).
  - **Camera Deceleration Curve (3.2s $\to$ 6.0s):** Re-encoded with a custom PTS deceleration curve:
    - Initial pace (0.0s $\to$ 3.2s): Brisk 1.08x camera movement.
    - Deceleration arc (3.2s $\to$ 6.0s): Speed smoothly drops from 1.08x $\to$ 0.18x, allowing the camera to gently glide to a natural rest on the summit rather than halting abruptly.
  - High-resolution poster frames (`studio-success-day-poster.jpg`, `studio-success-night-poster.jpg`) pre-rendered from the initial frame.
- **Playback Mechanics & Organic Staggered Reveal (`src/pages/ThankYouPage.tsx`):**
  - **No Loop & Smooth Freeze:** The `<video>` element omits `loop`. At 5.95s/6.0s, the video softly holds the final majestic mountain top frame without any jarring jerk because the camera has already decelerated.
  - **Elimination of Abrupt Pop ("Щелчок"):** Card revelation now initiates gently at **3.4s** as the camera enters its deceleration curve, providing 2.6 seconds of comfortable reading time.
  - **Staggered Progressive Disclosure:**
    - Badge (`Creative Studio · Pilot Brief Logged`) materializes softly at 3.4s (`duration: 0.75s`, `ease: [0.22, 1, 0.36, 1]`).
    - Kicker (`Basecamp Reached`) floats in at +120ms.
    - Headline (`Let us guide You now to the top. Big milestone ahead.`) glides in at +240ms.
    - Action buttons (`Back to Studio`, `Proven Summits`, `Send another brief`) rise in at +400ms.
  - **Bottom Indicator Dissolve:** The bottom skip indicator gently fades out (`duration: 0.45s`) rather than abruptly collapsing.
  - **Click-to-Skip:** Tapping anywhere on the viewport instantly fast-forwards to the final state (`duration: 0.25s`).

### C. Reload & Re-Visit Auto-Redirect
- To prevent users from lingering on a static completion URL upon refresh or bookmark reopening:
  1. A one-time session flash flag (`upraiser_studio_submitted`) is stored in `sessionStorage` upon submission.
  2. `ThankYouPage.tsx` checks both this flag and `window.performance.getEntriesByType("navigation")`:
     ```typescript
     const navEntry = window.performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
     const isReload = navEntry?.type === "reload";
     const wasSubmitted = sessionStorage.getItem("upraiser_studio_submitted") === "true";
     
     if (isStudio && (isReload || !wasSubmitted)) {
       navigate(`/craft?theme=${theme}`, { replace: true });
       return;
     }
     ```
  3. On refresh, the user is seamlessly returned to Creative Studio in their matching active theme.

---

## 4. Lighting & Ambiance Calibration Engine

### A. Light Theme (Alpine Sun & Golden Horizon)
- **Problem:** Initial builds applied a dark `bg-black/35` overlay across the video, dimming the daylight and obscuring the climber.
- **Solution:**
  - Removed full-screen dark scrims.
  - Boosted video brightness and warmth:
    ```css
    filter: contrast(1.05) saturate(1.18) brightness(1.15);
    ```
  - Added a sunburst bloom radial gradient centered on the horizon:
    ```css
    mix-blend-mode: screen;
    background: radial-gradient(ellipse 95% 75% at 55% 25%, 
      rgba(255, 240, 205, 0.38) 0%, 
      rgba(255, 215, 140, 0.20) 35%, 
      rgba(251, 191, 36, 0.08) 60%, 
      transparent 80%);
    ```
  - Added a morning atmosphere flood in `mix-blend-mode: color-dodge`.
  - Localized the text readability scrim strictly to the left third (`linear-gradient(to right, rgba(0,0,0,0.40) 0%, transparent 75%)`), leaving the climber and alpine sun on the center-right bright and unencumbered.

### B. Dark Theme (Celestial Aurora Borealis · Сияние)
- **Problem:** Night video lacked color vibrancy and celestial drama in the upper sky.
- **Solution:**
  - Boosted saturation and contrast:
    ```css
    filter: contrast(1.12) saturate(1.48) brightness(1.20);
    ```
  - Layered a two-stage Aurora Borealis spectral wave in the night sky:
    - **Stage 1 (Spectral Wave):** Emerald (`#34d399` at 32%) blending into violet (`#a855f7` at 35%) and purple (`#8b5cf6` at 15%) with `mix-blend-mode: screen`.
    - **Stage 2 (Core Luminescence):** Concentrated emerald core (`#6ee7b7` at 26%) and neon purple (`#c084fc` at 28%) with `mix-blend-mode: color-dodge`.
  - Bedrock Grounding: Applied an ellipse gradient at `at 50% 100%` (`rgba(4, 7, 12, 0.60)`), anchoring the mountain rocks below while keeping the celestial sky incandescent above.

---

## 5. Copywriting Doctrine & Sacred Phrases

In accordance with David Ogilvy advertising principles and the repository's Global Guidelines:
- **Active Voice & Capitalized Pronouns:** All direct address capitalizes **You** and **Your**.
- **Forbidden Buzzwords Banned:** Zero use of `innovative`, `seamless`, `game-changer`, `cutting-edge`, `unleash`, `revolutionary`, etc.
- **Post-Brief Confirmation Card (`ThankYouPage.tsx`):**
  - **Badge:** `// BRIEF CONFIRMED` (Mono uppercase telemetry indicator)
  - **Headline:** `Basecamp Reached`
  - **Kicker:** `Let us guide You now to the top. Big milestone ahead.`
  - **Telemetry Capsule:** Displays active theme (`[DAY SUMMIT]` / `[NIGHT ASCENT]`), verified timestamp, and response SLA (`Within 4 business hours`).

---

## 6. Core Desktop Stability & Input Focus Resolution

### A. Root Cause Analysis of Desktop Freezes
- During testing of mobile-oriented spatial parallax experiments on `/connect`, an issue manifested on desktop browsers: mouse clicks appeared unresponsive, and keyboard text inputs could not be focused.
- **Identified Vectors:**
  1. An un-gated `requestAnimationFrame` loop in an experimental parallax script was executing continuously on desktop screens.
  2. A synthetic pointer/focus-stealing event intended to simulate touch drags on mobile was capturing mouse events globally on desktop viewports.
  3. This prevented native mouse click and focus events from reaching standard `<input>`, `<button>`, and `<a>` elements.

### B. Resolution (Commit `b9978057` · v2.2.78-stable)
- Completely excised the experimental parallax loop and synthetic click listener.
- Reverted desktop interactions to 100% native DOM event dispatching.
- Audited all clickable elements across the site:
  - Ensured touch targets $\ge 44 \times 44\text{px}$.
  - Verified hover states are strictly scoped to `@media (hover: hover) and (pointer: fine)`.
  - Confirmed 0 focus stealing, 0 detached node errors, and instant input response across Safari, Chrome, Firefox, and Edge.

---

## 7. Conference Hub (`/connect`) & Multilingual Deck (`/deck`)

### A. 22-Language Modular Architecture (`src/pages/deckI18n/`)
- Split the monolithic dictionary into individual language modules:
  - `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `fr.ts`, `pt.ts`, `ru.ts`, `id.ts`, `de.ts`, `ja.ts`, `fil.ts`, `tr.ts`, `vi.ts`, `ko.ts`, `th.ts`, `it.ts`, `pl.ts`, `uk.ts`, `ro.ts`, `he.ts`, `ka.ts`.
  - Common types in `types.ts` and UI controls in `ui.ts`.
- Language order strictly follows global speaker population order.

### B. Telemetry & Attribution Engine
- **Identity Stitching:** Visitor sessions persist across `/connect`, `/deck`, and `/contact` via `upraiser_hub_session_v1`.
- **Smart Referrer & In-App Attribution:** Identifies traffic origins (LinkedIn, Telegram, WhatsApp, X/Twitter, Meta, Google, Direct) even when UTM parameters are stripped by messenger in-app browsers.
- **Interaction-Gated Alerts:** Repeat visit signals to Telegram Bot and Resend email digests only fire if a user actively engages ($\ge 25$s active time or card interaction), eliminating bot/crawler noise.

---

## 8. Git Tags & Release History (v2.2.60 to v2.2.84)

| Tag | Date | Focus |
|---|---|---|
| `v2.2.88-stable` | 26 Oct 2026 | Creative Studio night climb unaccelerated 8.0s cut (sec 4 to 12) with natural panorama reveal |
| `v2.2.87-stable` | 25 Oct 2026 | De-noise Connect notifications (suppress vcf alerts, keep submitted form only), equate token to click_id, pause failing GitHub keep-alive cron |
| `v2.2.90-stable` | 26 Oct 2026 | Pilot brief redirect hardening & 8.0s night victory panorama (sec 4 to 12) |
| `v2.2.89-stable` | 26 Oct 2026 | Synchronize night climb to 5.0s ending on downward cliff abyss view matching day timing |
| `v2.2.88-stable` | 26 Oct 2026 | Creative Studio night climb natural 8.0s cut with panorama reveal |
| `v2.2.87-stable` | 26 Oct 2026 | Equate token to click_id, silence vcf alerts & pause failing keepalive cron |
| `v2.2.86-stable` | 25 Oct 2026 | Smooth entrance dissolve for victory video & scroll-to-advance in craft intro |
| `v2.2.85-stable` | 25 Oct 2026 | Victory video camera deceleration & smooth card reveal |
| `v2.2.84-stable` | 25 Oct 2026 | Full documentation synchronization, state backup & master docs update |
| `v2.2.83-stable` | 25 Oct 2026 | Accelerate dark climb to 5.0s, synchronizing card emergence across Day & Night |
| `v2.2.82-stable` | 25 Oct 2026 | Normalize victory videos to 6.0s without loop; card reveal at 4.8s climax |
| `v2.2.81-stable` | 25 Oct 2026 | Redirect to `/craft` in active theme on victory video page refresh |
| `v2.2.80-stable` | 25 Oct 2026 | Amplify radiant daylight in light theme and luminous aurora borealis in dark theme |
| `v2.2.79-stable` | 25 Oct 2026 | Add Day/Night victory video confirmation for Creative Studio pilot requests |
| `v2.2.78-stable` | 25 Oct 2026 | Remove parallax rAF loop & synthetic click focus stealer (desktop input fix) |
| `v2.2.77-stable` | 25 Oct 2026 | Post-brief copy: "Let us guide You now to the top. Big milestone ahead." |
| `v2.2.76-stable` | 25 Oct 2026 | Post-brief copy: "Basecamp Reached" headline |
| `v2.2.75-stable` | 24 Oct 2026 | Cross-platform tactile feedback engine for iOS Taptic & Android |
| `v2.2.69-v2.2.74` | 24 Oct 2026 | Mobile spatial parallax tuning, omnibox autocomplete & button polish |
| `v2.2.68-stable` | 24 Oct 2026 | Instant session reset handler (`?reset=1`) & Supabase cache clear |
| `v2.2.67-stable` | 24 Oct 2026 | Human-readable timestamped tokens & end-to-end identity stitching |
| `v2.2.66-stable` | 24 Oct 2026 | Eliminate false return visit alerts; dynamic digest titles |
| `v2.2.65-stable` | 24 Oct 2026 | Forward `?lang` to `/deck`, persist preferred language, fix ro/ka submit |
| `v2.2.64-stable` | 24 Oct 2026 | Multilingual Deck 22-language modular architecture & interaction gating |
| `v2.2.63-stable` | 24 Oct 2026 | Smart referrer & in-app attribution for clean URLs |
| `v2.2.62-stable` | 24 Oct 2026 | Multilingual 20-slide interactive web deck with deep telemetry (`/deck`) |
| `v2.2.61-stable` | 24 Oct 2026 | Record 22-language support for Conference Hub (RO, KA) |
| `v2.2.60-stable` | 24 Oct 2026 | Add Romanian (`ro`) and Georgian (`ka`) localisations to Conference Hub |

---

## 9. Verification & Quality Assurance Suite

1. **TypeScript & Static Analysis:**
   - `tsc -b` passes with **0 errors**.
2. **Production Bundle Compilation:**
   - `npm run build` succeeds cleanly in **1.55s**.
   - Client bundle integrity verified; zero masked `[SENSITIVE]` environment variables leaked.
3. **Deployment Status:**
   - Production domain **`https://upraiser.co.uk`** deployed and verified via Vercel CLI (`upraiser-site-v2`).
   - HTTP response codes, asset caches, and `.vcf` endpoints operational.
