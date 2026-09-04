import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import {
  CAM_SETTLE,
  EXPEDITION_CLIMB,
  LOOK_SETTLE,
  POINTER_FOLLOW,
  TRACK_FOLLOW,
  climbProgress,
  readProgress,
  type ScrollState,
} from "./shared";
import { getSnappedTrail, heightOnTrail, lookAheadOnTrail } from "./trail";
import { heroCapture } from "../../lib/heroCapture";

function fovAt(t: number) {
  const poses = EXPEDITION_CLIMB.poses;
  const n = poses.length - 1;
  const x = t * n;
  const i = Math.min(Math.floor(x), n - 1);
  const f = x - i;
  return MathUtils.lerp(poses[i].fov, poses[i + 1].fov, f);
}

/** Camera rides the snapped couloir — look ahead up the trail, then out at the pass. */
export function ExpeditionCamera({
  scrollRef,
}: {
  scrollRef: MutableRefObject<ScrollState>;
}) {
  const { camera } = useThree();
  const heroFly = useHeroFlyOptional();
  const look = useRef(new Vector3(...EXPEDITION_CLIMB.poses[0].look));
  const targetPos = useRef(new Vector3(...EXPEDITION_CLIMB.poses[0].pos));
  const targetLook = useRef(new Vector3(...EXPEDITION_CLIMB.poses[0].look));
  const snow = useRef(new Vector3());
  const ahead = useRef(new Vector3());
  const tangent = useRef(new Vector3());
  const side = useRef(new Vector3());
  const up = useRef(new Vector3(0, 1, 0));
  const progressSmooth = useRef(0);
  const sway = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const desired = heroCapture.enabled ? readProgress(heroFly) : climbProgress(readProgress(heroFly));
    const snap = heroCapture.snap;
    const raw = snap
      ? (progressSmooth.current = desired)
      : (progressSmooth.current = MathUtils.damp(progressSmooth.current, desired, TRACK_FOLLOW, delta));

    const trail = getSnappedTrail();
    if (trail) {
      trail.curve.getPoint(raw, snow.current);
      trail.curve.getTangent(raw, tangent.current);
      const lookT = Math.min(1, raw + lookAheadOnTrail(raw));
      trail.curve.getPoint(lookT, ahead.current);
      side.current.crossVectors(tangent.current, up.current).normalize();
      const back = (1 - raw) * 16;
      const lateral = 18 - raw * 10;
      targetPos.current.copy(snow.current).addScaledVector(tangent.current, -back).addScaledVector(side.current, -lateral);
      targetPos.current.y += heightOnTrail(raw) + (1 - raw) * 4;
      targetLook.current.copy(ahead.current);
      if (raw > 0.82) {
        const out = (raw - 0.82) / 0.18;
        targetLook.current.y += out * 8;
        targetLook.current.z -= out * 24;
      }
    }

    const aspect = state.viewport.aspect || state.size.width / state.size.height;
    let fovMult = 1;
    if (aspect < 1) {
      fovMult = MathUtils.clamp(1.1 / aspect, 1, 1.8);
    }
    const targetFov = fovAt(raw) * fovMult;

    if (snap) {
      camera.position.copy(targetPos.current);
      look.current.copy(targetLook.current);
      camera.lookAt(look.current);
      camera.rotateZ(Math.sin(raw * Math.PI) * EXPEDITION_CLIMB.bankMax);
      camera.updateMatrixWorld();
      if (camera instanceof PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const planted = snap ? 0 : 1 - Math.abs(raw - 0.5) * 1.4;
    const driftScale = snap ? 0 : 0.12 + Math.max(0, planted) * 0.22;
    const t = snap ? 0 : state.clock.elapsedTime;
    const driftX = (Math.sin(t * 0.19) * 0.7 + Math.sin(t * 0.41 + 1.1) * 0.2) * driftScale;
    const driftY = Math.sin(t * 0.14 + 0.7) * 0.35 * driftScale;
    const driftZ = Math.cos(t * 0.11 + 1.8) * 0.5 * driftScale;

    sway.current.x = MathUtils.damp(sway.current.x, scrollRef.current.pointerX * 0.22, POINTER_FOLLOW, delta);
    sway.current.y = MathUtils.damp(sway.current.y, scrollRef.current.pointerY * 0.22, POINTER_FOLLOW, delta);

    const camAlpha = 1 - Math.exp(-CAM_SETTLE * delta);
    const lookAlpha = 1 - Math.exp(-LOOK_SETTLE * delta);

    camera.position.x = MathUtils.lerp(camera.position.x, targetPos.current.x + sway.current.x + driftX, camAlpha);
    camera.position.y = MathUtils.lerp(camera.position.y, targetPos.current.y + sway.current.y * 0.25 + driftY, camAlpha);
    camera.position.z = MathUtils.lerp(camera.position.z, targetPos.current.z + driftZ, camAlpha);

    look.current.x = MathUtils.lerp(look.current.x, targetLook.current.x + sway.current.x * 0.08, lookAlpha);
    look.current.y = MathUtils.lerp(look.current.y, targetLook.current.y, lookAlpha);
    look.current.z = MathUtils.lerp(look.current.z, targetLook.current.z, lookAlpha);
    camera.lookAt(look.current);

    const traverse = Math.sin(raw * Math.PI);
    camera.rotateZ(traverse * EXPEDITION_CLIMB.bankMax + sway.current.x * 0.02);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.lerp(camera.fov, targetFov, camAlpha);
      camera.updateProjectionMatrix();
    }
  }, -1);

  return null;
}
