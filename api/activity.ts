/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: true,
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
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(uaLower)) client = " (Safari)";
  else if (/chrome|crios/i.test(uaLower)) client = " (Chrome)";

  return `${device}${client}`;
}

function formatShortVisitorId(id: string): string {
  if (!id) return "anon";
  const match = id.match(/_([a-z0-9]{4,6})$/i);
  if (match) return `usr_${match[1].toLowerCase()}`;
  const clean = id.replace(/^hub_/, "").slice(0, 6).toLowerCase();
  return `usr_${clean || "anon"}`;
}

const HIGH_PRIORITY_EVENTS = new Set([
  "vcard_download",
  "lead_submit",
  "clip_in",
  "form_submit",
  "deck_download",
  "proof_click",
  "contact_click",
  "channel_click",
  "return_visit",
  "lead_identified",
]);

const EMOJI_MAP: Record<string, string> = {
  page_view: "👀",
  slide_view: "📊",
  deck_view: "📊",
  heartbeat: "⏱",
  page_scroll: "📜",
  vcard_download: "📇",
  lead_submit: "🔥",
  clip_in: "🧗",
  form_submit: "🚀",
  deck_download: "📥",
  proof_click: "🔎",
  contact_click: "📲",
  channel_click: "📲",
  return_visit: "🔁",
  lead_identified: "🎯",
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  }

  try {
    let body: any = {};
    if ((req as any).body) {
      try {
        body = typeof (req as any).body === "string" ? JSON.parse((req as any).body) : (req as any).body;
      } catch {
        body = {};
      }
    } else {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const raw = Buffer.concat(buffers).toString("utf-8");
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = {};
      }
    }

    const {
      visitorId = "",
      clickId,
      leadName = "",
      leadContact = "",
      eventType = "heartbeat",
      event,
      durationSeconds = 0,
      metadata = {},
      meta,
      sessionState = "",
    } = body;

    const effectiveEvent = event || eventType || "heartbeat";
    const effectiveVisitorId = visitorId || body.visitor_id || "anon";
    const effectiveClickId = clickId || body.click_id || metadata?.click_id || effectiveVisitorId;
    const shortId = formatShortVisitorId(effectiveVisitorId);

    // 1. Initialize Supabase Admin Client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseAdmin = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    // 2. Intelligent Identity Resolution (Deanonymization)
    let resolvedLeadName = (leadName || "").trim();
    let resolvedLeadContact = (leadContact || "").trim();

    if (supabaseAdmin && (!resolvedLeadName || !resolvedLeadContact)) {
      try {
        const { data: identifiedRow } = await supabaseAdmin
          .from("lead_activity_logs")
          .select("lead_name, lead_contact")
          .eq("visitor_id", effectiveVisitorId)
          .not("lead_name", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (identifiedRow?.lead_name) {
          if (!resolvedLeadName) resolvedLeadName = identifiedRow.lead_name;
          if (!resolvedLeadContact) resolvedLeadContact = identifiedRow.lead_contact || "";
        }
      } catch (idErr) {
        console.warn("Identity lookup warning:", idErr);
      }
    }

    // 3. Extract Geo & Device from Vercel Request Headers
    const geo = parseGeo(req.headers);
    const ua = (req.headers["user-agent"] as string) || "";
    const device = parseDevice(ua);

    // 4. Log to Supabase lead_activity_logs
    let loggedToDb = false;
    if (supabaseAdmin) {
      try {
        const { error: insertError } = await supabaseAdmin.from("lead_activity_logs").insert([
          {
            visitor_id: effectiveVisitorId,
            lead_name: resolvedLeadName || null,
            lead_contact: resolvedLeadContact || null,
            event_type: effectiveEvent,
            duration_seconds: durationSeconds || 0,
            metadata: {
              ...metadata,
              meta,
              click_id: effectiveClickId,
              sessionState,
              geo,
              device,
              userAgent: ua,
              ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
            },
          },
        ]);
        if (!insertError) {
          loggedToDb = true;
          // If newly identified, update earlier anonymous entries for this visitor
          if (resolvedLeadName) {
            await supabaseAdmin
              .from("lead_activity_logs")
              .update({
                lead_name: resolvedLeadName,
                lead_contact: resolvedLeadContact || null,
              })
              .eq("visitor_id", effectiveVisitorId)
              .is("lead_name", null);
          }
        }
      } catch (dbErr) {
        console.warn("Supabase log exception:", dbErr);
      }
    }

    // 5. Anti-Spam Filtering:
    // - For regular heartbeats: only push on significant engagement milestones (60s, 120s, 300s, 600s)
    // - Drop rapid heartbeats (e.g. 10s, 20s, 30s) so chat stays clean
    if (effectiveEvent === "heartbeat") {
      const allowedMilestones = [60, 120, 300, 600, 1200];
      const isMilestone = allowedMilestones.includes(durationSeconds);
      if (!isMilestone) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true, logged: loggedToDb, digestSent: false }));
      }
    }

    // - For vcard_download: deduplicate rapid duplicate downloads within 30s
    if (effectiveEvent === "vcard_download" && supabaseAdmin) {
      try {
        const { data: recentVcf } = await supabaseAdmin
          .from("lead_activity_logs")
          .select("created_at")
          .eq("visitor_id", effectiveVisitorId)
          .eq("event_type", "vcard_download")
          .order("created_at", { ascending: false })
          .limit(2);

        if (recentVcf && recentVcf.length >= 2) {
          const t0 = new Date(recentVcf[0].created_at).getTime();
          const t1 = new Date(recentVcf[1].created_at).getTime();
          if (Math.abs(t0 - t1) < 30 * 1000) {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ ok: true, logged: loggedToDb, digestSent: false, reason: "dedup_30s" }));
          }
        }
      } catch {}
    }

    // 6. Push Separation: Silent vs Loud
    const isHighPriority = HIGH_PRIORITY_EVENTS.has(effectiveEvent);
    const isSilent = !isHighPriority; // disable_notification: true for passive browsing

    // 7. Format Telegram Message
    const icon = EMOJI_MAP[effectiveEvent] || "⚡️";
    let eventTitle = effectiveEvent.replace(/_/g, " ").toUpperCase();

    if (effectiveEvent === "vcard_download") eventTitle = "СОХРАНЕНИЕ КОНТАКТА (.VCF)";
    else if (effectiveEvent === "lead_submit" || effectiveEvent === "clip_in") eventTitle = "НОВЫЙ ЛИД · CLIP IN";
    else if (effectiveEvent === "return_visit") eventTitle = "ПОВТОРНЫЙ ВИЗИТ";
    else if (effectiveEvent === "slide_view" || effectiveEvent === "deck_view") {
      const slideNum = metadata?.current_slide || metadata?.slide || "";
      eventTitle = slideNum ? `СЛАЙД ${slideNum}/20` : "ПРОСМОТР ПРЕЗЕНТАЦИИ";
    } else if (effectiveEvent === "proof_click") eventTitle = "ПРУФ ОТКРЫТ ИЗ ПИСЬМА";
    else if (effectiveEvent === "contact_click") eventTitle = "КЛИК В МЕССЕНДЖЕР";
    else if (effectiveEvent === "deck_download") eventTitle = "СКАЧИВАНИЕ MEDIA DECK (PDF)";

    // Who formatting: anonymous hash vs deanonymized contact
    const hasNameOrContact = Boolean(resolvedLeadName || resolvedLeadContact);
    const who = hasNameOrContact
      ? `<b>${escapeHtml(resolvedLeadName || resolvedLeadContact)}</b> ${resolvedLeadName && resolvedLeadContact ? `(${escapeHtml(resolvedLeadContact)}) ` : ""}<code>[${escapeHtml(shortId)}]</code>`
      : `<code>[${escapeHtml(shortId)}]</code>`;

    // Action / Context detail
    let actionDetail = meta || metadata?.title || metadata?.slide_title || metadata?.channel || "";
    if (effectiveEvent === "slide_view" || effectiveEvent === "deck_view") {
      const slideTitle = metadata?.slide_title || "";
      actionDetail = slideTitle ? `Изучает: <i>${escapeHtml(slideTitle)}</i>` : `Слайд #${metadata?.current_slide || 1}`;
    } else if (effectiveEvent === "vcard_download") {
      actionDetail = "Добавил контакт Alex в адресную книгу смартфона";
    } else if (effectiveEvent === "return_visit") {
      const idleMin = metadata?.idleMinutes ? `спустя ${metadata.idleMinutes} мин` : "повторно";
      actionDetail = `Вернулся на платформу (${idleMin}) · ${sessionState || "Сессия #2+"}`;
    } else if (effectiveEvent === "heartbeat") {
      const min = Math.round(durationSeconds / 60);
      actionDetail = `Активное время на странице: ${durationSeconds}с (~${min} мин)`;
    } else if (effectiveEvent === "contact_click") {
      const target = metadata?.target || metadata?.channel || "Direct";
      actionDetail = `Переход по кнопке: ${escapeHtml(target)}`;
    }

    const lines: string[] = [
      `${icon} <b>${eventTitle}</b>`,
      `👤 <b>Who:</b> ${who}`,
      actionDetail ? `📌 <b>Action:</b> ${actionDetail}` : null,
      `📍 <b>Geo:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`,
      effectiveClickId && effectiveClickId !== effectiveVisitorId ? `🎯 <b>Click ID:</b> <code>${escapeHtml(effectiveClickId)}</code>` : null,
    ].filter(Boolean) as string[];

    const tgText = lines.join("\n");

    // 8. Send Telegram Notification (100% via bot, 0 Resend calls)
    const tgToken =
      process.env.VITE_TELEGRAM_BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN ||
      "8955516402:AAFMgYQ5dJoS13RhOLrNkoPs3lplpaa4bxI";
    const tgChatId =
      process.env.VITE_TELEGRAM_CHAT_ID ||
      process.env.TELEGRAM_CHAT_ID ||
      "-1003934317948";

    let telegramSent = false;
    if (tgToken && tgChatId) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgText,
            parse_mode: "HTML",
            disable_notification: isSilent, // Silent mode for passive browsing, Loud with vibration for high intent!
            disable_web_page_preview: true,
          }),
        });
        telegramSent = tgRes.ok;
      } catch (tgErr) {
        console.warn("Telegram alert error in activity tracker:", tgErr);
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        ok: true,
        logged: loggedToDb,
        digestSent: telegramSent,
        isSilent,
      })
    );
  } catch (err) {
    // Never crash client telemetry requests
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false }));
  }
}
