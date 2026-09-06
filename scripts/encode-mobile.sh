#!/bin/bash
set -e

echo "Encoding home-mobile-dark..."
ffmpeg -y -framerate 30 -i captures/home-mobile-dark/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/home-mobile-dark-scrub.mp4

echo "Encoding home-mobile-light..."
ffmpeg -y -framerate 30 -i captures/home-mobile-light/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/home-mobile-light-scrub.mp4

echo "Encoding expedition-mobile-dark..."
ffmpeg -y -framerate 30 -i captures/expedition-mobile-dark/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/expedition-mobile-dark-scrub.mp4

echo "Encoding expedition-mobile-light..."
ffmpeg -y -framerate 30 -i captures/expedition-mobile-light/frame_%04d.png -c:v libx264 -g 1 -keyint_min 1 -tune fastdecode -pix_fmt yuv420p -profile:v high -level 4.1 -b:v 2500k public/hero/expedition-mobile-light-scrub.mp4

echo "Done!"
