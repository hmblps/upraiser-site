import re

def patch_file(filepath):
    with open(filepath, "r") as f:
        code = f.read()

    # Replace <DeviceLoadStage ... > with <div className="prog-device-load"><div className="prog-device-load__canvas" style={{zIndex: 1}}>
    code = re.sub(
        r'<DeviceLoadStage[^>]*>',
        r'<div className="prog-device-load"><div className="prog-device-load__canvas" style={{zIndex: 1}}>',
        code,
        flags=re.DOTALL
    )
    
    # Replace </DeviceLoadStage> with </div></div>
    code = code.replace("</DeviceLoadStage>", "</div></div>")
    
    with open(filepath, "w") as f:
        f.write(code)

patch_file("src/components/channel-visuals/Tv3D.tsx")
patch_file("src/components/channel-visuals/Tablet3D.tsx")
