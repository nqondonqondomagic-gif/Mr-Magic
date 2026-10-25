"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Building2,
  Mail,
  Phone,
  Tag,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";
import { Customer } from "@/types";

export default function ClientsPage() {
  const orgId = "org-apex-001";
  const [customers, setCustomers] = useState(db.getCustomers(orgId));
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "+27 ",
    address: "",
    vat_number: "",
    credit_limit_cents: 5000000,
    tags: "Enterprise",
  });

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company_name && c.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created = db.createCustomer({
      id: `cust-${Date.now()}`,
      organisation_id: orgId,
      name: newCustomer.name,
      company_name: newCustomer.company_name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      vat_number: newCustomer.vat_number,
      credit_limit_cents: newCustomer.credit_limit_cents,
      tags: newCustomer.tags.split(",").map((t) => t.trim()),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setCustomers(db.getCustomers(orgId));
    setModalOpen(false);
    setNewCustomer({
      name: "",
      company_name: "",
      email: "",
      phone: "+27 ",
      address: "",
      vat_number: "",
      credit_limit_cents: 5000000,
      tags: "Enterprise",
    });
  };

  const handleExportCSV = () => {
    const headers = "Name,Company,Email,Phone,VAT Number,Status\n";
    const rows = customers
      .map(
        (c) =>
          `"${c.name}","${c.company_name || ""}","${c.email || ""}","${c.phone || ""}","${c.vat_number || ""}","${c.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apex-solutions-clients-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            CRM & Client Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounts, corporate contacts, VAT registration numbers, and client communication histories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer name, company, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Customer & Company</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">VAT Number</th>
                <th className="py-3.5 px-4">Credit Limit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {c.company_name || "Sole Proprietor"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <p className="text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {c.email || "—"}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {c.phone || "—"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {c.vat_number || "Non-VAT registered"}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {formatZAR(c.credit_limit_cents)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        c.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-brand-100 text-brand-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/app/invoices?customer=${c.id}`}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      View Invoices →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Add New Customer / Account
            </h3>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kagiso Molefe"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Molefe Logistics (Pty) Ltd"
                  value={newCustomer.company_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="accounts@molefe.co.za"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+27 82 000 0000"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SARS VAT Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 4920198273"
                    value={newCustomer.vat_number}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vat_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Limit (cents)</label>
                  <input
                    type="number"
                    value={newCustomer.credit_limit_cents}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, credit_limit_cents: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
