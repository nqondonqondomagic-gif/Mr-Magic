"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Sparkles, Lock, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sipho@apexsolutions.co.za");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/app");
    }, 600);
  };

  const handleQuickLogin = (role: "owner" | "finance" | "admin" | "tenantB") => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/app");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-brand-400 mx-auto flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Sign in to Business Manager
            </h2>
            <p className="text-xs text-slate-500">
              AI Business Operating System · MAGIC QUANT TRADING Corp
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link href="/contact" className="text-xs text-brand-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Signing in..." : "Sign In to Workspace"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Personas */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Quick Evaluator Personas (1-Click Switch)
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickLogin("owner")}
                  className="w-full p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900">Sipho Ndlovu (Business Owner)</p>
                    <p className="text-[10px] text-slate-500">Full tenant control · Apex Solutions</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-brand-600" />
                </button>

                <button
                  onClick={() => handleQuickLogin("finance")}
                  className="w-full p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900">Lerato Khumalo (Finance Manager)</p>
                    <p className="text-[10px] text-slate-500">Invoices, expenses, VAT201 & debtors</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => handleQuickLogin("admin")}
                  className="w-full p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left text-xs text-white flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">MQT Platform Administrator</p>
                    <p className="text-[10px] text-slate-400">Global operator console · All tenants</p>
                  </div>
                  <ShieldAlert className="w-4 h-4 text-quant-400" />
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              Don't have an active workspace?{" "}
              <Link href="/checkout?plan=starter_month" className="text-brand-600 font-semibold hover:underline">
                Get Starter Access for R499
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
