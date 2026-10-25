"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Download,
  ArrowRight,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";

export default function BillingPage() {
  const orgId = "org-apex-001";
  const subscription = db.getSubscription(orgId);
  const payments = db.getPayments(orgId);

  // Calculate days remaining
  const now = new Date().getTime();
  const expiry = subscription ? new Date(subscription.current_period_end).getTime() : now;
  const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-brand-600" />
            Billing & Subscription Entitlements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access period status, non-renewing commercial guarantee, and South African payment receipts.
          </p>
        </div>

        <Link
          href="/checkout?plan=starter_month"
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <span>Purchase Next 30-Day Period</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ACTIVE PLAN CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Active Entitlement
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 pt-1">
              {subscription?.plan?.name || "Starter — 1 Month Access"}
            </h2>
            <p className="text-xs text-slate-500">
              Activated via Yoco Payments · Single purchase of R499.00
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-3xl font-black text-slate-900">R 499.00</span>
            <p className="text-xs text-slate-400">Paid in full (ZAR)</p>
          </div>
        </div>

        {/* 30-Day Countdown & Non-renewing Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500">Access Period Active Until</span>
            <p className="text-base font-bold text-slate-900">
              {formatDate(subscription?.current_period_end)}
            </p>
            <p className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{daysRemaining} Days Remaining</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-amber-900 md:col-span-2">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Non-Renewing Commercial Guarantee:
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This initial purchase is a one-time payment for 30 calendar days of commercial access. <strong>It will not renew automatically</strong>, and no debit order will occur. When your period expires, your data remains secure and you can renew at your convenience.
            </p>
          </div>
        </div>

        {/* Features Entitlements */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800 mb-3">Plan Entitlements & Included Modules:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {subscription?.plan?.features.map((feat, idx) => (
              <p key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT & RECEIPT HISTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Commercial Receipts & Transaction History</h3>
          <span className="text-xs text-slate-500">{payments.length} Verified Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    {p.provider_transaction_id || p.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatDate(p.created_at)}</td>
                  <td className="py-3.5 px-4 uppercase font-semibold text-slate-700">
                    {p.payment_provider}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{p.provider_payment_method || "Card ending 4242"}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatZAR(p.amount_cents)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading verified tax receipt for ${p.id}`)}
                      className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 justify-end ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
