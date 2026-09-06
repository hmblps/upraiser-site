#!/bin/bash
set -e

echo "Encoding home-dark..."
ffmpeg -y -framerate 30 -i captures/home-dark/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/home-dark-scrub.mp4

echo "Encoding home-light..."
ffmpeg -y -framerate 30 -i captures/home-light/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/home-light-scrub.mp4

echo "Encoding expedition-dark..."
ffmpeg -y -framerate 30 -i captures/expedition-dark/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/expedition-dark-scrub.mp4

echo "Encoding expedition-light..."
ffmpeg -y -framerate 30 -i captures/expedition-light/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/expedition-light-scrub.mp4

echo "Done!"
