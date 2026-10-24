# UPRAISER PROJECT STATE BACKUP
**Date:** October 24, 2026
**Commit:** HEAD / `main`
**Tag:** `v2.2.60-stable`

---

## 1. Executive Summary of Conference Hub & Telemetry Deliverables (`/connect`)

### A. Conference Hub Architecture (`/connect` · `ConferenceHubPage.tsx`)
1. **On-Site Offline-Ready Micro-Terminal:**
   - Dedicated minimal, ultra-fast mobile landing page built specifically for in-person networking at AdTech & Mobile conferences (MWC Barcelona, DMEXCO, Affiliate World, SiGMA, Web Summit).
   - Starfield ascent background with 60 FPS CSS parallax and tactile Web Vibration API (`navigator.vibrate(18)`).
   - Hyperspace warp burst during lead submission ("Clip In" alpine action).
   - Automatic 44×44px minimum tap targets, zero horizontal layout shift (`100dvh`), and safe-area inset protection.

2. **22 Global Languages for AdTech Summits (`conferenceHubI18n.ts`):**
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
     20. `ro` (Romanian / Română · ~24M)
     21. `he` (Hebrew / עברית · ~10M)
     22. `ka` (Georgian / ქართული · ~4M)
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
   - *Fix:* Switched primary download anchor and `triggerVCardDownload` to the real static endpoint `/Alex_Upraiser.vcf?v=8` served with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline; filename="Alex_Upraiser.vcf"`. Safari natively intercepts this HTTP response and immediately presents the native contact poster without leaving the page.
2. **Name Formatting in iOS Contacts:** In iOS `CNContactViewController`, the bold headline is generated from `N: [Family Name];[Given Name];;;`. Setting `N:Ostroukhov;Oleksii;;;` forced iOS to render `Oleksii Ostroukhov`.
   - *Fix:* Configured `N:Upraiser;Alex;;;` and `FN:Alex Upraiser`. iOS now cleanly displays the headline **Alex Upraiser**, with monogram fallback **AU**.
   - *Searchability:* Full legal name and handle are placed into `ORG:Oleksii Ostroukhov · UPRAISER Agency LLP · TG @homeboylebz`. Under the headline, this renders in small gray subtext without creating extra cards, allowing Spotlight and Contacts to find the card by *Alex*, *Oleksii*, *Ostroukhov*, or *Upraiser*.
3. **`Create New Contact` on Screen 1:** Removing the multi-line `NOTE` block saved ~110px of vertical height. The contact card fits strictly on **1 screen without scrolling** across all iOS and Android devices, keeping `Create New Contact` directly visible below the 3 cards (`mobile`, `email`, `work URL`).
4. **Avatar Photo Parsing:** Embedded 200×200 JPEG with RFC 2426 line folding (`.{1,74}`) and `PHOTO;ENCODING=b;TYPE=JPEG:`.

### A2. Seamless Save: No Download Prompt (v2.2.54)
- **Cause of the "Download contact.vcf?" popup:** the `download` attribute on the anchor tells Safari and Chrome to save the file to the Downloads folder instead of handing it to the Contacts app.
- **Fix:** removed `download` from the One-Tap Save anchor. Both the anchor and the Clip In handler (`triggerVCardDownload`) now navigate directly to the static `/Alex_Upraiser.vcf?v=8` (no Blob, no `download`, no `target="_blank"`). The server replies with `Content-Type: text/vcard; charset=utf-8` and `Content-Disposition: inline`, so the browser opens the native contact sheet on top of the current page.
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
ORG:Supply & Demand
TITLE:Oleksii Ostroukhov
TEL;TYPE=CELL,VOICE,PREF:+40724787390
EMAIL;TYPE=WORK,INTERNET:alex@upraiser.co.uk
URL;TYPE=WORK:https://upraiser.co.uk/connect
PHOTO;ENCODING=b;TYPE=JPEG:[FOLDED_BASE64]
END:VCARD
```

---

## 4. Android & Samsung Internet Architecture: Why Download Prompts Occur & Intent Diagnostics Lab (v2.2.56)

