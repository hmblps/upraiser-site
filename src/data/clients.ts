export type ClientBrand = {
  name: string;
  slug: string;
  /** Local asset when available; otherwise typographic wordmark. */
  logo?: string;
  scale?: number;
  vertical?: "iGaming" | "Gaming" | "Fintech" | "Marketplace" | "E-commerce" | "Social" | "Other";
};

/**
 * Client / brand marks for Clients board + marquees.
 */
export const clientBrands: ClientBrand[] = [
  { name: "Fanatics", slug: "fanatics", logo: "/clients/fanatics.png", scale: 1.15, vertical: "iGaming" },
  { name: "Underdog", slug: "underdog", vertical: "iGaming" },
  { name: "Betking", slug: "betking", vertical: "iGaming" },
  { name: "Block Blast", slug: "block-blast", logo: "/clients/block-blast.png", scale: 1.1, vertical: "Gaming" },
  { name: "Shopee", slug: "shopee", logo: "/clients/shopee.svg", scale: 1.05, vertical: "Marketplace" },
  { name: "AutoDoc", slug: "autodoc", logo: "/clients/autodoc.png", scale: 1.1, vertical: "E-commerce" },
  { name: "Groww", slug: "groww", logo: "/clients/groww.png", scale: 1.05, vertical: "Fintech" },
  { name: "Vantage", slug: "vantage", logo: "/clients/vantage.png", scale: 1.05, vertical: "Fintech" },
  { name: "IQ Options", slug: "iq-options", vertical: "Fintech" },
  { name: "Binance", slug: "binance", logo: "/clients/binance.svg", scale: 1.05, vertical: "Fintech" },
  { name: "Bybit", slug: "bybit", logo: "/clients/bybit.svg", scale: 1.1, vertical: "Fintech" },
  { name: "OKX", slug: "okx", logo: "/clients/okx.svg", scale: 0.95, vertical: "Fintech" },
  { name: "Fiverr", slug: "fiverr", logo: "/clients/fiverr.svg", scale: 1.1, vertical: "Marketplace" },
  { name: "Banco Azteca", slug: "banco-azteca", logo: "/clients/banco-azteca.png", scale: 1.1, vertical: "Fintech" },
  { name: "Banki.ru", slug: "banki-ru", vertical: "Fintech" },
  { name: "Liobank", slug: "liobank", vertical: "Fintech" },
  { name: "MBS", slug: "mbs", vertical: "Other" },
  { name: "Snoop", slug: "snoop", logo: "/clients/snoop.png", scale: 1.05, vertical: "Fintech" },
  { name: "TikTok", slug: "tiktok", logo: "/clients/tiktok.svg", scale: 1.15, vertical: "Social" },
  { name: "Azar", slug: "azar", logo: "/clients/azar.png", scale: 1.05, vertical: "Social" },
  { name: "SolPrestado", slug: "solprestado", vertical: "Fintech" },
  { name: "Rapiplata", slug: "rapiplata", vertical: "Fintech" },
  { name: "GCash", slug: "gcash", logo: "/clients/gcash.svg", scale: 1.1, vertical: "Fintech" },
  { name: "Arvanix", slug: "arvanix", vertical: "Other" },
  { name: "Moneycat", slug: "moneycat", vertical: "Fintech" },
  { name: "NIRA", slug: "nira", vertical: "Fintech" },
  { name: "Platiza", slug: "platiza", vertical: "Fintech" },
  { name: "PureVPN", slug: "purevpn", vertical: "Other" },
  { name: "Surfshark VPN", slug: "surfshark", logo: "/clients/surfshark.svg", scale: 1.1, vertical: "Other" },
  { name: "Starbucks", slug: "starbucks", logo: "/clients/starbucks.svg", scale: 1.05, vertical: "E-commerce" },
  { name: "Opera", slug: "opera", logo: "/clients/opera.svg", scale: 1.05, vertical: "Other" },
  { name: "Playwing", slug: "playwing", vertical: "Gaming" },
];

/** Split into two rows for opposing marquees. */
export function clientBrandRows(): [ClientBrand[], ClientBrand[]] {
  const mid = Math.ceil(clientBrands.length / 2);
  return [clientBrands.slice(0, mid), clientBrands.slice(mid)];
}
