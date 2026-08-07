import { AnimatePresence, motion } from "framer-motion";

/** Frozen local assets — same set as HyperFrames format scenes. */
const LOGO = "/brand/upraiser-logo.png";
const LOGO_MARK = "/logo.svg";
const NATIVE_HERO = "/channels/programmatic-feed/native-hero.jpg";
const INTERSTITIAL_BG = "/channels/programmatic-feed/interstitial-bg.jpg";
const RICH_BG = "/channels/programmatic-feed/rich-bg.jpg";
const VIDEO_BG = "/channels/programmatic-feed/video-bg.jpg";

const SPRING = { type: "spring" as const, stiffness: 200, damping: 28, mass: 1 };

function Icon({ name, filled = false, className = "" }: { name: string; filled?: boolean; className?: string }) {
  return (
    <span
      className={`pb-icon material-symbols-outlined shrink-0 ${className}`.trim()}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return <img src={LOGO} alt="" className={className} decoding="async" loading="lazy" fetchPriority="low" />;
}

function FormatPanel({ id }: { id: string }) {
  switch (id) {
    case "native":
      return (
        <article className="pf-native">
          <div className="pf-native__head">
            <BrandMark className="pf-native__avatar" />
            <div>
              <p className="pf-native__name">Upraiser Agency</p>
              <p className="pf-native__meta">
                Sponsored <Icon name="verified" className="pf-native__verified" />
              </p>
            </div>
          </div>
          <p className="pf-native__copy">
            Conquer the market with strategic ascent tools designed for the next generation of mobile engagement.
          </p>
          <div className="pf-native__media">
            <img src={NATIVE_HERO} alt="" decoding="async" loading="lazy" />
            <div className="pf-native__media-cap">The Peak of Strategy</div>
          </div>
          <div className="pf-native__foot">
            <div className="pf-native__react">
              <Icon name="favorite" filled />
              <Icon name="chat_bubble" />
            </div>
            <button type="button" tabIndex={-1}>
              Ascend
            </button>
          </div>
        </article>
      );
    case "interstitial":
      return (
        <div className="pf-interstitial pf-interstitial--fill">
          <img src={INTERSTITIAL_BG} alt="" className="pf-interstitial__bg" decoding="async" loading="lazy" />
          <div className="pf-interstitial__dim" />
          <div className="pf-format-tag" aria-hidden>
            <span>03.</span> Interstitial
          </div>
          <button type="button" className="pf-interstitial__close" tabIndex={-1} aria-hidden>
            <Icon name="close" />
          </button>
          <div className="pf-interstitial__card">
            <div className="pf-interstitial__logo">
              <BrandMark />
            </div>
            <h3>Ready for Conquest?</h3>
            <p>Scale beyond the competition with the ultimate technical audit.</p>
            <button type="button" tabIndex={-1}>
              Start Climbing
            </button>
          </div>
        </div>
      );
    case "rich":
      return (
        <div className="pf-rich pf-rich--fill">
          <img src={RICH_BG} alt="" className="pf-rich__bg" decoding="async" loading="lazy" />
          <div className="pf-rich__overlay">
            <div className="pf-format-tag pf-format-tag--on-dark" aria-hidden>
              <span>04.</span> Rich Media
            </div>
            <span className="pf-rich__chip">Conquer 2026</span>
            <h2>
              Summit
              <br />
              Strategy
            </h2>
            <p>Elevate your vision into reality with high-tech climbing solutions.</p>
            <div className="pf-rich__actions">
              <span>
                <Icon name="ads_click" />
              </span>
              <span className="pf-rich__nudge">
                <Icon name="swipe_up" />
              </span>
            </div>
          </div>
        </div>
      );
    case "video":
      return (
        <div className="pf-video pf-video--fill">
          <img src={VIDEO_BG} alt="" className="pf-video__bg" decoding="async" loading="lazy" />
          <div className="pf-video__grad" />
          <div className="pf-format-tag pf-format-tag--center" aria-hidden>
            <span>05.</span> Video
          </div>
          <div className="pf-video__top">
            <span className="pf-video__live">
              <i /> LIVE
            </span>
            <button type="button" tabIndex={-1} aria-hidden>
              <Icon name="volume_off" />
            </button>
          </div>
          <button type="button" className="pf-video__play" tabIndex={-1} aria-hidden>
            <Icon name="play_arrow" filled />
          </button>
          <div className="pf-video__bottom">
            <div className="pf-video__bar">
              <span />
            </div>
            <div className="pf-video__meta">
              <img src={LOGO_MARK} alt="" decoding="async" loading="lazy" />
              <span>The Uprising Continues</span>
            </div>
          </div>
        </div>
      );
    case "banner":
    default:
      return (
        <div className="pf-card pf-card--solo">
          <div className="pf-skeleton">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="pf-banner-ad">
            <div className="pf-banner-ad__left">
              <div className="pf-banner-ad__icon">
                <BrandMark />
              </div>
              <span>Reach New Heights</span>
            </div>
            <button type="button" tabIndex={-1}>
              Scale
            </button>
          </div>
          <div className="pf-skeleton pf-skeleton--after">
            <span />
            <span />
            <span />
          </div>
        </div>
      );
  }
}

const LABELS: Record<string, { title: string; sub: string }> = {
  banner: { title: "01. Banner", sub: "320 × 50" },
  native: { title: "02. Native", sub: "In-feed" },
  interstitial: { title: "03. Interstitial", sub: "Full-screen" },
  rich: { title: "04. Rich media", sub: "Parallax" },
  video: { title: "05. Video", sub: "Vertical" },
};

/** Full-bleed ads own the glass — no app chrome around them. */
const FILL_FORMATS = new Set(["interstitial", "rich", "video"]);

type ProgrammaticFullFeedProps = {
  activeFormatId: string;
};

/** One format per phone viewport — synced with Solutions scroll / copy. */
export function ProgrammaticFullFeed({ activeFormatId }: ProgrammaticFullFeedProps) {
  const label = LABELS[activeFormatId] ?? LABELS.banner!;
  const fill = FILL_FORMATS.has(activeFormatId);

  return (
    <div className={`pf-feed pf-feed--pager${fill ? " pf-feed--fill" : ""}`}>
      {!fill ? (
        <header className="pf-feed__header">
          <div className="pf-feed__header-left">
            <Icon name="menu" className="pf-feed__icon pf-feed__icon--primary" />
            <BrandMark className="pf-feed__logo" />
          </div>
          <div className="pf-feed__header-right">
            <Icon name="search" className="pf-feed__icon" />
            <Icon name="account_circle" className="pf-feed__icon pf-feed__icon--primary" />
          </div>
        </header>
      ) : null}

      <main className={`pf-feed__main pf-feed__main--pager${fill ? " pf-feed__main--fill" : ""}`}>
        {!fill ? (
          <div className="pf-feed__section-label">
            <span>{label.title}</span>
            <span>{label.sub}</span>
          </div>
        ) : null}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeFormatId}
            className="pf-feed__panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING}
          >
            <FormatPanel id={activeFormatId} />
          </motion.div>
        </AnimatePresence>
      </main>

      {!fill ? (
        <nav className="pf-feed__nav" aria-hidden>
          <span>
            <Icon name="home" />
            Home
          </span>
          <span className="is-active">
            <Icon name="grid_view" filled />
            Formats
          </span>
          <span>
            <Icon name="bar_chart" />
            Insights
          </span>
          <span>
            <Icon name="person" />
            Profile
          </span>
        </nav>
      ) : null}
    </div>
  );
}
