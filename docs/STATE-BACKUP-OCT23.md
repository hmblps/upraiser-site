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

## 3. 1-Screen Native Contact Sheet & Safari/Chrome iOS Fix (`Alex_Upraiser.vcf` · `contact.vcf`)

### A. Root Causes Identified & Fixed
1. **WebKit / Mobile Safari `data:` URI Security Blocker:** Mobile Safari on iOS strictly blocks top-level navigation and downloads for `data:` URIs (`data:text/vcard;charset=utf-8,...`), causing clicks to silently fail with zero action (except client-side visual triggers like star acceleration).
   - *Fix:* Switched primary download anchor and `triggerVCardDownload` to the real static endpoint `/Alex_Upraiser.vcf?v=7` served with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline; filename="Alex_Upraiser.vcf"`. Safari natively intercepts this HTTP response and immediately presents the native contact poster without leaving the page.
2. **Name Formatting in iOS Contacts:** In iOS `CNContactViewController`, the bold headline is generated from `N: [Family Name];[Given Name];;;`. Setting `N:Ostroukhov;Oleksii;;;` forced iOS to render `Oleksii Ostroukhov`.
   - *Fix:* Configured `N:Upraiser;Alex;;;` and `FN:Alex Upraiser`. iOS now cleanly displays the headline **Alex Upraiser**, with monogram fallback **AU**.
   - *Searchability:* Full legal name and handle are placed into `ORG:Oleksii Ostroukhov · UPRAISER Agency LLP · TG @homeboylebz`. Under the headline, this renders in small gray subtext without creating extra cards, allowing Spotlight and Contacts to find the card by *Alex*, *Oleksii*, *Ostroukhov*, or *Upraiser*.
3. **`Create New Contact` on Screen 1:** Removing the multi-line `NOTE` block saved ~110px of vertical height. The contact card fits strictly on **1 screen without scrolling** across all iOS and Android devices, keeping `Create New Contact` directly visible below the 3 cards (`mobile`, `email`, `work URL`).
4. **Avatar Photo Parsing:** Embedded 200×200 JPEG with RFC 2426 line folding (`.{1,74}`) and `PHOTO;ENCODING=b;TYPE=JPEG:`.

### A2. Seamless Save: No Download Prompt (v2.2.54)
- **Cause of the "Download contact.vcf?" popup:** the `download` attribute on the anchor tells Safari and Chrome to save the file to the Downloads folder instead of handing it to the Contacts app.
- **Fix:** removed `download` from the One-Tap Save anchor. Both the anchor and the Clip In handler (`triggerVCardDownload`) now navigate directly to the static `/Alex_Upraiser.vcf?v=7` (no Blob, no `download`, no `target="_blank"`). The server replies with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline`, so the browser opens the native contact sheet on top of the current page.
- **Lead delivery:** the `/api/contact` and Web3Forms fetches use `keepalive: true`, so the lead is still delivered when navigation to the `.vcf` starts in the same tick.
- **Cleanup:** removed the unused `src/pages/alexVCardData.ts` data-URI module and its generator block (data: URIs are blocked by WebKit).

### A3. Short Subtitle & Photo Behaviour on Phones That Already Know the Number (v2.2.55)
- **Subtitle shortened.** iOS prints `TITLE` first and `ORG` second under the photo, joined by a bullet. The old value (`Founder & Lead · Direct Mobile UA & OEM Infra • Oleksii Ostroukhov · UPRAISER Agency LLP · TG @homeboylebz`) wrapped onto three lines. Now `TITLE:Oleksii Ostroukhov` and `ORG:Supply & Demand` render as `OLEKSII OSTROUKHOV • SUPPLY & DEMAND`. The headline stays `Alex Upraiser`.
- **Dropped from the card:** Telegram handle and the Mobile UA / OEM keywords. Telegram, WhatsApp, LinkedIn and the media deck stay on `/connect`.
- **Missing photo on a second iPhone.** The scan test showed a monogram instead of the photo. The monogram letter was Cyrillic, so that iPhone already stores `+40 724 787 390` under a Cyrillic name and iOS matched the existing contact by number. The existing contact's picture takes priority over the `PHOTO` field in the file. The `PHOTO` field itself is unchanged and decodes correctly in macOS QuickLook. To confirm, scan from an iPhone that has never saved the number.
- **Cache bust:** vCard URL bumped to `/Alex_Upraiser.vcf?v=8` because the endpoint is served with `max-age=600`.

### B. Contact Structure Reference
```vcard
BEGIN:VCARD
VERSION:3.0
PRODID:-//Apple Inc.//macOS 27.0.1//EN
N:Upraiser;Alex;;;
FN:Alex Upraiser
ORG:Oleksii Ostroukhov · UPRAISER Agency LLP · TG @homeboylebz
TITLE:Founder & Lead · Direct Mobile UA & OEM Infra
TEL;TYPE=CELL,VOICE,PREF:+40724787390
EMAIL;TYPE=WORK,INTERNET:alex@upraiser.co.uk
URL;TYPE=WORK:https://upraiser.co.uk/connect
PHOTO;ENCODING=b;TYPE=JPEG:[FOLDED_BASE64]
END:VCARD
```
