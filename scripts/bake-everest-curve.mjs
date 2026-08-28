#!/usr/bin/env node
/**
 * Bake Everest planet-curvature into POSITION data only.
 * Same formula as Everest.tsx — does not rebuild normals (would flatten the mesh).
 *
 *   node scripts/bake-everest-curve.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const TERRAIN_SPAN = 420;
const PLANET_RADIUS = 460;
const MESH_NODES = new Set(["Object_4", "Object_5", "Object_6", "Object_7"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function mb(n) {
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

async function bake(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.error("Missing", file);
    return;
  }

  const { NodeIO } = await import("@gltf-transform/core");
  const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
  const { draco } = await import("@gltf-transform/functions");
  const draco3d = (await import("draco3dgltf")).default;

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });

  const doc = await io.read(abs);
  const rootDoc = doc.getRoot();
  if (rootDoc.getExtras()?.planetCurved) {
    console.log(file, "already baked — skip");
    return;
  }

  const prims = [];
  for (const node of rootDoc.listNodes()) {
    if (!MESH_NODES.has(node.getName())) continue;
    const mesh = node.getMesh();
    if (!mesh) continue;
    for (const prim of mesh.listPrimitives()) prims.push(prim);
  }
  if (!prims.length) {
    console.error(file, "no Object_4–7 primitives");
    return;
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const prim of prims) {
    const pos = prim.getAttribute("POSITION");
    if (!pos) continue;
    const arr = pos.getArray();
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], y = arr[i + 1], z = arr[i + 2];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 0.001);
  const scale = TERRAIN_SPAN / maxDim;
  const rLocal = PLANET_RADIUS / Math.max(scale, 1e-6);

  for (const prim of prims) {
    const pos = prim.getAttribute("POSITION");
    if (!pos) continue;
    const arr = pos.getArray();
    for (let i = 0; i < arr.length; i += 3) {
      const dx = arr[i] - cx;
      const dz = arr[i + 2] - cz;
      arr[i + 1] -= (dx * dx + dz * dz) / (2 * rLocal);
    }
    pos.setArray(arr);
  }

  rootDoc.setExtras({ ...rootDoc.getExtras(), planetCurved: true });

  await doc.transform(
    draco({
      method: "edgebreaker",
      quantizePosition: 16,
      quantizeNormal: 12,
      quantizeTexcoord: 12,
      quantizeColor: 8,
      quantizeGeneric: 12,
    }),
  );

  const before = fs.statSync(abs).size;
  await io.write(abs, doc);
  const after = fs.statSync(abs).size;
  console.log(`${file} ${mb(before)} → ${mb(after)} (curve baked)`);
}

await bake("public/hero/everest.glb");
// Light photogrammetry GLB stays unbent at rest — baking inflated it ~2MB.
