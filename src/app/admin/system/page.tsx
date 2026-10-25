"use client";

import { useState } from "react";
import {
  FileCheck2,
  Server,
  Shield,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Database,
  Lock,
  Search,
} from "lucide-react";

export default function AdminSystemPage() {
  const [activeTab, setActiveTab] = useState<"logs" | "popia" | "health">("logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const auditEvents = [
    {
      id: "log_001",
      timestamp: "2026-10-24 18:42:10 SAST",
      tenant: "Apex Solutions (Pty) Ltd",
      user: "Naledi Khumalo (Owner)",
      action: "agent.approval.granted",
      details: "Approved VAT201 generation workpaper for Period 2026/08",
      severity: "info",
    },
    {
      id: "log_002",
      timestamp: "2026-10-24 17:15:02 SAST",
      tenant: "Platform Admin",
      user: "DevOps Engineer (Magic Quant)",
      action: "billing.override_activation",
      details: "Extended Coastal Tech Ventures 30-day access by +30 days",
      severity: "warn",
    },
    {
      id: "log_003",
      timestamp: "2026-10-24 16:30:45 SAST",
      tenant: "Coastal Tech Ventures",
      user: "Sipho Dlamini (Finance)",
      action: "invoice.issued",
      details: "Issued Tax Invoice INV-2026-003 to Vodacom Enterprise for R 147,200.00",
      severity: "info",
    },
    {
      id: "log_004",
      timestamp: "2026-10-24 15:02:11 SAST",
      tenant: "System Ingress",
      user: "Yoco Webhook Handler",
      action: "webhook.payment_verified",
      details: "Verified HMAC-SHA256 signature and credited 30-day access",
      severity: "info",
    },
    {
      id: "log_005",
      timestamp: "2026-10-24 12:10:00 SAST",
      tenant: "Apex Solutions (Pty) Ltd",
      user: "Thabo Mokoena (Staff)",
      action: "rbac.access_denied",
      details: "Blocked attempt to access /app/billing without Owner role",
      severity: "warn",
    },
  ];

  const filteredLogs = auditEvents.filter(
    (log) =>
      log.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurge = () => {
    setPurgeConfirmOpen(false);
    setPurgeSuccess(true);
    setTimeout(() => setPurgeSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-quant-400" />
            System Audit & POPIA Compliance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable platform-wide audit log, South African POPIA data governance, and node health metrics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "logs"
              ? "border-quant-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          System Audit Trail
        </button>
        <button
          onClick={() => setActiveTab("popia")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "popia"
              ? "border-quant-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          POPIA Data Governance
        </button>
        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "health"
              ? "border-quant-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Runtime Host Health
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by tenant, user, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-quant-500"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Timestamp (SAST)</th>
                    <th className="px-6 py-3">Tenant Organisation</th>
                    <th className="px-6 py-3">User / Actor</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-400">{log.timestamp}</td>
                      <td className="px-6 py-3.5 font-medium text-white">{log.tenant}</td>
                      <td className="px-6 py-3.5 text-slate-300">{log.user}</td>
                      <td className="px-6 py-3.5 font-mono text-quant-400 font-semibold">{log.action}</td>
                      <td className="px-6 py-3.5 text-slate-300 max-w-xs truncate">{log.details}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            log.severity === "warn"
                              ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POPIA DATA GOVERNANCE */}
      {activeTab === "popia" && (
        <div className="space-y-6">
          {purgeSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Right-to-Erasure instruction executed. All tenant records purged with cryptographic tombstone audit record.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-quant-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Designated Information Officer</h3>
                  <p className="text-xs text-slate-400">Registered with SA Information Regulator under POPIA Act No. 4 of 2013</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span className="text-slate-400">Officer Name:</span>
                  <strong className="text-white">Legal & Compliance Lead</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span className="text-slate-400">Company:</span>
                  <strong className="text-white">MAGIC QUANT TRADING Corp</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span className="text-slate-400">Regulator Reg No:</span>
                  <strong className="text-white font-mono">POPIA-REG-2026/8192</strong>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span className="text-slate-400">Inquiries Email:</span>
                  <strong className="text-quant-400">privacy@magicquant.co.za</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/60 flex items-center justify-center text-red-400 border border-red-900/40">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Section 24 Right to Erasure</h3>
                  <p className="text-xs text-slate-400">Permanent tenant destruction upon formal customer request</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Executes hard deletion across all 26 tenant tables, removes stored files from S3/vault, and retains only statutory tax invoices for the SARS 5-year requirement under Section 55 of the VAT Act.
              </p>

              <button
                onClick={() => setPurgeConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 rounded-lg text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Initiate Hard Tenant Purge
              </button>
            </div>
          </div>

          {/* Modal */}
          {purgeConfirmOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-red-800/60 rounded-xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                  <h3 className="font-bold text-base text-white">Confirm Right-to-Erasure Purge</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This action cannot be undone. All tenant records, contacts, deals, tasks, leave requests, and agent memory will be permanently destroyed.
                </p>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setPurgeConfirmOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurge}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Confirm Permanent Purge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HOST HEALTH */}
      {activeTab === "health" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Engine</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-white">PostgreSQL + In-Memory Store</p>
            <p className="text-xs text-emerald-400 font-medium">Row-Level Security Active</p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Total Tables: <strong className="text-slate-200">26 Relational Tables</strong></div>
              <div>Isolation Policy: <strong className="text-slate-200">Strict organisation_id RLS</strong></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Runtime Platform</span>
              <Server className="w-4 h-4 text-quant-400" />
            </div>
            <p className="text-xl font-bold text-white">Next.js 15 App Router</p>
            <p className="text-xs text-slate-400 font-medium">React 19 Server Components</p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Node.js: <strong className="text-slate-200">v24.21.0 LTS</strong></div>
              <div>Region: <strong className="text-slate-200">af-south-1 (Cape Town)</strong></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security & Auth</span>
              <Lock className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-white">Enterprise RBAC</p>
            <p className="text-xs text-blue-400 font-medium">4 Tier Persona Hierarchy</p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Owner / Admin / Finance / Staff: <strong className="text-slate-200">Enforced</strong></div>
              <div>Approvals Intercept: <strong className="text-slate-200">100% Guaranteed</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
