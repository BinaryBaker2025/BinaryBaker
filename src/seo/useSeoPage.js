import { useEffect, useMemo } from "react";
import { buildPageSchema, buildSiteSchemaGraph } from "./schema.js";
import { DEFAULT_CITY, BRAND_NAME, SITE_URL, toAbsoluteUrl } from "./siteConfig.js";
import { getSeoRoute } from "./routes.js";

const SEO_JSON_LD_ID = "seo-json-ld";
const INDEX_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const NOINDEX_ROBOTS = "noindex,nofollow";

function truncate(value, maxLength) {
  if (!value) {
    return "";
  }
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function upsertMetaByName(name, content) {
  if (!name) {
    return;
  }
  let node = document.head.querySelector(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  if (!property) {
    return;
  }
  let node = document.head.querySelector(`meta[property="${property}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("property", property);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertCanonicalLink(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertJsonLd(graph) {
  if (!Array.isArray(graph) || graph.length === 0) {
    const stale = document.head.querySelector(`#${SEO_JSON_LD_ID}`);
    if (stale) {
      stale.remove();
    }
    return;
  }

  let script = document.head.querySelector(`#${SEO_JSON_LD_ID}`);
  if (!script) {
    script = document.createElement("script");
    script.id = SEO_JSON_LD_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": graph
    },
    null,
    2
  );
}

function resolveSeoPayload(pageId, overrides = {}) {
  const route = getSeoRoute(pageId);
  if (!route) {
    return null;
  }

  const quickSummaryText = Array.isArray(route.quickSummary) ? route.quickSummary.join(" ") : "";
  const title =
    overrides.title ||
    route.seoTitle ||
    `${route.pageName} | ${BRAND_NAME} | ${DEFAULT_CITY}`;
  const description =
    overrides.description ||
    route.metaDescription ||
    truncate(quickSummaryText, 155);
  const canonicalPath = overrides.canonicalPath || route.canonicalPath || route.routePath || "/";
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const ogTitle = overrides.ogTitle || route.ogTitle || title;
  const ogDescription = overrides.ogDescription || route.ogDescription || description;
  const ogImage = toAbsoluteUrl(overrides.ogImage || route.ogImage || "/android-chrome-512x512.png");
  const indexable = typeof overrides.indexable === "boolean" ? overrides.indexable : route.indexable;

  const schemaGraph = indexable
    ? [...buildSiteSchemaGraph(), ...buildPageSchema(route, canonicalUrl, description)]
    : [];

  return {
    title,
    description,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    indexable,
    schemaGraph
  };
}

export default function useSeoPage(pageId, overrides = {}) {
  const payload = useMemo(
    () => resolveSeoPayload(pageId, overrides),
    [
      pageId,
      overrides.title,
      overrides.description,
      overrides.canonicalPath,
      overrides.ogTitle,
      overrides.ogDescription,
      overrides.ogImage,
      overrides.indexable
    ]
  );

  useEffect(() => {
    if (!payload) {
      return;
    }

    document.title = payload.title;
    upsertMetaByName("description", payload.description);
    upsertMetaByName("robots", payload.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS);
    upsertMetaByName("googlebot", payload.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS);

    upsertCanonicalLink(payload.canonicalUrl);
    upsertMetaByProperty("og:type", "website");
    upsertMetaByProperty("og:site_name", BRAND_NAME);
    upsertMetaByProperty("og:locale", "en_ZA");
    upsertMetaByProperty("og:url", payload.canonicalUrl);
    upsertMetaByProperty("og:title", payload.ogTitle);
    upsertMetaByProperty("og:description", payload.ogDescription);
    upsertMetaByProperty("og:image", payload.ogImage);
    upsertMetaByProperty("og:image:alt", `${BRAND_NAME} preview`);

    upsertMetaByName("twitter:card", "summary_large_image");
    upsertMetaByName("twitter:title", payload.ogTitle);
    upsertMetaByName("twitter:description", payload.ogDescription);
    upsertMetaByName("twitter:image", payload.ogImage);

    upsertJsonLd(payload.schemaGraph);
    document.dispatchEvent(new Event("prerender-ready"));
  }, [payload]);
}

export function getCanonicalHome() {
  return `${SITE_URL}/`;
}

