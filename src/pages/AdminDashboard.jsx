import { Link } from "react-router-dom";

const highlights = [
  {
    title: "User management",
    description: "Assign roles, invite clients, and manage access."
  },
  {
    title: "Project oversight",
    description: "Track every bake, approval, and delivery milestone."
  },
  {
    title: "Billing control",
    description: "Review invoices, retainers, and payments." 
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 pb-12 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-6 py-4">
        <Link className="flex items-center gap-3 font-serif text-lg font-bold" to="/">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-deep-blue to-violet font-mono text-sm uppercase tracking-[0.12em] text-cream">
            BB
          </span>
          Binary Baker
        </Link>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream/70 px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-1 hover:shadow-bb"
            to="/portal"
          >
            Back to portal
          </Link>
        </div>
      </header>

      <main className="py-12">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">Admin</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Admin dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">
          Manage access, keep projects moving, and oversee the full Binary Baker pipeline.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] border border-ink/10 bg-cream/90 p-6 shadow-soft"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
