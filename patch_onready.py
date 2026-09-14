import re

def patch_file(filepath):
    with open(filepath, "r") as f:
        code = f.read()

    # Find the useLayoutEffect block that checks screenMap
    pattern = r'(useLayoutEffect\(\(\) => \{.*?if \(screenMap\) \{.*?onReady\?\.\(\);\s*\}\s*\}, \[scene, onReady, screenMap\]\);)'
    
    # Replace it with one that calls onReady unconditionally
    replacement = """useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) obj.visible = false;
    });
    onReady?.();
  }, [scene, onReady]);"""

    code = re.sub(pattern, replacement, code, flags=re.DOTALL)
    
    with open(filepath, "w") as f:
        f.write(code)

patch_file("src/components/channel-visuals/Tv3D.tsx")
patch_file("src/components/channel-visuals/Tablet3D.tsx")
