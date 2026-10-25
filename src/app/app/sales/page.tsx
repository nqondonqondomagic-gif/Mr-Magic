"use client";

import { useState } from "react";
import {
  TrendingUp,
  Plus,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";
import { Deal } from "@/types";

const STAGES: { key: Deal["stage"]; label: string; color: string }[] = [
  { key: "lead", label: "New Leads", color: "bg-slate-100 text-slate-700" },
  { key: "contacted", label: "Contacted", color: "bg-brand-50 text-brand-700" },
  { key: "proposal", label: "Proposal Sent", color: "bg-indigo-50 text-indigo-700" },
  { key: "negotiation", label: "In Negotiation", color: "bg-amber-50 text-amber-700" },
  { key: "won", label: "Closed Won", color: "bg-emerald-50 text-emerald-700" },
  { key: "lost", label: "Closed Lost", color: "bg-rose-50 text-rose-700" },
];

export default function SalesPipelinePage() {
  const orgId = "org-apex-001";
  const [deals, setDeals] = useState(db.getDeals(orgId));
  const [modalOpen, setModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    customer_name: "Discovery Health Corporate",
    value_cents: 8500000,
    stage: "lead" as Deal["stage"],
    probability: 40,
    expected_close_date: "2026-11-30",
  });

  const totalPipelineValueCents = deals.reduce((sum, d) => sum + d.value_cents, 0);

  const handleAdvanceStage = (dealId: string, currentStage: Deal["stage"]) => {
    const stageOrder: Deal["stage"][] = ["lead", "contacted", "proposal", "negotiation", "won"];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      db.updateDealStage(dealId, orgId, nextStage);
      setDeals(db.getDeals(orgId));
    }
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    db.createDeal({
      id: `deal-${Date.now()}`,
      organisation_id: orgId,
      customer_name: newDeal.customer_name,
      title: newDeal.title,
      value_cents: newDeal.value_cents,
      stage: newDeal.stage,
      probability: newDeal.probability,
      expected_close_date: newDeal.expected_close_date,
      created_at: new Date().toISOString(),
    });
    setDeals(db.getDeals(orgId));
    setModalOpen(false);
    setNewDeal({
      title: "",
      customer_name: "Discovery Health Corporate",
      value_cents: 8500000,
      stage: "lead",
      probability: 40,
      expected_close_date: "2026-11-30",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-brand-600" />
            Sales Pipeline & Deal Flow
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total active pipeline value: <strong className="text-slate-900">{formatZAR(totalPipelineValueCents)}</strong> · South African Rand (ZAR)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Opportunity</span>
        </button>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.key);
          const colValue = colDeals.reduce((sum, d) => sum + d.value_cents, 0);

          return (
            <div key={col.key} className="bg-slate-100/70 p-3 rounded-2xl space-y-3 flex flex-col justify-between min-w-[200px]">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-800">{col.label}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {colDeals.length}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500">{formatZAR(colValue)}</p>

                {/* Cards */}
                <div className="space-y-2.5 pt-1">
                  {colDeals.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-brand-400 transition-colors"
                    >
                      <p className="font-bold text-xs text-slate-900 leading-snug">{d.title}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{d.customer_name}</span>
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-extrabold text-slate-900">{formatZAR(d.value_cents)}</span>
                        <span className="text-[10px] font-medium text-brand-600">{d.probability}%</span>
                      </div>

                      {col.key !== "won" && col.key !== "lost" && (
                        <button
                          onClick={() => handleAdvanceStage(d.id, d.stage)}
                          className="w-full mt-1.5 py-1 rounded bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-[10px] font-semibold text-slate-600 transition-colors flex items-center justify-center gap-1 border border-slate-200"
                        >
                          <span>Advance Stage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Add New Sales Deal
            </h3>

            <form onSubmit={handleAddDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Migration"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newDeal.customer_name}
                  onChange={(e) => setNewDeal({ ...newDeal, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deal Value (cents ZAR)</label>
                  <input
                    type="number"
                    required
                    value={newDeal.value_cents}
                    onChange={(e) => setNewDeal({ ...newDeal, value_cents: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400">{formatZAR(newDeal.value_cents)}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as Deal["stage"] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="lead">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="negotiation">In Negotiation</option>
                    <option value="won">Closed Won</option>
                  </select>
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
