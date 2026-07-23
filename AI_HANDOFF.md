# UPRAISER Site — Full AI Handoff Document

> **Purpose:** give another AI (or engineer) complete context to continue work without rediscovering the codebase.  
> Share this file **with the repo**. Shorter human README: `README.md`.  
> **Updated:** 21 July 2026  
> **Local path:** `Upraiser New Website Cursor Project`  
> **Production:** https://upraiser-site.vercel.app  
> **Target domain:** https://upraiser.co.uk (not on Vercel SPA yet)

---

## 0. How to use this document (for the receiving AI)

1. Read sections **1–4** (who / what / dual-mode / page map) before editing copy or layout.
2. Edit **copy and metrics** in `src/data/liveContent.ts` and `src/data/cases.ts` — not hardcode in components unless Hero slogans.
3. Preserve **dual theme = dual narrative** (`light` → growth, `dark` → infrastructure).
4. Do **not** commit or deploy unless the human explicitly asks.
5. Prefer Framer Motion **springs** (`type: "spring"`) for micro-interactions; respect `prefers-reduced-motion`.
6. Brand slogans to keep: **«Charting the Ascent»** and Hero H1 **«We see how stunning / Your rise to the top / can be.»**
7. Positioning: UPRAISER is an **agency / traffic operator** — **not** a SaaS antifraud product.

---

## 1. Company & product

**UPRAISER Agency LLP** — UK-based premium **traffic infrastructure** / mobile & web user acquisition.

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

**Removed deps from active use:** `@react-three/fiber`, `@react-three/drei`, `three` (if still in package.json — candidates for cleanup).

```bash
npm run dev          # vite → http://localhost:5173
npm run build        # sync-assets → verify-assets → tsc -b → vite build
npm run deploy       # scripts/deploy-vercel.sh → upraiser-site-v2
npm run lint         # oxlint
npm run preview      # vite preview
npm run generate:og  # OG image helper
```

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

---

## 4. Page structure (App.tsx order — source of truth)

```
SiteGrain
DeferredCustomCursor
Header (fixed)
main.site-main:
  #hero              Hero + HeroAtmosphere
  LenovoTrustStrip   (below hero wrapper)
  #audience          Audience — AccentScrollFold ambient chart/fraud
  #difference        Difference — Why Us header + 3 cards
  #process           Process — scroll step rail
  #value             ValueProps
  #channels          TrafficChannels
  #cases             CaseStudies carousel
  #promise           PromiseSection — AccentScrollFold ambient bars
  #about             About (+ technology list)
  #contact           Contact — Web3Forms
PartnersCarousel
Footer
MobileSectionNav
SectionNav (desktop ↑↓)
optional ApplePreviewPanel (?preview=…)
```

**Nav IDs** (`src/data/scrollSections.ts`):

`hero → audience → difference → process → value → channels → cases → promise → about → contact`

**Removed (do not resurrect unless asked):**

- `Objectives.tsx`, `Testimonials.tsx`, `Technology.tsx` (standalone)
- `GrowthScrollBlock.tsx`, `PromiseScrollBlock.tsx` → `AccentScrollFold`
- `BackgroundGlow.tsx`, `FraudRadialChart.tsx`
- `src/data/content.ts` → `liveContent.ts`
- `FoldBarList.tsx` → `FoldAreaMass.tsx`

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

---

## 6. Repository layout

```
/
├── AI_HANDOFF.md          ← this file
├── README.md              ← human summary
├── index.html
├── vite.config.ts         ← manual chunks: framer-motion, lenis, recharts
├── vercel.json
├── assets/                → sync → public/
├── scripts/
│   ├── sync-assets.sh
│   ├── verify-assets.sh
│   ├── deploy-vercel.sh   ← targets upraiser-site-v2
│   └── rollback-*.sh
└── src/
    ├── App.tsx
    ├── index.css          ← @theme tokens + @import styles/*
    ├── styles/            ← split CSS modules (Jul 2026)
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
    │   └── scrollScene.ts
    ├── hooks/
    │   ├── useScrollScene.ts
    │   ├── useScrollMorph.ts
    │   ├── useSectionScrollProgress.ts  (+ useSectionMeasure)
    │   ├── useHeroCursorLight.ts
    │   └── …
    └── components/
```

