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
  # Only sync if the destination is missing files (rsync --ignore-existing is fast)
  missing=$(rsync -a --ignore-existing --dry-run "$src" "$dst" 2>/dev/null | grep -c '^>' || true)
  if [ "$missing" -gt 0 ]; then
    echo "🔄  Restoring public/$folder/ ($missing files missing)…"
    rsync -a --ignore-existing "$src" "$dst"
    RESTORED=$((RESTORED + missing))
  fi
done

if [ "$RESTORED" -gt 0 ]; then
  echo "✅  Restored $RESTORED asset(s) from backup."
else
  echo "✅  All assets present — nothing to restore."
fi
