#!/usr/bin/env node
/**
 * Perf pass v1 — hero video variants from master source.
 * Outputs: desktop 1080p, mobile 720p, poster JPG → assets/hero/
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const heroDir = join(root, "assets/hero");
const sourceDir = join(heroDir, "_source");
const sourcePath = join(sourceDir, "light-mountains-loop.mp4");
const desktopPath = join(heroDir, "light-mountains-loop.mp4");
const mobilePath = join(heroDir, "light-mountains-loop-mobile.mp4");
const posterPath = join(heroDir, "light-mountains-poster.jpg");

mkdirSync(sourceDir, { recursive: true });

if (!ffmpegPath) {
  console.error("ffmpeg-static binary not found.");
  process.exit(1);
}

if (!existsSync(sourcePath)) {
  if (!existsSync(desktopPath)) {
    console.error("Missing hero source. Restore: bash scripts/restore-hero-from-prod.sh");
    process.exit(1);
  }
  console.log("Archiving current desktop MP4 as master source…");
  copyFileSync(desktopPath, sourcePath);
}

const sizeMb = (path) => `${(statSync(path).size / (1024 * 1024)).toFixed(2)} MB`;

console.log(`Master: ${sourcePath} (${sizeMb(sourcePath)})`);

console.log("Encoding desktop 1080p…");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i",
    sourcePath,
    "-an",
    "-vf",
    "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
    "-c:v",
    "libx264",
    "-crf",
    "26",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    desktopPath,
  ],
  { stdio: "inherit" },
);

console.log("Encoding mobile 720p…");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i",
    sourcePath,
    "-an",
    "-vf",
    "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
    "-c:v",
    "libx264",
    "-crf",
    "28",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mobilePath,
  ],
  { stdio: "inherit" },
);

console.log("Extracting poster frame…");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-ss",
    "4.2",
    "-i",
    sourcePath,
    "-vframes",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    posterPath,
  ],
  { stdio: "inherit" },
);

console.log("\nHero video variants:");
console.log(`  desktop ${desktopPath} — ${sizeMb(desktopPath)}`);
console.log(`  mobile  ${mobilePath} — ${sizeMb(mobilePath)}`);
console.log(`  poster  ${posterPath} — ${sizeMb(posterPath)}`);
