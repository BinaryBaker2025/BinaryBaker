import { useParams } from "react-router-dom";

export default function PublicInvoicePage() {
  const { publicId } = useParams();

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Invoice</p>
        <h1 className="mt-2 text-3xl font-semibold">Invoice {publicId || ""}</h1>
      </header>
      <div className="mt-6 rounded-[16px] border border-ink/10 bg-cream/80 p-6">
        <p className="text-sm text-ink/70">
          This is a public invoice view. Payments and client details will live here.
        </p>
        {/* TODO: Fetch invoice details via public link endpoint. */}
      </div>
    </section>
  );
}
