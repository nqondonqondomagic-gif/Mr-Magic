"use client";

import { useState } from "react";
import Link from "next/link";
import {
  History,
  Bot,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatDateTime } from "@/lib/utils";

export default function AgentActivityPage() {
  const orgId = "org-apex-001";
  const [executions, setExecutions] = useState(db.getAgentExecutions(orgId));
  const [expandedId, setExpandedId] = useState<string | null>(executions[0]?.id || null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-600" />
            Agent Activity & Execution Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail of all autonomous digital worker runs, step-by-step tool calls, execution durations, and token usage.
          </p>
        </div>
        <Link
          href="/app/agents"
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
        >
          Agent Command Center
        </Link>
      </div>

      {/* Executions Table */}
      <div className="space-y-4">
        {executions.map((ex) => {
          const isExpanded = expandedId === ex.id;

          return (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{ex.agent_name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">ID: {ex.id}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Started: {formatDateTime(ex.started_at)} · Trigger: {ex.trigger_source}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-slate-700">
                      {(ex.execution_duration_ms / 1000).toFixed(2)}s
                    </p>
                    <p className="text-[11px] text-slate-400">{ex.total_tokens} tokens</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      ex.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : ex.status === "waiting_approval"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {ex.status.replace("_", " ")}
                  </span>

                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Step-by-Step Tool Traces */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Execution Steps ({ex.steps?.length || 0})
                  </h4>

                  {ex.steps && ex.steps.length > 0 ? (
                    <div className="space-y-2">
                      {ex.steps.map((st) => (
                        <div
                          key={st.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-brand-700">
                              Step {st.step_number}: {st.tool_name}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                                st.status === "success"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : st.status === "blocked_approval"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {st.status.replace("_", " ")}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <p className="font-semibold text-slate-500 mb-0.5">Input Arguments:</p>
                              <pre className="p-2 rounded bg-slate-50 font-mono overflow-x-auto border border-slate-200">
                                {JSON.stringify(st.tool_input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-500 mb-0.5">Output Response:</p>
                              <pre className="p-2 rounded bg-slate-50 font-mono overflow-x-auto border border-slate-200 text-slate-700">
                                {JSON.stringify(st.tool_output, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No detailed steps recorded.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
