import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import MarketingLayout from "../components/MarketingLayout.jsx";
import { indexableSeoRoutes, seoRoutes } from "../seo/routes.js";
import { SITE_URL } from "../seo/siteConfig.js";
import useSeoPage from "../seo/useSeoPage.js";

async function checkReachability(path) {
  try {
    const response = await fetch(path, { method: "GET" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function isConfigured(route) {
  const title = Boolean(route.seoTitle || route.pageName);
  const description = Boolean(route.metaDescription || (route.quickSummary || []).join(" ").trim());
  const canonical = Boolean(route.canonicalPath || route.routePath);
  const og = Boolean((route.ogTitle || route.seoTitle || route.pageName) && route.ogImage);
  const schema = Boolean(route.schemaType);
  return { title, description, canonical, og, schema };
}

function CheckBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] ${
        value ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {value ? "Pass" : "Missing"}
    </span>
  );
}

export default function SeoStatus() {
  useSeoPage("seoStatus", { indexable: false, title: "SEO Status | Internal" });

  const [reachability, setReachability] = useState({
    robots: null,
    sitemap: null
  });

  useEffect(() => {
    let active = true;

    async function runChecks() {
      const [robots, sitemap] = await Promise.all([
        checkReachability("/robots.txt"),
        checkReachability("/sitemap.xml")
      ]);

      if (!active) {
        return;
      }

      setReachability({ robots, sitemap });
    }

    runChecks();
    return () => {
      active = false;
    };
  }, []);

  const routeChecks = useMemo(
    () => indexableSeoRoutes.map((route) => ({ route, checks: isConfigured(route) })),
    []
  );

  return (
    <MarketingLayout>
      <section className="rounded-[22px] border border-ink/10 bg-white/90 p-6 shadow-soft sm:p-8">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "SEO Status", path: "/seo-status" }]} />
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">SEO Status</h1>
        <p className="mt-3 max-w-3xl text-ink/75">
          Internal checklist for crawl readiness and indexability controls.
        </p>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">Foundation Checks</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
              <p className="text-sm text-ink/70">Canonical domain</p>
              <p className="mt-1 font-semibold text-ink">{SITE_URL}</p>
            </article>
            <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
              <p className="text-sm text-ink/70">Routes in SEO config</p>
              <p className="mt-1 font-semibold text-ink">{seoRoutes.length}</p>
            </article>
            <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
              <p className="text-sm text-ink/70">`/robots.txt` reachable</p>
              <p className="mt-1 font-semibold text-ink">
                {reachability.robots === null ? "Checking..." : reachability.robots ? "Yes" : "No"}
              </p>
            </article>
            <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
              <p className="text-sm text-ink/70">`/sitemap.xml` reachable</p>
              <p className="mt-1 font-semibold text-ink">
                {reachability.sitemap === null ? "Checking..." : reachability.sitemap ? "Yes" : "No"}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">Per-Page Metadata Checks</h2>
          <div className="mt-4 overflow-auto rounded-[14px] border border-ink/10">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-cream/70 text-ink">
                <tr>
                  <th className="px-3 py-2">Page</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Canonical</th>
                  <th className="px-3 py-2">Open Graph</th>
                  <th className="px-3 py-2">Schema</th>
                </tr>
              </thead>
              <tbody>
                {routeChecks.map(({ route, checks }) => (
                  <tr key={route.id} className="border-t border-ink/10 bg-white/80">
                    <td className="px-3 py-2">{route.routePath}</td>
                    <td className="px-3 py-2">
                      <CheckBadge value={checks.title} />
                    </td>
                    <td className="px-3 py-2">
                      <CheckBadge value={checks.description} />
                    </td>
                    <td className="px-3 py-2">
                      <CheckBadge value={checks.canonical} />
                    </td>
                    <td className="px-3 py-2">
                      <CheckBadge value={checks.og} />
                    </td>
                    <td className="px-3 py-2">
                      <CheckBadge value={checks.schema} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
            <h2 className="font-serif text-xl">Webmaster Tools</h2>
            <ul className="mt-3 grid gap-2 text-sm text-deep-blue">
              <li>
                <a className="underline" href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                  Google Search Console
                </a>
              </li>
              <li>
                <a className="underline" href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer">
                  Bing Webmaster Tools
                </a>
              </li>
            </ul>
          </article>

          <article className="rounded-[14px] border border-ink/10 bg-cream/70 p-4">
            <h2 className="font-serif text-xl">Manual Checklist</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/75">
              <li>Add domain property in Search Console.</li>
              <li>Verify DNS ownership for the apex domain.</li>
              <li>Submit sitemap and inspect homepage URL.</li>
              <li>Request indexing for key landing pages after deployment.</li>
            </ul>
          </article>
        </section>
      </section>
    </MarketingLayout>
  );
}

