import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCaseById } from "../data/cases";
import {
  DEFAULT_OG_IMAGE,
  SITE_ORIGIN,
  casePageMeta,
  notFoundMeta,
  pageMetaByPath,
  type PageMetaRecord,
} from "../data/pageMeta";

function upsertMeta(
  selector: string,
  attr: "content" | "href",
  value: string,
  create?: { tag: string; nameAttr: string; name: string },
) {
  let el = document.head.querySelector(selector);
  if (!el && create) {
    el = document.createElement(create.tag);
    el.setAttribute(create.nameAttr, create.name);
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function caseSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/cases\/([^/]+)\/?$/);
  return match?.[1];
}

function resolveMeta(pathname: string): { meta: PageMetaRecord; canonicalPath: string } {
  const exact = pageMetaByPath[pathname];
  if (exact) return { meta: exact, canonicalPath: pathname === "/" ? "/" : pathname };

  const slug = caseSlugFromPath(pathname);
  if (slug) {
    const item = getCaseById(slug);
    if (item) return { meta: casePageMeta(item.client, item.headline), canonicalPath: `/cases/${slug}` };
  }

  return { meta: notFoundMeta, canonicalPath: pathname };
}

/** Per-route title, description, OG, canonical. Home copy stays aligned with index.html. */
export function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { meta, canonicalPath } = resolveMeta(pathname);
    const url = `${SITE_ORIGIN}${canonicalPath === "/" ? "/" : canonicalPath}`;

    document.title = meta.title;

    upsertMeta('meta[name="description"]', "content", meta.description, {
      tag: "meta",
      nameAttr: "name",
      name: "description",
    });
    upsertMeta('meta[property="og:title"]', "content", meta.title);
    upsertMeta('meta[property="og:description"]', "content", meta.description);
    upsertMeta('meta[property="og:url"]', "content", url);
    upsertMeta('meta[property="og:image"]', "content", DEFAULT_OG_IMAGE);
    upsertMeta('meta[name="twitter:title"]', "content", meta.title);
    upsertMeta('meta[name="twitter:description"]', "content", meta.description);
    upsertMeta('meta[name="twitter:image"]', "content", DEFAULT_OG_IMAGE);
    upsertCanonical(url);

    upsertMeta('meta[name="robots"]', "content", meta.robots ?? "index, follow", {
      tag: "meta",
      nameAttr: "name",
      name: "robots",
    });
  }, [pathname]);

  return null;
}
