import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import {
  CAM_SETTLE,
  LOOK_SETTLE,
  POINTER_FOLLOW,
  TRACK_FOLLOW,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  readProgress,
  sampleArc,
  type AscentPath,
  type ScrollState,
} from "./shared";

export function HeroCamera({
  scrollRef,
  path,
}: {
  scrollRef: MutableRefObject<ScrollState>;
  path: AscentPath;
}) {
  const { camera } = useThree();
  const heroFly = useHeroFlyOptional();
  const look = useRef(new Vector3(...path.startLook));
  const targetPos = useRef(new Vector3(...path.startPos));
  const targetLook = useRef(new Vector3(...path.startLook));
  const progressSmooth = useRef(0);
  const sway = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const raw = (progressSmooth.current = MathUtils.damp(
      progressSmooth.current,
      readProgress(heroFly),
      TRACK_FOLLOW,
      delta,
    ));

    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.21) * 1.7 + Math.sin(t * 0.47 + 1.3) * 0.5;
    const driftY = Math.sin(t * 0.16 + 0.8) * 1.0;
    const driftZ = Math.cos(t * 0.12 + 2.1) * 1.3;
    const lookDriftX = Math.sin(t * 0.18 + 2.6) * 1.1;
    const lookDriftY = Math.sin(t * 0.24 + 0.4) * 0.6;

    const tPos = easeOutCubic(raw);
    const tLook = easeInOutCubic(raw);
    const tFov = easeInCubic(MathUtils.clamp(raw * 1.05, 0, 1));

    sampleArc(tPos, path.startPos, path.midPos, path.endPos, targetPos.current);
    sampleArc(tLook, path.startLook, path.midLook, path.endLook, targetLook.current);

    const fovTarget =
      (1 - tFov) * (1 - tFov) * path.startFov +
      2 * (1 - tFov) * tFov * path.midFov +
      tFov * tFov * path.endFov;

    sway.current.x = MathUtils.damp(sway.current.x, scrollRef.current.pointerX, POINTER_FOLLOW, delta);
    sway.current.y = MathUtils.damp(sway.current.y, scrollRef.current.pointerY, POINTER_FOLLOW, delta);
    const swayX = sway.current.x * 1.8;
    const swayY = sway.current.y * 0.9;

    const camAlpha = 1 - Math.exp(-CAM_SETTLE * delta);
    const lookAlpha = 1 - Math.exp(-LOOK_SETTLE * delta);

    camera.position.x = MathUtils.lerp(camera.position.x, targetPos.current.x + swayX + driftX, camAlpha);
    camera.position.y = MathUtils.lerp(camera.position.y, targetPos.current.y + swayY * 0.35 + driftY, camAlpha);
    camera.position.z = MathUtils.lerp(camera.position.z, targetPos.current.z + driftZ, camAlpha);

    look.current.x = MathUtils.lerp(look.current.x, targetLook.current.x + swayX * 0.16 + lookDriftX, lookAlpha);
    look.current.y = MathUtils.lerp(look.current.y, targetLook.current.y + lookDriftY, lookAlpha);
    look.current.z = MathUtils.lerp(look.current.z, targetLook.current.z, lookAlpha);
    camera.lookAt(look.current);

    const bank = Math.sin(raw * Math.PI) * path.bankMax;
    camera.rotateZ(bank + sway.current.x * 0.04);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.lerp(camera.fov, fovTarget, camAlpha);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
