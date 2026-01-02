import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import Dialog from "../components/Dialog.jsx";
import { db } from "../firebase.js";
import {
  buttonGhost,
  buttonPrimary,
  buttonSubtle,
  cardBase,
  clientStatusStyles,
  clientStatuses,
  inputBase,
  labelBase,
  pillBase,
  rowCard
} from "./adminData";

const defaultClientForm = {
  name: "",
  company: "",
  email: "",
  notes: "",
  status: clientStatuses[0]
};

const formatStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const getPrimaryEmail = (client) => {
  if (Array.isArray(client.emails) && client.emails.length > 0) {
    return client.emails[0];
  }
  return client.email || "";
};

const getCompanyName = (client) => client.companyName || client.company || "";

const normalizeClientStatus = (status) => {
  if (!status) {
    return clientStatuses[0];
  }
  if (clientStatuses.includes(status)) {
    return status;
  }
  const lowered = String(status).toLowerCase();
  if (clientStatuses.includes(lowered)) {
    return lowered;
  }
  if (lowered === "paused" || lowered === "invited") {
    return "inactive";
  }
  if (lowered === "active") {
    return "active";
  }
  return clientStatuses[0];
};

export default function AdminClients() {
  const { clients, assignments, orgId } = useOutletContext();
  const [clientForm, setClientForm] = useState(defaultClientForm);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState(defaultClientForm);
  const canManageClients = Boolean(orgId);

  const clientProjectCounts = useMemo(() => {
    const counts = {};
    const seen = {};
    assignments.forEach((assignment) => {
      if (!assignment.clientId || !assignment.projectId) {
        return;
      }
      if (!seen[assignment.clientId]) {
        seen[assignment.clientId] = new Set();
      }
      if (!seen[assignment.clientId].has(assignment.projectId)) {
        seen[assignment.clientId].add(assignment.projectId);
        counts[assignment.clientId] = (counts[assignment.clientId] || 0) + 1;
      }
    });
    return counts;
  }, [assignments]);

  const handleClientChange = (event) => {
    const { name, value } = event.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = clientForm.name.trim();
    const trimmedEmail = clientForm.email.trim();
    if (!trimmedName || !trimmedEmail || !orgId) {
      return;
    }

    try {
      await addDoc(collection(db, "orgs", orgId, "clients"), {
        name: trimmedName,
        companyName: clientForm.company.trim() || "",
        contactName: trimmedName,
        emails: [trimmedEmail],
        notes: clientForm.notes.trim(),
        status: normalizeClientStatus(clientForm.status),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setClientForm(defaultClientForm);
    } catch (error) {
      console.error("Failed to add client:", error);
    }
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setEditForm({
      name: client.name || client.contactName || "",
      company: getCompanyName(client),
      email: getPrimaryEmail(client),
      notes: client.notes || "",
      status: normalizeClientStatus(client.status)
    });
  };

  const closeEdit = () => {
    setEditingClient(null);
    setEditForm(defaultClientForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingClient || !orgId) {
      return;
    }

    const trimmedName = editForm.name.trim();
    const trimmedEmail = editForm.email.trim();
    if (!trimmedName || !trimmedEmail) {
      return;
    }

    try {
      await updateDoc(doc(db, "orgs", orgId, "clients", editingClient.id), {
        name: trimmedName,
        companyName: editForm.company.trim() || "",
        contactName: trimmedName,
        emails: [trimmedEmail],
        notes: editForm.notes.trim(),
        status: normalizeClientStatus(editForm.status),
        updatedAt: serverTimestamp()
      });
      closeEdit();
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Clients</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Invite clients and centralize access to project hubs.
        </h1>
        <p className="mt-3 text-ink/70">
          Capture primary contacts, role expectations, and access status for every account.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className={cardBase}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Client directory</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {clients.length} clients
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {clients.length === 0 && (
              <p className="text-sm text-ink/60">No clients yet.</p>
            )}
            {clients.map((client) => {
              const projectCount = clientProjectCounts[client.id] || 0;
              const companyName = getCompanyName(client);
              const primaryEmail = getPrimaryEmail(client);
              const statusKey = normalizeClientStatus(client.status);
              const statusClass = clientStatusStyles[statusKey] || clientStatusStyles.active;
              return (
                <article key={client.id} className={rowCard}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold">{client.name}</h4>
                      <p className="text-sm text-ink/70">{companyName || "Independent"}</p>
                      <p className="mt-2 text-xs text-ink/50">{primaryEmail || "No email"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={buttonSubtle}
                        type="button"
                        onClick={() => openEdit(client)}
                      >
                        Edit
                      </button>
                      <span className={`${pillBase} ${statusClass}`}>
                        {formatStatusLabel(statusKey)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-ink/60">
                    <span>{client.contactName || client.notes || "Client contact"}</span>
                    <span>{projectCount} projects</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form className={cardBase} onSubmit={handleClientSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Add client</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">Invite</span>
          </div>
          <div className="mt-6 grid gap-4">
            {!orgId && (
              <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
                Assign this user to an org to add clients.
              </p>
            )}
            <label className={labelBase}>
              Full name
              <input
                className={inputBase}
                name="name"
                value={clientForm.name}
                onChange={handleClientChange}
                placeholder="Jordan Blake"
                required
                disabled={!canManageClients}
              />
            </label>
            <label className={labelBase}>
              Company
              <input
                className={inputBase}
                name="company"
                value={clientForm.company}
                onChange={handleClientChange}
                placeholder="Company name"
                disabled={!canManageClients}
              />
            </label>
            <label className={labelBase}>
              Email address
              <input
                className={inputBase}
                type="email"
                name="email"
                value={clientForm.email}
                onChange={handleClientChange}
                placeholder="client@company.com"
                required
                disabled={!canManageClients}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Notes
                <input
                  className={inputBase}
                  name="notes"
                  value={clientForm.notes}
                  onChange={handleClientChange}
                  placeholder="Billing contact, preferences, etc."
                  disabled={!canManageClients}
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={clientForm.status}
                  onChange={handleClientChange}
                  disabled={!canManageClients}
                >
                  {clientStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              className={`${buttonPrimary} ${!canManageClients ? "cursor-not-allowed opacity-70" : ""}`}
              type="submit"
              disabled={!canManageClients}
            >
              Add client
            </button>
          </div>
        </form>
      </section>

      <Dialog open={Boolean(editingClient)} title="Edit client" onClose={closeEdit}>
        <form className="grid gap-4" onSubmit={handleEditSubmit}>
          {!orgId && (
            <p className="rounded-[12px] border border-ink/10 bg-cream/80 px-3 py-2 text-sm text-ink/70">
              Assign this user to an org to edit clients.
            </p>
          )}
          <label className={labelBase}>
            Full name
            <input
              className={inputBase}
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
              disabled={!canManageClients}
            />
          </label>
          <label className={labelBase}>
            Company
            <input
              className={inputBase}
              name="company"
              value={editForm.company}
              onChange={handleEditChange}
              placeholder="Company name"
              disabled={!canManageClients}
            />
          </label>
          <label className={labelBase}>
            Email address
            <input
              className={inputBase}
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              required
              disabled={!canManageClients}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelBase}>
              Notes
              <input
                className={inputBase}
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                placeholder="Billing contact, preferences, etc."
                disabled={!canManageClients}
              />
            </label>
            <label className={labelBase}>
              Status
              <select
                className={inputBase}
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                disabled={!canManageClients}
              >
                {clientStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={`${buttonPrimary} ${!canManageClients ? "cursor-not-allowed opacity-70" : ""}`}
              type="submit"
              disabled={!canManageClients}
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
