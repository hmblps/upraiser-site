import re

filepath = "src/components/channel-visuals/Tv3D.tsx"
with open(filepath, "r") as f:
    code = f.read()

# 1. Add stillTexRef
code = code.replace(
    'const [screenMap, setScreenMap] = useState<Texture | null>(null);',
    'const stillTexRef = useRef<Texture | null>(null);\n  const [screenMap, setScreenMap] = useState<Texture | null>(null);'
)

# 2. Save tex to stillTexRef
code = code.replace(
    'tex.colorSpace = SRGBColorSpace;',
    'tex.colorSpace = SRGBColorSpace;\n      stillTexRef.current = tex;'
)

# 3. Restore stillTex in the else block
code = code.replace(
    '// setScreenMap(stillTex);',
    'if (stillTexRef.current) setScreenMap(stillTexRef.current);\n      invalidate();'
)

with open(filepath, "w") as f:
    f.write(code)
