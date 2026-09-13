import os
import re

files = [
    "src/components/channel-visuals/Tv3D.tsx",
    "src/components/channel-visuals/Tablet3D.tsx",
    "src/components/channel-visuals/Phone3D.tsx"
]

warmup_renderer_pattern = r'function WarmupRenderer\(\{ meshReady \}: \{ meshReady: boolean \}\) \{[\s\S]+?return null;\n\}'

new_warmup_renderer = """function WarmupRenderer({ meshReady }: { meshReady: boolean }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (meshReady) {
      const warmup = async () => {
        const restored: any[] = [];
        scene.traverse((o: any) => {
          if (!o.isMesh && !o.isSkinnedMesh) return;
          restored.push([o, o.visible, o.frustumCulled]);
          o.visible = true;
          o.frustumCulled = false;
        });

        if (typeof gl.compileAsync === "function") {
          try {
            await gl.compileAsync(scene, camera, scene);
          } catch (e) {}
        } else {
          gl.compile(scene, camera);
        }
        
        // Force upload of geometries, VAOs, and textures
        gl.render(scene, camera);

        for (const [o, v, f] of restored) {
          o.visible = v;
          o.frustumCulled = f;
        }
      };
      
      void warmup();
    }
  }, [meshReady, gl, scene, camera]);
  return null;
}"""

for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, "r") as f:
        code = f.read()
    
    code = re.sub(warmup_renderer_pattern, new_warmup_renderer, code)
    
    # Also change frameloop
    code = re.sub(r'frameloop=\{reduced \? "never" : active \? "always" : "demand"\}', 'frameloop={active ? "always" : "never"}', code)
    
    with open(filepath, "w") as f:
        f.write(code)

