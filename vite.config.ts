import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
          // Only split leaf UI libs. Do NOT force three/recharts — that pulled shared
          // runtime into those chunks and made the entry statically import ~1.3MB.
          if (id.includes("node_modules/framer-motion")) return "framer-motion";
          if (id.includes("node_modules/lenis")) return "lenis";
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
});
