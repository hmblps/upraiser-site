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
    fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png?v=2",
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
    fileUrl: "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip?v=2",
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

  // Forwarding Detection & Proof Session Cooldown Lookup in Supabase
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
      const { data: priorRows } = await supabase
        .from("lead_activity_logs")
        .select("visitor_id, lead_name, lead_contact, event_type, metadata, created_at")
        .ilike("lead_contact", lead)
        .order("created_at", { ascending: true })
        .limit(10);

      if (priorRows && priorRows.length > 0) {
        for (const row of priorRows) {
          if (!linkedVisitorId && row.visitor_id && row.visitor_id.startsWith("hub_")) {
            linkedVisitorId = String(row.visitor_id);
          }
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

        const prevFam = prevDevice ? getHardwareFamily(prevDevice) : "";
        const currFam = device ? getHardwareFamily(device) : "";
        const deviceChanged = Boolean(prevFam && currFam && prevFam !== currFam);
        const isDifferentMobileOs =
          (prevFam === "iPhone" && currFam === "Android") ||
          (prevFam === "Android" && currFam === "iPhone");

        if (geoChanged || isDifferentMobileOs) {
          isForwardedSuspect = true;
        } else if (deviceChanged) {
          // Same city, switched between phone and laptop/tablet (e.g. iPhone -> Mac in Bucharest)
          isSameCityScreenSwitch = true;
        }
      }

      // Fetch cooldown state (by email key first, fallback to linkedVisitorId)
      const { data: cdByEmail } = await supabase
        .from("lead_notification_cooldowns")
        .select("metadata")
        .eq("visitor_id", cooldownKey)
        .maybeSingle();

      if (cdByEmail?.metadata && typeof cdByEmail.metadata === "object") {
        existingCooldownMeta = cdByEmail.metadata;
      } else if (linkedVisitorId) {
        const { data: cdByVisitor } = await supabase
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", linkedVisitorId)
          .maybeSingle();
        if (cdByVisitor?.metadata && typeof cdByVisitor.metadata === "object") {
          existingCooldownMeta = cdByVisitor.metadata;
        }
      }

      if (!resolvedName && existingCooldownMeta?.displayName) {
        resolvedName = String(existingCooldownMeta.displayName);
      }
    } catch (lookupErr) {
      console.warn("Forwarding lookup warning in proof handler:", lookupErr);
    }
  }

  // Send or Edit Telegram Proof Alert (1 consolidated message per 15-min window + Reply to Lead Card)
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
        metric: string;
      }

      let proofHistory: ProofHistoryItem[] =
        activeProofMessageId && Array.isArray(existingCooldownMeta?.proof_history)
          ? [...existingCooldownMeta.proof_history]
          : [];

      if (!proofHistory.some((p) => p.appId === appId)) {
        proofHistory.push({
          appId,
          brand: proof.brand,
          report: proof.report,
          metric: proof.metric,
        });
      }

      const forwardingBanner = isForwardedSuspect
        ? `\n🔥 <b>Возможно, письмо переслали коллеге!</b>\n` +
          `└ <i>Новое гео/девайс: ${escapeHtml(geo)} · ${escapeHtml(device)} (ранее: ${escapeHtml(prevGeo || "—")} · ${escapeHtml(prevDevice || "—")})</i>\n`
        : isSameCityScreenSwitch
        ? `\n💻 <b>Открыл письмо с другого экрана в том же городе:</b> ${escapeHtml(device)} <i>(заявка была с ${escapeHtml(prevDevice)})</i>\n`
        : "";

      let tgText = "";
      if (proofHistory.length <= 1) {
        tgText =
          `🔎 <b>ОТКРЫТ ПРУФ ИЗ ПИСЬМА</b>\n\n` +
          `👤 <b>Лид:</b> ${leadLabel}\n` +
          `📊 <b>Кейс:</b> ${escapeHtml(proof.brand)} · ${escapeHtml(proof.report)}\n` +
          `📈 <b>Метрика:</b> ${escapeHtml(proof.metric)}\n` +
          `📍 <b>Локация и девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}` +
          forwardingBanner +
          `\n\n🔗 <a href="${escapeHtml(proof.fileUrl)}">Открыть оригинал пруфа ↗</a>`;
      } else {
        const historyLines = proofHistory
          .map(
            (item, idx) =>
              `   ${idx + 1}. <b>${escapeHtml(item.brand)}</b> (${escapeHtml(item.report)}) — <i>${escapeHtml(item.metric)}</i>`
          )
          .join("\n");

        tgText =
          `🔎 <b>ИЗУЧАЕТ ПРУФЫ ИЗ ПИСЬМА (Открыто: ${proofHistory.length} кейса)</b>\n\n` +
          `👤 <b>Лид:</b> ${leadLabel}\n` +
          `📊 <b>Только что открыл:</b> ${escapeHtml(proof.brand)} · ${escapeHtml(proof.report)}\n` +
          `🧭 <b>История открытых пруфов:</b>\n${historyLines}\n` +
          `📍 <b>Локация и девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}` +
          forwardingBanner +
          `\n\n🔗 <a href="${escapeHtml(proof.fileUrl)}">Открыть последний пруф ↗</a>`;
      }

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
