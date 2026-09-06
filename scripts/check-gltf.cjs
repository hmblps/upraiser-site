const fs = require('fs');
const buffer = fs.readFileSync('public/hero/everest-light.glb');
const magic = buffer.toString('utf8', 0, 4);
if (magic !== 'glTF') {
  console.log('Not a GLB file!');
  process.exit(1);
}
const jsonLength = buffer.readUInt32LE(12);
const jsonString = buffer.toString('utf8', 20, 20 + jsonLength);
console.log(Object.keys(JSON.parse(jsonString).nodes));
console.log(JSON.parse(jsonString).nodes.map(n => n.name));
