# UPRAISER Website — Handoff для Gemini

> **Цель:** полный контекст проекта для продолжения работы AI без потери истории.  
> **Путь:** `/Users/homeboylebz/Downloads/Upraiser New Website Cursor Project`  
> **Обновлено:** 27 июня 2026  
> **Production:** https://upraiser-site.vercel.app  
> **Deploy:** `npm run deploy`  
> **Build:** `npm run build` ✅ · Dev: `http://localhost:5173/`

---

## 1. Суть проекта

Одностраничный лендинг **UPRAISER Agency LLP** — позиционирование как **Premium Traffic Infrastructure** (Stripe/Vercel для user acquisition), не generic marketing agency.

| Поле | Значение |
|------|----------|
| Язык | English |
| Юрлицо | UPRAISER Agency LLP |
| Адрес | 128 City Road, London EC1V 2NX, UK |
| Email | info@upraiser.co.uk · careers@upraiser.co.uk |
| Сайт | upraiser.co.uk |
| LinkedIn | https://www.linkedin.com/company/upraiser/ |
| Founded | 2017 · 11–50 employees (LinkedIn) |
| Lenovo | Official agency of **Lenovo PC HK LTD** |

### Брендовые формулировки
- **Hero badge:** `UPRAISER · CHARTING THE ASCENT` (CSS uppercase через `.section-label`)
- **Headline:** *We see how stunning Your rise to the top can be.*
- **Positioning line:** Performance-First Traffic Infrastructure