---

## 7. Components (key files)

### Shell

`Header`, `Footer`, `SmoothScroll`, `ScrollLink`, `SectionNav`, `MobileSectionNav`, `SiteGrain`, `CustomCursor`, `ThemeToggle`

### Hero

| File | Role |
|------|------|
| `Hero.tsx` | Slogan, H1, lede, CTAs, mode-aware stat cards |
| `HeroAtmosphere.tsx` | Mountains video + cursor spotlight (mask punch-through) |
| `LenovoTrustStrip.tsx` | Partner strip under hero |

**Hero spotlight (dark):** soft dim layer + corner-lock upper-right (stat cards zone). Cursor lerp ~0.05. Copy-wash left-only gradient.

### Scroll folds

| File | Role |
|------|------|
| `AccentScrollFold.tsx` | Sticky hero word → inline word morph |
| `Audience.tsx` | `#audience` — growth: `FoldChart`; infra: `FraudScrollChart` |
| `PromiseSection.tsx` | `#promise` — `FoldAreaMass` area chart |
| `ModeChart.tsx` | Scroll-synced LineChart + ghost metrics |
| `FoldAreaMass.tsx` | Scroll-synced stacked area (RESULTS/CLARITY) |
| `FraudScrollChart.tsx` | Infrastructure fraud radial scroll chart |
| `LineChart.tsx` | Recharts wrapper |

**Charts:** desktop ≥768px only; hidden on mobile/reduced motion.

### Why Us

| File | Role |
|------|------|
| `Difference.tsx` | Header + 3 cards from `differenceByMode` |
| Desktop | `useScrollScene` anchor spawn on cards grid |
| Mobile | `Stagger` in-view |

### Other sections

`ValueProps`, `TrafficChannels`, `SlideTabs`, `CaseStudies`, `About`, `Process`, `Contact`, `ContactFormField`, `PartnersCarousel`, `SectionHeader`, `SectionAmbience`, `BorderBeam`

### Motion

`motion/Reveal.tsx`, `motion/Stagger.tsx`, `motion-preview/Magnetic.tsx`

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
| `useCountUp` | stat animation |

**Removed / unused:** `useProximityGlow`, `useMagneticElement`, `useHorizontalScrollProgress` (if deleted)

---

## 9. Data layer

**Primary:** `src/data/liveContent.ts`

- `heroHighlightsByMode`, `audienceByMode`, `promiseByMode`, `valueByMode`
- `differenceByMode` — **used** in Difference cards
- `processByMode`, `channelsByMode`, `sectionsByMode`, `bridgeByMode`
- `navLinks`, `footerLinks`, `lenovoPartnership`

**Cases:** `src/data/cases.ts`  
**Partners:** `src/data/partners.ts`

**Copy rules:** UPRAISER ALL CAPS · You/Your capital Y · hard metrics in body · not antifraud SaaS pitch

---

## 10. Design tokens

Theme tokens in `src/index.css` (`@theme` + `[data-theme=…]`).

Shared layout tokens in `src/styles/base.css`:

- `--site-header-height`, `--scroll-sticky-top`, `--scroll-margin-section`
- `--section-stack-gap`, `--card-pad`, `.section-stack`

Motion: `src/lib/motion.ts` — `SPRING`, `SPRING_SOFT`, `viewportOnce`

---

## 11. Performance & loading

- Lazy sections + idle preload in `App.tsx`
- Manual chunks: `framer-motion`, `lenis`, `recharts`
- Hero video ~7 MB — no re-encode (owner decision)
- Hero entrance CSS-first; fold pulls Recharts chunk on desktop

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

