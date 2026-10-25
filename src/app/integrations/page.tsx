import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { INTEGRATION_REGISTRY } from "@/lib/integrations/registry";
import { Plug, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = Object.values(INTEGRATION_REGISTRY);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Ecosystem Connectivity
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Connect your existing business applications
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Real integrations, not simulated connections. Connect your South African payment gateways, accounting packages, calendars, and messaging systems.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Auth: {item.authMethod.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-700 mb-1.5">Capabilities:</p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/app/integrations`}
                    className="font-bold text-brand-600 hover:text-brand-700"
                  >
                    Configure in App →
                  </Link>
                  <a
                    href={item.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <span>API Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/app/integrations"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm"
            >
              <span>Manage Connected Integrations in App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
