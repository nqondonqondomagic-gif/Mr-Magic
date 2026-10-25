"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sliders,
  Bot,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { BUSINESS_TOOLS } from "@/lib/ai/tools";
import { AgentCategory } from "@/types";

export default function AgentBuilderPage() {
  const router = useRouter();
  const orgId = "org-apex-001";
  const allToolNames = Object.keys(BUSINESS_TOOLS);

  const [formData, setFormData] = useState({
    name: "Customer Retention & Renewal Agent",
    category: "sales_agent" as AgentCategory,
    description: "Monitors contract renewal dates, flags accounts with declining usage, and drafts retention offers.",
    systemInstructions:
      "You are the Customer Retention Agent for Apex Solutions. Identify accounts with agreements expiring within 60 days. Calculate renewal contract values and stage personalized retention outreach. Always require human approval before sending any email.",
    model: "gpt-4o",
    permittedTools: ["list_customers", "list_deals", "draft_customer_email"],
    requiresApprovalFor: ["draft_customer_email"],
    budgetTokens: 10000,
    schedule: "0 9 * * 1", // Every Monday 9am
    isActive: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToolToggle = (toolName: string) => {
    if (formData.permittedTools.includes(toolName)) {
      setFormData({
        ...formData,
        permittedTools: formData.permittedTools.filter((t) => t !== toolName),
        requiresApprovalFor: formData.requiresApprovalFor.filter((t) => t !== toolName),
      });
    } else {
      setFormData({
        ...formData,
        permittedTools: [...formData.permittedTools, toolName],
      });
    }
  };

  const handleApprovalToggle = (toolName: string) => {
    if (formData.requiresApprovalFor.includes(toolName)) {
      setFormData({
        ...formData,
        requiresApprovalFor: formData.requiresApprovalFor.filter((t) => t !== toolName),
      });
    } else {
      setFormData({
        ...formData,
        requiresApprovalFor: [...formData.requiresApprovalFor, toolName],
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent = db.createAgent({
      id: `agent-${Date.now()}`,
      organisation_id: orgId,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      system_instructions: formData.systemInstructions,
      model: formData.model,
      permitted_tools: formData.permittedTools,
      permitted_modules: ["crm", "sales", "tasks"],
      schedule: formData.schedule,
      requires_approval_for: formData.requiresApprovalFor,
      budget_tokens: formData.budgetTokens,
      is_active: formData.isActive,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: orgId,
      user_name: "Sipho Ndlovu",
      action: "agent_created",
      entity_type: "agent",
      entity_id: newAgent.id,
      details: `Created custom agent "${newAgent.name}" with ${newAgent.permitted_tools.length} permitted tools.`,
      created_at: new Date().toISOString(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/app/agents");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-600" />
            Visual Agent Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system objectives, server tool capabilities, execution triggers, and human approval gates.
          </p>
        </div>
        <Link href="/app/agents" className="text-xs text-slate-500 hover:text-slate-800">
          ← Cancel
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Custom AI Agent created and configured successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Basic Metadata */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Identity & Objective
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Agent Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialized Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AgentCategory })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="sales_agent">Sales & Pipeline Agent</option>
                <option value="executive_assistant">Executive Assistant</option>
                <option value="customer_service">Customer Service Agent</option>
                <option value="finance_assistant">Finance Assistant Agent</option>
                <option value="hr_assistant">HR Assistant Agent</option>
                <option value="operations_agent">Operations Agent</option>
                <option value="sars_compliance">SARS Compliance Assistant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Instructions & Behavioral Directives
            </label>
            <textarea
              rows={4}
              required
              value={formData.systemInstructions}
              onChange={(e) => setFormData({ ...formData, systemInstructions: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Server Tools & Approval Gates */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>2. Permitted Server Tools & Human Approval Gates</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Server-enforced access boundary
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allToolNames.map((toolName) => {
              const toolDef = BUSINESS_TOOLS[toolName];
              const isPermitted = formData.permittedTools.includes(toolName);
              const isGated = formData.requiresApprovalFor.includes(toolName);

              return (
                <div
                  key={toolName}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition-colors ${
                    isPermitted ? "border-brand-500/50 bg-brand-50/20" : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                      <input
                        type="checkbox"
                        checked={isPermitted}
                        onChange={() => handleToolToggle(toolName)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{toolDef.name}</span>
                    </label>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      {toolDef.module}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">{toolDef.description}</p>

                  {isPermitted && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Require Human Approval?</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-amber-800">
                        <input
                          type="checkbox"
                          checked={isGated || toolDef.isSensitive}
                          disabled={toolDef.isSensitive}
                          onChange={() => handleApprovalToggle(toolName)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>{toolDef.isSensitive ? "Mandatory Gate" : "Gated"}</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Budget & Trigger Schedule */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Model, Schedule & Budget Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">AI Model Engine</label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Production)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gemini-2-flash">Gemini 2.0 Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cron Trigger Schedule</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g. 0 8 * * 1-5"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Standard 5-field cron syntax</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Token Budget Per Run</label>
              <input
                type="number"
                value={formData.budgetTokens}
                onChange={(e) => setFormData({ ...formData, budgetTokens: parseInt(e.target.value) || 5000 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/app/agents"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Save & Deploy Custom Agent</span>
          </button>
        </div>
      </form>
    </div>
  );
}
