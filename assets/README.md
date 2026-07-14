# Project assets (source of truth)

Canonical deploy media lives here in the **project root**. Before build, `scripts/sync-assets.sh` copies files into `public/` (what Vite serves).

| Path | Deployed as |
|------|-------------|
| `assets/hero/light-mountains-loop.mp4` | `/hero/light-mountains-loop.mp4` |
| `assets/brand/upraiser-logo.png` | `/upraiser-logo.png` |
| `assets/brand/favicon.png` | `/favicon.png` |

**Do not delete** `assets/hero/light-mountains-loop.mp4` — hero background video (~7 MB, 1080p).

Restore from production:

```bash
bash scripts/restore-hero-from-prod.sh
```

Partner SVGs, fonts, and legal HTML remain under `public/` only (small / edited in place).
