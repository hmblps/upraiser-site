#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REQUIRED=(
  "public/hero/everest.glb"
  "public/hero/everest-light.glb"
  "public/hero/voyager-nasa.glb"
  "public/hero/light-mountains-loop.mp4"
  "public/hero/snow/snow_02_diff_2k.webp"
  "public/hero/snow/snow_02_nor_gl_2k.webp"
  "public/hero/snow/snow_02_rough_2k.webp"
  "public/draco/gltf/draco_decoder.wasm"
  "public/draco/gltf/draco_wasm_wrapper.js"
  "public/fonts/inter-latin-600.woff2"
  "public/fonts/inter-latin-700.woff2"
  "public/fonts/inter-latin-800.woff2"
  "public/upraiser-logo.png"
  "public/favicon.png"
  "public/favicon-16x16.png"
  "public/favicon-32x32.png"
  "public/apple-touch-icon.png"
  "public/og-image.png"
  "public/robots.txt"
  "public/sitemap.xml"
  "public/site.webmanifest"
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
