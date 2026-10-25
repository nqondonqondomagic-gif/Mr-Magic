"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  Bot,
  Calendar,
  CheckSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";

export default function AppDashboardPage() {
  const orgId = "org-apex-001";
  const invoices = db.getInvoices(orgId);
  const pendingApprovals = db.getPendingApprovals(orgId);
  const tasks = db.getTasks(orgId);
  const appointments = db.getAppointments(orgId);
  const executions = db.getAgentExecutions(orgId);
  const compliance = db.getComplianceObligations(orgId);

  // Financial aggregates
  const totalRevenueCents = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total_cents, 0);
  const totalOutstandingCents = invoices.filter((i) => i.status === "issued" || i.status === "overdue").reduce((sum, i) => sum + i.balance_due_cents, 0);
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Apex Solutions (Pty) Ltd · Operating Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous Business OS · All 7 AI Agents active · South African Rand (ZAR)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/agents"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>AI Agent Command</span>
          </Link>
          <Link
            href="/app/invoices"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
          >
            + New Tax Invoice
          </Link>
        </div>
      </div>

      {/* PENDING APPROVALS ALERT BANNER */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>{pendingApprovals.length} Actions Require Your Human Approval</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                  Gated Workflow
                </span>
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                AI agents have staged external debtor reminders and sales proposals. Inspect and approve before dispatch.
              </p>
            </div>
          </div>
          <Link
            href="/app/approvals"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 text-center shadow-xs transition-colors"
          >
            Open Approval Queue ({pendingApprovals.length}) →
          </Link>
        </div>
      )}

      {/* TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Paid Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Paid Revenue (ZAR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatZAR(totalRevenueCents)}
          </p>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
            <span>+15.2% vs previous period</span>
          </p>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Outstanding Invoices</span>
            <Receipt className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatZAR(totalOutstandingCents)}
          </p>
          <p className="text-[11px] text-slate-500">2 active invoices awaiting EFT</p>
        </div>

        {/* Overdue Debtors */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Overdue Balances</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 tracking-tight">
            {formatZAR(overdueInvoices.reduce((s, i) => s + i.balance_due_cents, 0))}
          </p>
          <p className="text-[11px] text-rose-700">1 invoice overdue &gt; 14 days</p>
        </div>

        {/* SARS Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>SARS VAT201 eFiling</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            R 21,203.48
          </p>
          <p className="text-[11px] text-brand-600">Reconciled · Due 31 Oct 2026</p>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: LEFT (AI AGENTS & COMPLIANCE), RIGHT (TASKS & CALENDAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* AI Agents Live Status Box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-sm text-white">AI Agent Orchestration</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
                7 OF 7 READY
              </span>
            </div>

            <div className="space-y-3">
              {executions.slice(0, 2).map((ex) => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-white flex items-center gap-2">
                      {ex.agent_name}
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono ${
                          ex.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {ex.status.replace("_", " ")}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Duration: {(ex.execution_duration_ms / 1000).toFixed(1)}s · Tokens: {ex.total_tokens} · Trigger: {ex.trigger_source}
                    </p>
                  </div>
                  <Link
                    href="/app/agents/activity"
                    className="text-[11px] text-brand-400 hover:text-brand-300 underline shrink-0"
                  >
                    View Logs
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
              <span className="text-slate-400">Tokens used today: 4,790 / 25,000</span>
              <Link href="/app/agents" className="font-semibold text-brand-400 hover:text-white">
                Manage Agents →
              </Link>
            </div>
          </div>

          {/* South African SARS Compliance Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">SARS Compliance Workspace</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">South Africa Localized</span>
            </div>

            <div className="space-y-3">
              {compliance.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{c.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Period: {c.period_label} · Due: {c.due_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatZAR(c.calculated_tax_cents)}</p>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold ${
                        c.status === "ready_to_file"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "in_progress"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <Link
                href="/app/compliance"
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Open Full eFiling Workpapers & Checklist →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Upcoming Appointments */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">Upcoming Meetings</h3>
              </div>
              <Link href="/app/calendar" className="text-xs text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-bold text-xs text-slate-900">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.customer_name}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{formatDate(a.start_time)}</span>
                    <span className="text-emerald-700 font-semibold">{a.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Tasks */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">Active Operational Tasks</h3>
              </div>
              <Link href="/app/tasks" className="text-xs text-brand-600 hover:underline">
                Task Board
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">{t.title}</p>
                    <p className="text-[10px] text-slate-500">
                      Due: {t.due_date} · Assignee: {t.assignee_name}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      t.priority === "urgent"
                        ? "bg-rose-100 text-rose-800"
                        : t.priority === "high"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
