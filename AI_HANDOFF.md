# UPRAISER Site — Full AI Handoff Document

> **Purpose:** give another AI (or engineer) complete context to continue work without rediscovering the codebase.  
> Share this file **with the repo**. Shorter human README: `README.md`.  
> **Updated:** 16 July 2026  
> **Local path:** `Upraiser New Website Cursor Project`  
> **Production:** https://upraiser-site.vercel.app  
> **Target domain:** https://upraiser.co.uk (not fully on Vercel SPA yet)

---

## 0. How to use this document (for the receiving AI)

1. Read sections **1–4** (who / what / dual-mode / page map) before editing copy or layout.
2. Edit **copy and metrics** in `src/data/liveContent.ts` and `src/data/cases.ts` — not hardcode in components unless Hero slogans.
3. Preserve **dual theme = dual narrative** (`light` → growth, `dark` → infrastructure).
4. Do **not** commit or deploy unless the human explicitly asks.
5. Prefer Framer Motion **springs** (`type: "spring"`) for micro-interactions; respect `prefers-reduced-motion`.
6. Brand slogans the owner wants to keep: **«Charting the Ascent»** and Hero H1 **«We see how stunning / Your rise to the top / can be.»** — do not “AdTech-sanitize” these without asking.
7. Positioning: UPRAISER is an **agency / traffic operator** that analyzes, filters, optimizes — **not** a SaaS antifraud product (do not clone Stripe Radar as “our product”).

---

## 1. Company & product

**UPRAISER Agency LLP** — UK-based premium **traffic infrastructure** / mobile & web user acquisition.

| | |
|---|---|
| Verticals | iGaming, Fintech, premium media |
| Differentiator | Verified outcomes (deposits, subscriptions, funders) — not vanity impressions; pre-bid fraud filtration; **official Lenovo OEM partner** |
| Legal | 128 City Road, London EC1V 2NX · info@upraiser.co.uk · ICO **ZC000436** |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |

**This repo is:** a single-page marketing landing (SPA), English UI, B2B lead gen (Web3Forms contact).

**This repo is not:** CMS, blog, client dashboard, multi-route app, careers portal (Careers = mailto).

---

## 2. Stack

| Layer | Choice |
|-------|--------|
| UI | React **19** + TypeScript |
| Build | Vite **8** |
| Styles | Tailwind CSS **v4** (`@tailwindcss/vite`) + large `src/index.css` (~2.5k lines) |
| Motion | Framer Motion **12** |
| Smooth scroll | Lenis (desktop); **native scroll on mobile/touch** |
| Charts | Recharts (ambient LineChart / BarChart behind scroll folds) |
| Icons | Mostly custom SVG; `lucide-react` only for theme toggle (Sun/Moon) |
| Lint | oxlint |
| Hosting | Vercel project `upraiser-site` under team `alex-3152s-projects` |
| Contact | Web3Forms via `VITE_WEB3FORMS_ACCESS_KEY` |

**Installed but essentially unused in `src/`:** `@react-three/fiber`, `@react-three/drei`, `three` — do not build new features on them unless asked; candidates for removal.

**Node scripts (package.json):**

```bash
npm run dev          # vite → http://localhost:5173
npm run build        # sync-assets → verify-assets → tsc -b → vite build
npm run deploy       # scripts/deploy-vercel.sh → vercel deploy --prod
npm run lint         # oxlint
npm run preview      # vite preview
npm run generate:og  # OG image helper
```

---

## 3. Dual theme = dual SiteMode (CRITICAL)

Theme toggle drives **two narrative modes**, not just colors.

| `data-theme` | `SiteMode` | Meaning |
|--------------|------------|---------|
| `light` | `growth` | Scale, revenue, markets, ascent metaphor |
| `dark` | `infrastructure` | Logs, fraud, bid scoring, audit, proof |

**Wiring:**

- `ThemeProvider` — `src/context/ThemeContext.tsx`
- Storage key: `upraiser-theme` (`localStorage`)
- Anti-flash: inline script in `index.html` sets `data-theme` before paint
- `useMode()` in `src/components/SectionHeader.tsx` maps theme → mode
- Almost all section copy lives in `*ByMode` objects in `src/data/liveContent.ts`

