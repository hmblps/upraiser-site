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
    exit 1
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

# Live Hero 3D models (dark wire + light photo + dark Voyager probe).
copy "assets/hero/everest.glb" "public/hero/everest.glb"
copy "assets/hero/everest-light.glb" "public/hero/everest-light.glb"
copy "assets/hero/voyager-nasa.glb" "public/hero/voyager-nasa.glb"

# Mobile hero atmosphere — original mountains loop (desktop keeps WebGL Everest).
copy "assets/hero/light-mountains-loop.mp4" "public/hero/light-mountains-loop.mp4"

# Brand / legal / maps
copy "assets/brand/upraiser-logo.png" "public/upraiser-logo.png"
copy "assets/brand/favicon.png" "public/favicon.png"
copy "assets/brand/og-image.png" "public/og-image.png"
copy "assets/maps/world-dots-dark.svg" "public/maps/world-dots-dark.svg"
copy "assets/maps/world-dots-light.svg" "public/maps/world-dots-light.svg"

echo "Synced assets/ → public/."
