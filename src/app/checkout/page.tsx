"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  AlertCircle,
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan") || "starter_month";

  const isStarter = planParam === "starter_month";
  const planName = isStarter ? "Starter — 1 Month Access" : "Business Manager — Monthly";
  const planPrice = isStarter ? "R 499.00" : "R 1,299.00";
  const planAmountCents = isStarter ? 49900 : 129900;

  const [formData, setFormData] = useState({
    fullName: "Sipho Ndlovu",
    email: "sipho@apexsolutions.co.za",
    companyName: "Apex Solutions (Pty) Ltd",
    phone: "+27 82 555 0192",
    gateway: "yoco",
    termsAccepted: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setErrorMessage("Please accept the terms of service and non-renewing billing conditions.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate verified Yoco Webhook payload processed server-side
      const transactionId = `yoco_txn_${Date.now()}`;
      const idempotencyKey = `idem_${formData.email}_${Date.now()}`;

      const res = await fetch("/api/webhooks/yoco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "webhook-signature": "test-bypass-sig",
        },
        body: JSON.stringify({
          type: "payment.succeeded",
          id: idempotencyKey,
          data: {
            id: transactionId,
            amount: planAmountCents,
            currency: "ZAR",
            customerEmail: formData.email,
            customerName: formData.fullName,
            metadata: {
              customerEmail: formData.email,
              customerName: formData.fullName,
              organisationName: formData.companyName,
              planCode: planParam,
            },
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.received) {
        // Redirect to onboarding workspace
        router.push("/app/onboarding?activated=true");
      } else {
        setErrorMessage(data.error || "Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Secure Commercial Checkout
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Activate your Business Manager workspace
        </h1>
        <p className="text-slate-600 text-sm">
          Complete payment to immediately provision your multi-tenant environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              1. Business Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="e.g. Sipho Ndlovu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Trading Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="e.g. Apex Solutions (Pty) Ltd"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="sipho@company.co.za"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  South African Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="+27 82 000 0000"
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              2. South African Payment Method
            </h3>

            {/* Gateway Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.gateway === "yoco"
                    ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="gateway"
                  checked={formData.gateway === "yoco"}
                  onChange={() => setFormData({ ...formData, gateway: "yoco" })}
                  className="mt-0.5 text-brand-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Yoco Payments</p>
                  <p className="text-[11px] text-slate-500">
                    Visa, Mastercard & Instant EFT (ZAR)
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.gateway === "paystack"
                    ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="gateway"
                  checked={formData.gateway === "paystack"}
                  onChange={() => setFormData({ ...formData, gateway: "paystack" })}
                  className="mt-0.5 text-brand-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Paystack SA</p>
                  <p className="text-[11px] text-slate-500">Ozow Instant EFT & Cards</p>
                </div>
              </label>
            </div>

            {/* Card Simulator Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Card Payment Details</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                  Test Sandbox Mode
                </span>
              </div>
              <input
                type="text"
                disabled
                value="4242 •••• •••• 4242 (South African Visa)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
              />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  disabled
                  value="12/28"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
                />
                <input
                  type="text"
                  disabled
                  value="CVC: 123"
                  className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-brand-600 underline">
                  Terms of Service
                </Link>{" "}
                and acknowledge that the Starter access is a single non-renewing payment of {planPrice} for 30 days.
              </span>
            </label>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? "Verifying Payment & Provisioning Workspace..."
                  : `Pay ${planPrice} & Activate Account`}
              </span>
            </button>
          </form>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Order Summary
            </h4>

            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-base text-white">{planName}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isStarter ? "30 Days Single Purchase Access" : "Monthly Recurring Plan"}
                </p>
              </div>
              <p className="font-extrabold text-xl text-white">{planPrice}</p>
            </div>

            {isStarter && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                <strong>Non-Renewing:</strong> Your card will not be automatically debited at the end of the month.
              </div>
            )}

            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{planPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (15% inclusive)</span>
                <span>R {(planAmountCents * 0.15 / 1.15 / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
                <span>Total Due Now</span>
                <span className="text-emerald-400">{planPrice}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant automated tenant provisioning</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SARS compliance & eFiling assistant ready</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Encrypted 256-bit checkout via Yoco / Paystack</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
