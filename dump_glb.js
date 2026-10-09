const fs = require('fs');
const buffer = fs.readFileSync('public/hero/models/iphone-dark.glb');
// glb has a json chunk at offset 20. 
// chunk length is at offset 12.
const chunkLength = buffer.readUInt32LE(12);
const jsonChunk = buffer.toString('utf8', 20, 20 + chunkLength);
const json = JSON.parse(jsonChunk);
console.log("Materials:", json.materials.map(m => m.name));
