"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, RefreshCw, AlertTriangle, Download } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";
import { Payment } from "@/types";

export default function AdminBillingPage() {
  const [payments, setPayments] = useState<Payment[]>(db.getAllPayments());
  const [refundNotice, setRefundNotice] = useState<string | null>(null);

  const totalProcessed = payments.reduce((sum, p) => sum + p.amount_cents, 0);

  const handleRefund = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    payment.status = "refunded";
    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: payment.organisation_id,
      user_name: "Platform Administrator",
      action: "payment_refunded",
      entity_type: "payment",
      entity_id: payment.id,
      details: `Refund of ${formatZAR(payment.amount_cents)} processed for transaction ${payment.provider_transaction_id}.`,
      created_at: new Date().toISOString(),
    });

    setPayments([...db.getAllPayments()]);
    setRefundNotice(`Transaction ${payment.provider_transaction_id} marked as REFUNDED. Audit logged.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-quant-400" />
            Global Payments & Financial Settlements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total commercial volume processed: <strong className="text-emerald-400">{formatZAR(totalProcessed)}</strong> · Yoco & Paystack South Africa
          </p>
        </div>
      </div>

      {refundNotice && (
        <div className="p-3.5 rounded-xl bg-quant-500/20 border border-quant-500/40 text-xs font-semibold text-quant-200 animate-in fade-in">
          {refundNotice}
        </div>
      )}

      {/* Global Transactions Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800 bg-slate-900/60">
              <tr>
                <th className="py-3 px-4">Transaction / Provider ID</th>
                <th className="py-3 px-4">Tenant Org ID</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount (ZAR)</th>
                <th className="py-3 px-4">Idempotency Key</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {p.provider_transaction_id || p.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {p.organisation_id}
                  </td>
                  <td className="py-3.5 px-4 uppercase font-semibold text-quant-300">
                    {p.payment_provider}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {formatZAR(p.amount_cents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {p.idempotency_key || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        p.status === "successful"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : p.status === "refunded"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === "successful" && (
                      <button
                        onClick={() => handleRefund(p.id)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
                      >
                        Process Refund
                      </button>
                    )}
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
