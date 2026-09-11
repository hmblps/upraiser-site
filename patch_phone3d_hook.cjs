const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// Move useMotionTemplate to the top level
code = code.replace(
  'const isCssFormat = formatId === "video";',
  'const isCssFormat = formatId === "video";\n  const richTransform = useMotionTemplate\`perspective(1200px) translate(-50%, -50%) rotateX(\${springX}rad) rotateY(\${springY}rad) translateZ(8px)\`;'
);

// Update the inline usage
code = code.replace(
  'transform: useMotionTemplate\`perspective(1200px) translate(-50%, -50%) rotateX(${springX}rad) rotateY(${springY}rad) translateZ(8px)\`',
  'transform: richTransform'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
