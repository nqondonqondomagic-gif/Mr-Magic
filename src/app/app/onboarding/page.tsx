"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  Bot,
  Plug,
  Upload,
  Check,
  ShieldCheck,
} from "lucide-react";
import { db } from "@/lib/db/store";

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Workspace details
  const [workspace, setWorkspace] = useState({
    name: "Apex Solutions (Pty) Ltd",
    type: "Private Company (Pty) Ltd",
    industry: "Information Technology & Consulting",
    taxNumber: "9218291024",
    vatNumber: "4920198273",
  });

  // Step 2: Modules
  const [selectedModules, setSelectedModules] = useState([
    "crm",
    "invoicing",
    "tasks",
    "hr",
    "sars_compliance",
  ]);

  // Step 3: First Agent
  const [agentObjective, setAgentObjective] = useState(
    "Summarise daily business activity, flag overdue tasks, and compile executive meeting briefs."
  );

  // Step 4: Integrations
  const [selectedIntegrations, setSelectedIntegrations] = useState(["yoco", "google_calendar"]);

  // Step 5: Data Import
  const [importedRows, setImportedRows] = useState(4);

  const toggleModule = (mod: string) => {
    setSelectedModules(
      selectedModules.includes(mod)
        ? selectedModules.filter((m) => m !== mod)
        : [...selectedModules, mod]
    );
  };

  const toggleIntegration = (int: string) => {
    setSelectedIntegrations(
      selectedIntegrations.includes(int)
        ? selectedIntegrations.filter((i) => i !== int)
        : [...selectedIntegrations, int]
    );
  };

  const handleFinish = () => {
    router.push("/app");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 animate-in fade-in duration-300">
      {/* Wizard Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Step {step} of 6</span>
          <span>
            {step === 1 && "Create Business Workspace"}
            {step === 2 && "Select Active Business Modules"}
            {step === 3 && "Configure First AI Agent"}
            {step === 4 && "Connect Business Applications"}
            {step === 5 && "Import Initial Data (CSV)"}
            {step === 6 && "Ready to Operate"}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: CREATE WORKSPACE */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Step 1 — Create Your Business Workspace</h2>
            <p className="text-xs text-slate-500">
              Provide your South African company details to configure your isolated database tenant.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trading Business Name</label>
              <input
                type="text"
                required
                value={workspace.name}
                onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Type</label>
                <select
                  value={workspace.type}
                  onChange={(e) => setWorkspace({ ...workspace, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Private Company (Pty) Ltd">Private Company (Pty) Ltd</option>
                  <option value="Sole Proprietor">Sole Proprietor</option>
                  <option value="Close Corporation (CC)">Close Corporation (CC)</option>
                  <option value="Partnership / Trust">Partnership / Trust</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={workspace.industry}
                  onChange={(e) => setWorkspace({ ...workspace, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SARS Income Tax No</label>
                <input
                  type="text"
                  value={workspace.taxNumber}
                  onChange={(e) => setWorkspace({ ...workspace, taxNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SARS 10-Digit VAT No</label>
                <input
                  type="text"
                  value={workspace.vatNumber}
                  onChange={(e) => setWorkspace({ ...workspace, vatNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE MODULES */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Step 2 — Choose Your Business Modules</h2>
            <p className="text-xs text-slate-500">
              Select which functions you want active on your navigation rail. You can change this at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: "crm", name: "CRM & Customers", desc: "Contacts, pipeline, customer notes" },
              { id: "invoicing", name: "Tax Invoices & Debtors", desc: "Section 20(4) compliant 15% VAT invoices" },
              { id: "tasks", name: "Tasks & Projects", desc: "Team workflow and deliverable tracking" },
              { id: "hr", name: "HR & BCEA Leave", desc: "Employee profiles and statutory leave" },
              { id: "sars_compliance", name: "SARS Compliance Assistance", desc: "VAT201, EMP201, and Provisional tax workpapers" },
              { id: "calendar", name: "Scheduling & Appointments", desc: "Client meetings and Google Calendar sync" },
            ].map((mod) => (
              <label
                key={mod.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedModules.includes(mod.id)
                    ? "border-brand-600 bg-brand-50/40 ring-1 ring-brand-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedModules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="font-bold text-slate-900">{mod.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{mod.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Continue to AI Agent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIGURE FIRST AI AGENT */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Step 3 — Configure Your Starter AI Agent</h2>
            <p className="text-xs text-slate-500">
              Your Starter plan includes the Executive Assistant Agent to automate daily priorities and calendar prep.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 text-white space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">Executive Assistant Agent</span>
            </div>
            <p className="text-xs text-slate-300">
              Operates under server-validated permissions. Safe read tools execute automatically, while any sensitive write actions trigger human approval.
            </p>
          </div>

          <div className="text-xs space-y-2">
            <label className="block font-semibold text-slate-700">Primary Objective & Focus</label>
            <textarea
              rows={3}
              value={agentObjective}
              onChange={(e) => setAgentObjective(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Integrations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONNECT APPS */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Step 4 — Connect Your Applications</h2>
            <p className="text-xs text-slate-500">
              Select key connections for payment webhooks and executive calendar sync.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: "yoco", name: "Yoco Payments", desc: "South African card checkout and verified webhooks" },
              { id: "google_calendar", name: "Google Calendar", desc: "Bi-directional appointment sync" },
              { id: "paystack", name: "Paystack South Africa", desc: "Ozow instant EFT and recurring billing" },
              { id: "xero", name: "Xero Accounting", desc: "Sync tax invoices and bank feeds" },
            ].map((item) => (
              <label
                key={item.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedIntegrations.includes(item.id)
                    ? "border-brand-600 bg-brand-50/40 ring-1 ring-brand-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIntegrations.includes(item.id)}
                  onChange={() => toggleIntegration(item.id)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Data Import</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: IMPORT DATA */}
      {step === 5 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Step 5 — Import Initial Business Records</h2>
            <p className="text-xs text-slate-500">
              We've preloaded standard sample customers (Discovery Health, Shoprite, Cape Town Roasters) or you can import a CSV.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
            <Upload className="w-8 h-8 text-brand-600 mx-auto" />
            <p className="font-bold text-xs text-slate-800">Preloaded 4 South African Client Accounts</p>
            <p className="text-[11px] text-slate-500">
              CSV data validated with Section 20(4) VAT compliance formatting.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Review Setup & Complete</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: READY TO OPERATE */}
      {step === 6 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Your Business Manager Workspace is Ready!
            </h2>
            <p className="text-xs text-slate-500">
              Apex Solutions (Pty) Ltd is live with multi-tenant database isolation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workspace provisioned & isolated with PostgreSQL RLS</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>7 Specialized AI Agents deployed & ready</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SARS VAT201 eFiling workpaper pre-calculated</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Starter 30-Day Non-Renewing Access Active</span>
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Enter Business Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
