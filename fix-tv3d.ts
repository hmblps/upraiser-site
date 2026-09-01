import fs from "fs";

let code = fs.readFileSync("src/components/channel-visuals/Tv3D.tsx", "utf-8");

// Add proper disposal of VideoTexture on unmount
code = code.replace(
  '  const { video, videoTex } = useMemo(() => {',
  `  const { video, videoTex } = useMemo(() => {`
);
code = code.replace(
  '    return { video: v, videoTex: tex };\n  }, []);',
  `    return { video: v, videoTex: tex };
  }, []);

  // GC: Clean up video texture on unmount
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

// Add proper disposal of old still textures
code = code.replace(
  '      setScreenMap(tex);\n    });\n    return () => {\n      cancelled = true;\n    };',
  `      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return tex;
      });
    });
    return () => {
      cancelled = true;
    };`
);

code = code.replace(
  '      setScreenMap(videoTex);',
  `      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });`
);

fs.writeFileSync("src/components/channel-visuals/Tv3D.tsx", code);
