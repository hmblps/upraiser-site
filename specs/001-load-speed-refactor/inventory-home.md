# Inventory: Home critical path

| File | Role | Notes |
|------|------|-------|
| `src/pages/HomePage.tsx` | Eager Home | Hero eager; below-fold lazy + idle preload of Home sections only |
| `src/components/Hero.tsx` | Hero chrome | No Solutions imports |
| `src/components/HeroAtmosphere.tsx` | CSS sky + deferred WebGL | Prefetch GLBs — optimized to active-theme-first |
| `src/components/hero-terrain/*` | Everest pipeline | Lazy via `HeroTerrainCanvas` |
| `src/App.tsx` | Routes | Home eager; Solutions/deep pages `React.lazy` |

**Confirmed**: Home does not import `Phone3D` / Solutions page chunk. Idle preload only touches Audience/Process/TrafficChannels/CasesTeaser/PromiseSection.
