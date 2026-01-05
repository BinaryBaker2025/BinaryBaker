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
  inputBase,
  labelBase,
  taskStatuses
} from "./adminData";

const defaultTaskForm = {
  title: "",
  projectId: "",
  owner: "",
  status: taskStatuses[0],
  dueDate: ""
};

export default function AdminManagement() {
  const { tasks, projects, orgId } = useOutletContext();
  const [taskForm, setTaskForm] = useState(defaultTaskForm);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState(defaultTaskForm);

  const projectLookup = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, {});
  }, [projects]);

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = taskForm.title.trim();
    if (!trimmedTitle || !taskForm.projectId) {
      return;
    }
    if (!orgId) {
      console.error("Cannot create task without org membership.");
      return;
    }

    try {
      await addDoc(collection(db, "orgs", orgId, "tasks"), {
        title: trimmedTitle,
        projectId: taskForm.projectId,
        owner: taskForm.owner.trim() || "Unassigned",
        status: taskForm.status,
        dueDate: taskForm.dueDate || "",
        createdAt: serverTimestamp()
      });
      setTaskForm(defaultTaskForm);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title || "",
      projectId: task.projectId || "",
      owner: task.owner || "",
      status: taskStatuses.includes(task.status) ? task.status : taskStatuses[0],
      dueDate: task.dueDate || ""
    });
  };

  const closeEdit = () => {
    setEditingTask(null);
    setEditForm(defaultTaskForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingTask) {
      return;
    }

    const trimmedTitle = editForm.title.trim();
    if (!trimmedTitle || !editForm.projectId) {
      return;
    }
    if (!orgId) {
      console.error("Cannot update task without org membership.");
      return;
    }

    try {
      await updateDoc(doc(db, "orgs", orgId, "tasks", editingTask.id), {
        title: trimmedTitle,
        projectId: editForm.projectId,
        owner: editForm.owner.trim() || "Unassigned",
        status: editForm.status,
        dueDate: editForm.dueDate || "",
        updatedAt: serverTimestamp()
      });
      closeEdit();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">
          Project management
        </p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Keep delivery moving with a live task board.
        </h1>
        <p className="mt-3 text-ink/70">
          Track active work across milestones and handoffs for each project team.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className={cardBase}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Delivery board</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {tasks.length} tasks
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {taskStatuses.map((status) => {
              const columnTasks = tasks.filter((task) => task.status === status);
              return (
                <div key={status} className="rounded-[16px] border border-ink/10 bg-cream/80 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{status}</h4>
                    <span className="text-xs text-ink/50">{columnTasks.length}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {columnTasks.length === 0 && (
                      <p className="text-xs text-ink/40">No tasks yet.</p>
                    )}
                    {columnTasks.map((task) => {
                      const project = projectLookup[task.projectId];
                      return (
                        <article key={task.id} className="rounded-[12px] border border-ink/10 bg-white/80 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold">{task.title}</p>
                            <button
                              className={buttonSubtle}
                              type="button"
                              onClick={() => openEdit(task)}
                            >
                              Edit
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-ink/60">
                            {project?.name || "Unknown project"}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-xs text-ink/60">
                            <span>{task.owner}</span>
                            <span>{task.dueDate || "No due date"}</span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form className={cardBase} onSubmit={handleTaskSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Add task</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">Workflow</span>
          </div>
          <div className="mt-6 grid gap-4">
            <label className={labelBase}>
              Task title
              <input
                className={inputBase}
                name="title"
                value={taskForm.title}
                onChange={handleTaskChange}
                placeholder="Create onboarding prototype"
                required
              />
            </label>
            <label className={labelBase}>
              Project
              <select
                className={inputBase}
                name="projectId"
                value={taskForm.projectId}
                onChange={handleTaskChange}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelBase}>
                Owner
                <input
                  className={inputBase}
                  name="owner"
                  value={taskForm.owner}
                  onChange={handleTaskChange}
                  placeholder="Team member"
                />
              </label>
              <label className={labelBase}>
                Status
                <select
                  className={inputBase}
                  name="status"
                  value={taskForm.status}
                  onChange={handleTaskChange}
                >
                  {taskStatuses.map((status) => (
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
                value={taskForm.dueDate}
                onChange={handleTaskChange}
              />
            </label>
            <button className={buttonPrimary} type="submit">
              Add task
            </button>
          </div>
        </form>
      </section>

      <Dialog open={Boolean(editingTask)} title="Edit task" onClose={closeEdit}>
        <form className="grid gap-4" onSubmit={handleEditSubmit}>
          <label className={labelBase}>
            Task title
            <input
              className={inputBase}
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              required
            />
          </label>
          <label className={labelBase}>
            Project
            <select
              className={inputBase}
              name="projectId"
              value={editForm.projectId}
              onChange={handleEditChange}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelBase}>
              Owner
              <input
                className={inputBase}
                name="owner"
                value={editForm.owner}
                onChange={handleEditChange}
                placeholder="Team member"
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
                {taskStatuses.map((status) => (
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
              value={editForm.dueDate}
              onChange={handleEditChange}
            />
          </label>
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
