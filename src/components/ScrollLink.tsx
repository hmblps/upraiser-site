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

function isHashLink(href: string) {
  return href.startsWith("#") && href.length > 1;
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
    
    if (!isHashLink(href)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    scrollTo(href.slice(1));
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
