# Feature Specification: Load Speed Refactor

**Feature Branch**: `001-load-speed-refactor`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Провести рефакторинг сайта для оптимизации скорости загрузки при полном сохранении графики и визуальных эффектов. Сохранить 3D-сцену Эвереста и пайплайн темы в Hero. Сохранить пайплайн стекло-телефона и MP4-форматы на /solutions без визуальных регрессий. Учесть ограничения производительности (оптимизация бандла, асинхронная загрузка, очистка мертвых ассетов и страниц согласно архитектуре)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster first impression on Home (Priority: P1)

A marketing visitor lands on the homepage and sees the brand hero (ascent narrative + Everest experience + theme) become usable quickly, without waiting for the entire site or below-the-fold experiences to finish loading. Visual quality of the mountain scene and theme switch remains intact once ready.

**Why this priority**: Home is the primary entry and brand moment; perceived load speed here drives bounce and trust.

**Independent Test**: Cold-load `/` on a mid-range laptop and a mid-range phone; confirm first meaningful hero content appears sooner than the pre-refactor baseline while the Everest/theme experience still matches production visually after it settles.

**Acceptance Scenarios**:

1. **Given** a cold visit to `/`, **When** the page first paints, **Then** the visitor sees brand chrome and hero framing without a long blank or broken layout.
2. **Given** the hero experience has finished loading, **When** the visitor toggles light/dark theme, **Then** the Everest/theme pipeline still swaps correctly with no missing mountain, flash of wrong theme, or loss of established visual effects.
3. **Given** `prefers-reduced-motion` or a device that must not run heavy 3D, **When** the visitor opens Home, **Then** they still get a coherent hero (no broken empty stage) without forcing the full WebGL path.

---

### User Story 2 - Solutions glass stays fast and identical (Priority: P1)

A visitor opens `/solutions`, scrolls format lanes, and sees the glass phone (desktop 3D chassis + still→video formats; mobile CSS phone + live feed) with the same visuals as today, while the route itself loads without dragging in unrelated site weight.

**Why this priority**: Solutions is the shipped product demo; any visual regression here undoes the milestone. Load isolation protects Home and other routes.

**Independent Test**: Cold-load `/solutions` desktop and mobile; walk Banner → … → Video (and OEM & CTV lane); compare screen content, transitions, and absence of white/blank glass against current production.

**Acceptance Scenarios**:

1. **Given** a cold visit to `/solutions` on desktop, **When** the sticky phone boots, **Then** glass is never left blank/white; still content appears promptly and format MP4s promote without a remount flash.
2. **Given** the visitor scrolls through formats, **When** copy and glass update, **Then** visuals match the pre-refactor behavior (same formats, same motion character, same lane switch).
3. **Given** mobile or reduced-motion, **When** `/solutions` loads, **Then** the CSS phone + live feed path works and does not require the desktop 3D chassis to complete first.

---

### User Story 3 - Leaner site without dead weight (Priority: P2)

Editors and deploy pipelines ship a smaller, clearer site: unused pages, scratch media, and orphan assets no longer inflate downloads or confuse the architecture map.

**Why this priority**: Dead weight slows every route and increases risk of shipping the wrong file; cleanup is reversible via git but high leverage.

**Independent Test**: After cleanup, production build and live routes still pass the Home + Solutions visual checklists; removed items are confirmed unused (no live links/imports).

**Acceptance Scenarios**:

1. **Given** the current architecture map (`App.tsx` routes + nav), **When** dead pages/assets are removed or quarantined, **Then** no live navigation or redirect still depends on them.
2. **Given** a production build, **When** output is inspected, **Then** scratch/tmp media and unused alternate phone/hero files are not part of the shipped payload.
3. **Given** a visitor uses only live routes (Home, Solutions, Studio, Cases, Company, Clients, Contact, legal), **When** they navigate the site, **Then** behavior and visuals match the milestone—nothing user-facing breaks due to cleanup.

---

### User Story 4 - Deeper pages stay responsive after Home (Priority: P3)

A visitor who continues to Studio, Cases, Company, or Contact gets those experiences on demand rather than paying for them on the first Home byte.

**Why this priority**: Improves overall session feel once P1 surfaces are protected; secondary to Home/Solutions fidelity.

**Independent Test**: From a cold Home load, open Network (or equivalent) and confirm deep-route payloads are not required before Home is interactive; then open each deep route and confirm it still renders correctly.

**Acceptance Scenarios**:

1. **Given** a cold Home visit, **When** measuring early load, **Then** Studio/Cases/Company/Contact-specific heavy experiences are not required to finish before Home is usable.
2. **Given** the visitor navigates to a deep route, **When** that page loads, **Then** it appears complete (no missing chrome or permanent empty shell).

---

### Edge Cases

