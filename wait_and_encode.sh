#!/bin/bash
echo "Waiting for task 16978 to finish..."
wait $(pgrep -f "capture-all-mobile.js") || true
echo "Encoding..."
sh scripts/encode-frames.sh
echo "Committing..."
git add public/hero/frames/
git commit -m "chore(hero): regenerate fallback image sequence frames for baked light model"
git push
echo "Done!"