### A. Architectural Divergence: iOS QuickLook vs Android Download Flow
1. **iOS (Safari / Chrome CriOS):**
   - The WebKit engine includes an in-process QuickLook vCard viewer.
   - When receiving `Content-Type: text/vcard; charset=utf-8` without `Content-Disposition: attachment` or a `download` HTML attribute, WebKit does not write to the file system.
   - It directly invokes `CNContactViewController` as a native overlay sheet.
2. **Android (Samsung Internet & Chrome for Android):**
   - Neither Blink nor Samsung Internet has an in-browser QuickLook vCard renderer.
   - The browser engine must save the MIME payload to local storage (`/storage/emulated/0/Download/`) through Android's `DownloadManager` before the OS can hand the file to the system Contacts app.
   - **Samsung Internet:** Strictly enforces a security confirmation modal (*"Download file?"* / *"Скачать файл?"*) prior to writing any file to local storage. This modal cannot be suppressed via HTTP response headers (`inline` vs `attachment`).
   - **Chrome on Android:** If a file named `contact.vcf` or `Alex_Upraiser.vcf` already exists in the Downloads folder, Chrome prompts *"Download contact.vcf again?"* to prevent silent overwrites.

### B. Technical Evaluation: Argon's Proposed `intent:#Intent` Protocol
Argon proposed switching the Android save mechanism to an Android Intent URI:
```text
intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name=Alex%20Upraiser;S.phone=%2B40724787390;S.email=alex%40upraiser.co.uk;S.company=Supply%20%26%20Demand;S.job_title=Oleksii%20Ostroukhov;S.notes=https%3A%2F%2Fupraiser.co.uk%2Fconnect;end
```

**Pros:**
- When supported, instructs the Android OS to launch the Contacts editor directly (`ContactsContract.Intents.Insert`) with pre-filled fields without initiating a file download.

**Cons & Constraints:**
1. **Chrome Android Intent Security Policy (BROWSABLE Category):**
   - Since Chrome 25+, Android Chrome enforces strict security checks on `intent:` URI navigation triggered from web pages.
   - Chrome blocks navigation to intent targets unless the receiving app component explicitly declares `<category android:name="android.intent.category.BROWSABLE" />` in its `AndroidManifest.xml`.
   - The native `android.intent.action.INSERT` action in OEM Contacts apps (Samsung Contacts, Google Contacts) is typically registered under `CATEGORY_DEFAULT`, not `CATEGORY_BROWSABLE`. In Chrome, tapping an unbrowsable intent results in a silent drop or `ERR_UNKNOWN_URL_SCHEME`.
2. **Binary Photo / Avatar Incompatibility:**
   - Intent URIs pass data as URL query extras (`S.name`, `S.phone`). They cannot transmit binary image buffers or base64 photo payloads into `ContactsContract`. Contacts created via this intent will always lack the embedded photo.
3. **OEM Inconsistencies:**
   - Different Android manufacturers (Samsung OneUI, Xiaomi MIUI/HyperOS, Google Pixel) parse intent extras differently (e.g. `S.company` vs `S.job_title`).

### C. Live Diagnostics Lab (`/connect/test` · `ConnectIntentTestPage.tsx`)
To verify actual real-world behavior on Samsung Internet and Chrome without disrupting production networking:
1. Created unlisted test harness page at `/connect/test` (aliased to `/test-intent`).
2. Provides four interactive test methods:
   - **Method 1: Direct Anchor Intent (Argon Spec)** — Pure `<a href="intent:...">`.
   - **Method 2: Smart Intent with 1.5s Fallback** — JS triggered intent; if the page stays visible for >1.5s (meaning the intent failed to switch apps), automatically falls back to `/Alex_Upraiser.vcf?v=8`.
   - **Method 3: MIME VIEW Intent** — `intent:https://...#Intent;action=VIEW;type=text/vcard;end`.
   - **Method 4: Production Baseline** — Direct HTTP static `/Alex_Upraiser.vcf?v=8`.
3. Displays a real-time event console capturing `visibilitychange`, `window.blur`, `window.focus`, and user agent string for precise device verification.

---

## 5. Mobile Funnel & Zero-Friction UX Architecture (v2.2.57)

