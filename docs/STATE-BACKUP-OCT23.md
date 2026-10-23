# UPRAISER PROJECT STATE BACKUP
**Date:** October 23, 2026
**Commit:** HEAD / `main`
**Tag:** `v2.2.49-stable`

---

## 1. Executive Summary of Conference Hub & Telemetry Deliverables (`/connect`)

### A. Conference Hub Architecture (`/connect` · `ConferenceHubPage.tsx`)
1. **On-Site Offline-Ready Micro-Terminal:**
   - Dedicated minimal, ultra-fast mobile landing page built specifically for in-person networking at AdTech & Mobile conferences (MWC Barcelona, DMEXCO, Affiliate World, SiGMA, Web Summit).
   - Starfield ascent background with 60 FPS CSS parallax and tactile Web Vibration API (`navigator.vibrate(18)`).
   - Hyperspace warp burst during lead submission ("Clip In" alpine action).
   - Automatic 44×44px minimum tap targets, zero horizontal layout shift (`100dvh`), and safe-area inset protection.

2. **20 Global Languages for AdTech Summits (`conferenceHubI18n.ts`):**
   - **Demographically Sorted Neutral Picker (Global Speaker Order):**
     1. `en` (English · ~1.5B)
     2. `zh` (Chinese / 中文 · ~1.1B)
     3. `hi` (Hindi / हिन्दी · ~610M)
     4. `es` (Spanish / Español · ~560M)
     5. `ar` (Arabic / العربية · ~330M)
     6. `fr` (French / Français · ~310M)
     7. `pt` (Portuguese / Português · ~260M)
     8. `ru` (Russian / Русский · ~255M)
     9. `id` (Indonesian / Bahasa Indonesia · ~200M)
     10. `de` (German / Deutsch · ~135M)
     11. `ja` (Japanese / 日本語 · ~125M)
     12. `fil` (Filipino / Tagalog · ~90M)
     13. `tr` (Turkish / Türkçe · ~88M)
     14. `vi` (Vietnamese / Tiếng Việt · ~86M)
     15. `ko` (Korean / 한국어 · ~82M)
     16. `th` (Thai / ไทย · ~71M)
     17. `it` (Italian / Italiano · ~68M)
     18. `pl` (Polish / Polski · ~45M)
     19. `uk` (Ukrainian / Українська · ~40M)
     20. `he` (Hebrew / עברית · ~10M)
   - **100% Native Localization Across All Elements:**
     - Alpine action button (*Clip In*, *Встегнуться*, *Пристебнутись*, *क्लिप इन करें*, *卡扣锁定*, *I-clip In*, *カラビナを固定*).
     - Roster roles (*Founder & Lead*, *CEO & Co-founder*).
     - Ecosystem links (*Device Routes*, *Expedition Deck*, *Official Website*, *LinkedIn*).
     - Alpine slogan (*"Let's stay roped together 🧗 / The event ends, but the climb goes on..."*).
     - Form placeholders, error messages, and telemetry badges.

3. **Infinite Loading & iOS Timer Suspension Resolution:**
   - **Bug:** On iOS WebKit, opening the native Contacts modal sheet paused JavaScript timers in the background. Artificial `await new Promise(r => setTimeout(r, ...))` calls never resumed, causing an infinite spinner and indefinite warp jump.
   - **Fix:**
     - Completely removed artificial delay promises.
     - Added immediate state transition to `"success"` on response.
     - Added a 2.8s safety watchdog timer (`setTimeout(() => { setIsWarping(false); setStatus('success'); }, 2800)`).
     - Added `window.addEventListener('focus')` and `document.addEventListener('visibilitychange')` auto-recovery to halt warping and resolve status the moment the user returns from the Contacts sheet.
     - Warp timeout capped at 2.2s.

4. **Telemetric Success Badge:**
   - Replaced multi-line status text with a streamlined, single-line uppercase monospace badge:
     - `✓ COORDINATES RECEIVED` (EN)
     - `✓ КООРДИНАТЫ ПРИНЯТЫ` (RU)
     - `✓ КООРДИНАТИ ПРИЙНЯТІ` (UK)
     - *(and localized equivalents in all 20 languages)*
   - Matched exact button height (`min-h-[46px]`) for seamless layout symmetry.

---

## 2. Advanced Device Telemetry & Repeat-Visit Tracking

### A. Rich Device Footprint
Every submission and repeat-visit signal to `/api/contact` now includes an extensive telemetry footprint:
1. **Timestamp:** Local formatted date and time + IANA timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`, e.g., `Europe/London`, `Asia/Dubai`, `Asia/Bangkok`) + UTC ISO timestamp.
2. **Viewport & Screen Dimensions:**
   - Viewport: `window.innerWidth × window.innerHeight` (e.g. `390 × 844 px`)
   - Physical Screen: `window.screen.width × window.screen.height px @ DPR x`
   - Orientation: `Portrait` vs `Landscape`
3. **Locale & Languages:**
   - Primary: `navigator.language` (e.g., `en-GB`, `ru-RU`)
   - Accept-Language array: `navigator.languages.join(", ")`
   - Selected UI Language: `lang`
4. **Session State:**
   - `⭐ First Visit (Visit #1)` vs `🔁 Repeat Visit (Visit #N · First seen: DD Mon YYYY, HH:mm)`
5. **Visitor ID:**
   - Unique device session token stored in `localStorage` (`hub_xxxxxxx`).

### B. Automated Revisit Alert Beacon
- When a previously recorded visitor re-opens `upraiser.co.uk/connect`:
  - If at least 90 seconds elapsed since previous activity, `visitCount` increments.
  - If `visitCount >= 2` and at least 15 minutes have passed since the last alert, a silent background beacon triggers an alert email to the desk.
  - Email Subject: `🔁 [HUB REVISIT] Alex Partner reopened /connect (Europe/London)`
  - Enables on-site real-time follow-up at conferences when a prospect re-checks the hub.

---

## 3. RFC 2426 vCard 3.0 Compliance & Contact Optimization (`contact.vcf`)

### A. Search-Optimized Contact Name
- Name saved as **Alex Upraiser**:
  - `FN:Alex Upraiser`
  - `N:Upraiser;Alex;;;`
  - `NICKNAME:Oleksii`
  - `ORG:UPRAISER Agency LLP`
  - `TITLE:Founder & Lead`
- **Rationale:** Ensures that searching for either "Alex" or "Upraiser" in iOS Spotlight / Contacts or Google Contacts instantly matches the contact card without having to remember the founder's full Ukrainian surname.
- Download filename updated to `alex-upraiser.vcf`.

### B. Avatar Rendering on iOS & Android
- **Previous Issue:** Line breaks in base64 without CRLF and an empty line after `PHOTO;ENCODING=b;TYPE=JPEG:` caused Apple AddressBook and Android Contacts to fail parsing the avatar photo.
- **Remediation:**
  - Encoded `public/team/oleksii.jpg` (256×256 baseline JPEG).
  - Base64 data starts immediately after the colon on line 1.
  - Standard RFC 2426 72-character line folding with leading space.
  - Strict CRLF (`\r\n`) line endings enforced throughout the file.
  - Verified by OS file utility: `public/contact.vcf: vCard visiting card, version 3.0`.
