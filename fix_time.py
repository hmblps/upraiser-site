import re
import os

files = [
    "src/components/solutions/Phone3D.tsx",
    "src/components/channel-visuals/Tablet3D.tsx",
    "src/components/channel-visuals/Tv3D.tsx"
]

for filepath in files:
    with open(filepath, "r") as f:
        code = f.read()
    
    # Phone3D uses state.clock.elapsedTime
    code = code.replace("const t = state.clock.elapsedTime;", "const t = performance.now() / 1000;")
    # Tv3D uses clock.getElapsedTime()
    code = code.replace("const t = clock.getElapsedTime();", "const t = performance.now() / 1000;")
    
    with open(filepath, "w") as f:
        f.write(code)