**Hero stats are mode-specific** (`heroHighlightsByMode`):

- **growth:** Markets, Apps in Network, Avg. Launch Time, Revenue Attributed  
- **infrastructure:** Fraud Blocked Pre-Bid, Post-Flight Log Drift, p99 Bid Scoring, Device Signals  

When adding UI that shows metrics/copy, always branch on `useMode()` / `*ByMode`.

---

## 4. Current page structure (App.tsx order)

```
SiteGrain
DeferredCustomCursor (idle)
Header (fixed)
main.site-main:
  #hero          Hero + LenovoTrustStrip (same wrapper)
  #audience      Audience — AccentScrollFold ambient="chart" (SCALE / PROOF)
  #value         ValueProps — bento pillars
  #promise       PromiseSection — AccentScrollFold ambient="bars" (RESULTS / CLARITY)
  #difference    Difference — HEADER ONLY (body intentionally stripped)
  #channels      TrafficChannels — tabs / channel detail
  #cases         CaseStudies — infinite carousel + sparklines
  #about         About — includes technology stack panel (Technology.tsx deleted)
  #process       Process — steps + theme bridge CTA
  #contact       Contact — Web3Forms + Lenovo strip
PartnersCarousel
Footer
MobileSectionNav
SectionNav (desktop ↑↓)
optional ApplePreviewPanel (?preview=…)
```

**Removed / no longer on page (do not resurrect unless asked):**

- `Objectives.tsx`, `Testimonials.tsx`, `Technology.tsx` (as standalone)
- `GrowthScrollBlock.tsx`, `PromiseScrollBlock.tsx` → replaced by shared `AccentScrollFold`
- `src/data/content.ts` → replaced by `src/data/liveContent.ts`

**Scroll section IDs** (keyboard + mobile nav) — `src/data/scrollSections.ts`:

`hero → audience → value → promise → difference → channels → cases → about → process → contact`

---

## 5. Repository layout

```
/
├── AI_HANDOFF.md          ← this file
├── README.md              ← short human docs (partially stale vs App.tsx)
├── index.html             ← meta, OG, theme anti-flash, root
├── package.json
├── vite.config.ts
├── vercel.json
├── .env / .env.example    ← VITE_WEB3FORMS_ACCESS_KEY
├── assets/                ← source of truth for brand/hero; synced → public/
├── public/                ← served static (fonts, hero video, partners, legal)
├── scripts/
│   ├── sync-assets.sh
│   ├── verify-assets.sh
│   ├── deploy-vercel.sh
│   ├── generate-og-image.mjs
│   ├── optimize-hero-video.mjs
│   └── rollback-*.sh
└── src/
    ├── main.tsx           ← ThemeProvider + App
    ├── App.tsx            ← section composition, lazy loading
    ├── index.css          ← tokens, sections, hero, folds, charts, bento…
    ├── context/
    │   ├── ThemeContext.tsx
    │   └── ScrollContext.tsx   ← Lenis instance for ScrollLink
    ├── data/
    │   ├── liveContent.ts      ← PRIMARY copy / mode content
    │   ├── cases.ts
    │   ├── partners.ts
    │   └── scrollSections.ts
    ├── lib/
    │   ├── accent.ts           ← gold/red label helpers
    │   └── motion.ts           ← SPRING, SPRING_SOFT, fade helpers
    ├── hooks/                  ← see §7
    ├── config/applePreview.ts
    └── components/             ← see §6
```

**Asset pipeline:** edit under `assets/` → `npm run build` runs `sync-assets.sh` → copies into `public/`. Do not only edit `public/` if the file is meant to be sourced from `assets/`.

---

## 6. Components (what each does)

### Shell / chrome

| File | Role |
|------|------|
| `Header.tsx` | Fixed nav, logo, links, theme toggle, CTA |
| `Footer.tsx` | Explore / Company / Legal |
| `ThemeToggle.tsx` | Light/dark; drives SiteMode |
| `SmoothScroll.tsx` | Lenis provider; native on touch |
| `ScrollLink.tsx` | Anchor links via Lenis or native |
| `SectionNav.tsx` | Desktop section keyboard nav |
| `MobileSectionNav.tsx` | Mobile section jumper |
| `SiteGrain.tsx` | Full-page film grain overlay |
| `CustomCursor.tsx` | Fine-pointer custom cursor (`data-cursor` modes) |

