# Contract: Home Hero Load

**Feature**: `001-load-speed-refactor`  
**Audience**: Implementers + QA  
**Related**: [spec.md](../spec.md) US1, FR-002, FR-004, FR-007, SC-001, SC-004

## Purpose

Define the observable load contract for `/` so performance work cannot break the Everest + theme experience.

## Preconditions

- Cold load (empty cache) of `/`.
- Desktop (≥768px, motion allowed) and mobile/reduced-motion profiles both tested.

## Guarantees

1. **First paint**: Site header/brand framing appears without a prolonged blank document.
2. **Settled hero (desktop)**: After terrain ready, Everest visual matches production character for active theme (photoreal light / wire dark).
3. **Theme sync**: Toggling theme updates narrative + terrain pipeline without stuck veil or wrong clear color.
4. **Fallback**: Mobile/reduced-motion never depends on WebGL success for a coherent hero.
5. **Isolation**: Completing Home usable state must not require Solutions glass assets (phone GLBs / format MP4s) to finish.

## Non-goals

- Changing camera path, halo/bird art direction, or dual-narrative copy.
- Replacing GLB hero with video scrub.

## Verification

See [quickstart.md](../quickstart.md) § Home.
