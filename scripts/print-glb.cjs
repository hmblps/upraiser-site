const fs = require('fs');

const data = fs.readFileSync('public/hero/everest.glb');
// The GLB has a 12-byte header, then chunks.
// Chunk 0 is JSON.
const jsonLen = data.readUInt32LE(12);
const jsonStr = data.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);
console.log(gltf.nodes.map(n => n.name));
