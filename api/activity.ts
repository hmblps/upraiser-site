/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: true,
  },
};

const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4-hour notification cooldown per visitor (allows evening follow-ups)
const FIRST_VISIT_ENGAGEMENT_SECONDS = 120; // First visit requires >= 2 min active engagement to trigger a digest
const FIRST_VISIT_DEEP_SLIDE = 8; // Or reaching slide 8+ with at least 45s active time

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Format human-readable fallback display name from timestamped or legacy token
 * e.g. hub_20261024_1745_9a2f -> "Лид #9A2F (24.10 17:45)"
 * e.g. hub_07ftruu -> "Лид #07FTRUU"
 */
function formatFallbackDisplayName(id: string): string {
  const match = id.match(/^hub_(\d{4}|\d{2})(\d{2})(\d{2})_(\d{2})(\d{2})_([a-z0-9]+)$/i);
  if (match) {
    const [, , mm, dd, hh, min, salt] = match;
    return `Лид #${salt.toUpperCase()} (${dd}.${mm} ${hh}:${min})`;
  }
  const clean = id.replace(/^hub_/, "").toUpperCase();
  return `Лид #${clean}`;
}

interface ActivityEventPayload {
  visitorId: string;
  clickId?: string;
  leadName?: string;
  leadContact?: string;
  eventType: "return_visit" | "deck_view" | "page_scroll" | "vcf_download" | "heartbeat" | "session_end" | "form_submit";
  durationSeconds?: number;
  metadata?: Record<string, any>;
  sessionState?: string;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
  }

  // 2. Parse request payload safely (handles fetch JSON, sendBeacon text/blob)
  let body: any = {};
  if ((req as any).body) {
    try {
      body = typeof (req as any).body === "string" ? JSON.parse((req as any).body) : (req as any).body;
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Malformed JSON payload" }));
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
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Malformed raw JSON body" }));
    }
  }

  const {
    visitorId,
    clickId,
    leadName = "",
    leadContact = "",
    eventType = "heartbeat",
    durationSeconds = 0,
    metadata = {},
    sessionState = "",
  }: ActivityEventPayload = body;

  const effectiveClickId = clickId || (body as any)?.click_id || metadata?.click_id || visitorId;

  if (!visitorId || typeof visitorId !== "string") {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Missing required visitorId" }));
  }

  // 3. Initialize Supabase Admin Client
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseAdmin = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // 4. Intelligent Identity Resolution:
  // If identity was not supplied in this beacon payload, check if this visitor was already
  // identified in Supabase (e.g. earlier form submit, or previous identified event)
  let resolvedLeadName = (leadName || "").trim();
  let resolvedLeadContact = (leadContact || "").trim();

  if (supabaseAdmin && (!resolvedLeadName || !resolvedLeadContact)) {
    try {
      // A. Query most recent identified record in lead_activity_logs
      const { data: identifiedRow } = await supabaseAdmin
        .from("lead_activity_logs")
        .select("lead_name, lead_contact")
        .eq("visitor_id", visitorId)
        .not("lead_name", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (identifiedRow?.lead_name) {
        if (!resolvedLeadName) resolvedLeadName = identifiedRow.lead_name;
        if (!resolvedLeadContact) resolvedLeadContact = identifiedRow.lead_contact || "";
      } else {
        // B. Fallback: inspect lead_notification_cooldowns metadata
        const { data: cooldownRow } = await supabaseAdmin
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", visitorId)
          .maybeSingle();

        const storedName = cooldownRow?.metadata?.displayName;
        if (
          storedName &&
          !storedName.startsWith("Lead #") &&
          !storedName.startsWith("Лид #")
        ) {
          if (!resolvedLeadName) resolvedLeadName = storedName;
          if (!resolvedLeadContact) resolvedLeadContact = cooldownRow.metadata?.leadContact || "";
        }
      }
    } catch (identityErr) {
      console.warn("Identity resolution exception:", identityErr);
    }
  }

  let loggedToDb = false;

  // 5. Log event to Supabase lead_activity_logs with stitched identity
  if (supabaseAdmin) {
    try {
      const { error: insertError } = await supabaseAdmin.from("lead_activity_logs").insert([
        {
          visitor_id: visitorId,
          lead_name: resolvedLeadName || null,
          lead_contact: resolvedLeadContact || null,
          event_type: eventType,
          duration_seconds: durationSeconds || 0,
          metadata: {
            ...metadata,
            click_id: effectiveClickId,
            sessionState,
            userAgent: req.headers["user-agent"] || "unknown",
            ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
          },
        },
      ]);
      if (!insertError) {
        loggedToDb = true;

        // If identity is known, retroactively update previous anonymous entries for this visitor
        if (resolvedLeadName) {
          await supabaseAdmin
            .from("lead_activity_logs")
            .update({
              lead_name: resolvedLeadName,
              lead_contact: resolvedLeadContact || null,
            })
            .eq("visitor_id", visitorId)
            .is("lead_name", null);
        }
      } else {
        console.warn("Supabase lead_activity_logs insert warning:", insertError.message);
      }
    } catch (dbErr) {
      console.warn("Database activity logging exception:", dbErr);
    }
  }

  // 5. Evaluate High-Intent Trigger Criteria
  const visitCount =
    Number(metadata?.visitCount) ||
    (sessionState.match(/Repeat Visit #(\d+)/)?.[1]
      ? parseInt(sessionState.match(/Repeat Visit #(\d+)/)![1], 10)
      : 1);
  const isReturnVisitEvent = eventType === "return_visit";
  const isRepeatVisitSession = visitCount > 1 || sessionState.toLowerCase().includes("repeat visit");
  const isActualReturn = isReturnVisitEvent || isRepeatVisitSession;
  const isVcfDownload = eventType === "vcf_download";
  const currentSlide = Number(metadata?.current_slide) || 1;

  // Criteria:
  // A. Actual Return Visit: return_visit event (fires only after 30+ min idle and verified user interaction)
  const qualifiesReturnVisit = isReturnVisitEvent;

  // B. vCard Download: disabled per doctrine — downloading .vcf does not guarantee contact was saved.
  // Activity is still safely logged to Supabase DB for analytics history, but notification alert is suppressed.
  const qualifiesVcf = false;

  // C. First Visit Deep Engagement:
  // Does NOT trigger on quick 15-25s scans! Requires genuine deep engagement:
  // >= 120s active time OR reaching slide 8+ with at least 45s active time
  const qualifiesDeepFirstVisit =
    !isActualReturn &&
    (durationSeconds >= FIRST_VISIT_ENGAGEMENT_SECONDS ||
      (currentSlide >= FIRST_VISIT_DEEP_SLIDE && durationSeconds >= 45));

  // D. Repeat Visit Active Reading (heartbeat during a return visit with >= 60s active time)
  const qualifiesRepeatEngagement =
    isActualReturn && !isReturnVisitEvent && durationSeconds >= 60;

  const qualifiesForDigest =
    qualifiesReturnVisit || qualifiesVcf || qualifiesDeepFirstVisit || qualifiesRepeatEngagement;

  if (!qualifiesForDigest) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, logged: loggedToDb, digestSent: false }));
  }

  // 6. Check 4-Hour Cooldown in Supabase (with 45s de-duplication for rapid double clicks)
  let cooldownActive = false;
  let previousNotificationCount = 0;
  let lastEventWasVcfRecently = false;

  if (supabaseAdmin) {
    try {
      const { data: cooldownData } = await supabaseAdmin
        .from("lead_notification_cooldowns")
        .select("last_notified_at, last_event_type, total_notifications")
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (cooldownData?.last_notified_at) {
        const lastNotifiedTime = new Date(cooldownData.last_notified_at).getTime();
        const elapsed = Date.now() - lastNotifiedTime;
        previousNotificationCount = cooldownData.total_notifications || 1;
        if (elapsed < COOLDOWN_MS) {
          cooldownActive = true;
        }
        // De-duplicate rapid back-to-back vCard saves within 45 seconds
        if (isVcfDownload && cooldownData.last_event_type === "vcf_download" && elapsed < 45 * 1000) {
          lastEventWasVcfRecently = true;
        }
      }
    } catch (cooldownErr) {
      console.warn("Cooldown check error:", cooldownErr);
    }
  }

  if (lastEventWasVcfRecently) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        ok: true,
        logged: loggedToDb,
        digestSent: false,
        reason: "vcf_dedup_45s",
      })
    );
  }

  // Never suppress initial vcf_download even during general cooldown
  if (cooldownActive && !isVcfDownload) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        ok: true,
        logged: loggedToDb,
        digestSent: false,
        reason: "cooldown_active_4h",
      })
    );
  }

  // 7. Aggregate Recent Activity History for this Visitor
  let recentActivities: Array<{ event_type: string; duration_seconds: number; created_at: string; metadata: any }> = [];
  if (supabaseAdmin) {
    try {
      const { data: history } = await supabaseAdmin
        .from("lead_activity_logs")
        .select("event_type, duration_seconds, created_at, metadata")
        .eq("visitor_id", visitorId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (history) {
        recentActivities = history;
      }
    } catch (histErr) {
      console.warn("History fetch error:", histErr);
    }
  }

  // Format activity summary lines with stitched identity or human-readable fallback
  const displayName = resolvedLeadName || formatFallbackDisplayName(visitorId);
  const displayContact = resolvedLeadContact || "Not entered yet";
  const durationMin = (Math.max(durationSeconds, 1) / 60).toFixed(1);

  // Extract smart detected traffic source (clean URL attribution)
  const currentSource = metadata?.traffic_source || "";
  const initialSource = metadata?.first_traffic_source || "";
  let smartSourceDisplay = currentSource || initialSource || "Direct / Organic";
  if (initialSource && currentSource && initialSource !== currentSource && !currentSource.startsWith("Direct")) {
    smartSourceDisplay = `${initialSource} (Возврат: ${currentSource})`;
  } else if (initialSource && currentSource && initialSource !== currentSource && currentSource.startsWith("Direct")) {
    smartSourceDisplay = `${initialSource} (Повторный визит напрямую)`;
  }

  const eventDescriptions: Record<string, string> = {
    form_submit: "🧗 Отправка контактов (Clip In)",
    return_visit: "🔁 Повторный визит на /connect",
    deck_view: "📊 Просмотр медиадека (Traffic Infrastructure Deck)",
    vcf_download: "📇 Скачивание контакта One-Tap Save (.vcf)",
    page_scroll: "📜 Глубокий скролл страницы хаба",
    heartbeat: "⏱ Активное чтение / пребывание на странице",
    session_end: "🚪 Завершение сессии",
  };

  const formatEventLabel = (type: string, meta: any): string => {
    if (type === "deck_view") {
      if (meta?.current_slide) {
        const slideName = meta?.slide_title ? ` «${meta.slide_title}»` : "";
        return `📊 Просмотр слайда ${meta.current_slide}/20${slideName}`;
      }
      return "📊 Просмотр медиадека (Traffic Infrastructure Deck)";
    }
    if (type === "heartbeat" && meta?.current_slide) {
      return `⏱ Чтение слайда ${meta.current_slide}/20 (${meta.slide_title || "Медиадек"})`;
    }
    if (type === "page_scroll" && meta?.scrollDepth) {
      return `📜 Глубокий скролл страницы (${meta.scrollDepth}%)`;
    }
    return eventDescriptions[type] || type;
  };

  const activityLines =
    recentActivities.length > 0
      ? recentActivities
          .map((a) => {
            const timeStr = new Date(a.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const label = formatEventLabel(a.event_type, a.metadata);
            const dur = a.duration_seconds > 0 ? ` (${a.duration_seconds} сек)` : "";
            return `• <strong>${timeStr}</strong>: ${label}${dur}`;
          })
          .join("<br/>")
      : `• ${formatEventLabel(eventType, metadata)} (${durationSeconds} сек)`;

  const telegramActivityLines =
    recentActivities.length > 0
      ? recentActivities
          .map((a) => {
            const timeStr = new Date(a.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const label = formatEventLabel(a.event_type, a.metadata);
            const dur = a.duration_seconds > 0 ? ` (${a.duration_seconds}s)` : "";
            return `  • <code>${timeStr}</code>: ${label}${dur}`;
          })
          .join("\n")
      : `  • ${formatEventLabel(eventType, metadata)} (${durationSeconds}s)`;

  // 8. Dynamic Alert Category, Subject, Titles & Badges
  let alertBadge = "🔥 HIGH INTENT TELEMETRY";
  let alertTitle = `${displayName} активен на платформе`;
  let alertSubtitle = "Сессия на /connect";
  let emailSubject = `⚡ [АКТИВНОСТЬ] ${displayName} на платформе · ${durationMin} мин`;
  let tgHeader = `<b>⚡ [АКТИВНОСТЬ] Лид на платформе!</b>`;

  if (isVcfDownload) {
    alertBadge = "📇 CONTACT DOWNLOADED";
    alertTitle = `${displayName} сохранил визитку`;
    alertSubtitle = "Контакт добавлен в адресную книгу мобильного устройства";
    emailSubject = `📇 [СОХРАНЕНИЕ КОНТАКТА] ${displayName} сохранил визитку (.vcf)`;
    tgHeader = `<b>📇 [СОХРАНЕНИЕ КОНТАКТА] Лид сохранил визитку!</b>`;
  } else if (isActualReturn) {
    const idleMinStr = metadata?.idleMinutes ? `спустя ${metadata.idleMinutes} мин` : "повторно";
    alertBadge = "🔁 REPEAT VISITOR";
    alertTitle = `${displayName} вернулся на платформу`;
    alertSubtitle = `Повторный визит (${idleMinStr}) · Сессия #${visitCount}`;
    emailSubject = `🔁 [ПОВТОРНЫЙ ВИЗИТ] ${displayName} вернулся на сайт · Сессия #${visitCount}`;
    tgHeader = `<b>🔁 [ПОВТОРНЫЙ ВИЗИТ] Лид вернулся на платформу!</b>`;
  } else {
    // First Visit Deep Engagement
    alertBadge = "⚡ NEW LEAD · DEEP ENGAGEMENT";
    alertTitle = `${displayName} изучает презентацию`;
    alertSubtitle = `Первый визит с QR-кода · Вовлеченность ${durationMin} мин (слайд ${currentSlide}/20)`;
    emailSubject = `⚡ [НОВЫЙ ЛИД] ${displayName} изучает презентацию (${durationMin} мин)`;
    tgHeader = `<b>⚡ [НОВЫЙ ЛИД] Высокая вовлеченность с QR-кода!</b>`;
  }

  // 9. Resend email digest disabled to preserve 100% of daily quota for lead autoresponders & form submissions.
  // All telemetry and visitor alerts are routed directly to Telegram supergroup IMS2026.
  let emailSent = false;

  // 10. Send Instant Telegram Alert if Bot Token is configured
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
      const tgText = `${tgHeader}\n\n` +
        `👤 <b>Имя:</b> ${escapeHtml(displayName)}\n` +
        `📱 <b>Контакт:</b> ${escapeHtml(displayContact)}\n` +
        `🌐 <b>Источник (Smart Detect):</b> ${escapeHtml(smartSourceDisplay)}\n` +
        `⏱ <b>Активное время:</b> ${durationSeconds}с (~${durationMin} мин)\n` +
        `🏷 <b>Статус:</b> ${escapeHtml(sessionState || (isActualReturn ? `Повторный визит #${visitCount}` : "Первый визит"))}\n` +
        `🎯 <b>Click ID:</b> <code>${escapeHtml(effectiveClickId)}</code>\n\n` +
        `<b>Хроника действий:</b>\n${telegramActivityLines}\n\n` +
        `🔗 <a href="https://upraiser.co.uk/connect">Открыть Conference Hub</a>`;

      const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (tgRes.ok) {
        telegramSent = true;
      }
    } catch (tgErr) {
      console.warn("Telegram alert error:", tgErr);
    }
  }

  // 11. Update Cooldown Tracker in Supabase
  if (supabaseAdmin && (emailSent || telegramSent)) {
    try {
      await supabaseAdmin.from("lead_notification_cooldowns").upsert(
        {
          visitor_id: visitorId,
          last_notified_at: new Date().toISOString(),
          last_event_type: eventType,
          total_notifications: previousNotificationCount + 1,
          metadata: {
            displayName,
            leadContact: displayContact,
            durationSeconds,
            emailSent,
            telegramSent,
          },
        },
        { onConflict: "visitor_id" }
      );
    } catch (cooldownSaveErr) {
      console.warn("Cooldown update failed:", cooldownSaveErr);
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(
    JSON.stringify({
      ok: true,
      logged: loggedToDb,
      digestSent: emailSent || telegramSent,
      emailSent,
      telegramSent,
    })
  );
}
