# UPRAISER Site — Full AI Handoff Document

> **Purpose:** give another AI (or engineer) complete context to continue work without rediscovering the codebase.  
> Share this file **with the repo**. Shorter human README: `README.md`.  
> Specialized external-AI brief (hero scroll-scrub task): `CONTEXT.md`.  
> **Updated:** 23 July 2026  
> **Local path:** `Upraiser New Website Cursor Project`  
> **Production:** https://upraiser-site.vercel.app  
> **Target domain:** https://upraiser.co.uk (not on Vercel SPA yet)  
> **Git backup branch:** `backup/2026-07-23` (`817c1f4`)  
> **Zip backup:** `~/Downloads/Upraiser-site-backup-2026-07-23.zip`

---

## 0. How to use this document (for the receiving AI)

1. Read sections **1–4** (who / what / dual-mode / page map) before editing copy or layout.
2. Edit **copy and metrics** in `src/data/liveContent.ts` and `src/data/cases.ts` — not hardcode in components unless Hero slogans.
3. Preserve **dual theme = dual narrative** (`light` → growth, `dark` → infrastructure).
4. Do **not** commit or deploy unless the human explicitly asks.
5. Prefer Framer Motion **springs** (`type: "spring"`) for micro-interactions; respect `prefers-reduced-motion`.
6. Brand slogans to keep: **«Charting the Ascent»** and Hero H1 **«We see how stunning / Your rise to the top / can be.»**
7. Positioning: UPRAISER is an **agency / traffic operator** — **not** a SaaS antifraud product.
8. For UI polish, use the **refero-design** skill (research-first); do not invent a new visual system.

---

## 1. Company & product

**UPRAISER Agency LLP** — London-based (since **17 July 2017**) premium **traffic infrastructure** / mobile & web user acquisition.

| | |
|---|---|
| Verticals | iGaming, Fintech, premium media |
| Differentiator | Verified outcomes; pre-bid fraud filtration; **official Lenovo OEM partner** |
| Legal | 128 City Road, London EC1V 2NX · info@upraiser.co.uk · ICO **ZC000436** |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |

**This repo is:** single-page marketing SPA, English UI, B2B lead gen (Web3Forms).

---

## 2. Stack

| Layer | Choice |
|-------|--------|
| UI | React **19** + TypeScript |
| Build | Vite **8** |
| Styles | Tailwind CSS **v4** + modular `src/styles/*.css` (imported from `index.css`) |
| Motion | Framer Motion **12** |
| Smooth scroll | Lenis (desktop); **native scroll on mobile/touch** |
| Charts | Recharts — ambient fold charts (`ModeChart`, `FoldAreaMass`, `FraudScrollChart`) |
| Lint | oxlint |
| Hosting | Vercel **`upraiser-site-v2`** → alias `upraiser-site.vercel.app` |
| Contact | Web3Forms via `VITE_WEB3FORMS_ACCESS_KEY` |

**Installed but unused:** `@astryxdesign/core` — candidate for cleanup (do not use without ask).

```bash
npm run dev          # vite → http://localhost:5173
npm run build        # sync-assets → verify-assets → tsc -b → vite build
npm run deploy       # scripts/deploy-vercel.sh → upraiser-site-v2
npm run lint         # oxlint
npm run preview      # vite preview
npm run generate:og  # OG image (needs assets/hero video + ffmpeg)
```

**Build note:** if `assets/brand/og-image.png` is missing, run `npm run generate:og` before `build` / `deploy`.

---

## 3. Dual theme = dual SiteMode (CRITICAL)

| `data-theme` | `SiteMode` | Meaning |
|--------------|------------|---------|
| `light` | `growth` | Scale, revenue, markets, ascent |
| `dark` | `infrastructure` | Logs, fraud, bid scoring, audit, proof |

**Wiring:**

- `ThemeProvider` — `src/context/ThemeContext.tsx`
- Storage: `upraiser-theme`
- Anti-flash: inline script in `index.html`
- `useMode()` in `SectionHeader.tsx`
- Copy: `*ByMode` in `src/data/liveContent.ts`

**Hero stats:** `heroHighlightsByMode` — different metrics per mode.

### Theme switch UX (Jul 23)

