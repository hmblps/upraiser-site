const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

const target = `      const screen = mat as MeshStandardMaterial;
    
      screen.map = map;
      screen.emissiveMap = map;
      screen.color = new Color("#ffffff");`;

const replacement = `      const screen = mat as MeshStandardMaterial;
    
      if (formatId === "rich") {
        screen.map = null;
        screen.emissiveMap = null;
        screen.color = new Color("#0b1220");
      } else {
        screen.map = map;
        screen.emissiveMap = map;
        screen.color = new Color("#ffffff");
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
