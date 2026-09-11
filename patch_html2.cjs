const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /<Center>\s*<group rotation=\{SHARED_ORIENT\} scale=\{7\.0\} position=\{\[0, -0\.45, 0\]\}>\s*<primitive object=\{prepared\} \/>\s*<\/group>\s*<\/Center>/,
  `<Center>
        <group rotation={SHARED_ORIENT} scale={7.0} position={[0, -0.45, 0]}>
          <primitive object={prepared} />
          {formatId === "rich" && (
            <mesh position={[0, -0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <Html
                transform
                occlude="blending"
                zIndexRange={[100, 0]}
                distanceFactor={1.42}
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
        </group>
      </Center>`
);

code = code.replace(
  /import \{ AnimatePresence, motion, useMotionValue, useSpring, useMotionTemplate \} from "framer-motion";/,
  'import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
