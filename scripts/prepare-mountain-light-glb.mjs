/**
 * Prepare the reworked light-theme mountain for the hero.
 *
 *   node scripts/prepare-mountain-light-glb.mjs <in.glb> [out.glb]
 *
 * - bakes the Blender node transform (Z-up → Y-up, 0.052 scale) into vertices —
 *   `Everest.tsx` renders raw geometry, so the node matrix must be baked;
 * - drops unused COLOR_0 / COLOR_1 / TEXCOORD_1 (three.js ignores them here);
 * - re-encodes the 3.4 MB roughness PNG as JPEG;
 * - re-compresses with Draco.
 */
import { NodeIO } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { clearNodeTransform, draco, prune, textureCompress, transformMesh } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import { statSync } from "node:fs";

const args = process.argv.slice(2);
/** `--height=0.62` squashes relief (Y) — Everest is ~0.62× this model's height under the same span. */
const heightArg = args.find((a) => a.startsWith("--height="));
const heightScale = heightArg ? Number(heightArg.split("=")[1]) : 1;
const [input, output = "public/hero/mountain-light.glb"] = args.filter((a) => !a.startsWith("--"));
if (!input || !(heightScale > 0)) {
  console.error("usage: node scripts/prepare-mountain-light-glb.mjs <in.glb> [out.glb] [--height=0.62]");
  process.exit(1);
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});

const doc = await io.read(input);
const root = doc.getRoot();

for (const node of root.listNodes()) {
  if (node.getMesh()) clearNodeTransform(node);
}

if (heightScale !== 1) {
  // prettier-ignore
  const squash = [1, 0, 0, 0,  0, heightScale, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1];
  for (const mesh of root.listMeshes()) transformMesh(mesh, squash);
}

for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    for (const sem of ["COLOR_0", "COLOR_1", "TEXCOORD_1"]) {
      if (prim.getAttribute(sem)) prim.setAttribute(sem, null);
    }
  }
}

await doc.transform(
  prune(),
  // Roughness is low-frequency on snow — 1K JPEG is indistinguishable under the splat shader.
  textureCompress({ encoder: sharp, targetFormat: "jpeg", quality: 82, resize: [1024, 1024], pattern: /Roughness/i }),
  draco({ method: "edgebreaker", quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
);

await io.write(output, doc);

const before = statSync(input).size;
const after = statSync(output).size;
console.log(`${input} ${(before / 1e6).toFixed(2)} MB → ${output} ${(after / 1e6).toFixed(2)} MB`);
for (const tex of root.listTextures()) {
  console.log(`  tex ${tex.getName()} ${tex.getMimeType()} ${(tex.getImage()?.byteLength ?? 0) / 1e6 | 0}.${String(Math.round(((tex.getImage()?.byteLength ?? 0) % 1e6) / 1e4)).padStart(2, "0")} MB`);
}
