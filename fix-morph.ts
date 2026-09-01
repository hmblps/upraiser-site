import fs from "fs";

let code = fs.readFileSync("src/hooks/useScrollMorph.ts", "utf-8");
code = code.replace(
  'const [morph, setMorph] = useState(0);',
  'const morph = useMotionValue(0);\n  const { spring } = options;\n  const springMorph = useSpring(morph, spring || { stiffness: 120, damping: 20 });'
);
fs.writeFileSync("src/hooks/useScrollMorph.ts", code);
