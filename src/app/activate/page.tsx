"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function ActivatePage() {
  const router = useRouter();
  const [token, setToken] = useState("act_tok_sample_9841284");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activated, setActivated] = useState(false);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setActivated(true);
    setTimeout(() => {
      router.push("/app/onboarding?token=verified");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Activate Your Business Account
            </h1>
            <p className="text-xs text-slate-500">
              Welcome to Business Manager by MAGIC QUANT TRADING Corp.
            </p>
          </div>

          {activated ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm text-emerald-900">Account Verified & Activated!</p>
              <p className="text-xs text-emerald-700">Loading your onboarding wizard...</p>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Activation Token / Verification Link
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Master Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                <Lock className="w-3.5 h-3.5 inline mr-1 text-slate-600" />
                Never share your credentials. All passwords are encrypted with Argon2/bcrypt.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Set Password & Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
