import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ShieldCheck, Lock, Database, FileCheck, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  const pillars = [
    {
      icon: Database,
      title: "PostgreSQL Row-Level Security (RLS)",
      description: "Tenant isolation is enforced strictly at the database layer. Every table query requires an organization context match. Users from Organisation A can never read, modify, or export Organisation B data.",
    },
    {
      icon: Lock,
      title: "Encrypted Integration Secrets",
      description: "API keys, webhook signing secrets, and OAuth credentials are encrypted at rest using AES-256 and never logged or exposed to client-side browsers.",
    },
    {
      icon: ShieldCheck,
      title: "Protection of Personal Information Act (POPIA)",
      description: "Designed in accordance with South African POPIA condition principles: purpose limitation, data minimization, secure data subject access requests, and self-serve export.",
    },
    {
      icon: FileCheck,
      title: "Immutable Multi-Tenant Audit Trail",
      description: "Every sensitive action—from subscription activation and employee salary updates to AI tool executions—is permanently logged with timestamps, user identities, and action summaries.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Enterprise Defense & POPIA
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Enterprise security built into the core architecture
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              We design security and data isolation directly into our database schemas and agent validation engines—never as an afterthought.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-brand-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>

          {/* AI Safety Boundary Notice */}
          <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-slate-900 text-white space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-400" />
              AI Agent Execution Safeguards
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI Agents running in Business Manager never receive unrestricted shell execution, direct database SQL queries, or access to third-party secrets. All tool invocations are checked server-side for permission validity. Any proposed sensitive write action is halted and placed in the Human Approval Queue.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
