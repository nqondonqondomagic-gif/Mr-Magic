import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
} from "lucide-react";

export default function SarsAssistancePage() {
  const obligations = [
    {
      title: "VAT201 Declaration Workpapers",
      schedule: "Bi-Monthly (Category A/B) or Monthly",
      description: "Automatically aggregates all standard-rated sales tax invoices, computes 15% Output VAT, verifies supplier tax invoices under Section 20(4) of the VAT Act, and calculates deductible Input VAT.",
      efilingBoxes: ["Block 1 (Taxable turnover)", "Block 4 (Output VAT at 15%)", "Block 14 (Purchases)", "Block 15 (Input VAT deductible)", "Block 20 (Net Payable)"],
    },
    {
      title: "EMP201 Monthly Employer Return",
      schedule: "Monthly due by 7th of following month",
      description: "Reconciles gross employee salaries to compile monthly Pay-As-You-Earn (PAYE) income tax withholding, Skills Development Levy (SDL 1%), and Unemployment Insurance Fund (UIF 1% employee + 1% employer capped at statutory threshold).",
      efilingBoxes: ["PAYE Total", "SDL Total", "UIF Total", "Total Monthly Liability"],
    },
    {
      title: "Provisional Tax (IRP6)",
      schedule: "1st Period: 31 August · 2nd Period: 28 February",
      description: "Projects annualized turnover and allowable expenses from your recorded ledger to estimate taxable income at South Africa's 27% corporate tax rate, flagging statutory accuracy thresholds (80%/90%) to protect against Section 89quat penalties.",
      efilingBoxes: ["Estimated Taxable Income", "Calculated Gross Tax (27%)", "Less: 1st Period Paid", "Net 2nd Period Due"],
    },
    {
      title: "CIPC & Annual Secretarial Filings",
      schedule: "Annual Company Anniversary",
      description: "Tracks company registration renewal dates, turnover declarations for CIPC annual fees, and maintains the required Beneficial Ownership Register status.",
      efilingBoxes: ["Turnover Bracket Fee", "Beneficial Ownership Compliance", "COR14.3 Certificate Archive"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center justify-center gap-1.5 w-max mx-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Included in every plan · Starter & Monthly
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Practical SARS compliance & eFiling assistance
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Not a list of static tax dates or an empty disclaimer. A practical software engine that converts your daily sales invoices and expenses into reviewable, audit-ready workpapers for SARS eFiling.
            </p>
          </div>

          {/* Statutory Disclaimer Alert */}
          <div className="mt-12 max-w-4xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Important South African Statutory Disclaimer:</p>
              <p className="mt-0.5 text-amber-800">
                Business Manager provides administrative calculation assistance and structured compilation workpapers based on transactions entered by the customer. It does not replace a registered tax practitioner or accounting professional, does not independently submit tax returns directly without human sign-off, and does not provide formal legal tax advice.
              </p>
            </div>
          </div>

          {/* The 4 Core Statutory Workpapers */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {obligations.map((ob, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">{ob.title}</h3>
                  <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {ob.schedule}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{ob.description}</p>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-2">eFiling Box Values Generated:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ob.efilingBoxes.map((box, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
                      >
                        {box}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 9-Step Workflow */}
          <div className="mt-20 max-w-4xl mx-auto bg-slate-900 text-white p-8 sm:p-10 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                End-to-End Filing Workflow
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                How Business Manager prepares your return for SARS eFiling
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="space-y-1.5">
                <span className="text-brand-400 font-bold font-mono text-sm">Step 01 — 03</span>
                <p className="font-semibold text-white">Capture & Collect</p>
                <p className="text-slate-400 leading-relaxed">
                  Record sales invoices and supplier expenses in ZAR. Identify the relevant tax period on your statutory calendar.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-brand-400 font-bold font-mono text-sm">Step 04 — 06</span>
                <p className="font-semibold text-white">Validate & Reconcile</p>
                <p className="text-slate-400 leading-relaxed">
                  Audit for missing supplier tax invoices, ensure 15% VAT accuracy, and generate draft eFiling box summaries.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-brand-400 font-bold font-mono text-sm">Step 07 — 09</span>
                <p className="font-semibold text-white">Review & File</p>
                <p className="text-slate-400 leading-relaxed">
                  Review workpaper with your tax practitioner, transfer verified figures into SARS eFiling, and record your filing receipt.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-center">
              <Link
                href="/app/compliance"
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Inspect Live SARS Compliance Workspace →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
