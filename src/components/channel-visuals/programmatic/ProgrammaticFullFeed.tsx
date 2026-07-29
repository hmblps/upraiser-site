import { AnimatePresence, motion } from "framer-motion";

/** Local brand marks — remote aida URLs often 404 as white holes. */
const LOGO = "/brand/upraiser-logo.png";
const LOGO_MARK = "/logo.svg";

const NATIVE_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCcy27WAIFExo-KnfpDyZwIfPj9mkVCrcB7y7-2MkBJQsTwWAG73Y4PyY-PQYZkwV-GBe_ZpqMgGua7eCa2xAo_FpQV3D7GSAT3ATO2cMwKVxJzUipo_NFj3jKrV8ajazsMbE3DYatuPulurdjOSleOLXBi6Gu1ap7uf5ZCF_lL3H7Q76-y7yZQ0pxWmSQbySJCtxueTy8a2ZZTBTSQFqThLW8zaixoF6KQ_2bYyx_mfhoD1RfcezYO";

const INTERSTITIAL_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDVDGU895lPp3HvPGQgYYFM2YhBMoK-ubGnEja1wD5i7L467vW64cokTX2B3iJCzrPa8YoBCMAf_ahLlsFnBA5PWUbe5iyZair3R_ASAftI_0cYZPCB91VuhMDedjmiA1oa4YicbJb6Bed_KCWSw7bUhSOV7zW4rrm2np-yq6VH3v3PlPD4zSPthw1C-wYmeEAfz05cxIkJhCDLn1CnQ-QR8bOwEt_6KQ22wM_NgF7SVk8S47Pc0awY";

const RICH_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBhHx__OrMfK8ZzQWiBrHGNPjQM0wus7Zb5I-9IArR5HH5QerTTdKdQCQ9jX_6oMuDN4ebFnBI5QdRFsl28JcPqtaLDJXBY7vJebDnVUfIKAmzC_Pmt1mxRdJW2mOy7Kv-freZxH8ML4XI1oLx_5oc55dt_L9isLBzKJvGNVVjdXjLIw2I7pemUL2aB0kh5xU9HNQVTYH_XHF1xFR6nHBEFkL0U_fY-oig085XsXyuwZBA7b9U4ndyO";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.8 };

function Icon({ name, filled = false, className = "" }: { name: string; filled?: boolean; className?: string }) {
  return (
    <span
      className={`pb-icon material-symbols-outlined ${className}`.trim()}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return <img src={LOGO} alt="" className={className} />;
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
            <img src={NATIVE_HERO} alt="" />
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
          <img src={INTERSTITIAL_BG} alt="" className="pf-interstitial__bg" />
          <div className="pf-interstitial__dim" />
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
          <img src={RICH_BG} alt="" className="pf-rich__bg" />
          <div className="pf-rich__overlay">
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
              <span>
                <Icon name="swipe_up" />
              </span>
            </div>
          </div>
        </div>
      );
    case "video":
      return (
        <div className="pf-video pf-video--fill">
          <img src={INTERSTITIAL_BG} alt="" className="pf-video__bg" />
          <div className="pf-video__grad" />
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
              <img src={LOGO_MARK} alt="" />
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

        <AnimatePresence mode="wait">
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
