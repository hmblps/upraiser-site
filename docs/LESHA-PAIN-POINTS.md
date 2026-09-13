# Lesha's Pain Points (DO NOT REPEAT THESE MISTAKES)

This document tracks the specific visual bugs, regressions, and architecture frustrations that Lesha had to deal with during the development of the unified 3D formats scroll.

**CRITICAL RULE FOR ALL AGENTS:** Read this document before making any optimizations to WebGL rendering, Framer Motion springs, or React component unmounting. 

## 1. The 2.5 Second "TV Fall From Sky" Lag
**Symptom:** When scrolling from the Tablet down to the TV, the browser main thread would freeze for ~2 seconds. The TV animation would skip, and the TV would just "snap" into existence (fall from the sky).
**Root Cause:** The TV canvas was completely off-screen (`x: 100%`) or `display: none` when the page loaded. Browsers pause `requestAnimationFrame` for off-screen canvases. When the user scrolled to the TV, the canvas entered the viewport, triggering the first render. Three.js then synchronously compiled all shaders and uploaded the `VideoTexture` to the GPU, freezing the main thread.
**Failed Fixes:**
- *Using `frameloop="always"` everywhere:* Tanked FPS on Intel GPUs, causing animations to skip anyway.
- *Using `gl.compile(scene)`:* Caused React Suspense crashes because it was called before meshes were ready.
**The Final Fix:** **Background Warming**. The `Tv3D` component is now mounted silently off-screen the moment the user reaches the *Tablet* stage (`shouldWarmTv`). We also added a hidden `<mesh visible={false}>` with the `videoTex` to force the GPU upload while the user is reading the tablet text. Do NOT unmount the TV entirely, and do NOT mount it strictly on `inView`.

## 2. The "Empty Space" Opacity Gap
**Symptom:** When scrolling between devices, the old device would disappear, leaving a massive empty space (void) for a split second before the new device appeared.
**Root Cause:** The opacity math `1 - d * 2.5` was too aggressive. At phase `1.5` (mid-scroll), the distance `d` was `0.5` for both devices, making opacity `1 - 1.25 = -0.25`. Both devices were fully transparent.
**The Fix:** Changed the math to `Math.max(0, 1.5 - d * 1.5)`. Devices now overlap nicely during the crossfade. Do NOT change this math back to a high multiplier.

## 3. Disappearing Phones
**Symptom:** Phones on the homepage completely disappeared.
**Root Cause:** In an attempt to optimize performance, an agent set `frameloop="demand"` for inactive phones. However, the homepage phones (`CssPhone.tsx` / `HeroPhones`) rely on continuous rendering for floating animations, or they never render their first frame properly if they start off-screen. 
**The Fix:** Restored `frameloop={(!inView || reduced || isCssFormat) ? "never" : "always"}`.

## 4. The "Barely Visible Dashed Rectangle" (TV Placeholder)
**Symptom:** A semi-transparent dashed rectangle would flash for a split second before the TV appeared.
**Root Cause:** The `DeviceLoadStage` for the TV had a hardcoded `placeholder` (a CSS dashed rectangle). Since the TV took a second to render its first frame, this ugly placeholder was visible.
**The Fix:** Removed the placeholder entirely (`placeholder={null}`). The Tablet didn't have one and looked great. Keep it that way.

**Update on The 2.5 Second "TV Fall From Sky" Lag:**
Just mounting the `Tv3D` component off-screen was NOT enough to trigger background warming, because modern browsers pause `requestAnimationFrame` for canvases that are physically outside the viewport. This meant that `frameloop="demand"` never fired its initial render, and the 2.5s compilation lag STILL happened when the TV scrolled into view. 
**The Real Fix:** A custom `<WarmupRenderer>` component inside the `<Canvas>`. Once `meshReady` fires (indicating `useGLTF` has resolved), it manually calls `gl.render(scene, camera)`. This is a synchronous JS call that does not depend on `rAF`. It forces WebGL to compile the shaders and upload the `VideoTexture` to VRAM. Crucially, because `<Tv3D>` stays mounted continuously when transitioning from `tablet` to `tv`, this warmed-up WebGL context is preserved and reused, guaranteeing a 60FPS slide-in when the TV finally enters the screen.

## 5. The Invisible Background Fetch (`ChannelsLoader.tsx`)
**Symptom:** TV video (`ctv-spot.mp4`) takes too long to load on slow connections, even with background warming on the Tablet stage.
**Root Cause:** A developer might delete the "dead code" `fetch("/channels/oem/screens/ctv-spot.mp4")` inside `ChannelsLoader.tsx` because its Promise result isn't used anywhere.
**The Fix / Rule:** **DO NOT DELETE THIS FETCH**. This fetch executes on the Home page and forces the browser to pull the 1MB video file into the local disk cache. When the user navigates to `/channels` and reaches the Tablet stage, the TV background warming instantly retrieves the video from the disk cache (0ms network delay), allowing `gl.initTexture` to fire immediately. This invisible fetch is a critical part of the zero-lag TV pipeline.
