import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Bot,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sliders,
  History,
  Check,
} from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      title: "1. Executive Assistant Agent",
      role: "Operations & Leadership Support",
      description: "Summarises daily business activity, organises leadership priorities, prepares meeting briefs, and produces daily and weekly executive digests.",
      tools: ["list_tasks", "list_appointments", "get_financial_summary"],
      approvalRequired: "Creating external commitments or modifying project deliverables",
    },
    {
      title: "2. Sales & Pipeline Agent",
      role: "Revenue & Customer Growth",
      description: "Qualifies inbound leads using approved criteria, drafts customized client follow-ups, identifies stale pipeline opportunities, and produces pipeline forecasts.",
      tools: ["list_deals", "list_customers", "draft_customer_email"],
      approvalRequired: "Sending external emails or altering deal contract values",
    },
    {
      title: "3. Customer Service Agent",
      role: "Client Support & Document Inquiries",
      description: "Answers customer questions grounded strictly in your approved company documentation, categorizes incoming tickets, and escalates complex queries.",
      tools: ["search_knowledge_base", "create_support_task"],
      approvalRequired: "Directly dispatching outbound communications to customers",
    },
    {
      title: "4. Finance Assistant Agent",
      role: "Cash Flow & Invoicing Monitoring",
      description: "Organises invoices and expenses, identifies overdue receivables, checks payment matches against bank feeds, and flags accounting discrepancies.",
      tools: ["list_invoices", "list_expenses", "check_receivables_ageing", "stage_invoice_reminder"],
      approvalRequired: "Dispatching overdue debtor reminders or issuing new tax invoices. Cannot alter banking details.",
    },
    {
      title: "5. HR Assistant Agent",
      role: "Employee Administration",
      description: "Coordinates employee onboarding checklists, drafts job specifications, summarizes permitted employee records, and tracks leave requests under the BCEA.",
      tools: ["list_employees", "list_leave_requests", "draft_job_spec"],
      approvalRequired: "Approving leave or modifying employment records. Cannot make hiring/firing decisions.",
    },
    {
      title: "6. Operations Agent",
      role: "Workflow & Project Delivery",
      description: "Monitors active task queues, identifies delivery bottlenecks, coordinates handoffs between teams, and produces operational milestone reports.",
      tools: ["list_projects", "list_tasks", "generate_operational_report"],
      approvalRequired: "Reassigning client deadlines or modifying milestone contracts",
    },
    {
      title: "7. SARS Compliance Assistant",
      role: "South African Tax Preparation",
      description: "Tracks configured statutory deadlines on the SARS calendar, gathers supporting tax invoices, reconciles 15% VAT201 figures, and compiles eFiling checklists.",
      tools: ["calculate_vat201_workpaper", "check_sars_deadlines", "verify_tax_invoices"],
      approvalRequired: "Exporting final workpaper packages for practitioner review. Provides compilation assistance, not legal tax advice.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Autonomous Intelligence with Human Oversight
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              The 7 Specialized AI Business Agents
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Engineered as specialized digital workers rather than generic chatbots. Every tool call is validated server-side, and sensitive operations require your explicit sign-off.
            </p>
          </div>

          {/* Agents List */}
          <div className="mt-16 space-y-6 max-w-4xl mx-auto">
            {agents.map((a, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{a.title}</h3>
                    <p className="text-xs text-brand-600 font-semibold">{a.role}</p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    Model: GPT-4o / Claude 3.5
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{a.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-700 mb-1">Permitted Server Tools:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {a.tools.map((t, tIdx) => (
                        <code key={tIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {t}
                        </code>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                    <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      Human Approval Gate:
                    </p>
                    <p className="text-amber-800 leading-relaxed">{a.approvalRequired}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center">
            <Link
              href="/app/agents"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md"
            >
              <span>Test Agents in Interactive Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
