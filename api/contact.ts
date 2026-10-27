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
    title: "US Geo Campaigns",
    subtitle: "AppsFlyer Performance, Protect360 & Partner Dashboards",
    items: [
      {
        id: "wsj-oct-perf",
        brand: "The Wall Street Journal",
        reportType: "October Performance (AF)",
        metric: "9,167 Installs · 8,369 App Opens · 1,982 Unique Purchases (21.6% Install-to-Purchase CR)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
        fileUrl: "https://upraiser.co.uk/snapshots/wsj-appsflyer-oct.png",
      },
      {
        id: "wsj-oct-p360",
        brand: "The Wall Street Journal",
        reportType: "October Protect360",
        metric: "6,349+ Clean Installs across top sources · ≤1% Fraud Rate (0% to 1% real-time & post-attribution)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
        fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360-oct.png",
      },
      {
        id: "wsj",
        brand: "The Wall Street Journal",
        reportType: "September Protect360",
        metric: "~14,000 Clean Installs · ≤1% Fraud Rate (0.13% on primary source)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
        fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360.png",
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
        id: "marketwatch-oct-perf",
        brand: "MarketWatch",
        reportType: "October Performance (AF)",
        metric: "964 Installs · 906 Roadblock Served · 138 Unique Purchases (14.3% Install-to-Purchase CR)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/marketwatch.png",
        fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-appsflyer-oct.png",
      },
      {
        id: "marketwatch",
        brand: "MarketWatch",
        reportType: "September Protect360",
        metric: "3,120 Clean Installs · 0.00% Fraud Rate across September 2026",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/marketwatch.png",
        fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-protect360.png",
      },
      {
        id: "barrons",
        brand: "Barron’s (Dow Jones)",
        reportType: "Protect360 Report",
        metric: "4,909 Clean Installs · 0.00% Fraud Rate (only 4 blocked real-time attributions)",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/barrons.png",
        fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png?v=2",
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
    title: "Tier1 & Tier2 Geo Campaigns",
    subtitle: "Vantage, Credcol & Autodoc Deep-Funnel Performance",
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
      {
        id: "autodoc",
        brand: "Autodoc",
        reportType: "AppsFlyer Performance (Aug '26)",
        metric: "28.77% D1 Retention · 55,486 Content Views · 2,229 Add-to-Carts · 121 Unique Purchases",
        iconUrl: "https://upraiser.co.uk/snapshots/icons/autodoc.png",
        fileUrl: "https://upraiser.co.uk/snapshots/autodoc-appsflyer.png",
      },
    ],
  },
];

export const ZIP_ARCHIVE_URL = "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip?v=3";

