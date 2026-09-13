with open('src/components/channel-visuals/Tv3D.tsx', 'r') as f:
    code = f.read()

start_idx = code.find("  useEffect(() => {\n    if (!showScreen || !stillSrc)")
end_idx = code.find("  }, [showScreen, stillSrc, video, videoTex]);") + len("  }, [showScreen, stillSrc, video, videoTex]);")

if start_idx != -1 and end_idx != -1:
    old_block = code[start_idx:end_idx]
    new_block = """  useEffect(() => {
    if (!showScreen || !stillTex) return;
    if (modeRef.current === "video") return;
    
    stillTex.colorSpace = SRGBColorSpace;
    stillTex.minFilter = LinearFilter;
    stillTex.magFilter = LinearFilter;
    stillTex.flipY = true;
    stillTex.needsUpdate = true;
    modeRef.current = "still";
    setScreenMap(stillTex);
  }, [showScreen, stillTex]);"""
    code = code[:start_idx] + new_block + code[end_idx:]
    with open('src/components/channel-visuals/Tv3D.tsx', 'w') as f:
        f.write(code)
    print("Replaced!")
else:
    print("Not found", start_idx, end_idx)
