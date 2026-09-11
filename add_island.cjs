const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

const replacement = `<div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 100,
                    height: 28,
                    background: "#000",
                    borderRadius: 14,
                    zIndex: 100,
                    pointerEvents: "none"
                  }}
                />
                <iframe`;

code = code.replace(/<iframe/, replacement);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
