import Link from "next/link";
import { Sparkles, ShieldCheck, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Business Manager
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Owned and operated by MAGIC QUANT TRADING Corp
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The AI-powered business operating system designed for South African entrepreneurs, SMEs, and growing companies. Autonomous agent workflows with human oversight.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Johannesburg & Cape Town, South Africa</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Core Modules
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-white transition-colors">
                  AI Agents Suite
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-white transition-colors">
                  Connected Integrations
                </Link>
              </li>
              <li>
                <Link href="/sars-assistance" className="hover:text-white transition-colors">
                  SARS eFiling Support
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing (R499/mo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  POPIA & Data Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms#refund" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/security#isolation" className="hover:text-white transition-colors">
                  Tenant Isolation Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Account & Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client Sign In
                </Link>
              </li>
              <li>
                <Link href="/activate" className="hover:text-white transition-colors">
                  Activate Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-400 transition-colors text-xs">
                  Operator Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Required by Specification */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Statutory Notice:</strong> Business Manager is business management and automation software operated by MAGIC QUANT TRADING Corp. SARS compliance tools provide administrative preparation assistance and compilation workpapers for eFiling. The platform does not provide legal tax advice, represent users as a registered tax practitioner, or submit returns without customer review and authorisation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-400 text-xs gap-4">
            <p>© {new Date().getFullYear()} MAGIC QUANT TRADING Corp. All rights reserved.</p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Tenant PostgreSQL Isolation · POPIA Ready</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
