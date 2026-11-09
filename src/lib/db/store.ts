// ==============================================================================
// BUSINESS MANAGER — MULTI-TENANT REPOSITORY & DATA ENGINE
// MAGIC QUANT TRADING Corp | AI Business Operating System
// ==============================================================================

import {
  Organisation,
  UserProfile,
  OrganisationMember,
  Plan,
  Subscription,
  Payment,
  Customer,
  Deal,
  Invoice,
  InvoiceItem,
  Expense,
  Project,
  Task,
  Appointment,
  DocumentRecord,
  Employee,
  LeaveRequest,
  Integration,
  Agent,
  AgentExecution,
  AgentApproval,
  ComplianceObligation,
  NotificationItem,
  AuditLog,
} from "@/types";

export interface DatabaseState {
  organisations: Organisation[];
  userProfiles: UserProfile[];
  organisationMembers: OrganisationMember[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
  customers: Customer[];
  deals: Deal[];
  invoices: Invoice[];
  expenses: Expense[];
  projects: Project[];
  tasks: Task[];
  appointments: Appointment[];
  documents: DocumentRecord[];
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  integrations: Integration[];
  agents: Agent[];
  agentExecutions: AgentExecution[];
  agentApprovals: AgentApproval[];
  complianceObligations: ComplianceObligation[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
}

// Initial system plans
const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-starter-month",
    code: "starter_month",
    name: "Starter — 1 Month Access",
    description: "Get organised fast. Complete commercial suite for 30 days. Non-renewing single purchase.",
    price_cents: 49900, // R 499.00
    currency: "ZAR",
    billing_interval: "one_time",
    features: [
      "1 User License included",
      "Full Core Suite: CRM, Invoices, Expenses, Tasks",
      "1 Active AI Agent (Executive Assistant)",
      "Standard Integrations (Email, Calendar, Yoco)",
      "SARS Compliance & eFiling Assistance in every plan",
      "Email & Help Centre Support",
      "Non-renewing one-time access period (30 days)"
    ],
    max_users: 1,
    max_agents: 1,
    is_active: true,
  },
  {
    id: "plan-business-monthly",
    code: "business_monthly",
    name: "Business Manager — Monthly",
    description: "Continuous AI-powered operations with multi-agent orchestration and automated recurring billing.",
    price_cents: 129900, // R 1,299.00
    currency: "ZAR",
    billing_interval: "monthly",
    features: [
      "Up to 5 User Licenses",
      "All 7 Specialized AI Agents unlocked",
      "Visual Agent Builder & Custom Tool Permissions",
      "Unlimited Integrations (Xero, Sage, WhatsApp, Paystack)",
      "Advanced SARS eFiling Workpapers & EMP501",
      "Automated human-in-the-loop approval workflows",
      "Priority WhatsApp & SLA Support",
      "Cancel anytime recurring subscription"
    ],
    max_users: 5,
    max_agents: 7,
    is_active: true,
  },
];

