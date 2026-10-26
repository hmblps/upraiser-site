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
<body style="margin: 0; padding: 0; background-color: #07080a; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07080a; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Wrapper -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0d0f14; border: 1px solid #1c202a; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.45);">
          
          <!-- Top Accent Ribbon -->
          <tr>
            <td height="3" style="background: linear-gradient(90deg, #ff003b 0%, #fecf09 50%, #38bdf8 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #ffffff; text-transform: uppercase;">
                      UPRAISER<span style="color: #ff003b;">.</span>
                    </span>
                    <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #717d91; margin-top: 4px;">
                      London · since 2017 · Verified Traffic Infrastructure
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro & Master Download Card -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #cbd5e1; font-weight: 500;">
                ${greeting}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #94a3b8; font-weight: 400;">
                Here are raw snapshots from AppsFlyer, Protect360, and direct advertiser CRM dashboards.
              </p>

              <!-- Master ZIP Download Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #131720; border: 1px solid #232938; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="padding-right: 16px;">
                          <div style="font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
                            📦 Complete Performance Portfolio
                          </div>
                          <div style="font-size: 12px; color: #8493a8; margin-top: 3px;">
                            All 8 raw uncompressed snapshots in one bundle (.zip · 15 MB)
                          </div>
                        </td>
                        <td align="right" valign="middle" style="white-space: nowrap;">
                          <a href="${ZIP_ARCHIVE_URL}" target="_blank" style="display: inline-block; background-color: #fecf09; color: #0a0c10; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 11px 18px; border-radius: 8px; box-shadow: 0 2px 10px rgba(254, 207, 9, 0.25);">
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
            <td style="padding: ${groupIdx === 0 ? "4px" : "16px"} 36px 8px 36px;">
              <!-- Section Kicker -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #fecf09;">
                      ${group.title}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
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
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #11141c; border: 1px solid #1e2430; border-radius: 12px; padding: 16px 18px;">
                      <tr>
                        <!-- Icon -->
                        <td width="44" valign="top" style="padding-right: 14px;">
                          <img src="${item.iconUrl}" alt="${escapeHtml(item.brand)}" width="44" height="44" style="display: block; width: 44px; height: 44px; border-radius: 10px; border: 1px solid #232938; object-fit: cover;" />
                        </td>
                        <!-- Content -->
                        <td valign="top">
                          <div style="font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em; line-height: 1.3;">
                            ${escapeHtml(item.brand)}
                            <span style="font-size: 11px; font-weight: 500; color: #8493a8; margin-left: 6px;">· ${escapeHtml(item.reportType)}</span>
                          </div>
                          <div style="font-size: 12px; line-height: 1.5; color: #cbd5e1; margin-top: 5px; font-weight: 500;">
                            ${escapeHtml(item.metric)}
                          </div>
                          <div style="margin-top: 10px;">
                            <a href="${item.fileUrl}" target="_blank" style="display: inline-block; font-size: 11px; font-weight: 700; color: #38bdf8; text-decoration: none; letter-spacing: 0.04em; text-transform: uppercase;">
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
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #131720; border: 1px solid #252c3c; border-radius: 12px; padding: 24px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em; line-height: 1.4;">
                      Let’s perform a test with similar unit economics for Your app.
                    </div>
                    <p style="margin: 8px 0 18px 0; font-size: 13px; line-height: 1.5; color: #94a3b8;">
                      Reply directly to this email with Your target GEOs and attribution window, or schedule a pilot kickoff.
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td>
                          <a href="mailto:alex@upraiser.co.uk?subject=Re:%20UPRAISER%20Pilot%20Economics" style="display: inline-block; background-color: #ff003b; color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; padding: 12px 26px; border-radius: 8px; box-shadow: 0 4px 14px rgba(255, 0, 59, 0.3);">
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
            <td style="padding: 20px 36px 28px 36px; border-top: 1px solid #171b24; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #525f75; line-height: 1.6;">
                UPRAISER Ltd. · 128 City Road, London, EC1V 2NX · <a href="https://upraiser.co.uk" style="color: #717d91; text-decoration: underline;" target="_blank">upraiser.co.uk</a><br/>
                This snapshot dossier was generated in direct response to Your request on upraiser.co.uk.
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