### A. Zero-Typing Lead Capture (Clip In Form)
To minimize friction when prospects exchange contact information standing in loud expo halls:
1. **Name Field (`#hub-name`):**
   - Configured `autoComplete="name"`, `enterKeyHint="next"`, `autoCapitalize="words"`, and `spellCheck={false}`.
   - iOS QuickType and Android keyboards (Gboard / Samsung Keyboard) immediately render a personal identity badge above the keys. Tapping it populates the name in 0 keystrokes.
2. **Contact Field (`#hub-contact`):**
   - Configured `autoComplete="tel email"`, `enterKeyHint="send"`, `autoCapitalize="none"`, and `spellCheck={false}`.
   - Tapping "Next" focuses the contact field, surfacing the phone owner's verified phone number or email suggestion.
   - Tapping the blue "Send" action key on the software keyboard immediately submits the form. The entire handshake completes in ~2 seconds with zero manual typing.

### B. Cross-Platform Smart Download Guidance (Android & Chrome iOS CriOS)
Because Android browsers (Chrome, Samsung Internet) and third-party iOS browsers (Google Chrome `CriOS`, Firefox `FxiOS`) lack Apple's private `VCardTabHelper` WebKit integration, they route `.vcf` files through their internal download managers:
- **Safari on iOS:** Exclusively hooks into UIKit `CNContactViewController`, rendering the native sheet directly over the page with zero download dialogs. (99% of attendees scanning via the native iPhone Camera app land directly in Safari).
- **Chrome on iOS & Android:** Routes `.vcf` to local storage, prompting a download notification.
- **Adaptive Guidance:** `needsDownloadGuidance` detects Android, Chrome iOS (`CriOS`), and third-party mobile browsers. Upon clicking One-Tap Save or submitting Clip In, the primary button label switches for 4.5 seconds to:
  `✓ Downloaded — Tap "Open"` (translated across all 20 languages, e.g. `✓ Загружено — нажмите «Открыть»` in Russian).
- Visual treatment transforms into a reassuring emerald badge (`bg-emerald-600 border-emerald-400/30`), guiding the user's thumb directly to the browser's bottom download notification to tap "Open".

### C. Pre-filled Direct Messaging for Telegram & WhatsApp
Direct team communication icons under the Clip In form now include pre-composed introductory greetings via URI parameters:
- **Oleksii Ostroukhov:**
  - Telegram: `https://t.me/homeboylebz?text=Hey%20Alex%2C%20great%20connecting!`
  - WhatsApp: `https://wa.me/40724787390?text=Hey%20Alex%2C%20great%20connecting!`
  - Email: `mailto:alex@upraiser.co.uk?subject=Connecting%20from%20Summit&body=Hey%20Alex%2C%20great%20connecting!`
- **Vladyslav Samoilenko:**
  - Telegram: `https://t.me/Vladussoboi108?text=Hey%20Vlad%2C%20great%20connecting!`
  - Email: `mailto:ceo@upraiser.co.uk?subject=Connecting%20from%20Summit&body=Hey%20Vlad%2C%20great%20connecting!`
- Eliminates the blank chat intimidation factor; interlocutors merely tap the send arrow in their messenger to establish a permanent communication thread.

### D. Expo Pavilion Offline Protection & Head Preloading
To defend against degraded cellular connectivity inside conference venues:
1. Dynamically inserts `<link rel="preload" href="/Alex_Upraiser.vcf?v=8" as="fetch" crossOrigin="anonymous" />` into `document.head` on page load.
2. Background fetch executes with `{ cache: "force-cache" }`.
3. Combined with `vercel.json` CDN headers (`Cache-Control: public, max-age=600, stale-while-revalidate=86400`), the contact file is preserved in the browser's HTTP cache for instant retrieval even if the device momentarily drops offline.

---

## 6. Smart Telemetry Aggregator & High-Intent Digests (v2.2.59)

### A. Supabase Engagement Database Schema (`supabase/migrations/20261024_lead_activity_logs.sql`)
1. **Activity Log Table (`lead_activity_logs`):**
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `visitor_id TEXT NOT NULL` (persistent token from `localStorage`)
   - `lead_name TEXT`
   - `lead_contact TEXT`
   - `event_type TEXT NOT NULL` (`return_visit`, `deck_view`, `page_scroll`, `vcf_download`, `heartbeat`, `session_end`)
   - `duration_seconds INT DEFAULT 0` (cumulative active time)
   - `metadata JSONB DEFAULT '{}'::jsonb` (scroll depth, page URL, IP, user-agent)
   - `created_at TIMESTAMPTZ DEFAULT now()`
   - Indexed by `(visitor_id, created_at DESC)` and `event_type`.
