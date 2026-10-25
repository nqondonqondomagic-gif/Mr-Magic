"use client";

import { useState } from "react";
import {
  Receipt,
  Plus,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building2,
  FileText,
  X,
  CreditCard,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";
import { Invoice, InvoiceItem } from "@/types";

export default function InvoicesPage() {
  const orgId = "org-apex-001";
  const org = db.getOrganisation(orgId);
  const [invoices, setInvoices] = useState(db.getInvoices(orgId));
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [newInvoiceData, setNewInvoiceData] = useState({
    customer_id: "cust-001",
    customer_name: "Discovery Health Corporate",
    customer_email: "procurement@discovery.co.za",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    item_description: "Enterprise Cloud Consulting & Security Architecture SLA",
    quantity: 1,
    unit_price_cents: 4500000, // R 45,000.00
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const count = invoices.length + 1;
    const invNumber = `INV-2026-00${count}`;

    const subtotalCents = Math.round(newInvoiceData.quantity * newInvoiceData.unit_price_cents);
    const taxCents = Math.round(subtotalCents * 0.15); // 15% SA VAT
    const totalCents = subtotalCents + taxCents;

    const item: InvoiceItem = {
      id: `item-${Date.now()}`,
      invoice_id: `inv-${Date.now()}`,
      description: newInvoiceData.item_description,
      quantity: newInvoiceData.quantity,
      unit_price_cents: newInvoiceData.unit_price_cents,
      tax_rate_percent: 15.0,
      total_cents: totalCents,
    };

    const created = db.createInvoice({
      id: `inv-${Date.now()}`,
      organisation_id: orgId,
      customer_id: newInvoiceData.customer_id,
      customer_name: newInvoiceData.customer_name,
      customer_email: newInvoiceData.customer_email,
      invoice_number: invNumber,
      status: "issued",
      issue_date: newInvoiceData.issue_date,
      due_date: newInvoiceData.due_date,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      balance_due_cents: totalCents,
      currency: "ZAR",
      items: [item],
      terms: "Strictly 30 days from date of Tax Invoice.",
      created_at: new Date().toISOString(),
    });

    setInvoices(db.getInvoices(orgId));
    setModalOpen(false);
  };

  const handleMarkPaid = (id: string) => {
    db.updateInvoiceStatus(id, orgId, "paid");
    setInvoices(db.getInvoices(orgId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-brand-600" />
            Tax Invoices & Billing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 20(4) VAT Act compliant invoices with 15% South African VAT calculation and debtor ageing.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Tax Invoice</span>
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Issue / Due Date</th>
                <th className="py-3.5 px-4">Subtotal (Excl)</th>
                <th className="py-3.5 px-4">VAT (15%)</th>
                <th className="py-3.5 px-4">Total (Incl)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {inv.customer_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <p>{inv.issue_date}</p>
                    <p className="text-[10px] text-slate-400">Due: {inv.due_date}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {formatZAR(inv.subtotal_cents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {formatZAR(inv.tax_cents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatZAR(inv.total_cents)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        inv.status === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : inv.status === "issued"
                          ? "bg-brand-100 text-brand-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      View Invoice
                    </button>
                    {inv.status !== "paid" && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Printable Tax Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            {/* Header / Actions */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official South African Tax Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tax Invoice Document Body */}
            <div className="space-y-6 text-xs text-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {org?.legal_name || "Apex Solutions (Pty) Ltd"}
                  </h2>
                  <p className="text-slate-500 mt-1">CIPC Reg: {org?.registration_number || "2021/489211/07"}</p>
                  <p className="text-slate-500">VAT Registration No: {org?.vat_number || "4920198273"}</p>
                  <p className="text-slate-500">150 West Street, Sandton, Johannesburg, 2196</p>
                </div>

                <div className="text-right">
                  <h3 className="text-2xl font-black text-brand-700">TAX INVOICE</h3>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-1">
                    {viewInvoice.invoice_number}
                  </p>
                  <p className="text-slate-500 mt-1">Date: {viewInvoice.issue_date}</p>
                  <p className="text-slate-500">Due: {viewInvoice.due_date}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Billed To:</p>
                <p className="font-bold text-slate-900 text-sm">{viewInvoice.customer_name}</p>
                <p className="text-slate-600">{viewInvoice.customer_email}</p>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">VAT Rate</th>
                    <th className="py-2 text-right">Total (ZAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewInvoice.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium">{it.description}</td>
                      <td className="py-2.5 text-center">{it.quantity}</td>
                      <td className="py-2.5 text-right font-mono">{formatZAR(it.unit_price_cents)}</td>
                      <td className="py-2.5 text-right font-mono">15.00%</td>
                      <td className="py-2.5 text-right font-mono font-bold">{formatZAR(it.total_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Box */}
              <div className="border-t border-slate-200 pt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Excl. VAT):</span>
                    <span className="font-mono">{formatZAR(viewInvoice.subtotal_cents)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT @ 15%:</span>
                    <span className="font-mono">{formatZAR(viewInvoice.tax_cents)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Total (Incl. VAT):</span>
                    <span className="font-mono text-brand-700">{formatZAR(viewInvoice.total_cents)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs text-rose-600">
                    <span>Balance Due:</span>
                    <span className="font-mono">{formatZAR(viewInvoice.balance_due_cents)}</span>
                  </div>
                </div>
              </div>

              {/* Banking Details for EFT */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
                <p className="font-bold text-slate-800">Banking Details for Electronic Funds Transfer (EFT):</p>
                <p>Bank: <strong>Nedbank Corporate</strong></p>
                <p>Account Name: <strong>Apex Solutions (Pty) Ltd</strong></p>
                <p>Account Number: <strong>1192849102</strong> · Branch Code: <strong>198765</strong></p>
                <p>Payment Reference: <strong>{viewInvoice.invoice_number}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Generate New South African Tax Invoice
            </h3>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer</label>
                <select
                  value={newInvoiceData.customer_name}
                  onChange={(e) =>
                    setNewInvoiceData({ ...newInvoiceData, customer_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Discovery Health Corporate">Discovery Health Corporate</option>
                  <option value="Shoprite Digital Labs">Shoprite Digital Labs</option>
                  <option value="Cape Town Roasters">Cape Town Roasters</option>
                  <option value="Durban Cold Logistics">Durban Cold Logistics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.issue_date}
                    onChange={(e) =>
                      setNewInvoiceData({ ...newInvoiceData, issue_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.due_date}
                    onChange={(e) =>
                      setNewInvoiceData({ ...newInvoiceData, due_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.item_description}
                  onChange={(e) =>
                    setNewInvoiceData({ ...newInvoiceData, item_description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newInvoiceData.quantity}
                    onChange={(e) =>
                      setNewInvoiceData({ ...newInvoiceData, quantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price (cents ZAR)</label>
                  <input
                    type="number"
                    value={newInvoiceData.unit_price_cents}
                    onChange={(e) =>
                      setNewInvoiceData({
                        ...newInvoiceData,
                        unit_price_cents: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p>
                  Estimated Total (Excl): <strong>{formatZAR(newInvoiceData.unit_price_cents * newInvoiceData.quantity)}</strong>
                </p>
                <p>
                  VAT @ 15%: <strong>{formatZAR(newInvoiceData.unit_price_cents * newInvoiceData.quantity * 0.15)}</strong>
                </p>
                <p className="font-bold text-slate-900 pt-1">
                  Total Due: {formatZAR(newInvoiceData.unit_price_cents * newInvoiceData.quantity * 1.15)}
                </p>
              </div>

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
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
