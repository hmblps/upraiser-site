import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";
import { publishContactIntent } from "../lib/contactIntent";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  contactIntent?: string;
};

function isHashLink(href: string) {
  return href.startsWith("#") && href.length > 1;
}

function isAppPath(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

/** In-app paths via React Router; hash anchors via Lenis; external stay native. */
export function ScrollLink({ href, children, onClick, contactIntent, ...props }: SiteLinkProps) {
  const { scrollTo } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const handleHashClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (contactIntent) publishContactIntent(contactIntent);

    const id = href.slice(1);
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: href });
      return;
    }
    scrollTo(id);
  };

  const handlePathClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (contactIntent) publishContactIntent(contactIntent);
  };

  if (isHashLink(href)) {
    return (
      <a href={href} onClick={handleHashClick} {...props}>
        {children}
      </a>
    );
  }

  if (isAppPath(href) && !isExternal(href)) {
    const [pathname, hashPart] = href.split("#");
    return (
      <Link
        to={hashPart ? { pathname, hash: `#${hashPart}` } : pathname}
        onClick={handlePathClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
