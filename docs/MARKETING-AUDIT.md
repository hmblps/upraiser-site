# UPRAISER — Marketing audit & copy proposals

**Status:** Advisory only — **not** source of truth.  
**Sources of truth remain:** `src/data/liveContent.ts`, `src/data/cases.ts`, `src/data/innerPagesData.ts`, `docs/HANDOFF.md`, shipping UI.  
**Date:** 2026-07-30  
**Context:** `.agents/product-marketing.md` (v1) + marketing-council on Home hero + fold / Solutions / Company / Cases pass.

---

## How to use this file

1. This is a **proposal board**: current → marketing lens → brand-safe alternative.  
2. Nothing here ships until you pick a line and ask to implement.  
3. **Poetic / Zero-like brand layer stays.** Clarity is additive (lede, hierarchy, shorter lists) — not a purge of metaphor, ascent language, or distinctive CTAs.  
4. Rejected already (do not revive): generic CRO CTAs like “Get a scoped path”, killing **Request Pilot** / **Ready to be Upraised?**.

### Brand keep-list (non-negotiable for proposals)

| Asset | Keep |
|-------|------|
| Hero H1 — *We see how stunning Your rise to the top can be.* | Yes — poetic brand |
| *Charting the Ascent* | Yes |
| Everest / dual theme Growth ↔ Infrastructure | Yes |
| **Request Pilot** | Yes |
| **Ready to be Upraised?** | Yes |
| Capital You/Your in body | Yes (house style) |
| Why Us — *Direct pipe. Not resale.* | Yes — tone reference |
| Solutions glass + still→MP4 | Yes — product demo |

---

## 1. Positioning (unchanged)

| | |
|--|--|
| **What** | London performance / traffic desk: buy + reconcile mobile growth |
| **Who** | iGaming, fintech, gaming, premium apps — measurable install→revenue |
| **Promise** | Ad Ops and finance read the same file; every bid has a receipt |
| **Not** | Antifraud SaaS |

Marketing note: positioning is strong in folds and Company; hero leads with poetry first. That is a **brand choice**, not a bug — proposals below only *annotate* the poem, never replace it with utility copy.

---

## 2. Home — Hero

### As now
- H1 poetic (ascent / rise)  
- Label: `UPRAISER · Charting the Ascent`  
- Mode stats (Growth vs Infrastructure)  
- Lenovo strip  
- `heroLede` exists in `liveContent` (*Every bid earns a receipt…*) but is **not rendered** in `Hero.tsx`

### Marketing lens
Cold B2B visitors may not infer the offer from the poem alone. Ogilvy/Schwartz would want brand **or** promise in the first glance; Sharp wants distinctive assets (name, ascent, mountain) repeated.

### Brand-safe better (optional)
| Option | Change | Poetic? |
|--------|--------|---------|
| **A — Annotate** | Keep H1; show `heroLede` under it | Full poem kept |
| **B — Dual lede** | Keep H1; lede swaps by theme (Growth vs Infra wording) | Full poem kept |
| **C — Status quo** | No lede; poem + mountain carry brand | Full poem kept |

**Recommendation:** A when you want commercial clarity without touching brand poetry.  
**Not recommended:** Replacing H1 with a pure promise line.

---

## 3. Home — Audience

### As now
- Growth: brands measured by post-install revenue; SCALE  
- Infra: numbers match the invoice; PROOF  
- Ending fixed: *We scale only what you can audit.*

### Marketing lens
Strong ICP filter. Infra body is denser than Growth.

### Brand-safe better (optional)
| | As now | Softer trim (same meaning) |
|--|--------|----------------------------|
| Infra last beats | Long “dashboard widgets / white-glove…” close | One shorter closer: *Supply you can defend in a review starts here.* — keep prior sentences or cut one clause |

**Recommendation:** KEEP unless you want a light trim on Infra length only.

---

## 4. Home — Process

### As now
- Growth: Funnel → Mix → Live (48h)  
- Infra: Map → Connect → Deploy  

### Marketing lens
Clear how-it-works; mechanism language fits sophisticated buyers.

### Brand-safe better
**KEEP.** No change needed for marketing.

---

## 5. Home — Channels

### As now
- Up to ~9 channels × 2 modes; long `description` + points on Home  

### Marketing lens
Home should tease; depth belongs on `/solutions`. Teasers/taglines are already strong.

### Brand-safe better (optional)
| | As now | Better for Home |
|--|--------|-----------------|
| Body | Full description on Home | **Teaser + tagline + “Open on Solutions”** only |
| Points | 5–6 bullets | Hide on Home; keep on Solutions / expand |

**Recommendation:** Highest-leverage *copy structure* change on Home — shorten surface, don’t rewrite voice.

---

## 6. Home — Cases teaser

