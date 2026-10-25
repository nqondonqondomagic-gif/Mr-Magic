"use client";

import { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Download,
  Calendar,
  CheckCircle2,
  Check,
  Printer,
  Sparkles,
  Bot,
} from "lucide-react";
import { sarsEngine, VAT201Workpaper, EMP201Workpaper, ProvisionalIRP6Workpaper } from "@/lib/compliance/sars";
import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export default function ComplianceWorkspacePage() {
  const orgId = "org-apex-001";
  const [activeTab, setActiveTab] = useState<"vat201" | "emp201" | "provisional">("vat201");
  const [vatWorkpaper, setVatWorkpaper] = useState<VAT201Workpaper>(
    sarsEngine.generateVAT201Workpaper(orgId, "2026/09")
  );
  const [empWorkpaper, setEmpWorkpaper] = useState<EMP201Workpaper>(
    sarsEngine.generateEMP201Workpaper(orgId, "2026/10")
  );
  const [irp6Workpaper, setIrp6Workpaper] = useState<ProvisionalIRP6Workpaper>(
    sarsEngine.generateProvisionalIRP6Workpaper(orgId, 2)
  );

  const [checklist, setChecklist] = useState([
    { id: 1, text: "All customer sales invoices sequentially numbered with valid Section 20(4) VAT details", done: true },
    { id: 2, text: "Supplier tax receipts verified for all deductible purchases exceeding R5,000", done: true },
    { id: 3, text: "Bank feed reconciles against received EFT deposits in the tax period", done: true },
    { id: 4, text: "Workpaper reviewed by Financial Controller (Lerato Khumalo)", done: true },
    { id: 5, text: "Transferred verified figures into SARS eFiling VAT201 wizard", done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleExportWorkpaper = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            SARS Compliance & eFiling Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            South African Revenue Service eFiling workpaper generator, Section 20(4) tax invoice verification, and statutory deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWorkpaper}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF Workpaper</span>
          </button>
        </div>
      </div>

      {/* Statutory Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Administrative Compilation Notice:</strong>{" "}
          This workspace compiles transaction data entered in Business Manager to assist you or your registered tax practitioner in completing submissions on SARS eFiling. This software does not provide legal tax advice or guarantee absence of SARS audit queries.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("vat201")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "vat201"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          VAT201 Workpaper (Aug / Sep 2026)
        </button>
        <button
          onClick={() => setActiveTab("emp201")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "emp201"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          EMP201 Employer Payroll (Oct 2026)
        </button>
        <button
          onClick={() => setActiveTab("provisional")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "provisional"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Provisional Tax (IRP6 - 2nd Period)
        </button>
      </div>

      {/* TAB 1: VAT201 */}
      {activeTab === "vat201" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Box Mappings (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    VAT201 Declaration Summary ({vatWorkpaper.period})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {vatWorkpaper.organisationName} · VAT No: {vatWorkpaper.vatNumber}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Ready to File
                </span>
              </div>

              {/* The eFiling Boxes */}
              <div className="space-y-3">
                {Object.entries(vatWorkpaper.efilingBoxMapping).map(([label, val], idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Invoices included: {vatWorkpaper.validInvoicesCount}</span>
                <span>Claimable receipts: {vatWorkpaper.claimableExpensesCount}</span>
                <span className="font-semibold text-brand-600">eFiling Cutoff: 31 Oct</span>
              </div>
            </div>
          </div>

          {/* Right: Submission Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-600" />
                SARS eFiling Readiness Checklist
              </h3>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                      item.done
                        ? "border-emerald-200 bg-emerald-50/50 text-slate-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklist(item.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={item.done ? "line-through text-slate-500" : ""}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p>1. Log in to your SARS eFiling profile.</p>
                <p>2. Select Returns Issued → Value-Added Tax (VAT201).</p>
                <p>3. Transfer the calculated box figures shown on the left.</p>
                <p>4. Authorise payment via eFiling Credit Push or EFT.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMP201 */}
      {activeTab === "emp201" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              EMP201 Monthly Employer Declaration ({empWorkpaper.period})
            </h3>
            <p className="text-xs text-slate-500">
              Employee Count: {empWorkpaper.employeeCount} · Due: {empWorkpaper.submissionDeadline}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">PAYE (Pay-As-You-Earn Tax)</span>
              <p className="text-xl font-bold text-slate-900">{formatZAR(empWorkpaper.payeCents)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">SDL (Skills Development Levy 1%)</span>
              <p className="text-xl font-bold text-slate-900">{formatZAR(empWorkpaper.sdlCents)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">UIF Employee (1% capped)</span>
              <p className="text-xl font-bold text-slate-900">{formatZAR(empWorkpaper.uifEmployeeCents)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">UIF Employer Contribution (1%)</span>
              <p className="text-xl font-bold text-slate-900">{formatZAR(empWorkpaper.uifEmployerCents)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <span className="font-bold text-sm text-emerald-950">Total EMP201 Liability Due</span>
            <span className="text-2xl font-extrabold text-emerald-800">
              {formatZAR(empWorkpaper.totalLiabilityCents)}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: PROVISIONAL IRP6 */}
      {activeTab === "provisional" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              Provisional Tax Return (IRP6) — Period 2 ({irp6Workpaper.yearOfAssessment})
            </h3>
            <p className="text-xs text-slate-500">
              Statutory corporate rate: 27% · Due date: {irp6Workpaper.submissionDeadline}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Annualized Estimated Taxable Profit</span>
              <span className="font-mono font-bold text-slate-900">
                {formatZAR(irp6Workpaper.estimatedTaxableIncomeCents)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Calculated Corporate Tax (27%)</span>
              <span className="font-mono font-bold text-slate-900">
                {formatZAR(irp6Workpaper.grossTaxLiabilityCents)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Less: 1st Period Provisional Paid</span>
              <span className="font-mono font-bold text-slate-900">
                - {formatZAR(irp6Workpaper.lessPreviousPaymentsCents)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex justify-between items-center text-sm">
              <span className="font-bold text-brand-950">Net 2nd Period Provisional Tax Due</span>
              <span className="font-extrabold text-xl text-brand-700">
                {formatZAR(irp6Workpaper.netProvisionalDueCents)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-2">
            {irp6Workpaper.statutoryThresholdWarning}
          </p>
        </div>
      )}
    </div>
  );
}
