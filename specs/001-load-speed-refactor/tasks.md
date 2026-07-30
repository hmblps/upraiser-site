# Tasks: Load Speed Refactor

**Input**: Design documents from `/specs/001-load-speed-refactor/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Manual only (quickstart + visual checklists). No automated e2e/contract test tasks — none requested in the spec.

**Organization**: Phases by user story so each increment is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete work)
- **[Story]**: US1…US4 maps to spec user stories
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline metrics and working branch before any code changes

- [x] T001 Create feature branch `001-load-speed-refactor` from current main and set Spec Kit feature pointer in `.specify/feature.json`
- [x] T002 Capture cold-load baseline metrics for `/` and `/solutions` per [quickstart.md](./quickstart.md) into `specs/001-load-speed-refactor/baseline.md` (device/network label, LCP / time-to-usable-chrome / time-to-non-blank-glass)
- [x] T003 [P] Confirm local build gate works with `npm run build` and note current `dist/` size in `specs/001-load-speed-refactor/baseline.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Inventory and isolation map that ALL stories use — no visual/code changes yet beyond docs

**⚠️ CRITICAL**: Complete before US1–US4 implementation

- [ ] T004 Document live route map vs page modules by comparing `src/App.tsx` to `src/pages/*.tsx` in `specs/001-load-speed-refactor/inventory-routes.md` (mark live / redirect-only / dead)
- [ ] T005 [P] Inventory Home critical path imports in `src/pages/HomePage.tsx`, `src/components/Hero.tsx`, `src/components/hero-terrain/HeroTerrainCanvas.tsx`, `src/components/Everest.tsx` — list any Solutions/deep-route static imports in `specs/001-load-speed-refactor/inventory-home.md`
- [ ] T006 [P] Inventory Solutions critical path in `src/pages/SolutionsPage.tsx`, `src/components/solutions/ProgrammaticScrollSection.tsx`, `src/components/solutions/Phone3D.tsx` — confirm preload stays Solutions-scoped in `specs/001-load-speed-refactor/inventory-solutions.md`
- [ ] T007 [P] Inventory shipped vs scratch media under `public/`, `assets/`, repo-root `.tmp-*`, `public/phones/`, `videos/` against [contracts/shipped-media.md](./contracts/shipped-media.md) into `specs/001-load-speed-refactor/inventory-media.md` (class each asset)

**Checkpoint**: Inventories exist — story implementation can begin

---

## Phase 3: User Story 1 — Faster first impression on Home (Priority: P1) 🎯 MVP

**Goal**: Cold `/` becomes usable sooner without changing settled Everest + theme visuals ([contracts/home-hero-load.md](./contracts/home-hero-load.md))

**Independent Test**: Cold-load `/`; hero chrome sooner vs `baseline.md`; theme toggle + mountain parity; mobile/reduced coherent; Solutions assets not required for Home usable

### Implementation for User Story 1

- [ ] T008 [US1] Audit and remove accidental static imports of Solutions/deep pages from Home critical path in `src/pages/HomePage.tsx` and `src/App.tsx` (Home must stay eager-or-local only)
- [ ] T009 [US1] Tighten `usePreloadHome` in `src/pages/HomePage.tsx` so idle preloads never touch Solutions (`Phone3D`, format MP4s, solutions CSS) — only near/mid/far Home sections
- [ ] T010 [P] [US1] Defer non-critical Home chrome that blocks first paint if found in `src/components/ViewportChrome.tsx` / `src/layouts/SiteLayout.tsx` without changing visual design
- [ ] T011 [US1] Ensure Hero terrain preload stays progressive (no parse-time light-GLB force) in `src/components/Everest.tsx` and `src/components/hero-terrain/HeroTerrainCanvas.tsx` per research R1
- [ ] T012 [US1] Verify CSS/reduced-motion hero path still coherent in `src/components/Hero.tsx` and related hero CSS under `src/styles/` (FR-007) — fix only if regression introduced
- [ ] T013 [US1] Re-measure cold `/` into `specs/001-load-speed-refactor/baseline.md` (after section) and confirm ≥20% usable-chrome improvement (SC-001) or document gap + next lever

