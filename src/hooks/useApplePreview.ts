import { useEffect, useState } from "react";
import {
  APPLE_PREVIEW_FEATURES,
  type ApplePreviewFeature,
  isApplePreviewPanelVisible,
  parseApplePreviewFeatures,
} from "../config/applePreview";

export function useApplePreview() {
  const [features, setFeatures] = useState<ApplePreviewFeature[] | null>(() => {
    if (typeof window === "undefined" || !isApplePreviewPanelVisible()) return null;
    return parseApplePreviewFeatures(window.location.search);
  });

  useEffect(() => {
    if (!isApplePreviewPanelVisible()) {
      setFeatures(null);
      return;
    }

    const sync = () => setFeatures(parseApplePreviewFeatures(window.location.search));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const isActive = (feature: ApplePreviewFeature) => features?.includes(feature) ?? false;
  const isPreviewMode = features !== null;

  return {
    features,
    isPreviewMode,
    isActive,
    isAllActive: features !== null && features.length === APPLE_PREVIEW_FEATURES.length,
  };
}
