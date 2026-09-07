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

# Dark wireframe keeps qscale 5 (already dense). Light snow needs a gentler JPEG.
# Mobile: scale to 540x960
for shot in home-mobile-dark expedition-mobile-dark; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=540:960:flags=lanczos" -qscale:v 5 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done
for shot in home-mobile-light expedition-mobile-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=540:960:flags=lanczos" -qscale:v 2 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

# Desktop: scale to 1280x720
for shot in home-dark expedition-dark; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=1280:720:flags=lanczos" -qscale:v 5 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done
for shot in home-light expedition-light; do
  echo "Encoding $shot frames..."
  ffmpeg -y -start_number 0 -i captures/$shot/frame_%04d.png -vf "scale=1280:720:flags=lanczos" -qscale:v 2 -start_number 1 public/hero/frames/$shot/frame_%04d.jpg >/dev/null 2>&1
done

echo "Done encoding frames!"
