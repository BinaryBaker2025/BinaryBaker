import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { functions } from "../../../firebase.js";

type PublicInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  currency: string;
  issueDate: number | null;
  dueDate: number | null;
  client: {
    name: string;
    email?: string;
  };
  lineItems: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPriceMinor: number;
    discountType?: "percent" | "amount";
    discountValue?: number;
    taxId?: string | null;
    computed?: {
      totalMinor: number;
    };
  }>;
  totals: {
    subtotalMinor: number;
    discountTotalMinor: number;
    taxTotalMinor: number;
    totalMinor: number;
  } | null;
  amountPaidMinor: number;
  balanceDueMinor: number;
  notes: string;
  terms: string;
};

export default function PublicInvoicePage() {
  const { token } = useParams();
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPublicInvoice = useMemo(
    () => httpsCallable(functions, "billingGetPublicInvoice"),
    []
  );

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      if (!token) {
        setError("Missing invoice token.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getPublicInvoice({ token });
        const data = result.data as { invoice?: PublicInvoice };
        if (active) {
          setInvoice(data.invoice || null);
        }
      } catch (err) {
        console.error("Failed to load public invoice", err);
        if (active) {
          setError("Unable to load this invoice.");
          setInvoice(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInvoice();

    return () => {
      active = false;
    };
  }, [getPublicInvoice, token]);

  const formatCurrency = (minor: number, currency: string) => {
    const safeMinor = Number.isFinite(minor) ? minor : 0;
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency || "ZAR"
    }).format(safeMinor / 100);
  };

  const formatDate = (millis: number | null) => {
    if (!millis) {
      return "—";
    }
    return new Date(millis).toLocaleDateString("en-ZA");
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Invoice</p>
        <h1 className="mt-2 text-3xl font-semibold">
          Invoice {invoice?.invoiceNumber || ""}
        </h1>
      </header>
      <div className="mt-6 rounded-[16px] border border-ink/10 bg-cream/80 p-6">
        {loading && <p className="text-sm text-ink/70">Loading invoice...</p>}
        {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
        {!loading && !error && invoice && (
          <div className="space-y-4 text-sm text-ink/70">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Client</p>
                <p className="text-base font-semibold text-ink">{invoice.client.name}</p>
                {invoice.client.email && (
                  <p className="text-sm text-ink/60">{invoice.client.email}</p>
                )}
              </div>
              <div className="text-right">
                <p>Status: {invoice.status}</p>
                <p>Issued: {formatDate(invoice.issueDate)}</p>
                <p>Due: {formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            <div className="divide-y divide-ink/10 rounded-[12px] border border-ink/10 bg-white/70">
              {invoice.lineItems.length === 0 && (
                <p className="p-4 text-sm text-ink/60">No line items.</p>
              )}
              {invoice.lineItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-start gap-4 p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-ink/60">{item.description}</p>
                    )}
                    <p className="text-xs text-ink/50">
                      Qty {item.quantity} · {formatCurrency(item.unitPriceMinor, invoice.currency)}
                    </p>
                  </div>
                  <div className="text-right text-sm font-semibold text-ink">
                    {formatCurrency(item.computed?.totalMinor ?? 0, invoice.currency)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 text-right">
              <p>Subtotal: {formatCurrency(invoice.totals?.subtotalMinor ?? 0, invoice.currency)}</p>
              <p>Discounts: {formatCurrency(invoice.totals?.discountTotalMinor ?? 0, invoice.currency)}</p>
              <p>Tax: {formatCurrency(invoice.totals?.taxTotalMinor ?? 0, invoice.currency)}</p>
              <p className="text-base font-semibold text-ink">
                Total: {formatCurrency(invoice.totals?.totalMinor ?? 0, invoice.currency)}
              </p>
              <p>Paid: {formatCurrency(invoice.amountPaidMinor ?? 0, invoice.currency)}</p>
              <p>Balance due: {formatCurrency(invoice.balanceDueMinor ?? 0, invoice.currency)}</p>
            </div>

            {(invoice.notes || invoice.terms) && (
              <div className="rounded-[12px] border border-ink/10 bg-white/80 p-4">
                {invoice.notes && (
                  <p className="text-sm text-ink/70">
                    <span className="font-semibold text-ink">Notes:</span> {invoice.notes}
                  </p>
                )}
                {invoice.terms && (
                  <p className="mt-2 text-sm text-ink/70">
                    <span className="font-semibold text-ink">Terms:</span> {invoice.terms}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