2. **Notification Cooldown Table (`lead_notification_cooldowns`):**
   - `visitor_id TEXT PRIMARY KEY`
   - `last_notified_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `last_event_type TEXT`
   - `total_notifications INT DEFAULT 1`
   - `metadata JSONB`
3. **Row-Level Security (RLS):**
   - Strict `service_role` full access policies for backend serverless functions.
   - Anonymized `INSERT` policy for fallback client pings.

### B. Client-Side Non-Blocking Tracker (`src/lib/activityTracker.ts` & `src/hooks/useActivityTracker.ts`)
1. **Active Visibility Accounting:**
   - Increments active seconds strictly while `document.visibilityState === "visible"`.
   - Pauses counting when the browser tab is minimized, switched, or the smartphone screen locks.
2. **10-Second Heartbeat Engine:**
   - Dispatches background pings via `navigator.sendBeacon` (with fallback to `fetch` with `keepalive: true`) every 10 seconds.
   - Automatically tracks scroll milestones at 50% and 85% depth.
   - Flushes final active duration and `session_end` on `visibilitychange` to hidden or `beforeunload`.
3. **Dedicated Media Deck Web Viewer (`/deck` · `MediaDeckViewerPage.tsx`):**
   - Responsive web reader embedding `/Upraiser_Traffic_Infrastructure.pdf` with direct fullscreen and download triggers.
   - Automatically measures exact reading duration via the heartbeat hook, distinguishing casual link clicks from deep deck reviews.

### C. Serverless Aggregator & Smart Alert Dispatcher (`api/activity.ts`)
1. **High-Intent Threshold Evaluation:**
   - Triggers digest notifications only when high intent is demonstrated:
     - Cumulative active session duration $\ge 25$ seconds; OR
     - Confirmed return visit (`return_visit`); OR
     - High-value action: `vcf_download` OR `deck_view` $\ge 15$ seconds; OR deep scroll $\ge 80\%$.
2. **12-Hour Cooldown & Anti-Spam Shield:**
   - Queries `lead_notification_cooldowns` for the incoming `visitor_id`.
   - If an alert was dispatched within the previous 12 hours, new events are persisted to `lead_activity_logs` for forensic review but suppressed from re-triggering notifications.
3. **Multi-Channel Notification Dispatch:**
   - **Email via Resend:**
     - Subject: `🔁 [HIGH INTENT] [Lead Name] вернулся на сайт · Провел [X] мин`
     - Clean branded HTML digest with lead card, visit status, active duration, and chronological action timeline.
   - **Instant Telegram Bot Alert:**
     - Formatted with HTML styling and direct link to the Conference Hub for on-the-go conference follow-ups.
   - Rewritten `/api/telemetry` $\rightarrow$ `/api/activity` in `vercel.json` for unified endpoint compatibility.

## 7. Multilingual Interactive Media Deck (`/deck` · `v2.2.62-stable`)

### A. Architecture & Slide Engine (`MediaDeckViewerPage.tsx` · `mediaDeckData.ts`)
1. **Interactive Vector Slide Presentation:**
   - 20 structured slides migrated from static PDF (`/Upraiser_Traffic_Infrastructure.pdf`) into a high-performance vector web slider.
   - Fixed aspect-ratio box (`sm:aspect-[16/9]`) on desktop and tablet, dynamically adapting to full readable card heights on mobile portrait screens (`< 640px`) without text truncation or microscopic fonts.
   - Dual-Mode Switcher:
     - **Interactive Mode (Default)**: Pure React + Tailwind + SVG icons + 22-language real-time translation.
     - **Visual Mode**: High-resolution 1:1 original WebP slide graphics (`public/deck/slides/slide-01.webp` .. `slide-20.webp`, total 1.8 MB).
2. **Touch & Keyboard Ergonomics:**
   - Touch gesture support: `onTouchStart` and `onTouchEnd` swipe navigation ($\ge 45$px horizontal threshold).
   - Keyboard hotkeys: `ArrowRight` / `Space` (next), `ArrowLeft` / `Backspace` (prev), `KeyF` (fullscreen toggle).
   - Tactile touch targets $\ge 44 \times 44$px for all controls.
   - Fullscreen API support with automatic orientation scaling.
3. **Multilingual Localisation Engine (`mediaDeckI18n.ts`):**
   - Full 22-language support matching Conference Hub: EN, RU, RO, KA, ES, DE, FR, ZH, JA, KO, PT, IT, PL, TR, UK, AR, HE, HI, VI, TH, ID, FIL.
   - Dynamic device locale detection via `detectDeviceLang()`.
   - On-the-fly language modal selector updating `?lang=...` parameter in URL.
   - Directionality (`dir="rtl"`) for Arabic and Hebrew; unforced plain script for Georgian, Arabic, Hebrew, CJK, Hindi, Thai (`HUB_PLAIN_SCRIPT`).

### B. Deep Engagement Telemetry Integration
1. **Live Slide-Level Heartbeats:**
   - `useActivityTracker("media_deck_viewer")` supplies dynamic metadata getter:
     - `current_slide`: current slide index (1 to 20).
     - `total_slides`: 20.
     - `slide_title`: localized slide title.
     - `lang`: active language.
     - `viewMode`: "interactive" | "visual".
2. **Serverless Activity Reporting (`api/activity.ts`):**
   - Server-side formatters now label events with exact slide position:
     - `📊 Просмотр слайда 13/20 «High-Value Acquisition: Fanatics & Vantage Markets» (RO)`
     - `⏱ Чтение слайда 5/20 («Pillar 01 · Hardware Advantage»)`
   - Allows instant sales discovery of which vertical (iGaming, FinTech, OEM Preloads) captivated the prospect.

### C. Safe Rollback Checkpoints
- **Pre-deck Tag:** `backup-pre-deck-v2.2.61`
- **Pre-deck Branch:** `backup-pre-multilingual-deck-20261024`
- **Rollback Command:**
  ```bash
  git reset --hard backup-pre-deck-v2.2.61
  git push origin main --force
  ```

## 8. Smart Referrer & In-App Attribution Engine (`v2.2.63-stable`)

### A. Clean URL Attribution Without UTMs
- **Problem Solved:** Conference leads receive short, prestigious, clean links (`upraiser.co.uk/connect`) with zero messy tracking tags, while the engineering team preserves full origin attribution.
- **Client-Side Smart Detector (`src/lib/activityTracker.ts`):**
  1. **Referrer Analysis (`document.referrer`):**
     - Matches external domains: `LinkedIn` (`linkedin.com`, `lnkd.in`), `Telegram Web` (`t.me`), `WhatsApp Web`, `X / Twitter` (`t.co`), `Meta` (`facebook.com`, `instagram.com`), `Google Organic`, `Bing`, `MS Teams`, `Slack`, etc.
  2. **In-App Browser & Messenger Detection (`navigator.userAgent`):**
     - Operates when messengers (Telegram, WhatsApp, MS Teams, Slack) strip `document.referrer`.
     - Identifies in-app WebViews: `Telegram (In-App Browser)`, `WhatsApp (In-App Browser)`, `LinkedIn (In-App Browser)`, `MS Teams (In-App Browser)`, `X / Twitter (In-App Browser)`, `iOS In-App WebView`, `Android In-App WebView`.
     - Identifies direct entries: `Direct / Mobile Safari`, `Direct / Samsung Internet`, `Direct / Mobile Chrome`, `Direct / Clean URL Entry`.
  3. **First-Touch & Multi-Session Persistence (`localStorage`):**
     - Captures `firstTrafficSource` on Day 1 and stores it under `upraiser_hub_session_v1`.
     - Tracks `currentTrafficSource` for repeat sessions, enabling attribution models like:
       `LinkedIn (Referrer) · Повторный визит напрямую`.
- **Serverless Alerts Formatting (`api/activity.ts`):**
  - **Telegram Bot Alert:**
    `🌐 <b>Источник (Smart Detect):</b> LinkedIn (Referrer)`
  - **Resend HTML Email Digest:**
    Dedicated badge row: `🌐 LinkedIn (Referrer) (Возврат: Direct / Mobile Safari)`.


