import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Users,
  Receipt,
  CheckSquare,
  Calendar,
  FileText,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function FeaturesPage() {
  const modules = [
    {
      icon: Users,
      name: "CRM & Sales Pipeline",
      description: "Manage client relationships, track contacts, categorize leads, and guide opportunities through customizable deal stages with ZAR currency tracking.",
      points: ["Customer & company records", "Interactive deal stages", "Customer communication history", "CSV import and export"],
    },
    {
      icon: Receipt,
      name: "Tax Invoicing & Finance",
      description: "Generate compliant South African Tax Invoices under Section 20(4) of the VAT Act with 15% VAT calculation, payment status tracking, and expense recording.",
      points: ["Sequential invoice numbering", "15% South African VAT computation", "Debtor ageing & overdue tracking", "Categorized expense receipts"],
    },
    {
      icon: CheckSquare,
      name: "Tasks & Project Management",
      description: "Coordinate team deliverables, set milestone deadlines, assign priorities, and link tasks directly to client projects.",
      points: ["Project dashboard & milestones", "Task priority & due dates", "Recurring operational tasks", "Activity & comment histories"],
    },
    {
      icon: Calendar,
      name: "Scheduling & Calendar",
      description: "Book client appointments, schedule executive meetings, and automatically sync events with Google Calendar.",
      points: ["Business calendar overview", "Meeting preparation notes", "Google Calendar integration", "Automated follow-up tasks"],
    },
    {
      icon: FileText,
      name: "Document Management & Knowledge Base",
      description: "Centralized file vault for contracts, corporate secretarial certificates, and tax records with OCR text extraction and AI search.",
      points: ["Categorized document folders", "OCR & text extraction", "Business knowledge base for AI", "Secure file access permissions"],
    },
    {
      icon: UserCheck,
      name: "HR & Staff Management",
      description: "Track employee records, job roles, and manage annual, sick, and family responsibility leave requests under the South African BCEA.",
      points: ["Employee directory & roles", "BCEA leave requests & approvals", "Onboarding checklists", "Payroll export framework"],
    },
    {
      icon: ShieldCheck,
      name: "SARS Compliance Assistance",
      description: "Compile VAT201, EMP201, and Provisional Tax (IRP6) workpapers from your recorded transactions, ready for verification and SARS eFiling submission.",
      points: ["VAT201 eFiling box mapping", "EMP201 PAYE, UIF, and SDL summary", "Provisional tax estimations", "Compliance audit checklists"],
    },
    {
      icon: BarChart3,
      name: "Reports & Executive Analytics",
      description: "Gain complete visibility into business revenue, sales conversion velocities, expense breakdowns, and AI agent token consumption.",
      points: ["Monthly revenue trends", "Accounts receivable ageing", "Agent productivity metrics", "Downloadable CSV data exports"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              One Unified Business Data Layer
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Every tool your business needs, connected to AI
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Traditional business management software built with modular independence, combined with 7 autonomous agents working inside authorized boundaries.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
                    {m.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/checkout?plan=starter_month"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md"
            >
              <span>Get Started with Starter — R499</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