- Slow or flaky network: progressive enhancement must not leave permanent blank Hero or blank Solutions glass; silhouettes/fallbacks already in use must remain.
- Theme toggle during Hero asset warm-up: no wrong-theme flash or stuck veil.
- Soft navigation between Home ↔ Solutions: no double-loading storms or visual flicker regressions.
- Legacy URLs (`/clarity`, `/expertise`, `/measurement`, etc.): still redirect correctly after dead-page cleanup.
- Build/deploy: required brand/hero assets for a successful production build remain available; only unused extras are removed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST reduce time-to-usable Home and Solutions experiences without removing or downgrading the visible graphics and motion that define those surfaces today.
- **FR-002**: The Home Hero MUST continue to deliver the Everest 3D (or approved non-3D fallback) experience and the dual theme/narrative pipeline with no intentional visual regression.
- **FR-003**: The `/solutions` experience MUST continue to deliver the glass-phone pipeline (desktop chassis + format stills promoting to format videos; mobile CSS phone + live feed) with no intentional visual regression versus the current production milestone.
- **FR-004**: Heavy experiences MUST load asynchronously relative to first paint of the route that needs them (Home must not wait on Solutions glass; Solutions must not wait on unrelated deep pages).
- **FR-005**: The shipped product MUST exclude dead pages, scratch media, and orphan assets that are not referenced by the live route map or required build assets.
- **FR-006**: Cleanup MUST preserve all live routes and legacy redirects required by the current IA (including redirects away from retired Clarity/measurement URLs).
- **FR-007**: Mobile and reduced-motion visitors MUST continue to receive coherent experiences that avoid forcing desktop-class WebGL when the product already withholds it.
- **FR-008**: Any compression or delivery change to large visual assets (mountains, phone models, format videos, stills) MUST preserve perceived quality on the primary marketing viewports (no obvious blur, stretching, or color shifts versus current prod).
- **FR-009**: Performance work MUST NOT reintroduce banned motion stacks or scroll hijacks on Solutions (native sticky scroll + existing spring/CSS motion character remains).
- **FR-010**: After refactor, production build and deploy to the existing hosting target MUST succeed with the same required brand/hero assets contract unless explicitly updated in docs.

### Key Entities

- **Hero experience**: Brand first viewport including Everest visual system and theme-linked narrative.
- **Solutions glass experience**: Sticky format lanes, phone chassis, format stills, format MP4s, mobile live feed.
- **Live route map**: Public pages and redirects that visitors can reach from nav or bookmarks.
- **Shipped media set**: Assets that must remain in production builds versus local/scratch-only files.
- **Load budget**: Qualitative target for “usable sooner” measured against the pre-refactor baseline on Home and Solutions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a cold Home load (mid-range laptop, cable or typical broadband), time to a usable hero chrome/first meaningful brand frame improves by at least **20%** versus the pre-refactor baseline measured the same way.
- **SC-002**: On a cold `/solutions` load (desktop), time to first non-blank glass content improves by at least **20%** versus baseline, **or** stays within **10%** if already near optimal—while passing the visual parity checklist.
- **SC-003**: **100%** of the Solutions visual sanity checklist items (format scroll sync, lane switch, no blank glass, mobile CSS phone, no horizontal page scroll) pass after refactor.
- **SC-004**: **100%** of the Home hero visual sanity items (theme toggle, mountain present in both themes, no wrong-theme flash, mobile/reduced coherent fallback) pass after refactor.
- **SC-005**: Production build artifact size attributable to unused pages/scratch media drops—**zero** scratch `.tmp-*` and confirmed-unused alternate phone/hero drafts in the deployed output.
- **SC-006**: Spot-check navigation of live IA routes (Home, Solutions, Studio, Cases, Company, Clients, Contact) shows **no new broken pages** after cleanup.
- **SC-007**: At least **8 of 10** internal reviewers (or the owner + one peer) rate Home and Solutions as “visually unchanged” in a side-by-side with production.

## Assumptions

- Baseline measurements will be taken once at the start of planning/implementation against current production (`upraiser-site.vercel.app`) using the same device/network profile for before/after.
- “Full preservation of graphics and visual effects” means no intentional redesign; micro timing differences during load (e.g. brief silhouette) already accepted by product are allowed if final settled visuals match.
- Dead-page candidates start from architecture docs (`App.tsx` as source of truth): unused page modules and local scratch media listed in handoff refactor readiness—not removal of live Studio/Cases/Company.
- Clarity remains retired; redirects stay. Why Us lives on About (`/company`), not Home.
- HyperFrames source under `videos/` stays local/dev and is not a production runtime dependency.
- Hosting remains the existing Vercel production alias; this feature does not include DNS cutover.
- Exact byte budgets for GLB/MP4 compression are an implementation concern; the acceptance bar is perceived quality + load-time improvement above.
