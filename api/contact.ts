/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: true,
  },
};

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/msword", // .doc
  "application/vnd.ms-excel", // .xls
  "text/csv",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface SnapshotCardData {
  id: string;
  brand: string;
  reportType: string;
  metric: string;
  iconUrl: string;
  fileUrl: string;
}

export const SNAPSHOT_GROUPS = [
  {
    title: "01 / TIER-1 MEDIA & CONSUMER APPS",
    subtitle: "Protect360 & AppsFlyer Attributions",
    items: [
      {
        id: "wsj",
        brand: "The Wall Street Journal",
        reportType: "Protect360 Report",
        metric: "~14,000 Clean Installs · ≤1% Fraud Rate (0.13% on primary source, -98% fraud trend)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
        fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360.png",
      },
      {
        id: "barrons",
        brand: "Barron’s (Dow Jones)",
        reportType: "Protect360 Report",
        metric: "4,909 Clean Installs · 0.00% Fraud Rate (only 4 blocked real-time attributions)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/barrons.png",
        fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png",
      },
      {
        id: "marketwatch",
        brand: "MarketWatch",
        reportType: "Protect360 Report",
        metric: "3,120 Clean Installs · 0.00% Fraud Rate across September 2026",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/marketwatch.png",
        fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-protect360.png",
      },
      {
        id: "fetch",
        brand: "Fetch Rewards",
        reportType: "AppsFlyer Performance",
        metric: "6,815 Non-Organic Installs · 8.88% Install-to-Sign-Up CR (605 registrations)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/fetch.png",
        fileUrl: "https://upraiser.co.uk/snapshots/fetch-appsflyer.png",
      },
    ],
  },
  {
    title: "02 / FINTECH, TRADING & FANTASY SPORTS",
    subtitle: "LTV & Deep Funnel Conversions",
    items: [
      {
        id: "vantage",
        brand: "Vantage Trading",
        reportType: "Partner Dashboard",
        metric: "87.5% QFTD Conversion (133 QFTDs in Oct) · $122,500 Lifetime Commission",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/vantage.png",
        fileUrl: "https://upraiser.co.uk/snapshots/vantage-trading.png",
      },
      {
        id: "underdog",
        brand: "Underdog Fantasy",
        reportType: "Partner Dashboard",
        metric: "184 FTDs across active codes · Up to $137 Avg FTD & $441 Sum Deposit",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/underdog.png",
        fileUrl: "https://upraiser.co.uk/snapshots/underdog-fantasy.png",
      },
      {
        id: "credcol-funnel",
        brand: "Credcol (Fintech)",
        reportType: "AppsFlyer Funnel",
        metric: "13,015 Installs in 15 days · 1,953 D1 Sign-ups · 1,777 Completed Funnel Steps (LTV)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/credcol.png",
        fileUrl: "https://upraiser.co.uk/snapshots/credcol-funnel.png",
      },
      {
        id: "credcol-audit",
        brand: "Credcol (Fintech)",
        reportType: "Protect360 Audit",
        metric: "12,609 Verified Attributions · 0 Fraudulent Installs (0.00% Fraud Rate)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/credcol.png",
        fileUrl: "https://upraiser.co.uk/snapshots/credcol-protect360.png",
      },
    ],
  },
];

export const ZIP_ARCHIVE_URL = "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip";

