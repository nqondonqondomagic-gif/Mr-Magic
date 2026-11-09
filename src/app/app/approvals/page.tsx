"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Bot,
  Check,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatDateTime } from "@/lib/utils";

export default function ApprovalsPage() {
  const orgId = "org-apex-001";
  const [approvals, setApprovals] = useState(db.getAgentApprovals(orgId));
  const [selectedApproval, setSelectedApproval] = useState<any>(approvals[0] || null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/agents?organisationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.approvals)) {
          setApprovals(data.approvals);
          if (data.approvals.length > 0) {
            setSelectedApproval((prev: any) =>
              prev ? data.approvals.find((a: any) => a.id === prev.id) || data.approvals[0] : data.approvals[0]
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleResolve = async (id: string, action: "approved" | "rejected") => {
    setIsSubmitting(true);
    setActionSuccess(null);
    const resolvedComments =
      commentText || (action === "approved" ? "Approved by Business Owner" : "Rejected by Business Owner");

    try {
      const res = await fetch(`/api/agents/approvals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          comments: resolvedComments,
          organisationId: orgId,
          reviewerId: "user-sipho-001",
        }),
      });

      const data = await res.json();
      // Keep client-side db in sync as well
      db.resolveAgentApproval(id, orgId, action, "user-sipho-001", resolvedComments);

      const updatedList = Array.isArray(data.approvals) ? data.approvals : db.getAgentApprovals(orgId);
      setApprovals(updatedList);
      setSelectedApproval(updatedList.find((a: any) => a.id === id) || null);
      setActionSuccess(`Action successfully ${action.toUpperCase()} and recorded in audit log.`);
      setCommentText("");
    } catch {
      db.resolveAgentApproval(id, orgId, action, "user-sipho-001", resolvedComments);
      const updatedList = [...db.getAgentApprovals(orgId)];
      setApprovals(updatedList);
      setSelectedApproval(updatedList.find((a) => a.id === id) || null);
      setActionSuccess(`Action marked as ${action.toUpperCase()}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-brand-600" />
          Human Approval Queue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, approve, or reject consequential actions proposed by autonomous AI agents before execution.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Pending & Historic Invocations ({approvals.length})
          </h3>

          <div className="space-y-2.5">
            {approvals.map((appr) => {
              const isSelected = selectedApproval?.id === appr.id;

              return (
                <div
                  key={appr.id}
                  onClick={() => setSelectedApproval(appr)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-brand-600" />
                      {appr.agent_name}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        appr.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : appr.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {appr.status}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium line-clamp-2 leading-relaxed">
                    {appr.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100/80 mt-2">
                    <span>{formatDateTime(appr.created_at)}</span>
                    <span className="font-mono text-slate-500">Action: {appr.action_type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details & Decision Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedApproval ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {selectedApproval.id}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedApproval.action_type.replace(/_/g, " ").toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Proposed by {selectedApproval.agent_name} · Expires in 24h
                  </p>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    selectedApproval.status === "pending"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : selectedApproval.status === "approved"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  Status: {selectedApproval.status}
                </span>
              </div>

              {/* Proposed Payload Inspection */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Proposed Execution Payload:</p>
                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{JSON.stringify(selectedApproval.proposed_payload, null, 2)}</pre>
                </div>
              </div>

              {/* If resolved details */}
              {selectedApproval.status !== "pending" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold">Decision Audit Log:</p>
                  <p>Resolved at: {formatDateTime(selectedApproval.reviewed_at)}</p>
                  <p>Reviewer Comments: {selectedApproval.comments || "None"}</p>
                </div>
              )}

              {/* Action Buttons for Pending */}
              {selectedApproval.status === "pending" && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reviewer Comments / Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Add an internal comment or approval note"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleResolve(selectedApproval.id, "approved")}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Execute Action</span>
                    </button>

                    <button
                      onClick={() => handleResolve(selectedApproval.id, "rejected")}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Cancel Action</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              Select an approval request to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
