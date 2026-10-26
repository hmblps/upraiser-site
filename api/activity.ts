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

export interface SessionTimelineEntry {
  key: string;
  time: string;
  line: string;
  slideTrail?: number[];
  uniqueSlides?: number[];
}

export function renderSessionCardHtml(params: {
  shortId: string;
  resolvedLeadName: string;
  resolvedLeadContact: string;
  geo: string;
  device: string;
  timeline: SessionTimelineEntry[];
}): string {
  const { shortId, resolvedLeadName, resolvedLeadContact, geo, device, timeline } = params;
  const hasNameOrContact = Boolean(resolvedLeadName || resolvedLeadContact);
  const who = hasNameOrContact
    ? `<b>${escapeHtml(resolvedLeadName || resolvedLeadContact)}</b>${
        resolvedLeadName && resolvedLeadContact ? ` (${escapeHtml(resolvedLeadContact)})` : ""
      }`
    : `Аноним`;

  const timelineText = timeline.map((item) => item.line).join("\n");

  return [
    `🧭 <b>АКТИВНОСТЬ НА ХАБЕ · <code>[${escapeHtml(shortId)}]</code></b>`,
    `👤 <b>Лид:</b> ${who}`,
    `📍 <b>Локация и девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`,
    ``,
    `📋 <b>Хронология действий в сессии:</b>`,
    timelineText,
  ].join("\n");
}

// Strict whitelist of explicit human actions that trigger a Telegram message.
// Background noise (session_end, page_scroll, heartbeat) is logged to DB only and NEVER spams Telegram.
const TELEGRAM_ALLOWED_EVENTS = new Set([
  "slide_view",
  "deck_view",
  "deck_download",
  "contact_click",
  "channel_click",
  "vcf_download",
  "vcard_download",
  "return_visit",
]);

