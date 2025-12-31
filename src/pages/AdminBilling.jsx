import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase.js";
import {
  buttonPrimary,
  cardBase,
  inputBase,
  invoiceStatusStyles,
  invoiceStatuses,
  labelBase,
  pillBase,
  rowCard,
  textareaBase
} from "./adminData";

const defaultInvoiceForm = {
  title: "",
  clientId: "",
  projectId: "",
  amount: "",
  status: invoiceStatuses[0],
  dueDate: "",
  note: ""
};

export default function AdminBilling() {
  const { invoices, projects, clients } = useOutletContext();
  const [invoiceForm, setInvoiceForm] = useState(defaultInvoiceForm);

  const projectLookup = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, {});
  }, [projects]);

  const clientLookup = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, [clients]);

  const handleInvoiceChange = (event) => {
    const { name, value } = event.target;
    setInvoiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceSubmit = async (event) => {
    event.preventDefault();
    const trimmedAmount = invoiceForm.amount.trim();
    if (!invoiceForm.clientId || !trimmedAmount) {
      return;
    }

    try {
      await addDoc(collection(db, "invoices"), {
        title: invoiceForm.title.trim() || "Custom invoice",
        projectId: invoiceForm.projectId,
        clientId: invoiceForm.clientId,
        amount: trimmedAmount,
        status: invoiceForm.status,
        dueDate: invoiceForm.dueDate || "",
        issuedDate: new Date().toISOString().slice(0, 10),
        note: invoiceForm.note.trim(),
        createdAt: serverTimestamp()
      });
      setInvoiceForm(defaultInvoiceForm);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Billing</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Manage invoices, retainers, and payment status.
        </h1>
        <p className="mt-3 text-ink/70">
          Track what is sent, what is overdue, and what is paid without leaving the dashboard.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className={cardBase}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {invoices.length} total
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {invoices.length === 0 && (
              <p className="text-sm text-ink/60">No invoices yet.</p>
            )}
            {invoices.map((invoice) => {
              const project = projectLookup[invoice.projectId];
              const client = clientLookup[invoice.clientId];
              return (
                <article key={invoice.id} className={rowCard}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                        {invoice.id}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">{invoice.title}</h4>
                      <p className="mt-1 text-sm text-ink/70">
                        {client?.company || "Unknown client"} / {project?.name || "No project"}
                      </p>
                    </div>
                    <span className={`${pillBase} ${invoiceStatusStyles[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-xs text-ink/60 sm:grid-cols-3">
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Amount</p>
                      <p className="mt-1 text-sm font-semibold text-ink">{invoice.amount}</p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Issued</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {invoice.issuedDate || "TBD"}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Due</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {invoice.dueDate || "TBD"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form className={cardBase} onSubmit={handleInvoiceSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Create invoice</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">Billing</span>
          </div>
          <div className="mt-6 grid gap-4">
            <label className={labelBase}>
              Invoice title
              <input
                className={inputBase}
                name="title"
                value={invoiceForm.title}
                onChange={handleInvoiceChange}
                placeholder="Sprint 3 deposit"
              />
            </label>
            <label className={labelBase}>
              Client
              <select
                className={inputBase}
                name="clientId"
                value={invoiceForm.clientId}
                onChange={handleInvoiceChange}
                required
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company} ({client.name})
                  </option>
                ))}
              </select>
            </label>
            <label className={labelBase}>
              Project
              <select
                className={inputBase}
                name="projectId"
                value={invoiceForm.projectId}
                onChange={handleInvoiceChange}
              >
                <option value="">Optional</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Amount
                <input
                  className={inputBase}
                  name="amount"
                  value={invoiceForm.amount}
                  onChange={handleInvoiceChange}
                  placeholder="$4,500"
                  required
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={invoiceForm.status}
                  onChange={handleInvoiceChange}
                >
                  {invoiceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className={labelBase}>
              Due date
              <input
                className={inputBase}
                type="date"
                name="dueDate"
                value={invoiceForm.dueDate}
                onChange={handleInvoiceChange}
              />
            </label>
            <label className={labelBase}>
              Notes
              <textarea
                className={textareaBase}
                name="note"
                value={invoiceForm.note}
                onChange={handleInvoiceChange}
                placeholder="Internal billing notes"
              />
            </label>
            <button className={buttonPrimary} type="submit">
              Create invoice
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
