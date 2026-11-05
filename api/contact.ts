/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: true,
  },
};

const MODERATION_RECIPIENTS = ["alex@upraiser.co.uk", "ceo@upraiser.co.uk"];

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

function computeModerationSig(email: string, name: string): string {
  const secret =
    process.env.RESEND_API_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "upraiser_moderation_secret_2026";
  const payload = `${email.trim().toLowerCase()}|${name.trim()}`;
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 24);
}

function analyzeLeadEmailDomain(email: string): {
  emailDomain: string;
  corpDomain: string;
  isCorporate: boolean;
} {
  const clean = (email || "").trim().toLowerCase();
  const emailDomain = clean.includes("@") ? clean.split("@")[1]?.trim() || "" : "";
  const isCorporate =
    Boolean(emailDomain) &&
    !FREE_EMAIL_DOMAINS.has(emailDomain) &&
    !emailDomain.endsWith(".upraiser.co.uk");
  return {
    emailDomain,
    corpDomain: isCorporate ? emailDomain : "",
    isCorporate,
  };
}

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

export interface ModerationEmailParams {
  leadName: string;
  leadEmail: string;
  emailDomain: string;
  corpDomain: string;
  isCorporate: boolean;
  isConference: boolean;
  appId: string;
  geos: string;
  companyType: string;
  companySize: string;
  monthlyBudget: string;
  notes: string;
  geo: string;
  device: string;
  approveUrl: string;
  rejectUrl: string;
  linkedinUrl: string;
}

