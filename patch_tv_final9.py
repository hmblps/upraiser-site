with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    lines = f.readlines()

out = []
in_block = False
for line in lines:
    if "if (!showScreen || !stillSrc) {" in line:
        in_block = True
        # remove the previous useEffect line too
        out.pop()
        continue
    if in_block:
        if "}, [showScreen, stillSrc, video, videoTex]);" in line:
            in_block = False
            out.append("""  useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    modeRef.current = "still";
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);\n""")
        continue
    out.append(line)

with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
    f.writelines(out)
print("Done")