**Checkpoint**: US1 independently meets Home contract + SC-001/SC-004 path

---

## Phase 4: User Story 2 — Solutions glass stays fast and identical (Priority: P1)

**Goal**: `/solutions` loads in isolation; glass still→MP4 parity preserved ([contracts/solutions-glass-load.md](./contracts/solutions-glass-load.md))

**Independent Test**: Cold `/solutions` desktop + mobile; checklist vs production; no white glass; no GSAP/wheel hijack

### Implementation for User Story 2

- [ ] T014 [US2] Confirm `lazy(() => import("./pages/SolutionsPage"))` in `src/App.tsx` is the only entry and Home does not preload that chunk; fix any eager Solutions import
- [ ] T015 [US2] Keep `preloadPhone3DAssets` mount-scoped in `src/components/solutions/ProgrammaticScrollSection.tsx` — do not call from Home or global layout
- [ ] T016 [US2] Preserve silhouette → chassis → still → MP4 pipeline in `src/components/solutions/Phone3D.tsx` (no Suspense Still↔Video remount that flashes white)
- [ ] T017 [P] [US2] Verify mobile CssPhone + live feed path in `src/components/solutions/` + `src/components/channel-visuals/` does not wait on desktop GLB completion
- [ ] T018 [US2] Guard against reintroducing banned motion stacks on Solutions (no GSAP/ScrollTrigger) in `src/pages/SolutionsPage.tsx` and `src/components/solutions/ProgrammaticScrollSection.tsx`
- [ ] T019 [US2] Re-measure cold `/solutions` non-blank glass vs baseline in `specs/001-load-speed-refactor/baseline.md` (SC-002) and run visual sanity checklist (SC-003)

**Checkpoint**: US2 passes glass contract independently of US3/US4

---

## Phase 5: User Story 3 — Leaner site without dead weight (Priority: P2)

**Goal**: Remove dead pages/scratch media from ship set ([contracts/shipped-media.md](./contracts/shipped-media.md)); live IA + redirects intact

**Independent Test**: `npm run build`; `dist/` has no scratch; live routes + `/clarity`/`/expertise`/`/measurement` redirects work; Home+Solutions visuals still pass

### Implementation for User Story 3

- [ ] T020 [P] [US3] Delete unused page modules confirmed dead in inventory (e.g. `src/pages/AboutPage.tsx`, `src/pages/ExpertisePage.tsx`) after zero-reference grep from `src/`
- [ ] T021 [P] [US3] Remove or stop tracking scratch media: repo-root `.tmp-*`, unused alternate phone GLBs under `public/phones/` (e.g. `copper-opt.glb`, `deep-blue-full.glb`, `silver.glb` if unused), unused `ascent-bird.glb` under `public/`/`assets/` per HANDOFF §20
- [ ] T022 [US3] Ensure HyperFrames pilot under `videos/` cannot enter `dist/` — update `.gitignore` and/or Vite/public copy rules; verify after `npm run build`
- [ ] T023 [US3] Preserve legacy redirects for Clarity/measurement/expertise in `src/App.tsx` and/or `src/pages/LegacyRedirects.tsx` after dead-page deletion (FR-006)
- [ ] T024 [US3] Update architecture notes in `docs/HANDOFF.md` §20 (mark cleaned items) and keep required-build assets listed for `scripts/verify-assets.sh`
- [ ] T025 [US3] Run `npm run build`, inspect `dist/` for zero `.tmp-*` / unused drafts (SC-005), spot-check live IA routes (SC-006)

**Checkpoint**: Ship set lean; no live-route breakage

---

## Phase 6: User Story 4 — Deeper pages stay responsive after Home (Priority: P3)

**Goal**: Studio/Cases/Company/Contact stay on-demand; Home early load does not require their heavy chunks

**Independent Test**: Cold Home Network: deep-route chunks not required before Home usable; soft-nav each deep route still renders complete

### Implementation for User Story 4