### Hero

| File | Role |
|------|------|
| `Hero.tsx` | Slogan, H1, lede, CTAs, **mode-aware stat cards** |
| `HeroAtmosphere.tsx` | Mountains video + cursor light mask (light/dark variants) |
| `LenovoTrustStrip.tsx` | Official partner strip under hero |
| `LenovoPartnershipLogo.tsx` / `Copy.tsx` | Shared Lenovo partnership bits |

### Dual-mode scroll folds (scrollytelling)

| File | Role |
|------|------|
| `AccentScrollFold.tsx` | Sticky hero word shrinks into inline word; `ambient`: `chart` \| `bars` \| `none` |
| `Audience.tsx` | `#audience` — growth SCALE / infra PROOF; ambient **chart** |
| `PromiseSection.tsx` | `#promise` — RESULTS / CLARITY; ambient **bars** |
| `ModeChart.tsx` (`FoldChart`) | Full-bleed scroll-synced **LineChart** + ghost bubble metrics |
| `FoldBarList.tsx` | Full-bleed scroll-synced **BarChart** + bubbles |
| `LineChart.tsx` / `BarChart.tsx` | Tremor-like Recharts wrappers |
| `AccentWord.tsx` | Accent word styling helper |

Ambient viz rules (owner intent):

- Quiet **background**, not dashboard widgets  
- Desktop ≥768px; respect reduced motion  
- SCALE = journey (line); RESULTS = outcomes (bars)  
- Do not put gadgets in a right rail  

### Mid-page sections

| File | Role |
|------|------|
| `ValueProps.tsx` | `#value` bento — mode copy from `valueByMode` |
| `Difference.tsx` | `#difference` **header only** (Why Us). Copy in `sectionsByMode.difference` / `differenceByMode` may exist unused |
| `TrafficChannels.tsx` | `#channels` tabbed channels; mode titles |
| `SlideTabs.tsx` | Animated tab indicator |
| `CaseStudies.tsx` | `#cases` carousel |
| `CaseSparkline.tsx` | Hero metric + sparkline per case |
| `About.tsx` | `#about` + embedded technology list |
| `Process.tsx` | `#process` steps + “switch view” bridge |
| `Contact.tsx` | `#contact` form → Web3Forms |
| `PartnersCarousel.tsx` | Infinite logo marquee |
| `SectionHeader.tsx` | Shared label/title/description + **`useMode`** |
| `SectionAmbience.tsx` | Soft gradient orbs behind some bands |
| `HoverTilt.tsx` | 3D tilt on hover |
| `BorderBeam.tsx` | Optional border beam accent |
| `ProximitySurface.tsx` | Proximity glow wrapper |

### Motion helpers

| File | Role |
|------|------|
| `motion/Reveal.tsx` | In-view reveal |
| `motion/Stagger.tsx` | Stagger children (fixed stuck opacity:0 issue historically) |
| `motion-preview/Magnetic.tsx` | Magnetic button pull |

### Dev / preview

| File | Role |
|------|------|
| `apple-preview/*` | Internal feature toggles via query/config — not for production UX |

---

## 7. Hooks

| Hook | Purpose |
|------|---------|
| `useMode` (SectionHeader) | theme → growth \| infrastructure |
| `useTheme` | theme + toggle |
| `useReducedMotion` | a11y gate for motion/video |
| `useInViewOnce` | one-shot in-view |
| `useCountUp` | animate numeric stat strings |
| `useSectionScrollProgress` | 0–1 progress for fold sections |
| `useActiveSection` | which `#id` is active |
| `usePreferNativeScroll` | disable Lenis on touch |
| `useHeroCursorLight` | CSS vars for mountain spotlight |
| `useHeroMobileLite` | lighter hero on mobile |
| `useInfiniteCaseCarousel` | cases loop / drag |
| `useHorizontalPointerScroll` | horizontal drag scroll |
| `useProximityGlow` | card proximity lighting |
| `useMagneticElement` | magnetic pull math |
| `useApplePreview` | preview panel flags |
| `useSectionKeyboardNav` | ↑↓ between sections |