export function generateLeadSnapshotsEmailHtml(leadName?: string, leadEmail?: string): string {
  const cleanName = leadName?.trim() ? escapeHtml(leadName.trim()) : "";
  const greeting = cleanName ? `Hi ${cleanName},` : "Hello,";
  const encodedLead = leadEmail ? encodeURIComponent(leadEmail.trim()) : "";
  const trackedZipUrl = `https://upraiser.co.uk/api/proof?app=zip${encodedLead ? `&lead=${encodedLead}` : ""}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPRAISER - Raw Dashboards &amp; Performance Snapshots</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 28px 12px;">
    <tr>
      <td align="center">
        <!-- Main Wrapper (Clean White Paper Canvas) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);">
          
          <!-- Top Accent Ribbon (UPRAISER signature gradient) -->
          <tr>
            <td height="3" style="background: linear-gradient(90deg, #e63558 0%, #fecf09 50%, #e63558 100%);"></td>
          </tr>

          <!-- Header: Brand Logo & Title (/connect style) -->
          <tr>
            <td style="padding: 24px 28px 10px 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle" style="padding-right: 10px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 7px;">
                      <tr>
                        <td align="center" valign="middle" style="width: 28px; height: 28px; padding: 5px;">
                          <img src="https://upraiser.co.uk/upraiser-logo.png" alt="UPRAISER" width="18" height="18" style="display: block; width: 18px; height: 18px; object-fit: contain;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle">
                    <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.18em; color: #0f172a; text-transform: uppercase;">
                      UPRAISER
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro & Master Download Card -->
          <tr>
            <td style="padding: 6px 28px 16px 28px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.45; color: #0f172a; font-weight: 700;">
                ${greeting}
              </p>
              <p style="margin: 0 0 14px 0; font-size: 13.5px; line-height: 1.55; color: #475569; font-weight: 400;">
                Here are screenshots from AF (showing both performance and P360), and direct Client's CRM dashboards.
              </p>

              <!-- Compact Master ZIP Download Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                <tr>
                  <td valign="middle" style="padding-right: 10px;">
                    <div style="font-size: 12.5px; font-weight: 700; color: #0f172a;">
                      Complete Performance Portfolio <span style="font-weight: 500; color: #64748b; font-size: 11.5px;">· 12 raw snapshots (.zip · 22 MB)</span>
                    </div>
                  </td>
                  <td align="right" valign="middle" style="white-space: nowrap;">
                    <a href="${trackedZipUrl}" target="_blank" style="display: inline-block; background-color: #fecf09; color: #0f172a; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 7px 12px; border-radius: 7px;">
                      Download .ZIP
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Snapshot Sections -->
          ${SNAPSHOT_GROUPS.map((group, groupIdx) => `
          <tr>
            <td style="padding: ${groupIdx === 0 ? "2px" : "10px"} 28px 6px 28px;">
              <!-- Section Kicker -->
              <div style="font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #e63558; margin-bottom: 8px;">
                ${group.title}
              </div>

              <!-- Compact Cards List -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${group.items.map((item) => `
                <tr>
                  <td style="padding-bottom: 6px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px;">
                      <tr>
                        <!-- Icon -->
                        <td width="28" valign="middle" style="padding-right: 10px;">
                          <img src="${item.iconUrl}" alt="${escapeHtml(item.brand)}" width="28" height="28" style="display: block; width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e2e8f0; object-fit: cover; background-color: #ffffff;" />
                        </td>
                        <!-- Content -->
                        <td valign="middle" style="padding-right: 8px;">
                          <div style="font-size: 12.5px; font-weight: 700; color: #0f172a; line-height: 1.25;">
                            ${escapeHtml(item.brand)}
                            <span style="font-size: 11px; font-weight: 500; color: #64748b; margin-left: 4px;">· ${escapeHtml(item.reportType)}</span>
                          </div>
                          <div style="font-size: 11.5px; line-height: 1.35; color: #475569; margin-top: 2px;">
                            ${escapeHtml(item.metric)}
                          </div>
                        </td>
                        <!-- Action -->
                        <td align="right" valign="middle" style="white-space: nowrap;">
                          <a href="https://upraiser.co.uk/api/proof?app=${encodeURIComponent(item.id)}${encodedLead ? `&amp;lead=${encodedLead}` : ""}" target="_blank" style="font-size: 11px; font-weight: 700; color: #e63558; text-decoration: none;">
                            View ↗
                          </a>
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
            <td style="padding: 12px 28px 24px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em; line-height: 1.4; margin-bottom: 14px;">
                      Let’s perform a test with similar unit economics for Your app.
                    </div>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td>
                          <a href="mailto:alex@upraiser.co.uk?subject=Re:%20UPRAISER%20Pilot%20Economics" style="display: inline-block; background-color: #e63558; color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 11px 22px; border-radius: 10px; box-shadow: 0 3px 10px rgba(230, 53, 88, 0.22);">
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
            <td style="padding: 14px 28px 20px 28px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 10.5px; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #94a3b8; line-height: 1.6; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;">
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
    console.warn("Server email is not configured. Missing RESEND_API_KEY - autoresponder will be skipped.");
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
  const geo = parseGeo(req.headers);
  const ua = (req.headers["user-agent"] as string) || "";
  const device = parseDevice(ua);
  let prevCooldownMeta: Record<string, any> = {};

  if (supabaseAdmin && visitorId) {
    try {
      // 1. Insert form_submit action into lead_activity_logs (including baseline geo & device for forwarding detection)
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
            geo,
            device,
            userAgent: ua || telemetry?.userAgent || "unknown",
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

      // 3. Upsert into cooldowns with permanently identified display name (preserving any existing deck/session state)
      try {
        const { data: existingCd } = await supabaseAdmin
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", visitorId)
          .maybeSingle();
        if (existingCd?.metadata && typeof existingCd.metadata === "object") {
          prevCooldownMeta = existingCd.metadata;
        }
      } catch {}

      await supabaseAdmin.from("lead_notification_cooldowns").upsert(
        {
          visitor_id: visitorId,
          last_notified_at: new Date().toISOString(),
          last_event_type: "form_submit",
          metadata: {
            ...prevCooldownMeta,
            displayName: cleanName,
            leadContact: cleanContact,
            lastGeo: geo,
            lastDevice: device,
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

    // 2. Determine conference vs main website form context
    const isConference = appId.includes("Conference") || isRepeatAlert;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "UPRAISER Desk <pilot@upraiser.co.uk>";

    // 3. Send automated High-End UX Snapshots dossier directly to the lead (1 lead = 1 Resend email)
    // Internal team alerts are routed 100% to Telegram IMS2026 supergroup (0 Resend calls).
    let leadTargetEmail = (email || "").trim();
    if (!leadTargetEmail || leadTargetEmail === "conference-lead@upraiser.co.uk" || leadTargetEmail === "revisit-alert@upraiser.co.uk") {
      if (phone && phone.includes("@") && phone.includes(".")) {
        leadTargetEmail = phone.trim();
      } else if (cleanContact && cleanContact.includes("@") && cleanContact.includes(".")) {
        leadTargetEmail = cleanContact;
      }
    }

    const EMAIL_ASCII_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidLeadEmail =
      !isRepeatAlert &&
      Boolean(leadTargetEmail) &&
      EMAIL_ASCII_REGEX.test(leadTargetEmail) &&
      !leadTargetEmail.includes("conference-lead") &&
      !leadTargetEmail.includes("revisit-alert");

    let autoresponderSent = false;
    let autoresponderError: string | null = null;

    if (isValidLeadEmail && resendApiKey) {
      try {
        const leadHtml = generateLeadSnapshotsEmailHtml(cleanName, leadTargetEmail);
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
          autoresponderError = autoErr;
          console.error("Autoresponder Resend response error:", autoresponderRes.status, autoErr);
        } else {
          autoresponderSent = true;
          console.info("Autoresponder dossier successfully dispatched to lead:", leadTargetEmail);
        }
      } catch (leadEmailErr) {
        autoresponderError = leadEmailErr instanceof Error ? leadEmailErr.message : String(leadEmailErr);
        console.error("Autoresponder delivery warning to lead:", leadEmailErr);
      }
    }

    // 4. Send LOUD Telegram Instant Alert (disable_notification: false)
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
        const rawNotes = (notes || "").trim();
        const isLegacyFootprintDump =
          rawNotes.startsWith("[CONFERENCE HUB") || rawNotes.startsWith("[REPEAT HUB");
        const cleanUserNote = isLegacyFootprintDump ? "" : rawNotes;

        const shortIdMatch = String(visitorId || effectiveClickId || "").match(/_([a-z0-9]{4,6})$/i);
        const shortId = shortIdMatch
          ? `usr_${shortIdMatch[1].toLowerCase()}`
          : `usr_${String(visitorId || "anon").replace(/^hub_/, "").slice(0, 6).toLowerCase()}`;

        const emailDossierStatus = isValidLeadEmail
          ? autoresponderSent
            ? `✅ Отправлено на <code>${escapeHtml(leadTargetEmail)}</code>`
            : `⚠️ Ошибка Resend для <code>${escapeHtml(leadTargetEmail)}</code> (${escapeHtml((autoresponderError || "check logs").slice(0, 80))})`
          : `ℹ️ Не отправлялось (указан телефон / мессенджер)`;

        const filesSection =
          rawFiles.length > 0
            ? `📎 <b>Файлы (${rawFiles.length}):</b> ` +
              rawFiles
                .map(
                  (f: any) =>
                    `<a href="${escapeHtml(f.url || "")}">${escapeHtml(f.name || "Файл")}</a>${
                      f.size ? ` (${Math.round(f.size / 1024)} KB)` : ""
                    }`
                )
                .join(", ")
            : null;

        // Auto-Enrichment: detect corporate domain, phone, or Telegram handle
        const FREE_EMAIL_DOMAINS = new Set([
          "gmail.com",
          "googlemail.com",
          "icloud.com",
          "me.com",
          "mac.com",
          "yahoo.com",
          "yahoo.co.uk",
          "outlook.com",
          "hotmail.com",
          "live.com",
          "msn.com",
          "aol.com",
          "mail.ru",
          "inbox.ru",
          "bk.ru",
          "list.ru",
          "yandex.ru",
          "ya.ru",
          "yandex.com",
          "proton.me",
          "protonmail.com",
          "zoho.com",
          "gmx.com",
          "gmx.de",
          "web.de",
          "qq.com",
          "163.com",
          "126.com",
          "naver.com",
          "privaterelay.appleid.com",
        ]);

        let corpDomain = "";
        if (isValidLeadEmail && leadTargetEmail.includes("@")) {
          const domainPart = leadTargetEmail.split("@")[1]?.toLowerCase().trim() || "";
          if (domainPart && !FREE_EMAIL_DOMAINS.has(domainPart) && !domainPart.endsWith(".upraiser.co.uk")) {
            corpDomain = domainPart;
          }
        }

        // Build Quick-Action Inline Keyboard Buttons for Telegram
        const inlineButtons: Array<{ text: string; url: string }> = [];
        const rawContactTrimmed = cleanContact.trim();
        const digitsOnly = rawContactTrimmed.replace(/[^\d]/g, "");

        if (corpDomain) {
          inlineButtons.push({
            text: `🌐 ${corpDomain}`,
            url: `https://${corpDomain}`,
          });
        }

        if (rawContactTrimmed.startsWith("@") || /t\.me\/([a-zA-Z0-9_]+)/i.test(rawContactTrimmed)) {
          const tgHandle = rawContactTrimmed
            .replace(/^@/, "")
            .replace(/^https?:\/\/(www\.)?t\.me\//i, "")
            .split(/[/?\s]/)[0];
          if (tgHandle) {
            inlineButtons.push({
              text: `✈️ Написать @${tgHandle}`,
              url: `https://t.me/${tgHandle}`,
            });
          }
        } else if (!isValidLeadEmail && digitsOnly.length >= 7 && digitsOnly.length <= 15) {
          inlineButtons.push({
            text: `💬 WhatsApp`,
            url: `https://wa.me/${digitsOnly}`,
          });
          inlineButtons.push({
            text: `✈️ Telegram`,
            url: `https://t.me/+${digitsOnly}`,
          });
        }

        // Always add 1-tap LinkedIn lookup for the lead
        const linkedinQuery = corpDomain
          ? `${cleanName} ${corpDomain.split(".")[0]}`
          : cleanName;
        inlineButtons.push({
          text: `🔍 LinkedIn: ${cleanName.slice(0, 18)}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in/ ${linkedinQuery}`)}`,
        });

        let nowHHMM = "";
        try {
          nowHHMM = new Intl.DateTimeFormat("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Bucharest",
          }).format(new Date());
        } catch {
          nowHHMM = new Date().toISOString().slice(11, 16);
        }

        let tgLines: Array<string | null> = [];

        if (isConference) {
          const visitNum = telemetry?.visitCount || 1;
          const langCode = telemetry?.hubLang ? telemetry.hubLang.split(" ")[0] : "EN";
          const deviceLocale = telemetry?.locale ? ` (ОС: ${telemetry.locale})` : "";
          tgLines = [
            `🧗 <b>НОВЫЙ КОНТАКТ · /CONNECT</b>`,
            ``,
            `👤 <b>Имя:</b> <b>${escapeHtml(cleanName)}</b>`,
            `📱 <b>Контакт:</b> <code>${escapeHtml(cleanContact)}</code>`,
            corpDomain
              ? `🏢 <b>Компания:</b> <a href="https://${escapeHtml(corpDomain)}"><b>${escapeHtml(corpDomain)}</b> ↗</a>`
              : null,
            cleanUserNote ? `📝 <b>Заметка:</b> <i>${escapeHtml(cleanUserNote)}</i>` : null,
            `📨 <b>Письмо с пруфами:</b> ${emailDossierStatus}`,
            `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`,
            `🏷 <b>Сессия:</b> ${escapeHtml(nowHHMM)} · Визит #${visitNum} · Язык: ${escapeHtml(langCode)}${escapeHtml(deviceLocale)} · <code>[${escapeHtml(shortId)}]</code>`,
          ];
        } else {
          tgLines = [
            `🚀 <b>ЗАЯВКА НА ПИЛОТ · САЙТ</b>`,
            ``,
            `👤 <b>Имя:</b> <b>${escapeHtml(cleanName)}</b>`,
            `📱 <b>Email:</b> <code>${escapeHtml(cleanContact)}</code>`,
            corpDomain
              ? `🏢 <b>Домен:</b> <a href="https://${escapeHtml(corpDomain)}"><b>${escapeHtml(corpDomain)}</b> ↗</a>`
              : null,
            `📲 <b>Приложение:</b> ${escapeHtml(appId)}${geos ? ` (${escapeHtml(geos)})` : ""}`,
            `💼 <b>Профиль:</b> ${escapeHtml(companyType)} (${escapeHtml(companySize)}) · Бюджет: ${escapeHtml(monthlyBudget)}`,
            cleanUserNote ? `📝 <b>Заметка:</b> <i>${escapeHtml(cleanUserNote)}</i>` : null,
            filesSection,
            `📨 <b>Письмо с пруфами:</b> ${emailDossierStatus}`,
            `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`,
          ];
        }

        const tgText = tgLines.filter((line) => line !== null).join("\n");

        // 4A. Retroactive Deanonymization of Earlier Session Card in Telegram ("Магия деанонимизации задним числом")
        const priorSessionMsgId = prevCooldownMeta?.session_message_id
          ? Number(prevCooldownMeta.session_message_id)
          : null;
        let updatedTimeline = Array.isArray(prevCooldownMeta?.session_timeline)
          ? [...prevCooldownMeta.session_timeline]
          : [];

        if (priorSessionMsgId && updatedTimeline.length > 0) {
          try {
            let timeStr = "";
            try {
              timeStr = new Intl.DateTimeFormat("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Bucharest",
              }).format(new Date());
            } catch {
              timeStr = new Date().toISOString().slice(11, 16);
            }

            updatedTimeline.push({
              key: `clipin_${Date.now()}`,
              time: timeStr,
              line: `• ${timeStr} — 🧗 Оставил контакт: <b>${escapeHtml(cleanName)}</b> (<code>${escapeHtml(cleanContact)}</code>)`,
            });

            const retroWho = `<b>${escapeHtml(cleanName)}</b> (${escapeHtml(cleanContact)})`;
            const retroSessionHtml = [
              `🧭 <b>АКТИВНОСТЬ НА ХАБЕ · <code>[${escapeHtml(shortId)}]</code></b>`,
              `👤 <b>Лид:</b> ${retroWho}`,
              `📍 <b>Локация и девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`,
              ``,
              `📋 <b>Хронология действий в сессии:</b>`,
              updatedTimeline.map((item: any) => item.line).join("\n"),
            ].join("\n");

            await fetch(`https://api.telegram.org/bot${tgToken}/editMessageText`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: tgChatId,
                message_id: priorSessionMsgId,
                text: retroSessionHtml,
                parse_mode: "HTML",
                disable_web_page_preview: true,
              }),
            });
          } catch (retroErr) {
            console.warn("Retroactive session card edit warning:", retroErr);
          }
        }

        // 4B. Send the Loud Lead Contact Card (replying to the session card if one existed + inline action buttons)
        const sendPayload: Record<string, any> = {
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_notification: false, // Loud push with sound & vibration!
          disable_web_page_preview: true,
        };

        if (inlineButtons.length > 0) {
          sendPayload.reply_markup = {
            inline_keyboard: [inlineButtons.slice(0, 3)],
          };
        }

        if (priorSessionMsgId) {
          sendPayload.reply_parameters = {
            message_id: priorSessionMsgId,
            allow_sending_without_reply: true,
          };
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendPayload),
        });
        const tgJson: any = await tgRes.json().catch(() => ({}));
        const leadCardMessageId: number | null = tgJson?.result?.message_id
          ? Number(tgJson.result.message_id)
          : null;

        // 4C. Persist lead_card_message_id in Supabase so future proof clicks & revisits reply to this card!
        if (supabaseAdmin && leadCardMessageId) {
          const sharedMeta = {
            ...prevCooldownMeta,
            displayName: cleanName,
            leadContact: cleanContact,
            leadEmail: leadTargetEmail ? leadTargetEmail.toLowerCase() : null,
            lead_card_message_id: leadCardMessageId,
            session_timeline: updatedTimeline,
            lastGeo: geo,
            lastDevice: device,
            identifiedAt: new Date().toISOString(),
          };

          if (visitorId) {
            await supabaseAdmin.from("lead_notification_cooldowns").upsert(
              {
                visitor_id: visitorId,
                last_notified_at: new Date().toISOString(),
                last_event_type: "form_submit",
                metadata: sharedMeta,
              },
              { onConflict: "visitor_id" }
            );
          }

          if (leadTargetEmail) {
            const emailKey = `email_${leadTargetEmail.toLowerCase()}`;
            await supabaseAdmin.from("lead_notification_cooldowns").upsert(
              {
                visitor_id: emailKey,
                last_notified_at: new Date().toISOString(),
                last_event_type: "form_submit",
                metadata: {
                  ...sharedMeta,
                  linkedVisitorId: visitorId || null,
                },
              },
              { onConflict: "visitor_id" }
            );
          }
        }
      } catch (tgErr) {
        console.warn("Telegram notification warning in contact handler:", tgErr);
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, leadTargetEmail, autoresponderSent }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Failed to deliver pilot brief" })
    );
  }
}
