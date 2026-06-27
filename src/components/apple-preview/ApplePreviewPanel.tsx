import {
  APPLE_PREVIEW_FEATURES,
  APPLE_PREVIEW_LABELS,
  type ApplePreviewFeature,
  isApplePreviewPanelVisible,
  serializeAppleFeatures,
} from "../../config/applePreview";

function setAppleFeatures(features: ApplePreviewFeature[]) {
  const url = new URL(window.location.href);
  url.searchParams.set("applePreview", "1");

  if (features.length === 0) {
    url.searchParams.delete("apple");
  } else {
    url.searchParams.set("apple", serializeAppleFeatures(features));
  }

  window.history.replaceState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

interface ApplePreviewPanelProps {
  active: ApplePreviewFeature[];
}

export function ApplePreviewPanel({ active }: ApplePreviewPanelProps) {
  if (!isApplePreviewPanelVisible()) return null;

  const toggle = (feature: ApplePreviewFeature) => {
    const next = active.includes(feature)
      ? active.filter((f) => f !== feature)
      : [...active, feature];
    setAppleFeatures(next);
  };

  return (
    <div className="apple-preview-panel" role="toolbar" aria-label="Apple-style preview">
      <p className="apple-preview-panel-label">Apple-style preview</p>
      <div className="apple-preview-panel-options">
        {APPLE_PREVIEW_FEATURES.map((feature) => (
          <button
            key={feature}
            type="button"
            className={active.includes(feature) ? "is-active" : undefined}
            onClick={() => toggle(feature)}
          >
            {APPLE_PREVIEW_LABELS[feature]}
          </button>
        ))}
        <button
          type="button"
          className="apple-preview-panel-all"
          onClick={() => setAppleFeatures([...APPLE_PREVIEW_FEATURES])}
        >
          Enable all
        </button>
      </div>
    </div>
  );
}
