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
  labelBase,
  pillBase,
  projectServices,
  projectStages,
  projectStatuses,
  projectStatusStyles,
  rowCard
} from "./adminData";

const defaultProjectForm = {
  name: "",
  service: projectServices[0],
  stage: projectStages[0],
  status: projectStatuses[0],
  dueDate: "",
  budget: "",
  lead: "",
  clientId: ""
};

const defaultProjectEditForm = {
  name: "",
  service: projectServices[0],
  stage: projectStages[0],
  status: projectStatuses[0],
  dueDate: "",
  budget: "",
  lead: ""
};

const defaultCurrency = "ZAR";

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

export default function AdminProjects() {
  const { projects, clients, assignments, orgId } = useOutletContext();
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState(defaultProjectEditForm);

  const clientLookup = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, [clients]);

  const assignmentsByProject = useMemo(() => {
    const map = {};
    assignments.forEach((assignment) => {
      if (!assignment.projectId || !assignment.clientId) {
        return;
      }
      if (!map[assignment.projectId]) {
        map[assignment.projectId] = [];
      }
      if (!map[assignment.projectId].includes(assignment.clientId)) {
        map[assignment.projectId].push(assignment.clientId);
      }
    });
    return map;
  }, [assignments]);

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = projectForm.name.trim();
    if (!trimmedName) {
      return;
    }

    try {
      const projectRef = await addDoc(collection(db, "projects"), {
        name: trimmedName,
        service: projectForm.service,
        stage: projectForm.stage,
        status: projectForm.status,
        dueDate: projectForm.dueDate || "",
        budget: projectForm.budget || "",
        lead: projectForm.lead || "",
        createdAt: serverTimestamp()
      });

      if (projectForm.clientId) {
        await addDoc(collection(db, "assignments"), {
          projectId: projectRef.id,
          clientId: projectForm.clientId,
          access: "Owner",
          lastActive: "Just added",
          createdAt: serverTimestamp()
        });
      }

      if (orgId) {
        const client = projectForm.clientId ? clientLookup[projectForm.clientId] : null;
        const unitPriceMinor = parseAmountToMinor(projectForm.budget);
        const baseMinor = unitPriceMinor;
        const lineItem = {
          itemId: null,
          name: `Project kickoff: ${trimmedName}`,
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
        const dueDateValue = projectForm.dueDate ? new Date(projectForm.dueDate) : null;
        const dueDate =
          dueDateValue && !Number.isNaN(dueDateValue.getTime())
            ? Timestamp.fromDate(dueDateValue)
            : null;

        await addDoc(collection(db, "orgs", orgId, "invoices"), {
          invoiceNumber: "",
          status: "draft",
          clientId: projectForm.clientId || "",
          clientSnapshot: buildClientSnapshot(client),
          currency: client?.currencyOverride || defaultCurrency,
          issueDate: Timestamp.now(),
          dueDate,
          lineItems: [lineItem],
          totals,
          amountPaidMinor: 0,
          balanceDueMinor: totals.totalMinor,
          notes: "",
          projectId: projectRef.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setProjectForm(defaultProjectForm);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name || "",
      service: projectServices.includes(project.service) ? project.service : projectServices[0],
      stage: projectStages.includes(project.stage) ? project.stage : projectStages[0],
      status: projectStatuses.includes(project.status) ? project.status : projectStatuses[0],
      dueDate: project.dueDate || "",
      budget: project.budget || "",
      lead: project.lead || ""
    });
  };

  const closeEdit = () => {
    setEditingProject(null);
    setEditForm(defaultProjectEditForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingProject) {
      return;
    }

    const trimmedName = editForm.name.trim();
    if (!trimmedName) {
      return;
    }

    try {
      await updateDoc(doc(db, "projects", editingProject.id), {
        name: trimmedName,
        service: editForm.service,
        stage: editForm.stage,
        status: editForm.status,
        dueDate: editForm.dueDate || "",
        budget: editForm.budget || "",
        lead: editForm.lead || "",
        updatedAt: serverTimestamp()
      });
      closeEdit();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Projects</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Create, assign, and track every active bake.
        </h1>
        <p className="mt-3 text-ink/70">
          Build new engagements, set timelines, and link clients so they can access their project hubs.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className={cardBase}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Project roster</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {projects.length} total
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {projects.length === 0 && (
              <p className="text-sm text-ink/60">No projects yet.</p>
            )}
            {projects.map((project) => {
              const assignedClientIds = assignmentsByProject[project.id] || [];
              return (
                <article key={project.id} className={rowCard}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                        {project.service}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">{project.name}</h4>
                      <p className="mt-1 text-sm text-ink/70">{project.stage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={buttonSubtle}
                        type="button"
                        onClick={() => openEdit(project)}
                      >
                        Edit
                      </button>
                      <span className={`${pillBase} ${projectStatusStyles[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-xs text-ink/70 sm:grid-cols-3">
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Lead</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {project.lead || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Due</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {project.dueDate || "TBD"}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] text-ink/50">Budget</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {project.budget || "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {assignedClientIds.length === 0 && (
                      <span className={`${pillBase} bg-ink/5 text-ink/60`}>No client</span>
                    )}
                    {assignedClientIds.map((clientId) => {
                      const client = clientLookup[clientId];
                      const label = client?.companyName || client?.name || "Unassigned";
                      return (
                        <span key={`${project.id}-${clientId}`} className={`${pillBase} bg-ink/5 text-ink/70`}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form className={cardBase} onSubmit={handleProjectSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Create project</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">New</span>
          </div>
          <div className="mt-6 grid gap-4">
            <label className={labelBase}>
              Project name
              <input
                className={inputBase}
                name="name"
                value={projectForm.name}
                onChange={handleProjectChange}
                placeholder="Launch kit redesign"
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Service track
                <select
                  className={inputBase}
                  name="service"
                  value={projectForm.service}
                  onChange={handleProjectChange}
                >
                  {projectServices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelBase}>
                Stage
                <select
                  className={inputBase}
                  name="stage"
                  value={projectForm.stage}
                  onChange={handleProjectChange}
                >
                  {projectStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Project lead
                <input
                  className={inputBase}
                  name="lead"
                  value={projectForm.lead}
                  onChange={handleProjectChange}
                  placeholder="Owner or PM"
                />
              </label>
              <label className={labelBase}>
                Due date
                <input
                  className={inputBase}
                  type="date"
                  name="dueDate"
                  value={projectForm.dueDate}
                  onChange={handleProjectChange}
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Budget
                <input
                  className={inputBase}
                  name="budget"
                  value={projectForm.budget}
                  onChange={handleProjectChange}
                  placeholder="$12,000"
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={projectForm.status}
                  onChange={handleProjectChange}
                >
                  {projectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className={labelBase}>
              Primary client
              <select
                className={inputBase}
                name="clientId"
                value={projectForm.clientId}
                onChange={handleProjectChange}
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName || client.name} ({client.name})
                  </option>
                ))}
              </select>
            </label>
            <button className={buttonPrimary} type="submit">
              Create project
            </button>
            <p className="text-xs text-ink/60">
              A draft invoice is created automatically for every new project.
            </p>
          </div>
        </form>
      </section>

      <Dialog open={Boolean(editingProject)} title="Edit project" onClose={closeEdit}>
        <form className="grid gap-4" onSubmit={handleEditSubmit}>
          <label className={labelBase}>
            Project name
            <input
              className={inputBase}
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelBase}>
              Service track
              <select
                className={inputBase}
                name="service"
                value={editForm.service}
                onChange={handleEditChange}
              >
                {projectServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelBase}>
              Stage
              <select
                className={inputBase}
                name="stage"
                value={editForm.stage}
                onChange={handleEditChange}
              >
                {projectStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelBase}>
              Project lead
              <input
                className={inputBase}
                name="lead"
                value={editForm.lead}
                onChange={handleEditChange}
              />
            </label>
            <label className={labelBase}>
              Due date
              <input
                className={inputBase}
                type="date"
                name="dueDate"
                value={editForm.dueDate}
                onChange={handleEditChange}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelBase}>
              Budget
              <input
                className={inputBase}
                name="budget"
                value={editForm.budget}
                onChange={handleEditChange}
              />
            </label>
            <label className={labelBase}>
              Status
              <select
                className={inputBase}
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className={buttonPrimary} type="submit">
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
