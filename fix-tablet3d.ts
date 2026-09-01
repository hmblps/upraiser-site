import fs from "fs";

let code = fs.readFileSync("src/components/channel-visuals/Tablet3D.tsx", "utf-8");

code = code.replace(
  '  const { video, videoTex } = (() => {\\n    const v = document.createElement("video");\\n    v.muted = true;\\n    v.loop = true;\\n    v.playsInline = true;\\n    v.setAttribute("playsinline", "");\\n    v.preload = "auto";\\n    const t = new VideoTexture(v);\\n    t.colorSpace = SRGBColorSpace;\\n    return { video: v, videoTex: t };\\n  })();',
  `  const { video, videoTex } = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    return { video: v, videoTex: t };
  }, []);

  useEffect(() => {
    return () => {
      videoTex.dispose();
      video.pause();
      video.src = "";
      video.removeAttribute("src");
      video.load();
    };
  }, [video, videoTex]);`
);

// We should also ensure TextureLoader cleans up old textures. Let's see if Tablet3D uses TextureLoader.
fs.writeFileSync("src/components/channel-visuals/Tablet3D.tsx", code);
