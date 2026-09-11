const fs = require('fs');
let code = fs.readFileSync('src/components/channel-visuals/Tv3D.tsx', 'utf8');

code = code.replace(
  /function getTargetHeight\(\) \{\n  if \(typeof window === "undefined"\) return 2\.15;\n  const aspect = window\.innerWidth \/ window\.innerHeight;\n  return Math\.min\(2\.35, 2\.05 \* Math\.min\(aspect, 1\.55\)\);\n\}/s,
  `function getTargetHeight() {
  if (typeof window === "undefined") return 1.85;
  const aspect = window.innerWidth / window.innerHeight;
  return Math.min(2.0, 1.8 * Math.min(aspect, 1.55));
}`
);

code = code.replace(
  /function screenPlaneForHeight\(h: number\) \{\n  return \{\n    w: h \* \(16 \/ 9\) \* 0\.985,\n    h: h \* 0\.935,\n    y: 0\.01,\n    z: 0\.095,\n  \};\n\}/s,
  `function screenPlaneForHeight(h: number) {
  return {
    w: h * (16 / 9) * 0.995, // stretch screen
    h: h * 0.955,            // stretch screen
    y: 0.015,
    z: 0.095,
  };
}`
);

code = code.replace(
  /\/\* Lift in frustum so stand\/legs stay inside the GL canvas \*\/\n    outerRef\.current\.position\.y = 0\.14;/g,
  `/* Lift in frustum so stand/legs stay inside the GL canvas */
    outerRef.current.position.y = 0.06;` // lower it to be in line with others
);

fs.writeFileSync('src/components/channel-visuals/Tv3D.tsx', code);
