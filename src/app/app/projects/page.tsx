"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, Calendar, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export default function ProjectsPage() {
  const orgId = "org-apex-001";
  const [projects, setProjects] = useState(db.getProjects(orgId));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-brand-600" />
            Client Projects & Delivery Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track deliverable milestones, budget utilization in ZAR, and team velocity across client accounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:border-brand-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-brand-100 text-brand-800">
                {p.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Milestone Completion</span>
                <span className="font-bold text-slate-900">{p.progress_percent || 0}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${p.progress_percent || 0}%` }}
                />
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Project Budget:</span>
                <span className="font-bold text-slate-900">{formatZAR(p.budget_cents)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Due Date:</span>
                <span className="font-semibold text-slate-800">{p.due_date || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