// Initial preloaded state with South African enterprise business context
function getInitialDatabaseState(): DatabaseState {
  const orgApex: Organisation = {
    id: "org-apex-001",
    name: "Apex Solutions (Pty) Ltd",
    slug: "apex-solutions",
    legal_name: "Apex Solutions Proprietary Limited",
    registration_number: "2021/489211/07",
    tax_number: "9218291024",
    vat_number: "4920198273",
    country: "ZA",
    currency: "ZAR",
    timezone: "Africa/Johannesburg",
    is_active: true,
    settings: {
      industry: "Information Technology & Consulting",
      address: "150 West Street, Sandton, Johannesburg, 2196",
      vat_registered: true,
      fiscal_year_end: "02-28",
    },
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  const orgCoastal: Organisation = {
    id: "org-coastal-002",
    name: "Coastal Tech Ventures",
    slug: "coastal-tech",
    legal_name: "Coastal Tech Ventures (Pty) Ltd",
    registration_number: "2023/102934/07",
    tax_number: "9812736450",
    vat_number: "4192837465",
    country: "ZA",
    currency: "ZAR",
    timezone: "Africa/Johannesburg",
    is_active: true,
    settings: {
      industry: "Renewable Energy & IoT",
      address: "The Waterfront, Cape Town, 8001",
      vat_registered: true,
    },
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  const userSipho: UserProfile = {
    id: "user-sipho-001",
    email: "sipho@apexsolutions.co.za",
    full_name: "Sipho Ndlovu",
    phone: "+27 82 555 0192",
    is_platform_admin: false,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  };

  const userLerato: UserProfile = {
    id: "user-lerato-002",
    email: "lerato@apexsolutions.co.za",
    full_name: "Lerato Khumalo",
    phone: "+27 83 444 8219",
    is_platform_admin: false,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  };

  const userAdmin: UserProfile = {
    id: "user-mqt-admin",
    email: "admin@magicquant.co.za",
    full_name: "MQT Platform Administrator",
    phone: "+27 11 000 9999",
    is_platform_admin: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  };

  const userCoastalOwner: UserProfile = {
    id: "user-coastal-owner",
    email: "david@coastaltech.co.za",
    full_name: "David Van Der Merwe",
    phone: "+27 71 888 2341",
    is_platform_admin: false,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  };

  const members: OrganisationMember[] = [
    {
      id: "mem-001",
      organisation_id: "org-apex-001",
      user_id: userSipho.id,
      role: "business_owner",
      title: "Managing Director",
      department: "Executive",
      is_active: true,
      user: userSipho,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "mem-002",
      organisation_id: "org-apex-001",
      user_id: userLerato.id,
      role: "finance_manager",
      title: "Financial Controller",
      department: "Finance",
      is_active: true,
      user: userLerato,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "mem-003",
      organisation_id: "org-coastal-002",
      user_id: userCoastalOwner.id,
      role: "business_owner",
      title: "Founder & CEO",
      department: "Executive",
      is_active: true,
      user: userCoastalOwner,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ];

  // Active Starter Plan subscription for Apex Solutions (30 days one-time, 18 days remaining)
  const now = new Date();
  const subStart = new Date(now.getTime() - 12 * 86400000);
  const subEnd = new Date(subStart.getTime() + 30 * 86400000);

  const subApex: Subscription = {
    id: "sub-apex-001",
    organisation_id: "org-apex-001",
    plan_id: "plan-starter-month",
    plan: INITIAL_PLANS[0],
    status: "active",
    current_period_start: subStart.toISOString(),
    current_period_end: subEnd.toISOString(),
    cancel_at_period_end: true, // Non-renewing by default as per specification
    payment_provider: "yoco",
    external_subscription_id: "yoco_ch_live_920182",
    created_at: subStart.toISOString(),
  };

  const payments: Payment[] = [
    {
      id: "pay-apex-001",
      organisation_id: "org-apex-001",
      subscription_id: subApex.id,
      amount_cents: 49900,
      currency: "ZAR",
      status: "successful",
      payment_provider: "yoco",
      provider_transaction_id: "yoco_txn_489218942",
      provider_payment_method: "Visa ending in 4242",
      idempotency_key: "idem_apex_starter_purchase_2026",
      metadata: { plan_code: "starter_month", customer_email: "sipho@apexsolutions.co.za" },
      created_at: subStart.toISOString(),
    },
  ];

  const customers: Customer[] = [
    {
      id: "cust-001",
      organisation_id: "org-apex-001",
      name: "Discovery Health Corporate",
      company_name: "Discovery Central Services (Pty) Ltd",
      email: "procurement@discovery.co.za",
      phone: "+27 11 529 2888",
      address: "1 Discovery Place, Sandton, 2196",
      vat_number: "4190123984",
      credit_limit_cents: 25000000,
      tags: ["Enterprise", "Healthcare", "Retainer"],
      notes: "Annual software maintenance and cloud consulting SLA.",
      status: "active",
      created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cust-002",
      organisation_id: "org-apex-001",
      name: "Shoprite Digital Labs",
      company_name: "Shoprite Holdings Ltd",
      email: "finance@shoprite.co.za",
      phone: "+27 21 980 4000",
      address: "Cnr William Dabbs & Old Paarl Rd, Brackenfell, 7560",
      vat_number: "4280102931",
      credit_limit_cents: 18000000,
      tags: ["Retail", "Fintech", "High-Priority"],
      notes: "POS integration gateway and automated batch reconciliation.",
      status: "active",
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cust-003",
      organisation_id: "org-apex-001",
      name: "Cape Town Roasters",
      company_name: "CTR Speciality Coffee CC",
      email: "hello@ctroasters.co.za",
      phone: "+27 21 424 9912",
      address: "68 Bree Street, Cape Town, 8001",
      vat_number: "4920293847",
      credit_limit_cents: 5000000,
      tags: ["SME", "E-commerce"],
      notes: "Online shop inventory automation.",
      status: "active",
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cust-004",
      organisation_id: "org-apex-001",
      name: "Durban Cold Logistics",
      company_name: "Durban Logistics Ltd",
      email: "ops@durbanlogistics.co.za",
      phone: "+27 31 368 1120",
      address: "Maydon Wharf, Durban Harbour, 4001",
      vat_number: "4729102839",
      credit_limit_cents: 8000000,
      tags: ["Transport", "Logistics"],
      status: "lead",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Org Coastal's isolated customer (Tenant B)
    {
      id: "cust-coastal-001",
      organisation_id: "org-coastal-002",
      name: "Table Mountain Solar Co",
      company_name: "Table Mountain Solar (Pty) Ltd",
      email: "info@tmsolar.co.za",
      phone: "+27 21 888 1234",
      address: "Stellenbosch Techno Park, 7600",
      status: "active",
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const deals: Deal[] = [
    {
      id: "deal-001",
      organisation_id: "org-apex-001",
      customer_id: "cust-001",
      customer_name: "Discovery Health Corporate",
      title: "H2 Cloud Infrastructure Modernization",
      value_cents: 18500000, // R 185,000.00
      stage: "negotiation",
      probability: 85,
      expected_close_date: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      assigned_to: userSipho.id,
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: "deal-002",
      organisation_id: "org-apex-001",
      customer_id: "cust-002",
      customer_name: "Shoprite Digital Labs",
      title: "Automated Bank Feed Reconciliation Engine",
      value_cents: 12000000, // R 120,000.00
      stage: "proposal",
      probability: 60,
      expected_close_date: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0],
      assigned_to: userSipho.id,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: "deal-003",
      organisation_id: "org-apex-001",
      customer_id: "cust-004",
      customer_name: "Durban Cold Logistics",
      title: "Fleet Telematics & SARS Diesel Refund Tracking",
      value_cents: 7500000, // R 75,000.00
      stage: "contacted",
      probability: 30,
      expected_close_date: new Date(Date.now() + 35 * 86400000).toISOString().split("T")[0],
      assigned_to: userSipho.id,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "inv-001",
      organisation_id: "org-apex-001",
      customer_id: "cust-001",
      customer_name: "Discovery Health Corporate",
      customer_email: "procurement@discovery.co.za",
      invoice_number: "INV-2026-001",
      status: "paid",
      issue_date: "2026-09-01",
      due_date: "2026-09-30",
      subtotal_cents: 10000000, // R 100,000.00
      tax_cents: 1500000,       // R 15,000.00 (15% SA VAT)
      total_cents: 11500000,     // R 115,000.00
      balance_due_cents: 0,
      currency: "ZAR",
      items: [
        {
          id: "item-001",
          invoice_id: "inv-001",
          description: "Monthly Enterprise Architecture & SLA Support (Sept 2026)",
          quantity: 1,
          unit_price_cents: 10000000,
          tax_rate_percent: 15.0,
          total_cents: 11500000,
        },
      ],
      notes: "Paid in full via Nedbank Corporate EFT. Ref: APEX-DISC-09",
      terms: "Standard 30-day payment terms.",
      created_at: "2026-09-01T08:00:00Z",
    },
    {
      id: "inv-002",
      organisation_id: "org-apex-001",
      customer_id: "cust-002",
      customer_name: "Shoprite Digital Labs",
      customer_email: "finance@shoprite.co.za",
      invoice_number: "INV-2026-002",
      status: "issued",
      issue_date: "2026-10-01",
      due_date: "2026-10-31",
      subtotal_cents: 7500000, // R 75,000.00
      tax_cents: 1125000,      // R 11,250.00 (15% SA VAT)
      total_cents: 8625000,    // R 86,250.00
      balance_due_cents: 8625000,
      currency: "ZAR",
      items: [
        {
          id: "item-002",
          invoice_id: "inv-002",
          description: "Milestone 1: Automated Reconciliation Microservice Delivery",
          quantity: 1,
          unit_price_cents: 7500000,
          tax_rate_percent: 15.0,
          total_cents: 8625000,
        },
      ],
      notes: "Tax Invoice compliant with Section 20(4) of the South African VAT Act.",
      terms: "Strictly 30 days from date of invoice.",
      created_at: "2026-10-01T09:30:00Z",
    },
    {
      id: "inv-003",
      organisation_id: "org-apex-001",
      customer_id: "cust-003",
      customer_name: "Cape Town Roasters",
      customer_email: "hello@ctroasters.co.za",
      invoice_number: "INV-2026-003",
      status: "overdue",
      issue_date: "2026-09-10",
      due_date: "2026-10-10",
      subtotal_cents: 3000000, // R 30,000.00
      tax_cents: 450000,       // R 4,500.00
      total_cents: 3450000,    // R 34,500.00
      balance_due_cents: 3450000,
      currency: "ZAR",
      items: [
        {
          id: "item-003",
          invoice_id: "inv-003",
          description: "Shopify E-Commerce Multi-Branch Stock Sync Module",
          quantity: 1,
          unit_price_cents: 3000000,
          tax_rate_percent: 15.0,
          total_cents: 3450000,
        },
      ],
      notes: "Overdue by 14 days. First reminder sent.",
      terms: "Payment due within 30 days.",
      created_at: "2026-09-10T11:00:00Z",
    },
  ];

  const expenses: Expense[] = [
    {
      id: "exp-001",
      organisation_id: "org-apex-001",
      category: "Cloud Hosting & Infrastructure",
      payee: "Amazon Web Services (AWS Cape Town Region)",
      amount_cents: 1450000, // R 14,500.00
      tax_cents: 189130,     // 15% VAT included claimable
      currency: "ZAR",
      date: "2026-10-05",
      payment_method: "Corporate Credit Card",
      is_vat_claimable: true,
      notes: "Monthly production compute and serverless database cluster.",
      created_at: "2026-10-05T14:20:00Z",
    },
    {
      id: "exp-002",
      organisation_id: "org-apex-001",
      category: "Telecommunications & Internet",
      payee: "Vodacom Business Fibre",
      amount_cents: 285000, // R 2,850.00
      tax_cents: 37174,
      currency: "ZAR",
      date: "2026-10-02",
      payment_method: "Debit Order",
      is_vat_claimable: true,
      notes: "Sandton office dedicated fibre link.",
      created_at: "2026-10-02T10:00:00Z",
    },
    {
      id: "exp-003",
      organisation_id: "org-apex-001",
      category: "Software Subscriptions",
      payee: "Google Workspace & GitHub Enterprise",
      amount_cents: 320000, // R 3,200.00
      tax_cents: 41739,
      currency: "ZAR",
      date: "2026-10-01",
      payment_method: "Corporate Credit Card",
      is_vat_claimable: true,
      notes: "Team developer seats and corporate email.",
      created_at: "2026-10-01T08:00:00Z",
    },
    {
      id: "exp-004",
      organisation_id: "org-apex-001",
      category: "Rent & Facilities",
      payee: "Regus Sandton West Street",
      amount_cents: 1800000, // R 18,000.00
      tax_cents: 234783,
      currency: "ZAR",
      date: "2026-10-01",
      payment_method: "EFT",
      is_vat_claimable: true,
      notes: "Monthly executive serviced office suite.",
      created_at: "2026-10-01T09:00:00Z",
    },
  ];

  const projects: Project[] = [
    {
      id: "proj-001",
      organisation_id: "org-apex-001",
      customer_id: "cust-001",
      name: "Discovery Health Modernization",
      description: "Cloud migration of legacy microservices into Kubernetes with automated CI/CD.",
      status: "active",
      start_date: "2026-08-01",
      due_date: "2026-11-30",
      budget_cents: 35000000,
      progress_percent: 65,
      created_at: "2026-08-01T08:00:00Z",
    },
    {
      id: "proj-002",
      organisation_id: "org-apex-001",
      customer_id: "cust-002",
      name: "Shoprite POS Reconciliation",
      description: "Real-time bank feed ingestion engine with automated VAT and credit card fee splitting.",
      status: "active",
      start_date: "2026-09-15",
      due_date: "2026-12-15",
      budget_cents: 22000000,
      progress_percent: 40,
      created_at: "2026-09-15T09:00:00Z",
    },
  ];

  const tasks: Task[] = [
    {
      id: "task-001",
      organisation_id: "org-apex-001",
      project_id: "proj-001",
      project_name: "Discovery Health Modernization",
      title: "Finalize SARS eFiling VAT201 Workpaper for Aug/Sep period",
      description: "Reconcile Output VAT on INV-2026-001 & INV-2026-002 against Input VAT on supplier invoices.",
      status: "in_progress",
      priority: "high",
      due_date: "2026-10-25",
      assigned_to: userLerato.id,
      assignee_name: "Lerato Khumalo",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "task-002",
      organisation_id: "org-apex-001",
      project_id: "proj-002",
      project_name: "Shoprite POS Reconciliation",
      title: "Follow up on overdue invoice INV-2026-003 (Cape Town Roasters)",
      description: "Send friendly statement and verify EFT confirmation with accounts team.",
      status: "todo",
      priority: "urgent",
      due_date: "2026-10-24",
      assigned_to: userSipho.id,
      assignee_name: "Sipho Ndlovu",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "task-003",
      organisation_id: "org-apex-001",
      title: "Review EMP201 payroll submission for October PAYE and UIF",
      description: "Verify 1% UIF employee contribution + 1% employer matching and SDL exemption threshold.",
      status: "todo",
      priority: "medium",
      due_date: "2026-11-07",
      assigned_to: userLerato.id,
      assignee_name: "Lerato Khumalo",
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: "task-004",
      organisation_id: "org-apex-001",
      project_id: "proj-001",
      project_name: "Discovery Health Modernization",
      title: "Perform automated security audit of AWS IAM roles",
      description: "Review least privilege access policies across the Kubernetes namespace.",
      status: "completed",
      priority: "high",
      due_date: "2026-10-20",
      assigned_to: userSipho.id,
      assignee_name: "Sipho Ndlovu",
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "apt-001",
      organisation_id: "org-apex-001",
      customer_id: "cust-001",
      customer_name: "Discovery Health Corporate",
      title: "Q4 Architecture Steering Committee",
      description: "Executive review of containerization performance and migration milestones.",
      start_time: new Date(Date.now() + 2 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 2 * 86400000 + 3600000).toISOString(),
      location: "Microsoft Teams / 1 Discovery Place",
      meeting_link: "https://teams.microsoft.com/l/meetup-join/sample",
      status: "confirmed",
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: "apt-002",
      organisation_id: "org-apex-001",
      customer_id: "cust-004",
      customer_name: "Durban Cold Logistics",
      title: "Product Demo & Logistics Telematics Scoping",
      description: "Showcase automated delivery receipt OCR and driver log verification.",
      start_time: new Date(Date.now() + 4 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 4 * 86400000 + 1800000).toISOString(),
      location: "Google Meet",
      meeting_link: "https://meet.google.com/mqt-apex-demo",
      status: "confirmed",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const documents: DocumentRecord[] = [
    {
      id: "doc-001",
      organisation_id: "org-apex-001",
      folder: "Compliance & Tax",
      title: "SARS Tax Clearance Status (TCS) Pin 2026",
      file_path: "/storage/apex/compliance/sars_tcs_pin_2026.pdf",
      file_size_bytes: 245000,
      mime_type: "application/pdf",
      extracted_text: "South African Revenue Service - Tax Compliance Status PIN issued for Apex Solutions (Pty) Ltd. Status: COMPLIANT.",
      summary: "Official SARS Tax Clearance PIN valid for tender and corporate vendor registrations.",
      tags: ["SARS", "TCS", "Tax Compliance"],
      created_at: "2026-03-01T08:00:00Z",
    },
    {
      id: "doc-002",
      organisation_id: "org-apex-001",
      folder: "Company Secretarial",
      title: "CIPC Registration Certificate (COR14.3)",
      file_path: "/storage/apex/legal/cipc_cor14_3_apex.pdf",
      file_size_bytes: 412000,
      mime_type: "application/pdf",
      extracted_text: "Companies and Intellectual Property Commission of South Africa. Registration 2021/489211/07.",
      summary: "Official CIPC incorporation certificate verifying company directors and registered address.",
      tags: ["CIPC", "Legal", "Secretarial"],
      created_at: "2021-04-15T10:00:00Z",
    },
    {
      id: "doc-003",
      organisation_id: "org-apex-001",
      folder: "Standard Contracts",
      title: "Apex Master Services Agreement (MSA) Template",
      file_path: "/storage/apex/legal/msa_template_v3.pdf",
      file_size_bytes: 310000,
      mime_type: "application/pdf",
      extracted_text: "Master Professional Services Agreement governed by the laws of the Republic of South Africa.",
      summary: "Standard client contract covering IP transfer, liability caps, and POPIA privacy obligations.",
      tags: ["Contracts", "Sales", "Legal"],
      created_at: "2026-01-10T11:00:00Z",
    },
  ];

  const employees: Employee[] = [
    {
      id: "emp-001",
      organisation_id: "org-apex-001",
      first_name: "Sipho",
      last_name: "Ndlovu",
      email: "sipho@apexsolutions.co.za",
      id_or_passport: "8805125890082",
      job_title: "Managing Director",
      department: "Executive",
      start_date: "2021-04-01",
      salary_cents: 8500000, // R 85,000.00 / month
      employment_type: "permanent",
      annual_leave_days: 20,
      created_at: "2021-04-01T00:00:00Z",
    },
    {
      id: "emp-002",
      organisation_id: "org-apex-001",
      first_name: "Lerato",
      last_name: "Khumalo",
      email: "lerato@apexsolutions.co.za",
      id_or_passport: "9210140294085",
      job_title: "Financial Controller",
      department: "Finance",
      start_date: "2022-02-15",
      salary_cents: 5500000, // R 55,000.00 / month
      employment_type: "permanent",
      annual_leave_days: 18,
      created_at: "2022-02-15T00:00:00Z",
    },
    {
      id: "emp-003",
      organisation_id: "org-apex-001",
      first_name: "Thabo",
      last_name: "Mokoena",
      email: "thabo@apexsolutions.co.za",
      id_or_passport: "9503205128087",
      job_title: "Lead Cloud Architect",
      department: "Engineering",
      start_date: "2023-06-01",
      salary_cents: 6800000, // R 68,000.00 / month
      employment_type: "permanent",
      annual_leave_days: 15,
      created_at: "2023-06-01T00:00:00Z",
    },
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: "leave-001",
      organisation_id: "org-apex-001",
      employee_id: "emp-003",
      employee_name: "Thabo Mokoena",
      leave_type: "annual",
      start_date: "2026-12-22",
      end_date: "2027-01-04",
      total_days: 8,
      reason: "Annual December shutdown holiday with family in Free State.",
      status: "pending",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];

  const integrations: Integration[] = [
    {
      id: "int-001",
      organisation_id: "org-apex-001",
      provider: "yoco",
      category: "payments",
      name: "Yoco Payments",
      description: "Accept South African Visa, Mastercard and instant EFT with real-time payment webhooks.",
      status: "connected",
      config: { public_key: "pk_test_ed35073660KeLvd107ee", currency: "ZAR", webhook_active: true },
      last_synced_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "int-002",
      organisation_id: "org-apex-001",
      provider: "paystack",
      category: "payments",
      name: "Paystack South Africa",
      description: "Card checkout, Ozow instant EFT, and recurring subscription tokenization.",
      status: "connected",
      config: { public_key: "pk_test_sample_paystack_key", auto_settle: true },
      last_synced_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "int-003",
      organisation_id: "org-apex-001",
      provider: "google_calendar",
      category: "calendar",
      name: "Google Calendar & Workspace",
      description: "Bi-directional sync for meetings, appointments, and automatic video conference links.",
      status: "connected",
      config: { calendar_id: "primary", auto_invite: true },
      last_synced_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "int-004",
      organisation_id: "org-apex-001",
      provider: "xero",
      category: "accounting",
      name: "Xero Accounting",
      description: "Export invoices, reconcile bank statements and sync contacts seamlessly.",
      status: "disconnected",
      config: {},
    },
    {
      id: "int-005",
      organisation_id: "org-apex-001",
      provider: "whatsapp",
      category: "communication",
      name: "WhatsApp Business API",
      description: "Send automated invoice reminders, meeting confirmations, and client alerts directly on WhatsApp.",
      status: "disconnected",
      config: {},
    },
    {
      id: "int-006",
      organisation_id: "org-apex-001",
      provider: "simplepay",
      category: "payroll",
      name: "SimplePay South Africa",
      description: "Compliant South African payroll, IRP5 generation, and EMP201 payroll tax calculations.",
      status: "disconnected",
      config: {},
    },
  ];

  // The 7 Specialized AI Agents
  const agents: Agent[] = [
    {
      id: "agent-001",
      organisation_id: "org-apex-001",
      name: "Executive Assistant Agent",
      category: "executive_assistant",
      description: "Produces daily operational briefings, identifies overdue deadlines, and plans executive priorities.",
      system_instructions: `You are the Executive Assistant Agent for Apex Solutions (Pty) Ltd. Your role is to monitor tasks, upcoming appointments, and priority deadlines across the business. Present concise briefings and flag items requiring leadership attention. Always format currency in South African Rand (ZAR).`,
      model: "gpt-4o",
      permitted_tools: ["list_tasks", "list_appointments", "get_financial_summary", "create_task"],
      permitted_modules: ["tasks", "calendar", "dashboard", "reports"],
      schedule: "0 8 * * 1-5", // Daily Mon-Fri 8am
      requires_approval_for: ["create_task"],
      budget_tokens: 10000,
      is_active: true,
      created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-002",
      organisation_id: "org-apex-001",
      name: "Sales & Pipeline Agent",
      category: "sales_agent",
      description: "Qualifies inbound leads, identifies stale pipeline deals, drafts personalized follow-up proposals.",
      system_instructions: `You are the Sales Agent. Inspect deal stages, monitor expected close dates, and draft follow-up correspondence. Never modify deal amounts or send emails directly without human sign-off.`,
      model: "gpt-4o",
      permitted_tools: ["list_deals", "list_customers", "draft_customer_email"],
      permitted_modules: ["crm", "sales"],
      requires_approval_for: ["draft_customer_email", "update_deal_stage"],
      budget_tokens: 8000,
      is_active: true,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-003",
      organisation_id: "org-apex-001",
      name: "Finance Assistant Agent",
      category: "finance_assistant",
      description: "Monitors accounts receivable ageing, flags overdue invoices, and prepares draft statements.",
      system_instructions: `You are the Finance Assistant. Analyze outstanding debtors, check payment status against bank feeds, and highlight overdue accounts. You must never initiate payments or alter banking details.`,
      model: "gpt-4o",
      permitted_tools: ["list_invoices", "list_expenses", "check_receivables_ageing", "stage_invoice_reminder"],
      permitted_modules: ["invoices", "expenses", "reports"],
      requires_approval_for: ["stage_invoice_reminder", "issue_tax_invoice"],
      budget_tokens: 12000,
      is_active: true,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-004",
      organisation_id: "org-apex-001",
      name: "Customer Service Agent",
      category: "customer_service",
      description: "Resolves client inquiries using approved knowledge base documents, routes support tickets.",
      system_instructions: `You are the Customer Service Agent. Answer inquiries using approved company documents. Escalate complex or sensitive requests to the Business Owner.`,
      model: "gpt-4o",
      permitted_tools: ["search_knowledge_base", "create_support_task"],
      permitted_modules: ["documents", "tasks"],
      requires_approval_for: ["send_client_message"],
      budget_tokens: 8000,
      is_active: true,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-005",
      organisation_id: "org-apex-001",
      name: "HR Assistant Agent",
      category: "hr_assistant",
      description: "Tracks BCEA leave balances, compiles onboarding checklists, and drafts job descriptions.",
      system_instructions: `You are the HR Assistant. Provide administration for leave requests under South African Basic Conditions of Employment Act (BCEA). You must not make hiring or disciplinary decisions.`,
      model: "gpt-4o",
      permitted_tools: ["list_employees", "list_leave_requests", "draft_job_spec"],
      permitted_modules: ["hr"],
      requires_approval_for: ["approve_leave_request"],
      budget_tokens: 6000,
      is_active: true,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-006",
      organisation_id: "org-apex-001",
      name: "Operations Agent",
      category: "operations_agent",
      description: "Detects workflow bottlenecks, project schedule slippage, and coordinates multi-step tasks.",
      system_instructions: `You are the Operations Agent. Monitor active project milestones and task completion velocities. Flag blockers before they impact deliverable dates.`,
      model: "gpt-4o",
      permitted_tools: ["list_projects", "list_tasks", "generate_operational_report"],
      permitted_modules: ["projects", "tasks", "reports"],
      requires_approval_for: ["reschedule_task"],
      budget_tokens: 8000,
      is_active: true,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "agent-007",
      organisation_id: "org-apex-001",
      name: "SARS Compliance Assistant",
      category: "sars_compliance",
      description: "Calculates draft VAT201 / EMP201 liabilities, organizes supporting invoices, and prepares eFiling checklists.",
      system_instructions: `You are the SARS Compliance Assistant. Assist South African businesses with tax preparation (VAT201, EMP201, Provisional Tax). Cross-reference recorded invoices and expenses for valid tax invoice compliance under Section 20(4) of the VAT Act. Disclose that all outputs are administrative workpapers and not formal legal tax advice.`,
      model: "gpt-4o",
      permitted_tools: ["calculate_vat201_workpaper", "check_sars_deadlines", "verify_tax_invoices"],
      permitted_modules: ["compliance", "invoices", "expenses"],
      requires_approval_for: ["export_efiling_pack"],
      budget_tokens: 15000,
      is_active: true,
      created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const agentExecutions: AgentExecution[] = [
    {
      id: "exec-001",
      organisation_id: "org-apex-001",
      agent_id: "agent-007",
      agent_name: "SARS Compliance Assistant",
      trigger_source: "manual",
      status: "completed",
      started_at: new Date(Date.now() - 3600000).toISOString(),
      completed_at: new Date(Date.now() - 3550000).toISOString(),
      total_tokens: 2840,
      execution_duration_ms: 2450,
      steps: [
        {
          id: "step-01",
          execution_id: "exec-001",
          step_number: 1,
          tool_name: "calculate_vat201_workpaper",
          tool_input: { period: "2026/09" },
          tool_output: {
            output_vat_cents: 2625000,
            input_vat_cents: 504652,
            net_vat_payable_cents: 2120348,
            valid_invoices_checked: 3,
            discrepancies_found: 0,
          },
          status: "success",
          created_at: new Date(Date.now() - 3580000).toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "exec-002",
      organisation_id: "org-apex-001",
      agent_id: "agent-003",
      agent_name: "Finance Assistant Agent",
      trigger_source: "schedule",
      status: "waiting_approval",
      started_at: new Date(Date.now() - 1800000).toISOString(),
      total_tokens: 1950,
      execution_duration_ms: 1820,
      steps: [
        {
          id: "step-02",
          execution_id: "exec-002",
          step_number: 1,
          tool_name: "check_receivables_ageing",
          tool_input: { threshold_days: 14 },
          tool_output: { overdue_count: 1, overdue_amount_cents: 3450000 },
          status: "success",
          created_at: new Date(Date.now() - 1790000).toISOString(),
        },
        {
          id: "step-03",
          execution_id: "exec-002",
          step_number: 2,
          tool_name: "stage_invoice_reminder",
          tool_input: { invoice_id: "inv-003", customer_email: "hello@ctroasters.co.za" },
          tool_output: { requires_approval: true },
          status: "blocked_approval",
          created_at: new Date(Date.now() - 1780000).toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  // Pending Human-in-the-Loop Approval Queue
  const agentApprovals: AgentApproval[] = [
    {
      id: "appr-001",
      organisation_id: "org-apex-001",
      execution_id: "exec-002",
      agent_id: "agent-003",
      agent_name: "Finance Assistant Agent",
      action_type: "send_overdue_notice",
      description: "Send friendly overdue payment reminder email to Cape Town Roasters for INV-2026-003 (R 34,500.00, overdue by 14 days).",
      proposed_payload: {
        recipient: "hello@ctroasters.co.za",
        subject: "Statement Reminder: Apex Solutions Invoice INV-2026-003",
        invoice_number: "INV-2026-003",
        amount_cents: 3450000,
        due_date: "2026-10-10",
        message_body: "Dear Cape Town Roasters Team, we hope you are well. This is a polite reminder that invoice INV-2026-003 for R34,500.00 was due on 10 Oct 2026. Please find banking details attached for payment reconciliation.",
      },
      status: "pending",
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date(Date.now() - 1780000).toISOString(),
    },
    {
      id: "appr-002",
      organisation_id: "org-apex-001",
      execution_id: "exec-001",
      agent_id: "agent-002",
      agent_name: "Sales & Pipeline Agent",
      action_type: "send_sales_proposal",
      description: "Send cloud architecture optimization proposal to Discovery Health Corporate procurement team.",
      proposed_payload: {
        recipient: "procurement@discovery.co.za",
        deal_id: "deal-001",
        proposed_value_cents: 18500000,
        summary: "Discovery H2 Cloud Infrastructure Modernization Scope of Work and SLA Pricing.",
      },
      status: "pending",
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  // South African SARS Compliance Obligations
  const complianceObligations: ComplianceObligation[] = [
    {
      id: "comp-001",
      organisation_id: "org-apex-001",
      tax_type: "vat201",
      title: "VAT201 Return (Aug / Sep 2026 Period)",
      period_label: "2026/08 - 2026/09 (Bi-Monthly Category B)",
      period_start: "2026-08-01",
      period_end: "2026-09-30",
      due_date: "2026-10-31", // eFiling deadline is last business day of following month
      status: "ready_to_file",
      calculated_tax_cents: 2120348, // R 21,203.48
      workpaper_data: {
        standard_rated_sales_cents: 17500000, // R 175,000.00
        output_vat_cents: 2625000,             // R 26,250.00
        standard_rated_purchases_cents: 3364347,
        input_vat_cents: 504652,               // R 5,046.52
        net_payable_cents: 2120348,            // R 21,203.48
        currency: "ZAR",
      },
      checklist: [
        { item: "All sales invoices issued in period have valid Section 20(4) VAT details", done: true },
        { item: "Supplier tax invoices attached for all input tax deductions exceeding R5,000", done: true },
        { item: "Zero-rated exports reconciled against customs documentation", done: true, note: "N/A - 100% domestic sales" },
        { item: "Bank statement reconciliation confirms received EFT payments", done: true },
        { item: "Workpaper reviewed by Financial Controller (Lerato Khumalo)", done: true },
      ],
      created_at: "2026-10-01T08:00:00Z",
    },
    {
      id: "comp-002",
      organisation_id: "org-apex-001",
      tax_type: "paye_emp201",
      title: "EMP201 Employer Declaration (October 2026)",
      period_label: "2026/10 Monthly Declaration",
      period_start: "2026-10-01",
      period_end: "2026-10-31",
      due_date: "2026-11-07", // 7th of following month
      status: "in_progress",
      calculated_tax_cents: 4860000, // R 48,600.00 total (PAYE + UIF + SDL)
      workpaper_data: {
        total_payroll_cents: 20800000,
        paye_cents: 4200000,
        sdl_cents: 208000,
        uif_employee_cents: 226000,
        uif_employer_cents: 226000,
      },
      checklist: [
        { item: "Monthly salaries and bonuses calculated according to tax tables", done: true },
        { item: "UIF capped at statutory ceiling (R17,712 gross)", done: true },
        { item: "SDL calculated at 1% of leviable payroll", done: false },
        { item: "Director remuneration approved", done: true },
      ],
      created_at: "2026-10-01T08:00:00Z",
    },
    {
      id: "comp-003",
      organisation_id: "org-apex-001",
      tax_type: "provisional_irp6",
      title: "2nd Provisional Tax Return (IRP6)",
      period_label: "2027 Year of Assessment (Period 2)",
      period_start: "2026-03-01",
      period_end: "2027-02-28",
      due_date: "2027-02-28",
      status: "upcoming",
      calculated_tax_cents: 6850000, // Estimated R 68,500.00
      workpaper_data: {
        estimated_taxable_income_cents: 50000000,
        corporate_tax_rate: 0.27, // 27% South African corporate tax rate
        gross_tax_cents: 13500000,
        first_period_paid_cents: 6650000,
        second_period_due_cents: 6850000,
      },
      checklist: [
        { item: "Management accounts prepared for 11 months to estimate full-year profit", done: false },
        { item: "Basic amount from latest SARS assessment verified", done: true },
        { item: "Ensure estimate is within statutory 80% / 90% accuracy rule to avoid section 89quat interest", done: false },
      ],
      created_at: "2026-10-01T08:00:00Z",
    },
    {
      id: "comp-004",
      organisation_id: "org-apex-001",
      tax_type: "cipc_annual",
      title: "CIPC Annual Return & Beneficial Ownership Register",
      period_label: "2026 Anniversary Filing",
      period_start: "2026-04-01",
      period_end: "2026-05-31",
      due_date: "2026-05-31",
      status: "filed",
      reference_number: "CIPC-RET-920194-2026",
      calculated_tax_cents: 45000, // R 450.00 statutory CIPC fee
      filed_at: "2026-05-14T11:20:00Z",
      checklist: [
        { item: "Turnover declared matches financial statements", done: true },
        { item: "Beneficial Ownership Register updated and submitted on BizPortal", done: true },
        { item: "CIPC compliance certificate downloaded and archived", done: true },
      ],
      created_at: "2026-04-01T08:00:00Z",
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: "notif-001",
      organisation_id: "org-apex-001",
      title: "Human Approval Required",
      message: "Finance Assistant Agent prepared an overdue payment notice for Cape Town Roasters (R34,500.00).",
      type: "approval_required",
      action_url: "/app/approvals",
      is_read: false,
      created_at: new Date(Date.now() - 1780000).toISOString(),
    },
    {
      id: "notif-002",
      organisation_id: "org-apex-001",
      title: "SARS VAT201 Workpaper Ready",
      message: "The August/September VAT201 workpaper has been reconciled. R21,203.48 net VAT due by 31 Oct.",
      type: "info",
      action_url: "/app/compliance",
      is_read: false,
      created_at: new Date(Date.now() - 3550000).toISOString(),
    },
    {
      id: "notif-003",
      organisation_id: "org-apex-001",
      title: "Subscription Active",
      message: "Starter 1-Month access active. 18 days remaining until expiry. Non-renewing single purchase.",
      type: "success",
      action_url: "/app/billing",
      is_read: true,
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "audit-001",
      organisation_id: "org-apex-001",
      user_id: userSipho.id,
      user_name: "Sipho Ndlovu",
      action: "account_activated",
      entity_type: "subscription",
      entity_id: subApex.id,
      details: "Starter 1-Month access activated via verified Yoco card payment (R499.00).",
      created_at: subStart.toISOString(),
    },
    {
      id: "audit-002",
      organisation_id: "org-apex-001",
      user_name: "SARS Compliance Assistant",
      action: "workpaper_generated",
      entity_type: "compliance_obligation",
      entity_id: "comp-001",
      details: "Automated VAT201 workpaper calculation executed for period 2026/09.",
      created_at: new Date(Date.now() - 3550000).toISOString(),
    },
  ];

  return {
    organisations: [orgApex, orgCoastal],
    userProfiles: [userSipho, userLerato, userAdmin, userCoastalOwner],
    organisationMembers: members,
    plans: INITIAL_PLANS,
    subscriptions: [subApex],
    payments,
    customers,
    deals,
    invoices,
    expenses,
    projects,
    tasks,
    appointments,
    documents,
    employees,
    leaveRequests,
    integrations,
    agents,
    agentExecutions,
    agentApprovals,
    complianceObligations,
    notifications,
    auditLogs,
  };
}

// Global in-memory singleton that persists for the lifetime of the server process
class DatabaseStore {
  public state: DatabaseState;

  constructor() {
    this.state = getInitialDatabaseState();
  }

  // Reset to initial state (useful for tests)
  public reset() {
    this.state = getInitialDatabaseState();
  }

  // --- Multi-Tenant Context Enforcement ---
  private verifyTenant<T extends { organisation_id: string }>(item: T, orgId: string): boolean {
    return item.organisation_id === orgId;
  }

  // --- Organisations ---
  public getOrganisation(id: string): Organisation | undefined {
    return this.state.organisations.find((o) => o.id === id);
  }

  public getAllOrganisations(): Organisation[] {
    return this.state.organisations;
  }

  public updateOrganisation(id: string, updates: Partial<Organisation>): Organisation | null {
    const org = this.getOrganisation(id);
    if (!org) return null;
    Object.assign(org, updates, { updated_at: new Date().toISOString() });
    return org;
  }

  public createOrganisation(org: Organisation): Organisation {
    this.state.organisations.push(org);
    return org;
  }

  // --- User Profiles & Membership ---
  public getUserProfile(id: string): UserProfile | undefined {
    return this.state.userProfiles.find((u) => u.id === id);
  }

  public getUserProfileByEmail(email: string): UserProfile | undefined {
    return this.state.userProfiles.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUserProfile(profile: UserProfile): UserProfile {
    this.state.userProfiles.push(profile);
    return profile;
  }

  public getOrganisationMembers(orgId: string): OrganisationMember[] {
    return this.state.organisationMembers.filter((m) => m.organisation_id === orgId);
  }

  public getUserOrganisations(userId: string): Organisation[] {
    const memberOrgs = this.state.organisationMembers
      .filter((m) => m.user_id === userId && m.is_active)
      .map((m) => m.organisation_id);
    return this.state.organisations.filter((o) => memberOrgs.includes(o.id));
  }

  public addOrganisationMember(member: OrganisationMember): OrganisationMember {
    this.state.organisationMembers.push(member);
    return member;
  }

  // --- Plans & Subscriptions ---
  public getPlans(): Plan[] {
    return this.state.plans;
  }

  public getPlanByCode(code: string): Plan | undefined {
    return this.state.plans.find((p) => p.code === code);
  }

  public getSubscription(orgId: string): Subscription | undefined {
    return this.state.subscriptions.find(
      (s) => s.organisation_id === orgId && (s.status === "active" || s.status === "trialing")
    );
  }

  public getSubscriptions(orgId: string): Subscription[] {
    return this.state.subscriptions.filter((s) => s.organisation_id === orgId);
  }

  public getAllSubscriptions(): Subscription[] {
    return this.state.subscriptions;
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public createSubscription(sub: Subscription): Subscription {
    // Cancel or expire any previous subscription for this tenant
    this.state.subscriptions
      .filter((s) => s.organisation_id === sub.organisation_id)
      .forEach((s) => (s.status = "canceled"));
    this.state.subscriptions.push(sub);
    return sub;
  }

  public addPayment(payment: Payment): Payment {
    this.state.payments.push(payment);
    return payment;
  }

  public getPayments(orgId: string): Payment[] {
    return this.state.payments.filter((p) => p.organisation_id === orgId);
  }

  public getAllPayments(): Payment[] {
    return this.state.payments;
  }

  // --- CRM & Customers (Strict Tenant Isolation) ---
  public getCustomers(orgId: string): Customer[] {
    return this.state.customers.filter((c) => c.organisation_id === orgId);
  }

  public getCustomerById(id: string, orgId: string): Customer | undefined {
    return this.state.customers.find((c) => c.id === id && c.organisation_id === orgId);
  }

  public createCustomer(customer: Customer): Customer {
    this.state.customers.push(customer);
    return customer;
  }

  public updateCustomer(id: string, orgId: string, updates: Partial<Customer>): Customer | null {
    const customer = this.getCustomerById(id, orgId);
    if (!customer) return null;
    Object.assign(customer, updates, { updated_at: new Date().toISOString() });
    return customer;
  }

  // --- Deals ---
  public getDeals(orgId: string): Deal[] {
    return this.state.deals.filter((d) => d.organisation_id === orgId);
  }

  public createDeal(deal: Deal): Deal {
    this.state.deals.push(deal);
    return deal;
  }

  public updateDealStage(id: string, orgId: string, stage: Deal["stage"]): Deal | null {
    const deal = this.state.deals.find((d) => d.id === id && d.organisation_id === orgId);
    if (!deal) return null;
    deal.stage = stage;
    return deal;
  }

  // --- Invoices & Finance (Strict Tenant Isolation) ---
  public getInvoices(orgId: string): Invoice[] {
    return this.state.invoices.filter((i) => i.organisation_id === orgId);
  }

  public getInvoiceById(id: string, orgId: string): Invoice | undefined {
    return this.state.invoices.find((i) => i.id === id && i.organisation_id === orgId);
  }

  public createInvoice(invoice: Invoice): Invoice {
    this.state.invoices.push(invoice);
    return invoice;
  }

  public updateInvoiceStatus(id: string, orgId: string, status: Invoice["status"]): Invoice | null {
    const invoice = this.getInvoiceById(id, orgId);
    if (!invoice) return null;
    invoice.status = status;
    if (status === "paid") {
      invoice.balance_due_cents = 0;
    }
    return invoice;
  }

  public getExpenses(orgId: string): Expense[] {
    return this.state.expenses.filter((e) => e.organisation_id === orgId);
  }

  public createExpense(expense: Expense): Expense {
    this.state.expenses.push(expense);
    return expense;
  }

  // --- Projects & Tasks ---
  public getProjects(orgId: string): Project[] {
    return this.state.projects.filter((p) => p.organisation_id === orgId);
  }

  public createProject(project: Project): Project {
    this.state.projects.push(project);
    return project;
  }

  public getTasks(orgId: string): Task[] {
    return this.state.tasks.filter((t) => t.organisation_id === orgId);
  }

  public createTask(task: Task): Task {
    this.state.tasks.push(task);
    return task;
  }

  public updateTaskStatus(id: string, orgId: string, status: Task["status"]): Task | null {
    const task = this.state.tasks.find((t) => t.id === id && t.organisation_id === orgId);
    if (!task) return null;
    task.status = status;
    return task;
  }

  // --- Appointments & Documents ---
  public getAppointments(orgId: string): Appointment[] {
    return this.state.appointments.filter((a) => a.organisation_id === orgId);
  }

  public createAppointment(apt: Appointment): Appointment {
    this.state.appointments.push(apt);
    return apt;
  }

  public getDocuments(orgId: string): DocumentRecord[] {
    return this.state.documents.filter((d) => d.organisation_id === orgId);
  }

  public createDocument(doc: DocumentRecord): DocumentRecord {
    this.state.documents.push(doc);
    return doc;
  }

  // --- HR & Leave ---
  public getEmployees(orgId: string): Employee[] {
    return this.state.employees.filter((e) => e.organisation_id === orgId);
  }

  public createEmployee(emp: Employee): Employee {
    this.state.employees.push(emp);
    return emp;
  }

  public getLeaveRequests(orgId: string): LeaveRequest[] {
    return this.state.leaveRequests.filter((l) => l.organisation_id === orgId);
  }

  public createLeaveRequest(req: LeaveRequest): LeaveRequest {
    this.state.leaveRequests.push(req);
    return req;
  }

  public updateLeaveStatus(id: string, orgId: string, status: "approved" | "rejected"): LeaveRequest | null {
    const req = this.state.leaveRequests.find((l) => l.id === id && l.organisation_id === orgId);
    if (!req) return null;
    req.status = status;
    return req;
  }

  // --- Integrations ---
  public getIntegrations(orgId: string): Integration[] {
    return this.state.integrations.filter((i) => i.organisation_id === orgId);
  }

  public updateIntegration(orgId: string, provider: Integration["provider"], updates: Partial<Integration>): Integration | null {
    const int = this.state.integrations.find((i) => i.organisation_id === orgId && i.provider === provider);
    if (!int) return null;
    Object.assign(int, updates, { last_synced_at: new Date().toISOString() });
    return int;
  }

  // --- Agents & AI Orchestration ---
  public getAgents(orgId: string): Agent[] {
    return this.state.agents.filter((a) => a.organisation_id === orgId);
  }

  public getAgentById(id: string, orgId: string): Agent | undefined {
    return this.state.agents.find((a) => a.id === id && a.organisation_id === orgId);
  }

  public createAgent(agent: Agent): Agent {
    this.state.agents.push(agent);
    return agent;
  }

  public updateAgent(id: string, orgId: string, updates: Partial<Agent>): Agent | null {
    const agent = this.getAgentById(id, orgId);
    if (!agent) return null;
    Object.assign(agent, updates, { updated_at: new Date().toISOString() });
    return agent;
  }

  public getAgentExecutions(orgId: string): AgentExecution[] {
    return this.state.agentExecutions.filter((e) => e.organisation_id === orgId);
  }

  public createAgentExecution(exec: AgentExecution): AgentExecution {
    this.state.agentExecutions.unshift(exec);
    return exec;
  }

  public updateAgentExecution(id: string, orgId: string, updates: Partial<AgentExecution>): AgentExecution | null {
    const exec = this.state.agentExecutions.find((e) => e.id === id && e.organisation_id === orgId);
    if (!exec) return null;
    Object.assign(exec, updates);
    return exec;
  }

  // --- Human in the Loop Approvals ---
  public getAgentApprovals(orgId: string): AgentApproval[] {
    return this.state.agentApprovals.filter((a) => a.organisation_id === orgId);
  }

  public getPendingApprovals(orgId: string): AgentApproval[] {
    return this.state.agentApprovals.filter((a) => a.organisation_id === orgId && a.status === "pending");
  }

  public createAgentApproval(appr: AgentApproval): AgentApproval {
    this.state.agentApprovals.unshift(appr);
    return appr;
  }

  public resolveAgentApproval(
    id: string,
    orgId: string,
    status: "approved" | "rejected",
    reviewerId?: string,
    comments?: string
  ): AgentApproval | null {
    const appr = this.state.agentApprovals.find((a) => a.id === id && a.organisation_id === orgId);
    if (!appr) return null;
    appr.status = status;
    appr.reviewed_by = reviewerId;
    appr.reviewed_at = new Date().toISOString();
    appr.comments = comments;
    return appr;
  }

  // --- SARS Compliance ---
  public getComplianceObligations(orgId: string): ComplianceObligation[] {
    return this.state.complianceObligations.filter((c) => c.organisation_id === orgId);
  }

  public updateComplianceObligation(
    id: string,
    orgId: string,
    updates: Partial<ComplianceObligation>
  ): ComplianceObligation | null {
    const comp = this.state.complianceObligations.find((c) => c.id === id && c.organisation_id === orgId);
    if (!comp) return null;
    Object.assign(comp, updates);
    return comp;
  }

  // --- Notifications & Audit ---
  public getNotifications(orgId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.organisation_id === orgId);
  }

  public markNotificationAsRead(id: string, orgId: string): boolean {
    const n = this.state.notifications.find((notif) => notif.id === id && notif.organisation_id === orgId);
    if (!n) return false;
    n.is_read = true;
    return true;
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.state.auditLogs.unshift(log);
    return log;
  }

  public getAuditLogs(orgId: string): AuditLog[] {
    return this.state.auditLogs.filter((a) => a.organisation_id === orgId);
  }

  public getAllAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }
}

// Global singleton instance
const globalForDb = globalThis as unknown as { dbStore?: DatabaseStore };
export const db = globalForDb.dbStore ?? new DatabaseStore();
globalForDb.dbStore = db;
