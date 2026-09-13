import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Remove the hook from after outerRef
hook_pattern = r"  useEffect\(\(\) => \{\n    if \(\!scene\) return;\n    scene\.traverse\(\(child: any\) => \{\n      if \(child\.isMesh && child\.material\) \{\n        const matName = child\.material\.name\?\.toLowerCase\(\) \|\| \"\";\n        if \(matName\.includes\(\"screen\"\) \|\| matName\.includes\(\"display\"\) \|\| matName\.includes\(\"glass\"\)\) \{\n          child\.material\.color\.set\(\"#000000\"\);\n          child\.material\.emissive\.set\(\"#000000\"\);\n          child\.material\.needsUpdate = true;\n        \}\n      \}\n    \}\);\n  \}, \[scene\]\);\n\n"

code = code.replace(hook_pattern, "")

# Insert it after const { scene } = useGLTF
target = '  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);\n'
code = code.replace(target, target + "\n" + hook_pattern)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)
