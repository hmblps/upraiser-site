# Project assets (source of truth)

Canonical deploy media lives here in the **project root**. Before build, `scripts/sync-assets.sh` copies files into `public/` (what Vite serves).

| Path | Deployed as |
|------|-------------|
| `assets/hero/light-mountains-loop.mp4` | `/hero/light-mountains-loop.mp4` |
| `assets/brand/upraiser-logo.png` | `/upraiser-logo.png` |
| `assets/brand/favicon.png` | `/favicon.png` |
| `assets/brand/og-image.png` | `/og-image.png` |

Case brand marks live under `public/cases/logos/` (edited in place; not under `assets/`).

**Do not delete** `assets/hero/light-mountains-loop.mp4` — hero background video (~7 MB, 1080p).

Future ascent scrub clip (planned, see `CONTEXT.md`): `assets/hero/ascent/` → `public/hero/ascent/`.

Regenerate OG image after hero or brand changes:

```bash
npm run generate:og
```

Restore from production:

```bash
bash scripts/restore-hero-from-prod.sh
```

Partner SVGs, fonts, and legal HTML remain under `public/` only (small / edited in place).
