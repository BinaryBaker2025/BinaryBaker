import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase.js";
import {
  buttonPrimary,
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

export default function AdminProjects() {
  const { projects, clients, assignments } = useOutletContext();
  const [projectForm, setProjectForm] = useState(defaultProjectForm);

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

      setProjectForm(defaultProjectForm);
    } catch (error) {
      console.error("Failed to create project:", error);
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
                    <span className={`${pillBase} ${projectStatusStyles[project.status]}`}>
                      {project.status}
                    </span>
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
                      const label = client?.company || client?.name || "Unassigned";
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
                    {client.company} ({client.name})
                  </option>
                ))}
              </select>
            </label>
            <button className={buttonPrimary} type="submit">
              Create project
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
