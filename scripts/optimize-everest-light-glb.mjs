#!/usr/bin/env node
/**
 * Rebuild public/hero/everest-light.glb for light-theme photorealism:
 * - keep UVs + base/normal maps (same Mt. Everest mesh as wire GLB)
 * - derive roughness from albedo (snow sparkle / rock matte) — real UV space, no tiling
 * - recompress textures; Draco-compress mesh
 *
 * Usage: node scripts/optimize-everest-light-glb.mjs
 *
 * Note: do NOT tile generic rock textures on this mesh — Sketchfab UVs are unique
 * satellite unwrap; RepeatWrapping would destroy Everest photo accuracy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "assets/hero/everest.mt-everest.src.glb");
const outPublic = path.join(root, "public/hero/everest-light.glb");
const outAssets = path.join(root, "assets/hero/everest-light.glb");

/** Snow (bright) → lower roughness; rock/shadow (dark) → higher. glTF MR: G=rough, B=metal. */
async function bakeRoughnessFromAlbedo(doc, sharp) {
  for (const mat of doc.getRoot().listMaterials()) {
    const base = mat.getBaseColorTexture();
    if (!base?.getImage()) continue;

    const { data, info } = await sharp(Buffer.from(base.getImage()))
      .resize(2048, 2048, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width: w, height: h } = info;
    const out = Buffer.alloc(w * h * 3);
    for (let i = 0, p = 0; i < data.length; i += 4, p += 3) {
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      // ~0.38 snow highlights → ~0.92 deep rock
      const rough = Math.max(0, Math.min(255, Math.round((0.92 - lum * 0.54) * 255)));
      out[p] = 255;
      out[p + 1] = rough;
      out[p + 2] = 0;
    }

    const jpeg = await sharp(out, { raw: { width: w, height: h, channels: 3 } })
      .jpeg({ quality: 84 })
      .toBuffer();

    const tex = doc.createTexture("RoughnessFromAlbedo").setMimeType("image/jpeg").setImage(jpeg);
    mat.setMetallicRoughnessTexture(tex);
    mat.setRoughnessFactor(1);
    mat.setMetallicFactor(0);
  }
}

async function main() {
  if (!fs.existsSync(src)) {
    console.error("Missing source:", src);
    console.error("Place the Sketchfab Mt. Everest download at assets/hero/everest.mt-everest.src.glb first.");
    process.exit(1);
  }

  let NodeIO, ALL_EXTENSIONS, dedup, prune, draco, weld, textureCompress, sharp, draco3d;
  try {
    ({ NodeIO } = await import("@gltf-transform/core"));
    ({ ALL_EXTENSIONS } = await import("@gltf-transform/extensions"));
    ({ dedup, prune, draco, weld, textureCompress } = await import("@gltf-transform/functions"));
    sharp = (await import("sharp")).default;
    draco3d = (await import("draco3dgltf")).default;
  } catch (err) {
    console.error("Install optimizer deps:");
    console.error(
      "  npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf sharp",
    );
    console.error(err);
    process.exit(1);
  }

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });

  const doc = await io.read(src);
  await bakeRoughnessFromAlbedo(doc, sharp);

  await doc.transform(
    weld(),
    dedup(),
    textureCompress({
      encoder: sharp,
      targetFormat: "jpeg",
      quality: 88,
      resize: [4096, 4096],
      slots: /baseColor|diffuse/i,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: "png",
      slots: /normal/i,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: "jpeg",
      quality: 84,
      slots: /metallicRoughness|occlusion/i,
    }),
    prune({ keepAttributes: true, keepLeaves: false }),
    draco({
      method: "edgebreaker",
      quantizePosition: 16,
      quantizeNormal: 14,
      quantizeTexcoord: 16,
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
    `everest-light.glb ${((before / 1024 / 1024).toFixed(2))}MB → ${((after / 1024 / 1024).toFixed(2))}MB (−${(((before - after) / before) * 100).toFixed(1)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
