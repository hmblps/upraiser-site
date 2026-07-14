#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REQUIRED=(
  "assets/hero/light-mountains-loop.mp4"
  "assets/brand/upraiser-logo.png"
  "assets/brand/favicon.png"
  "assets/brand/og-image.png"
  "public/hero/light-mountains-loop.mp4"
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
  echo "Missing required static assets in public/:"
  printf '  - %s\n' "${missing[@]}"
  echo
  echo "All deploy media: source in assets/ (project root), synced to public/ before build."
  echo "Hero loop: assets/hero/light-mountains-loop.mp4"
  echo "Restore: bash scripts/restore-hero-from-prod.sh"
  exit 1
fi

echo "Static assets OK."