const HIGH_PRIORITY_EVENTS = new Set([
  "vcf_download",
  "vcard_download",
  "deck_download",
  "contact_click",
  "channel_click",
  "return_visit",
]);

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

    // 2. Intelligent Identity Resolution (Deanonymization) & Cooldown State Fetch
    let resolvedLeadName = (leadName || "").trim();
    let resolvedLeadContact = (leadContact || "").trim();
    let existingCooldownMeta: Record<string, any> = {};

    if (supabaseAdmin) {
      try {
        const { data: cooldownRow } = await supabaseAdmin
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", effectiveVisitorId)
          .maybeSingle();

        if (cooldownRow?.metadata && typeof cooldownRow.metadata === "object") {
          existingCooldownMeta = cooldownRow.metadata;
          if (!resolvedLeadName && existingCooldownMeta.displayName) {
            resolvedLeadName = String(existingCooldownMeta.displayName);
          }
          if (!resolvedLeadContact && existingCooldownMeta.leadContact) {
            resolvedLeadContact = String(existingCooldownMeta.leadContact);
          }
        }
      } catch {}

      if (!resolvedLeadName || !resolvedLeadContact) {
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

    // 5. Strict Event Whitelist & Anti-Spam Filtering:
    // Only explicit human actions in TELEGRAM_ALLOWED_EVENTS are sent to Telegram.
    // Background heartbeats, session_end, and scroll pings are logged to DB only.
    if (!TELEGRAM_ALLOWED_EVENTS.has(effectiveEvent)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: true, logged: loggedToDb, digestSent: false }));
    }

    // - For vcf_download / vcard_download: deduplicate rapid duplicate downloads within 30s
    if ((effectiveEvent === "vcf_download" || effectiveEvent === "vcard_download") && supabaseAdmin) {
      try {
        const { data: recentVcf } = await supabaseAdmin
          .from("lead_activity_logs")
          .select("created_at")
          .eq("visitor_id", effectiveVisitorId)
          .in("event_type", ["vcf_download", "vcard_download"])
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

    // - For deck_view / slide_view: deduplicate identical slide views within 15s
    if ((effectiveEvent === "deck_view" || effectiveEvent === "slide_view") && supabaseAdmin) {
      try {
        const currentSlideNum = metadata?.current_slide || metadata?.slide || 1;
        const { data: recentSlides } = await supabaseAdmin
          .from("lead_activity_logs")
          .select("created_at, metadata")
          .eq("visitor_id", effectiveVisitorId)
          .in("event_type", ["deck_view", "slide_view"])
          .order("created_at", { ascending: false })
          .limit(2);

        if (recentSlides && recentSlides.length >= 2) {
          const prevSlideNum = recentSlides[1]?.metadata?.current_slide || recentSlides[1]?.metadata?.slide || 1;
          const t0 = new Date(recentSlides[0].created_at).getTime();
          const t1 = new Date(recentSlides[1].created_at).getTime();
          if (prevSlideNum === currentSlideNum && Math.abs(t0 - t1) < 15 * 1000) {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ ok: true, logged: loggedToDb, digestSent: false, reason: "dedup_slide_15s" }));
          }
        }
      } catch {}
    }

    // 6. Push Separation: Silent vs Loud
    // Slide browsing is silent (no vibration); vCard, PDF download, messenger/ecosystem click, and return visit are loud!
    const isHighPriority = HIGH_PRIORITY_EVENTS.has(effectiveEvent);
    const isSilent = !isHighPriority;
    const isDeckEvent = effectiveEvent === "slide_view" || effectiveEvent === "deck_view";

    // 7. Unified Session Card Timeline (1 live message per 30-min visitor session)
    const timeStr = formatTimeHHMM(new Date());
    const prevSessionUpdatedAt = existingCooldownMeta?.session_updated_at
      ? new Date(existingCooldownMeta.session_updated_at).getTime()
      : existingCooldownMeta?.deck_updated_at
      ? new Date(existingCooldownMeta.deck_updated_at).getTime()
      : 0;

    const activeSessionMessageId: number | null =
      (existingCooldownMeta?.session_message_id || existingCooldownMeta?.deck_message_id) &&
      Date.now() - prevSessionUpdatedAt < 30 * 60 * 1000
        ? Number(existingCooldownMeta.session_message_id || existingCooldownMeta.deck_message_id)
        : null;

    let timeline: SessionTimelineEntry[] =
      activeSessionMessageId && Array.isArray(existingCooldownMeta?.session_timeline)
        ? [...existingCooldownMeta.session_timeline]
        : [];

    if (isDeckEvent) {
      const currentSlideNum = Number(metadata?.current_slide || metadata?.slide || 1);
      const slideTitle = metadata?.slide_title || `Слайд #${currentSlideNum}`;
      const langTag = metadata?.lang ? ` (${String(metadata.lang).toUpperCase()})` : "";

      const existingDeckIdx = timeline.findIndex((t) => t.key === "deck");
      const prevDeckEntry = existingDeckIdx >= 0 ? timeline[existingDeckIdx] : null;

      let slideTrail: number[] = Array.isArray(prevDeckEntry?.slideTrail)
        ? [...prevDeckEntry!.slideTrail!]
        : activeSessionMessageId && Array.isArray(existingCooldownMeta?.slide_trail)
        ? [...existingCooldownMeta.slide_trail]
        : [];

      let uniqueSlides: number[] = Array.isArray(prevDeckEntry?.uniqueSlides)
        ? [...prevDeckEntry!.uniqueSlides!]
        : activeSessionMessageId && Array.isArray(existingCooldownMeta?.unique_slides)
        ? [...existingCooldownMeta.unique_slides]
        : [];

      if (slideTrail.length === 0 || slideTrail[slideTrail.length - 1] !== currentSlideNum) {
        slideTrail.push(currentSlideNum);
      }
      if (slideTrail.length > 10) {
        slideTrail = slideTrail.slice(-10);
      }
      if (!uniqueSlides.includes(currentSlideNum)) {
        uniqueSlides.push(currentSlideNum);
      }

      const entryTime = prevDeckEntry?.time || timeStr;
      const trailStr = slideTrail.join(" → ");
      const deckLine =
        slideTrail.length > 1
          ? `• ${entryTime} — 📊 Презентация${escapeHtml(langTag)}: изучил ${uniqueSlides.length} сл. (${trailStr}) · сейчас на сл. ${currentSlideNum}/20 «<i>${escapeHtml(slideTitle)}</i>»`
          : `• ${entryTime} — 📊 Открыл презентацию${escapeHtml(langTag)}: сл. ${currentSlideNum}/20 «<i>${escapeHtml(slideTitle)}</i>»`;

      const updatedDeckEntry: SessionTimelineEntry = {
        key: "deck",
        time: entryTime,
        line: deckLine,
        slideTrail,
        uniqueSlides,
      };

      if (existingDeckIdx >= 0) {
        timeline[existingDeckIdx] = updatedDeckEntry;
      } else {
        timeline.push(updatedDeckEntry);
      }
    } else if (effectiveEvent === "vcf_download" || effectiveEvent === "vcard_download") {
      timeline.push({
        key: `vcf_${Date.now()}`,
        time: timeStr,
        line: `• ${timeStr} — 📇 Сохранил визитку Alex (.vcf)`,
      });
    } else if (effectiveEvent === "return_visit") {
      const visitNum = metadata?.visitCount || 2;
      const idleMin = metadata?.idleMinutes ? ` (спустя ${metadata.idleMinutes} мин)` : "";
      timeline.push({
        key: `revisit_${Date.now()}`,
        time: timeStr,
        line: `• ${timeStr} — 🔁 Повторный визит на /connect (Визит #${visitNum}${idleMin})`,
      });
    } else if (effectiveEvent === "contact_click") {
      const rawChannel = String(metadata?.channel || "");
      const target = metadata?.target || "Direct";
      const channelLabel = rawChannel.includes("telegram")
        ? `Telegram (${target})`
        : rawChannel.includes("whatsapp")
        ? `WhatsApp (${target})`
        : rawChannel.includes("email")
        ? `Email (${target})`
        : `${rawChannel || "Мессенджер"} (${target})`;
      timeline.push({
        key: `contact_${Date.now()}`,
        time: timeStr,
        line: `• ${timeStr} — 📲 Нажал на кнопку связи: <b>${escapeHtml(channelLabel)}</b>`,
      });
    } else if (effectiveEvent === "channel_click") {
      const target = metadata?.target || metadata?.channel || "Раздел сайта";
      timeline.push({
        key: `channel_${Date.now()}`,
        time: timeStr,
        line: `• ${timeStr} — 🌐 Открыл раздел: <b>${escapeHtml(String(target))}</b>`,
      });
    } else if (effectiveEvent === "deck_download") {
      const onSlide = metadata?.current_slide ? ` (со слайда ${metadata.current_slide}/20)` : "";
      timeline.push({
        key: `pdf_${Date.now()}`,
        time: timeStr,
        line: `• ${timeStr} — 📥 Скачал оригинал PDF-презентации${onSlide}`,
      });
    }

    // Keep timeline bounded to last 15 actions
    if (timeline.length > 15) {
      timeline = timeline.slice(-15);
    }

    const tgText = renderSessionCardHtml({
      shortId,
      resolvedLeadName,
      resolvedLeadContact,
      geo,
      device,
      timeline,
    });

    // 8. Send or Edit Unified Session Card in Telegram
    const tgToken =
      process.env.VITE_TELEGRAM_BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN ||
      "8955516402:AAFMgYQ5dJoS13RhOLrNkoPs3lplpaa4bxI";
    const tgChatId =
      process.env.VITE_TELEGRAM_CHAT_ID ||
      process.env.TELEGRAM_CHAT_ID ||
      "-1003934317948";

    let telegramSent = false;
    let finalSessionMessageId: number | null = activeSessionMessageId;
    const leadCardMessageId: number | null = existingCooldownMeta?.lead_card_message_id
      ? Number(existingCooldownMeta.lead_card_message_id)
      : null;

    if (tgToken && tgChatId) {
      try {
        let editedInPlace = false;

        if (activeSessionMessageId) {
          const editRes = await fetch(`https://api.telegram.org/bot${tgToken}/editMessageText`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgChatId,
              message_id: activeSessionMessageId,
              text: tgText,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          });
          const editJson: any = await editRes.json().catch(() => ({}));
          if (editRes.ok || String(editJson?.description || "").includes("message is not modified")) {
            editedInPlace = true;
            telegramSent = true;
          }
        }

        if (!editedInPlace) {
          const sendPayload: Record<string, any> = {
            chat_id: tgChatId,
            text: tgText,
            parse_mode: "HTML",
            disable_notification: isSilent,
            disable_web_page_preview: true,
          };

          // Link via Reply to the lead's main contact card if they already submitted one earlier!
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
          telegramSent = tgRes.ok;
          if (tgJson?.result?.message_id) {
            finalSessionMessageId = Number(tgJson.result.message_id);
          }
        }

        if (finalSessionMessageId && supabaseAdmin) {
          await supabaseAdmin.from("lead_notification_cooldowns").upsert(
            {
              visitor_id: effectiveVisitorId,
              last_notified_at: new Date().toISOString(),
              last_event_type: effectiveEvent,
              metadata: {
                ...existingCooldownMeta,
                ...(resolvedLeadName ? { displayName: resolvedLeadName } : {}),
                ...(resolvedLeadContact ? { leadContact: resolvedLeadContact } : {}),
                session_message_id: finalSessionMessageId,
                session_updated_at: new Date().toISOString(),
                session_timeline: timeline,
                lastGeo: geo,
                lastDevice: device,
              },
            },
            { onConflict: "visitor_id" }
          );
        }
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
