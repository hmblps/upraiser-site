import fs from 'fs';
let code = fs.readFileSync('src/components/channel-visuals/Tv3D.tsx', 'utf8');

const hook = `
  useEffect(() => {
    if (!materials) return;
    if (showScreen && screenMap) {
      if (materials.Custom) {
        materials.Custom.map = screenMap;
        materials.Custom.emissiveMap = screenMap;
        materials.Custom.emissive = { r: 1, g: 1, b: 1 };
        materials.Custom.needsUpdate = true;
      }
      if (materials.Custom_1) {
        materials.Custom_1.map = screenMap;
        materials.Custom_1.emissiveMap = screenMap;
        materials.Custom_1.emissive = { r: 1, g: 1, b: 1 };
        materials.Custom_1.needsUpdate = true;
      }
    } else {
      if (materials.Custom) {
        materials.Custom.map = null;
        materials.Custom.emissiveMap = null;
        materials.Custom.needsUpdate = true;
      }
      if (materials.Custom_1) {
        materials.Custom_1.map = null;
        materials.Custom_1.emissiveMap = null;
        materials.Custom_1.needsUpdate = true;
      }
    }
  }, [materials, showScreen, screenMap]);
`;

code = code.replace(/useFrame\(\(state\) => \{/, hook + '\n  useFrame((state) => {');
code = code.replace(/const { scene } = useGLTF/, 'const { scene, materials } = useGLTF');

fs.writeFileSync('src/components/channel-visuals/Tv3D.tsx', code);
