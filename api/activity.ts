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

interface ActivityEventPayload {
  visitorId: string;
  leadName?: string;
  leadContact?: string;
  eventType: "return_visit" | "deck_view" | "page_scroll" | "vcf_download" | "heartbeat" | "session_end";
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
    leadName = "",
    leadContact = "",
    eventType = "heartbeat",
    durationSeconds = 0,
    metadata = {},
    sessionState = "",
  }: ActivityEventPayload = body;

  if (!visitorId || typeof visitorId !== "string") {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Missing required visitorId" }));
  }

  // 3. Initialize Supabase Admin Client
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseAdmin = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  let loggedToDb = false;

  // 4. Log event to Supabase lead_activity_logs
  if (supabaseAdmin) {
    try {
      const { error: insertError } = await supabaseAdmin.from("lead_activity_logs").insert([
        {
          visitor_id: visitorId,
          lead_name: leadName || null,
          lead_contact: leadContact || null,
          event_type: eventType,
          duration_seconds: durationSeconds || 0,
          metadata: {
            ...metadata,
            sessionState,
            userAgent: req.headers["user-agent"] || "unknown",
            ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
          },
        },
      ]);
      if (!insertError) {
        loggedToDb = true;
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

  // B. vCard Download: high intent conversion
  const qualifiesVcf = isVcfDownload;

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

  // 6. Check 4-Hour Cooldown in Supabase (bypass for vcf_download)
  let cooldownActive = false;
  let previousNotificationCount = 0;

  if (supabaseAdmin) {
    try {
      const { data: cooldownData } = await supabaseAdmin
        .from("lead_notification_cooldowns")
        .select("last_notified_at, total_notifications")
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (cooldownData?.last_notified_at) {
        const lastNotifiedTime = new Date(cooldownData.last_notified_at).getTime();
        const elapsed = Date.now() - lastNotifiedTime;
        previousNotificationCount = cooldownData.total_notifications || 1;
        if (elapsed < COOLDOWN_MS) {
          cooldownActive = true;
        }
      }
    } catch (cooldownErr) {
      console.warn("Cooldown check error:", cooldownErr);
    }
  }

  // Never suppress vcf_download
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

  // Format activity summary lines
  const displayName = leadName.trim() || `Lead #${visitorId.slice(-4).toUpperCase()}`;
  const displayContact = leadContact.trim() || "Not entered yet";
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

  // 9. Send Resend Email Digest
  const resendApiKey = process.env.RESEND_API_KEY;
  let emailSent = false;

  if (resendApiKey) {
    try {
      const notificationEnv = process.env.NOTIFICATION_EMAIL;
      const toEmails = notificationEnv
        ? notificationEnv.split(",").map((e) => e.trim()).filter(Boolean)
        : ["info@upraiser.co.uk"];
      const fromEmail = process.env.RESEND_FROM_EMAIL || "UPRAISER Desk <pilot@upraiser.co.uk>";

      const subject = emailSubject;

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #0b0f19; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .badge { display: inline-block; padding: 4px 10px; background: rgba(254, 207, 9, 0.15); color: #FECF09; border: 1px solid rgba(254, 207, 9, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .title { font-size: 20px; font-weight: 700; color: #ffffff; margin: 12px 0 4px; }
    .subtitle { font-size: 13px; color: #9ca3af; margin: 0; }
    .content { padding: 24px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #FECF09; margin-bottom: 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .info-table td.label { color: #9ca3af; width: 38%; }
    .info-table td.value { color: #f9fafb; font-weight: 600; }
    .activity-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; font-size: 13px; line-height: 1.8; color: #d1d5db; margin-bottom: 20px; }
    .footer { padding: 16px 24px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">${escapeHtml(alertBadge)}</span>
      <h1 class="title">${escapeHtml(alertTitle)}</h1>
      <p class="subtitle">${escapeHtml(alertSubtitle)}</p>
    </div>
    <div class="content">
      <div class="section-title">Сводка по лиду</div>
      <table class="info-table">
        <tr>
          <td class="label">Имя контакта:</td>
          <td class="value">${escapeHtml(displayName)}</td>
        </tr>
        <tr>
          <td class="label">Контакт (Email / TG):</td>
          <td class="value">${escapeHtml(displayContact)}</td>
        </tr>
        <tr>
          <td class="label">Определенный источник:</td>
          <td class="value"><span style="display: inline-block; padding: 2px 8px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; font-weight: 700; font-size: 12px;">🌐 ${escapeHtml(smartSourceDisplay)}</span></td>
        </tr>
        <tr>
          <td class="label">Visitor Token:</td>
          <td class="value"><code>${escapeHtml(visitorId)}</code></td>
        </tr>
        <tr>
          <td class="label">Статус визита:</td>
          <td class="value">${escapeHtml(sessionState || (isActualReturn ? `Повторный визит #${visitCount}` : "Первый визит"))}</td>
        </tr>
        <tr>
          <td class="label">Время на странице:</td>
          <td class="value"><strong>${durationSeconds} сек</strong> (~${durationMin} мин)</td>
        </tr>
      </table>

      <div class="section-title">Хроника действий за сессию</div>
      <div class="activity-box">
        ${activityLines}
      </div>

      <div style="text-align: center; padding-top: 8px;">
        <a href="https://upraiser.co.uk/connect" style="display: inline-block; background: #e63558; color: #ffffff; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none;">
          Открыть Conference Hub →
        </a>
      </div>
    </div>
    <div class="footer">
      UPRAISER Agency LLP · 128 City Road, London EC1V 2NX · Automated Telemetry Digest
    </div>
  </div>
</body>
</html>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmails,
          subject,
          html,
        }),
      });

      if (resendRes.ok) {
        emailSent = true;
      } else {
        console.warn("Resend digest failed:", await resendRes.text());
      }
    } catch (emailErr) {
      console.warn("Resend digest exception:", emailErr);
    }
  }

  // 10. Send Instant Telegram Alert if Bot Token is configured
  const tgToken = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  let telegramSent = false;

  if (tgToken && tgChatId) {
    try {
      const tgText = `${tgHeader}\n\n` +
        `👤 <b>Имя:</b> ${escapeHtml(displayName)}\n` +
        `📱 <b>Контакт:</b> ${escapeHtml(displayContact)}\n` +
        `🌐 <b>Источник (Smart Detect):</b> ${escapeHtml(smartSourceDisplay)}\n` +
        `⏱ <b>Активное время:</b> ${durationSeconds}с (~${durationMin} мин)\n` +
        `🏷 <b>Статус:</b> ${escapeHtml(sessionState || (isActualReturn ? `Повторный визит #${visitCount}` : "Первый визит"))}\n` +
        `🆔 <code>${escapeHtml(visitorId)}</code>\n\n` +
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
