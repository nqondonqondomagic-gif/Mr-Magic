"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Sparkles,
  Bot,
  Building2,
  Check,
  ChevronDown,
  User,
  ShieldAlert,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  activeOrgName?: string;
  activeUserName?: string;
  activeUserRole?: string;
}

export function AppHeader({
  onMenuToggle,
  activeOrgName = "Apex Solutions (Pty) Ltd",
  activeUserName = "Sipho Ndlovu",
  activeUserRole = "Business Owner",
}: AppHeaderProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentRunSuccess, setAgentRunSuccess] = useState<string | null>(null);

  // Mock interactive notifications
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Action Approval Needed",
      message: "Finance Assistant prepared overdue notice for Cape Town Roasters (R34,500.00).",
      time: "25m ago",
      url: "/app/approvals",
      unread: true,
    },
    {
      id: "n-2",
      title: "SARS VAT201 Workpaper Ready",
      message: "Aug/Sep 2026 VAT period calculated. Net due: R21,203.48 by 31 Oct.",
      time: "1h ago",
      url: "/app/compliance",
      unread: true,
    },
    {
      id: "n-3",
      title: "Starter Plan Active",
      message: "30-day access active. Non-renewing single purchase.",
      time: "1d ago",
      url: "/app/billing",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleQuickRunAgent = async () => {
    setIsRunningAgent(true);
    setAgentRunSuccess(null);
    try {
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "agent-001",
          organisationId: "org-apex-001",
          triggerSource: "manual",
          promptOverride: "Generate executive briefing of calendar appointments and priority tasks.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentRunSuccess("Executive Assistant executed successfully!");
        setTimeout(() => setAgentRunSuccess(null), 4000);
      }
    } catch {
      setAgentRunSuccess("Agent execution completed.");
      setTimeout(() => setAgentRunSuccess(null), 4000);
    } finally {
      setIsRunningAgent(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu + Org Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tenant Organisation Switcher */}
        <div className="relative">
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[150px]">
                {activeOrgName}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Sandton, ZA</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Org Switcher Menu */}
          {orgDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Business Workspaces
                </p>
              </div>
              <button
                onClick={() => setOrgDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Apex Solutions (Pty) Ltd</p>
                    <p className="text-[10px] text-slate-500">Starter Plan · 18 days left</p>
                  </div>
                </div>
                <Check className="w-4 h-4 text-brand-600" />
              </button>
              <button
                onClick={() => setOrgDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div>
                    <p className="font-medium text-slate-700">Coastal Tech Ventures</p>
                    <p className="text-[10px] text-slate-400">Isolated Tenant B</p>
                  </div>
                </div>
              </button>
              <div className="p-2 border-t border-slate-100">
                <Link
                  href="/app/onboarding"
                  onClick={() => setOrgDropdownOpen(false)}
                  className="w-full block text-center py-1.5 rounded text-xs font-medium text-brand-600 hover:bg-brand-50"
                >
                  + Add New Business Workspace
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Agent Runner + Notifications + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Agent Trigger Button */}
        <button
          onClick={handleQuickRunAgent}
          disabled={isRunningAgent}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 hover:bg-brand-100 transition-colors shadow-xs"
        >
          <Sparkles className={cn("w-3.5 h-3.5 text-brand-600", isRunningAgent && "animate-spin")} />
          <span>{isRunningAgent ? "Agent Running..." : "Run AI Assistant"}</span>
        </button>

        {agentRunSuccess && (
          <span className="hidden md:inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-in fade-in">
            {agentRunSuccess}
          </span>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Notifications & Agent Alerts
                </h4>
                <button
                  onClick={() =>
                    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
                  }
                  className="text-[11px] text-brand-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.url}
                    onClick={() => setNotifOpen(false)}
                    className={cn(
                      "block px-4 py-3 hover:bg-slate-50 transition-colors",
                      n.unread && "bg-brand-50/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <Link
                  href="/app/approvals"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  View Human Approval Queue →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Persona & Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
              SN
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{activeUserName}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">{activeUserRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User & Persona Switcher Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{activeUserName}</p>
                <p className="text-[11px] text-slate-500">sipho@apexsolutions.co.za</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {activeUserRole}
                </span>
              </div>

              {/* Persona Switchers for Testing RBAC */}
              <div className="p-2 border-b border-slate-100 bg-slate-50/60">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Test Role Personas (RBAC)
                </p>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left bg-white font-medium text-slate-800 shadow-2xs"
                  >
                    <span>Sipho (Business Owner)</span>
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                  </button>
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left text-slate-600 hover:bg-white"
                  >
                    <span>Lerato (Finance Manager)</span>
                  </button>
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left text-quant-600 hover:bg-quant-50 font-medium"
                  >
                    <span>MQT Platform Admin Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/app/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile & Security
                </Link>
                <Link
                  href="/app/billing"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Subscription & Invoices
                </Link>
              </div>

              <div className="p-2 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
