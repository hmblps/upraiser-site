import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# 1. Revert dimensions
code = re.sub(
    r"w: 3\.59 \* ratio,\n\s*h: 2\.02 \* ratio,\n\s*x: 0\.010 \* ratio,\n\s*y: 0\.035 \* ratio,\n\s*z: 0\.090 \* ratio,",
    "w: 3.64 * ratio,\n    h: 2.06 * ratio,\n    x: 0,\n    y: 0.02 * ratio,\n    z: 0.088 * ratio,",
    code
)

# 2. Remove the black paint useEffect
hook_pattern = r"  useEffect\(\(\) => \{\n    if \(\!scene\) return;\n    scene\.traverse\(\(child: any\) => \{\n      if \(child\.isMesh && child\.material\) \{\n        const matName = child\.material\.name\?\.toLowerCase\(\) \|\| \"\";\n        if \(matName\.includes\(\"screen\"\) \|\| matName\.includes\(\"display\"\) \|\| matName\.includes\(\"glass\"\)\) \{\n          child\.material\.color\.set\(\"#000000\"\);\n          child\.material\.emissive\.set\(\"#000000\"\);\n          child\.material\.needsUpdate = true;\n        \}\n      \}\n    \}\);\n  \}, \[scene\]\);\n"
code = re.sub(hook_pattern, "", code)

# 3. Remove renderOrder={1}
code = code.replace("<mesh position={[screen.x || 0, screen.y, screen.z]} renderOrder={1}>", "<mesh position={[screen.x || 0, screen.y, screen.z]}>")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)