export function generateModerationEmailHtml(p: ModerationEmailParams): string {
  const domainBoxHtml = p.isCorporate
    ? `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
        <tr>
          <td>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #047857; margin-bottom: 4px;">
              🏢 Корпоративный домен обнаружен
            </div>
            <div style="font-size: 18px; font-weight: 800; color: #064e3b; letter-spacing: -0.01em; margin-bottom: 8px;">
              ${escapeHtml(p.corpDomain)}
            </div>
            <div style="font-size: 12px; font-weight: 700;">
              <a href="https://${escapeHtml(p.corpDomain)}" target="_blank" style="color: #059669; text-decoration: none; margin-right: 14px;">🌐 Открыть ${escapeHtml(p.corpDomain)} ↗</a>
              <a href="${escapeHtml(p.linkedinUrl)}" target="_blank" style="color: #0f172a; text-decoration: none;">🔍 Найти в LinkedIn ↗</a>
            </div>
          </td>
        </tr>
      </table>`
    : `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
        <tr>
          <td>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #b45309; margin-bottom: 4px;">
              ⚠️ Личный почтовый сервис
            </div>
            <div style="font-size: 16px; font-weight: 800; color: #78350f; margin-bottom: 8px;">
              ${escapeHtml(p.emailDomain || p.leadEmail)}
            </div>
            <div style="font-size: 12px; font-weight: 700;">
              <a href="${escapeHtml(p.linkedinUrl)}" target="_blank" style="color: #92400e; text-decoration: none;">🔍 Проверить ${escapeHtml(p.leadName)} в LinkedIn ↗</a>
            </div>
          </td>
        </tr>
      </table>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Модерация отправки скриншотов — ${escapeHtml(p.leadName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #e63558 0%, #fecf09 50%, #10b981 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 22px 24px 12px 24px;">
              <div style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.14em; color: #e63558; text-transform: uppercase; margin-bottom: 4px;">
                UPRAISER · КОНТРОЛЬ ОТПРАВКИ ПРУФОВ
              </div>
              <div style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">
                Выслать 12 скриншотов этому лиду?
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 24px 18px 24px;">
              ${domainBoxHtml}

              <!-- Action Buttons -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <a href="${escapeHtml(p.approveUrl)}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #10b981; color: #ffffff; font-size: 13.5px; font-weight: 800; text-align: center; text-decoration: none; padding: 14px 18px; border-radius: 11px; letter-spacing: 0.02em;">
                      ✅ Выслать скриншоты на ${escapeHtml(p.leadEmail)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${escapeHtml(p.rejectUrl)}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; font-size: 12.5px; font-weight: 700; text-align: center; text-decoration: none; padding: 11px 18px; border-radius: 11px;">
                      ❌ Не высылать (Отклонить)
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Lead Dossier Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
                <tr>
                  <td style="font-size: 12.5px; line-height: 1.65; color: #334155;">
                    <div><strong>👤 Имя:</strong> ${escapeHtml(p.leadName)}</div>
                    <div><strong>📧 Email:</strong> <a href="mailto:${escapeHtml(p.leadEmail)}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${escapeHtml(p.leadEmail)}</a></div>
                    <div><strong>🧭 Источник:</strong> ${p.isConference ? "Конференц-хаб (/connect)" : "Основной сайт (/contact)"}</div>
                    ${
                      !p.isConference && p.appId
                        ? `<div><strong>📲 Приложение:</strong> ${escapeHtml(p.appId)}${p.geos ? ` (${escapeHtml(p.geos)})` : ""}</div>
                           <div><strong>💼 Профиль:</strong> ${escapeHtml(p.companyType)} (${escapeHtml(p.companySize)}) · Бюджет: ${escapeHtml(p.monthlyBudget)}</div>`
                        : ""
                    }
                    ${p.notes ? `<div><strong>📝 Заметка:</strong> <em>${escapeHtml(p.notes)}</em></div>` : ""}
                    <div><strong>📍 Гео и девайс:</strong> ${escapeHtml(p.geo)} · ${escapeHtml(p.device)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 24px 18px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.45;">
                Статус синхронизируется между <strong>alex@upraiser.co.uk</strong>, <strong>ceo@upraiser.co.uk</strong> и Telegram. Повторная отправка одному лиду заблокирована.
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

function renderModerationConsoleHtml(params: {
  intent: "approve" | "reject";
  leadName: string;
  leadEmail: string;
  vid: string;
  sig: string;
  status: "pending" | "approved" | "rejected";
  decidedAt?: string;
  geo?: string;
  device?: string;
  notes?: string;
  appId?: string;
  isConference?: boolean;
}): string {
  const { emailDomain, corpDomain, isCorporate } = analyzeLeadEmailDomain(params.leadEmail);
  const linkedinQuery = corpDomain ? `${params.leadName} ${corpDomain.split(".")[0]}` : params.leadName;
  const linkedinUrl = `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in/ ${linkedinQuery}`)}`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Модерация пруфов · ${escapeHtml(params.leadName)} | UPRAISER</title>
  <style>
    :root {
      --bg: #f1f5f9;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #475569;
      --green: #10b981;
      --red: #e11d48;
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100dvh;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: calc(16px + env(safe-area-inset-top, 0px)) 16px calc(24px + env(safe-area-inset-bottom, 0px)) 16px;
    }
    .card {
      width: 100%;
      max-width: 480px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
    }
    .ribbon {
      height: 4px;
      background: linear-gradient(90deg, #e63558 0%, #fecf09 50%, #10b981 100%);
    }
    .pad { padding: 22px; }
    .kicker {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #e63558;
      margin-bottom: 4px;
    }
    h1 {
      margin: 0 0 14px 0;
      font-size: 19px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }
    .domain-box {
      border-radius: 12px;
      padding: 13px 15px;
      margin-bottom: 16px;
    }
    .domain-corp {
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
      color: #064e3b;
    }
    .domain-free {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      color: #78350f;
    }
    .domain-label {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 3px;
    }
    .domain-val {
      font-size: 17px;
      font-weight: 800;
      margin-bottom: 8px;
      word-break: break-all;
    }
    .domain-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12px;
      font-weight: 700;
    }
    .domain-links a {
      color: inherit;
      text-decoration: underline;
      min-height: 32px;
      display: inline-flex;
      align-items: center;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 18px;
    }
    .meta-box div { word-break: break-word; }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 48px;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
      text-align: center;
    }
    .btn:active { transform: scale(0.98); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn + .btn { margin-top: 10px; }
    .btn-approve {
      background: #10b981;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }
    .btn-reject {
      background: #fff1f2;
      color: #e11d48;
      border: 1px solid #fecdd3;
    }
    .btn-secondary {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #cbd5e1;
      font-size: 12.5px;
      font-weight: 700;
    }
    .status-banner {
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin-bottom: 14px;
    }
    .status-approved {
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
      color: #065f46;
    }
    .status-rejected {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      color: #9f1239;
    }
    .status-title {
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .status-sub {
      font-size: 12.5px;
      line-height: 1.45;
    }
    @media (hover: hover) and (pointer: fine) {
      .btn:hover:not(:disabled) { opacity: 0.9; }
    }
  </style>
</head>
<body>
  <main class="card">
    <div class="ribbon"></div>
    <div class="pad">
      <div class="kicker">UPRAISER · МОДЕРАЦИЯ ПРУФОВ</div>
      <h1>${escapeHtml(params.leadName)}</h1>

      <div class="domain-box ${isCorporate ? "domain-corp" : "domain-free"}">
        <div class="domain-label">
          ${isCorporate ? "🏢 Корпоративный домен" : "⚠️ Личный почтовый сервис"}
        </div>
        <div class="domain-val">${escapeHtml(corpDomain || emailDomain || params.leadEmail)}</div>
        <div class="domain-links">
          ${
            corpDomain
              ? `<a href="https://${escapeHtml(corpDomain)}" target="_blank" rel="noopener">🌐 Открыть сайт ↗</a>`
              : ""
          }
          <a href="${escapeHtml(linkedinUrl)}" target="_blank" rel="noopener">🔍 Найти в LinkedIn ↗</a>
        </div>
      </div>

      <div class="meta-box">
        <div><strong>📧 Email лида:</strong> ${escapeHtml(params.leadEmail)}</div>
        ${params.appId ? `<div><strong>📲 Источник / Приложение:</strong> ${escapeHtml(params.appId)}</div>` : ""}
        ${params.notes ? `<div><strong>📝 Заметка:</strong> ${escapeHtml(params.notes)}</div>` : ""}
        ${params.geo || params.device ? `<div><strong>📍 Девайс:</strong> ${escapeHtml(params.geo || "")} · ${escapeHtml(params.device || "")}</div>` : ""}
      </div>

      <div id="action-root">
        ${
          params.status === "approved"
            ? `<div class="status-banner status-approved">
                <div class="status-title">✅ Скриншоты уже отправлены</div>
                <div class="status-sub">Письмо с 12 скриншотами (AppsFlyer · Protect360 · CRM) было доставлено на <strong>${escapeHtml(params.leadEmail)}</strong>. Повторная отправка заблокирована.</div>
              </div>`
            : params.status === "rejected"
            ? `<div class="status-banner status-rejected">
                <div class="status-title">🚫 Отправка была отклонена</div>
                <div class="status-sub">Письмо со скриншотами не отправлялось этому лиду.</div>
              </div>
              <button type="button" class="btn btn-secondary" onclick="submitDecision('approve')">
                ✅ Всё-таки выслать скриншоты лиду
              </button>`
            : params.intent === "reject"
            ? `<button type="button" id="btn-main" class="btn btn-reject" onclick="submitDecision('reject')">
                🚫 Подтвердить отказ (Не высылать)
              </button>
              <button type="button" id="btn-alt" class="btn btn-secondary" onclick="submitDecision('approve')">
                ✅ Всё-таки выслать 12 скриншотов
              </button>`
            : `<button type="button" id="btn-main" class="btn btn-approve" onclick="submitDecision('approve')">
                ✅ Подтвердить и выслать 12 скриншотов
              </button>
              <button type="button" id="btn-alt" class="btn btn-secondary" onclick="submitDecision('reject')">
                ❌ Не высылать (Отклонить)
              </button>`
        }
      </div>
    </div>
  </main>

  <script>
    async function submitDecision(decision) {
      const root = document.getElementById('action-root');
      const btns = root.querySelectorAll('button');
      btns.forEach(b => { b.disabled = true; });
      const mainBtn = document.getElementById('btn-main') || btns[0];
      if (mainBtn) {
        mainBtn.textContent = decision === 'approve' ? '⏳ Отправляем скриншоты лиду...' : '⏳ Фиксируем отказ...';
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'moderate_decision',
            decision: decision,
            email: ${JSON.stringify(params.leadEmail)},
            name: ${JSON.stringify(params.leadName)},
            vid: ${JSON.stringify(params.vid)},
            sig: ${JSON.stringify(params.sig)}
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Ошибка сервера');
        }
        if (data.status === 'approved') {
          root.innerHTML = '<div class="status-banner status-approved">' +
            '<div class="status-title">' + (data.alreadyHandled ? 'ℹ️ Уже было отправлено ранее' : '✅ Скриншоты успешно отправлены!') + '</div>' +
            '<div class="status-sub">Досье с 12 скриншотами отправлено на <strong>${escapeHtml(params.leadEmail)}</strong>. Статус в Telegram обновлён.</div>' +
          '</div>';
        } else {
          root.innerHTML = '<div class="status-banner status-rejected">' +
            '<div class="status-title">🚫 Отправка отклонена</div>' +
            '<div class="status-sub">Скриншоты не будут отправлены на <strong>${escapeHtml(params.leadEmail)}</strong>. Статус в Telegram обновлён.</div>' +
          '</div>' +
          '<button type="button" class="btn btn-secondary" onclick="submitDecision(\\'approve\\')">✅ Всё-таки выслать скриншоты лиду</button>';
        }
      } catch (err) {
        alert('Не удалось выполнить действие: ' + (err.message || err));
        btns.forEach(b => { b.disabled = false; });
      }
    }
  </script>
</body>
</html>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS & Options
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("Server email is not configured. Missing RESEND_API_KEY.");
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseAdmin = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // Handle GET Moderation Console (/api/contact?moderate=approve|reject&email=...&name=...&vid=...&sig=...)
  if (req.method === "GET") {
    const reqUrl = new URL(req.url || "/", "https://upraiser.co.uk");
    const moderate = reqUrl.searchParams.get("moderate");
    const leadEmail = (reqUrl.searchParams.get("email") || "").trim();
    const leadName = (reqUrl.searchParams.get("name") || "").trim();
    const vid = (reqUrl.searchParams.get("vid") || "").trim();
    const sig = (reqUrl.searchParams.get("sig") || "").trim();

    if ((moderate !== "approve" && moderate !== "reject") || !leadEmail || !leadName) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Invalid moderation link parameters.");
    }

    const expectedSig = computeModerationSig(leadEmail, leadName);
    if (sig !== expectedSig) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Forbidden: Invalid moderation signature.");
    }

    let status: "pending" | "approved" | "rejected" = "pending";
    let decidedAt: string | undefined;
    let storedMeta: Record<string, any> = {};

    if (supabaseAdmin) {
      try {
        const emailKey = `email_${leadEmail.toLowerCase()}`;
        const { data: row } = await supabaseAdmin
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", emailKey)
          .maybeSingle();

        if (row?.metadata && typeof row.metadata === "object") {
          storedMeta = row.metadata;
        } else if (vid) {
          const { data: vidRow } = await supabaseAdmin
            .from("lead_notification_cooldowns")
            .select("metadata")
            .eq("visitor_id", vid)
            .maybeSingle();
          if (vidRow?.metadata && typeof vidRow.metadata === "object") {
            storedMeta = vidRow.metadata;
          }
        }

        if (storedMeta.proof_status === "approved") status = "approved";
        else if (storedMeta.proof_status === "rejected") status = "rejected";
        decidedAt = storedMeta.proof_decided_at;
      } catch (err) {
        console.warn("Moderation GET lookup warning:", err);
      }
    }

    // Stamp owner cookie so the moderator's device is excluded from self-tracking
    res.setHeader(
      "Set-Cookie",
      "upraiser_owner=1; Path=/; Max-Age=315360000; SameSite=Lax"
    );
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(
      renderModerationConsoleHtml({
        intent: moderate,
        leadName,
        leadEmail,
        vid,
        sig,
        status,
        decidedAt,
        geo: storedMeta.lastGeo,
        device: storedMeta.lastDevice,
        notes: storedMeta.notes,
        appId: storedMeta.appId,
        isConference: storedMeta.isConference,
      })
    );
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
  }

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

  const tgToken =
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN ||
    "8955516402:AAFMgYQ5dJoS13RhOLrNkoPs3lplpaa4bxI";
  const tgChatId =
    process.env.VITE_TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    "-1003934317948";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "UPRAISER Desk <pilot@upraiser.co.uk>";

  // Handle POST Moderation Decision (Approve / Reject sending screenshots to lead)
  if (body?.action === "moderate_decision") {
    const decision = body.decision === "approve" ? "approve" : "reject";
    const leadEmail = String(body.email || "").trim();
    const leadName = String(body.name || "").trim();
    const vid = String(body.vid || "").trim();
    const sig = String(body.sig || "").trim();

    if (!leadEmail || !leadName) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Missing lead email or name." }));
    }

    const expectedSig = computeModerationSig(leadEmail, leadName);
    if (sig !== expectedSig) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Invalid moderation signature." }));
    }

    const emailKey = `email_${leadEmail.toLowerCase()}`;
    let existingMeta: Record<string, any> = {};

    if (supabaseAdmin) {
      try {
        const { data: row } = await supabaseAdmin
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", emailKey)
          .maybeSingle();
        if (row?.metadata && typeof row.metadata === "object") {
          existingMeta = row.metadata;
        } else if (vid) {
          const { data: vidRow } = await supabaseAdmin
            .from("lead_notification_cooldowns")
            .select("metadata")
            .eq("visitor_id", vid)
            .maybeSingle();
          if (vidRow?.metadata && typeof vidRow.metadata === "object") {
            existingMeta = vidRow.metadata;
          }
        }
      } catch (err) {
        console.warn("Moderation decision lookup warning:", err);
      }
    }

    // Prevent duplicate email dispatch if already approved earlier
    if (existingMeta.proof_status === "approved") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          ok: true,
          alreadyHandled: true,
          status: "approved",
          decidedAt: existingMeta.proof_decided_at || null,
        })
      );
    }

    const nowIso = new Date().toISOString();

    if (decision === "approve") {
      if (!resendApiKey) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: false, error: "RESEND_API_KEY is not configured on server." }));
      }

      const leadHtml = generateLeadSnapshotsEmailHtml(leadName, leadEmail);
      const sendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [leadEmail],
          reply_to: "alex@upraiser.co.uk",
          subject: "UPRAISER — Raw Dashboards & Performance Snapshots (Protect360 · AppsFlyer)",
          html: leadHtml,
        }),
      });

      if (!sendRes.ok) {
        const errText = await sendRes.text();
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: false, error: `Resend error: ${errText.slice(0, 120)}` }));
      }
    }

    const nextStatus = decision === "approve" ? "approved" : "rejected";
    const updatedMeta = {
      ...existingMeta,
      displayName: existingMeta.displayName || leadName,
      leadEmail: leadEmail.toLowerCase(),
      proof_status: nextStatus,
      proof_decided_at: nowIso,
    };

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("lead_notification_cooldowns").upsert(
          {
            visitor_id: emailKey,
            last_notified_at: nowIso,
            last_event_type: decision === "approve" ? "proof_approved" : "proof_rejected",
            metadata: updatedMeta,
          },
          { onConflict: "visitor_id" }
        );

        const targetVid = vid || existingMeta.linkedVisitorId;
        if (targetVid) {
          await supabaseAdmin.from("lead_notification_cooldowns").upsert(
            {
              visitor_id: targetVid,
              last_notified_at: nowIso,
              last_event_type: decision === "approve" ? "proof_approved" : "proof_rejected",
              metadata: updatedMeta,
            },
            { onConflict: "visitor_id" }
          );
        }

        await supabaseAdmin.from("lead_activity_logs").insert([
          {
            visitor_id: targetVid || emailKey,
            lead_name: leadName,
            lead_contact: leadEmail,
            event_type: decision === "approve" ? "proof_approved" : "proof_rejected",
            duration_seconds: 0,
            metadata: {
              decision,
              email: leadEmail,
              decidedAt: nowIso,
            },
          },
        ]);
      } catch (dbErr) {
        console.warn("Moderation decision DB sync warning:", dbErr);
      }
    }

    // Sync decision to Telegram (remove pending buttons & post status reply)
    if (tgToken && tgChatId) {
      try {
        const leadCardMsgId = existingMeta.lead_card_message_id
          ? Number(existingMeta.lead_card_message_id)
          : null;

        if (leadCardMsgId) {
          const remainingButtons = Array.isArray(existingMeta.enrichment_buttons)
            ? existingMeta.enrichment_buttons
            : [];
          await fetch(`https://api.telegram.org/bot${tgToken}/editMessageReplyMarkup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgChatId,
              message_id: leadCardMsgId,
              reply_markup:
                remainingButtons.length > 0
                  ? { inline_keyboard: [remainingButtons] }
                  : { inline_keyboard: [] },
            }),
          }).catch(() => {});
        }

        const tgReplyText =
          decision === "approve"
            ? [
                `✅ <b>Скриншоты отправлены лиду (одобрено)</b>`,
                `👤 <b>Получатель:</b> <b>${escapeHtml(leadName)}</b> (<code>${escapeHtml(leadEmail)}</code>)`,
                `📨 Досье с 12 скриншотами успешно доставлено.`,
              ].join("\n")
            : [
                `🚫 <b>Отправка скриншотов отклонена</b>`,
                `👤 <b>Лид:</b> <b>${escapeHtml(leadName)}</b> (<code>${escapeHtml(leadEmail)}</code>)`,
              ].join("\n");

        const replyPayload: Record<string, any> = {
          chat_id: tgChatId,
          text: tgReplyText,
          parse_mode: "HTML",
          disable_notification: decision === "reject",
          disable_web_page_preview: true,
        };

        if (leadCardMsgId) {
          replyPayload.reply_parameters = {
            message_id: leadCardMsgId,
            allow_sending_without_reply: true,
          };
        }

        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(replyPayload),
        });
      } catch (tgErr) {
        console.warn("Moderation Telegram sync warning:", tgErr);
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        ok: true,
        status: nextStatus,
        decidedAt: nowIso,
      })
    );
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
  const rawNotes = (notes || "").trim();
  const isLegacyFootprintDump =
    rawNotes.startsWith("[CONFERENCE HUB") || rawNotes.startsWith("[REPEAT HUB");
  const cleanUserNote = isLegacyFootprintDump ? "" : rawNotes;
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

    // 2. Determine /connect desk vs main website form context
    const isConference =
      appId.includes("Conference") ||
      appId.includes("Direct Partner Desk") ||
      appId.includes("/connect") ||
      isRepeatAlert;

    // 3. Resolve lead email & send Moderation Email to alex@upraiser.co.uk and ceo@upraiser.co.uk
    // Screenshots are NO LONGER sent automatically to the lead — they wait for 1-click moderation!
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

    const { emailDomain, corpDomain, isCorporate } = isValidLeadEmail
      ? analyzeLeadEmailDomain(leadTargetEmail)
      : { emailDomain: "", corpDomain: "", isCorporate: false };

    const linkedinQuery = corpDomain
      ? `${cleanName} ${corpDomain.split(".")[0]}`
      : cleanName;
    const linkedinUrl = `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in/ ${linkedinQuery}`)}`;

    let approveUrl = "";
    let rejectUrl = "";
    let moderationEmailSent = false;
    let moderationEmailError: string | null = null;

    if (isValidLeadEmail) {
      const sig = computeModerationSig(leadTargetEmail, cleanName);
      const qParams = `email=${encodeURIComponent(leadTargetEmail)}&name=${encodeURIComponent(cleanName)}&vid=${encodeURIComponent(visitorId || "")}&sig=${sig}`;
      approveUrl = `https://upraiser.co.uk/api/contact?moderate=approve&${qParams}`;
      rejectUrl = `https://upraiser.co.uk/api/contact?moderate=reject&${qParams}`;

      if (resendApiKey) {
        try {
          const modHtml = generateModerationEmailHtml({
            leadName: cleanName,
            leadEmail: leadTargetEmail,
            emailDomain,
            corpDomain,
            isCorporate,
            isConference,
            appId,
            geos,
            companyType,
            companySize,
            monthlyBudget,
            notes: cleanUserNote,
            geo,
            device,
            approveUrl,
            rejectUrl,
            linkedinUrl,
          });

          const modSubject = isCorporate
            ? `🔎 Модерация пруфов: ${cleanName} (${corpDomain}) — Выслать скриншоты?`
            : `🔎 Модерация пруфов: ${cleanName} (${emailDomain} · Личная почта) — Выслать скриншоты?`;

          const modPayload: Record<string, any> = {
            from: fromEmail,
            to: MODERATION_RECIPIENTS,
            reply_to: leadTargetEmail,
            subject: modSubject,
            html: modHtml,
          };
          if (attachments && attachments.length > 0) {
            modPayload.attachments = attachments;
          }

          const modRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(modPayload),
          });

          if (!modRes.ok) {
            const errTxt = await modRes.text();
            moderationEmailError = errTxt;
            console.error("Moderation email Resend error:", modRes.status, errTxt);
          } else {
            moderationEmailSent = true;
            console.info("Moderation email dispatched to:", MODERATION_RECIPIENTS.join(", "));
          }
        } catch (modErr) {
          moderationEmailError = modErr instanceof Error ? modErr.message : String(modErr);
          console.error("Moderation email exception:", modErr);
        }
      }
    }

    // 4. Send LOUD Telegram Instant Alert (disable_notification: false) with 1-tap Approve / Reject buttons
    let leadCardMessageId: number | null = null;
    const inlineButtons: Array<{ text: string; url: string }> = [];

    if (tgToken && tgChatId) {
      try {
        const shortIdMatch = String(visitorId || effectiveClickId || "").match(/_([a-z0-9]{4,6})$/i);
        const shortId = shortIdMatch
          ? `usr_${shortIdMatch[1].toLowerCase()}`
          : `usr_${String(visitorId || "anon").replace(/^hub_/, "").slice(0, 6).toLowerCase()}`;

        const emailDossierStatus = isValidLeadEmail
          ? `⏳ <b>Ожидает вашего решения</b> (домен: <code>${escapeHtml(emailDomain)}</code>)`
          : `ℹ️ Не требуется (указан телефон / мессенджер)`;

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

        // Build Quick-Action Inline Keyboard Buttons for Telegram
        const rawContactTrimmed = cleanContact.trim();
        const digitsOnly = rawContactTrimmed.replace(/[^\d]/g, "");

        if (corpDomain) {
          inlineButtons.push({
            text: `🌐 ${corpDomain}`,
            url: `https://${corpDomain}`,
          });
        }

        const noteTgMatch = cleanUserNote.match(/(?:^|\s)@([a-zA-Z0-9_]{3,32})\b/) || cleanUserNote.match(/t\.me\/([a-zA-Z0-9_]{3,32})/i);

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
        } else if (noteTgMatch && noteTgMatch[1]) {
          inlineButtons.push({
            text: `✈️ Написать @${noteTgMatch[1]}`,
            url: `https://t.me/${noteTgMatch[1]}`,
          });
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
        inlineButtons.push({
          text: `🔍 LinkedIn: ${cleanName.slice(0, 18)}`,
          url: linkedinUrl,
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
              : isValidLeadEmail
              ? `⚠️ <b>Домен:</b> Личная почта (<code>${escapeHtml(emailDomain)}</code>)`
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
              : isValidLeadEmail
              ? `⚠️ <b>Домен:</b> Личная почта (<code>${escapeHtml(emailDomain)}</code>)`
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
        const keyboardRows: Array<Array<{ text: string; url: string }>> = [];
        if (isValidLeadEmail && approveUrl && rejectUrl) {
          keyboardRows.push([
            { text: "✅ Выслать скриншоты", url: approveUrl },
            { text: "❌ Не высылать", url: rejectUrl },
          ]);
        }
        if (inlineButtons.length > 0) {
          keyboardRows.push(inlineButtons.slice(0, 3));
        }

        const sendPayload: Record<string, any> = {
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_notification: false, // Loud push with sound & vibration!
          disable_web_page_preview: true,
        };

        if (keyboardRows.length > 0) {
          sendPayload.reply_markup = {
            inline_keyboard: keyboardRows,
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
        leadCardMessageId = tgJson?.result?.message_id
          ? Number(tgJson.result.message_id)
          : null;

        // 4C. Persist lead_card_message_id & moderation state in Supabase
        if (supabaseAdmin) {
          const sharedMeta = {
            ...prevCooldownMeta,
            displayName: cleanName,
            leadContact: cleanContact,
            leadEmail: leadTargetEmail ? leadTargetEmail.toLowerCase() : null,
            lead_card_message_id: leadCardMessageId || prevCooldownMeta?.lead_card_message_id || null,
            enrichment_buttons: inlineButtons.slice(0, 3),
            session_timeline: updatedTimeline,
            lastGeo: geo,
            lastDevice: device,
            appId,
            geos,
            companyType,
            companySize,
            monthlyBudget,
            notes: cleanUserNote,
            isConference,
            proof_status:
              prevCooldownMeta?.proof_status === "approved"
                ? "approved"
                : isValidLeadEmail
                ? "pending"
                : "not_applicable",
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
    return res.end(
      JSON.stringify({
        ok: true,
        leadTargetEmail,
        moderationRequired: isValidLeadEmail,
        moderationEmailSent,
        moderationEmailError,
      })
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Failed to deliver pilot brief" })
    );
  }
}
