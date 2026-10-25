import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CheckCircle2, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Commercial Plans
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Honest, transparent pricing for South African business
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Start with our introductory 1-Month non-renewing access for R499. No unexpected recurring charges or lock-in contracts.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan (One-Time) */}
            <div className="rounded-2xl bg-white border-2 border-brand-600 p-8 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-8 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Single Purchase · Non-Renewing
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Starter Access</h3>
                  <p className="text-xs text-slate-500 mt-1">Get organised fast. Full 30-day commercial access.</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">R 499</span>
                  <span className="text-xs text-slate-500 font-medium">for 1 month access</span>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed font-medium">
                  <strong>Notice:</strong> This purchase is a one-time payment for 30 days of software access. It does <strong>not</strong> renew automatically.
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>1 User</strong> License included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full Core Modules (CRM, Invoices, Expenses, Tasks)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>First AI Agent (Executive Assistant)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic Integrations (Email, Calendar, Yoco)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>SARS Compliance & eFiling assistance</strong> in every plan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Email & Help Centre Support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/checkout?plan=starter_month"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-md shadow-brand-600/20"
                >
                  <span>Select Starter — R499</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Configurable Monthly Plan */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Business Manager — Monthly</h3>
                  <p className="text-xs text-slate-500 mt-1">Continuous operations with multi-agent orchestration.</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">R 1,299</span>
                  <span className="text-xs text-slate-500 font-medium">/ month (Configurable)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  Recurring subscription. Billed monthly via Yoco or Paystack with clear self-serve cancellation terms.
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Up to 5 Users</strong> included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>All 7 Specialized AI Agents</strong> unlocked</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Visual Agent Builder & Custom Tool Permissions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited Integrations (Xero, Sage, WhatsApp)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Advanced SARS eFiling Workpapers & EMP501</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority WhatsApp & Email SLA</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/checkout?plan=business_monthly"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm"
                >
                  <span>Configure Monthly Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 text-center">
              Frequently Asked Commercial Questions
            </h2>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  Does the Starter R499 plan renew automatically?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No. The Starter plan provides 30 calendar days of access from the date of payment. It does not renew automatically, and your card will never be charged without your explicit authorisation. You can purchase another 30-day period whenever your access expires.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  What is included in SARS assistance?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every plan includes our South African SARS Compliance Engine and SARS Compliance Assistant Agent. It calculates 15% VAT201 Output and Input reconciliations, EMP201 employer liabilities, and Provisional Tax (IRP6) estimates, giving you an eFiling-ready checklist to submit on SARS eFiling.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  How quickly do I receive login access after payment?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our system automates workspace provisioning immediately upon payment confirmation via our Yoco webhook. You will receive an activation email with a secure sign-in link, and our commercial promise ensures full onboarding within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
