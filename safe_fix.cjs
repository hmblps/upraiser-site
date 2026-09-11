const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Add DeviceLoadStage import
if (!code.includes('import { DeviceLoadStage }')) {
  code = code.replace(
    'import type { MotionValue } from "framer-motion";',
    'import type { MotionValue } from "framer-motion";\nimport { DeviceLoadStage } from "./DeviceLoadStage";'
  );
}

// 2. Fix Phone3D signature
code = code.replace(
  'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className }: Phone3DProps) {',
  'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className, flat = false }: Phone3DProps) {'
);

// 3. Fix Canvas render block (replace EXACT string)
const oldCanvas = `{/* 3D canvas — always mounted (keep WebGL context), hidden behind CSS formats */}
      <div
        className={cn(
          "phone-glb-canvas-wrap transition-opacity duration-700 ease-out",
          meshReady ? "opacity-100" : "opacity-0",
        )}
        style={{
          pointerEvents: "auto",
          visibility: "visible",
        }}
      >
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
          camera={{ position: [0, -0.08, 3.78], fov: 28, near: 0.05, far: 80 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
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
          />
        </Canvas>
      </div>`;

const newCanvas = `{/* 1. 3D ТЕЛЕФОН МОНТИРУЕТСЯ ВСЕГДА, БЕЗ УСЛОВИЙ */}
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
      </DeviceLoadStage>`;

code = code.replace(oldCanvas, newCanvas);

// 4. Update PhoneScene signature
code = code.replace(
  'onMeshReady?: () => void;\n}) {',
  'onMeshReady?: () => void;\n  flat?: boolean;\n}) {'
);

// 5. Apply the correct applyDarkScreen function to the file
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
    'function applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {',
    applyDarkScreenFn + '\nfunction applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {'
  );
}

// 6. Fix applyScreenTexture inside PhoneScene
code = code.replace(
  'applyScreenTexture(rootRef.current, still, formatId);',
  'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, still, formatId);'
);
code = code.replace(
  'applyScreenTexture(rootRef.current, videoTex);',
  'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, videoTex, formatId);'
);
code = code.replace(
  'applyScreenTexture(root, still);',
  'if (formatId === "rich") applyDarkScreen(root); else applyScreenTexture(root, still, formatId);'
);
// There is one more applyScreenTexture inside PhoneScene catch block
code = code.replace(
  'applyScreenTexture(rootRef.current, still, formatId);',
  'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, still, formatId);'
);

// 7. Remove the old rich logic from applyScreenTexture
const oldRichLogic = `if (formatId === "rich") {
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

const newRichLogic = `screen.map = map;
      screen.emissiveMap = map;
      screen.color = new Color("#ffffff");
      screen.emissive = new Color("#ffffff");`;

code = code.replace(oldRichLogic, newRichLogic);

// We leave AnimatePresence and CssFormatPhone in the file so they don't break anything. They just don't render when isCssFormat is false.

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