export function generateLeadSnapshotsEmailHtml(leadName?: string): string {
  const cleanName = leadName?.trim() ? escapeHtml(leadName.trim()) : "";
  const greeting = cleanName ? `Hi ${cleanName},` : "Hello,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPRAISER — Raw Dashboards &amp; Performance Snapshots</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Wrapper (Clean White Paper Canvas) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);">
          
          <!-- Top Accent Ribbon (UPRAISER signature gradient) -->
          <tr>
            <td height="3" style="background: linear-gradient(90deg, #e63558 0%, #fecf09 50%, #e63558 100%);"></td>
          </tr>

          <!-- Header: Brand Logo & Title (/connect style) -->
          <tr>
            <td style="padding: 36px 36px 18px 36px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle" style="padding-right: 12px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                      <tr>
                        <td align="center" valign="middle" style="width: 34px; height: 34px; padding: 6px;">
                          <img src="https://upraiser.co.uk/upraiser-logo.png" alt="UPRAISER" width="20" height="20" style="display: block; width: 20px; height: 20px; object-fit: contain;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle">
                    <span style="font-size: 13px; font-weight: 800; letter-spacing: 0.18em; color: #0f172a; text-transform: uppercase;">
                      UPRAISER
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro & Master Download Card -->
          <tr>
            <td style="padding: 10px 36px 26px 36px;">
              <p style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.5; color: #0f172a; font-weight: 700;">
                ${greeting}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569; font-weight: 400;">
                Here are raw snapshots from AF, P360, and direct advertiser CRM dashboards.
              </p>

              <!-- Master ZIP Download Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="padding-right: 16px;">
                          <div style="font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">
                            Complete Performance Portfolio
                          </div>
                          <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                            All 8 raw uncompressed snapshots in one bundle (.zip · 15 MB)
                          </div>
                        </td>
                        <td align="right" valign="middle" style="white-space: nowrap;">
                          <a href="${ZIP_ARCHIVE_URL}" target="_blank" style="display: inline-block; background-color: #fecf09; color: #0f172a; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 11px 18px; border-radius: 10px; box-shadow: 0 2px 8px rgba(254, 207, 9, 0.35);">
                            Download All (.zip)
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Snapshot Sections -->
          ${SNAPSHOT_GROUPS.map((group, groupIdx) => `
          <tr>
            <td style="padding: ${groupIdx === 0 ? "6px" : "18px"} 36px 8px 36px;">
              <!-- Section Kicker -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #e63558;">
                      ${group.title}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 3px; font-weight: 500;">
                      ${group.subtitle}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Cards List -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${group.items.map((item) => `
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px;">
                      <tr>
                        <!-- Icon -->
                        <td width="44" valign="top" style="padding-right: 14px;">
                          <img src="${item.iconUrl}" alt="${escapeHtml(item.brand)}" width="44" height="44" style="display: block; width: 44px; height: 44px; border-radius: 10px; border: 1px solid #e2e8f0; object-fit: cover; background-color: #ffffff;" />
                        </td>
                        <!-- Content -->
                        <td valign="top">
                          <div style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                            ${escapeHtml(item.brand)}
                            <span style="font-size: 11px; font-weight: 600; color: #64748b; margin-left: 6px;">· ${escapeHtml(item.reportType)}</span>
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #334155; margin-top: 5px; font-weight: 400;">
                            ${escapeHtml(item.metric)}
                          </div>
                          <div style="margin-top: 10px;">
                            <a href="${item.fileUrl}" target="_blank" style="display: inline-block; font-size: 11px; font-weight: 700; color: #e63558; text-decoration: none; letter-spacing: 0.04em; text-transform: uppercase;">
                              View Full Screen ↗
                            </a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join("")}
              </table>
            </td>
          </tr>
          `).join("")}

          <!-- Closing Block (Outro) -->
          <tr>
            <td style="padding: 24px 36px 36px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 26px 20px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em; line-height: 1.4; margin-bottom: 20px;">
                      Let’s perform a test with similar unit economics for Your app.
                    </div>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td>
                          <a href="mailto:alex@upraiser.co.uk?subject=Re:%20UPRAISER%20Pilot%20Economics" style="display: inline-block; background-color: #e63558; color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 13px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(230, 53, 88, 0.25);">
                            Reply to Start Pilot
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px 36px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #94a3b8; line-height: 1.6; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;">
                UPRAISER Agency LLP · London · Since 2017
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS & Options
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

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Server email is not configured. Missing RESEND_API_KEY." }));
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseAdmin = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  let body: any = {};
  if ((req as any).body) {
    try {
      body = typeof (req as any).body === "string" ? JSON.parse((req as any).body) : (req as any).body;
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Malformed JSON payload in req.body" }));
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
      return res.end(JSON.stringify({ ok: false, error: "Malformed JSON payload" }));
    }
  }

  const {
    name = "",
    email = "",
    phone = "",
    appId = "",
    geos = "",
    companyType = "brand",
    companySize = "boutique",
    monthlyBudget = "pilot",
    notes = "",
    telemetry = null,
    isRepeatAlert = false,
    files = [],
    filePath = null,
    fileUrl = null,
    fileName = null,
    fileType = null,
    fileSize = null,
  } = body;

  if (!name.trim() || !email.trim() || !appId.trim()) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Required fields missing (name, email, appId)." }));
  }

  const rawFiles: Array<{ name: string; size?: number; type?: string; filePath: string; url?: string }> =
    Array.isArray(files) && files.length > 0
      ? files
      : filePath
      ? [{ name: fileName || "client-brief-attachment", size: fileSize, type: fileType, filePath, url: fileUrl }]
      : [];

  let attachments: Array<{ filename: string; content: string }> | undefined;

  // Sync identity & persist form_submit activity to Supabase if visitorId is present
  const visitorId = telemetry?.visitorId || body?.visitorId;
  const effectiveClickId = telemetry?.clickId || body?.clickId || (body as any)?.click_id || visitorId;
  const cleanName = name.trim();
  const cleanContact = (phone || email).trim();

  if (supabaseAdmin && visitorId) {
    try {
      // 1. Insert form_submit action into lead_activity_logs
      await supabaseAdmin.from("lead_activity_logs").insert([
        {
          visitor_id: visitorId,
          lead_name: cleanName,
          lead_contact: cleanContact,
          event_type: "form_submit",
          duration_seconds: 0,
          metadata: {
            appId,
            geos,
            companyType,
            companySize,
            monthlyBudget,
            isRepeatAlert,
            notes,
            telemetry,
            click_id: effectiveClickId,
            userAgent: req.headers["user-agent"] || telemetry?.userAgent || "unknown",
            ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
          },
        },
      ]);

      // 2. Retroactively link all past anonymous activity logs for this visitor
      await supabaseAdmin
        .from("lead_activity_logs")
        .update({
          lead_name: cleanName,
          lead_contact: cleanContact,
        })
        .eq("visitor_id", visitorId)
        .is("lead_name", null);

      // 3. Upsert into cooldowns with permanently identified display name
      await supabaseAdmin.from("lead_notification_cooldowns").upsert(
        {
          visitor_id: visitorId,
          last_notified_at: new Date().toISOString(),
          last_event_type: "form_submit",
          metadata: {
            displayName: cleanName,
            leadContact: cleanContact,
            identifiedAt: new Date().toISOString(),
          },
        },
        { onConflict: "visitor_id" }
      );
    } catch (syncErr) {
      console.warn("Supabase identity sync warning in contact handler:", syncErr);
    }
  }

  try {
    // 1. Validate and download files from Supabase Storage if attached
    if (rawFiles.length > 0 && supabaseAdmin) {
      attachments = [];
      for (const f of rawFiles) {
        if (!f.filePath) continue;
        if (f.size && f.size > MAX_FILE_SIZE) continue;
        if (f.type && !ALLOWED_MIME_TYPES.has(f.type)) continue;

        try {
          const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
            .from("temp-briefs")
            .download(f.filePath);

          if (!downloadError && fileBlob) {
            const buffer = Buffer.from(await fileBlob.arrayBuffer());
            attachments.push({
              filename: f.name || "brief-attachment",
              content: buffer.toString("base64"),
            });
          }
        } catch (downloadErr) {
          console.warn("Failed to download brief attachment from Supabase:", f.filePath, downloadErr);
        }
      }
      if (attachments.length === 0) attachments = undefined;
    }

    // 2. Format HTML email
    const DEFAULT_RECIPIENTS = ["info@upraiser.co.uk", "alex@upraiser.co.uk", "ceo@upraiser.co.uk"];
    const notificationEnv = process.env.NOTIFICATION_EMAIL;
    const toEmails = notificationEnv
      ? notificationEnv.split(/[,;]/).map((e) => e.trim()).filter(Boolean)
      : DEFAULT_RECIPIENTS;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "UPRAISER Desk <pilot@upraiser.co.uk>";

    const isConference = appId.includes("Conference") || isRepeatAlert;
    const headerBorder = isRepeatAlert ? "#FECF09" : isConference ? "#e63558" : "#cb310d";
    const headerTitle = isRepeatAlert
      ? "🔁 Repeat Hub Visitor Signal · UPRAISER"
      : isConference
      ? "🧗 New Conference Lead (Clip In) · UPRAISER"
      : "🚀 New Pilot Request · UPRAISER";
    const headerSub = isRepeatAlert
      ? "A visitor or saved contact has reopened upraiser.co.uk/connect"
      : isConference
      ? "Direct On-Site Lead captured via /connect"
      : "Submitted via upraiser.co.uk · Direct Agency Lead";

    let emailSubject = `[UPRAISER Pilot] ${name} · ${appId} (${monthlyBudget})`;
    if (isRepeatAlert) {
      emailSubject = `🔁 [HUB REVISIT] ${name} reopened /connect (${telemetry?.timeZone || "On-Site"})`;
    } else if (isConference) {
      const stateBadge = telemetry?.sessionState?.includes("Repeat") ? "REPEAT VISIT" : "CLIP IN";
      const contactVal = email.includes("@") && !email.includes("conference-lead") && !email.includes("revisit-alert") ? email : (phone || name);
      emailSubject = `🧗 [CONFERENCE LEAD · ${stateBadge}] ${name} · ${contactVal}`;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8fa; margin: 0; padding: 24px; color: #111827; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f1115; padding: 24px 32px; border-bottom: 2px solid ${headerBorder}; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0; color: #9ca3af; font-size: 13px; }
    .content { padding: 32px; }
    .grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .row { display: table-row; }
    .cell-label { display: table-cell; width: 35%; padding: 10px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-weight: 600; color: #4b5563; }
    .cell-value { display: table-cell; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827; }
    .notes-box { background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; padding: 16px; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap; margin-top: 8px; }
    .attachment-box { margin-top: 20px; padding: 12px 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe; font-size: 13px; color: #1e40af; }
    .footer { padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${headerTitle}</h1>
      <p>${headerSub}</p>
    </div>
    <div class="content">
      <div class="grid">
        ${isConference ? `
        <div class="row">
          <div class="cell-label">Client Name & Callsign</div>
          <div class="cell-value"><strong>${escapeHtml(name)}</strong></div>
        </div>
        <div class="row">
          <div class="cell-label">Direct Contact</div>
          <div class="cell-value">
            <a href="${email.includes('@') && !email.includes('conference-lead') && !email.includes('revisit-alert') ? `mailto:${escapeHtml(email)}` : (phone ? `tel:${escapeHtml(phone)}` : '#')}" style="color: #cb310d; font-weight: 600; text-decoration: underline;">
              ${escapeHtml(email.includes('@') && !email.includes('conference-lead') && !email.includes('revisit-alert') ? email : (phone || email))}
            </a>
          </div>
        </div>
        ${telemetry?.sessionState ? `
        <div class="row">
          <div class="cell-label">Session State</div>
          <div class="cell-value">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 12px; font-family: monospace; ${telemetry.sessionState.includes('Repeat') ? 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;' : 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;'}">
              ${escapeHtml(telemetry.sessionState)}
            </span>
          </div>
        </div>` : ""}
        ${telemetry?.timestampFormatted ? `
        <div class="row">
          <div class="cell-label">Scan Timestamp</div>
          <div class="cell-value"><strong>${escapeHtml(telemetry.timestampFormatted)}</strong> <span style="color: #6b7280; font-size: 12px;">(${escapeHtml(telemetry.timeZone || "UTC")})</span></div>
        </div>` : ""}
        ${telemetry?.viewport ? `
        <div class="row">
          <div class="cell-label">Screen & Viewport</div>
          <div class="cell-value">${escapeHtml(telemetry.viewport)} <span style="color: #6b7280; font-size: 12px;">(${escapeHtml(telemetry.screenResolution || "")} · ${escapeHtml(telemetry.orientation || "")})</span></div>
        </div>` : ""}
        ${telemetry?.locale ? `
        <div class="row">
          <div class="cell-label">Browser Locale</div>
          <div class="cell-value"><code>${escapeHtml(telemetry.locale)}</code> <span style="color: #6b7280; font-size: 12px;">(Languages: ${escapeHtml(telemetry.languages || "")})</span></div>
        </div>` : ""}
        ${telemetry?.hubLang ? `
        <div class="row">
          <div class="cell-label">Preferred Hub Lang</div>
          <div class="cell-value"><strong>${escapeHtml(telemetry.hubLang)}</strong></div>
        </div>` : ""}
        ${effectiveClickId ? `
        <div class="row">
          <div class="cell-label">Click ID (Lead Token)</div>
          <div class="cell-value"><code>${escapeHtml(effectiveClickId)}</code></div>
        </div>` : ""}
        <div class="row">
          <div class="cell-label">Channel Source</div>
          <div class="cell-value">${escapeHtml(appId)} (${escapeHtml(geos || "On-Site")})</div>
        </div>
        ` : `
        <div class="row">
          <div class="cell-label">Client Name & Title</div>
          <div class="cell-value"><strong>${escapeHtml(name)}</strong></div>
        </div>
        <div class="row">
          <div class="cell-label">Corporate Email</div>
          <div class="cell-value"><a href="mailto:${escapeHtml(email)}" style="color: #cb310d; text-decoration: underline;">${escapeHtml(email)}</a></div>
        </div>
        <div class="row">
          <div class="cell-label">App ID / Store URL</div>
          <div class="cell-value">${escapeHtml(appId)}</div>
        </div>
        <div class="row">
          <div class="cell-label">Target GEOs</div>
          <div class="cell-value">${escapeHtml(geos || "Worldwide / unspecified")}</div>
        </div>
        <div class="row">
          <div class="cell-label">Company Type</div>
          <div class="cell-value">${escapeHtml(companyType)}</div>
        </div>
        <div class="row">
          <div class="cell-label">Company Size</div>
          <div class="cell-value">${escapeHtml(companySize)}</div>
        </div>
        <div class="row">
          <div class="cell-label">Monthly Media Spend</div>
          <div class="cell-value"><strong>${escapeHtml(monthlyBudget)}</strong></div>
        </div>
        `}
      </div>

      <div style="font-size: 13px; font-weight: 600; color: #4b5563; margin-top: 16px;">${isConference ? "Telemetry Footprint & Dispatch Notes:" : "Brief Details & Project Notes:"}</div>
      <div class="notes-box">${escapeHtml(notes || "No additional comments provided.")}</div>

      ${rawFiles.length > 0 ? `
        <div class="attachment-box">
          📎 <strong>Attached Brief Files (${rawFiles.length}):</strong>
          <ul style="margin: 8px 0 0; padding-left: 18px; line-height: 1.6;">
            ${rawFiles.map((f, i) => `
              <li style="margin: 4px 0;">
                <strong>${escapeHtml(f.name)}</strong> ${f.size ? `(${(f.size / 1024).toFixed(0)} KB)` : ""}
                ${f.url ? ` · <a href="${f.url}" style="color: #1e40af; font-weight: 600; text-decoration: underline;" target="_blank">⬇️ Download / Open</a>` : ""}
              </li>
            `).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
    <div class="footer">
      Upraiser Agency LLP · 128 City Road, London EC1V 2NX · info@upraiser.co.uk
    </div>
  </div>
</body>
</html>
    `;

    // 3. Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        reply_to: email,
        subject: emailSubject,
        html,
        attachments,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      res.writeHead(resendResponse.status, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: `Resend error: ${errorText}` }));
    }

    // 3b. Send automated High-End UX Snapshots dossier directly to the lead
    let leadTargetEmail = (email || "").trim();
    if (!leadTargetEmail || leadTargetEmail === "conference-lead@upraiser.co.uk") {
      if (phone && phone.includes("@") && phone.includes(".")) {
        leadTargetEmail = phone.trim();
      } else if (cleanContact && cleanContact.includes("@") && cleanContact.includes(".")) {
        leadTargetEmail = cleanContact;
      }
    }

    const isValidLeadEmail =
      Boolean(leadTargetEmail) &&
      leadTargetEmail.includes("@") &&
      leadTargetEmail.includes(".") &&
      !leadTargetEmail.includes("conference-lead") &&
      !leadTargetEmail.includes("revisit-alert");

    if (isValidLeadEmail) {
      try {
        const leadHtml = generateLeadSnapshotsEmailHtml(cleanName);
        const autoresponderRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [leadTargetEmail],
            reply_to: "alex@upraiser.co.uk",
            subject: "UPRAISER — Raw Dashboards & Performance Snapshots (Protect360 · AppsFlyer)",
            html: leadHtml,
          }),
        });
        if (!autoresponderRes.ok) {
          const autoErr = await autoresponderRes.text();
          console.error("Autoresponder Resend response error:", autoresponderRes.status, autoErr);
        } else {
          console.info("Autoresponder dossier successfully dispatched to lead:", leadTargetEmail);
        }
      } catch (leadEmailErr) {
        console.error("Autoresponder delivery warning to lead:", leadEmailErr);
      }
    }

    // 4. Send Telegram instant notification if configured
    const tgToken = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      try {
        const tgHeader = isRepeatAlert
          ? `<b>🔁 [HUB REVISIT ALERT] Лид вернулся на /connect!</b>`
          : isConference
          ? `<b>🧗 [НОВЫЙ ЛИД · CLIP IN] Лид оставил контакты!</b>`
          : `<b>🚀 [НОВАЯ ЗАЯВКА НА ПИЛОТ]</b>`;

        const tgText =
          `${tgHeader}\n\n` +
          `👤 <b>Имя:</b> ${escapeHtml(cleanName)}\n` +
          `📱 <b>Контакт:</b> ${escapeHtml(cleanContact)}\n` +
          (effectiveClickId ? `🎯 <b>Click ID:</b> <code>${escapeHtml(effectiveClickId)}</code>\n` : "") +
          (telemetry?.hubLang ? `🌐 <b>Язык хаба:</b> ${escapeHtml(telemetry.hubLang)}\n` : "") +
          (telemetry?.sessionState ? `🏷 <b>Статус:</b> ${escapeHtml(telemetry.sessionState)}\n` : "") +
          (telemetry?.viewport ? `📱 <b>Экран:</b> ${escapeHtml(telemetry.viewport)}\n` : "") +
          (!isConference && companyType ? `🏢 <b>Тип:</b> ${escapeHtml(companyType)} (${escapeHtml(companySize)})\n` : "") +
          (!isConference && monthlyBudget ? `💰 <b>Бюджет:</b> ${escapeHtml(monthlyBudget)}\n` : "") +
          `\n<b>Footprint & Notes:</b>\n<code>${escapeHtml((notes || "No notes").slice(0, 600))}</code>`;

        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgText,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });
      } catch (tgErr) {
        console.warn("Telegram notification warning in contact handler:", tgErr);
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Failed to deliver pilot brief" })
    );
  }
}
