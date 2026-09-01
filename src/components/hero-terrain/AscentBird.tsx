import { useEffect, useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import {
  CanvasTexture,
  Color,
  MathUtils,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { heroCapture } from "../../lib/heroCapture";
import { easeInOutCubic, easeOutCubic, idle01, readProgress } from "./shared";

/**
 * Ascent bird as atmosphere, not character.
 * Soft soaring silhouette near the ice-halo — one slow scroll gesture, then haze.
 * Rare deep wingbeats on an otherwise locked glide (how real soarers move).
 */

const BIRD_CAM_DIST = 158;
/** Slow damp so scroll can't fire it across the sky like a bullet. */
const BIRD_FOLLOW = 1.65;
/** Long appear window — bird lives with the runway, not a flash. */
const APPEAR_START = 0.1;
const APPEAR_PEAK = 0.26;
const FADE_START = 0.58;
const FADE_END = 0.86;

function paintSoar(ctx: CanvasRenderingContext2D, size: number, flap: number) {
  ctx.clearRect(0, 0, size, size);
  const cx = size * 0.5;
  const cy = size * 0.52;
  const s = size * 0.38;
  // flap 0 = locked soar; 1 = wings pressed down (stroke)
  const tipY = MathUtils.lerp(-0.28, 0.22, flap);
  const midY = MathUtils.lerp(-0.18, 0.08, flap);
  const bodyDrop = flap * 0.03;

  const X = (u: number) => cx + u * s;
  const Y = (v: number) => cy + v * s;

  ctx.fillStyle = "#141210";
  ctx.shadowColor = "rgba(20, 18, 16, 0.4)";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(X(-1.0), Y(tipY * 0.15));
  ctx.bezierCurveTo(X(-0.72), Y(tipY), X(-0.35), Y(midY), X(-0.12), Y(-0.04 + bodyDrop));
  ctx.quadraticCurveTo(X(-0.04), Y(-0.1 + bodyDrop), X(0.02), Y(-0.12 + bodyDrop));
  ctx.quadraticCurveTo(X(0.1), Y(-0.06 + bodyDrop), X(0.12), Y(-0.02 + bodyDrop));
  ctx.bezierCurveTo(X(0.35), Y(midY), X(0.72), Y(tipY), X(1.0), Y(tipY * 0.15));
  ctx.bezierCurveTo(X(0.7), Y(tipY * 0.2 + 0.04), X(0.38), Y(0.05 + bodyDrop), X(0.14), Y(0.06 + bodyDrop));
  ctx.quadraticCurveTo(X(0.06), Y(0.22 + bodyDrop), X(0.0), Y(0.38 + bodyDrop * 0.5));
  ctx.quadraticCurveTo(X(-0.06), Y(0.22 + bodyDrop), X(-0.14), Y(0.06 + bodyDrop));
  ctx.bezierCurveTo(X(-0.38), Y(0.05 + bodyDrop), X(-0.7), Y(tipY * 0.2 + 0.04), X(-1.0), Y(tipY * 0.15));
  ctx.closePath();
  ctx.fill();
}

function makeSoarTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { texture: new CanvasTexture(canvas), canvas, ctx: null as CanvasRenderingContext2D | null, size };

  paintSoar(ctx, size, 0);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.premultiplyAlpha = true;
  return { texture, canvas, ctx, size };
}

function envelope(climb: number) {
  const inA = MathUtils.smoothstep(climb, APPEAR_START, APPEAR_PEAK);
  const outA = 1 - MathUtils.smoothstep(climb, FADE_START, FADE_END);
  return inA * outA;
}

function glideU(climb: number) {
  return MathUtils.clamp((climb - APPEAR_START) / (FADE_END - APPEAR_START), 0, 1);
}

/** Occasional deep wingbeat while mostly gliding — soarers don't flutter. */
function wingFlap(t: number) {
  // Slow thermal breathe (almost still)
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.55);
  // Sparse beat packets ~ every 3.2s, each packet 1–2 strokes
  const packet = Math.pow(Math.max(0, Math.sin(t * 0.95)), 10);
  const stroke = 0.5 + 0.5 * Math.sin(t * 3.4);
  return breathe * 0.08 + packet * stroke * 0.78;
}

