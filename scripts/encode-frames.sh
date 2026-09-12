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

# Mobile: scale to 720x1280 (High Quality JPEG)
for shot in home-mobile-dark expedition-mobile-dark home-mobile-light expedition-mobile-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=720:1280:flags=lanczos" -qscale:v 3 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

# Desktop: scale to 1920x1080 (High Quality JPEG)
for shot in home-dark expedition-dark home-light expedition-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=1920:1080:flags=lanczos" -qscale:v 2 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

echo "Done encoding frames!"
