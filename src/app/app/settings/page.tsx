"use client";

import { useState } from "react";
import { Settings, Building2, ShieldCheck, Download, Trash2, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db/store";

export default function SettingsPage() {
  const orgId = "org-apex-001";
  const [org, setOrg] = useState(db.getOrganisation(orgId));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: org?.name || "Apex Solutions (Pty) Ltd",
    legal_name: org?.legal_name || "Apex Solutions Proprietary Limited",
    registration_number: org?.registration_number || "2021/489211/07",
    tax_number: org?.tax_number || "9218291024",
    vat_number: org?.vat_number || "4920198273",
    address: "150 West Street, Sandton, Johannesburg, 2196",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateOrganisation(orgId, formData);
    if (updated) {
      setOrg(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(null as any), 3000);
    }
  };

  const handleExportPOPIA = () => {
    const data = {
      organisation: org,
      customers: db.getCustomers(orgId),
      invoices: db.getInvoices(orgId),
      tasks: db.getTasks(orgId),
      employees: db.getEmployees(orgId),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `popia-data-export-apex-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-600" />
          Workspace Settings & Legal Details
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage South African CIPC company numbers, SARS tax configurations, and POPIA data subject rights.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Organization settings saved successfully.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Company Statutory Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Operating Business Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registered Legal Entity Name</label>
            <input
              type="text"
              required
              value={formData.legal_name}
              onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">CIPC Registration Number</label>
            <input
              type="text"
              placeholder="e.g. 2021/489211/07"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">SARS Income Tax Number</label>
            <input
              type="text"
              placeholder="e.g. 9218291024"
              value={formData.tax_number}
              onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">SARS 10-Digit VAT Registration Number</label>
            <input
              type="text"
              placeholder="e.g. 4920198273"
              value={formData.vat_number}
              onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Physical Business Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* POPIA Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          POPIA Data Subject Access & Self-Serve Portability
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          In compliance with the South African Protection of Personal Information Act (POPIA), you can export a complete machine-readable archive of all customer profiles, financial invoices, employee records, and audit logs.
        </p>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleExportPOPIA}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Complete POPIA JSON Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}