- [ ] T026 [US4] Audit `src/App.tsx` lazy map — ensure Studio/Cases/Company/Clients/Contact/CaseDetail/Legal remain `React.lazy` and are not statically imported from Home
- [ ] T027 [P] [US4] Audit nested eager imports inside `src/pages/StudioPage.tsx`, `src/pages/CasesPage.tsx`, `src/pages/CompanyPage.tsx`, `src/pages/ContactPage.tsx` — keep heavy children lazy (`Studio`, case wheels, charts) without changing UI
- [ ] T028 [US4] Prevent Home idle preload from warming deep-route page chunks in `src/pages/HomePage.tsx` (only Home sections)
- [ ] T029 [US4] Soft-nav smoke: from Home open Studio, Cases, Company, Clients, Contact, a case detail — confirm complete chrome (no permanent empty shell)

**Checkpoint**: US4 isolation verified; deep routes still work

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docs, optional media compress only if parity holds, final validation

- [ ] T030 [P] Optional: compress large runtime media (Everest/phone GLB, format MP4) only if visual parity holds (FR-008) via existing `scripts/optimize-everest*.mjs` or documented encode — update `assets/` + `public/` sync
- [ ] T031 [P] Sync docs: `docs/HERO.md`, `docs/SOLUTIONS.md`, `docs/HANDOFF.md` load notes after changes (no redesign docs)
- [ ] T032 Run full [quickstart.md](./quickstart.md) validation and record pass/fail in `specs/001-load-speed-refactor/validation.md`
- [ ] T033 Side-by-side visual review vs https://upraiser-site.vercel.app for Home + Solutions (SC-007 owner check) — note result in `validation.md`
- [ ] T034 Final `npm run build` + oxlint/typecheck; fix any regressions introduced by this feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks** US1–US4
- **US1 (Phase 3)**: After Phase 2 — MVP
- **US2 (Phase 4)**: After Phase 2 — can run parallel with US1 if staffed (prefer after US1 if single agent to avoid Home/Solutions conflict in `App.tsx`)
- **US3 (Phase 5)**: After Phase 2; safest after US1+US2 visual parity locked
- **US4 (Phase 6)**: After Phase 2; can parallel US3; verify after US1 so Home preload changes compose
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

```text
Phase 1 → Phase 2 → US1 (MVP)
                   ↘ US2 (parallel OK; serialize App.tsx edits)
                   ↘ US3 (prefer after US1+US2)
                   ↘ US4 (after US1 preload rules)
                 → Phase 7
```

- **US1**: No dependency on US2–US4
- **US2**: No dependency on US3–US4; share `App.tsx` carefully with US1/US4
- **US3**: Independent of load timing work but validate Home+Solutions after deletes
- **US4**: Builds on US1 preload discipline

### Parallel Opportunities

- T003 || (after T001) with T002 carefully — prefer T002 then T003
- T005, T006, T007 in parallel after T004 starts
- T010 || T011 within US1 after T008–T009 direction clear
- T017 || T018 within US2 after T015–T016
- T020 || T021 within US3
- T027 || T026 within US4
- T030 || T031 in Polish

---

## Parallel Example: User Story 1

```bash
# After T008–T009 set preload rules:
Task: "Defer non-critical Home chrome in ViewportChrome/SiteLayout"
Task: "Ensure Hero terrain preload progressive in Everest + HeroTerrainCanvas"
```

## Parallel Example: User Story 3

```bash
# After inventory confirms unused:
Task: "Delete dead page modules AboutPage/ExpertisePage"
Task: "Remove scratch .tmp-* and unused phone GLBs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2  
2. Phase 3 (US1)  
3. **STOP** — validate Home contract + SC-001  
4. Demo/ship Home win if needed  

### Incremental Delivery

1. Setup + Foundational  
2. US1 → validate Home  
3. US2 → validate Solutions  
4. US3 → lean ship set  
5. US4 → deep-route isolation  
6. Polish + quickstart + owner visual OK  

### Suggested single-agent order

`T001→T007` → `T008→T013` → `T014→T019` → `T020→T025` → `T026→T029` → `T030→T034`

---

## Notes

- Do **not** strip `three` / R3F / router from `package.json`
- Do **not** redesign Hero or Solutions glass — isolation + cleanup + progressive load only
- Do **not** reintroduce Suspense Still↔Video white flash
- Commit only when the user asks
- Stop at any story checkpoint to validate independently
