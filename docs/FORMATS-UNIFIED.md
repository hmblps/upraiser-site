# Unified Formats & Channels Architecture

## 1. Overview
The "Formats" (App Growth / OEM / CTV) section is a unified, programmatic scroll sequence where the user scrolls continuously through 10 formats spanning 3 different hardware devices (Phone -> Tablet -> TV).

- **Mobile (Phone):** Banner, Native, Interstitial, Rich Media, Video
- **Tablet (OEM):** Pre-Install, OEM Store, System UI
- **TV (CTV):** CTV Spot, CTV Video

The core layout component is `ProgrammaticScrollSection.tsx`. It uses Framer Motion (`useScroll`) to track scroll progress across a tall container (`2200vh` on desktop) and snaps the view to the corresponding format in the `FORMATS_UNIFIED` array.

## 2. Layout Structure & The `data-scene` Breakout
The layout is split into two halves: the 3D device on the left and the format text on the right.

Because the TV model has a much wider aspect ratio (16:9) compared to the Phone (9:19.5) and Tablet (3:4), the standard left-column slot (`.prog-scroll-phone-col--lifted`) is not wide enough for the TV without cropping its corners on rotation. 

To solve this, we use a **data-attribute breakout**:
When the active scene is `"tv"`, the `.prog-scroll-device-lift__frame` gets `data-scene="tv"`.
The CSS (`programmatic-scroll-section.css`) intercepts this and dramatically expands the slot:

```css
.prog-scroll-device-lift__frame[data-scene="tv"] .prog-scroll-phone-col--lifted {
  width: min(112%, 52rem); /* Break out of the left column */
  max-height: min(84dvh, 100%);
  position: relative; 
  inset: auto;
}
```

## 3. `DeviceCarousel3`
Instead of tearing down the WebGL `<Canvas>` when switching from Phone to Tablet, `DeviceCarousel3.tsx` mounts all 3 models simultaneously in a shared horizontal carousel. 

A `useSpring` motion value tracks the active hardware phase (`0` = phone, `1` = tablet, `2` = tv).
As the user scrolls from "Video" (Phone) to "Pre-install" (Tablet), the phase animates from `0` to `1`. 
- The Phone slides left (`-100%`) and fades out.
- The Tablet slides in from the right (`100% -> 0%`) and fades in.

## 4. WebGL Models & Screen Planes

### 4.1 Phone (`Phone3D.tsx`)
- Uses `deep-blue.glb` or `orange.glb` depending on the theme.
- For most formats, it applies a basic texture to the phone's built-in screen material.
- **Videos:** Banners, Native, and Interstitials use static images to prevent looping reset animations. "Video" and "Rich" formats map `.mp4` files via `VideoTexture`.
- **Rich Media HTML Overlay:** When `formatId === 'rich-media'`, the WebGL screen is blacked out, and a DOM `<iframe>` (`public/rich-media-ad.html`) is absolutely positioned over the 3D canvas using precise CSS 3D transforms (`rotateX`, `rotateY`, `translateZ`) to exactly match the phone's idle pitch and yaw.

### 4.2 Tablet (`Tablet3D.tsx`)
- Uses `tablet.glb` (iPad Air 4 model).
- The screen texture is driven by a `CanvasTexture` (in `tabletGlassAnim.ts`), allowing programmatic drawing of the OEM UI (like scrolling grids of apps) over a static background image. 

### 4.3 TV (`Tv3D.tsx`)
- Uses `tv-draco.glb` (highly compressed).
- **Dynamic Bounding Box:** The TV uses `Box3().setFromObject(scene, true)` to dynamically calculate its exact bounding box (including the stand) to ensure perfect optical centering via `cx, cy, cz` offsets.
- **Screen Plane Projection:** The screen texture is NOT applied to the GLTF material. Instead, a separate `<mesh>` with a `<planeGeometry>` is rendered directly in front of the TV aperture. 
- **Bezel Fit:** The dimensions of this plane (`w, h, y, z`) are dynamically multiplied by the TV's runtime `xf.scale` to ensure the screen plane perfectly seals against the inner plastic bezels regardless of screen size.
- **Background Warming (The 2.5s Lag Fix):** The TV canvas is NOT mounted while the user is on the Phone formats to save memory. However, as soon as the user scrolls to the Tablet, the TV is **mounted silently off-screen** (`x: 100%`). This forces the browser to parse the Draco WASM, compile the shader materials, and upload the heavy `VideoTexture` to the GPU *while the user is distracted by reading the Tablet text*. By the time they scroll to the TV, it is 100% pre-compiled in VRAM and slides in with zero main-thread freezing.

## 5. Text Alignment (`FormatCopy.tsx`)
The right-side text stack has a fixed `height: 21rem` (set in CSS) with `flex-start` alignment and a hardcoded `margin-top: 1.75rem` on the body text. 
This fixed height ensures the text container doesn't collapse or expand when the text length changes between formats, preventing the title from jumping or bouncing vertically when the Framer Motion `popLayout` transitions run.

## 6. Preloading
To ensure smooth transitions, assets are preloaded aggressively:
- The TV and Tablet GLB models are cached via `useGLTF.preload`.
- The TV's static fallback image (`ctv-spot.jpg`) is cached via `useTexture.preload`.
- Video `<video preload="auto">` begins buffering the next format's mp4 before it scrolls fully into view.
