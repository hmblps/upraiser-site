#!/usr/bin/env bash
# Restores large public assets from the local backup folder if they are missing.
# The backup lives OUTSIDE the git repo and is never touched by git operations.
#
# Backup location: ~/Downloads/upraiser-assets-backup/
# Run automatically via the "predev" npm script, or manually: bash scripts/restore-assets.sh

set -e

BACKUP="$HOME/Downloads/upraiser-assets-backup"
PUBLIC="$(cd "$(dirname "$0")/.." && pwd)/public"

if [ ! -d "$BACKUP" ]; then
  echo "⚠️  Asset backup not found at $BACKUP — skipping restore."
  echo "   Run this once to create it:"
  echo "   rsync -a public/{hero,channels,phones,draco,clients,maps,images} $BACKUP/"
  exit 0
fi

RESTORED=0
for folder in hero channels phones draco clients maps images; do
  src="$BACKUP/$folder/"
  dst="$PUBLIC/$folder/"
  if [ ! -d "$src" ]; then continue; fi
  mkdir -p "$dst"
  # Copy only files that are missing at dest. Do not dry-run — rsync -n without
  # --info=NAME produced empty output, so this script used to skip a wiped public/.
  copied=$(rsync -a --ignore-existing --out-format='%n' "$src" "$dst" | grep -cve '/$' || true)
  if [ "$copied" -gt 0 ]; then
    echo "🔄  Restoring public/$folder/ ($copied files missing)…"
    RESTORED=$((RESTORED + copied))
  fi
done

if [ "$RESTORED" -gt 0 ]; then
  echo "✅  Restored $RESTORED asset(s) from backup."
else
  echo "✅  All assets present — nothing to restore."
fi
