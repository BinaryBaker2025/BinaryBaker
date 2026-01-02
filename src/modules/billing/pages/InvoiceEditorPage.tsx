import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useInvoice } from "../hooks/useInvoice";

export default function InvoiceEditorPage() {
  const { invoiceId } = useParams();
  const resolvedId = useMemo(() => (invoiceId && invoiceId !== "new" ? invoiceId : null), [invoiceId]);
  const { invoice, loading, error } = useInvoice(resolvedId);

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Billing</p>
        <h1 className="mt-2 text-3xl font-semibold">
          {resolvedId ? "Edit invoice" : "Create invoice"}
        </h1>
      </header>

      {loading && <p className="mt-6 text-sm text-ink/60">Loading invoice...</p>}
      {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 rounded-[16px] border border-ink/10 bg-cream/80 p-6">
          <p className="text-sm text-ink/70">
            {resolvedId
              ? `Editing invoice ${invoice?.invoiceNumber || invoice?.id || "draft"}.`
              : "Start a new invoice and add line items."}
          </p>
          {/* TODO: Build invoice form fields and line item editor. */}
        </div>
      )}
    </section>
  );
}
