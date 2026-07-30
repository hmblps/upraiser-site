# Data Model: Load Speed Refactor

**Feature**: `001-load-speed-refactor`  
**Date**: 2026-07-30

This feature does not introduce a database. Entities are **product/runtime concepts** used to reason about load boundaries and ship sets.

## Entities

### HeroExperience

| Field | Description |
|-------|-------------|
| id | `home-hero` |
| surfaces | Brand chrome, headline, CTA, Everest visual system, theme linkage |
| heavyAssets | Theme GLBs (wire + photoreal), optional maps |
| fallback | CSS atmosphere / non-WebGL path for mobile & reduced motion |
| settledVisual | Must match production after load (SC-004) |

**States**: `chrome-ready` → `terrain-loading` → `terrain-ready` → `theme-synced`

**Rules**:
- Theme toggle must not leave wrong-theme flash when assets warm.
- WebGL path must not be required on mobile/reduced when product already withholds it.

### SolutionsGlassExperience

| Field | Description |
|-------|-------------|
| id | `solutions-glass` |
| lanes | App Growth · OEM & CTV |
| formats | banner, native, interstitial, rich, video (ids per lane data) |
| desktopChassis | Theme phone GLBs |
| screenPipeline | still PNG (instant) → MP4 on same materials |
| mobilePath | CssPhone + live HTML feed |
| bootStandIn | Dark silhouette (not flat live feed under canvas) |

**States**: `route-pending` → `silhouette` → `chassis-ready` → `still-ready` → `video-promoted`

**Rules**:
- Never blank/white glass as settled state.
- Format change must not remount in a way that flashes white.
- Mobile path independent of desktop chassis completion.

### LiveRoute

| Field | Description |
|-------|-------------|
| path | Public URL path |
| navVisible | Whether shown in primary nav/footer |
| loadClass | `critical-entry` (Home), `product-demo` (Solutions), `depth`, `legal`, `legacy-redirect` |
| chunkBoundary | Must load independently of unrelated classes |

**Rules**:
- Legacy redirects remain for retired Clarity/measurement URLs.
- Dead pages have `loadClass` removed (no live references).

### ShippedMediaAsset

| Field | Description |
|-------|-------------|
| path | Public/build path |
| role | `required-build` · `runtime-visual` · `scratch` · `local-tooling` |
| referencedBy | Hero / Solutions / brand / none |

**Rules**:
- `scratch` and unreferenced `local-tooling` must not appear in deploy output.
- `required-build` failures block `npm run build` (existing verify scripts).

### LoadBudgetSample

| Field | Description |
|-------|-------------|
| route | `/` or `/solutions` |
| profile | device + network label |
| baselineMs | Pre-refactor metric |
| afterMs | Post-refactor metric |
| metric | e.g. time-to-usable-chrome, time-to-non-blank-glass, LCP |

**Rules**:
- Same profile for before/after (SC-001, SC-002).

## Relationships

```text
LiveRoute (Home) --owns--> HeroExperience
LiveRoute (Solutions) --owns--> SolutionsGlassExperience
HeroExperience --uses--> ShippedMediaAsset[]
SolutionsGlassExperience --uses--> ShippedMediaAsset[]
LoadBudgetSample --measures--> LiveRoute
```

## Validation (from spec)

- FR-002/003: settled visuals unchanged for Hero + Solutions.
- FR-005: no scratch in shipped set.
- FR-006: legacy redirects intact.
- SC-001/002: budget samples show required improvement or allowed tolerance.
