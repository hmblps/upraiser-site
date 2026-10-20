import type { Plugin } from "vite";

/**
 * Dev-only middleware to execute Vercel Serverless Function `/api/contact`
 * during local `vite` development without requiring `vercel dev`.
 */
export function apiContactPlugin(): Plugin {
  return {
    name: "api-contact",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/contact.ts");
          if (typeof mod.default === "function") {
            await mod.default(req, res);
          } else {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Handler not found in /api/contact.ts" }));
          }
        } catch (err: any) {
          console.error("[apiContactPlugin] Error executing /api/contact:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: err?.message || "Local API handler failed" }));
        }
      });
    },
  };
}
