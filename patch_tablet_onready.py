import re

filepath = "src/components/channel-visuals/Tablet3D.tsx"
with open(filepath, "r") as f:
    code = f.read()

pattern = r'useLayoutEffect\(\(\) => \{\s*if \(screenMap\) \{\s*onReady\?\.\(\);\s*\}\s*\}, \[onReady, screenMap\]\);'
replacement = r'useLayoutEffect(() => {\n    onReady?.();\n  }, [onReady]);'
code = re.sub(pattern, replacement, code)

with open(filepath, "w") as f:
    f.write(code)
