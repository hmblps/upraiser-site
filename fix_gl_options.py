import os
import re

files = [
    "src/components/channel-visuals/Tv3D.tsx",
    "src/components/channel-visuals/Tablet3D.tsx",
    "src/components/solutions/Phone3D.tsx"
]

for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, "r") as f:
        code = f.read()
    
    # We want to add gl={{ antialias: false, powerPreference: "high-performance" }} to <Canvas
    # Find <Canvas className="..."
    
    # We replace <Canvas with <Canvas gl={{ antialias: false, powerPreference: "high-performance" }}
    if 'gl={{' not in code:
        code = code.replace('<Canvas', '<Canvas gl={{ antialias: false, powerPreference: "high-performance" }}')
    
    with open(filepath, "w") as f:
        f.write(code)