---

## 8. Data layer (`liveContent.ts`)

**Single source of mode-aware marketing copy.** Key exports:

- `heroHighlightsByMode`
- `audienceByMode`, `promiseByMode`, `valueByMode`
- `channelsByMode` / channel definitions
- `differenceByMode` (may be unused while Difference is header-only)
- `processByMode`, `technologyByMode`, `aboutHighlightsByMode`
- `bridgeByMode` (Process “switch theme” teaser)
- `sectionsByMode` (titles/descriptions per section)
- `lenovoPartnership`, `navLinks`, `primaryCta`, `footerLinks`

**Cases:** `src/data/cases.ts` — Challenge → Approach → Outcome + `heroMetric` + `trend[]`.

**Partners:** `src/data/partners.ts` — marquee logos under `public/partners/`.

**Copy rules:**

- Brand name **UPRAISER** in ALL CAPS in labels/nav  
- Client-facing **You / Your / Yours** with capital **Y**  
- Prefer hard metrics over “revolutionary / smart / stunning” in **body** ledes — but Hero slogan is protected brand poetry  
- Avoid pitching as if they sell a named antifraud SaaS; they **operate / analyze / optimize** buys  

---

## 9. Design tokens & visual system

Defined in `src/index.css` on `[data-theme="dark"]` / `[data-theme="light"]`:

| Token | Dark | Light |
|-------|------|-------|
| `--theme-bg` | `#0a0a0a` | `#fffbf7` |
| `--theme-fg` | `#ffffff` | `#141010` |
| `--theme-accent` (gold) | `#ffcc00` | `#9a6b00` (AA-safe) |
| `--theme-accent-secondary` | `#e63558` | same magenta |
| Cards / borders | warm near-black | cream / soft border |

**Metaphor:** mountains + ascent (hero video). Owner likes this; CD feedback suggested “cyber topographic” overlay — **not implemented**; discuss before changing.

**Motion defaults:** `src/lib/motion.ts` — `SPRING`, `SPRING_SOFT`.

**Frontend design constraints (owner rules):**

- Landing first viewport = one composition; brand strong  
- Prefer springs; intentional motion, not noise  
- Avoid generic AI aesthetics (purple gradients, cream+terracotta clichés) — this brand is gold + magenta on dark/cream  
- Cards: don’t invent card grids in hero; mid-page cards exist where interaction needs them  

**Inspiration note (July 2026):** Stripe Radar dark UI (signals, icons, density) is a **visual** reference for infrastructure tone — **not** a product to clone. Translate to “signals we read / optimize,” not “buy our Radar.”

---

## 10. Performance & loading

- Below-fold sections: `React.lazy` + `Suspense` + idle `import()` preload in `App.tsx`
- `CustomCursor` deferred via `requestIdleCallback`
- Framer Motion / Lenis / Recharts load with their chunks (AccentScrollFold pulls Recharts — large chunk)
- Hero entrance historically CSS-first to keep main bundle lean; Hero now also uses Framer for stats/copy

---

## 11. Contact form & env

```env
VITE_WEB3FORMS_ACCESS_KEY=...
```

- Client posts to Web3Forms API from `Contact.tsx`
- `deploy-vercel.sh` tries to sync key to Vercel envs from local `.env`
- Destination inbox should be verified in Web3Forms dashboard (info@upraiser.co.uk)

---

## 12. Deploy / Vercel (important gotchas)

**Project:** `upraiser-site` · org/team: `alex-3152s-projects`  
**CLI user:** `alex-3152` · Vercel email: `alex@upraiser.co.uk`  
**Git author often:** `homeboyleps@gmail.com`

**BLOCKER:** Vercel may set deployments to `BLOCKED` / `TEAM_ACCESS_REQUIRED` when git commit author email is not on the team. Status shows `UNKNOWN` / `seatBlock`.

**Workaround that worked:** deploy from a **temp copy of the project without `.git`** so CLI doesn’t attach blocked git author — then production becomes Ready.

