"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  CheckCircle2,
  Users,
  TrendingUp,
  Receipt,
  CreditCard,
  CheckSquare,
  FolderKanban,
  Calendar,
  FileText,
  UserCheck,
  BarChart3,
  Plug,
  ShieldCheck,
  Settings,
  Sparkles,
  Sliders,
  History,
  AlertTriangle,
  Building2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  pendingApprovalsCount?: number;
  overdueComplianceCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({
  pendingApprovalsCount = 2,
  overdueComplianceCount = 1,
  isOpen = false,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  const navSections = [
    {
      title: "AI Operating System",
      items: [
        { href: "/app", label: "Dashboard", icon: LayoutDashboard },
        { href: "/app/agents", label: "AI Agents", icon: Bot, badge: "7 Ready" },
        {
          href: "/app/approvals",
          label: "Human Approvals",
          icon: CheckCircle2,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
          badgeColor: "bg-amber-500 text-white font-bold",
        },
        { href: "/app/agents/builder", label: "Agent Builder", icon: Sliders },
        { href: "/app/agents/activity", label: "Execution Logs", icon: History },
      ],
    },
    {
      title: "Core Business",
      items: [
        { href: "/app/clients", label: "CRM & Customers", icon: Users },
        { href: "/app/sales", label: "Sales Pipeline", icon: TrendingUp },
        { href: "/app/invoices", label: "Tax Invoices", icon: Receipt },
        { href: "/app/expenses", label: "Expenses", icon: CreditCard },
        { href: "/app/tasks", label: "Tasks", icon: CheckSquare },
        { href: "/app/projects", label: "Projects", icon: FolderKanban },
        { href: "/app/calendar", label: "Appointments", icon: Calendar },
        { href: "/app/documents", label: "Documents & KB", icon: FileText },
        { href: "/app/hr", label: "HR & Staff", icon: UserCheck },
      ],
    },
    {
      title: "South Africa Compliance",
      items: [
        {
          href: "/app/compliance",
          label: "SARS eFiling Support",
          icon: ShieldCheck,
          badge: overdueComplianceCount > 0 ? "VAT Due" : undefined,
          badgeColor: "bg-emerald-500 text-white font-medium",
        },
        { href: "/app/reports", label: "Reports & Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Administration",
      items: [
        { href: "/app/integrations", label: "Integrations", icon: Plug },
        { href: "/app/billing", label: "Billing & Plan", icon: CreditCard },
        { href: "/app/team", label: "Team & Roles", icon: Users },
        { href: "/app/settings", label: "Settings & POPIA", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-950 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                Business Manager
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                MAGIC QUANT TRADING
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h5>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/app"
                      ? pathname === "/app"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        isActive
                          ? "bg-brand-600 text-white font-semibold shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full",
                            item.badgeColor || "bg-slate-800 text-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tenant Info */}
        <div className="p-3 border-t border-slate-800/80 bg-navy-900/60">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-slate-800/50 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-slate-200 truncate">Apex Solutions</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Starter Plan Active
                </p>
              </div>
            </div>
            <Link
              href="/app/billing"
              className="text-[10px] text-slate-400 hover:text-white underline shrink-0"
            >
              R499/mo
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