### Blocked deploy causes (seen Jul 2026)

1. **Git author `homeboyleps@gmail.com`** — not on GitHub account / Vercel can't match → **Blocked**
2. **CLI + gmail author** — "not a member of the team" on Hobby plan
3. **Git not connected** to `upraiser-site-v2` — push doesn't auto-deploy

### Working deploy path (Jul 21 2026)

```bash
git config --global user.email "alex@upraiser.co.uk"
npm run deploy   # prebuilt local build → upraiser-site-v2 → aliases upraiser-site.vercel.app
```

Or: push to `main` with correct author **after** connecting Git in Vercel dashboard to **upraiser-site-v2**.

### Do not

- Deploy to project `upraiser-site` expecting `upraiser-site.vercel.app` to update
- Use `homeboyleps@gmail.com` as git author (email taken on another GitHub account)

---

## 14. Known gaps / polish backlog

1. **Git → Vercel auto-deploy** — connect repo to `upraiser-site-v2` in dashboard  
2. **og:image URL** — still points to vercel.app; update when `upraiser.co.uk` live  
3. **Contact BorderBeam** — subtle / sometimes invisible (not critical)  
4. **Traffic channels mobile** — horizontal scroll tabs; accordion optional  
5. **Partner logos** — partial set in `public/partners/`  
6. **Case studies** — dense cards; metric hierarchy polish suggested  
7. **three.js deps** — unused, removable  

---

## 15. Recent decisions (Jul 2026)

- Scroll Scene System — unified scroll progress across fold / cards / process  
- Why Us cards — anchor spawn desktop, Stagger mobile, compact section (no 128vh runway)  
- Hero dark spotlight — softer, less contrast, mountains brighten at cursor  
- CSS split into `src/styles/` modules  
- Difference section wired with `differenceByMode` cards  
- Deploy target corrected to **upraiser-site-v2**  
- Production live Jul 21 2026 with scroll charts + new Why Us  

---

## 16. Agent rules (owner)

- Commit / push / deploy **only when explicitly asked**  
- UI copy **English**; chat with owner can be Russian  
- Don't add third scroll-moment or hero orbs without approval  
- Use refero-design / motion skills when doing UI polish  
- Trust **App.tsx** + this file over stale comments  

---

## 17. Quick “where do I change X?”

| Change… | File |
|---------|------|
| Hero copy / stats | `Hero.tsx`, `liveContent.ts` → `heroHighlightsByMode` |
| Section copy | `liveContent.ts` → `*ByMode`, `sectionsByMode` |
| Why Us cards | `liveContent.ts` → `differenceByMode`, `Difference.tsx` |
| Scroll fold ambient | `Audience.tsx` / `PromiseSection.tsx` → `ambient=` |
| Scroll timing | `useScrollScene.ts`, `scrollScene.ts`, `scroll-scene.css` |
| Hero spotlight | `hero.css`, `HeroAtmosphere.tsx`, `useHeroCursorLight.ts` |
| Theme colors | `index.css`, `styles/base.css` |
| Section order | `App.tsx` + `scrollSections.ts` |
| Deploy | `scripts/deploy-vercel.sh`, Vercel dashboard |
| Contact key | `.env` + Vercel env |

---

## 18. Sanity checklist

- [ ] `npm run build` passes  
- [ ] Light/dark — copy, stats, charts appropriate per mode  
- [ ] Desktop: Audience/Promise fold + chart morph  
- [ ] Desktop: Why Us cards spawn on scroll into grid  
- [ ] Mobile: static/Stagger fallbacks, no broken opacity  
- [ ] `git log -1` shows `alex@upraiser.co.uk` before deploy  
- [ ] Deploy to **upraiser-site-v2**; verify `upraiser-site.vercel.app` last-modified  

---

*End of handoff. Update this file when architecture, deploy, or page map changes.*
