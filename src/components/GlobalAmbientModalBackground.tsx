import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { NightStars } from "./hero-terrain/NightStars";
import { useModalBackground } from "../lib/modalBackgroundState";

export function GlobalAmbientModalBackground() {
  const isOpen = useModalBackground((s) => s.isOpen);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isOpen) {
      videoRef.current.play().catch(() => {});
    } else {
      setTimeout(() => {
        if (videoRef.current) videoRef.current.pause();
      }, 400); // Wait for fade out
    }
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div 
      className="fixed inset-0 pointer-events-none overflow-hidden bg-bg" 
      aria-hidden="true"
      style={{ zIndex: 990 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Dark Theme: NightStars Canvas */}
      <div className="hidden dark:block absolute inset-0">
        <React.Suspense fallback={null}>
          <Canvas frameloop={isOpen ? "always" : "demand"} camera={{ position: [0, 0, 0], fov: 60 }} gl={{ alpha: true }} style={{ pointerEvents: "none" }}>
            <NightStars />
          </Canvas>
        </React.Suspense>
      </div>
      
      {/* Light Theme: Clean Mountain Video with filters */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden bg-[#eaf1ff] dark:bg-transparent">
        <video
          ref={videoRef}
          src="/hero/light-mountains-loop.mp4"
          loop
          muted
          playsInline
          preload="auto"
          className="block dark:hidden w-full h-full object-cover object-center opacity-[0.75] contrast-[0.85] brightness-[1.05] sepia-[0.05] hue-rotate-[200deg]"
        />
      </div>
    </motion.div>,
    document.body
  );
}
