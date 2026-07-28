# Project assets (source of truth)

Canonical deploy media lives here in the **project root**. Before build, `scripts/sync-assets.sh` copies files into `public/` (what Vite serves).

| Path | Deployed as | Required |
|------|-------------|----------|
| `assets/hero/everest.glb` | `/hero/everest.glb` | **Yes** — live 3D hero terrain |
| `assets/brand/upraiser-logo.png` | `/upraiser-logo.png` | Yes |
| `assets/brand/favicon.png` | `/favicon.png` | Yes |
| `assets/brand/og-image.png` | `/og-image.png` | Yes |
| `assets/maps/world-dots-dark.svg` | `/maps/world-dots-dark.svg` | Yes (sync) |
| `assets/maps/world-dots-light.svg` | `/maps/world-dots-light.svg` | Yes (sync) |

**Also required in `public/` (not under `assets/`):**

| Path | Role |
|------|------|
| `public/draco/gltf/draco_decoder.wasm` | Draco for Everest GLB |
| `public/draco/gltf/draco_wasm_wrapper.js` | Draco wrapper |
| `public/cases/logos/*.png` | Case brand marks (edit in place) |
| `public/partners/*` | Partner marks |
| `public/fonts/*` | Self-hosted fonts |
| `public/privacy`, `public/terms`, `public/legal` | Legal static pages |

### Optional / legacy

| Path | Notes |
|------|-------|
| `assets/hero/light-mountains-loop.mp4` | Legacy mountains loop (~7 MB). **Not** copied to `public/` by sync. May still be used by `npm run generate:og`. Do **not** treat as the live hero background — production hero is R3F + `everest.glb`. |

### Commands

```bash
bash scripts/sync-assets.sh
bash scripts/verify-assets.sh
npm run optimize:everest    # gltf-transform pipeline for Everest
npm run generate:og         # regenerate og-image.png
```

Partner SVGs, fonts, and legal HTML remain under `public/` only (small / edited in place).

See **[CONTEXT.md](../CONTEXT.md)** for hero 3D architecture and **[README.md](../README.md)** for deploy.