| Control | Behavior |
|---------|----------|
| **Header** `ThemeToggle` | Toggle theme **in place** — stay on current scroll position |
| **About** `ThemeBridge` (bottom strip) | Toggle theme + **`scrollTo("hero")`** after ~120ms |

Mode-aware section bodies wrap with **`ModeContentTransition`** (`AnimatePresence mode="wait"`, spring fade/slide). Applied to: ValueProps, Difference, Process, TrafficChannels, Audience, Promise, CaseStudies, About. Hero stats use their own `AnimatePresence mode="wait"` group. Hero atmosphere overlays crossfade ~400ms (single video decode).

---

## 4b. Site map (Z2A-adapted, no blog) — Jul 23 2026

Reference competitor: https://www.z2adigital.com/ (structure only). Production roots: https://upraiser-site.vercel.app/

| Route | Role | Dual-mode narrative? |
|-------|------|----------------------|
| `/` | Pitch + killer folds + teasers + ThemeBridge | **Yes** — Growth / Infrastructure story |
| `/solutions` | Value · Channels · Process | Soft (theme still swaps copy where wired) |
| `/technology` | Stack, scoring, MMP logos | **No** — shared copy |
| `/partners` | Supply / monetization track | **No** — shared copy |
| `/cases` | Archive | Soft |
| `/cases/:slug` | Case detail | Soft (growth vs infra focus blocks) |
| `/about` | London · 2017 · ICO · tech preview | Soft |
| `/contact` | Request Pilot form | No |
| Blog | — | **Skipped** |

**Flows (from Z2A, adapted):**
- Advertiser: `/` → `/solutions` → `/contact`
- Depth tech: `/` → `/technology` → `/contact`
- Supply partner: `/` → `/partners` → `/contact` (intent `advertising-partner`)
- Proof: `/` → `/cases` → `/cases/:slug` → `/contact`

**Nav:** Solutions · Technology · Partners · Cases · About · theme · Request Pilot  
**Not copying from Z2A:** blog, careers microsite, resources mega-menu, personal contact pages.

SPA with **React Router** (`BrowserRouter` in `main.tsx`). Layout: `src/layouts/SiteLayout.tsx`.

```
SiteGrain · DeferredCustomCursor · Header (persistent)
Outlet:
  /  /solutions  /technology  /partners  /cases  /cases/:slug  /about  /contact
PartnersCarousel · Footer (persistent)
```

**Home (`/`):**
```
#hero → Lenovo → #audience → #solutions-teaser → #difference → #cases
→ #process-teaser → #promise → #pilot → #mode-bridge (ThemeBridge)
→ Partners (bottom) → Footer
```

**Section keyboard nav:** `hero → audience → solutions-teaser → difference → cases → process-teaser → promise → pilot`

---

## 5. Scroll Scene System (Jul 2026)

Unified scroll progress: `src/hooks/useScrollScene.ts` + `src/lib/scrollScene.ts`.

| Mode | Used by | Behavior |
|------|---------|----------|
| `runway` | Audience, Promise (`useSectionScrollProgress`) | `sectionHeight - viewport` progress; sticky 135vh desktop |
| `anchor` | Difference cards | progress from cards grid ref vs viewport lines |
| `viewportBand` | Process | section rect vs 72%/28% viewport bands |
| in-view | Value, Channels, Cases, Contact | `Reveal` / `Stagger` |

**Gate:** `useScrollRunwayEnabled()` — desktop ≥768px + not reduced motion.

**Rules:**

- Scroll-driven transforms: **`spring: false`** (locked to wheel; no floaty lag)
- Fold runway CSS: `src/styles/scroll-scene.css`, `accent-scroll.css`
- Charts morph: `useScrollMorph` in `ModeChart.tsx`
- Audience / Promise use `remountKey={mode-…}` so fold resets on theme change

---

## 6. Repository layout

