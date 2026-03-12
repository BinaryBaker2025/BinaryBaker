import { Link } from "react-router-dom";
import { getSeoRoute } from "../seo/routes.js";

export default function RelatedPages({ pageId }) {
  const page = getSeoRoute(pageId);
  if (!page || !Array.isArray(page.relatedPages) || page.relatedPages.length === 0) {
    return null;
  }

  const related = page.relatedPages
    .map((relatedId) => getSeoRoute(relatedId))
    .filter((item) => item && item.routePath && item.routePath !== "*" && !item.routePath.includes(":"));

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="reveal mt-10">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-blue">Related Pages</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {related.map((item) => (
          <Link
            key={item.id}
            className="flex items-center justify-between rounded-[10px] border border-cream/[0.08] bg-cream/[0.03] px-4 py-3 text-sm font-semibold text-cream/60 transition hover:border-blue/25 hover:text-blue"
            to={item.routePath}
          >
            <span>{item.pageName}</span>
            <span className="text-cream/25">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
