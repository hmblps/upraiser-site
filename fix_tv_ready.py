import re
with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

target = r'''  useEffect\(\(\) => \{
    scene\.traverse\(\(obj\) => \{
      if \(HIDDEN_NODE_NAMES\.has\(obj\.name\)\) obj\.visible = false;
    \}\);
    let id2 = 0;
    const id1 = requestAnimationFrame\(\(\) => \{
      id2 = requestAnimationFrame\(\(\) => onReady\?\.\(\)\);
    \}\);
    return \(\) => \{
      cancelAnimationFrame\(id1\);
      cancelAnimationFrame\(id2\);
    \};
  \}, \[scene, onReady\]\);'''

replacement = r'''  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) obj.visible = false;
    });
    onReady?.();
  }, [scene, onReady]);'''

code = re.sub(target, replacement, code)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

