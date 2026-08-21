import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    host: true,
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  build: {
    modulePreload: {
      resolveDependencies(filename, deps) {
        // Never preload 3D / chart vendors from the entry HTML — they ride with lazy owners.
        if (filename.includes("index")) {
          return deps.filter(
            (dep) => !/(?:three|recharts|HeroTerrain|ModeChart|FoldArea|Everest)/i.test(dep),
          );
        }
        return deps;
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js + R3F ecosystem → dedicated chunk (loaded lazily by 3D components).
          if (id.includes("node_modules/three")) return "vendor-three";
          if (id.includes("node_modules/@react-three")) return "vendor-r3f";
          // Motion + scroll → separate chunks so pages without animation don't pay the cost.
          if (id.includes("node_modules/framer-motion")) return "vendor-motion";
          if (id.includes("node_modules/lenis")) return "vendor-lenis";
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
});
