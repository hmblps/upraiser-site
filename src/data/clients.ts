export type ClientBrand = {
  name: string;
  slug: string;
  /** Local asset when available; otherwise typographic wordmark. */
  logo?: string;
  scale?: number;
};

/**
 * Client / brand marks for the /partners brands board.
 * Prefer local assets; missing logos render as wordmarks.
 */
export const clientBrands: ClientBrand[] = [
  { name: "Fanatics", slug: "fanatics", logo: "/clients/fanatics.png", scale: 1.15 },
  { name: "Underdog", slug: "underdog" },
  { name: "Betking", slug: "betking" },
  { name: "Block Blast", slug: "block-blast", logo: "/clients/block-blast.png", scale: 1.1 },
  { name: "Shopee", slug: "shopee", logo: "/clients/shopee.svg", scale: 1.05 },
  { name: "AutoDoc", slug: "autodoc", logo: "/clients/autodoc.png", scale: 1.1 },
  { name: "Groww", slug: "groww" },
  { name: "Vantage", slug: "vantage", logo: "/clients/vantage.png", scale: 1.05 },
  { name: "IQ Options", slug: "iq-options" },
  { name: "Binance", slug: "binance", logo: "/clients/binance.svg", scale: 1.05 },
  { name: "Bybit", slug: "bybit" },
  { name: "OKX", slug: "okx", logo: "/clients/okx.svg", scale: 0.95 },
  { name: "Fiverr", slug: "fiverr", logo: "/clients/fiverr.svg", scale: 1.1 },
  { name: "Banco Azteca", slug: "banco-azteca", logo: "/clients/banco-azteca.png", scale: 1.1 },
  { name: "Banki.ru", slug: "banki-ru" },
  { name: "Liobank", slug: "liobank" },
  { name: "MBS", slug: "mbs" },
  { name: "Snoop", slug: "snoop", logo: "/clients/snoop.png", scale: 1.05 },
  { name: "TikTok", slug: "tiktok", logo: "/clients/tiktok.svg", scale: 1.15 },
  { name: "Azar", slug: "azar", logo: "/clients/azar.png", scale: 1.05 },
  { name: "SolPrestado", slug: "solprestado" },
  { name: "Rapiplata", slug: "rapiplata" },
  { name: "GCash", slug: "gcash" },
  { name: "Arvanix", slug: "arvanix" },
  { name: "Moneycat", slug: "moneycat" },
  { name: "NIRA", slug: "nira" },
  { name: "Platiza", slug: "platiza" },
  { name: "PureVPN", slug: "purevpn" },
  { name: "Surfshark VPN", slug: "surfshark", logo: "/clients/surfshark.svg", scale: 1.1 },
  { name: "Starbucks", slug: "starbucks", logo: "/clients/starbucks.svg", scale: 1.05 },
  { name: "Opera", slug: "opera", logo: "/clients/opera.svg", scale: 1.05 },
  { name: "Playwing", slug: "playwing" },
];

/** Split into two rows for opposing marquees. */
export function clientBrandRows(): [ClientBrand[], ClientBrand[]] {
  const mid = Math.ceil(clientBrands.length / 2);
  return [clientBrands.slice(0, mid), clientBrands.slice(mid)];
}
