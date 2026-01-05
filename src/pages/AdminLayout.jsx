import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.js";
import { buttonGhost } from "./adminData";
import { useOrg } from "../hooks/useOrg.js";

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
  const navigate = useNavigate();
  const { orgId, role, loading: orgLoading, error: orgError } = useOrg();

  useEffect(() => {
    if (orgLoading) {
      return;
    }
    console.info("[Org] context", {
      orgId,
      role,
      uid: auth.currentUser?.uid || null,
      error: orgError || null
    });
  }, [orgId, role, orgLoading, orgError]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/portal", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  useEffect(() => {
    const subscribe = (collectionRef, setter, label, constraints = []) => {
      const dataQuery = query(collectionRef, ...constraints, orderBy("createdAt", "desc"));
      return onSnapshot(
        dataQuery,
        (snapshot) => {
          setter(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          console.error(`[Firestore] ${label} listener error`, {
            path: collectionRef.path,
            orgId,
            role,
            uid: auth.currentUser?.uid || null,
            message: error?.message || String(error)
          });
        }
      );
    };

    const noop = () => {};
    let unsubscribeProjects = noop;
    let unsubscribeAssignments = noop;
    let unsubscribeTasks = noop;
    let unsubscribeClients = noop;
    let unsubscribeInvoices = noop;

    if (orgId) {
      unsubscribeProjects = subscribe(
        collection(db, "orgs", orgId, "projects"),
        setProjects,
        "projects"
      );
      unsubscribeAssignments = subscribe(
        collection(db, "orgs", orgId, "assignments"),
        setAssignments,
        "assignments"
      );
      unsubscribeTasks = subscribe(
        collection(db, "orgs", orgId, "tasks"),
        setTasks,
        "tasks"
      );
      unsubscribeClients = subscribe(
        collection(db, "orgs", orgId, "clients"),
        setClients,
        "clients"
      );
      unsubscribeInvoices = subscribe(
        collection(db, "orgs", orgId, "invoices"),
        setInvoices,
        "invoices"
      );
    } else {
      setProjects([]);
      setAssignments([]);
      setTasks([]);
      setClients([]);
      setInvoices([]);
    }

    return () => {
      unsubscribeProjects();
      unsubscribeAssignments();
      unsubscribeTasks();
      unsubscribeClients();
      unsubscribeInvoices();
    };
  }, [orgId]);

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
          <button className={buttonGhost} type="button" onClick={handleSignOut}>
            Sign out
          </button>
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

      {!orgLoading && orgError && (
        <div className="mt-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {orgError}
        </div>
      )}

      <main className="py-10">
        <Outlet
          context={{
            orgId,
            orgRole: role,
            orgLoading,
            orgError,
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
