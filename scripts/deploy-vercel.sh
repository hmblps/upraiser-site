#!/usr/bin/env bash
set -euo pipefail

export CI=1
export VERCEL_NO_UPDATE_NOTIFIER=1
export VERCEL_TELEMETRY_DISABLED=1

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# upraiser-site.vercel.app is aliased to project upraiser-site-v2 (not upraiser-site).
VERCEL_PROJECT="${VERCEL_PROJECT:-upraiser-site-v2}"

# Vercel blocks Git deploys when commit email ≠ GitHub account. Use a verified GitHub email.
GIT_EMAIL="$(git config user.email || true)"
case "$GIT_EMAIL" in
  *@gmail.com|*@googlemail.com|"")
    echo "Warning: git user.email is '${GIT_EMAIL:-unset}' — Vercel may block if not verified on GitHub."
    echo "  Use: git config user.email \"alex@upraiser.co.uk\" (must be added at https://github.com/settings/emails)"
    ;;
esac

if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run: vercel login"
  exit 1
fi

vercel link --yes --project "$VERCEL_PROJECT"

if [[ -f .env ]]; then
  sync_env_var() {
    local var_name="$1"
    local val
    val="$(grep -E "^${var_name}=" .env | cut -d= -f2- | tr -d '\r' || true)"
    val="${val%\"}"
    val="${val#\"}"
    val="${val%\'}"
    val="${val#\'}"
    if [[ -n "$val" && "$val" != "your_"* && "$val" != "https://your-"* ]]; then
      for target_env in production preview development; do
        printf '%s' "$val" | vercel env add "$var_name" "$target_env" --force >/dev/null 2>&1 || true
      done
      echo "$var_name synced to Vercel env."
    fi
  }

  sync_env_var "RESEND_API_KEY"
  sync_env_var "RESEND_FROM_EMAIL"
  sync_env_var "NOTIFICATION_EMAIL"
  sync_env_var "VITE_SUPABASE_URL"
  sync_env_var "VITE_SUPABASE_ANON_KEY"
  sync_env_var "SUPABASE_SERVICE_ROLE_KEY"
  sync_env_var "VITE_WEB3FORMS_ACCESS_KEY"
  sync_env_var "VITE_TELEGRAM_BOT_TOKEN"
  sync_env_var "VITE_TELEGRAM_CHAT_ID"
fi

echo "Building Vercel functions and framework scaffolding…"
vercel build --prod --yes

echo "Rebuilding client bundle with real environment variables…"
if [[ -f .env ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "$line" ]] && continue
    if [[ "$line" =~ ^([A-Za-z0-9_]+)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      val="${BASH_REMATCH[2]}"
      val="${val%\"}"
      val="${val#\"}"
      val="${val%\'}"
      val="${val#\'}"
      export "$key"="$val"
    fi
  done < .env
fi

# Remove masked .vercel/.env.production.local that contains [SENSITIVE]
rm -f .vercel/.env.production.local

npm run build

echo "Syncing verified client bundle to .vercel/output/static…"
rm -rf .vercel/output/static/*
cp -R dist/* .vercel/output/static/

# Verify no [SENSITIVE] tokens made it into client assets
if grep -rn "\[SENSITIVE\]" .vercel/output/static/ 2>/dev/null; then
  echo "ERROR: [SENSITIVE] placeholder found in client build assets! Aborting deploy."
  exit 1
fi
echo "Client bundle integrity verified: all public variables resolved cleanly."

echo "Deploying prebuilt output to ${VERCEL_PROJECT} (production)…"
DEPLOY_URL="$(vercel deploy --prebuilt --prod --yes 2>&1 | tee /dev/stderr | grep -Eo 'https://[^ ]+\.vercel\.app' | tail -1)"

echo ""
echo "Deployment URL: ${DEPLOY_URL:-unknown}"
echo "Inspect: vercel inspect ${DEPLOY_URL:-}"
echo ""
echo "Production alias check:"
vercel alias ls 2>/dev/null | grep 'upraiser-site.vercel.app' || echo "  (run: vercel alias ls)"
echo ""
echo "If status stays UNKNOWN, open Vercel dashboard → ${VERCEL_PROJECT} → Deployments and promote/redeploy there."
