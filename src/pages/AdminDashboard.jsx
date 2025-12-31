import { Link, useOutletContext } from "react-router-dom";
import { buttonGhost, buttonPrimary, cardBase } from "./adminData";

export default function AdminDashboard() {
  const { projects, clients, assignments, invoices, tasks } = useOutletContext();

  const activeProjectCount = projects.filter((project) => project.status !== "Complete").length;
  const clientsWithAccess = new Set(assignments.map((assignment) => assignment.clientId)).size;
  const openInvoiceCount = invoices.filter((invoice) => invoice.status !== "Paid").length;
  const tasksInMotion = tasks.filter((task) => task.status !== "Done").length;

  const invitedClientsCount = clients.filter((client) => client.status === "Invited").length;
  const approvalsCount = tasks.filter((task) => task.status === "Review").length;
  const followUpInvoicesCount = invoices.filter(
    (invoice) => invoice.status === "Sent" || invoice.status === "Overdue"
  ).length;
  const projectsOnHoldCount = projects.filter((project) => project.status === "On hold").length;

  const stats = [
    { label: "Active projects", value: activeProjectCount },
    { label: "Clients with access", value: clientsWithAccess },
    { label: "Invoices open", value: openInvoiceCount },
    { label: "Tasks in motion", value: tasksInMotion }
  ];

  const pulseItems = [
    { label: "Approvals waiting", value: approvalsCount },
    { label: "Invoices to chase", value: followUpInvoicesCount },
    { label: "Projects on hold", value: projectsOnHoldCount },
    { label: "Client invites out", value: invitedClientsCount }
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">Admin</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Admin overview</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">
            Keep projects, clients, billing, and delivery aligned across the Binary Baker pipeline.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className={buttonPrimary} to="/admin/projects">
              Create project
            </Link>
            <Link className={buttonGhost} to="/admin/clients">
              Add client
            </Link>
            <Link className={buttonGhost} to="/admin/access">
              Assign access
            </Link>
            <Link className={buttonGhost} to="/admin/billing">
              New invoice
            </Link>
          </div>
        </div>

        <div className={`${cardBase} bg-gradient-to-br from-cream via-cream to-blue/10`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink/60">
                Operations pulse
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Weekly command center</h2>
              <p className="mt-2 text-sm text-ink/70">
                Clear blockers and keep approvals, billing, and access moving before the next sprint.
              </p>
            </div>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
              Live
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pulseItems.map((item) => (
              <div key={item.label} className="rounded-[16px] border border-ink/10 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cardBase}>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
