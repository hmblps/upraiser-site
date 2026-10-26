/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const PROOFS: Record<
  string,
  {
    brand: string;
    report: string;
    metric: string;
    fileUrl: string;
    category: string;
  }
> = {
  wsj: {
    brand: "The Wall Street Journal",
    report: "Protect360 Report",
    metric: "~14,000 Clean Installs · ≤1% Fraud Rate (0.13% primary source)",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360.png",
    category: "Tier-1 Media",
  },
  barrons: {
    brand: "Barron’s (Dow Jones)",
    report: "Protect360 Report",
    metric: "4,909 Clean Installs · 0.00% Fraud Rate (only 4 blocked attributions)",
    fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png",
    category: "Tier-1 Media",
  },
  marketwatch: {
    brand: "MarketWatch",
    report: "Protect360 Report",
    metric: "3,120 Clean Installs · 0.00% Fraud Rate across September 2026",
    fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-protect360.png",
    category: "Tier-1 Media",
  },
  fetch: {
    brand: "Fetch Rewards",
    report: "AppsFlyer Performance",
    metric: "6,815 Non-Organic Installs · 8.88% Install-to-Sign-Up CR",
    fileUrl: "https://upraiser.co.uk/snapshots/fetch-appsflyer.png",
    category: "Consumer Apps",
  },
  vantage: {
    brand: "Vantage Trading",
    report: "Partner Dashboard",
    metric: "87.5% QFTD Conversion (133 QFTDs) · $122,500 Commission",
    fileUrl: "https://upraiser.co.uk/snapshots/vantage-trading.png",
    category: "Fintech & Trading",
  },
  underdog: {
    brand: "Underdog Fantasy",
    report: "Partner Dashboard",
    metric: "184 FTDs · Up to $137 Avg FTD & $441 Sum Deposit",
    fileUrl: "https://upraiser.co.uk/snapshots/underdog-fantasy.png",
    category: "Fantasy Sports",
  },
  "credcol-funnel": {
    brand: "Credcol (Fintech)",
    report: "AppsFlyer Funnel",
    metric: "13,015 Installs · 1,953 D1 Sign-ups · 1,777 Funnel Steps",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-funnel.png",
    category: "Fintech & Credit",
  },
  "credcol-audit": {
    brand: "Credcol (Fintech)",
    report: "Protect360 Audit",
    metric: "12,609 Verified Attributions · 0.00% Fraud Rate",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-protect360.png",
    category: "Fintech & Credit",
  },
  zip: {
    brand: "Full Snapshot Archive (.zip)",
    report: "All 8 Raw Performance Dashboards",
    metric: "15 MB uncompressed ZIP bundle",
    fileUrl: "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip",
    category: "Archive Bundle",
  },
  deck: {
    brand: "Media Deck (PDF)",
    report: "Traffic Infrastructure & OEM Preloads",
    metric: "20 Slides · Multilingual Blueprint",
    fileUrl: "https://upraiser.co.uk/Upraiser_Traffic_Infrastructure.pdf",
    category: "Media Deck",
  },
};

function parseGeo(headers: Record<string, any>): string {
  const rawCity = headers["x-vercel-ip-city"];
  const city = rawCity ? decodeURIComponent(Array.isArray(rawCity) ? rawCity[0] : String(rawCity)) : "";
  const country = headers["x-vercel-ip-country"]
    ? (Array.isArray(headers["x-vercel-ip-country"]) ? headers["x-vercel-ip-country"][0] : String(headers["x-vercel-ip-country"]))
    : "";
  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  if (city) return city;
  return "Unknown Location";
}

function parseDevice(ua: string): string {
  let device = "💻 Desktop";
  if (/iphone/i.test(ua)) device = "📱 iPhone";
  else if (/ipad/i.test(ua)) device = "📱 iPad";
  else if (/android/i.test(ua)) device = "📱 Android";
  else if (/macintosh|mac os x/i.test(ua)) device = "💻 Mac";
  else if (/windows/i.test(ua)) device = "💻 Windows";

  let client = "";
  const uaLower = ua.toLowerCase();
  if (/linkedinapp|linkedin/i.test(ua)) client = " (LinkedIn In-App)";
  else if (/telegram/i.test(ua)) client = " (Telegram In-App)";
  else if (/whatsapp/i.test(ua)) client = " (WhatsApp In-App)";
  else if (/instagram/i.test(ua)) client = " (Instagram In-App)";
  else if (/fbav|fban|facebook/i.test(ua)) client = " (Facebook In-App)";
  else if (/twitter|x\/|x android/i.test(ua)) client = " (X / Twitter In-App)";
  else if (/teams/i.test(ua)) client = " (Teams In-App)";
  else if (/slack/i.test(ua)) client = " (Slack In-App)";
  else if (/mail/i.test(uaLower)) client = " (Mail Client)";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(uaLower)) client = " (Safari)";
  else if (/chrome|crios/i.test(uaLower)) client = " (Chrome)";

  return `${device}${client}`;
}

