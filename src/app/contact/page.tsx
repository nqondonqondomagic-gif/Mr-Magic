"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              MAGIC QUANT TRADING Corp
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact & Commercial Inquiries
            </h1>
            <p className="text-slate-600 text-base">
              Reach our South African support team for product inquiries, integration requests, or billing assistance.
            </p>
          </div>

          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            {/* Info */}
            <div className="md:col-span-5 space-y-6 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Head Office</h3>
                <p className="text-xs text-slate-500 mt-0.5">MAGIC QUANT TRADING Corp</p>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span>Sandton City Office Towers, 150 West Street, Sandton, Johannesburg, 2196</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>support@magicquant.co.za</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>+27 11 000 9999 (Mon–Fri 08:00–17:00 SAST)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Support Response SLA</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Email support inquiries receive initial responses within 4 hours during business days. Account activation guarantee within 24 hours.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900">Thank you for your message!</h4>
                  <p className="text-xs text-emerald-700">
                    Our South African support desk has received your request and will respond within 4 business hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Ndlovu"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sipho@company.co.za"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message / Inquiry
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we assist your business operations?"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
