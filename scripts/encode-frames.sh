#!/bin/bash
set -e

mkdir -p public/hero/frames/home-mobile-dark
mkdir -p public/hero/frames/home-mobile-light
mkdir -p public/hero/frames/expedition-mobile-dark
mkdir -p public/hero/frames/expedition-mobile-light
mkdir -p public/hero/frames/home-dark
mkdir -p public/hero/frames/home-light
mkdir -p public/hero/frames/expedition-dark
mkdir -p public/hero/frames/expedition-light

# Mobile: scale to 540x960
for shot in home-mobile-dark home-mobile-light expedition-mobile-dark expedition-mobile-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -i captures/$shot/frame_%04d.png -vf scale=540:960 -qscale:v 5 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

# Desktop: scale to 1280x720
for shot in home-dark home-light expedition-dark expedition-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -i captures/$shot/frame_%04d.png -vf scale=1280:720 -qscale:v 5 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

echo "Done encoding frames!"
