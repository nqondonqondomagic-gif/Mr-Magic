"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Download, Receipt, Bot, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export default function ReportsPage() {
  const orgId = "org-apex-001";
  const invoices = db.getInvoices(orgId);
  const expenses = db.getExpenses(orgId);
  const deals = db.getDeals(orgId);
  const executions = db.getAgentExecutions(orgId);

  const totalPaidRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total_cents, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount_cents, 0);
  const netOperatingProfit = totalPaidRevenue - totalExpenses;
  const totalPipeline = deals.reduce((s, d) => s + d.value_cents, 0);

  const handleExportCSV = () => {
    const headers = "Type,Reference/Title,Date,Amount_ZAR\n";
    const invoiceRows = invoices.map((i) => `"Revenue","${i.invoice_number} - ${i.customer_name}","${i.issue_date}","${(i.total_cents / 100).toFixed(2)}"`);
    const expenseRows = expenses.map((e) => `"Expense","${e.payee} (${e.category})","${e.date}","-${(e.amount_cents / 100).toFixed(2)}"`);
    const csvContent = headers + [...invoiceRows, ...expenseRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            Executive Reports & Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconciled revenue, operating expense ratios, debtor ageing, and autonomous agent productivity.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Ledger (CSV)</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Paid Commercial Revenue</span>
          <p className="text-2xl font-bold text-slate-900">{formatZAR(totalPaidRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Reconciled via Bank EFT</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Operating Expenses</span>
          <p className="text-2xl font-bold text-slate-900">{formatZAR(totalExpenses)}</p>
          <p className="text-[11px] text-slate-500">Cape Town AWS, Fibre, Regus</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Net Operating Cash Flow</span>
          <p className={`text-2xl font-bold ${netOperatingProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatZAR(netOperatingProfit)}
          </p>
          <p className="text-[11px] text-slate-500">Gross margin: ~{((netOperatingProfit / (totalPaidRevenue || 1)) * 100).toFixed(0)}%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Sales Pipeline Value</span>
          <p className="text-2xl font-bold text-brand-700">{formatZAR(totalPipeline)}</p>
          <p className="text-[11px] text-brand-600 font-medium">3 active qualified deals</p>
        </div>
      </div>

      {/* Debtor Ageing Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          Accounts Receivable Debtors Ageing Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500">Current (0–30 Days)</span>
            <p className="text-lg font-bold text-slate-900">R 86,250.00</p>
            <p className="text-[10px] text-slate-400">Shoprite Digital Labs</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
            <span className="text-amber-800 font-semibold">31–60 Days Overdue</span>
            <p className="text-lg font-bold text-amber-900">R 34,500.00</p>
            <p className="text-[10px] text-amber-700">Cape Town Roasters (Reminder Staged)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500">61–90 Days</span>
            <p className="text-lg font-bold text-slate-900">R 0.00</p>
            <p className="text-[10px] text-slate-400">Zero default debt</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500">90+ Days (Doubtful Debt)</span>
            <p className="text-lg font-bold text-slate-900">R 0.00</p>
            <p className="text-[10px] text-slate-400">Section 11(j) allowance: N/A</p>
          </div>
        </div>
      </div>

      {/* Agent Compute & Token Cost Monitoring */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-base text-slate-900">AI Agent Productivity & Token Consumption</h3>
          </div>
          <span className="text-xs text-slate-500">Total Runs: {executions.length}</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {executions.map((ex) => (
            <div key={ex.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{ex.agent_name}</p>
                <p className="text-[11px] text-slate-500">
                  Trigger: {ex.trigger_source} · Duration: {(ex.execution_duration_ms / 1000).toFixed(1)}s
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-800">{ex.total_tokens} tokens</span>
                <span className="text-[10px] text-emerald-600 block">Est cost: ~R 0.42</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
