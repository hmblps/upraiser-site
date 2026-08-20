import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { NightStars } from "./hero-terrain/NightStars";

export function AmbientModalBackground() {
  const [starsReady, setStarsReady] = useState(false);
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    // Delay mounting the heavy WebGL canvas until after the modal's 400ms opening animation finishes.
    // This prevents main-thread freezes from shader compilation that cause "two-step" stuttering.
    const timer = setTimeout(() => {
      setMountCanvas(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-bg" 
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="hidden dark:block absolute inset-0">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: starsReady ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {mountCanvas && typeof window !== "undefined" && (
            <React.Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 0], fov: 60 }} gl={{ alpha: true }} onCreated={() => setStarsReady(true)}>
                <NightStars />
              </Canvas>
            </React.Suspense>
          )}
        </motion.div>
      </div>
      
      {/* Ambient Mountains behind the modal (Light Theme only) */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
        {mountCanvas && (
          <video
            src="/hero/light-mountains-modal.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="block dark:hidden w-full h-full object-cover object-center opacity-[0.35] contrast-[0.7] brightness-[1.15] sepia-[0.1] hue-rotate-[200deg] blur-[1px]"
          />
        )}
      </div>
    </motion.div>
  );
}
