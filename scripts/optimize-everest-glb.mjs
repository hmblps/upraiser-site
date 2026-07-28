#!/usr/bin/env node
/**
 * Rebuild public/hero/everest.glb without sacrificing wireframe fidelity:
 * - strip unused photo textures (~14MB)
 * - prune unused UVs/tangents
 * - Draco-compress mesh (same triangle count, high quantize)
 *
 * Usage: node scripts/optimize-everest-glb.mjs
 * Requires: npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf
 * Or run via the one-shot install in /tmp as documented in AI notes.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "assets/hero/everest.mt-everest.src.glb");
const outPublic = path.join(root, "public/hero/everest.glb");
const outAssets = path.join(root, "assets/hero/everest.glb");

async function main() {
  if (!fs.existsSync(src)) {
    console.error("Missing source:", src);
    console.error("Place the Sketchfab Mt. Everest download at assets/hero/everest.mt-everest.src.glb first.");
    process.exit(1);
  }

  const require = createRequire(import.meta.url);
  let NodeIO, ALL_EXTENSIONS, dedup, prune, draco, weld, draco3d;
  try {
    ({ NodeIO } = await import("@gltf-transform/core"));
    ({ ALL_EXTENSIONS } = await import("@gltf-transform/extensions"));
    ({ dedup, prune, draco, weld } = await import("@gltf-transform/functions"));
    draco3d = (await import("draco3dgltf")).default;
  } catch {
    console.error("Install optimizer deps:");
    console.error("  npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf");
    process.exit(1);
  }

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });

  const doc = await io.read(src);
  const rootDoc = doc.getRoot();
  for (const texture of rootDoc.listTextures()) texture.dispose();
  for (const mat of rootDoc.listMaterials()) {
    mat.setBaseColorTexture(null);
    mat.setMetallicRoughnessTexture(null);
    mat.setNormalTexture(null);
    mat.setOcclusionTexture(null);
    mat.setEmissiveTexture(null);
  }

  await doc.transform(
    weld(),
    dedup(),
    prune({ keepAttributes: false, keepLeaves: false }),
    draco({
      method: "edgebreaker",
      quantizePosition: 16,
      quantizeNormal: 12,
      quantizeTexcoord: 12,
      quantizeColor: 8,
      quantizeGeneric: 12,
    }),
  );

  fs.mkdirSync(path.dirname(outPublic), { recursive: true });
  await io.write(outPublic, doc);
  fs.copyFileSync(outPublic, outAssets);

  const before = fs.statSync(src).size;
  const after = fs.statSync(outPublic).size;
  console.log(
    `everest.glb ${((before / 1024 / 1024).toFixed(2))}MB → ${((after / 1024 / 1024).toFixed(2))}MB (−${(((before - after) / before) * 100).toFixed(1)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
