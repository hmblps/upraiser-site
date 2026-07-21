#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run: vercel login"
  exit 1
fi

if [[ ! -d .vercel ]]; then
  vercel link --yes --project upraiser-site
fi

if [[ -f .env ]]; then
  # shellcheck disable=SC2046
  KEY="$(grep -E '^VITE_WEB3FORMS_ACCESS_KEY=' .env | cut -d= -f2- | tr -d '\r' || true)"
  if [[ -n "$KEY" && "$KEY" != "your_access_key_here" ]]; then
    for env in production preview development; do
      printf '%s' "$KEY" | vercel env add VITE_WEB3FORMS_ACCESS_KEY "$env" --force >/dev/null 2>&1 || true
    done
    echo "Web3Forms key synced to Vercel env."
  else
    echo "Warning: VITE_WEB3FORMS_ACCESS_KEY missing in .env — contact form won't work until you add it in Vercel dashboard."
  fi
fi

vercel build --prod --yes
vercel deploy --prebuilt --prod --yes --no-wait
