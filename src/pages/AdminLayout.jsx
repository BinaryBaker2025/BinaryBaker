import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Link, NavLink, Outlet } from "react-router-dom";
import { db } from "../firebase.js";
import { buttonGhost } from "./adminData";

const navItems = [
  { label: "Overview", to: "/admin" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Clients", to: "/admin/clients" },
  { label: "Access", to: "/admin/access" },
  { label: "Billing", to: "/admin/billing" },
  { label: "Project management", to: "/admin/management" }
];

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
    isActive ? "bg-ink text-cream shadow-soft" : "text-ink/60 hover:text-ink"
  }`;

export default function AdminLayout() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const subscribe = (collectionName, setter) => {
      const collectionRef = collection(db, collectionName);
      const dataQuery = query(collectionRef, orderBy("createdAt", "desc"));
      return onSnapshot(dataQuery, (snapshot) => {
        setter(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    };

    const unsubscribeProjects = subscribe("projects", setProjects);
    const unsubscribeClients = subscribe("clients", setClients);
    const unsubscribeAssignments = subscribe("assignments", setAssignments);
    const unsubscribeInvoices = subscribe("invoices", setInvoices);
    const unsubscribeTasks = subscribe("tasks", setTasks);

    return () => {
      unsubscribeProjects();
      unsubscribeClients();
      unsubscribeAssignments();
      unsubscribeInvoices();
      unsubscribeTasks();
    };
  }, []);

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
          <Link className={buttonGhost} to="/portal">
            Back to portal
          </Link>
        </div>
      </header>

      <nav
        aria-label="Admin sections"
        className="mt-4 flex flex-wrap gap-2 rounded-[18px] border border-ink/10 bg-cream/90 p-3 shadow-soft"
      >
        {navItems.map((item) => (
          <NavLink key={item.to} className={navLinkClass} to={item.to} end={item.to === "/admin"}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="py-10">
        <Outlet
          context={{
            projects,
            clients,
            assignments,
            invoices,
            tasks
          }}
        />
      </main>
    </div>
  );
}
