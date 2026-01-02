import { Link, useParams } from "react-router-dom";
import { useInvoice } from "../hooks/useInvoice";

const formatCurrency = (amountMinor: number, currency = "ZAR") => {
  const amount = (amountMinor || 0) / 100;
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const { invoice, loading, error } = useInvoice(invoiceId ?? null);

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Billing</p>
          <h1 className="mt-2 text-3xl font-semibold">Invoice details</h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream/70 px-4 py-2 text-sm font-semibold"
          to={invoiceId ? `/billing/invoices/${invoiceId}/edit` : "/billing/invoices"}
        >
          Edit invoice
        </Link>
      </header>

      {loading && <p className="mt-6 text-sm text-ink/60">Loading invoice...</p>}
      {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 rounded-[16px] border border-ink/10 bg-cream/80 p-6">
          {invoice ? (
            <>
              <h2 className="text-xl font-semibold">
                {invoice.invoiceNumber || "Draft"}
              </h2>
              <p className="mt-2 text-sm text-ink/70">Status: {invoice.status}</p>
              <p className="mt-2 text-sm text-ink/70">
                Total: {formatCurrency(invoice.totals?.totalMinor ?? 0, invoice.currency)}
              </p>
              {/* TODO: Render line items, client info, and payment status. */}
            </>
          ) : (
            <p className="text-sm text-ink/60">Invoice not found.</p>
          )}
        </div>
      )}
    </section>
  );
}
