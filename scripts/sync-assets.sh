#!/usr/bin/env bash
# Copy canonical media from project-root assets/ → public/ (Vite deploy root).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

copy() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "$src" ]]; then
    echo "Missing source asset: $src"
    echo "Restore hero: bash scripts/restore-hero-from-prod.sh"
    exit 1
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

copy "assets/hero/light-mountains-loop.mp4" "public/hero/light-mountains-loop.mp4"
copy "assets/brand/upraiser-logo.png" "public/upraiser-logo.png"
copy "assets/brand/favicon.png" "public/favicon.png"
copy "assets/brand/og-image.png" "public/og-image.png"

echo "Synced assets/ → public/."
