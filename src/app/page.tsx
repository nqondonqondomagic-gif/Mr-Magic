import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Sparkles,
  ArrowRight,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Users,
  Receipt,
  CheckSquare,
  FileText,
  Calendar,
  Lock,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-radial from-slate-900 via-navy-950 to-slate-950 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>MAGIC QUANT TRADING Corp · AI Business Operating System</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                AI agents that run the day-to-day work of your business.
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                One unified intelligent dashboard for South African entrepreneurs, SMEs, and growing companies. Manage CRM, tax invoices, tasks, staff, and SARS compliance—while 7 autonomous AI agents perform authorized work.
              </p>

              {/* CTA Row */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/checkout?plan=starter_month"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group"
                >
                  <span>Start with Starter — R499</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 text-brand-400" />
                  <span>Explore Live Interactive Demo</span>
                </Link>
              </div>

              {/* Commercial Guarantee Note */}
              <p className="text-xs text-slate-400">
                1-Month Non-Renewing Access · Single purchase of R499 · Instant activation within minutes
              </p>
            </div>

            {/* PRODUCT HERO MOCKUP */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="h-11 bg-slate-950/80 px-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500">
                    https://app.businessmanager.co.za · Apex Solutions (Pty) Ltd
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    7 AI Agents Active
                  </span>
                  <span className="text-[10px] bg-brand-900/60 text-brand-300 px-2 py-0.5 rounded border border-brand-700/50">
                    Starter Month Active
                  </span>
                </div>
              </div>

              {/* Mockup Dashboard Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Recorded Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white tracking-tight">R 201,250.00</p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% vs previous period</span>
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Pending Human Approvals</p>
                  <p className="text-2xl font-bold text-amber-400 tracking-tight">2 Actions</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Overdue notice & Sales proposal waiting
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">SARS eFiling Deadline</p>
                  <p className="text-2xl font-bold text-white tracking-tight">31 Oct 2026</p>
                  <p className="text-[11px] text-brand-400 pt-1">
                    VAT201 Workpaper Reconciled (R21,203.48)
                  </p>
                </div>

                {/* Agent Activity Bar */}
                <div className="md:col-span-3 p-4 rounded-xl bg-navy-950/80 border border-brand-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-2">
                        SARS Compliance Assistant
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                          AUDIT COMPLETED
                        </span>
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Verified 3 sales tax invoices against 4 supplier tax receipts. Calculated Net Output VAT under Section 20(4).
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/app/compliance"
                    className="px-4 py-2 rounded-lg bg-brand-600 text-xs font-bold text-white hover:bg-brand-500 shrink-0 text-center"
                  >
                    View eFiling Workpaper
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PROPOSITION: THE 7 SPECIALIZED AI AGENTS */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Core Differentiator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                7 Specialized AI Agents working for your business
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Not a simple chatbot with general text. Each agent has explicit permissions, module boundaries, tool contracts, and mandatory human sign-off for sensitive write actions.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Agent 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-900">Executive Assistant Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Summarises daily operational activity, organises leadership priorities, prepares meeting briefs, and flags overdue tasks across the company.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: Tasks, Calendar, Dashboard</span>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg text-slate-900">Sales & Pipeline Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Qualifies inbound leads, drafts personalized follow-up proposals, detects stale opportunities in your funnel, and summarizes deal close probabilities.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: CRM, Deals (Approval required for emails)</span>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg text-slate-900">Customer Service Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Answers client questions using approved company documentation, categorizes tickets, and drafts accurate responses grounded in your knowledge base.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: Knowledge Base, Documents</span>
                </div>
              </div>

              {/* Agent 4 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-bold text-lg text-slate-900">Finance Assistant Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Organises invoices and expenses, tracks debtor ageing, flags discrepancies, and prepares draft reminder statements. Cannot alter banking instructions.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: Invoices, Expenses, Debtor Reports</span>
                </div>
              </div>

              {/* Agent 5 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  5
                </div>
                <h3 className="font-bold text-lg text-slate-900">HR Assistant Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tracks employee leave requests under the South African BCEA, organizes employee onboarding checklists, and drafts role descriptions.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: Employee Records, Leave Workflow</span>
                </div>
              </div>

              {/* Agent 6 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center font-bold">
                  6
                </div>
                <h3 className="font-bold text-lg text-slate-900">Operations Agent</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Monitors active project milestones, detects workflow bottlenecks, coordinates task handoffs between staff, and generates operational status digests.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Permitted: Projects, Tasks, Milestones</span>
                </div>
              </div>

              {/* Agent 7 (Highlight) */}
              <div className="md:col-span-2 lg:col-span-3 p-8 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    7
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">
                      SARS Compliance Assistant
                    </h3>
                    <p className="text-xs text-emerald-700 font-medium">
                      Included in every plan · Localized for South African Revenue Service
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                  Automatically calculates 15% VAT201 Output/Input reconciliations from your invoices, formats EMP201 payroll figures, and tracks Provisional Tax (IRP6) deadlines. Prepares clean, reviewable workpaper checklists ready for submission on SARS eFiling.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-medium">
                    ✓ VAT201 eFiling Box Mapping
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-medium">
                    ✓ EMP201 PAYE/UIF/SDL
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-medium">
                    ✓ Provisional Tax (IRP6)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-medium">
                    ✓ Section 20(4) Tax Invoice Verification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN IN THE LOOP APPROVAL SYSTEM */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-400/20">
                  Total Peace of Mind
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Human Approval for sensitive actions.
                </h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Autonomous does not mean unsupervised. When an agent drafts a customer proposal, prepares an overdue statement, or proposes an invoice update, it stages the action in your <strong>Approval Queue</strong>.
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Inspect exact email copy, recipient, and amounts before sending.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>One-click Approve, Reject with comments, or edit payload.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Every action recorded in an immutable multi-tenant audit log.</span>
                  </li>
                </ul>
              </div>

              {/* Interactive Visual Queue Preview */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Pending Approval Queue (1)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">ID: appr-001</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      Finance Assistant Agent
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      Action: Overdue Statement Notice
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Recipient: <code className="text-brand-300">hello@ctroasters.co.za</code>
                    <br />
                    Subject: Statement Reminder: Invoice INV-2026-003 (R34,500.00)
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors">
                      Approve & Send
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING CALLOUT BANNER */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Clear, transparent South African pricing
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Start with our introductory 1-Month non-renewing access for R499. No surprise debit orders. Purchase another month whenever you choose.
            </p>

            <div className="p-8 rounded-2xl bg-white border-2 border-brand-500 shadow-xl max-w-md mx-auto space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Starter Access</h3>
                  <p className="text-xs text-slate-500">Get organised fast</p>
                </div>
                <span className="text-3xl font-extrabold text-slate-900">R 499</span>
              </div>
              <p className="text-xs text-slate-600">
                Single payment for 30 days of full commercial software access. <strong>Does not renew automatically.</strong>
              </p>

              <ul className="space-y-2 text-xs text-slate-700 border-t border-b border-slate-100 py-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1 User License included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All Core Modules (CRM, Invoices, Tasks, Expenses)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>First AI Agent (Executive Assistant)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SARS Compliance & eFiling Assistance in every plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Yoco & Card Payment Gateways</span>
                </li>
              </ul>

              <Link
                href="/checkout?plan=starter_month"
                className="w-full block text-center py-3 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-sm"
              >
                Purchase Starter — R499
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
