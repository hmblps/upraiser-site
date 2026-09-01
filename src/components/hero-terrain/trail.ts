import { CatmullRomCurve3, Mesh, Raycaster, Vector3, type Object3D } from "three";

/**
 * XZ spine of the photogrammetry couloir (gully between ridges).
 * Y is snapped to the local snow surface, not a free-air spline.
 */
const TRAIL_XZ = [
  [14, 92],
  [15, 78],
  [16, 64],
  [17, 52],
  [16, 40],
] as Array<[number, number]>;

export type SnappedTrail = {
  curve: CatmullRomCurve3
  points: Vector3[]
};

let snapped: SnappedTrail | null = null;

export function getSnappedTrail() {
  return snapped;
}

export function resetSnappedTrail() {
  snapped = null;
}

function terrainMeshes(scene: Object3D) {
  const meshes: Mesh[] = [];
  scene.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const mesh = obj as Mesh;
    const count = mesh.geometry?.attributes?.position?.count ?? 0;
    if (count < 4000) return;
    meshes.push(mesh);
  });
  return meshes;
}

function hitY(
  raycaster: Raycaster,
  meshes: Mesh[],
  origin: Vector3,
  down: Vector3,
  x: number,
  y: number,
  z: number,
  far: number,
) {
  origin.set(x, y, z);
  raycaster.far = far;
  raycaster.set(origin, down);
  return raycaster.intersectObjects(meshes, false)[0] ?? null;
}

export function snapTrailToTerrain(scene: Object3D): SnappedTrail | null {
  const meshes = terrainMeshes(scene);
  if (!meshes.length) return null;

  const restored = meshes.map((mesh) => {
    const prev = mesh.raycast;
    mesh.raycast = Mesh.prototype.raycast;
    return () => {
      mesh.raycast = prev;
    };
  });

  const raycaster = new Raycaster();
  const down = new Vector3(0, -1, 0);
  const origin = new Vector3();
  const points: Vector3[] = [];
  const offsets = [0, -2.5, 2.5, -5, 5];

  try {
    let prevY = 8;
    let prevX = TRAIL_XZ[0][0];
    for (const [gx, z] of TRAIL_XZ) {
      const candidates: { point: Vector3; y: number; x: number }[] = [];
      for (const dx of offsets) {
        const x = gx + dx;
        const local = hitY(raycaster, meshes, origin, down, x, prevY + 26, z, 52);
        const hit = local ?? hitY(raycaster, meshes, origin, down, x, prevY + 80, z, 140);
        if (!hit) continue;
        candidates.push({ point: hit.point.clone(), y: hit.point.y, x: hit.point.x });
      }
      if (!candidates.length) return null;
      const climbing = candidates.filter((c) => c.y >= prevY - 2);
      const pool = climbing.length ? climbing : candidates;
      pool.sort((a, b) => {
        const da = Math.abs(a.x - prevX);
        const db = Math.abs(b.x - prevX);
        if (Math.abs(da - db) > 1.5) return da - db;
        return b.y - a.y;
      });
      const best = pool[0];
      points.push(best.point);
      prevY = best.y;
      prevX = best.x;
    }
  } finally {
    restored.forEach((undo) => undo());
  }

  if (points.length < 3) return null;
  snapped = {
    curve: new CatmullRomCurve3(points, false, "catmullrom", 0.15),
    points,
  };
  return snapped;
}

export function heightOnTrail(t: number) {
  return 6.2 + t * 4.8;
}

export function lookAheadOnTrail(t: number) {
  return 0.34 - t * 0.18;
}
