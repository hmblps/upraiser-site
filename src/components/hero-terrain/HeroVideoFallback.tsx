import { useEffect, useRef } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);

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
      
      // video is exactly 5.0 seconds
      videoRef.current.currentTime = progress * 4.96;
    });

    return unsub;
  }, [registerScrollListener]);

  const src = `/hero/${variant}-${theme}-scrub.mp4`;

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden">
      <video preload="auto"
        ref={videoRef}
        src={src}
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover"
        }}
      />
    </div>
  );
}
