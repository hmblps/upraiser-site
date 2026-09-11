const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Make the screen invisible for "rich"
code = code.replace(
  /const screen = mat as MeshStandardMaterial;/,
  `const screen = mat as MeshStandardMaterial;
    if (formatId === "rich") {
      screen.visible = false;
    }`
);

// 2. Adjust Html to prepend and scale appropriately
code = code.replace(
  /<Html[\s\S]*?>/,
  `<Html
                transform
                prepend
                occlude="blending"
                zIndexRange={[-100, -10]}
                distanceFactor={1.42}
              >`
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