```
/
├── AI_HANDOFF.md          ← this file
├── CONTEXT.md             ← external-AI brief: hero scroll-scrub (not implemented yet)
├── README.md              ← human summary
├── index.html
├── vite.config.ts         ← manual chunks: framer-motion, lenis, recharts
├── vercel.json
├── assets/                → sync → public/
├── scripts/
│   ├── sync-assets.sh
│   ├── verify-assets.sh
│   ├── deploy-vercel.sh   ← targets upraiser-site-v2
│   ├── generate-og-image.mjs
│   └── rollback-*.sh
└── src/
    ├── App.tsx
    ├── index.css          ← @theme tokens + @import styles/*
    ├── styles/            ← split CSS modules
    ├── context/
    │   ├── ThemeContext.tsx
    │   └── ScrollContext.tsx
    ├── data/
    │   ├── liveContent.ts
    │   ├── cases.ts
    │   ├── partners.ts
    │   └── scrollSections.ts
    ├── lib/
    │   ├── accent.ts
    │   ├── motion.ts
    │   ├── clamp.ts
    │   ├── scrollScene.ts
    │   ├── cn.ts
    │   ├── contactIntent.ts
    │   └── valueIconSync.ts
    ├── hooks/
    │   ├── useScrollScene.ts
    │   ├── useCarouselActiveIndex.ts
    │   ├── useInView.ts
    │   └── …
    └── components/
        ├── motion/ModeContentTransition.tsx
        ├── lucide-animated/   ← animated glyphs for ValueProps
        └── …
```

---

## 7. Components (key files)

### Shell

`Header`, `Footer`, `SmoothScroll`, `ScrollLink`, `SectionNav`, `MobileSectionNav`, `SiteGrain`, `CustomCursor`, `ThemeToggle`, `ThemeBridge`

### Hero

| File | Role |
|------|------|
| `Hero.tsx` | Slogan, H1, lede, founded line, CTAs, mode-aware stats |
| `HeroAtmosphere.tsx` | Mountains loop video + theme overlay crossfade + cursor spotlight |
| `LenovoTrustStrip.tsx` | Partner strip under hero |

**Hero stats (Jul 23):**

- Desktop: 2×2 grid; **no pagination dots**
- Mobile: horizontal snap carousel + **dots** (`.hero-stats-dots`) — dots = card pagination, **not** theme switch
- Mode change: `AnimatePresence mode="wait"` — old set exits fully, then new set enters (stagger)

**Hero spotlight (dark):** soft dim + corner-lock upper-right (stat cards zone). Cursor lerp ~0.05. Copy-wash left-only gradient. Video: `object-fit: cover`, `object-position: center 58%`, **never `scale < 1`**.

### Scroll folds

| File | Role |
|------|------|
| `AccentScrollFold.tsx` | Sticky hero word → inline word morph |
| `Audience.tsx` | `#audience` — growth: chart; infra: fraud chart |
| `PromiseSection.tsx` | `#promise` — `FoldAreaMass` area chart |
| `ModeChart.tsx` | Scroll-synced LineChart + ghost metrics |
| `FoldAreaMass.tsx` | Scroll-synced stacked area (RESULTS/CLARITY) |
| `FraudScrollChart.tsx` | Infrastructure fraud radial scroll chart |

**Charts:** desktop ≥768px only; hidden on mobile/reduced motion.

### Why Us / Value / Cases

| File | Role |
|------|------|
| `Difference.tsx` | 3 cards; desktop anchor spawn; mobile Stagger |
| `ValueProps.tsx` | Bento + `ValueBentoIcon` / Lucide animated glyphs |
| `CaseStudies.tsx` | Desktop infinite carousel; mobile accordion; brand headers + logos under `public/cases/logos/` |
| `CaseBrandHeader.tsx` | Case card brand chrome |

### Other sections

`TrafficChannels`, `SlideTabs`, `About`, `Process`, `Contact`, `ContactFormField`, `PartnersCarousel`, `SectionHeader`, `SectionAmbience`, `BorderBeam`, `ClarityLedger`

### Motion

`motion/Reveal.tsx`, `motion/Stagger.tsx`, `motion/ModeContentTransition.tsx`, `motion-preview/Magnetic.tsx`

---

## 8. Hooks (current)

| Hook | Purpose |
|------|---------|
| `useMode` | theme → growth \| infrastructure |
| `useScrollScene` | unified runway / anchor / viewportBand progress |
| `useScrollMorph` | rAF-lerped chart morph from scroll progress |
| `useSectionScrollProgress` | runway wrapper for accent folds |
| `useSectionMeasure` | hero word fold geometry |
| `useScrollRunwayEnabled` | desktop runway gate |
| `useHeroCursorLight` | CSS vars `--hero-light-x/y` |
| `useHeroMobileLite` | lighter hero on mobile |
| `useReducedMotion` | a11y gate |
| `useActiveSection` | nav highlight |
| `usePreferNativeScroll` | disable Lenis on touch |
| `useInViewOnce` | one-shot IO |
| `useInView` | continuous IO helper |
| `useCountUp` | stat animation |
| `useCarouselActiveIndex` | hero mobile stats dots |

