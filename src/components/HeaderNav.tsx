import { useLocation } from "react-router-dom";
import { navLinks, type NavLink } from "../data/liveContent";
import { ScrollLink } from "./ScrollLink";

function navIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/cases/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Primary IA — The Craft · The Basecamp · The Expedition */
export function HeaderNav() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Primary" className="header-nav">
      <ul className="header-nav__list">
        {navLinks.map((link: NavLink) => {
          const active = navIsActive(pathname, link.href);
          return (
            <li key={link.href}>
              <ScrollLink
                href={link.href}
                contactIntent={link.contactIntent}
                aria-current={active ? "page" : undefined}
                className={`header-nav__link${active ? " header-nav__link--active" : ""}${link.underConstruction ? " header-nav__link--soon" : ""}`}
                data-cursor="link"
              >
                {link.label}
                {link.underConstruction ? (
                  <span className="header-nav__badge" aria-hidden>
                    Soon
                  </span>
                ) : null}
              </ScrollLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
