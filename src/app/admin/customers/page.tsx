"use client";

import { useState } from "react";
import { Building2, ShieldCheck, Power, Key, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db/store";
import { platformAdminService } from "@/lib/admin/service";
import { Organisation } from "@/types";

export default function AdminCustomersPage() {
  const [organisations, setOrganisations] = useState<Organisation[]>(db.getAllOrganisations());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleToggleSuspend = (orgId: string, currentStatus: boolean) => {
    try {
      const updated = platformAdminService.toggleOrganisationSuspension(orgId, "user-mqt-admin", currentStatus);
      setOrganisations([...db.getAllOrganisations()]);
      setActionNotice(`Tenant "${updated.name}" is now ${updated.is_active ? "ACTIVATED" : "SUSPENDED"}.`);
    } catch (err: any) {
      setActionNotice(err.message);
    }
  };

  const handleManualActivate = (orgId: string) => {
    try {
      platformAdminService.manualActivateOrganisation(orgId, "user-mqt-admin", "Operator approved 30-day manual trial override.");
      setOrganisations([...db.getAllOrganisations()]);
      setActionNotice(`Manual 30-day subscription override activated for organisation.`);
    } catch (err: any) {
      setActionNotice(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-quant-400" />
          Tenant Organisations & Customer Accounts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          MAGIC QUANT TRADING Corp operator control. Manual account activation exceptions, tenant suspension, and RLS isolation audits.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-quant-500/20 border border-quant-500/40 text-xs font-semibold text-quant-200 flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-quant-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tenants Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800 bg-slate-900/60">
              <tr>
                <th className="py-3 px-4">Workspace & Legal Name</th>
                <th className="py-3 px-4">Tenant Identifier</th>
                <th className="py-3 px-4">CIPC / Tax Details</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4 text-right">Operator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {organisations.map((org) => {
                const sub = db.getSubscription(org.id);

                return (
                  <tr key={org.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{org.name}</p>
                      <p className="text-[11px] text-slate-400">{org.legal_name || "Sole Proprietor"}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {org.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <p>CIPC: {org.registration_number || "Pending"}</p>
                      <p className="text-[10px] text-slate-500">VAT: {org.vat_number || "None"}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <p>{org.country} · {org.currency}</p>
                      <p className="text-[10px] text-slate-500">{org.timezone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          org.is_active
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {org.is_active ? "Active" : "Suspended"}
                      </span>
                      {sub && (
                        <p className="text-[10px] text-quant-400 mt-1">
                          Plan: {sub.plan?.name || "Active"}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleManualActivate(org.id)}
                        className="text-xs font-semibold text-quant-400 hover:text-quant-300 underline"
                      >
                        Manual 30d Override
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(org.id, org.is_active)}
                        className={`text-xs font-bold ${
                          org.is_active ? "text-rose-400 hover:text-rose-300" : "text-emerald-400 hover:text-emerald-300"
                        }`}
                      >
                        {org.is_active ? "Suspend" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
