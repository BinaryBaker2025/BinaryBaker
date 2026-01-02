import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import Dialog from "../components/Dialog.jsx";
import { db } from "../firebase.js";
import {
  buttonGhost,
  buttonPrimary,
  buttonSubtle,
  cardBase,
  inputBase,
  invoiceStatusStyles,
  invoiceStatuses,
  labelBase,
  pillBase,
  rowCard,
  textareaBase
} from "./adminData";

const defaultCurrency = "ZAR";

const defaultInvoiceForm = {
  title: "",
  clientId: "",
  projectId: "",
  amount: "",
  status: invoiceStatuses[0],
  dueDate: "",
  note: ""
};

const formatStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const normalizeInvoiceStatus = (status) => {
  if (!status) {
    return invoiceStatuses[0];
  }
  if (invoiceStatuses.includes(status)) {
    return status;
  }
  const normalized = String(status).toLowerCase().replace(/\s+/g, "_");
  if (invoiceStatuses.includes(normalized)) {
    return normalized;
  }
  if (normalized === "draft") {
    return "draft";
  }
  if (normalized === "sent") {
    return "sent";
  }
  if (normalized === "paid") {
    return "paid";
  }
  if (normalized === "overdue") {
    return "overdue";
  }
  return invoiceStatuses[0];
};

const parseAmountToMinor = (value) => {
  if (!value) {
    return 0;
  }
  const normalized = String(value).replace(/[^0-9.]/g, "");
  if (!normalized) {
    return 0;
  }
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.round(parsed * 100);
};

const formatCurrency = (amountMinor, currency = defaultCurrency) => {
  const amount = (amountMinor || 0) / 100;
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const formatDate = (value) => {
  if (!value) {
    return "TBD";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString().slice(0, 10);
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString().slice(0, 10);
  }
  return "TBD";
};

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString().slice(0, 10);
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString().slice(0, 10);
  }
  return "";
};

const buildClientSnapshot = (client) => {
  if (!client) {
    return { name: "Unknown client" };
  }
  const primaryEmail =
    Array.isArray(client.emails) && client.emails.length > 0
      ? client.emails[0]
      : client.email || "";
  return {
    name: client.name || client.companyName || "Client",
    email: primaryEmail || undefined,
    taxNumber: client.taxNumber || undefined,
    billingAddress: client.billingAddress || undefined
  };
};

