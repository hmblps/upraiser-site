#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REQUIRED=(
  "assets/hero/everest.glb"
  "assets/hero/everest-light.glb"
  "assets/hero/voyager-nasa.glb"
  "assets/hero/light-mountains-loop.mp4"
  "assets/brand/upraiser-logo.png"
  "assets/brand/favicon.png"
  "assets/brand/og-image.png"
  "public/hero/everest.glb"
  "public/hero/everest-light.glb"
  "public/hero/voyager-nasa.glb"
  "public/hero/light-mountains-loop.mp4"
  "public/draco/gltf/draco_decoder.wasm"
  "public/draco/gltf/draco_wasm_wrapper.js"
  "public/fonts/inter-latin-600.woff2"
  "public/fonts/inter-latin-700.woff2"
  "public/fonts/inter-latin-800.woff2"
  "public/upraiser-logo.png"
  "public/favicon.png"
  "public/og-image.png"
  "public/robots.txt"
  "public/sitemap.xml"
  "public/privacy/index.html"
  "public/terms/index.html"
  "public/legal/legal.css"
  "public/legal/theme-init.js"
  "public/partners/lenovo-logo.png"
)

missing=()

for file in "${REQUIRED[@]}"; do
  if [[ ! -f "$file" ]]; then
    missing+=("$file")
  fi
done

if ((${#missing[@]} > 0)); then
  echo "Missing required static assets:"
  printf '  - %s\n' "${missing[@]}"
  echo
  echo "Deploy media: source in assets/, synced to public/ before build."
  echo "Hero 3D: assets/hero/everest.glb → public/hero/everest.glb"
  echo "Hero 3D light: assets/hero/everest-light.glb → public/hero/everest-light.glb"
  exit 1
fi

echo "Static assets OK."
