import re

for file in ["src/components/channel-visuals/Tv3D.tsx", "src/components/channel-visuals/Tablet3D.tsx", "src/components/solutions/Phone3D.tsx"]:
    with open(file, 'r') as f:
        code = f.read()

    # Remove the first style
    code = re.sub(
        r'<Canvas className="(.*?)"\s*style=\{\{ pointerEvents: active \? "auto" : "none" \}\}',
        r'<Canvas className="\1"',
        code
    )

    # Merge it into the second style block (the block structure differs slightly)
    # For Tv3D / Phone3D (single line style)
    code = re.sub(
        r'style=\{\{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" \}\}',
        r'style={{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: active ? "auto" : "none" }}',
        code
    )
    
    # For Tablet3D (multi line style)
    code = re.sub(
        r'pointerEvents: "none",\n\s*\}\}',
        r'pointerEvents: active ? "auto" : "none",\n          }}',
        code
    )

    with open(file, 'w') as f:
        f.write(code)

