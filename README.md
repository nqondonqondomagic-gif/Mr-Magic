# BUSINESS MANAGER
### AI Business Operating System | MAGIC QUANT TRADING Corp

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL RLS](https://img.shields.io/badge/PostgreSQL-RLS%20Isolated-336791?logo=postgresql)](https://supabase.com/)
[![South Africa VAT](https://img.shields.io/badge/SARS%20Compliance-15%25%20VAT201%20%7C%20EMP201-059669)](https://sars.gov.za/)
[![Test Suite](https://img.shields.io/badge/Vitest-10%20Passed-success)](https://vitest.dev/)

**Business Manager** is an enterprise-grade, multi-tenant SaaS application owned and operated by **MAGIC QUANT TRADING Corp**. It combines traditional operational business management tools with autonomous, specialized AI agents executing real work across connected systems under strict human supervision.

---

## 🏛 Core Architecture & Capabilities

### 1. Traditional Business Operations Suite
- **CRM & Customer Directory (`/app/clients`):** Full contact lifecycle, company registration numbers, VAT numbers, debtor ageing, and contact directories with CSV export.
- **Sales Pipeline (`/app/sales`):** Interactive drag-and-drop Kanban pipeline tracking deals from Lead to Won/Lost with ZAR value rollups and win probabilities.
- **Tax Invoices (`/app/invoices`):** Full compliance with **Section 20(4) of the South African VAT Act No. 89 of 1991**. Includes sequential invoice numbering, seller/customer VAT numbers, physical addresses, line-item 15% VAT breakdowns, and printable PDF formats.
- **Expense Tracking (`/app/expenses`):** Categorized ledger with standard 15% VAT claimable deduction calculations and SARS documentation tagging.
- **Projects & Milestones (`/app/projects`):** Multi-milestone project governance with progress tracking and ZAR budget reconciliation.
- **Task Management (`/app/tasks`):** Operational task board with priorities (Urgent, High, Medium, Low), deadlines, and multi-tenant assignments.
- **Appointments & Calendar (`/app/calendar`):** Client meetings with automated Google Meet video links and booking workflows.
- **Document Vault (`/app/documents`):** Secure repository for CIPC registration certificates, B-BBEE affidavits, and tax clearances.
- **HR & BCEA Leave (`/app/hr`):** Employee directory with South African Basic Conditions of Employment Act (BCEA) leave allocations (Annual, Sick, Family Responsibility) and approval chains.

---

### 2. Autonomous AI Agent Platform with Human-in-the-Loop Safeguards
Business Manager includes 7 pre-configured agents powered by state-of-the-art LLMs (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash) operating through a bounded 12-step plan-and-solve execution engine:

1. **Executive Assistant:** High-level executive briefings, pending approval alerts, and operational summaries.
2. **Sales & Pipeline Agent:** Lead qualification, follow-up scheduling, and deal stage progression.
3. **Customer Service Agent:** Inquiries, invoice delivery, and calendar scheduling.
4. **Finance Assistant:** Debtor ageing reviews, automated draft invoice preparation, and expense categorization.
5. **HR & People Assistant:** BCEA leave balance checks, onboarding task generation, and leave request handling.
6. **Operations & Tasks Agent:** Project milestone tracking, task prioritization, and operational bottleneck alerts.
7. **SARS Compliance Assistant:** Pre-flight VAT201 eFiling workpaper generation, EMP201 payroll tax breakdowns, and Provisional Tax (IRP6) estimates.

#### 🛡 Human Approval Queue (`/app/approvals`)
- **Safe Read Actions:** Execute autonomously within tenant boundaries (e.g. querying debtors, computing VAT totals).
- **Sensitive Write Actions:** Any action that modifies financial records, sends customer emails, issues tax invoices, or alters employee data is intercepted and held in the **Approval Queue**.
- The Business Owner or authorized manager can inspect the full payload, view the agent's reasoning, and either **Approve** (executing the transaction) or **Reject** with a comment.

---

### 3. South African Statutory Compliance Engine
- **VAT201 Workpaper Box Mapping:**
  - `Box 1`: Standard rate 15% supplies (Output Tax).
  - `Box 15`: Other goods/services supplied to vendor (Input Tax claimable).
  - `Box 20`: Net VAT payable to or refundable by SARS.
- **EMP201 Monthly Employer Declarations:**
  - **PAYE:** Monthly employee tax withholding according to SARS tax brackets.
  - **SDL:** 1% Skills Development Levy.
  - **UIF:** Unemployment Insurance Fund (1% employee deduction + 1% employer contribution, capped at R177.12 each per month).
- **Provisional Tax (IRP6):**
  - First and Second period tax estimates based on estimated taxable income at the 27% corporate rate.
  - Basic amount safeguards and Section 89quat penalty risk analysis.
- **POPIA Act No. 4 of 2013 Compliance:**
  - Strict tenant data partitioning via PostgreSQL Row-Level Security.
  - Designated Information Officer details registered with the SA Information Regulator.
  - One-click Section 24 Right-to-Erasure tenant purging and data export.

---

### 4. Commercial Billing & 30-Day Non-Renewing Access
- **Starter Plan (R499 One-Time):**
  - Provides **exactly 30 calendar days of full platform access**.
  - **Strictly non-renewing (`cancel_at_period_end: true`)**: Zero recurring charge surprises for clients.
  - Full countdown banner displayed on the dashboard with one-click extension options.
- **South African Fintech Gateways:**
  - **Yoco:** Card checkout with webhook verification via `x-yoco-signature` HMAC-SHA256.
  - **Paystack:** Card, Ozow instant EFT, and tokenized payments with `x-paystack-signature` HMAC-SHA512.
  - **Idempotency Guarantee:** Duplicate webhook retries are detected and safely skipped without re-crediting or creating duplicate subscriptions.

---

### 5. Multi-Tenant Architecture & Security
- **PostgreSQL Row-Level Security:** Every query is filtered by `organisation_id = auth.jwt() ->> 'organisation_id'`.
- **4-Tier Persona RBAC:**
  - `Owner`: Unrestricted access, billing management, human approvals, user invitations.
  - `Admin`: User management, project and integration configurations.
  - `Finance`: Financial operations, invoices, expenses, SARS compliance.
  - `Staff`: Daily task execution, customer viewing, and personal leave requests.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v24.21.0 LTS)
- npm 10+

### 1. Installation
```bash
git clone https://github.com/magic-quant/business-manager.git
cd business-manager
npm install
```

### 2. Environment Configuration
Copy the sample environment variables:
```bash
cp .env.example .env.local
```
Fill in the following keys:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

YOCO_SECRET_KEY="sk_live_..."
YOCO_WEBHOOK_SECRET="whsec_..."

PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."

OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GEMINI_API_KEY="..."
```

### 3. Run Automated System Tests
The automated test suite verifies multi-tenant isolation, cross-tenant modification rejection, 30-day non-renewing Starter plan billing, webhook idempotency, AI agent human approvals, and SARS 15% VAT calculations:
```bash
npm run test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 👥 Demo Personas (One-Click Sign-In at `/login`)

For immediate testing, sample South African corporate data is pre-seeded:

| Persona | Name | Organisation | Role | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Business Owner** | Naledi Khumalo | Apex Solutions (Pty) Ltd | `Owner` | Full platform control, billing, human approvals |
| **Finance Manager** | Sipho Dlamini | Coastal Tech Ventures | `Finance` | Invoicing, expenses, VAT201 generation |
| **Platform Operator** | DevOps Engineer | MAGIC QUANT TRADING Corp | `Platform Admin` | Tenant health, manual overrides, AI routing |

---

## 📁 Repository Structure

```
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── (marketing)/          # Landing, features, pricing, compliance, contact
│   │   ├── app/                  # Authenticated tenant business dashboard
│   │   │   ├── approvals/        # Human Approval Queue
│   │   │   ├── agents/           # 7 AI Agents & Builder
│   │   │   ├── compliance/       # SARS VAT201, EMP201, Provisional Tax
│   │   │   ├── invoices/         # Section 20(4) 15% VAT Tax Invoices
│   │   │   ├── sales/            # Kanban Sales Pipeline
│   │   │   ├── clients/          # CRM & Debtor Ageing
│   │   │   ├── expenses/         # Claimable VAT Expense Tracker
│   │   │   ├── projects/         # Project Milestone Manager
│   │   │   ├── tasks/            # Operational Task Board
│   │   │   ├── hr/               # BCEA Leave & Staff Records
│   │   │   ├── calendar/         # Appointments & Video Meetings
│   │   │   ├── documents/        # Compliance Vault & OCR
│   │   │   ├── billing/          # 30-Day Starter Countdown & Invoices
│   │   │   └── settings/         # CIPC, VAT & POPIA Export
│   │   ├── admin/                # MAGIC QUANT TRADING Operator Console
│   │   │   ├── customers/        # Multi-tenant management & overrides
│   │   │   ├── billing/          # Global transaction ledger & refunds
│   │   │   ├── agents/           # LLM model routing & token telemetry
│   │   │   ├── integrations/     # Ingress webhook monitors
│   │   │   └── system/           # Immutable audit log & POPIA purge
│   │   └── api/                  # Edge API routes & webhook handlers
│   ├── components/               # UI components, navigation, layouts
│   ├── lib/
│   │   ├── ai/                   # Multi-provider LLM engine & 12-step runner
│   │   ├── auth/                 # Session & RBAC permissions engine
│   │   ├── billing/              # Yoco & Paystack webhook adapters
│   │   ├── compliance/           # SARS calculation workpapers
│   │   ├── db/                   # PostgreSQL schema & fallback store
│   │   └── integrations/         # Service integration registry
│   ├── tests/                    # Vitest system test suite
│   └── types/                    # Domain TypeScript models
├── supabase/
│   └── migrations/               # PostgreSQL schema & RLS policies
└── vitest.config.ts              # Unit & system testing configuration
```

---

## ⚖️ Legal & Compliance Disclaimer
Business Manager compiles tax calculation workpapers and documentation strictly according to the South African Value-Added Tax Act, Income Tax Act, and BCEA. The platform does not submit filings directly to SARS eFiling without vendor review. All calculations must be reviewed by the vendor's registered Public Officer or tax practitioner before submission.

---

© 2026 **MAGIC QUANT TRADING Corp**. All rights reserved.