export function AscentBird() {
  const { camera } = useThree();
  const heroFly = useHeroFlyOptional();
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const progressSmooth = useRef(0);
  const acrossSmooth = useRef(-0.55);
  const liftSmooth = useRef(-0.38);
  const lastFlap = useRef(0);

  const sunAim = useMemo(() => new Vector3(), []);
  const sunDir = useMemo(() => new Vector3(), []);
  const side = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(0, 1, 0), []);
  const offset = useMemo(() => new Vector3(), []);
  const captureLocal = useRef<Vector3 | null>(null);

  const { texture, ctx, size } = useMemo(() => makeSoarTexture(), []);
  const geometry = useMemo(() => new PlaneGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        map: texture,
        color: new Color("#1c1a17"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: true,
        fog: true,
        toneMapped: false,
      }),
    [texture],
  );

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
      texture.dispose();
    },
    [material, geometry, texture],
  );

  useFrame((state, delta) => {
    const snap = heroCapture.snap;
    const desired = readProgress(heroFly);
    progressSmooth.current = snap
      ? desired
      : MathUtils.damp(progressSmooth.current, desired, BIRD_FOLLOW, delta);
    const climb = easeOutCubic(progressSmooth.current);
    const alpha = envelope(climb);
    // Ease the path itself — linger mid-arc, no bullet exit.
    const u = easeInOutCubic(glideU(climb));
    const t = snap ? 0 : state.clock.elapsedTime;
    const idle = snap ? 0.5 : idle01(t, 1.2);
    const flap = snap ? 0 : wingFlap(t);

    // Repaint silhouette only when the wing pose actually changed.
    if (ctx && Math.abs(flap - lastFlap.current) > 0.012) {
      lastFlap.current = flap;
      paintSoar(ctx, size, flap);
      texture.needsUpdate = true;
    }

    const idleSigned = snap ? 0 : Math.sin(t * 0.22);
    sunAim.set(
      MathUtils.lerp(48, 28, climb) + idleSigned * 2.5,
      MathUtils.lerp(62, 88, climb) + idleSigned * 1.2,
      MathUtils.lerp(-40, -70, climb),
    );
    const ringR = BIRD_CAM_DIST * Math.tan((22 * Math.PI) / 180);
    // Shorter travel + double damp = drifts, doesn't shoot.
    const acrossTarget = MathUtils.lerp(-0.42, 0.28, u);
    const liftTarget = MathUtils.lerp(-0.34, -0.16, u) + (idle - 0.5) * 0.03 + flap * 0.015;
    if (snap) {
      acrossSmooth.current = acrossTarget;
      liftSmooth.current = liftTarget;
    } else {
      acrossSmooth.current = MathUtils.damp(acrossSmooth.current, acrossTarget, 1.2, delta);
      liftSmooth.current = MathUtils.damp(liftSmooth.current, liftTarget, 1.4, delta);
    }

    const group = groupRef.current;
    if (group) {
      if (snap) {
        camera.updateMatrixWorld();
        if (!captureLocal.current) {
          sunDir.copy(sunAim).sub(camera.position).normalize();
          captureLocal.current = new Vector3()
            .copy(camera.position)
            .addScaledVector(sunDir, BIRD_CAM_DIST);
          camera.worldToLocal(captureLocal.current);
        }
        offset.set(
          captureLocal.current.x + acrossSmooth.current * ringR,
          captureLocal.current.y + liftSmooth.current * ringR,
          captureLocal.current.z,
        );
        group.position.copy(offset).applyMatrix4(camera.matrixWorld);
      } else {
        captureLocal.current = null;
        sunDir.copy(sunAim).sub(camera.position).normalize();
        side.crossVectors(sunDir, up);
        if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
        else side.normalize();
        offset
          .copy(sunDir)
          .multiplyScalar(BIRD_CAM_DIST)
          .addScaledVector(side, acrossSmooth.current * ringR)
          .addScaledVector(up, liftSmooth.current * ringR);
        group.position.copy(camera.position).add(offset);
      }
      group.visible = alpha > 0.01;
    }

    const mesh = meshRef.current;
    if (!mesh) return;

    const worldW = ringR * 0.12 * (0.98 + idle * 0.02);
    // Wings fold in silhouette redraw; slight Y stretch sells the downstroke.
    mesh.scale.set(worldW * (1 - flap * 0.06), worldW * (0.52 + flap * 0.1), 1);
    mesh.rotation.z = acrossSmooth.current * 0.1 + (idle - 0.5) * 0.025;

    material.opacity = alpha * 0.24 * (0.92 + idle * 0.08);
  });

  return (
    <group ref={groupRef} frustumCulled={false} renderOrder={-48}>
      <Billboard follow>
        <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} renderOrder={-47} />
      </Billboard>
    </group>
  );
}
