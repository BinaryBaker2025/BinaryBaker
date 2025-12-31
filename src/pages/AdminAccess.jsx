import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase.js";
import {
  accessLevels,
  accessStyles,
  buttonPrimary,
  cardBase,
  inputBase,
  labelBase,
  pillBase,
  rowCard
} from "./adminData";

const defaultAssignmentForm = {
  projectId: "",
  clientId: "",
  access: accessLevels[2]
};

export default function AdminAccess() {
  const { assignments, projects, clients } = useOutletContext();
  const [assignmentForm, setAssignmentForm] = useState(defaultAssignmentForm);

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

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setAssignmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault();
    if (!assignmentForm.projectId || !assignmentForm.clientId) {
      return;
    }

    const alreadyAssigned = assignments.some(
      (assignment) =>
        assignment.projectId === assignmentForm.projectId &&
        assignment.clientId === assignmentForm.clientId
    );
    if (alreadyAssigned) {
      return;
    }

    try {
      await addDoc(collection(db, "assignments"), {
        projectId: assignmentForm.projectId,
        clientId: assignmentForm.clientId,
        access: assignmentForm.access,
        lastActive: "Just added",
        createdAt: serverTimestamp()
      });
      setAssignmentForm(defaultAssignmentForm);
    } catch (error) {
      console.error("Failed to assign client:", error);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Access</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Assign clients to projects and control visibility.
        </h1>
        <p className="mt-3 text-ink/70">
          Set access levels for every client so they only see the projects and billing data they need.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className={cardBase}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Project access</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {assignments.length} links
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {assignments.length === 0 && (
              <p className="text-sm text-ink/60">No assignments yet.</p>
            )}
            {assignments.map((assignment) => {
              const project = projectLookup[assignment.projectId];
              const client = clientLookup[assignment.clientId];
              return (
                <article key={assignment.id} className={rowCard}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                        {project?.service || "Project"}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">
                        {project?.name || "Unknown project"}
                      </h4>
                      <p className="mt-1 text-sm text-ink/70">
                        {client?.name || "Unknown client"} / {client?.company || "No company"}
                      </p>
                    </div>
                    <span className={`${pillBase} ${accessStyles[assignment.access]}`}>
                      {assignment.access}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/60">
                    <span>{client?.email || "No email on file"}</span>
                    <span>Last active: {assignment.lastActive || "Recently added"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form className={cardBase} onSubmit={handleAssignmentSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Assign client</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">Access</span>
          </div>
          <div className="mt-6 grid gap-4">
            <label className={labelBase}>
              Project
              <select
                className={inputBase}
                name="projectId"
                value={assignmentForm.projectId}
                onChange={handleAssignmentChange}
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelBase}>
              Client
              <select
                className={inputBase}
                name="clientId"
                value={assignmentForm.clientId}
                onChange={handleAssignmentChange}
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
              Access level
              <select
                className={inputBase}
                name="access"
                value={assignmentForm.access}
                onChange={handleAssignmentChange}
              >
                {accessLevels.map((access) => (
                  <option key={access} value={access}>
                    {access}
                  </option>
                ))}
              </select>
            </label>
            <button className={buttonPrimary} type="submit">
              Assign client
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
