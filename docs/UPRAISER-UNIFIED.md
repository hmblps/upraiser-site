# UPRAISER — The Ultimate Source of Truth (Architecture & Project Guide)

This document contains **literally everything** about the UPRAISER website project: its philosophy, tech stack, architecture, core components, and critical performance rules. It replaces fragmented logs with a single, structured guide.

---

## 1. Project Philosophy & Design System

The UPRAISER website is built to feel like a high-end native Apple application, not a standard website.

### The "Emil Kowalski" UI Guidelines
Every UI element follows strict interaction design rules:
- **Shared Layout Animations:** We use Framer Motion's `layoutId` to morph elements seamlessly (e.g., sticky headers morphing from cards, segmented controls sliding).
- **Spring Physics:** No `ease-in-out` for interactive elements. We use bouncy springs (`type: "spring", bounce: 0.15, duration: 0.5`) for everything from layout shifts to hover states.
- **Micro-interactions:** Buttons and cards use `whileTap={{ scale: 0.95 }}` and `whileHover={{ scale: 1.02 }}` to feel tactile.
- **No Hard Cuts:** Mounting/unmounting is always wrapped in `<AnimatePresence>` to crossfade or slide.
- **Glassmorphism:** Heavy use of `backdrop-blur-md`, semi-transparent `bg-bg-elevated/70`, and rounded-full dynamic islands.

### The Aurora Brand Gradient
The core visual identity is the **Brand Aurora** — a dynamic, organic gradient (Yellow `var(--brand-yellow)` → Orange `var(--brand-orange)` → Red `var(--brand-red)`). It is used as:
- Glowing backdrop blurs (`mix-blend-screen`).
- Text gradients (`bg-clip-text`).
- Shimmering SVG paths in charts (`Recharts`).

### Dual Theme Modes
The site transitions seamlessly between:
- **Growth (Light Mode):** Clean, spacious, bright.
- **Infrastructure (Dark Mode):** Technical, terminal-like, glowing neons.
This is not a simple CSS toggle; it changes 3D WebGL lighting, shader uniforms, and model textures dynamically.

---

## 2. Tech Stack

- **Framework:** React 18 + TypeScript + Vite.
- **Styling:** Tailwind CSS + Custom CSS Variables for themes.
- **Animation:** Framer Motion (DOM) + native Spring logic.
- **3D & WebGL:** Three.js + React-Three-Fiber (R3F) + Drei (Draco compressed GLBs).
- **Data Visualization:** Recharts.
- **Smooth Scrolling:** Locomotive-style programmatic scroll tracking (via Framer `useScroll`), without hijacking the native scrollbar.

---

## 3. Core Architectural Sections

### 3.1. The Hero Section (`Hero.tsx`)
The Hero section is the heaviest and most complex visual on the site.
- **The Visual:** Renders either a 3D WebGL topographic terrain (`HeroTerrainCanvas`) or a fallback video (`HeroVideoFallback`) depending on the hardware tier.
- **Stat Ghosts:** Large typography stats ("2.4x", "46%") that float and parallax over the terrain using Framer Motion.
- **Cinematic Auto-Scroll:** When the WebGL/Video sequence finishes, it triggers a programmatic `scrollToY` to gently push the user down to the content.

### 3.2. Channels & Programmatic feed (`ProgrammaticScrollSection.tsx`)
Explains the advertising channels (Phone, Tablet, Desktop/TV).
- **3D Devices:** Uses high-fidelity Draco-compressed GLB models (`Phone3D`, `Tablet3D`, `Tv3D`).
- **Dynamic Screens:** The screens of the 3D models transition between static images (`TextureLoader`) and live MP4 videos (`VideoTexture`) based on scroll position.
- **Glass Material:** The devices use custom black glass materials to prevent "letterboxing" and make the UI look native to the bezel.
- **Channels CTA:** A stylized Recharts `<ComposedChart>` that uses custom `<Bar>` shapes to draw solid, glowing devices under a neon gradient line.

---

## 4. Critical Performance Rules & "Gotchas"

Through extensive debugging (especially on Windows/Intel machines), we established strict rules for 3D and Scroll performance:

### WebGL Isolation & The "Squish Bug"
- **Rule:** Never use `ResizeObserver` or CSS width/height transitions on a `<Canvas>` wrapper based on scroll state.
- **Why:** If a `<Canvas>` is 0x0 or squished while off-screen, and then expands when scrolled into view, WebGL synchronously recalculates the projection matrix and crashes/stutters the main thread.
- **Fix:** WebGL wrappers must have fixed/unconditional dimensions (e.g., `aspect-ratio: 16/12`) even when off-screen.

### Hardware Tiering & Fallbacks
- The `useHardwareTier()` hook detects mobile devices, missing WebGL support, or activated Data Saver.
- **Rule:** If `tier === "lite"`, **do not mount `<Canvas>`**. You must mount the CSS equivalent (e.g., `<CssPhone>`).
- **Rule:** Every `<Canvas>` must be wrapped in `<CanvasErrorBoundary fallback={<CssPhone />}>`. If the GPU context is lost or compilation fails, the site must gracefully degrade to DOM elements without blanking the screen.

### Texture & Draco Blocking
- **Rule:** Never run `new TextureLoader().load()` dynamically during a scroll event. It blocks the main thread for 50-150ms.
- **Fix:** Textures are preloaded in `index.html` (`<link rel="preload">`) and cached via `useRef` in the components.

### Background Warming
- To prevent stutter when a new 3D model (like the TV) enters the viewport, it is mounted off-screen early.
- Because browsers pause `requestAnimationFrame` for off-screen canvases, we use a custom `<WarmupRenderer>` that synchronously calls `gl.render()` to force shader compilation in VRAM *before* the user scrolls to it.

### R3F Camera Memoization
- **Rule:** Never pass an inline object to the `<Canvas>` camera prop: `camera={{ position: [x,y,z] }}`. 
- **Why:** Every time the parent component re-renders (e.g., due to a scroll progress update), R3F sees a new object reference, resets the camera, and causes a violent visual snap.
- **Fix:** Always memoize the camera configuration with `useMemo`.

---

## 5. File Structure Overview

```text
src/
├── components/          # Reusable UI (Buttons, Headers, LineChart, LocaleSwitcher)
│   ├── hero-terrain/    # WebGL Terrain, Shaders, Video Fallback
│   ├── solutions/       # Programmatic Feed, Channels CTA, Recharts implementation
│   ├── channel-visuals/ # The actual 3D Models (Phone3D, Tablet3D, Tv3D) & Materials
│   └── company/         # Team, Trust strips, Footer
├── hooks/               # Custom hooks (useHardwareTier, useReducedMotion, useScroll)
├── styles/              # Global CSS, Tailwind base, and heavy section-specific CSS
├── data/                # Live copy, translations, and site modes
├── lib/                 # Utilities (cn, scrollPreload, math functions)
└── App.tsx              # Main routing and global layout
public/
├── channels/            # Draco GLBs and screen textures (MP4/PNG)
├── hero/                # Terrain fallback videos and textures
└── fonts/               # Neue Machina
```

---
*Generated by Antigravity AI on October 2026. This is the definitive architecture guide for UPRAISER.*
