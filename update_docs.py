import re

with open("docs/FORMATS-CHANNELS.md", "r") as f:
    code = f.read()

new_log = """| **13 Sep — Antigravity V2** | Fixed Canvas clock phase desync (t = performance.now()), removed TV 2-second spring delay (instant), added aggressive App.tsx preload for Tv3D/Tablet3D, removed TV CSS clip (overflow: visible), fixed video pause state mutation bug when switching to ctv-spot. |"""

code = code.replace("| **11 Sep — local (uncommitted)** | Rich further inset: `height: 80%`, `translate(-50%, -50%)`, tighter radius |", new_log)


# Add a whole new section on the 3D Architecture and Loading Nuances
new_section = """
### Cross-Canvas Animation Sync
Phone, Tablet, and TV live in separate, lazily-loaded `<Canvas>` elements inside `ProgrammaticScrollSection`.
**Rule:** Never use local `state.clock.elapsedTime` for animations that need to match across devices! Since canvases mount at different times during scrolling, their internal clocks start at `0` asynchronously, leading to severe phase desynchronization (devices floating out of rhythm).
**Fix:** Always use the global absolute wall-clock: `const t = performance.now() / 1000;`. This ensures all isolated 3D contexts float like synchronized swimmers.

### DeviceLoadStage & Suspense Architecture
We deliberately **decouple** texture loading from React's `<Suspense>` boundary to prevent the 3D chassis from disappearing ("white hole" effect) on slow networks.
1. `useGLTF(MODEL_PATH)` suspends the mesh. This is aggressive-preloaded globally in `App.tsx` so the GLB is cached long before the user scrolls to it.
2. We use `TextureLoader` inside a `useEffect` for screen images/videos, rather than `useTexture`. This ensures the TV/Tablet chassis renders instantly (as a black matrix) even if the poster image is still downloading in the background.
3. **`DeviceLoadStage` Spring Trap:** The `DeviceLoadStage` wrapper defaults to a 2-second CSS spring fade-in (`opacity` from `0.02` to `1.0`). For heavy 3D models like the TV that perfectly match their CSS optical size, this creates an illusion of a 2-3 second "network delay". Always pass `placeholder={null} instant` for Tablet and TV so they snap in instantly once the mesh is ready.
"""

code = code.replace("### Device stage hierarchy (Antigravity)", new_section + "\n### Device stage hierarchy (Antigravity)")

with open("docs/FORMATS-CHANNELS.md", "w") as f:
    f.write(code)

