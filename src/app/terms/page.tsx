import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm text-slate-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              MAGIC QUANT TRADING Corp
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Terms of Service & Commercial Policies
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Commercial Agreement & Operating Entity</h2>
            <p>
              This software platform ("Business Manager") is owned, developed, and operated by <strong>MAGIC QUANT TRADING Corp</strong> ("Company", "we", "us"). By registering an account, purchasing access, or utilizing the AI agent orchestration services, you ("Customer", "Subscriber") enter into a legally binding agreement under the laws of the Republic of South Africa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Starter Access (Non-Renewing Commercial Terms)</h2>
            <p>
              The <strong>Starter — R499 for one month</strong> plan represents a single, one-time payment for 30 calendar days of commercial software access. <strong>This plan does not renew automatically</strong>, and no debit orders or recurring card charges will be applied. Upon expiration of the 30-day period, the customer may purchase an additional access period at their discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Recurring Subscriptions & Cancellation Policy</h2>
            <p>
              Where an explicitly configured recurring monthly subscription is activated, charges will occur on the same day of each calendar month via our authorized payment providers (Yoco, Paystack). The customer may cancel their subscription at any time through the Billing settings. Cancellation takes effect at the end of the current paid billing cycle with no cancellation penalties.
            </p>
          </section>

          <section id="refund" className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Refund Policy</h2>
            <p>
              If a customer encounters an activation failure or technical non-delivery of service within 7 days of purchase, our support team will promptly investigate and process a full refund to the original payment method upon verification. Refunds requested after substantial utilization of AI agent compute or after 14 days will be reviewed by platform administrators on an exceptional basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. SARS Compliance & Professional Advice Disclaimer</h2>
            <p className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <strong>STATUTORY NOTICE:</strong> Business Manager provides administrative compilation workpapers and calculations for South African tax compliance (including VAT201, EMP201, and Provisional Tax IRP6). The software does not provide formal legal tax advice, does not act as a registered tax practitioner, and does not submit returns directly to SARS without customer authorization. You are advised to review all draft workpapers with a qualified tax practitioner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. AI Agent Execution & Human In The Loop</h2>
            <p>
              AI Agents operate within strict tool permissions. For sensitive write operations (including sending external emails, issuing tax invoices, and employee records updates), human approval is required. MAGIC QUANT TRADING Corp is not liable for consequential damages arising from actions explicitly approved by the business owner.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
