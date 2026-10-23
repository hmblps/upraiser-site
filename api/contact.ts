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

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Failed to deliver pilot brief" })
    );
  }
}
