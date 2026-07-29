# UPRAISER — Solutions (`/solutions`)

> **Status (29 Jul 2026):** **SHIPPED** — sticky format lanes + 3D/CSS phone glass.  
> Production: https://upraiser-site.vercel.app/solutions  
> Full site: **[HANDOFF.md](./HANDOFF.md)** · human: **[README.md](../README.md)** · assets: **[ASSETS.md](./ASSETS.md)**  
> **HEAD:** `e8ed2ef` (DPI / touch / transform motion) · phone glass `71ddab1`

---

## 1. What it is

Dual-lane sticky showcase of ad formats:

| Lane | Formats source |
|------|----------------|
| **App Growth** | `AD_FORMATS` in `ProgrammaticFormats.ts` |
| **OEM & CTV** | `OEM_CTV_FORMATS` |

Native scroll drives the active format (no wheel hijack). Desktop: R3F iPhone GLB with screen textures. Mobile / reduced motion: `CssPhone` + live HTML feed.

---

## 2. Key files

| Path | Role |
|------|------|
| `src/pages/SolutionsPage.tsx` | Lane tabs + `ProgrammaticScrollSection` + close CTA |
| `src/components/solutions/ProgrammaticScrollSection.tsx` | Sticky desktop / mobile cards |
| `src/components/solutions/Phone3D.tsx` | GLB chassis · still PNG → MP4 on same materials |
| `src/components/solutions/CssPhone.tsx` | CSS chassis + `ProgrammaticFullFeed` |
| `src/components/solutions/FormatCopy.tsx` | Right-rail copy + format dots |
| `src/components/solutions/ProgrammaticFormats.ts` | Format copy / ids |
| `src/components/channel-visuals/programmatic/ProgrammaticFullFeed.tsx` | Live in-phone HTML scenes |
| `src/styles/programmatic-scroll-section.css` | Sticky layout, phone vh clamp, dots |
| `src/styles/programmatic-full-feed.css` | Feed UI inside the glass |
| `src/styles/phone-css-3d.css` | GLB stage shell |

**Route:** `/solutions` (live). `/expertise` redirects here. Nav label **Solutions**.

---

## 3. Glass content pipeline

1. **Still (instant):** `public/channels/programmatic-refs/screens/{banner,native,interstitial,rich-media,video}.png` via `useTexture` (all URLs loaded once — never re-suspend on format change).
2. **Video (primary):** `public/channels/programmatic-feed/formats/{banner,native,interstitial,rich,video}.mp4` — `VideoTexture` promoted onto the **same** screen materials (no Suspense Still↔Video remount → no white flash).
3. **Live HTML:** `ProgrammaticFullFeed` on `CssPhone` (mobile / fallback). Desktop relies on baked MP4s of the same HyperFrames scenes.

**Chassis GLBs:** `/phones/deep-blue.glb` (light / growth) · `/phones/orange.glb` (dark).

---

## 4. Hardening (29 Jul — `e8ed2ef`)

Non-destructive pass for Windows DPI / touch / jank:

- Phone stage: `clamp(420px, 65vh, 750px)` so short laptops (e.g. 1366×768) don’t clip.
- `overflow-x-hidden` on Solutions page shell.
- Micro labels / tabs / chips: `whitespace-nowrap` + `flex-shrink-0`.
- Format dots: ≥44px hit area; active state via `transform: scaleX` (not `width`).
- Hover only under `@media (hover: hover) and (pointer: fine)`.
- Feed images: `decoding="async"` + `loading="lazy"` where appropriate.
- Progress bar in video scene: `scaleX` instead of animating `width`.

**Do not** reintroduce GSAP / ScrollTrigger on this surface; motion is Framer springs + CSS transform/opacity.

---

## 5. HyperFrames pilot (optional local)

Source compositions for format MP4s live under `videos/solutions-pilot/` (not required for production build). Baked outputs ship in `public/channels/programmatic-feed/formats/`.

---

## 6. Sanity checklist

- [ ] `/solutions` App Growth: Banner → Native → … scroll syncs copy + glass
- [ ] OEM & CTV lane switches formats without blank glass
- [ ] Desktop: 3D phone rotates on drag; screen never stays black
- [ ] Mobile: CssPhone + live feed
- [ ] No horizontal page scroll; dots tappable on touch
- [ ] Production alias `upraiser-site.vercel.app`

---

*Update this file when glass pipeline, lanes, or format assets change.*
