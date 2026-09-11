const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// Ensure DeviceLoadStage is imported
if (!code.includes('DeviceLoadStage')) {
  code = code.replace(
    /import \{ useSpring \} from "framer-motion";/,
    'import { useSpring } from "framer-motion";\nimport { DeviceLoadStage } from "./DeviceLoadStage";'
  );
}

// Fix the render block
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

// Remove the AnimatePresence and CssFormatPhone block entirely if present (it's unused now anyway since we replaced it with just phone-rich-on-glb)
code = code.replace(
  /<AnimatePresence>[\s\S]*?<\/AnimatePresence>/,
  ''
);

// Fix applyScreenTexture missing formatId param when called in PhoneScene
code = code.replace(
  /applyScreenTexture\(root, still\);/g,
  'applyScreenTexture(root, still, formatId);'
);
code = code.replace(
  /applyScreenTexture\(rootRef.current, videoTex\);/g,
  'applyScreenTexture(rootRef.current, videoTex, formatId);'
);

// Fix applyScreenTexture filter to strictly match user's version
code = code.replace(
  /if \(!\/screen\/i\.test\(name\)\) return mat;/,
  `// КРАСИМ ТОЛЬКО ЭКРАН! Корпус (body, frame, glass) не трогаем!
      if (!/screen/i.test(mat.name || "")) return mat;`
);
code = code.replace(
  /screen\.emissiveIntensity = 1\.25;/,
  `screen.emissiveIntensity = formatId === "rich" ? 0 : 1.25;`
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
