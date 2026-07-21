import { motion } from "framer-motion";

export function BackgroundGlow({ color = "orange" }: { color?: string }) {
  // Use a map to handle the dynamic class generation for Tailwind
  const bgClass = color === "orange" ? "bg-orange-500" : "bg-blue-500";
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1], 
          opacity: [0.03, 0.08, 0.03] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] ${bgClass}`} 
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1], 
          opacity: [0.02, 0.05, 0.02] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full blur-[160px] ${bgClass}`} 
      />
    </div>
  );
}
