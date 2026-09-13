import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace("<DeviceLoadStage ready={meshReady}>", "<DeviceLoadStage ready={meshReady} placeholder={null} instant>")

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

