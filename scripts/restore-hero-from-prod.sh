#!/usr/bin/env bash
# Download hero loop from production into assets/ (source of truth) and sync to public/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

URL="${HERO_RESTORE_URL:-https://upraiser-site.vercel.app/hero/light-mountains-loop.mp4}"
DEST="assets/hero/light-mountains-loop.mp4"

mkdir -p assets/hero
echo "Downloading hero video from $URL ..."
curl -fsSL "$URL" -o "$DEST"
ls -lh "$DEST"

bash scripts/sync-assets.sh
echo "Done. Hero saved to assets/hero/ and copied to public/hero/."
