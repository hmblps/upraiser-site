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

## 3. 1-Screen Native Contact Sheet & Chrome on iOS Optimization (`Oleksii_Upraiser.vcf` · `contact.vcf`)

### A. Root Causes Identified via iOS Screen Recording
1. **Blob Navigation Failure in Chrome on iOS (CriOS):** Dynamic blob downloads (`<a download>.click()`) in Chrome iOS attempt to open the Blob as a new tab, causing an empty black screen flash before presenting the contact.
   - *Fix:* Replaced programmatic blob click with `window.location.assign(vcfHref)` and client-side pre-generated `data:text/vcard;charset=utf-8,...` (with static `/Oleksii_Upraiser.vcf` fallback). Chrome/Safari on iOS natively overlays the Contact Sheet directly over the active page with 0 ms delay and zero dark screen flicker.
2. **`Create New Contact` Button Pushed Past the Fold:** The multi-line `NOTE` block consumed ~110px of vertical space, pushing `Create New Contact` ~80px below the viewport fold.
   - *Fix:* Completely removed the `NOTE` block. Migrated Telegram handle (`@homeboylebz`) and infrastructure keywords directly into `ORG` (`UPRAISER Agency LLP · TG @homeboylebz`) and `TITLE` (`Founder & Lead · Direct Mobile UA & OEM Infra`). On iOS Contact Posters, `ORG` and `TITLE` render as compact subtext beneath the name without generating separate cards.
   - *Result:* Below the fixed header, strictly 3 clickable cards remain: Phone, Email, and Work Connect URL. `Create New Contact` and `Share Contact` sit cleanly on the first screen with zero scrolling required.
3. **Photo Avatar Rendering & Line Folding:** Apple Contacts parser rejects Base64 photos if line folding is missing or non-compliant.
   - *Fix:* Integrated Canvas 200×200 square-crop JPEG encoder (`getAppleCompatibleBase64Photo`) with strict 74-character line folding (`rawBase64.match(/.{1,74}/g).join('\r\n ')`) and `PHOTO;ENCODING=b;TYPE=JPEG:` syntax, pre-baked statically and generated dynamically in memory.

### B. Contact Structure Reference
```vcard
BEGIN:VCARD
VERSION:3.0
PRODID:-//Apple Inc.//macOS 27.0.1//EN
N:Ostroukhov;Oleksii;;;
FN:Oleksii Ostroukhov
ORG:UPRAISER Agency LLP · TG @homeboylebz
TITLE:Founder & Lead · Direct Mobile UA & OEM Infra
TEL;TYPE=CELL,VOICE,PREF:+40724787390
EMAIL;TYPE=WORK,INTERNET:alex@upraiser.co.uk
URL;TYPE=WORK:https://upraiser.co.uk/connect
PHOTO;ENCODING=b;TYPE=JPEG:[FOLDED_BASE64]
END:VCARD
```
