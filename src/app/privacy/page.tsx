import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm text-slate-800 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              South African Data Protection
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Privacy Policy & POPIA Compliance Notice
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              In accordance with the Protection of Personal Information Act 4 of 2013 (POPIA)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Information Officer & Responsible Party</h2>
            <p>
              The responsible party processing personal information on this platform is <strong>MAGIC QUANT TRADING Corp</strong>, operating from Sandton, Johannesburg, South Africa. Inquiries regarding data processing may be directed to our Information Officer at <code className="text-brand-600">privacy@magicquant.co.za</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Purpose Specification & Processing</h2>
            <p>
              We collect and process customer information solely to fulfill business operating system services, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Managing customer workspaces and user authentication.</li>
              <li>Generating compliant South African tax invoices and expense ledgers.</li>
              <li>Executing authorized AI business agent workflows.</li>
              <li>Compiling VAT201, EMP201, and Provisional Tax compilation workpapers.</li>
              <li>Facilitating secure payment confirmations via verified webhooks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Tenant Isolation & Database Separation</h2>
            <p>
              Customer data is strictly isolated using PostgreSQL Row-Level Security (RLS). An organization’s data cannot be queried, extracted, or cross-referenced by other tenants. Platform operators access customer data solely under strict least-privilege protocols logged in an immutable audit trail.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Data Subject Rights & POPIA Compliance</h2>
            <p>
              Under POPIA Sections 23 and 24, customers and data subjects possess the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Request confirmation of whether we hold personal information.</li>
              <li>Access and export all stored records in structured CSV/JSON format.</li>
              <li>Request correction or deletion of inaccurate, irrelevant, or obsolete records.</li>
            </ul>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
