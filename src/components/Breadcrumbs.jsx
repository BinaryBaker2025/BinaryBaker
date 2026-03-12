import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  if (!Array.isArray(items) || items.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-3 py-2 text-xs text-cream/55 shadow-soft">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="inline-flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-cream">{item.name}</span>
              ) : (
                <Link className="transition hover:text-blue hover:underline" to={item.path}>
                  {item.name}
                </Link>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