function getHardwareFamily(deviceLabel: string): string {
  if (/iphone/i.test(deviceLabel)) return "iPhone";
  if (/ipad/i.test(deviceLabel)) return "iPad";
  if (/android/i.test(deviceLabel)) return "Android";
  if (/mac/i.test(deviceLabel)) return "Mac";
  if (/windows/i.test(deviceLabel)) return "Windows";
  return "Desktop";
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", "https://upraiser.co.uk");
  const appId = (url.searchParams.get("app") || url.searchParams.get("id") || "").toLowerCase().trim();
  const lead = (url.searchParams.get("lead") || url.searchParams.get("email") || "").trim();

  const proof = PROOFS[appId] || {
    brand: "Performance Portfolio",
    report: "Raw Snapshots",
    metric: "8 Dashboards",
    fileUrl: "https://upraiser.co.uk/connect",
    category: "General",
  };

  const geo = parseGeo(req.headers);
  const ua = (req.headers["user-agent"] as string) || "";
  const device = parseDevice(ua);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // Forwarding Detection: compare current (geo, device) against the lead's baseline session in Supabase
  let resolvedName = "";
  let prevGeo = "";
  let prevDevice = "";
  let isForwardedSuspect = false;

  if (supabase && lead) {
    try {
      const { data: priorRows } = await supabase
        .from("lead_activity_logs")
        .select("lead_name, lead_contact, event_type, metadata, created_at")
        .ilike("lead_contact", lead)
        .order("created_at", { ascending: true })
        .limit(10);

      if (priorRows && priorRows.length > 0) {
        for (const row of priorRows) {
          if (!resolvedName && row.lead_name && row.lead_name !== lead) {
            resolvedName = String(row.lead_name);
          }
          const mGeo = row.metadata?.geo;
          const mDev = row.metadata?.device;
          // Prefer the original form_submit baseline or first recorded session with valid geo/device
          if ((!prevGeo || row.event_type === "form_submit") && mGeo) {
            prevGeo = String(mGeo);
          }
          if ((!prevDevice || row.event_type === "form_submit") && mDev) {
            prevDevice = String(mDev);
          }
        }

        const geoChanged =
          Boolean(prevGeo && geo) &&
          prevGeo !== "Unknown Location" &&
          geo !== "Unknown Location" &&
          prevGeo.toLowerCase() !== geo.toLowerCase();

        const deviceChanged =
          Boolean(prevDevice && device) &&
          getHardwareFamily(prevDevice) !== getHardwareFamily(device);

        if (geoChanged || deviceChanged) {
          isForwardedSuspect = true;
        }
      }
    } catch (lookupErr) {
      console.warn("Forwarding lookup warning in proof handler:", lookupErr);
    }
  }

  // Send LOUD Telegram push (disable_notification: false)
  const tgToken =
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN ||
    "8955516402:AAFMgYQ5dJoS13RhOLrNkoPs3lplpaa4bxI";
  const tgChatId =
    process.env.VITE_TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    "-1003934317948";

  if (tgToken && tgChatId) {
    try {
      const leadLabel = lead
        ? resolvedName
          ? `<b>${escapeHtml(resolvedName)}</b> (${escapeHtml(lead)})`
          : `<b>${escapeHtml(lead)}</b>`
        : "Аноним (прямая ссылка)";

      const forwardingBanner = isForwardedSuspect
        ? `\n🔥 <b>Возможно, письмо переслали коллеге!</b>\n` +
          `└ <i>Новое устройство/гео: ${escapeHtml(geo)} · ${escapeHtml(device)} (ранее: ${escapeHtml(prevGeo || "—")} · ${escapeHtml(prevDevice || "—")})</i>\n`
        : "";

      const tgText =
        `🔎 <b>ОТКРЫТ ПРУФ ИЗ ПИСЬМА</b>\n\n` +
        `👤 <b>Лид:</b> ${leadLabel}\n` +
        `📊 <b>Кейс:</b> ${escapeHtml(proof.brand)} · ${escapeHtml(proof.report)}\n` +
        `📈 <b>Метрика:</b> ${escapeHtml(proof.metric)}\n` +
        `📍 <b>Локация и девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}` +
        forwardingBanner +
        `\n\n🔗 <a href="${escapeHtml(proof.fileUrl)}">Открыть оригинал пруфа ↗</a>`;

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_notification: false, // Loud push with vibration
          disable_web_page_preview: true,
        }),
      });
    } catch (tgErr) {
      console.warn("Telegram alert error in proof tracking:", tgErr);
    }
  }

  // Log to Supabase if configured
  if (supabase) {
    try {
      await supabase.from("lead_activity_logs").insert([
        {
          visitor_id: lead || "email_click",
          lead_name: resolvedName || lead || null,
          lead_contact: lead || null,
          event_type: "proof_click",
          duration_seconds: 0,
          metadata: {
            appId,
            brand: proof.brand,
            report: proof.report,
            geo,
            device,
            isForwardedSuspect,
            prevGeo: prevGeo || null,
            prevDevice: prevDevice || null,
            userAgent: ua,
            ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
          },
        },
      ]);
    } catch {}
  }

  // 302 Redirect directly to the asset
  res.writeHead(302, {
    Location: proof.fileUrl,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end();
}
