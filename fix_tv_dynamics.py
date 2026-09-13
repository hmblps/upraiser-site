import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# 1. Replace double rAF with useLayoutEffect
code = re.sub(
    r'  useEffect\(\(\) => \{\n    let id2 = 0;\n    const id1 = requestAnimationFrame\(\(\) => \{\n      id2 = requestAnimationFrame\(\(\) => onReady\?\.\(\)\);\n    \}\);\n    return \(\) => \{\n      cancelAnimationFrame\(id1\);\n      cancelAnimationFrame\(id2\);\n    \};\n  \}, \[scene, onReady\]\);',
    r'  useLayoutEffect(() => {\n    onReady?.();\n  }, [onReady]);',
    code
)
if 'useLayoutEffect' not in code:
    code = re.sub(r'  useEffect,', '  useEffect,\n  useLayoutEffect,', code)

# 2. Match float dynamics to phone
code = re.sub(
    r'const floatRotX = Math\.sin\(t \* 0\.5\) \* 0\.015;\n    const floatRotY = Math\.cos\(t \* 0\.4\) \* 0\.02;\n    const floatPosY = Math\.sin\(t \* 0\.8\) \* 0\.015;',
    r'const floatRotX = Math.sin(t * 0.8) * 0.03;\n    const floatRotY = Math.cos(t * 0.6) * 0.04;\n    const floatPosY = Math.sin(t * 1.2) * 0.04;',
    code
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