---

## 9. Data layer

**Primary:** `src/data/liveContent.ts`

- `heroLede`, `heroFounded`, `heroHighlightsByMode`
- `audienceByMode`, `promiseByMode`, `valueByMode`
- `differenceByMode`, `processByMode`, `trafficChannelsByMode`
- `sectionsByMode`, `bridgeByMode`, `technologyByMode`
- `navLinks`, `footerLinks`, `lenovoPartnership`, `primaryCta`

**Cases:** `src/data/cases.ts` (+ logos in `public/cases/logos/`)  
**Partners:** `src/data/partners.ts`

**Copy rules:** UPRAISER ALL CAPS · You/Your capital Y · hard metrics in body · not antifraud SaaS pitch · London-based since 2017 where About mentions founding

---

## 10. Design tokens

Theme tokens in `src/index.css` (`@theme` + `[data-theme=…]`).

Shared layout tokens in `src/styles/base.css`:

- `--site-header-height`, `--scroll-sticky-top`, `--scroll-margin-section`
- `--section-stack-gap`, `--card-pad`, `--hero-stat-min-h`, `.section-stack`

Motion: `src/lib/motion.ts` — `SPRING`, `SPRING_SOFT`, `viewportOnce`

---

## 11. Performance & loading

- Lazy sections + idle preload in `App.tsx`
- Manual chunks: `framer-motion`, `lenis`, `recharts`
- Hero video ~7 MB — no re-encode (owner decision)
- Hero entrance CSS-first; fold pulls Recharts chunk on desktop
- Atmosphere: **one** video element; theme change crossfades overlays only

---

## 12. Contact form

```env
VITE_WEB3FORMS_ACCESS_KEY=...
```

`Contact.tsx` + `ContactFormField.tsx` (BorderBeam on focus — subtle).  
`deploy-vercel.sh` syncs key to Vercel env from local `.env`.

---

## 13. Deploy / Vercel (critical)

| | |
|---|---|
| **Production URL** | https://upraiser-site.vercel.app |
| **Vercel project** | **`upraiser-site-v2`** (not `upraiser-site`) |
| **Team** | `alex-3152s-projects` |
| **Vercel account** | `alex-3152` · `alex@upraiser.co.uk` |
| **GitHub** | `hmblps/upraiser-site` · branch `main` |
| **Git author (required)** | `alex@upraiser.co.uk` — verified on GitHub |

### Working deploy path

```bash
# Prefer verified GitHub email as author
npm run deploy   # prebuilt local build → upraiser-site-v2 → aliases upraiser-site.vercel.app
```

**Last production deploy (this handoff):** 23 Jul 2026 — mode transitions, hero polish, case logos, pre–IA-split snapshot.

### Do not

- Deploy to project `upraiser-site` expecting `upraiser-site.vercel.app` to update
- Use `homeboyleps@gmail.com` as git author (email taken on another GitHub account)

### Local backups (23 Jul 2026)

| Kind | Location |
|------|----------|
| Git branch | `backup/2026-07-23` |
| Zip | `~/Downloads/Upraiser-site-backup-2026-07-23.zip` (~162 MB, no `node_modules`) |

---

## 14. Known gaps / polish backlog

1. **Git → Vercel auto-deploy** — connect repo to `upraiser-site-v2` in dashboard  
2. **og:image URL** — still points to vercel.app; update when `upraiser.co.uk` live  
3. **IA split (planned, not started)** — shorter homepage (pitch) + depth routes (`/cases`, `/channels`, `/how-we-work`, `/about`, `/contact`); see §15  
4. **Hero scroll-scrub ascent video** — designed in `CONTEXT.md`; **not implemented**; needs final MP4  
5. **Partner logos** — partial set in `public/partners/`  
6. **Case overlap** with Thing Or Two (Fiverr, Azar, Banco Azteca) — content/legal review  
7. **Duplicate React key** `#contact` in nav (known, low priority)  
8. **`@astryxdesign/core`** — unused dependency  
9. **Infrastructure hero stat labels** — long strings may wrap despite clamp  

