const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

const target = `      if (formatId === "rich") {
        screen.map = null;
        screen.emissiveMap = null;
        screen.color = new Color("#0b1220");
      } else {
        screen.map = map;
        screen.emissiveMap = map;
        screen.color = new Color("#ffffff");
      }
      screen.emissive = new Color("#ffffff");`;

const replacement = `      if (formatId === "rich") {
        screen.map = null;
        screen.emissiveMap = null;
        screen.color = new Color("#0b1220");
        screen.emissive = new Color("#000000");
      } else {
        screen.map = map;
        screen.emissiveMap = map;
        screen.color = new Color("#ffffff");
        screen.emissive = new Color("#ffffff");
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
