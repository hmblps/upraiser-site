const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// Import Html
code = code.replace(
  'import { Center, Environment, useGLTF, useTexture } from "@react-three/drei";',
  'import { Center, Environment, useGLTF, useTexture, Html } from "@react-three/drei";'
);

// Add Html inside PhoneMesh
code = code.replace(
  /<Center ref=\{centerRef\}>\s*<primitive object=\{prepared\} dispose=\{null\} \/>\s*<\/Center>/,
  `<Center ref={centerRef}>
        <primitive object={prepared} dispose={null} />
        {formatId === "rich" && (
          <mesh position={[0, 0.008, -0.000]}>
            <Html
              transform
              occlude="blending"
              zIndexRange={[100, 0]}
              distanceFactor={1.42}
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <div
                style={{
                  width: 320,
                  height: 693,
                  background: "#0b1220",
                  borderRadius: 38,
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                <iframe
                  src="/rich-media-ad.html"
                  title="Rich Media Interactive Demo"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    pointerEvents: "auto",
                  }}
                />
              </div>
            </Html>
          </mesh>
        )}
      </Center>`
);

// Remove the CSS iframe motion.div
code = code.replace(
  /\{formatId === "rich" && \(\s*<motion\.div\s*className="phone-rich-on-glb"[\s\S]*?<\/motion\.div>\s*\)\}/,
  ''
);

// Remove richTransform
code = code.replace(
  /const richTransform = .*/,
  ''
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
