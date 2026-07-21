import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useScroll } from "../context/ScrollContext";

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

function isHashLink(href: string) {
  return href.startsWith("#") && href.length > 1;
}

/** In-page anchors go through Lenis-aware scrollTo (header offset). External / mailto stay native. */
export function ScrollLink({ href, children, onClick, ...props }: ScrollLinkProps) {
  const { scrollTo } = useScroll();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!isHashLink(href)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    scrollTo(href.slice(1));
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
