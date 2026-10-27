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
  "wsj-oct-perf": {
    brand: "The Wall Street Journal",
    report: "October Performance (AF)",
    metric: "9,167 Installs · 8,369 App Opens · 1,982 Unique Purchases (21.6% CR)",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-appsflyer-oct.png",
    category: "US Geo Campaigns",
  },
  "wsj-oct-p360": {
    brand: "The Wall Street Journal",
    report: "October Protect360",
    metric: "6,349+ Clean Installs · ≤1% Fraud Rate",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360-oct.png",
    category: "US Geo Campaigns",
  },
  wsj: {
    brand: "The Wall Street Journal",
    report: "September Protect360",
    metric: "~14,000 Clean Installs · ≤1% Fraud Rate (0.13% on primary source)",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360.png",
    category: "US Geo Campaigns",
  },
  underdog: {
    brand: "Underdog Fantasy",
    report: "Partner Dashboard",
    metric: "184 FTDs · Up to $137 Avg FTD & $441 Sum Deposit",
    fileUrl: "https://upraiser.co.uk/snapshots/underdog-fantasy.png",
    category: "US Geo Campaigns",
  },
  "marketwatch-oct-perf": {
    brand: "MarketWatch",
    report: "October Performance (AF)",
    metric: "964 Installs · 906 Roadblock Served · 138 Unique Purchases (14.3% CR)",
    fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-appsflyer-oct.png",
    category: "US Geo Campaigns",
  },
  marketwatch: {
    brand: "MarketWatch",
    report: "September Protect360",
    metric: "3,120 Clean Installs · 0.00% Fraud Rate across September 2026",
    fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-protect360.png",
    category: "US Geo Campaigns",
  },
  barrons: {
    brand: "Barron’s (Dow Jones)",
    report: "Protect360 Report",
    metric: "4,909 Clean Installs · 0.00% Fraud Rate (only 4 blocked attributions)",
    fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png?v=2",
    category: "US Geo Campaigns",
  },
  fetch: {
    brand: "Fetch Rewards",
    report: "AppsFlyer Performance",
    metric: "6,815 Non-Organic Installs · 8.88% Install-to-Sign-Up CR",
    fileUrl: "https://upraiser.co.uk/snapshots/fetch-appsflyer.png",
    category: "US Geo Campaigns",
  },
  vantage: {
    brand: "Vantage Trading",
    report: "Partner Dashboard",
    metric: "87.5% QFTD Conversion (133 QFTDs) · $122,500 Commission",
    fileUrl: "https://upraiser.co.uk/snapshots/vantage-trading.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  "credcol-funnel": {
    brand: "Credcol (Fintech)",
    report: "AppsFlyer Funnel",
    metric: "13,015 Installs · 1,953 D1 Sign-ups · 1,777 Funnel Steps",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-funnel.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  "credcol-audit": {
    brand: "Credcol (Fintech)",
    report: "Protect360 Audit",
    metric: "12,609 Verified Attributions · 0.00% Fraud Rate",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-protect360.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  autodoc: {
    brand: "Autodoc",
    report: "AppsFlyer Performance (Aug '26)",
    metric: "28.77% D1 Retention · 55,486 Content Views · 2,229 Add-to-Carts · 121 Purchases",
    fileUrl: "https://upraiser.co.uk/snapshots/autodoc-appsflyer.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  zip: {
    brand: "Full Snapshot Archive (.zip)",
    report: "All 12 Raw Performance Dashboards",
    metric: "22 MB uncompressed ZIP bundle",
    fileUrl: "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip?v=3",
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

function getShortDeviceIconLabel(deviceLabel: string): string {
  const fam = getHardwareFamily(deviceLabel);
  if (fam === "iPhone") return "📱 iPhone";
  if (fam === "iPad") return "📱 iPad";
  if (fam === "Android") return "📱 Android";
  if (fam === "Mac") return "💻 Mac";
  if (fam === "Windows") return "💻 Windows";
  return "💻 Desktop";
}

function formatTimeHHMM(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Bucharest",
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

const OWNER_IPS = new Set(["82.137.32.198"]);

function extractClientIp(headers: Record<string, any>): string {
  const xff = headers["x-forwarded-for"];
  if (xff) {
    const raw = Array.isArray(xff) ? xff[0] : String(xff);
    return raw.split(",")[0].trim();
  }
  const realIp = headers["x-real-ip"];
  return realIp ? String(realIp).trim() : "";
}

function isPrefetchRequest(headers: Record<string, any>): boolean {
  const secPurpose = String(headers["sec-purpose"] || headers["purpose"] || headers["x-purpose"] || "").toLowerCase();
  const moz = String(headers["x-moz"] || "").toLowerCase();
  return secPurpose.includes("prefetch") || secPurpose.includes("preview") || moz.includes("prefetch");
}

function isOwnerProofRequest(headers: Record<string, any>, lead: string): boolean {
  const cookieHeader = String(headers["cookie"] || "");
  if (/(?:^|;\s*)upraiser_owner=1(?:;|$)/.test(cookieHeader)) return true;
  const ip = extractClientIp(headers);
  if (ip && OWNER_IPS.has(ip)) return true;
  const cleanLead = (lead || "").trim().toLowerCase();
  if (cleanLead.endsWith("@upraiser.co.uk")) return true;
  return false;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", "https://upraiser.co.uk");
  const ownerParam = url.searchParams.get("owner") || url.searchParams.get("me");

  // Explicit 1-tap owner activation/deactivation URL: https://upraiser.co.uk/api/proof?owner=1
  if (ownerParam === "1" || ownerParam === "0") {
    const enable = ownerParam === "1";
    res.setHeader(
      "Set-Cookie",
      enable
        ? "upraiser_owner=1; Path=/; Max-Age=315360000; SameSite=Lax"
        : "upraiser_owner=0; Path=/; Max-Age=0; SameSite=Lax"
    );
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner Filter</title></head><body style="font-family:-apple-system,sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100dvh;margin:0;padding:24px;text-align:center;"><div style="max-width:420px;background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px;"><div style="font-size:36px;margin-bottom:12px;">${
        enable ? "🛡️" : "🔔"
      }</div><h2 style="margin:0 0 10px 0;font-size:18px;">${
        enable ? "Устройство владельца привязано" : "Фильтр владельца отключён"
      }</h2><p style="margin:0;font-size:14px;line-height:1.5;color:#94a3b8;">${
        enable
          ? "Ваши собственные открытия /connect, /deck и клики по ссылкам из писем с этого браузера больше не отправляют пуши в Telegram (в том числе в роуминге и с любого Wi-Fi в Тель-Авиве)."
          : "Уведомления с этого устройства снова включены для теста."
      }</p></div></body></html>`
    );
  }

  const appId = (url.searchParams.get("app") || url.searchParams.get("id") || "").toLowerCase().trim();
  const lead = (url.searchParams.get("lead") || url.searchParams.get("email") || "").trim();

  const proof = PROOFS[appId] || {
    brand: "Performance Portfolio",
    report: "Raw Snapshots",
    metric: "12 Dashboards",
    fileUrl: "https://upraiser.co.uk/connect",
    category: "General",
  };

  // Skip logging/Telegram if this is a browser background prefetch OR Alex's own device/IP
  const ownerDetected = isOwnerProofRequest(req.headers, lead);
  if (ownerDetected) {
    res.setHeader(
      "Set-Cookie",
      "upraiser_owner=1; Path=/; Max-Age=315360000; SameSite=Lax"
    );
  }
  if (ownerDetected || isPrefetchRequest(req.headers)) {
    res.writeHead(302, {
      Location: proof.fileUrl,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    return res.end();
  }

  const geo = parseGeo(req.headers);
  const ua = (req.headers["user-agent"] as string) || "";
  const device = parseDevice(ua);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // Forwarding Detection & Proof Session Cooldown Lookup in Supabase (newest submission first!)
  let resolvedName = "";
  let prevGeo = "";
  let prevDevice = "";
  let isForwardedSuspect = false;
  let isSameCityScreenSwitch = false;
  let linkedVisitorId = "";
  let cooldownKey = lead ? `email_${lead.toLowerCase()}` : "email_anon";
  let existingCooldownMeta: Record<string, any> = {};

  if (supabase && lead) {
    try {
      // Fetch cooldown state first (holds the latest displayName and lead_card_message_id)
      const { data: cdByEmail } = await supabase
        .from("lead_notification_cooldowns")
        .select("metadata")
        .eq("visitor_id", cooldownKey)
        .maybeSingle();

      if (cdByEmail?.metadata && typeof cdByEmail.metadata === "object") {
        existingCooldownMeta = cdByEmail.metadata;
        if (existingCooldownMeta.displayName) {
          resolvedName = String(existingCooldownMeta.displayName);
        }
        if (existingCooldownMeta.lastGeo) {
          prevGeo = String(existingCooldownMeta.lastGeo);
        }
        if (existingCooldownMeta.lastDevice) {
          prevDevice = String(existingCooldownMeta.lastDevice);
        }
      }

      // Query lead_activity_logs ordered DESCENDING (most recent submission first)
      const { data: priorRows } = await supabase
        .from("lead_activity_logs")
        .select("visitor_id, lead_name, lead_contact, event_type, metadata, created_at")
        .ilike("lead_contact", lead)
        .order("created_at", { ascending: false })
        .limit(10);

      if (priorRows && priorRows.length > 0) {
        for (const row of priorRows) {
          if (!linkedVisitorId && row.visitor_id && row.visitor_id.startsWith("hub_")) {
            linkedVisitorId = String(row.visitor_id);
          }
          if (!resolvedName && row.lead_name && row.lead_name !== lead) {
            resolvedName = String(row.lead_name);
          }
          if (row.event_type === "form_submit") {
            if (!prevGeo && row.metadata?.geo) prevGeo = String(row.metadata.geo);
            if (!prevDevice && row.metadata?.device) prevDevice = String(row.metadata.device);
          }
        }
      }

      if (!Object.keys(existingCooldownMeta).length && linkedVisitorId) {
        const { data: cdByVisitor } = await supabase
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", linkedVisitorId)
          .maybeSingle();
        if (cdByVisitor?.metadata && typeof cdByVisitor.metadata === "object") {
          existingCooldownMeta = cdByVisitor.metadata;
          if (!resolvedName && existingCooldownMeta.displayName) {
            resolvedName = String(existingCooldownMeta.displayName);
          }
        }
      }

      if (prevGeo || prevDevice) {
        const geoChanged =
          Boolean(prevGeo && geo) &&
          prevGeo !== "Unknown Location" &&
          geo !== "Unknown Location" &&
          prevGeo.toLowerCase() !== geo.toLowerCase();

        const prevFam = prevDevice ? getHardwareFamily(prevDevice) : "";
        const currFam = device ? getHardwareFamily(device) : "";
        const deviceChanged = Boolean(prevFam && currFam && prevFam !== currFam);
        const isDifferentMobileOs =
          (prevFam === "iPhone" && currFam === "Android") ||
          (prevFam === "Android" && currFam === "iPhone");

        if (geoChanged || isDifferentMobileOs) {
          isForwardedSuspect = true;
        } else if (deviceChanged) {
          isSameCityScreenSwitch = true;
        }
      }
    } catch (lookupErr) {
      console.warn("Forwarding lookup warning in proof handler:", lookupErr);
    }
  }

  // Send or Edit Telegram Proof Alert (1 compact consolidated message per 15-min window + Reply to Lead Card)
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

      const prevProofUpdatedAt = existingCooldownMeta?.proof_updated_at
        ? new Date(existingCooldownMeta.proof_updated_at).getTime()
        : 0;
      const activeProofMessageId: number | null =
        existingCooldownMeta?.proof_message_id &&
        Date.now() - prevProofUpdatedAt < 15 * 60 * 1000
          ? Number(existingCooldownMeta.proof_message_id)
          : null;

      interface ProofHistoryItem {
        appId: string;
        brand: string;
        report: string;
        fileUrl: string;
        category: string;
        time: string;
        count: number;
      }

      let proofHistory: ProofHistoryItem[] =
        activeProofMessageId && Array.isArray(existingCooldownMeta?.proof_history)
          ? [...existingCooldownMeta.proof_history]
          : [];

      const nowHHMM = formatTimeHHMM(new Date());
      const existingIdx = proofHistory.findIndex((p) => p.appId === appId);

      if (existingIdx >= 0) {
        const existingItem = proofHistory[existingIdx];
        proofHistory[existingIdx] = {
          ...existingItem,
          fileUrl: proof.fileUrl,
          category: proof.category,
          time: nowHHMM,
          count: (existingItem.count || 1) + 1,
        };
      } else {
        proofHistory.push({
          appId,
          brand: proof.brand,
          report: proof.report,
          fileUrl: proof.fileUrl,
          category: proof.category,
          time: nowHHMM,
          count: 1,
        });
      }

      // Single clean device line (no triple repetition)
      const shortPrevDev = prevDevice ? getShortDeviceIconLabel(prevDevice) : "";
      const deviceLine = isSameCityScreenSwitch
        ? `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)} <i>(перешел с ${escapeHtml(shortPrevDev)})</i>`
        : `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`;

      const forwardingLine = isForwardedSuspect
        ? `🔥 <b>Возможно, переслал коллеге!</b> <i>(заявка была: ${escapeHtml(prevGeo || "—")} · ${escapeHtml(shortPrevDev || prevDevice || "—")})</i>`
        : null;

      // Summarize vertical interest when 2+ proofs opened
      let focusLine: string | null = null;
      if (proofHistory.length >= 2) {
        const catCounts: Record<string, number> = {};
        for (const item of proofHistory) {
          const cat = item.category || "General";
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        }
        const summaryParts = Object.entries(catCounts).map(([c, n]) => `${c} (${n})`);
        focusLine = `🎯 <b>Фокус:</b> ${escapeHtml(summaryParts.join(" · "))}`;
      }

      const historyLines = proofHistory
        .map((item, idx) => {
          const isCurrent = item.appId === appId;
          const countTag = item.count > 1 ? ` <b>(×${item.count})</b>` : "";
          const currentTag = isCurrent && proofHistory.length > 1 ? ` 👈 <i>сейчас тут</i>` : "";
          const timePrefix = item.time ? `${escapeHtml(item.time)} — ` : "";
          const urlHref = item.fileUrl || proof.fileUrl;
          return `${idx + 1}. ${timePrefix}<a href="${escapeHtml(urlHref)}"><b>${escapeHtml(item.brand)}</b></a> · ${escapeHtml(item.report)}${countTag}${currentTag}`;
        })
        .join("\n");

      const headerTitle =
        proofHistory.length <= 1
          ? `🔎 <b>ОТКРЫТ ПРУФ ИЗ ПИСЬМА · 1 из 12</b>`
          : `🔎 <b>ИЗУЧАЕТ ПРУФЫ ИЗ ПИСЬМА · ${proofHistory.length} из 12</b>`;

      const tgText = [
        headerTitle,
        ``,
        `👤 <b>Лид:</b> ${leadLabel}`,
        deviceLine,
        forwardingLine,
        focusLine,
        ``,
        `📋 <b>Открытые скриншоты:</b>`,
        historyLines,
      ]
        .filter((line) => line !== null)
        .join("\n");

      let editedInPlace = false;
      let finalProofMessageId: number | null = activeProofMessageId;
      const leadCardMessageId: number | null = existingCooldownMeta?.lead_card_message_id
        ? Number(existingCooldownMeta.lead_card_message_id)
        : null;

      if (activeProofMessageId) {
        const editRes = await fetch(`https://api.telegram.org/bot${tgToken}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            message_id: activeProofMessageId,
            text: tgText,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });
        const editJson: any = await editRes.json().catch(() => ({}));
        if (editRes.ok || String(editJson?.description || "").includes("message is not modified")) {
          editedInPlace = true;
        }
      }

      if (!editedInPlace) {
        const sendPayload: Record<string, any> = {
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_notification: false, // Loud push with vibration on 1st proof open!
          disable_web_page_preview: true,
        };

        // Reply directly to the lead's contact card in Telegram!
        if (leadCardMessageId) {
          sendPayload.reply_parameters = {
            message_id: leadCardMessageId,
            allow_sending_without_reply: true,
          };
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendPayload),
        });
        const tgJson: any = await tgRes.json().catch(() => ({}));
        if (tgJson?.result?.message_id) {
          finalProofMessageId = Number(tgJson.result.message_id);
        }
      }

      if (supabase && finalProofMessageId && lead) {
        const updatedMeta = {
          ...existingCooldownMeta,
          ...(resolvedName ? { displayName: resolvedName } : {}),
          leadContact: lead,
          proof_message_id: finalProofMessageId,
          proof_updated_at: new Date().toISOString(),
          proof_history: proofHistory,
        };

        await supabase.from("lead_notification_cooldowns").upsert(
          {
            visitor_id: cooldownKey,
            last_notified_at: new Date().toISOString(),
            last_event_type: "proof_click",
            metadata: updatedMeta,
          },
          { onConflict: "visitor_id" }
        );
      }
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
