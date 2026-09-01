import fs from "fs";

let code = fs.readFileSync("src/components/GlobalAmbientModalBackground.tsx", "utf-8");

if (!code.includes("useReducedMotion")) {
  code = code.replace(
    'import { useModalBackground } from "../lib/modalBackgroundState";',
    'import { useModalBackground } from "../lib/modalBackgroundState";\nimport { useReducedMotion } from "../hooks/useReducedMotion";'
  );
  code = code.replace(
    '  const isOpen = useModalBackground((s) => s.isOpen);',
    '  const isOpen = useModalBackground((s) => s.isOpen);\n  const reduced = useReducedMotion();'
  );
  
  // Replace the {isOpen ? ( <Canvas> ) : null} with <Canvas frameloop={isOpen && !reduced ? "always" : "never"}>
  const oldCanvasBlock = `{isOpen ? (
          <React.Suspense fallback={null}>
            <Canvas frameloop="always" camera={{ position: [0, 0, 0], fov: 60 }} gl={{ alpha: true }} style={{ pointerEvents: "none" }}>
              <NightStars />
            </Canvas>
          </React.Suspense>
        ) : null}`;

  const newCanvasBlock = `<React.Suspense fallback={null}>
            <Canvas frameloop={isOpen && !reduced ? "always" : "never"} camera={{ position: [0, 0, 0], fov: 60 }} gl={{ alpha: true, powerPreference: "low-power" }} style={{ pointerEvents: "none" }}>
              {(!reduced) && <NightStars />}
            </Canvas>
          </React.Suspense>`;
  
  code = code.replace(oldCanvasBlock, newCanvasBlock);
  fs.writeFileSync("src/components/GlobalAmbientModalBackground.tsx", code);
}

// Remove stray console.log from SiteLayout.tsx
let layoutCode = fs.readFileSync("src/layouts/SiteLayout.tsx", "utf-8");
layoutCode = layoutCode.replace('  const mounted = show && heroOk; console.log("LazySection", id, "show:", show, "heroOk:", heroOk, "mounted:", mounted);', '  const mounted = show && heroOk;');
fs.writeFileSync("src/layouts/SiteLayout.tsx", layoutCode);
