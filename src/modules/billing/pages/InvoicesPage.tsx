import { Link } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";

const formatCurrency = (amountMinor: number, currency = "ZAR") => {
  const amount = (amountMinor || 0) / 100;
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export default function InvoicesPage() {
  const { invoices, loading, error } = useInvoices();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Billing</p>
          <h1 className="mt-2 text-3xl font-semibold">Invoices</h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream/70 px-4 py-2 text-sm font-semibold"
          to="/billing/invoices/new"
        >
          New invoice
        </Link>
      </header>

      {loading && <p className="mt-6 text-sm text-ink/60">Loading invoices...</p>}
      {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid gap-4">
          {invoices.length === 0 && (
            <p className="text-sm text-ink/60">No invoices yet.</p>
          )}
          {invoices.map((invoice) => (
            <article
              key={invoice.id}
              className="rounded-[16px] border border-ink/10 bg-cream/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {invoice.invoiceNumber || "Draft"}
                  </h2>
                  <p className="mt-1 text-sm text-ink/70">Status: {invoice.status}</p>
                </div>
                <Link
                  className="text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4"
                  to={`/billing/invoices/${invoice.id}`}
                >
                  View
                </Link>
              </div>
              <p className="mt-3 text-sm text-ink/70">
                Total: {formatCurrency(invoice.totals?.totalMinor ?? 0, invoice.currency)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
