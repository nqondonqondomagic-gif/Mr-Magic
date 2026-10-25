"use client";

import { useState } from "react";
import { CheckSquare, Plus, CheckCircle2, Clock, AlertTriangle, User } from "lucide-react";
import { db } from "@/lib/db/store";
import { Task } from "@/types";

export default function TasksPage() {
  const orgId = "org-apex-001";
  const [tasks, setTasks] = useState(db.getTasks(orgId));
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    assigned_to: "user-sipho-001",
    assignee_name: "Sipho Ndlovu",
  });

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const handleToggleTaskStatus = (id: string, currentStatus: Task["status"]) => {
    const nextStatus = currentStatus === "completed" ? "todo" : "completed";
    db.updateTaskStatus(id, orgId, nextStatus);
    setTasks(db.getTasks(orgId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    db.createTask({
      id: `task-${Date.now()}`,
      organisation_id: orgId,
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      due_date: newTask.due_date,
      assigned_to: newTask.assigned_to,
      assignee_name: newTask.assignee_name,
      created_at: new Date().toISOString(),
    });
    setTasks(db.getTasks(orgId));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-brand-600" />
            Operational Tasks & Workflows
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign team deliverables, track milestone deadlines, and enable AI agents to execute permitted tasks.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {["all", "todo", "in_progress", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
              filter === tab
                ? "bg-brand-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={t.status === "completed"}
                onChange={() => handleToggleTaskStatus(t.id, t.status)}
                className="mt-1 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <div className="space-y-1">
                <p
                  className={`text-sm font-bold text-slate-900 ${
                    t.status === "completed" ? "line-through text-slate-400" : ""
                  }`}
                >
                  {t.title}
                </p>
                {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  {t.project_name && (
                    <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {t.project_name}
                    </span>
                  )}
                  <span>Due: {t.due_date}</span>
                  <span>Assignee: {t.assignee_name || "Unassigned"}</span>
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 ${
                t.priority === "urgent"
                  ? "bg-rose-100 text-rose-800"
                  : t.priority === "high"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {t.priority}
            </span>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Create New Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit supplier invoices for VAT compliance"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Brief</label>
                <textarea
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
