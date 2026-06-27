#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REQUIRED=(
  "public/hero/light-mountains-loop.mp4"
  "public/hero/light-mountains-loop.webm"
  "public/fonts/inter-latin-600.woff2"
  "public/fonts/inter-latin-700.woff2"
  "public/fonts/inter-latin-800.woff2"
  "public/upraiser-logo.png"
  "public/favicon.png"
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
  echo "All deploy media must live under public/ (Vite copies them to the site root)."
  echo "Hero loop: public/hero/light-mountains-loop.mp4"
  exit 1
fi

echo "Static assets OK."
