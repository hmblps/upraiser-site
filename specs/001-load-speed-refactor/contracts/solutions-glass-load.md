# Contract: Solutions Glass Load

**Feature**: `001-load-speed-refactor`  
**Audience**: Implementers + QA  
**Related**: [spec.md](../spec.md) US2, FR-003, FR-004, FR-007, FR-009, SC-002, SC-003

## Purpose

Define the observable load/visual contract for `/solutions` so speed work cannot regress the glass phone milestone.

## Preconditions

- Cold load of `/solutions`.
- Desktop and mobile/reduced-motion profiles.

## Guarantees

1. **Non-blank glass**: Desktop boot may show dark silhouette briefly; settled glass is never white/empty.
2. **Screen pipeline**: Still content appears, then format MP4 promotes onto the same screen materials without a remount flash.
3. **Scroll sync**: Native sticky scroll updates format copy + glass content for App Growth and OEM & CTV lanes.
4. **Mobile path**: CssPhone + live feed works without waiting for desktop chassis.
5. **Isolation**: Solutions route chunk/assets are not required for Home first-usable state.
6. **Motion law**: No GSAP/ScrollTrigger / wheel hijack reintroduced; springs + CSS transform/opacity character remains.

## Non-goals

- Redesigning format UI, lane IA, or phone materials look.
- Replacing MP4s with live HTML on desktop.

## Verification

See [quickstart.md](../quickstart.md) § Solutions.
