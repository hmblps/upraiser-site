import re

with open("docs/UPRAISER-MASTER.md", "r") as f:
    code = f.read()

# Just append a summary of the 3D performance and loading architecture to the end of section 25
section_25_append = """
### 3D Performance, Preloading, and Sync (Sep 2026 Update)
1. **Aggressive Preloading:** Large models (`tv-draco.glb`, `tablet.glb`) must be aggressively preloaded in the root `App.tsx` (`useGLTF.preload`) to bypass React Suspense network delays during scroll.
2. **Synchronized Phases:** Separate `<Canvas>` components (Phone, Tablet, TV) mount asynchronously. Animations driven by `state.clock.elapsedTime` will desynchronize. Always use global `performance.now() / 1000` for `Math.sin()` floats to keep all devices breathing in perfect unison.
3. **Instant Reveal:** Avoid `DeviceLoadStage` CSS spring fade-ins for models without a fallback silhouette. Use `placeholder={null} instant` so the chassis pops in instantly.
4. **Decoupled Textures:** Never use `useTexture` for dynamic screen posters on heavy devices. It suspends the entire chassis, leaving a "white hole" in the layout. Use `TextureLoader` inside a `useEffect` so the black matrix renders immediately while the image fetches in the background.
"""

code = code.replace("## 26.", section_25_append + "\n## 26.")

with open("docs/UPRAISER-MASTER.md", "w") as f:
    f.write(code)

