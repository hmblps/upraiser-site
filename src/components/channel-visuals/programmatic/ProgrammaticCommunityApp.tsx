import {
  BANNER_AVATAR_IMAGE,
  BANNER_EVENT_IMAGE,
  BANNER_FEED_IMAGE,
  BANNER_HERO_IMAGE,
} from "./bannerAssets";

type MaterialIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

function MaterialIcon({ name, filled = false, className }: MaterialIconProps) {
  return (
    <span
      className={className ? `pb-icon material-symbols-outlined ${className}` : "pb-icon material-symbols-outlined"}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}

/** Stitch Community app UI — in-app banner slide (Vibrant Pulse / DESIGN.md). */
export function ProgrammaticCommunityApp() {
  return (
    <div className="pb-app">
      <header className="pb-app__header">
        <div className="pb-app__header-left">
          <MaterialIcon name="menu" className="pb-app__header-icon pb-app__header-icon--primary" />
          <h1 className="pb-app__title">Community</h1>
        </div>
        <div className="pb-app__header-right">
          <MaterialIcon name="search" className="pb-app__header-icon" />
          <MaterialIcon name="account_circle" className="pb-app__header-icon pb-app__header-icon--primary" />
        </div>
      </header>

      <main className="pb-app__main">
        <section className="pb-app__banner-section">
          <div className="pb-app__banner">
            <img className="pb-app__banner-bg" src={BANNER_HERO_IMAGE} alt="" loading="lazy" />
            <div className="pb-app__banner-gradient" aria-hidden />
            <button type="button" className="pb-app__banner-close" tabIndex={-1} aria-hidden>
              <MaterialIcon name="close" />
            </button>
            <div className="pb-app__banner-copy">
              <span className="pb-app__chip">New</span>
              <h2 className="pb-app__banner-title">Join the community</h2>
              <p className="pb-app__banner-text">
                Unlock new opportunities and connect with like-minded people.
              </p>
              <button type="button" className="pb-app__banner-cta" tabIndex={-1}>
                Download Now
                <MaterialIcon name="download" />
              </button>
            </div>
          </div>
        </section>

        <section className="pb-app__grid">
          <article className="pb-app__card pb-app__card--wide">
            <div className="pb-app__card-head">
              <div className="pb-app__card-meta">
                <div className="pb-app__avatar-ring">
                  <MaterialIcon name="groups" className="pb-app__card-icon" />
                </div>
                <div>
                  <p className="pb-app__card-title">Club Meeting</p>
                  <p className="pb-app__card-sub">2.4 km away</p>
                </div>
              </div>
              <MaterialIcon name="more_vert" className="pb-app__muted-icon" />
            </div>
            <div className="pb-app__card-media">
              <img src={BANNER_EVENT_IMAGE} alt="" loading="lazy" />
              <span className="pb-app__tag">Today</span>
            </div>
            <p className="pb-app__card-body">
              Discussion of new trends in design and technology. Join us this evening!
            </p>
            <div className="pb-app__card-actions">
              <button type="button" className="pb-app__btn pb-app__btn--ghost" tabIndex={-1}>
                Ignore
              </button>
              <button type="button" className="pb-app__btn pb-app__btn--accent" tabIndex={-1}>
                Join
              </button>
            </div>
          </article>

          <article className="pb-app__card pb-app__card--stat">
            <MaterialIcon name="bolt" filled className="pb-app__stat-icon pb-app__stat-icon--orange" />
            <p className="pb-app__stat-value">12</p>
            <p className="pb-app__stat-label">Active chats</p>
          </article>

          <article className="pb-app__card pb-app__card--stat">
            <MaterialIcon name="star" filled className="pb-app__stat-icon pb-app__stat-icon--red" />
            <p className="pb-app__stat-value">4.9</p>
            <p className="pb-app__stat-label">Your rating</p>
          </article>

          <article className="pb-app__card pb-app__card--wide pb-app__card--feed">
            <div className="pb-app__feed-head">
              <img className="pb-app__feed-avatar" src={BANNER_AVATAR_IMAGE} alt="" loading="lazy" />
              <div>
                <p className="pb-app__card-title">Anna Kuznetsova</p>
                <p className="pb-app__card-sub">Published 2h ago</p>
              </div>
            </div>
            <p className="pb-app__feed-text">
              Just finished the project for the new community hub. Results exceeded expectations! Will share
              details soon.
            </p>
            <div className="pb-app__feed-media">
              <img src={BANNER_FEED_IMAGE} alt="" loading="lazy" />
            </div>
            <div className="pb-app__feed-foot">
              <div className="pb-app__feed-stats">
                <span>
                  <MaterialIcon name="favorite" /> 42
                </span>
                <span>
                  <MaterialIcon name="chat_bubble" /> 8
                </span>
              </div>
              <MaterialIcon name="share" className="pb-app__muted-icon" />
            </div>
          </article>
        </section>
      </main>

      <button type="button" className="pb-app__fab" tabIndex={-1} aria-hidden>
        <MaterialIcon name="add" />
      </button>

      <nav className="pb-app__nav" aria-hidden>
        <span className="pb-app__nav-item pb-app__nav-item--active">
          <MaterialIcon name="home" filled />
          <span>Home</span>
        </span>
        <span className="pb-app__nav-item">
          <MaterialIcon name="group" />
          <span>Connect</span>
        </span>
        <span className="pb-app__nav-item">
          <MaterialIcon name="event" />
          <span>Events</span>
        </span>
        <span className="pb-app__nav-item">
          <MaterialIcon name="person" />
          <span>Profile</span>
        </span>
      </nav>
    </div>
  );
}
