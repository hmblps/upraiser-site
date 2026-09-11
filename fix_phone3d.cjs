const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Let's add the missing import for DeviceLoadStage
if (!code.includes('DeviceLoadStage')) {
  code = code.replace(
    /import \{ useGLTF, useTexture \} from "@react-three\/drei";/,
    'import { useGLTF, useTexture } from "@react-three/drei";\nimport { DeviceLoadStage } from "./DeviceLoadStage";'
  );
}

// 2. Add flat to Phone3DProps
code = code.replace(
  /export const Phone3D = memo\(function Phone3D\(\{ mode, formatId, entranceProgress, className \}: Phone3DProps\) \{/,
  'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className, flat = false }: Phone3DProps) {'
);

// 3. Fix the Canvas render block to use DeviceLoadStage as the user provided
code = code.replace(
  /\{\/\* 3D canvas — always mounted[\s\S]*?<\/Canvas>\s*<\/div>/,
  `{/* 1. 3D ТЕЛЕФОН МОНТИРУЕТСЯ ВСЕГДА, БЕЗ УСЛОВИЙ */}
      <DeviceLoadStage ready={meshReady} placeholder={null} instant>
        <Canvas
          className="phone-glb-canvas"
          dpr={[1, 1.5]}
          frameloop={(!inView || reduced || isCssFormat) ? "never" : "always"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          camera={{ position: [0, -0.08, flat ? 3.15 : 3.48], fov: 28, near: 0.05, far: 80 }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "transparent",
          }}
          onCreated={({ gl, size }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = isDark ? 1.05 : 0.98;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
            if (size.width > 0 && size.height > 0) {
              gl.setSize(size.width, size.height, false);
            }
          }}
        >
          <PhoneScene
            url={url}
            formatId={formatId}
            inView={inView && !isCssFormat}
            isDark={isDark}
            rotX={springX}
            rotY={springY}
            entranceProgress={entranceProgress}
            onMeshReady={markMeshReady}
            flat={flat}
          />
        </Canvas>
      </DeviceLoadStage>`
);

// 4. Update PhoneScene props to take flat
code = code.replace(
  /onMeshReady\?: \(\) => void;\n\}\) \{/,
  'onMeshReady?: () => void;\n  flat?: boolean;\n}) {'
);

// 5. Add applyDarkScreen function as the user provided
const applyDarkScreenFn = `
function applyDarkScreen(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;

    const paint = (mat: Material) => {
      // КРАСИМ ТОЛЬКО ЭКРАН! Корпус (body, frame, glass) не трогаем!
      if (!/screen/i.test(mat.name || "")) return mat;
      
      const screen = mat as MeshStandardMaterial;
      screen.map = null;
      screen.emissiveMap = null;
      screen.color = new Color("#0b1220");
      screen.emissive = new Color("#0b1220");
      screen.emissiveIntensity = 0;
      screen.roughness = 0.95;
      screen.metalness = 0;
      screen.needsUpdate = true;
      return screen;
    };

    if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(paint);
    else if (mesh.material) mesh.material = paint(mesh.material);
  });
}
`;

if (!code.includes('function applyDarkScreen')) {
  code = code.replace(
    /function applyScreenTexture[\s\S]*?needsUpdate = true;\n\s*\}\n/m,
    `$&${applyDarkScreenFn}`
  );
}

// 6. Update PhoneScene to use applyDarkScreen for rich media instead of applyScreenTexture
code = code.replace(
  /applyScreenTexture\(rootRef.current, still, formatId\);/g,
  'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, still, formatId);'
);
code = code.replace(
  /applyScreenTexture\(rootRef.current, videoTex\);/g,
  'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, videoTex, formatId);'
);
code = code.replace(
  /applyScreenTexture\(root, still\);/g,
  'if (formatId === "rich") applyDarkScreen(root); else applyScreenTexture(root, still, formatId);'
);

// Since we replaced the logic in applyScreenTexture with applyDarkScreen, we should revert our previous changes to applyScreenTexture to avoid conflicts.
code = code.replace(
  /if \(formatId === "rich"\) \{\s*screen.map = null;\s*screen.emissiveMap = null;\s*screen.color = new Color\("#0b1220"\);\s*screen.emissive = new Color\("#000000"\);\s*\} else \{\s*screen.map = map;\s*screen.emissiveMap = map;\s*screen.color = new Color\("#ffffff"\);\s*screen.emissive = new Color\("#ffffff"\);\s*\}/,
  `screen.map = map;
      screen.emissiveMap = map;
      screen.color = new Color("#ffffff");
      screen.emissive = new Color("#ffffff");`
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
