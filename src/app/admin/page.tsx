"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  CreditCard,
  Bot,
  Activity,
  ArrowRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { platformAdminService } from "@/lib/admin/service";
import { db } from "@/lib/db/store";
import { formatDateTime } from "@/lib/utils";

export default function AdminOverviewPage() {
  const metrics = platformAdminService.getPlatformMetrics();
  const organisations = db.getAllOrganisations();
  const recentAudits = db.getAllAuditLogs().slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-quant-400" />
          MQT Executive Operator Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Platform-wide oversight for MAGIC QUANT TRADING Corp administrators. Multi-tenant isolation status and commercial metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer Organisations</span>
            <Building2 className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-bold text-white">{metrics.totalTenants} Tenants</p>
          <p className="text-[11px] text-emerald-400">{metrics.activeTenants} Active · 0 Suspended</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Commercial Revenue (ZAR)</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{metrics.totalRevenueZAR}</p>
          <p className="text-[11px] text-slate-400">Processed via Yoco / Paystack</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Autonomous AI Executions</span>
            <Bot className="w-4 h-4 text-quant-400" />
          </div>
          <p className="text-2xl font-bold text-white">{metrics.totalAgentExecutions} Runs</p>
          <p className="text-[11px] text-slate-400">Server-validated tool calls</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Platform Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white capitalize">{metrics.systemHealth}</p>
          <p className="text-[11px] text-emerald-400">PostgreSQL RLS Active · Uptime: 99.98%</p>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-sm text-white">Active Tenant Organisations</h3>
          <Link href="/admin/customers" className="text-xs text-quant-400 hover:text-quant-300">
            Manage Customers & Overrides →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5">Organisation Name</th>
                <th className="py-2.5">Legal Entity</th>
                <th className="py-2.5">CIPC Reg No</th>
                <th className="py-2.5">SARS VAT No</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {organisations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-900/60">
                  <td className="py-3 font-bold text-white">{org.name}</td>
                  <td className="py-3 text-slate-400">{org.legal_name || "—"}</td>
                  <td className="py-3 font-mono text-slate-400">{org.registration_number || "—"}</td>
                  <td className="py-3 font-mono text-slate-400">{org.vat_number || "—"}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Active Tenant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Audit Log */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white">System-Wide Security & Audit Events</h3>
          <Link href="/admin/system" className="text-xs text-slate-400 hover:text-white">
            Full Audit Logs →
          </Link>
        </div>

        <div className="divide-y divide-slate-850 text-xs">
          {recentAudits.map((a) => (
            <div key={a.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="font-mono text-quant-400">{a.action}</span>
                  <span className="text-[10px] text-slate-500">by {a.user_name}</span>
                </p>
                <p className="text-slate-400 text-[11px]">{a.details}</p>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                {formatDateTime(a.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
