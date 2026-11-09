"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Play,
  Sliders,
  AlertTriangle,
  Check,
} from "lucide-react";
import { db } from "@/lib/db/store";

export default function AgentsIndexPage() {
  const orgId = "org-apex-001";
  const [agents, setAgents] = useState(db.getAgents(orgId));
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/agents?organisationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.agents)) {
          setAgents(data.agents);
        }
      })
      .catch(() => {});
  }, []);

  const handleRunAgent = async (agentId: string) => {
    setRunningAgentId(agentId);
    setExecutionMessage(null);

    try {
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          organisationId: orgId,
          triggerSource: "manual",
        }),
      });

      const data = await res.json();
      if (data.execution) {
        const existingExecs = db.getAgentExecutions(orgId);
        if (!existingExecs.some((e) => e.id === data.execution.id)) {
          db.createAgentExecution(data.execution);
        }
      }
      if (Array.isArray(data.approvalsCreated)) {
        const existingApprs = db.getAgentApprovals(orgId);
        for (const appr of data.approvalsCreated) {
          if (!existingApprs.some((a) => a.id === appr.id)) {
            db.createAgentApproval(appr);
          }
        }
      }

      if (data.success) {
        setExecutionMessage({ text: data.message, isError: false });
      } else {
        setExecutionMessage({
          text: `Execution failed: ${data.error || data.message || "Unknown error"}`,
          isError: true,
        });
      }
    } catch (err: any) {
      setExecutionMessage({
        text: err.message || "Failed to trigger agent.",
        isError: true,
      });
    } finally {
      setRunningAgentId(null);
    }
  };

  const handleToggleActive = async (agentId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const updated = db.updateAgent(agentId, orgId, { is_active: nextStatus });
    if (updated) {
      setAgents([...db.getAgents(orgId)]);
    }

    try {
      const res = await fetch("/api/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          organisationId: orgId,
          updates: { is_active: nextStatus },
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.agents)) {
        setAgents(data.agents);
      }
    } catch {}
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-brand-600" />
            AI Agent Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            7 Specialized digital workers operating with server-side validation and human approval safeguards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/agents/activity"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
          >
            View Execution History
          </Link>
          <Link
            href="/app/agents/builder"
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>+ Build Custom Agent</span>
          </Link>
        </div>
      </div>

      {executionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in ${
            executionMessage.isError
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-brand-50 border-brand-200 text-brand-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {executionMessage.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-brand-600 shrink-0" />
            )}
            <span>{executionMessage.text}</span>
          </div>
          <Link
            href="/app/agents/activity"
            className="underline font-bold shrink-0 hover:opacity-80"
          >
            Inspect Logs →
          </Link>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const isRunning = runningAgentId === agent.id;

          return (
            <div
              key={agent.id}
              className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                agent.is_active ? "border-slate-200 hover:border-brand-400" : "border-slate-200 opacity-60 bg-slate-50/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {agent.category.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                      }`}
                    />
                    <span className="text-[10px] font-medium text-slate-500">
                      {agent.is_active ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900">{agent.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                {/* Tools & Modules */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <p className="text-[11px] font-bold text-slate-700">Permitted Server Tools:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.permitted_tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gate warning */}
                {agent.requires_approval_for.length > 0 && (
                  <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 leading-relaxed">
                    <strong>Gated:</strong> Requires approval for: {agent.requires_approval_for.join(", ")}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRunAgent(agent.id)}
                  disabled={isRunning || !agent.is_active}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                  <span>{isRunning ? "Executing..." : "Run Now"}</span>
                </button>

                <button
                  onClick={() => handleToggleActive(agent.id, agent.is_active)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {agent.is_active ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
