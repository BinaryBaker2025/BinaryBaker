import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase.js";
import {
  buttonPrimary,
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
  role: "",
  status: clientStatuses[0]
};

export default function AdminClients() {
  const { clients, assignments } = useOutletContext();
  const [clientForm, setClientForm] = useState(defaultClientForm);

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
    if (!trimmedName || !trimmedEmail) {
      return;
    }

    try {
      await addDoc(collection(db, "clients"), {
        name: trimmedName,
        company: clientForm.company.trim() || "Independent",
        email: trimmedEmail,
        role: clientForm.role.trim() || "Stakeholder",
        status: clientForm.status,
        createdAt: serverTimestamp()
      });
      setClientForm(defaultClientForm);
    } catch (error) {
      console.error("Failed to add client:", error);
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
              return (
                <article key={client.id} className={rowCard}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold">{client.name}</h4>
                      <p className="text-sm text-ink/70">{client.company}</p>
                      <p className="mt-2 text-xs text-ink/50">{client.email}</p>
                    </div>
                    <span className={`${pillBase} ${clientStatusStyles[client.status]}`}>
                      {client.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-ink/60">
                    <span>{client.role || "Client contact"}</span>
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
            <label className={labelBase}>
              Full name
              <input
                className={inputBase}
                name="name"
                value={clientForm.name}
                onChange={handleClientChange}
                placeholder="Jordan Blake"
                required
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
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Role
                <input
                  className={inputBase}
                  name="role"
                  value={clientForm.role}
                  onChange={handleClientChange}
                  placeholder="Founder, PM, Ops"
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={clientForm.status}
                  onChange={handleClientChange}
                >
                  {clientStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className={buttonPrimary} type="submit">
              Add client
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