export default function AdminBilling() {
  const { invoices, projects, clients, orgId } = useOutletContext();
  const [invoiceForm, setInvoiceForm] = useState(defaultInvoiceForm);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editForm, setEditForm] = useState(defaultInvoiceForm);
  const hasProjects = projects.length > 0;
  const canCreateInvoice = hasProjects && Boolean(orgId);

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
    if (!orgId || !invoiceForm.projectId || !invoiceForm.clientId || !trimmedAmount) {
      return;
    }

    try {
      const client = clientLookup[invoiceForm.clientId];
      const unitPriceMinor = parseAmountToMinor(trimmedAmount);
      const baseMinor = unitPriceMinor;
      const lineItem = {
        itemId: null,
        name: invoiceForm.title.trim() || "Line item",
        description: "",
        quantity: 1,
        unitPriceMinor,
        taxId: null,
        computed: {
          baseMinor,
          discountMinor: 0,
          netMinor: baseMinor,
          taxMinor: 0,
          totalMinor: baseMinor
        }
      };
      const totals = {
        subtotalMinor: baseMinor,
        discountTotalMinor: 0,
        taxTotalMinor: 0,
        totalMinor: baseMinor
      };
      const dueDateValue = invoiceForm.dueDate ? new Date(invoiceForm.dueDate) : null;
      const dueDate =
        dueDateValue && !Number.isNaN(dueDateValue.getTime())
          ? Timestamp.fromDate(dueDateValue)
          : null;

      await addDoc(collection(db, "orgs", orgId, "invoices"), {
        invoiceNumber: "",
        status: normalizeInvoiceStatus(invoiceForm.status),
        clientId: invoiceForm.clientId,
        clientSnapshot: buildClientSnapshot(client),
        currency: client?.currencyOverride || defaultCurrency,
        issueDate: Timestamp.now(),
        dueDate,
        lineItems: [lineItem],
        totals,
        amountPaidMinor: 0,
        balanceDueMinor: totals.totalMinor,
        notes: invoiceForm.note.trim(),
        projectId: invoiceForm.projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setInvoiceForm(defaultInvoiceForm);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const openEdit = (invoice) => {
    const primaryLine = Array.isArray(invoice.lineItems) ? invoice.lineItems[0] : null;
    const unitPriceMinor = primaryLine?.unitPriceMinor ?? 0;
    setEditingInvoice(invoice);
    setEditForm({
      title: primaryLine?.name || invoice.title || "",
      clientId: invoice.clientId || "",
      projectId: invoice.projectId || "",
      amount: unitPriceMinor ? String(unitPriceMinor / 100) : "",
      status: normalizeInvoiceStatus(invoice.status),
      dueDate: toDateInputValue(invoice.dueDate),
      note: invoice.notes || invoice.note || ""
    });
  };

  const closeEdit = () => {
    setEditingInvoice(null);
    setEditForm(defaultInvoiceForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingInvoice || !orgId) {
      return;
    }

    const trimmedAmount = editForm.amount.trim();
    if (!editForm.projectId || !editForm.clientId || !trimmedAmount) {
      return;
    }

    try {
      const client = clientLookup[editForm.clientId];
      const unitPriceMinor = parseAmountToMinor(trimmedAmount);
      const baseMinor = unitPriceMinor;
      const lineItem = {
        itemId: null,
        name: editForm.title.trim() || "Line item",
        description: "",
        quantity: 1,
        unitPriceMinor,
        taxId: null,
        computed: {
          baseMinor,
          discountMinor: 0,
          netMinor: baseMinor,
          taxMinor: 0,
          totalMinor: baseMinor
        }
      };
      const totals = {
        subtotalMinor: baseMinor,
        discountTotalMinor: 0,
        taxTotalMinor: 0,
        totalMinor: baseMinor
      };
      const dueDateValue = editForm.dueDate ? new Date(editForm.dueDate) : null;
      const dueDate =
        dueDateValue && !Number.isNaN(dueDateValue.getTime())
          ? Timestamp.fromDate(dueDateValue)
          : null;

      await updateDoc(doc(db, "orgs", orgId, "invoices", editingInvoice.id), {
        status: normalizeInvoiceStatus(editForm.status),
        clientId: editForm.clientId,
        clientSnapshot: buildClientSnapshot(client),
        currency: client?.currencyOverride || editingInvoice.currency || defaultCurrency,
        dueDate,
        lineItems: [lineItem],
        totals,
        amountPaidMinor: editingInvoice.amountPaidMinor || 0,
        balanceDueMinor:
          (editingInvoice.amountPaidMinor || 0) > 0
            ? Math.max(0, totals.totalMinor - (editingInvoice.amountPaidMinor || 0))
            : totals.totalMinor,
        notes: editForm.note.trim(),
        projectId: editForm.projectId,
        updatedAt: serverTimestamp()
      });
      closeEdit();
    } catch (error) {
      console.error("Failed to update invoice:", error);
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
              const statusKey = normalizeInvoiceStatus(invoice.status);
              const statusClass = invoiceStatusStyles[statusKey] || invoiceStatusStyles.draft;
              const primaryLine = Array.isArray(invoice.lineItems) ? invoice.lineItems[0] : null;
              const clientName =
                client?.companyName ||
                client?.name ||
                invoice.clientSnapshot?.name ||
                "Unknown client";
              return (
                <article key={invoice.id} className={rowCard}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                        {invoice.invoiceNumber || invoice.id}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">
                        {primaryLine?.name || "Invoice"}
                      </h4>
                      <p className="mt-1 text-sm text-ink/70">
                        {clientName} / {project?.name || "No project"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={buttonSubtle}
                        type="button"
                        onClick={() => openEdit(invoice)}
                      >
                        Edit
                      </button>
                      <span className={`${pillBase} ${statusClass}`}>
                        {formatStatusLabel(statusKey)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-xs text-ink/60 sm:grid-cols-3">
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Amount</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {formatCurrency(
                          invoice.totals?.totalMinor ?? 0,
                          invoice.currency || defaultCurrency
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Issued</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {formatDate(invoice.issueDate || invoice.issuedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Due</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {formatDate(invoice.dueDate)}
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
            {!orgId && (
              <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
                Assign this user to an org to enable billing.
              </p>
            )}
            {!hasProjects && (
              <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
                Create a project first to enable billing.
              </p>
            )}
            <label className={labelBase}>
              Invoice title
              <input
                className={inputBase}
                name="title"
                value={invoiceForm.title}
                onChange={handleInvoiceChange}
                placeholder="Sprint 3 deposit"
                disabled={!canCreateInvoice}
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
                disabled={!canCreateInvoice}
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName || client.name} ({client.name})
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
                required
                disabled={!canCreateInvoice}
              >
                <option value="">
                  {hasProjects ? "Select project" : "Create a project first"}
                </option>
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
                  disabled={!canCreateInvoice}
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={invoiceForm.status}
                  onChange={handleInvoiceChange}
                  disabled={!canCreateInvoice}
                >
                  {invoiceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
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
                disabled={!canCreateInvoice}
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
                disabled={!canCreateInvoice}
              />
            </label>
            <button
              className={`${buttonPrimary} ${!canCreateInvoice ? "cursor-not-allowed opacity-70" : ""}`}
              type="submit"
              disabled={!canCreateInvoice}
            >
              Create invoice
            </button>
          </div>
        </form>
      </section>

      <Dialog open={Boolean(editingInvoice)} title="Edit invoice" onClose={closeEdit}>
        <form className="grid gap-4" onSubmit={handleEditSubmit}>
          {!orgId && (
            <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
              Assign this user to an org to enable billing.
            </p>
          )}
          {!hasProjects && (
            <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
              Create a project first to edit billing.
            </p>
          )}
          <label className={labelBase}>
            Invoice title
            <input
              className={inputBase}
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              placeholder="Sprint 3 deposit"
              disabled={!canCreateInvoice}
            />
          </label>
          <label className={labelBase}>
            Client
            <select
              className={inputBase}
              name="clientId"
              value={editForm.clientId}
              onChange={handleEditChange}
              required
              disabled={!canCreateInvoice}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName || client.name} ({client.name})
                </option>
              ))}
            </select>
          </label>
          <label className={labelBase}>
            Project
            <select
              className={inputBase}
              name="projectId"
              value={editForm.projectId}
              onChange={handleEditChange}
              required
              disabled={!canCreateInvoice}
            >
              <option value="">
                {hasProjects ? "Select project" : "Create a project first"}
              </option>
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
                value={editForm.amount}
                onChange={handleEditChange}
                placeholder="$4,500"
                required
                disabled={!canCreateInvoice}
              />
            </label>
            <label className={labelBase}>
              Status
              <select
                className={inputBase}
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                disabled={!canCreateInvoice}
              >
                {invoiceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
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
              value={editForm.dueDate}
              onChange={handleEditChange}
              disabled={!canCreateInvoice}
            />
          </label>
          <label className={labelBase}>
            Notes
            <textarea
              className={textareaBase}
              name="note"
              value={editForm.note}
              onChange={handleEditChange}
              placeholder="Internal billing notes"
              disabled={!canCreateInvoice}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              className={`${buttonPrimary} ${!canCreateInvoice ? "cursor-not-allowed opacity-70" : ""}`}
              type="submit"
              disabled={!canCreateInvoice}
            >
              Save changes
            </button>
            <button className={buttonGhost} type="button" onClick={closeEdit}>
              Cancel
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
