import { useEffect, useRef, useState } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const targetTime = useRef<number>(0);

  // Force a re-render to ensure the source changes fully
  const [videoSrc, setVideoSrc] = useState(`/hero/${variant}-${theme}-scrub.mp4`);
  
  useEffect(() => {
    setVideoSrc(`/hero/${variant}-${theme}-scrub.mp4`);
  }, [variant, theme]);

  // Kickstart iOS video engine and paint first frame
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onLoadedMetadata = () => {
      // Force decode of first frame
      vid.currentTime = targetTime.current;
    };
    
    vid.addEventListener("loadedmetadata", onLoadedMetadata);
    
    // Attempt to silently play/pause to ensure the hardware decoder wakes up
    vid.play().then(() => vid.pause()).catch(() => {});

    return () => {
      vid.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [videoSrc]);

  useEffect(() => {
    function getStage() {
      if (stageRef.current?.isConnected) return stageRef.current;
      return (
        (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
        (document.getElementById("hero") as HTMLElement | null)
      );
    }

    const unsub = registerScrollListener((scrollY) => {
      const stage = getStage();
      stageRef.current = stage;
      if (!stage || !videoRef.current) return;
      
      const top = stage.getBoundingClientRect().top + scrollY;
      const runway = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, (scrollY - top) / runway));
      
      targetTime.current = progress * 4.96;

      if (videoRef.current.readyState > 0) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = targetTime.current;
          }
        });
      }
    });

    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [registerScrollListener]);

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden">
      <video
        key={videoSrc} // Force fresh video element on theme change
        preload="auto"
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        autoPlay // Helps iOS wake up
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          transform: "translateZ(0)", // Hardware acceleration hint
        }}
      />
    </div>
  );
}
