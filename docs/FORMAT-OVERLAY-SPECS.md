# 3D Phone to CSS Overlay Specifications

This document contains the exact mathematical parameters, CSS properties, and React logic required to flawlessly overlay a 2D DOM element (like an iframe or interactive HTML) on top of a 3D WebGL iPhone model, effectively solving the 3D-to-DOM impedance mismatch without using performance-heavy `Drei <Html>`.

## Problem Context
Mapping an interactive HTML iframe directly onto a 3D model using `Drei <Html transform>` causes:
1. Significant FPS drops due to continuous matrix recalculations.
2. Inaccurate clipping (CSS 3D cannot be clipped by WebGL geometry).
3. Visual artifacts, scale floating, and sub-pixel misalignment across different viewport sizes.

## Solution (The "Canonical" CSS Overlay)
When a format requires rich interactive HTML (e.g., Rich Media ads with clickable buttons and videos), we freeze the 3D phone's rotation and lay a pure CSS-transformed DOM element over the WebGL Canvas. 

### 1. 3D Scene Anchoring (The Base)
For the CSS overlay to align, the 3D phone must be parked at a known, static pose. We disable mouse rotation for these specific formats.

```tsx
// src/components/solutions/Phone3D.tsx

// 1. Identify the format
const isRichMedia = formatId === "rich";

// 2. Disable pointer events so dragging the iframe doesn't rotate the 3D model underneath
<div
  onPointerDown={isCssFormat || isRichMedia ? undefined : onPointerDown}
  onPointerMove={isCssFormat || isRichMedia ? undefined : onPointerMove}
  onPointerUp={isCssFormat || isRichMedia ? undefined : endDrag}
  onPointerCancel={isCssFormat || isRichMedia ? undefined : endDrag}
>
  {/* Canvas */}
</div>
```

When dragging is disabled, the `PhoneScene` defaults to its resting pose:
- `REST_X = -0.05` radians
- `REST_Y = 0.12` radians

### 2. Screen Material Blackout
To prevent the static fallback texture (e.g., a `.png` of the ad) from bleeding through the transparent parts of the HTML iframe or causing a double-render visual glitch, the WebGL screen material is painted solid black.

```tsx
const screen = mat as MeshStandardMaterial;

if (formatId === "rich") {
  screen.map = null;
  screen.emissiveMap = null;
  screen.color = new Color("#0b1220");
  screen.emissive = new Color("#000000"); // Turn off screen glow
}
```

### 3. The CSS Overlay Geometry
The overlay is positioned as an absolute sibling to the WebGL Canvas. It relies on a specific `aspect-ratio` to maintain the iPhone proportions natively, and `transform: rotateX(...) rotateY(...)` to precisely match the `REST_X` and `REST_Y` of the 3D model camera projection.

```css
/* src/styles/phone-css-3d.css */

.phone-rich-on-glb {
  position: absolute;
  z-index: 6;
  pointer-events: auto;
  
  /* 1. Exact Screen Proportions */
  height: 89%; /* Matches the physical screen height relative to the GLB canvas */
  width: auto;
  aspect-ratio: 9 / 19.45; /* iPhone 15 Pro physical screen ratio */
  
  /* 2. Center Alignment */
  left: 50%;
  top: 50%;
  
  /* 3. Mathematical Projection Match */
  /* Translates off-center slightly (-48.2%) because the 3D screen geometry is not exactly centered vertically. */
  /* rotateX and rotateY strictly mirror the GLB's REST_X (-0.05 rad = -2.86deg) and REST_Y (0.12 rad = 6.87deg) */
  transform: translate(-50%, -48.2%) rotateX(-2.86deg) rotateY(6.87deg);
  
  /* 4. Hardware Bezel Clipping */
  border-radius: 44px;
  clip-path: inset(0 round 44px);
  -webkit-clip-path: inset(0 round 44px);
  overflow: hidden;
  
  /* 5. Backdrop */
  background: #0b1220;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.55);
}

.phone-rich-on-glb iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
```

### Conversion Reference (Radians to Degrees)
The CSS transformation is directly derived from the Three.js radians:
* `rotY: 0.12 rad` = `0.12 * (180 / Math.PI)` ≈ `6.875°`
* `rotX: -0.05 rad` = `-0.05 * (180 / Math.PI)` ≈ `-2.864°`

### 4. DOM Injection
The HTML node is placed at the end of the `Phone3D` component, outside the `Canvas`, using the above CSS class.

```tsx
{isRichMedia ? (
  <div className="phone-rich-on-glb" aria-hidden={false}>
    <iframe
      src="/rich-media-ad.html"
      title="ING Rich Media"
      allow="autoplay; encrypted-media"
      scrolling="no"
    />
  </div>
) : null}
```

By decoupling the DOM from Three.js `Drei <Html>`, we achieve flawless 60 FPS scrolling, pixel-perfect clipping against the titanium bezel, and fully functional pointer events inside the iframe without triggering WebGL raycasting bugs.
