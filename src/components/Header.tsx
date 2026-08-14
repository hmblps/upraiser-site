import { HeaderNav } from "./HeaderNav";
import { ScrollLink } from "./ScrollLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-[100] isolate">
      <div className="header-bar page-container">
        <ScrollLink
          href="/"
          className="header-brand flex items-center rounded-[var(--radius-sm)] transition-opacity [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90"
          aria-label="UPRAISER — The Basecamp"
        >
          <img src="/upraiser-logo.png" alt="" className="h-9 w-9 object-contain" />
        </ScrollLink>

        <HeaderNav />

        <div className="header-actions">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
