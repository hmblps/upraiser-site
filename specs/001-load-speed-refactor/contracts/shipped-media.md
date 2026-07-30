# Contract: Shipped Media Set

**Feature**: `001-load-speed-refactor`  
**Audience**: Implementers + release  
**Related**: [spec.md](../spec.md) US3, FR-005, FR-006, FR-010, SC-005, SC-006

## Purpose

Define what may ship in production builds versus what must stay local/scratch.

## Classes

| Class | May ship? | Examples (illustrative) |
|-------|-----------|-------------------------|
| `required-build` | Yes (build fails without) | OG image, Everest GLBs required by verify scripts |
| `runtime-visual` | Yes | Phone GLBs used by Phone3D, format stills/MP4s, partner logos in use |
| `scratch` | No | `.tmp-*`, experimental crops, unused alternate phone GLBs |
| `local-tooling` | No (not in `dist`) | HyperFrames pilot under `videos/` unless explicitly published |

## Guarantees

1. Production deploy output contains **no** `scratch` files.
2. Live routes and legacy redirects continue to resolve after page-module cleanup.
3. Removing an asset requires confirming **zero** runtime references from live code.
4. `npm run build` still passes verify for required brand/hero assets.

## Verification

See [quickstart.md](../quickstart.md) § Cleanup & build.
