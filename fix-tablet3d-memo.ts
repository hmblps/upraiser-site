import fs from "fs";
let code = fs.readFileSync("src/components/channel-visuals/Tablet3D.tsx", "utf-8");

const target = `  const { video, videoTex } = (() => {
    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    return { video: v, videoTex: t };
  })();`;

const replacement = `  const { video, videoTex } = useMemo(() => {
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
  }, [video, videoTex]);`;

code = code.replace(target, replacement);

if (!code.includes("useMemo")) {
  code = code.replace('import { Suspense, useCallback, useEffect, useRef, useState } from "react";', 'import { Suspense, useCallback, useEffect, useRef, useState, useMemo } from "react";');
}

fs.writeFileSync("src/components/channel-visuals/Tablet3D.tsx", code);
