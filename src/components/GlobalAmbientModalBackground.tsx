import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { NightStars } from "./hero-terrain/NightStars";
import { useModalBackground } from "../lib/modalBackgroundState";

export function GlobalAmbientModalBackground() {
  const isOpen = useModalBackground((s) => s.isOpen);

  if (typeof document === "undefined") return null;

  // We mount the WebGL Canvas once globally and keep it alive to prevent 
  // expensive shader compilation from blocking the main thread during animations.
  // We pause the frameloop when the modal is closed to save resources.
  return createPortal(
    <motion.div 
      className="fixed inset-0 pointer-events-none overflow-hidden bg-bg" 
      aria-hidden="true"
      style={{ zIndex: 990 }} // Sits perfectly below modals (1000) but above page
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="hidden dark:block absolute inset-0">
        <React.Suspense fallback={null}>
          <Canvas frameloop={isOpen ? "always" : "demand"} camera={{ position: [0, 0, 0], fov: 60 }} gl={{ alpha: true }}>
            <NightStars />
          </Canvas>
        </React.Suspense>
      </div>
      
      {/* Ambient Mountains behind the modal (Light Theme only) */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
        {isOpen && (
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
    </motion.div>,
    document.body
  );
}
