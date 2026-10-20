#!/usr/bin/env node

/**
 * Supabase Keep-Alive Healthcheck
 * Resets the 7-day inactivity timer on Supabase Free Tier by executing
 * a lightweight query against Postgres and checking Storage status.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://zlyxwhrpmyyhsplczedu.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY.");
  process.exit(1);
}

async function keepAlive() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] 🔄 Pinging Supabase at ${SUPABASE_URL}...`);

  try {
    // 1. Query Postgres via PostgREST to register active database query traffic
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const dbDuration = Date.now() - startTime;

    if (!dbRes.ok) {
      const errText = await dbRes.text().catch(() => "");
      console.warn(`⚠️ Database query returned ${dbRes.status}: ${errText}`);
    } else {
      console.log(`✅ Postgres active: 200 OK (${dbDuration}ms)`);
    }

    // 2. Query Storage to verify temp-briefs bucket status
    const storageRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (storageRes.ok) {
      const buckets = await storageRes.json().catch(() => []);
      const hasTempBriefs = buckets.some((b) => b.name === "temp-briefs");
      console.log(`✅ Storage active: Found ${buckets.length} buckets (temp-briefs: ${hasTempBriefs ? "ready" : "missing"})`);
    }

    const totalDuration = Date.now() - startTime;
    console.log(`✨ Supabase keep-alive successful. Inactivity timer reset. Total time: ${totalDuration}ms`);
  } catch (err) {
    console.error("❌ Keep-alive failed:", err);
    process.exit(1);
  }
}

keepAlive();