---

## 15. Product direction — IA split (IN PROGRESS / shipped v1)

**Shipped 23 Jul 2026 (v1):** React Router pages + shortened home.

| Route | Content |
|-------|---------|
| `/` | Hero → Lenovo → **Audience fold** → Difference → Cases teaser → **Promise fold** → Pilot CTA |
| `/solutions` | Value, Channels, Process |
| `/cases` | Full case archive |
| `/about` | About + technology + ThemeBridge |
| `/contact` | Contact form |

**Killer feature rule:** AccentScrollFold + ambient charts (Audience / Promise) live on **home**, not buried on `/solutions`.

**Still later:** `/cases/:slug`, Google/Meta partner certification badges (not Snapchat), hero scroll-scrub (`CONTEXT.md`).

Compressing the page may expose content gaps (segment strip, clearer offer) — fill with short bridges, not by restoring full runway on home.

---

## 16. Recent decisions (Jul 2026)

### Jul 21

- Scroll Scene System — unified progress across fold / cards / process  
- Why Us cards — anchor spawn desktop, Stagger mobile  
- Hero dark spotlight polish; CSS split into `src/styles/`  
- Deploy target corrected to **upraiser-site-v2**

### Jul 23

- `ModeContentTransition` site-wide for mid-scroll theme changes  
- Hero stats `mode="wait"`; mobile dots only; atmosphere overlay crossfade  
- ThemeBridge → scroll to hero; Header toggle stays in place  
- Case brand logos + accordion/carousel polish  
- Copy refresh (lede, founded line, section titles)  
- Backup branch + zip before planned IA work  
- Agreed: explore shorter homepage + depth pages (not implemented)

---

## 17. Agent rules (owner)

- Commit / push / deploy **only when explicitly asked**  
- UI copy **English**; chat with owner can be Russian  
- Don't add third scroll-moment or hero orbs without approval  
- Use refero-design / motion skills when doing UI polish  
- Trust **App.tsx** + this file over stale comments  
- Prefer Framer Motion springs; check 21st.dev MCP before inventing UI from scratch when relevant  

---

## 18. Quick “where do I change X?”

| Change… | File |
|---------|------|
| Hero copy / stats | `Hero.tsx`, `liveContent.ts` → `heroHighlightsByMode`, `heroLede`, `heroFounded` |
| Mode crossfade wrapper | `motion/ModeContentTransition.tsx` |
| Section copy | `liveContent.ts` → `*ByMode`, `sectionsByMode` |
| Why Us cards | `liveContent.ts` → `differenceByMode`, `Difference.tsx` |
| Scroll fold ambient | `Audience.tsx` / `PromiseSection.tsx` → `ambient=` |
| Scroll timing | `useScrollScene.ts`, `scrollScene.ts`, `scroll-scene.css` |
| Hero spotlight / video | `hero.css`, `HeroAtmosphere.tsx`, `useHeroCursorLight.ts` |
| Theme stay vs scroll-home | `ThemeToggle.tsx` vs `ThemeBridge.tsx` |
| Theme colors | `index.css`, `styles/base.css` |
| Section order | `App.tsx` + `scrollSections.ts` |
| Deploy | `scripts/deploy-vercel.sh`, Vercel dashboard |
| Contact key | `.env` + Vercel env |
| Hero scroll-scrub plan | `CONTEXT.md` (not shipped) |

---

## 19. Sanity checklist

- [ ] `npm run build` passes (OG image present or regenerated)  
- [ ] Light/dark — copy, stats, charts appropriate per mode  
- [ ] Header theme toggle: stay in place + section content wait-transition  
- [ ] ThemeBridge: switches + scrolls to hero  
- [ ] Desktop: Audience/Promise fold + chart morph  
- [ ] Desktop: Why Us cards spawn on scroll into grid  
- [ ] Mobile: hero stats carousel + dots; no desktop dots  
- [ ] Mobile: static/Stagger fallbacks, no broken opacity  
- [ ] `git log -1` author OK before Vercel Git deploy  
- [ ] Deploy to **upraiser-site-v2**; verify `upraiser-site.vercel.app`  

---

*End of handoff. Update this file when architecture, deploy, or page map changes.*
