"use client";

import { useState } from "react";
import { CreditCard, Plus, Download, CheckCircle2, Tag } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export default function ExpensesPage() {
  const orgId = "org-apex-001";
  const [expenses, setExpenses] = useState(db.getExpenses(orgId));
  const [modalOpen, setModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    payee: "",
    category: "Cloud Hosting & Software",
    amount_cents: 150000,
    is_vat_claimable: true,
    payment_method: "Corporate Credit Card",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const totalExpensesCents = expenses.reduce((sum, e) => sum + e.amount_cents, 0);
  const totalInputVatCents = expenses
    .filter((e) => e.is_vat_claimable)
    .reduce((sum, e) => sum + e.tax_cents, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const taxCents = newExpense.is_vat_claimable
      ? Math.round((newExpense.amount_cents * 0.15) / 1.15)
      : 0;

    db.createExpense({
      id: `exp-${Date.now()}`,
      organisation_id: orgId,
      category: newExpense.category,
      payee: newExpense.payee,
      amount_cents: newExpense.amount_cents,
      tax_cents: taxCents,
      currency: "ZAR",
      date: newExpense.date,
      payment_method: newExpense.payment_method,
      is_vat_claimable: newExpense.is_vat_claimable,
      notes: newExpense.notes,
      created_at: new Date().toISOString(),
    });

    setExpenses(db.getExpenses(orgId));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-brand-600" />
            Business Expenses & Input VAT
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total recorded expenses: <strong>{formatZAR(totalExpensesCents)}</strong> · Claimable Input VAT for SARS VAT201: <strong>{formatZAR(totalInputVatCents)}</strong>
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Expense</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Payee / Vendor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount (Incl)</th>
                <th className="py-3.5 px-4">VAT Claimable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{exp.payee}</p>
                    {exp.notes && <p className="text-[11px] text-slate-500">{exp.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{exp.category}</td>
                  <td className="py-3.5 px-4 text-slate-500">{exp.date}</td>
                  <td className="py-3.5 px-4 text-slate-600">{exp.payment_method}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatZAR(exp.amount_cents)}
                  </td>
                  <td className="py-3.5 px-4">
                    {exp.is_vat_claimable ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ Claimable ({formatZAR(exp.tax_cents)})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Non-claimable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Record Supplier Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payee / Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cape Town Region"
                  value={newExpense.payee}
                  onChange={(e) => setNewExpense({ ...newExpense, payee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Cloud Hosting & Infrastructure">Cloud Hosting & Infrastructure</option>
                  <option value="Telecommunications & Internet">Telecommunications & Internet</option>
                  <option value="Software Subscriptions">Software Subscriptions</option>
                  <option value="Rent & Facilities">Rent & Facilities</option>
                  <option value="Professional Legal & Accounting">Professional Legal & Accounting</option>
                  <option value="Travel & Meals">Travel & Meals</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total (cents ZAR)</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount_cents}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount_cents: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                  <span className="text-[10px] text-slate-400">{formatZAR(newExpense.amount_cents)}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newExpense.payment_method}
                    onChange={(e) => setNewExpense({ ...newExpense, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Corporate Credit Card">Corporate Credit Card</option>
                    <option value="Debit Order">Debit Order</option>
                    <option value="EFT">Electronic Funds Transfer (EFT)</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newExpense.is_vat_claimable}
                  onChange={(e) => setNewExpense({ ...newExpense, is_vat_claimable: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-semibold text-slate-800">
                  VAT Claimable under Section 16(3) of VAT Act (15% Input Tax)
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