### Референсы при сборке
- [Z2A Digital](https://www.z2adigital.com/) — структура UA-агентства
- [Hike](https://hike.agency/) — flow и polish
- PDF `Upraiser_Traffic_Infrastructure.pdf` — медиакит (цвета, метрики, визуал)

---

## 2. Стек и команды

```
React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4
Framer Motion 12 · Lenis 1.3 · Web3Forms (contact API)
```

```bash
npm install
npm run dev       # localhost:5173
npm run build     # tsc + vite → dist/
npm run preview
npm run lint      # oxlint
npm run deploy    # Vercel → upraiser-site (scripts/deploy-vercel.sh)
```

### Environment
```bash
VITE_WEB3FORMS_ACCESS_KEY=your_key_here
```
Ключ: https://web3forms.com

**Deploy:** `.vercel/project.json` → `upraiser-site`. Скрипт `npm run deploy` синхронизирует Web3Forms key в Vercel env.

**Нет:** backend, CMS, router.

---

## 3. Бренд-правила (строго)

| Правило | Пример |
|---------|--------|
| UPRAISER | ALL CAPS в логотипе, nav, section labels |
| You / Your / Yours | Capitalized Y в copy |
| Section titles, nav, CTA | UPPERCASE via CSS (`.section-title`, `.btn-caps`, `.nav-link`) |
| Body copy | Infrastructure tone, hard metrics, **We** вместо повторения UPRAISER |

### Цвета
- Orange accent: `#FDD835` → `text-orange`, `bg-orange`
- Magenta: `#E53E3E`
- Dark bg: `#0a0a0a` · Light bg: `#f7f7f5`

### Метрики из медиакита (использовать в copy)
- **97.3%** bots filtered
- **2.7%** install hijacking blocked
- **0%** fraud rate (verified buys)
- **100+** territories
- **100K+** apps in network

### Тема
- Light/Dark toggle в header
- `localStorage`: `upraiser-theme`
- Anti-flash script в `index.html`

---

## 4. Структура страницы (актуальная)

```
SiteGrain              fixed SVG noise overlay
CustomCursor           yellow dot + ring (desktop)
Header                 fixed, transparent → blur on scroll

main:
  #hero                min-h viewport block + hero→audience bridge
    Hero               badge + headline + stats + CTAs + HeroAtmosphere
    LenovoTrustStrip   Official Agency Partner bar (scroll reveal)
  #audience            GrowthScrollBlock — GROWTH scroll accent
  #value               ValueProps
  #promise             PromiseScrollBlock — OUTCOMES scroll accent (lite)
  #difference          Difference
  #objectives          Objectives
  #channels            TrafficChannels (tabs)
  #testimonials        Testimonials
  #cases               CaseStudies (carousel + sparklines)
  #technology          Technology
  #about               About
  #process             Process
  #contact             Contact (Web3Forms, UPRAISED red accent)

PartnersCarousel       partner logos marquee
Footer                 + LinkedIn
MobileSectionNav       mobile section dots
SectionNav             keyboard ↑↓ only (returns null)
ApplePreviewPanel      ?applePreview=1 dev overlay
```

---

## 5. Файловая структура

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── context/
│   ├── ThemeContext.tsx
│   └── ScrollContext.tsx          scrollTo (smooth) · jumpToSection (instant)
├── data/
│   ├── content.ts                 весь copy
│   ├── cases.ts                   4 cases + trend[]
│   ├── partners.ts                partner list + logo paths
│   └── scrollSections.ts          keyboard nav order
├── hooks/
│   ├── useCountUp.ts · useReducedMotion.ts · useHeroOrbCursorFollow.ts
│   ├── useHorizontalScrollProgress.ts · useActiveSection.ts
│   └── useSectionKeyboardNav.ts · useApplePreview.ts · useMagneticElement.ts
├── lib/motion.ts · lib/accent.ts
└── components/
    ├── Header · Hero · HeroAtmosphere · LenovoTrustStrip · SiteGrain
    ├── GrowthScrollBlock · PromiseScrollBlock · AccentWord
    ├── Audience · ValueProps · PromiseSection · Difference
    ├── Objectives · TrafficChannels · Testimonials · CaseStudies
    ├── Technology · About · Process · Contact · PartnersCarousel · Footer
    ├── SmoothScroll · SectionNav · MobileSectionNav · CustomCursor · ThemeToggle
    ├── LenovoPartnershipCopy · LenovoPartnershipLogo · SectionHeader
    └── motion/Reveal · Stagger · motion-preview/Magnetic

scripts/
├── deploy-vercel.sh
└── normalize-partner-logos.py

public/
├── hero/light-mountains-loop.mp4
├── logo.svg · favicon.svg · upraiser-logo.png
└── partners/                      18 SVG wordmarks
```

---

## 6. История решений (что принято / отклонено)

### ✅ Принято
- SiteGrain + Hero orbs (HeroAtmosphere)
- section-band alternating backgrounds
- Infrastructure copy refactor (Phase 1 UX review)
- LenovoTrustStrip под hero, full-viewport hero block
- Testimonials (placeholder)
- CaseStudies sparklines (CaseSparkline)
- Web3Forms contact form
- card-lift premium hover glow (orange + magenta)
- Keyboard section nav ↑↓ — **instant jump** между блоками
- LinkedIn в footer
- Hero badge: **CHARTING THE ASCENT** (было Premium Traffic Provider)
- **Partners carousel** — 18 SVG logos, monochrome filter, uniform spacing
- **Footer cleanup** — убран tagline + Newsletter block; grid `lg:grid-cols-[1.2fr_2fr]`

### ❌ Отклонено пользователем (июнь 2026)
- Hero watermark UPRAISER
- SVG/video beam (HeroBeam.tsx удалён)
- Raster media kit backgrounds
- Low-poly terrain
- On-screen section arrow buttons (убраны, осталась только клавиатура)
- Generic agency buzzwords в copy
- **Hero floating SVG assets** (4 variants: orbs / ascent / nodes / hybrid + dev picker)
- **Hero background video** (zebis + warm planes + warm streaks — preview, потом убрано)
- **Hero ascent stream** (появляющиеся charts/цифры/иконки ↗ поверх video)

### 🧪 Hero atmosphere — dark theme (июнь 2026)

> **Полная документация:** [`HERO_ATMOSPHERE.md`](./HERO_ATMOSPHERE.md)

| Эффект | Вердикт |
|--------|---------|
| Dark mesh / traffic rays / SVG noise / canvas grid | ❌ слабо или лагает cursor |
| Dark 114MB hero video над cards | ❌ |
| DarkTopographyAtmosphere / animated spotlight | ❌ «колхоз» |
| Sweep gold/magenta + magenta orb в dark | ❌ → один orange orb |
| Gold radial в hero→Audience bridge | ❌ жёлтые полосы |

**Dark hero approved (production):**
- `light-mountains-loop.mp4` + dark scrim (opacity ~32%)
- **Один orange orb** — cursor follow (`useHeroOrbCursorFollow`)
- Neutral `hero-bottom-fade-bridge` + `#audience::before` overlap

**Light hero approved:**
- Mountains video + warmwash + scrim
- Orange + magenta orbs (CSS drift, **без** cursor follow)
- Тот же neutral bridge (тише, чем dark)

### 🧪 Hero experiments — video stock (ранние, не в коде)

| Кандидат | Файл (Downloads) | Вердикт |
|----------|------------------|---------|
| Purple digital data | `kaif1675711850-digital-data.mp4` | ❌ off-brand purple, pixel grid |
| Orange network | `1655448180-stock-video-digital-network…mp4` | ~ цвет ok, слишком busy |
| Warm planes 4K | `smth18557108-uhd_3840_2160_30fps.mp4` | ✅ лучший cinematic, тяжёлый (113 MB) |
| Warm streaks portrait | `smth215440318-hd_1080_1920_30fps.mp4` | ✅ хороший color + portrait fit |
| **Zebis orange blocks** | `zebis14152861-uhd_3840_2160_30fps.mp4` | ✅ **лучший brand match** — preview с playback 0.38×, flip X+Y, glass stat cards, ascent stream |

**Если вернуть video:** начать с zebis, 720–1080p, 8–12 s loop, ~3–5 MB, opacity 18–32%, mask слева, stat cards glass или stats под CTA.

**Что искать в stock:** `abstract orange particles dark`, `warm bokeh loop`, `golden light leak` — не purple cyber / pixel grid.

**Референсы анимаций:** [appalgo.com](https://www.appalgo.com/) — floating hero, liked; [thingortwo.com](https://thingortwo.com/) — structure/proof, не animations.

### 🗑 Удалённые файлы
```
HeroBeam.tsx · HeroBeamVideo.tsx · HeroVisual.tsx
BrandBackground.tsx · terrainMesh.ts
public/hero-beam.mp4 · public/partners-grid.png
```

---

## 7. Hero (детали)

```tsx
// Hero.tsx
Badge:    "UPRAISER · Charting the Ascent"  → renders as CHARTING THE ASCENT
Headline: ["We see how stunning", "Your rise to the top", "can be."]
CTAs:     Sign Up (#contact) · View Case Studies (#cases)
Stats:    100+ Territories · 100K+ Apps · 0% Fraud · 97.3% Bots Filtered
Atmosphere:
  Light → mountains video + warmwash + scrim + 2 orbs (drift) + neutral bridge
  Dark  → mountains video + dark scrim + 1 orange orb (cursor follow) + neutral bridge
  SiteGrain → fixed SVG overlay
NO: watermark, beam, spotlight/sweep, gold bridge radial, dark mesh/rays/noise/grid
```

Hero block wrapper (`App.tsx`):
```tsx
<div id="hero" className="flex min-h-[calc(100dvh-4.75rem)] flex-col border-b border-border">
  <Hero />
  <LenovoTrustStrip />
</div>
```
Цель: Audience («Who We Work With») не выглядывает на первом экране.

---

## 8. Keyboard section navigation

| Input | Поведение |
|-------|-----------|
| ↑ / ↓ | Instant jump к prev/next блоку |
| Wheel | Lenis smooth scroll |
| Nav links (#cases etc.) | Smooth scrollTo() |
| В input/textarea | Стрелки не перехватываются |

**Порядок** (`scrollSectionIds`):
```
hero → audience → value → promise → difference → objectives
→ channels → testimonials → cases → technology → about
→ process → careers → contact
```

**Файлы:** `SectionNav.tsx` (returns `null`), `useSectionKeyboardNav.ts`, `SmoothScroll.tsx`, `ScrollContext.tsx`

```tsx
scrollTo(id)         // smooth — anchor links
jumpToSection(id)    // immediate: true в Lenis
```

---

## 9. Contact form (Web3Forms)

- POST `https://api.web3forms.com/submit`
- Fields: name, email, company, vertical, message
- States: idle · loading · success · error
- Без `VITE_WEB3FORMS_ACCESS_KEY` → error banner

---

## 10. Partners carousel

- **18 partners** с SVG в `public/partners/` — см. `src/data/partners.ts`
- Monochrome: dark `brightness(0) invert(1)` · light `brightness(0)`
- Слоты: `fit-content` + uniform `padding-inline` (не fixed-width)
- Per-logo `scale` и ручные viewBox fixes: Google, Apple, Snapchat, Reddit, Kochava, Bing, AppsFlyer
- CSS: `.partner-logo-slot`, `.partner-logo` в `index.css`
- Script: `scripts/normalize-partner-logos.py` — **не гонять** без бэкапа (перезаписывает SVG)

**Ещё нет assets:** Adjust, Protect360, Branch, impact.com

### Per-logo fixes (важно сохранить)
| Logo | Fix |
|------|-----|
| Kochava | viewBox crop embedded PNG |
| Reddit | monochrome wordmark only |
| Google | tight viewBox, inline paths |
| Bing | full viewBox `0 0 1020 380` |
| Apple | full `0 0 814 1000`, scale 1.22 |
| Snapchat | `0 0 24 24`, scale 1.24 |

---

## 11. UX / Motion

| Feature | Location |
|---------|----------|
| Lenis smooth wheel | SmoothScroll |
| Instant section jump | Keyboard ↑↓ |
| Scroll reveal | Reveal, Stagger |
| Count-up stats | Hero StatCard |
| Card lift + glow | `.card-lift` in index.css |
| Case sparklines | CaseSparkline.tsx |
| Custom cursor | CustomCursor (hidden on reduced-motion) |
| Partners marquee | CSS @keyframes |
| Sticky CTA | after scrollY > 520 |

`prefers-reduced-motion`: orbs off, cursor hidden, Lenis off, motion initial states skipped.

---

## 12. Section IDs map

| ID | Component |
|----|-----------|
| hero | App wrapper div |
| audience | Audience |
| value | ValueProps |
| promise | PromiseSection |
| difference | Difference |
| objectives | Objectives |
| channels | TrafficChannels |
| testimonials | Testimonials |
| cases | CaseStudies |
| technology | Technology |
| about | About |
| process | Process |
| careers | Careers |
| contact | Contact |

---

## 13. App.tsx (актуальный)

```tsx
// SmoothScroll → SiteGrain, CustomCursor, Header, MainContent
// MainContent: hero block → Audience … Contact
// MobileSectionNav + SectionNav + optional ApplePreviewPanel
// Careers, StickyCta — удалены
```

---

## 14. HeroAtmosphere.tsx (актуальный)

См. [`HERO_ATMOSPHERE.md`](./HERO_ATMOSPHERE.md).

```tsx
// Light: mountains + warmwash + scrim + 2 orbs (drift)
// Dark:  mountains + dark scrim + 1 orange orb (useHeroOrbCursorFollow)
// Both:  hero-bottom-fade-bridge (neutral --theme-bg only)
```

---

## 15. scrollSections.ts (полный)

```ts
export const scrollSectionIds = [
  "hero",
  "audience",
  "value",
  "promise",
  "difference",
  "objectives",
  "channels",
  "testimonials",
  "cases",
  "technology",
  "about",
  "process",
  "careers",
  "contact",
] as const;
```

---

## 16. content.ts (полный)

```ts
export const navLinks = [
  { label: "Solutions", href: "#channels" },
  { label: "Case Studies", href: "#cases" },
  { label: "About", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export const valueProps = [
  {
    title: "Zero-Tolerance Fraud Layer",
    subtitle: "97.3% bots filtered · 2.7% hijacking blocked",
    description:
      "Every install passes real-time verification before it hits Your dashboard. We maintain a 0% fraud rate on verified buys — bots, click floods, and install hijacking are blocked at the infrastructure level, not in a post-campaign report.",
  },
  {
    title: "Predictive LTV Scoring",
    subtitle: "Proprietary DMP · pre-impression signals",
    description:
      "Our DMP scores device-level intent before the bid fires. You allocate budget against predicted deposit, subscription, and registration value — not CPI alone.",
  },
  {
    title: "Hardware-Level OEM Access",
    subtitle: "Official Lenovo PC HK LTD agency",
    description:
      "ROM-level pre-installs and Google PAI via Tier-1 OEM partners. Your app ships on-device from day one — live in 1–2 days with geo and model targeting across 100+ territories.",
  },
];

export const objectives = [
  {
    title: "Deploy Across 100+ Territories",
    description:
      "One integration point. Your campaigns go live in Tier-1 and emerging markets through a single API — 100K+ apps in network, 24/7 execution, no fragmented vendor stack.",
  },
  {
    title: "Buy Verified Events, Not Impressions",
    description:
      "CPI, CPA, and CPL contracts tied to deposits, purchases, and registrations You can reconcile in AppsFlyer, Adjust, or Kochava. Every dollar maps to a measurable outcome.",
  },
  {
    title: "Pre-Install at the Hardware Layer",
    description:
      "Factory and cloud pre-installs via Lenovo Ad Exchange and Tier-1 OEM inventory. Zero-fraud installs with ROM-level integration — not display retargeting dressed as acquisition.",
  },
  {
    title: "Score Intent Before the Bid",
    description:
      "Proprietary DMP predictive scoring using session depth, device signals, and engagement peaks. We bid when LTV probability is highest — and pause when it isn't.",
  },
];

export const trafficChannels = [
  { id: "oem", title: "OEM & Pre-installs", tagline: "Your app from day one", description: "Factory and cloud pre-install access via Lenovo and Tier-1 OEM partners. ROM-level integration or Google PAI — live in 1–2 days with geo and device targeting.", bestFor: "App launches, scale in emerging markets, zero-fraud installs" },
  { id: "programmatic", title: "In-App Programmatic", tagline: "Scale inside 100K+ apps", description: "SDK-integrated inventory with behavioral signals — session depth, usage frequency, and engagement peaks — so we bid when intent is highest.", bestFor: "Volume scaling, rewarded video, high-intent ad units" },
  { id: "social", title: "Social & Search", tagline: "Capture active demand", description: "High-intent keywords on Google, Bing, and Yahoo plus granular segmentation on Meta and TikTok for personalized acquisition at scale.", bestFor: "Search arbitrage, paid social, intent-driven CPA" },
  { id: "native", title: "Native & Editorial", tagline: "Trust-driven conversions", description: "Placements on high-authority financial and tech publishers. Leverage editorial trust to drive high-CPA subscriptions and deposits.", bestFor: "Fintech, iGaming, premium subscriptions" },
  { id: "ctv", title: "CTV & Connected TV", tagline: "Reach that activates", description: "Roku, streaming, and connected-TV campaigns that drive installs and deep-funnel events like account linking and first deposit.", bestFor: "Brand + performance, UK/US fintech, app awareness" },
  { id: "retargeting", title: "Retargeting", tagline: "Re-engage high-intent users", description: "Bring back users who showed intent but didn't convert. Cross-channel retargeting aligned to LTV and event-based bidding.", bestFor: "Cart abandoners, trial users, reactivation" },
  { id: "mobile", title: "Mobile UA", tagline: "Always in Your audience's pocket", description: "End-to-end mobile user acquisition — CPI, CPA, and CPL models across display, video, and in-app with real-time fraud filtering.", bestFor: "App store ranking, mobile games, utility apps" },
  { id: "performance", title: "Performance & Growth", tagline: "Outcome-based buying", description: "CPI, CPA, and CPL deals aligned to Your LTV model. We buy against deposits, purchases, and registrations — not impressions alone.", bestFor: "iGaming FTDs, fintech deposits, subscription apps" },
];

export const processSteps = [
  { step: "01", title: "Diagnose & Define Goals", description: "Map Your funnel gaps, LTV targets, and the KPIs that actually matter for Your vertical." },
  { step: "02", title: "Pick the Right Channels", description: "Mix OEM, programmatic, social, native, and CTV based on where Your high-value users live." },
  { step: "03", title: "Launch & Optimize", description: "Go live in days, not months. Real-time data feeds continuous creative and bid optimization." },
  { step: "04", title: "Scale What Works", description: "Double down on winning geos, placements, and events — with full transparency on every dollar spent." },
];

export const promise = {
  label: "Why UPRAISER",
  title: "We Don't Sell Impressions. We Buy Verified Outcomes.",
  description: "Most partners optimize for reports. We operate as traffic infrastructure — one integration, proprietary DMP scoring, and event-verified buying so every dollar ties to deposits, purchases, or registrations You can actually measure.",
};

export const differencePillars = [
  { title: "Tech", description: "Proprietary DMP with pre-impression LTV scoring. 97.3% bot filtering, 2.7% hijack blocking — built for execution, not slide decks." },
  { title: "Team", description: "One global team across 100+ territories. Single integration point, 24/7 execution, zero vendor fragmentation." },
  { title: "Tactics", description: "Channel mix follows the user — OEM, programmatic, social, native, and CTV — selected by event economics, not platform preference." },
  { title: "Transparency", description: "No black boxes. You see the campaign data we see — with zero-tolerance fraud filtering on every verified buy." },
];

export const technologyFeatures = [
  { title: "Proprietary DMP", description: "Predictive scoring using device signals to estimate LTV before the impression is served." },
  { title: "Fraud Shield", description: "97.3% of bot traffic filtered. 2.7% install hijacking blocked. If we can't verify it, we don't buy it." },
  { title: "Attribution Stack", description: "Integrated with AppsFlyer, Adjust, Kochava, Protect360, and the platforms You already run." },
];

export const careers = {
  title: "Join the UPRAISER Team",
  description: "We're building performance traffic infrastructure — not another agency deck. If You thrive on precision, speed, and global execution, we'd like to hear from You.",
  perks: ["Remote-friendly, global team", "Ad tech & performance infrastructure focus", "Work with Tier-1 brands and OEM partners", "High-velocity, metrics-driven environment"],
  email: "careers@upraiser.co.uk",
};

export const footerLinks = {
  explore: [
    { label: "Objectives", href: "#objectives" },
    { label: "Traffic Channels", href: "#channels" },
    { label: "Case Studies", href: "#cases" },
    { label: "Technology", href: "#technology" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  social: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/upraiser/" }],
};

export const highlights = [
  { value: "100+", label: "Territories" },
  { value: "100K+", label: "Apps in Network" },
  { value: "0%", label: "Fraud Rate" },
  { value: "97.3%", label: "Bots Filtered" },
];

export const audience = {
  label: "Who We Work With",
  title: "Built for Advertisers and Publishers Who Care About Quality",
  advertisers: { title: "Advertisers", cta: "Get Started" },
  publishers: { title: "Publishers", cta: "Partner With Us" },
};

export const sections = {
  valueLead: { main: "If it doesn't drive a verified event, it's not user acquisition.", aside: "It's unallocated spend." },
  channels: { label: "Traffic Channels", title: "Paths Beyond the Obvious" },
  cases: { label: "Case Studies", title: "Verified Campaign Results", description: "Selected client work — event-level metrics and methodology from managed campaigns across iGaming, Fintech, and premium media." },
  difference: { label: "The Difference", title: "Four Pillars Behind Every Campaign" },
  objectives: { label: "Objectives", title: "What the Infrastructure Delivers" },
  process: { label: "How We Work", title: "Find the Gaps, Pick the Path, Scale the Results" },
  technology: { label: "Technology", title: "Built for Performance, Not Presentations" },
  about: { label: "About UPRAISER", title: "Performance-First Traffic Infrastructure" },
  testimonials: { label: "Client Voice", title: "What Partners Say" },
  contact: { label: "Get in Touch", title: "Are You Ready to Be Upraised?" },
};

export const aboutHighlights = [
  { title: "100+ Territories", text: "Active traffic across Tier-1 and emerging markets — one integration point, 24/7 execution." },
  { title: "100K+ App Network", text: "SDK-integrated programmatic inventory with behavioral bid signals — OEM, social, native, and CTV layered by event economics." },
  { title: "Proprietary DMP", text: "Predictive LTV scoring before the impression is served. Device-level intent, not demographic guesswork." },
  { title: "0% Verified Fraud", text: "97.3% bot filtering. 2.7% install hijacking blocked. If we can't verify it, we don't buy it." },
];

export const lenovoPartnership = {
  badge: "Official Agency Partner",
  title: "Lenovo PC HK LTD",
  description: "Exclusive access to Tier-1 OEM inventory worldwide — ROM-level pre-installs, Google PAI, and Lenovo Ad Exchange distribution.",
};

export const testimonials = [
  { id: "fintech-cmo", quote: "We needed FTDs, not install reports. Their OEM pipeline went live in 48 hours and every event reconciled in Adjust — zero disputed traffic.", role: "CMO", company: "European Fintech App", vertical: "Fintech" },
  { id: "igaming-head", quote: "Regulated US states, 18+ compliance, and a 0% fraud requirement. They whitelisted inventory before we spent a dollar — deposits tracked cleanly from week one.", role: "Head of Acquisition", company: "US iGaming Operator", vertical: "iGaming" },
  { id: "media-director", quote: "Subscription CPA held on target for four consecutive months. We saw the same placement data they did — no black box, no vanity metrics.", role: "Director of Growth", company: "Premium Media Publisher", vertical: "Media" },
];
```

---

## 17. cases.ts (полный)

```ts
export interface CaseStudy {
  id: string;
  client: string;
  category: string;
  headline: string;
  overview: string;
  channels: string[];
  challenges: string[];
  approach: string[];
  results: { value: string; label: string }[];
  trend: number[];
  outcome: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fanatics", client: "Fanatics", category: "iGaming", headline: "Compliant sportsbook growth at scale",
    overview: "We scaled paid acquisition for a real-money sportsbook and casino app across iOS and Android — with strict 18+ compliance and state-level regulatory requirements.",
    channels: ["Programmatic", "High-intent display", "Behavioral targeting"],
    challenges: ["Differentiated positioning in a promo-saturated market", "Geo and age compliance across regulated US states", "Driving quality bettors, not vanity install volume"],
    approach: ["Curated whitelist of verified, age-gated inventory", "Continuous creative and messaging tests on high-intent placements", "Daily bid and budget tuning against deposit and LTV signals", "Segmentation by sports vs. casino user intent"],
    results: [{ value: "8,000", label: "Verified installs" }, { value: "500", label: "First-time deposits" }, { value: "$250K+", label: "Revenue attributed" }, { value: "7+", label: "Extra bets per active user" }],
    trend: [12, 18, 22, 28, 35, 42, 48, 55, 62, 70, 78, 88],
    outcome: "Scaled acquisition while keeping fraud at zero and compliance intact across regulated markets.",
  },
  {
    id: "snoop", client: "Snoop", category: "Fintech", headline: "CTV-driven installs with deep activation",
    overview: "For a UK budget-planning app, we built a connected-TV strategy focused on installs and the critical post-install step: linking a bank account.",
    channels: ["CTV / Roku", "Performance UA", "Full-funnel optimization"],
    challenges: ["Breaking through noise in UK personal finance", "Moving users from install to account connection", "Maintaining efficient CPA on a premium funnel event"],
    approach: ["Roku TV campaigns timed to peak viewing windows", "Creative and placement tests aligned with UK audience behavior", "Weekly performance reviews and targeting refinements over four months", "Post-install messaging strategy to lift account-link rates"],
    results: [{ value: "14,308", label: "Installs" }, { value: "4,580", label: "Accounts connected" }, { value: "32%", label: "Install-to-connect rate" }, { value: "4 mo", label: "Sustained growth window" }],
    trend: [8, 14, 20, 26, 34, 41, 50, 58, 66, 74, 82, 92],
    outcome: "Proved CTV can drive both reach and meaningful downstream activation — not just top-of-funnel volume.",
  },
  {
    id: "vantage", client: "Vantage", category: "Fintech", headline: "OEM-powered trading app acquisition",
    overview: "We leveraged Lenovo OEM inventory to grow first-time deposits for an Android trading app in competitive fintech markets.",
    channels: ["OEM pre-install", "Lenovo Ad Exchange", "Event-based CPA"],
    challenges: ["Standing out in a crowded trading app category", "Scaling FTDs without inflating acquisition costs", "Sustaining engagement after the install"],
    approach: ["Distribution via Lenovo exchange and premium direct supply", "Campaigns optimized around deposit and FTD events, not CPI alone", "Rapid geo and device-model targeting — live in 1–2 days", "Post-install activation workflows tied to revenue events"],
    results: [{ value: "800+", label: "First-time deposits" }, { value: "$150+", label: "Average user value" }, { value: "120+", label: "Markets reached" }, { value: "1–2 days", label: "Typical launch time" }],
    trend: [10, 16, 24, 30, 38, 45, 52, 60, 68, 76, 85, 95],
    outcome: "Delivered high-value traders through OEM channels where standard programmatic alone underperforms.",
  },
  {
    id: "wsj", client: "Wall Street Journal", category: "Media", headline: "High-intent subscribers at target CPA",
    overview: "We ran performance campaigns for a leading US financial news app — prioritizing paid subscriptions over raw install volume.",
    channels: ["Native & editorial", "Finance-intent inventory", "CPA optimization"],
    challenges: ["High competition and rising CPAs in financial media", "Converting installs into paying subscribers", "Finding inventory that matches brand and compliance standards"],
    approach: ["Placements on business, finance, and news environments with proven purchase intent", "Strict inventory filtering against CPA and quality thresholds", "Continuous media-mix testing and budget reallocation from live data"],
    results: [{ value: "3,000", label: "New purchases / month" }, { value: "16,515", label: "Installs in period" }, { value: "650", label: "Purchase events tracked" }, { value: "On-target", label: "CPA vs. goal" }],
    trend: [15, 22, 28, 33, 40, 46, 53, 59, 65, 72, 80, 90],
    outcome: "Consistent subscription volume at scale while protecting unit economics in a premium vertical.",
  },
];
```

---

## 18. Открытые задачи

- [ ] Partner SVG: Adjust, Protect360, Branch, impact.com
- [ ] Real testimonials (заменить placeholders)
- [ ] Privacy Policy / Terms (сейчас `#`)
- [ ] OG image, SEO, analytics

### ✅ Сделано недавно (июнь 2026)
- [x] GROWTH + OUTCOMES scroll blocks — см. `ACCENT_SCROLL.md`
- [x] Dark hero: mountains + cursor-following orange orb
- [x] Hero→Audience neutral bridge (light + dark)
- [x] Contact UPRAISED red accent · Lenovo inline strip
- [x] Deploy → https://upraiser-site.vercel.app
- [x] Partner carousel · Footer cleanup · dark hero experiments откат

---

## 19. Инструкции для Gemini

1. Copy → `src/data/content.ts` only
2. UPRAISER caps · Your/You/Yours caps · section titles via CSS
3. **Hero:** см. `HERO_ATMOSPHERE.md` — dark = mountains + 1 orb + cursor follow; bridge **neutral only**
4. **Accent scroll:** только GROWTH + OUTCOMES — см. `ACCENT_SCROLL.md`
5. Section nav — **keyboard only**, instant jump
6. Hero badge = **CHARTING THE ASCENT**
7. Min diff · no git commit/deploy без просьбы
8. Stack = Vite SPA

---

*Конец документа. Прикрепи целиком + `src/` файлы при deep edits.*
