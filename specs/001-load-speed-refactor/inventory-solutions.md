# Inventory: Solutions critical path

| File | Role | Notes |
|------|------|-------|
| `src/App.tsx` | `lazy(SolutionsPage)` | Isolated from Home |
| `src/pages/SolutionsPage.tsx` | Route | Imports scroll section + formats |
| `src/components/solutions/ProgrammaticScrollSection.tsx` | Sticky lanes | `preloadPhone3DAssets` only on Solutions desktop mount |
| `src/components/solutions/Phone3D.tsx` | Glass chassis | still → MP4; silhouette boot |
| Mobile | `CssPhone` + channel feed | Independent of desktop GLB |

**Do not change**: Suspense Still↔Video remount pattern; motion stack.
