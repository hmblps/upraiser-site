import fs from 'fs';
const file = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(file, 'utf8');

tsx = tsx.replace(/function screenPlaneForHeight\(h: number\) \{[\s\S]*?\}\n\};\n\}/g, `function screenPlaneForHeight(h: number) {
  return {
    w: 3.76,
    h: 2.12,
    y: 0.02,
    z: 0.125,
  };
}`);

fs.writeFileSync(file, tsx);
console.log('Fixed extra bracket');