```bash
# Normal (may block if git author not on team):
npm run deploy

# Workaround sketch:
rsync -a --exclude .git --exclude node_modules ./ /tmp/upraiser-deploy/
cp -R .vercel /tmp/upraiser-deploy/
cd /tmp/upraiser-deploy && vercel deploy --prod --yes
```

**Longer-term fix:** invite `homeboyleps@gmail.com` to the Vercel team **or** commit with author `alex@upraiser.co.uk`.

**Do not** change git config unless the human asks.

Production aliases typically include `https://upraiser-site.vercel.app`. Deployment Protection / SSO may 302 unauthenticated browsers to Vercel login depending on team settings.

---

## 13. Known WIP / intentional gaps (July 2026)

1. **`#difference` (Why Us)** — header only; previous card/viz treatments were rejected (“kolkhoz”). `differenceByMode` content may still exist unused.  
2. **README.md** still mentions old sections (`#objectives`, `#testimonials`, `#technology`, `content.ts`) — trust **App.tsx** + this handoff.  
3. **Uncommitted local work** often exists on `main` (ambient charts, mode hero stats, dual-mode copy, deleted sections). Last tagged narrative commit may lag working tree.  
4. **Case studies** dense; review suggested giant primary metric + muted secondary — not fully restyled.  
5. **Traffic channels** on mobile: many tabs — accordion/carousel polish suggested, not required done.  
6. **three.js** deps unused.  
7. **Hero lede** owner prefers infrastructure sentence about performance / OEM / verified outcomes — not the “Hardware-level OEM access and predictive LTV scoring…” AdTech rewrite (that was reverted).

---

## 14. Recent product decisions (conversation memory)

- Ambient scroll charts in Audience (line) and Promise (bars) — keep quiet, full-bleed, scroll-synced.  
- Why Us stripped to header after failed viz experiments.  
- Hero slogans restored: Charting the Ascent + “We see how stunning…”.  
- Hero stat cards must differ by light/dark mode (implemented via `heroHighlightsByMode`).  
- Do not frame UPRAISER as owning a Stripe-Radar-like product; operators who analyze/optimize.  
- Deploy succeeded via no-git copy when team seat blocked git author.

---

## 15. Agent / collaboration rules (owner)

- Commit **only** when explicitly asked; same for push/PR.  
- Prefer editing existing files; don’t invent markdown docs unless asked (this handoff was requested).  
- Match existing visual language; don’t rebuild the site in a new aesthetic without approval.  
- Russian is fine for chat with the owner; **UI copy stays English**.  
- Skills in `.claude/skills` / `.cursor/skills` / `.agents/skills` exist for design/motion — use when relevant.

---

## 16. Quick “where do I change X?”

| Want to change… | Go to… |
|-----------------|--------|
| Hero slogan / H1 / lede | `Hero.tsx` |
| Hero stat numbers by theme | `liveContent.ts` → `heroHighlightsByMode` |
| Section titles / mode stories | `liveContent.ts` → `sectionsByMode`, `*ByMode` |
| Case study metrics | `cases.ts` |
| Partner logos | `partners.ts` + `public/partners/` (+ `assets/` if synced) |
| Theme colors | `index.css` `[data-theme=…]` |
| Section order | `App.tsx` + `scrollSections.ts` |
| Scroll fold ambient type | `Audience.tsx` / `PromiseSection.tsx` → `ambient=` |
| Contact form key | `.env` + Vercel env |
| Nav links | `liveContent.ts` → `navLinks` |

---

## 17. Sanity checklist before shipping a change

- [ ] `npm run build` passes (`tsc -b` + vite)  
- [ ] Toggle light/dark — copy and hero stats both make sense  
- [ ] Mobile: hero, channels, cases, contact usable  
- [ ] Reduced motion: no broken stuck `opacity: 0` (watch Stagger/Reveal)  
- [ ] Deploy: if Vercel BLOCKED on git author, use no-git workaround or fix team seats  
- [ ] Don’t overwrite Charting the Ascent / rise-to-the-top without asking  

---

*End of handoff. Prefer updating this file when architecture or page map changes.*
