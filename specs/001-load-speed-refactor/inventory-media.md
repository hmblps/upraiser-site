# Inventory: Shipped media

| Asset | Class | Action |
|-------|-------|--------|
| `public/hero/everest.glb`, `everest-light.glb`, `voyager-nasa.glb` | runtime-visual | keep |
| `public/phones/deep-blue.glb`, `orange.glb` | runtime-visual | keep |
| `public/channels/programmatic-feed/formats/*.mp4` + stills | runtime-visual | keep |
| `public/og-image.png`, logos, maps, draco | required-build | keep |
| `assets/hero/*.src.glb`, `snowy-mountain-v2.src.glb` | local-tooling | already gitignored; do not sync to public |
| `assets/hero/light-mountains-loop.mp4` | local-tooling (OG) | keep in assets; not synced to public |
| `.tmp-*` | scratch | gitignore + delete local |
| `videos/` | local-tooling (HyperFrames) | gitignore; never in dist |
| `public/channels/programmatic-refs/*-trim.png` | scratch (untracked) | delete / do not ship |
| `PixelSnow.tsx` | dead code | delete |
| `AboutPage.tsx`, `ExpertisePage.tsx` | dead pages | delete |
