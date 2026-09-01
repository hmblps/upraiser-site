import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Line as ThreeLine,
  LineBasicMaterial,
  MathUtils,
  Vector3,
  type PointLight,
} from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { useTheme } from "../../context/ThemeContext";
import { TRACK_FOLLOW, climbProgress, readProgress } from "./shared";
import { getSnappedTrail, resetSnappedTrail, snapTrailToTerrain } from "./trail";

const SEGMENTS = 72;

/**
 * Gold line glued to the photogrammetry couloir — not a free-air spline.
 */
export function AscentRoute() {
  const { theme } = useTheme();
  const { scene } = useThree();
  const isLight = theme === "light";
  const heroFly = useHeroFlyOptional();
  const progressSmooth = useRef(0);
  const lampRef = useRef<PointLight>(null);
  const lampPos = useRef(new Vector3());
  const gold = isLight ? "#b8923a" : "#e2b84a";
  const snappedRef = useRef(false);

  const line = useMemo(() => {
    const positions = new Float32Array((SEGMENTS + 1) * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setDrawRange(0, 2);
    const mat = new LineBasicMaterial({
      color: gold,
      transparent: true,
      opacity: isLight ? 0.78 : 0.9,
      toneMapped: false,
    });
    const obj = new ThreeLine(geo, mat);
    obj.frustumCulled = false;
    return obj;
  }, [gold, isLight]);

  useFrame((_, delta) => {
    if (!snappedRef.current) {
      const trail = snapTrailToTerrain(scene);
      if (!trail) return;
      snappedRef.current = true;
      const pts = trail.curve.getPoints(SEGMENTS);
      const attr = line.geometry.getAttribute("position");
      pts.forEach((p, i) => {
        attr.setXYZ(i, p.x, p.y + 0.45, p.z);
      });
      attr.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    }

    const trail = getSnappedTrail();
    if (!trail) return;

    progressSmooth.current = MathUtils.damp(
      progressSmooth.current,
      climbProgress(readProgress(heroFly)),
      TRACK_FOLLOW,
      delta,
    );
    const p = progressSmooth.current;
    line.geometry.setDrawRange(0, SEGMENTS + 1);

    trail.curve.getPoint(MathUtils.clamp(p, 0.02, 0.98), lampPos.current);
    lampPos.current.y += 2.2;
    if (lampRef.current) {
      lampRef.current.position.copy(lampPos.current);
      lampRef.current.intensity = 0.4 + p * 0.5;
      lampRef.current.distance = 56;
    }
  });

  useEffect(() => {
    snappedRef.current = false;
    resetSnappedTrail();
  }, [theme, scene]);

  return (
    <group>
      <primitive object={line} />
      <pointLight ref={lampRef} color={gold} intensity={0.3} distance={36} decay={2} />
    </group>
  );
}
