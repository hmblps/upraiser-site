import { type AnchorHTMLAttributes, type MouseEvent, type PointerEvent as ReactPointerEvent, type FocusEvent as ReactFocusEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";
import { publishContactIntent } from "../lib/contactIntent";
import { preloadRoute } from "../lib/routePreloader";

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  contactIntent?: string;
};

function extractHomeHash(href: string): string | null {
  if (href.startsWith("#") && href.length > 1) return href.slice(1);
  if (href.startsWith("/#") && href.length > 2) return href.slice(2);
  return null;
}

function isExternalLink(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

/** In-page anchors go through Lenis-aware scrollTo (header offset). External / mailto stay native. Internal routes use React Router. */
export function ScrollLink({ href, children, onClick, onPointerEnter, onFocus, contactIntent, ...props }: ScrollLinkProps) {
  const { scrollTo } = useScroll();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (contactIntent) publishContactIntent(contactIntent);

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const targetId = extractHomeHash(href);
    if (targetId && (href.startsWith("#") || window.location.pathname === "/")) {
      event.preventDefault();
      if (window.location.hash !== `#${targetId}`) {
        window.history.replaceState(null, "", `/#${targetId}`);
      }
      scrollTo(targetId);
    }
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    preloadRoute(href);
    onPointerEnter?.(event);
  };

  const handleFocus = (event: ReactFocusEvent<HTMLAnchorElement>) => {
    preloadRoute(href);
    onFocus?.(event);
  };

  if (isExternalLink(href)) {
    return (
      <a href={href} onClick={handleClick} onPointerEnter={handlePointerEnter} onFocus={handleFocus} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} onPointerEnter={handlePointerEnter} onFocus={handleFocus} {...props}>
      {children}
    </Link>
  );
}
