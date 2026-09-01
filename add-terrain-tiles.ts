import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/Scene.tsx", "utf-8");

const tiles = `
        {lite ? (
          <group>
            <group position={[400, -2, 0]}><Everest theme={theme} castShadow={false} receiveShadow={false} /></group>
            <group position={[-400, -2, 0]}><Everest theme={theme} castShadow={false} receiveShadow={false} /></group>
            <group position={[0, -2, 400]}><Everest theme={theme} castShadow={false} receiveShadow={false} /></group>
            <group position={[0, -2, -400]}><Everest theme={theme} castShadow={false} receiveShadow={false} /></group>
          </group>
        ) : null}
`;

content = content.replace(
  "<Everest theme={theme} castShadow={isLight} receiveShadow={isLight} />", 
  "<Everest theme={theme} castShadow={isLight} receiveShadow={isLight} />" + tiles
);

fs.writeFileSync("src/components/hero-terrain/Scene.tsx", content);
