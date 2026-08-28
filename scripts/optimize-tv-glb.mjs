#!/usr/bin/env node
/**
 * Draco + texture shrink for the CTV GLB.
 * Keeps node names (Tv3D hides stand/legs by name) and triangle layout.
 *
 *   node scripts/optimize-tv-glb.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const live = path.join(root, "public/channels/oem/tv.glb");
const src = path.join(root, "assets/channels/oem/tv.src.glb");

function mb(n) {
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

async function main() {
  if (!fs.existsSync(live) && !fs.existsSync(src)) {
    console.error("Missing TV model:", live);
    process.exit(1);
  }

  if (fs.existsSync(live) && !fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(src), { recursive: true });
    fs.copyFileSync(live, src);
    console.log("Backed up source →", path.relative(root, src));
  }

  const input = fs.existsSync(src) ? src : live;
  const before = fs.statSync(input).size;

  const { NodeIO } = await import("@gltf-transform/core");
  const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
  const { dedup, prune, draco, weld, textureCompress, simplify } = await import("@gltf-transform/functions");
  const draco3d = (await import("draco3dgltf")).default;
  const sharp = (await import("sharp")).default;
  const { MeshoptSimplifier } = await import("meshoptimizer");

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });

  const doc = await io.read(input);
  const namesBefore = doc
    .getRoot()
    .listNodes()
    .map((n) => n.getName())
    .filter(Boolean);

  await doc.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.4, error: 0.002 }),
    dedup(),
    textureCompress({
      encoder: sharp,
      targetFormat: "jpeg",
      quality: 82,
      resize: [2048, 2048],
      slots: /baseColor|diffuse|emissive/i,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: "jpeg",
      quality: 80,
      resize: [2048, 2048],
      slots: /metallicRoughness|occlusion/i,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: "png",
      resize: [1024, 1024],
      slots: /normal/i,
    }),
    prune({ keepAttributes: true, keepLeaves: true }),
    draco({
      method: "edgebreaker",
      quantizePosition: 14,
      quantizeNormal: 12,
      quantizeTexcoord: 12,
      quantizeColor: 8,
      quantizeGeneric: 12,
    }),
  );

  const namesAfter = new Set(
    doc
      .getRoot()
      .listNodes()
      .map((n) => n.getName())
      .filter(Boolean),
  );
  const lost = namesBefore.filter((n) => !namesAfter.has(n));
  if (lost.length) {
    console.warn("Node names dropped (Tv3D hide-list may break):", lost.join(", "));
  }

  fs.mkdirSync(path.dirname(live), { recursive: true });
  await io.write(live, doc);
  const after = fs.statSync(live).size;
  console.log(`tv.glb ${mb(before)} → ${mb(after)} (−${(((before - after) / before) * 100).toFixed(1)}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
