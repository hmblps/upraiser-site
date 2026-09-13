import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

# Add a console log to markMeshReady
old_mark = "  const markMeshReady = useCallback(() => setMeshReady(true), []);"
new_mark = '  const markMeshReady = useCallback(() => { console.log("[Tv3D] markMeshReady called!"); setMeshReady(true); }, []);'

code = code.replace(old_mark, new_mark)

# Add a console log to TvMesh render
old_mesh_start = "function TvMesh({"
new_mesh_start = """function TvMesh({"""
# wait, better to just log when TvMesh runs useLayoutEffect
old_layout = """  useLayoutEffect(() => {
    scene.traverse((obj) => {"""
new_layout = """  useLayoutEffect(() => {
    console.log("[TvMesh] useLayoutEffect ran (mesh loaded)!");
    scene.traverse((obj) => {"""
code = code.replace(old_layout, new_layout)

# Add log for slotBox
old_check = """      if (width >= 64 && height >= 64) {
        setSlotBox({ w: Math.round(width), h: Math.round(height) });
      }"""
new_check = """      if (width >= 64 && height >= 64) {
        console.log("[Tv3D] setSlotBox called:", width, height);
        setSlotBox({ w: Math.round(width), h: Math.round(height) });
      } else {
        console.log("[Tv3D] slotBox failed check:", width, height);
      }"""
code = code.replace(old_check, new_check)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)