### As now
- 3 cards; dual titles Growth/Infra  
- Short section description  

### Brand-safe better
**KEEP.** Proof strip is right size.

---

## 7. Home — Promise

### As now
- Growth: P&L / RESULTS  
- Infra: audit logs / CLARITY  

### Marketing lens
This *is* the commercial promise. Poetic hero + hard Promise fold = Zero-like brand (feeling) + operator truth (proof).

### Brand-safe better
**KEEP.** Do not soften RESULTS/CLARITY into generic “outcomes.”

---

## 8. Home — Pilot / bridge

### As now
- Must see both stories → then Request Pilot  
- Bridge: Switch to Infrastructure / Growth  

### Brand-safe better
**KEEP.** Dual narrative is product, not decoration.

---

## 9. `/solutions`

### As now
- Lanes: App Growth / OEM & CTV  
- Sticky glass + format copy  
- Headers: *Every Format. One Supply Path.* / *OEM / CTV — measured supply*  
- Close: Brief the channel… + Request Pilot  

### Marketing lens
Best product surface on the site. Format points slightly repetitive (pre-bid / MMP) — acceptable B2B grammar.

### Brand-safe better (optional)
| Element | As now | Optional polish |
|---------|--------|-----------------|
| App Growth H2 | Utility-clear | Slightly more branded: e.g. keep path idea, add ascent/receipt flavor *only if* it doesn’t fight the glass UI |
| Format points | Parallel lists | Vary first bullet per format (less “pre-bid” echo) |
| Visual | Glass + MP4 | **KEEP** |

**Recommendation:** Visual KEEP. Copy polish = low priority.

---

## 10. `/company`

### As now
- H1: UPRAISER Agency LLP + same-file one-liner  
- Why Us: *Direct pipe. Not resale.*  
- Timeline, footprint, FAQ, compliance  

### Marketing lens
Why Us is the **tone north star** for the rest of the site. Hero poem = emotional brand; Why Us = operator brand.

### Brand-safe better
**KEEP.** Use Why Us as the bar when rewriting anything elsewhere.  
Note: older `aboutPage` strings exist in data; live UI is `COMPANY_CONTENT` — don’t treat unused About module as live.

---

## 11. Cases

### As now
- Metrics → meta → Challenge / Approach / Result × growth + optimization  
- Concrete numbers; dual narrative  

### Brand-safe better
**KEEP** structure. Optional later: shorten a few long headlines for scan — without turning them into bland “Case study: success.”

---

## 12. Contact & CTAs

### As now
- Title: **Ready to be Upraised?**  
- Primary CTA sitewide: **Request Pilot**  

### Marketing lens
Generic CRO would kill both. Brand already chose poetry + ritual CTA.

### Brand-safe better
**KEEP both.** Supporting line under Contact can stay factual (*vertical, GEO, KPI event*) — that is annotation, not replacement.

---

## 13. Visual (marketing-adjacent, not redesign)

| Surface | As now | Marketing note | Brand-safe better |
|---------|--------|----------------|-------------------|
| Hero | Everest + poem | Costly signal (premium desk) | KEEP; optional lede for clarity |
| Folds | Accent scroll / charts | Supports dual story | KEEP; avoid card spam |
| Solutions | Glass phone | Product is the hero | KEEP |
| Type / orange accent | Established | Distinctive asset | KEEP |

Poetic / Zero-like = atmosphere + ascent language + restraint. Marketing = one clear commercial cue near the poem, not a dashboard homepage.

---

## 14. Priority backlog (if/when you implement)

| Priority | Item | Type | Touches poetry? |
|----------|------|------|-----------------|
| P1 | Shorten Home Channels (teaser-only) | Structure | No |
| P2 | Render `heroLede` under H1 | Annotation | No |
| P3 | Light Infra Audience trim | Edit | No |
| P4 | Solutions format bullet variety | Polish | No |
| — | Replace H1 / CTAs / Upraised | — | **Out of scope** |

---

## 15. What “better” means here

**Better ≠ more conversion-generic.**  
**Better =** same poetic brand, easier for a cold Ad Ops / UA visitor to answer: *who is this, what do they buy, why Lenovo, why pilot* — without erasing the ascent.

---

## Changelog

- 2026-08-08 — Applied Stop-Slop and Ogilvy rules across liveContent.ts (removed em-dashes, negative constructions, added BidMatrix SDK events). Fixed UI contrast for light theme red buttons. Adjusted Lenovo dock to be always visible and reduced 900vh hero runway to 300vh.
- 2026-07-30 — Expedition voice **adopted in product copy** (nav, hero ledes, folds, Why Us). This file stays advisory; live SOT is `liveContent.ts`.
- 2026-07-30 — Initial advisory audit from product-marketing context + council + page pass. Explicit: not SOT; poetic layer retained.
