import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) return "framer-motion";
          if (id.includes("node_modules/lenis")) return "lenis";
          if (id.includes("node_modules/recharts")) return "recharts";
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
            return "three";
          }
        },
      },
    },
  },
});
