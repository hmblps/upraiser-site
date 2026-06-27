export const APPLE_PREVIEW_FEATURES = ["highlights"] as const;

export type ApplePreviewFeature = (typeof APPLE_PREVIEW_FEATURES)[number];

export const APPLE_PREVIEW_LABELS: Record<ApplePreviewFeature, string> = {
  highlights: "Section highlights (hero)",
};

export function isApplePreviewPanelVisible(): boolean {
  if (typeof window === "undefined") return false;
  return import.meta.env.DEV || new URLSearchParams(window.location.search).has("applePreview");
}

export function parseApplePreviewFeatures(search: string): ApplePreviewFeature[] | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(search);
  if (!params.has("applePreview") && !params.has("apple")) return null;

  const raw = params.get("apple");

  if (!raw || raw === "all") return [...APPLE_PREVIEW_FEATURES];

  const picked = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ApplePreviewFeature =>
      APPLE_PREVIEW_FEATURES.includes(s as ApplePreviewFeature),
    );

  return picked.length > 0 ? picked : [...APPLE_PREVIEW_FEATURES];
}

export function serializeAppleFeatures(features: ApplePreviewFeature[]): string {
  if (features.length === APPLE_PREVIEW_FEATURES.length) return "all";
  return features.join(",");
}
