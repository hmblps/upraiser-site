#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --verify pre-perf-opt >/dev/null 2>&1; then
  echo "Tag pre-perf-opt not found. Roll back manually with: git log --oneline"
  exit 1
fi

echo "This will reset the project to tag pre-perf-opt (before perf optimizations)."
echo "Uncommitted changes will be lost."
read -r -p "Continue? [y/N] " reply
if [[ ! "$reply" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

git reset --hard pre-perf-opt
echo "Done. Restored to pre-perf-opt."
