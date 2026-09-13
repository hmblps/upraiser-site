import re

with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

# Update dimensions
code = re.sub(
    r"w: 3\.64 \* ratio,\n\s*h: 2\.06 \* ratio,\n\s*x: 0,\n\s*y: 0\.02 \* ratio,\n\s*z: 0\.088 \* ratio,",
    "w: 3.59 * ratio,\n    h: 2.02 * ratio,\n    x: 0.010 * ratio,\n    y: 0.035 * ratio,\n    z: 0.090 * ratio,",
    code
)

# Insert useEffect black paint hook right after `const { scene } = useGLTF("/models/tv-draco.glb");` or inside `TvMesh` component.
# TvMesh has:
# function TvMesh({ rotX, rotY, scene, screenMap, flat, mode, formatId, onJump }: any) {
# Let's insert it inside TvMesh.
# Let's find: `const outerRef = useRef<Group>(null);` inside `TvMesh` and insert below it.
hook = """  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const matName = child.material.name?.toLowerCase() || "";
        if (matName.includes("screen") || matName.includes("display") || matName.includes("glass")) {
          child.material.color.set("#000000");
          child.material.emissive.set("#000000");
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
"""

code = code.replace("const outerRef = useRef<Group>(null);", "const outerRef = useRef<Group>(null);\n" + hook)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.write(code)

