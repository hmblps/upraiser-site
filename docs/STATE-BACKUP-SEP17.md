# UPRAISER PROJECT STATE BACKUP
**Date:** September 17, 2026

## 1. Hero 3D Architecture (Latest Changes)
- **Model:** We reverted to the original 58MB `mountain-light-baked.glb` for the light theme to preserve 4096x4096 crisp textures and Draco geometry compression.
- **Environment:** Restored the 9.1MB `sky.exr` HDRI to ensure accurate PBR reflections and lighting.
- **Initialization Fix:** Implemented `<GpuUnlocker>` in `HeroTerrainCanvas.tsx` with a double `requestAnimationFrame` delay. This prevents the GPU shader compilation freeze from prematurely dismissing the compass loading spinner.
- **Spinner Timeout:** Increased the `bootStuck` fallback timeout from 4s to 15s to allow slower networks to download the 58MB model without showing an "empty" black screen before the mountain appears.
- **Fade-in Animation:** Changed the mountain fade-in from a slow spring to a snappy 0.4s ease-out tween to crossfade perfectly with the loading spinner.
- **Lite Mode:** Added robust `?lite` URL parameter checking using `react-router-dom`'s `useSearchParams`. When `lite` is present, `use3d` is forcibly set to `false`, instantly mounting `<HeroVideoFallback>` (the 150 JPEG image sequence) on desktop, bypassing WebGL entirely.

## 2. Global State
- All formats and sections are stable.
- TypeScript compilation (`tsc -b`) passes with 0 errors.
- Unused variables and imports have been cleaned up.
