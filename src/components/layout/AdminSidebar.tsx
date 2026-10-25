"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Building2,
  CreditCard,
  Bot,
  Activity,
  FileCheck2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Executive Overview", icon: ShieldAlert },
    { href: "/admin/customers", label: "Tenant Organisations", icon: Building2 },
    { href: "/admin/billing", label: "Payments & Invoices", icon: CreditCard },
    { href: "/admin/agents", label: "AI Models & Tokens", icon: Bot },
    { href: "/admin/integrations", label: "Integrations Health", icon: Activity },
    { href: "/admin/system", label: "Audit Logs & System", icon: FileCheck2 },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-quant-600 flex items-center justify-center text-white shadow-md shadow-quant-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              Platform Admin
            </span>
            <p className="text-[10px] text-quant-400 font-medium tracking-wide">
              MAGIC QUANT TRADING
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Operator Controls
          </p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-quant-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Return to App */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <Link
          href="/app"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Tenant App</span>
        </Link>
      </div>
    </aside>
  );
}
