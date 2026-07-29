# Project assets (source of truth)

Canonical deploy media lives under **`assets/`**. Before build, `scripts/sync-assets.sh` copies into `public/` (Vite root). `scripts/verify-assets.sh` fails the build if required files are missing.

| Path | Deployed as | Required |
|------|-------------|----------|
| `assets/hero/everest.glb` | `/hero/everest.glb` | **Yes** — dark wire terrain |
| `assets/hero/everest-light.glb` | `/hero/everest-light.glb` | **Yes** — light photoreal terrain |
| `assets/brand/upraiser-logo.png` | `/upraiser-logo.png` | Yes |
| `assets/brand/favicon.png` | `/favicon.png` | Yes |
| `assets/brand/og-image.png` | `/og-image.png` | Yes |
| `assets/maps/world-dots-dark.svg` | `/maps/world-dots-dark.svg` | Yes (Company footprint map) |
| `assets/maps/world-dots-light.svg` | `/maps/world-dots-light.svg` | Yes |

**Also required in `public/` (not under `assets/`):**

| Path | Role |
|------|------|
| `public/draco/gltf/draco_decoder.wasm` | Draco for Everest GLBs |
| `public/draco/gltf/draco_wasm_wrapper.js` | Draco wrapper |
| `public/cases/logos/*.png` | Case brand marks |
| `public/partners/*` | Partner marks |
| `public/fonts/*` | Self-hosted fonts |
| `public/privacy`, `public/terms`, `public/legal` | Legal static pages |
| `public/hero/*-fallback.png` | CSS / lite fallbacks (optional polish) |
| `public/phones/deep-blue.glb` | Solutions phone (growth / light) |
| `public/phones/orange.glb` | Solutions phone (infrastructure / dark) |
| `public/channels/programmatic-refs/screens/*.png` | Solutions glass stills (instant) |
| `public/channels/programmatic-feed/formats/*.mp4` | Solutions glass format videos |
| `public/channels/programmatic-feed/*.{jpg}` | Live HTML feed backgrounds |

### Not shipped / ignore

| Path | Notes |
|------|-------|
| `assets/hero/*.src.glb` | Heavy Sketchfab sources — **gitignored** |
| `assets/hero/snowy-mountain-v2.src.glb` | Quarantined wrong mountain — do not sync |
| `assets/hero/ascent-bird.glb` | Leftover; live bird is procedural (`AscentBird.tsx`) — safe to delete locally |
| `assets/hero/light-mountains-loop.mp4` | Legacy loop — **not** synced; optional OG tooling only |
| `videos/solutions-pilot/` | HyperFrames source for format MP4s — local authoring only |
| `.tmp-*` | Scratch screenshots / strips — do not commit |

### Commands

```bash
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh
npm run optimize:everest         # dark / wire GLB
npm run optimize:everest-light   # light maps + roughness bake
npm run generate:og              # regenerate og-image.png
```

Partner SVGs, fonts, legal HTML, phone GLBs, and Solutions channel media stay under `public/` (edited in place).

See **[SOLUTIONS.md](./SOLUTIONS.md)** for glass pipeline · **[HERO.md](./HERO.md)** for hero 3D · **[README.md](../README.md)** for deploy · **[HANDOFF.md](./HANDOFF.md)** for IA.
