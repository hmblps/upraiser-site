import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

/** Dev-only: POST PNG frames from /dev/hero-capture to captures/. */
export function heroCapturePlugin(): Plugin {
  return {
    name: "hero-capture",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__hero-capture", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }
        const url = new URL(req.url ?? "/", "http://localhost");
        const shot = (url.searchParams.get("shot") ?? "home").replace(/[^\w-]/g, "");
        const theme = (url.searchParams.get("theme") ?? "dark").replace(/[^\w-]/g, "");
        const i = (url.searchParams.get("i") ?? "0000").replace(/[^\d]/g, "").padStart(4, "0");
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        req.on("end", () => {
          const dir = join(process.cwd(), "captures", `${shot}-${theme}`);
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, `frame_${i}.png`), Buffer.concat(chunks));
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}
