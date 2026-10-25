import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-navy-900 text-brand-400 mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Get Started with Business Manager
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              To guarantee verified tenant isolation and immediate account provisioning, select a plan to activate your company workspace.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Starter Access</span>
              <span className="font-extrabold text-base text-brand-600">R 499</span>
            </div>
            <p className="text-xs text-slate-600">
              Single 30-day commercial purchase. Non-renewing. Immediate automated workspace creation.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Core CRM, Invoicing & Tasks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SARS Compliance & eFiling Workpapers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Executive Assistant AI Agent</span>
              </li>
            </ul>
          </div>

          <Link
            href="/checkout?plan=starter_month"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>Proceed to Checkout — R499</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-slate-500">
            Already have an active workspace?{" "}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
