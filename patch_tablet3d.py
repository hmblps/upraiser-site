import re

filepath = "src/components/channel-visuals/Tablet3D.tsx"
with open(filepath, "r") as f:
    code = f.read()

code = re.sub(
    r'<DeviceLoadStage[^>]*>',
    r'<div className="test-bypass" style={{width: "100%", height: "100%"}}>',
    code,
    flags=re.DOTALL
)
code = code.replace("</DeviceLoadStage>", "</div>")

with open(filepath, "w") as f:
    f.write(code)
