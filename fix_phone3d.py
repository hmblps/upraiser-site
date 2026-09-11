import re

with open('src/components/solutions/Phone3D.tsx', 'r') as f:
    code = f.read()

if 'import { DeviceLoadStage }' not in code:
    code = code.replace(
        'import type { MotionValue } from "framer-motion";',
        'import type { MotionValue } from "framer-motion";\nimport { DeviceLoadStage } from "./DeviceLoadStage";'
    )

code = code.replace(
    'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className }: Phone3DProps) {',
    'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className, flat = false }: Phone3DProps) {'
)

# Replace the Canvas wrapper
canvas_wrap_pattern = re.compile(r'\{\/\* 3D canvas — always mounted.*?<Canvas.*?<\/Canvas>\s*<\/div>', re.DOTALL)
new_canvas = """{/* 1. 3D ТЕЛЕФОН МОНТИРУЕТСЯ ВСЕГДА, БЕЗ УСЛОВИЙ */}
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
      </DeviceLoadStage>"""

code = canvas_wrap_pattern.sub(new_canvas, code)

# Update PhoneScene props
code = code.replace(
    'onMeshReady?: () => void;\n}) {',
    'onMeshReady?: () => void;\n  flat?: boolean;\n}) {'
)

# Replace AnimatePresence
code = re.sub(r'<AnimatePresence>[\s\S]*?<\/AnimatePresence>', '', code)
code = code.replace('AnimatePresence, ', '')

# Remove CssFormatPhone function
code = re.sub(r'\/\*\*[\s\S]*?function CssFormatPhone[\s\S]*?\}\n', '', code)

# Fix applyScreenTexture calls in PhoneScene
code = code.replace('applyScreenTexture(rootRef.current, still, formatId);', 'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, still, formatId);')
code = code.replace('applyScreenTexture(rootRef.current, videoTex);', 'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, videoTex, formatId);')
code = code.replace('applyScreenTexture(root, still);', 'if (formatId === "rich") applyDarkScreen(root); else applyScreenTexture(root, still, formatId);')

# Inject applyDarkScreen function after applyScreenTexture
apply_dark_screen = """
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
"""

if 'function applyDarkScreen' not in code:
    code = code.replace(
        'function applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {',
        apply_dark_screen + '\nfunction applyScreenTexture(root: Object3D, map: Texture, formatId?: string) {'
    )

# Revert applyScreenTexture rich media logic to avoid conflicts
rich_logic = """if (formatId === "rich") {
        screen.map = null;
        screen.emissiveMap = null;
        screen.color = new Color("#0b1220");
        screen.emissive = new Color("#000000");
      } else {
        screen.map = map;
        screen.emissiveMap = map;
        screen.color = new Color("#ffffff");
        screen.emissive = new Color("#ffffff");
      }"""
new_logic = """screen.map = map;
      screen.emissiveMap = map;
      screen.color = new Color("#ffffff");
      screen.emissive = new Color("#ffffff");"""

code = code.replace(rich_logic, new_logic)

with open('src/components/solutions/Phone3D.tsx', 'w') as f:
    f.write(code)
