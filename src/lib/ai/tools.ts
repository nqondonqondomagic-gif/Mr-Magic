// ==============================================================================
// BUSINESS MANAGER — AI AGENT TOOL REGISTRY & SERVER-SIDE VALIDATION
// MAGIC QUANT TRADING Corp | AI Business Operating System
// ==============================================================================

import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export interface ToolDefinition {
  name: string;
  description: string;
  module: string;
  isSensitive: boolean; // True requires human approval before write
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  handler: (args: Record<string, any>, context: { orgId: string; agentId: string; executionId: string }) => Promise<any>;
}

export const BUSINESS_TOOLS: Record<string, ToolDefinition> = {
  // --- CRM & Sales Tools ---
  list_customers: {
    name: "list_customers",
    description: "Retrieve active customers, contact details, and credit status for the business.",
    module: "crm",
    isSensitive: false,
    parameters: {
      status: { type: "string", description: "Filter by status: 'active', 'lead', 'all'" },
    },
    handler: async (args, context) => {
      const customers = db.getCustomers(context.orgId);
      return customers.map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company_name,
        email: c.email,
        phone: c.phone,
        status: c.status,
      }));
    },
  },

  list_deals: {
    name: "list_deals",
    description: "Retrieve sales pipeline opportunities, deal values, and closing probabilities.",
    module: "sales",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const deals = db.getDeals(context.orgId);
      return deals.map((d) => ({
        id: d.id,
        title: d.title,
        customer: d.customer_name,
        value: formatZAR(d.value_cents),
        stage: d.stage,
        probability: `${d.probability}%`,
        close_date: d.expected_close_date,
      }));
    },
  },

  draft_customer_email: {
    name: "draft_customer_email",
    description: "Draft an external communication or proposal to a customer. Requires Human Approval.",
    module: "crm",
    isSensitive: true,
    parameters: {
      recipient: { type: "string", description: "Customer email address", required: true },
      subject: { type: "string", description: "Email subject line", required: true },
      body: { type: "string", description: "Email content", required: true },
    },
    handler: async (args, context) => {
      // Sensitive: returns staged payload for approval
      return {
        action: "send_customer_email",
        recipient: args.recipient,
        subject: args.subject,
        body: args.body,
        status: "staged_for_approval",
      };
    },
  },

  // --- Finance & Invoicing Tools ---
  list_invoices: {
    name: "list_invoices",
    description: "Fetch invoices with payment status, balances due, and issue/due dates.",
    module: "invoices",
    isSensitive: false,
    parameters: {
      status: { type: "string", description: "'paid', 'issued', 'overdue', 'all'" },
    },
    handler: async (args, context) => {
      const invoices = db.getInvoices(context.orgId);
      return invoices.map((i) => ({
        invoice_number: i.invoice_number,
        customer: i.customer_name,
        total: formatZAR(i.total_cents),
        balance_due: formatZAR(i.balance_due_cents),
        status: i.status,
        due_date: i.due_date,
      }));
    },
  },

  check_receivables_ageing: {
    name: "check_receivables_ageing",
    description: "Identify debtors with overdue balances past standard payment terms (30 days).",
    module: "invoices",
    isSensitive: false,
    parameters: {
      threshold_days: { type: "number", description: "Days past due (default 0)" },
    },
    handler: async (args, context) => {
      const invoices = db.getInvoices(context.orgId);
      const overdue = invoices.filter((i) => i.status === "overdue" || (i.balance_due_cents > 0 && new Date(i.due_date) < new Date()));
      const totalOverdueCents = overdue.reduce((sum, i) => sum + i.balance_due_cents, 0);

      return {
        overdue_count: overdue.length,
        total_overdue_formatted: formatZAR(totalOverdueCents),
        invoices: overdue.map((i) => ({
          invoice_number: i.invoice_number,
          customer: i.customer_name,
          balance_due: formatZAR(i.balance_due_cents),
          due_date: i.due_date,
        })),
      };
    },
  },

  stage_invoice_reminder: {
    name: "stage_invoice_reminder",
    description: "Stage an overdue statement and payment reminder to a debtor. Requires Human Approval.",
    module: "invoices",
    isSensitive: true,
    parameters: {
      invoice_number: { type: "string", description: "Invoice number (e.g. INV-2026-003)", required: true },
      recipient: { type: "string", description: "Debtor email", required: true },
    },
    handler: async (args, context) => {
      return {
        action: "send_overdue_statement",
        invoice_number: args.invoice_number,
        recipient: args.recipient,
        requires_approval: true,
      };
    },
  },

  // --- Task & Operations Tools ---
  list_tasks: {
    name: "list_tasks",
    description: "Fetch business tasks, priorities, assignees, and deadlines.",
    module: "tasks",
    isSensitive: false,
    parameters: {
      status: { type: "string", description: "'todo', 'in_progress', 'completed', 'all'" },
    },
    handler: async (args, context) => {
      const tasks = db.getTasks(context.orgId);
      return tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        due_date: t.due_date,
        assignee: t.assignee_name,
      }));
    },
  },

  create_task: {
    name: "create_task",
    description: "Create a new operational task in the project workspace.",
    module: "tasks",
    isSensitive: false,
    parameters: {
      title: { type: "string", description: "Task title", required: true },
      description: { type: "string", description: "Detailed task instructions" },
      priority: { type: "string", description: "'low', 'medium', 'high', 'urgent'" },
      due_date: { type: "string", description: "YYYY-MM-DD" },
    },
    handler: async (args, context) => {
      const task = db.createTask({
        id: `task-${Date.now()}`,
        organisation_id: context.orgId,
        title: args.title,
        description: args.description || "",
        status: "todo",
        priority: (args.priority as any) || "medium",
        due_date: args.due_date,
        created_at: new Date().toISOString(),
      });
      return { task_id: task.id, title: task.title, status: "created" };
    },
  },

  list_appointments: {
    name: "list_appointments",
    description: "Get upcoming calendar appointments and meetings.",
    module: "calendar",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const apts = db.getAppointments(context.orgId);
      return apts.map((a) => ({
        id: a.id,
        title: a.title,
        customer: a.customer_name,
        start: a.start_time,
        location: a.location,
        status: a.status,
      }));
    },
  },

  // --- SARS Compliance Tools ---
  calculate_vat201_workpaper: {
    name: "calculate_vat201_workpaper",
    description: "Calculate standard South African VAT201 figures (15% Output VAT on taxable turnover minus 15% Input VAT on allowable expenses).",
    module: "compliance",
    isSensitive: false,
    parameters: {
      period: { type: "string", description: "VAT period, e.g. '2026/09'" },
    },
    handler: async (args, context) => {
      const invoices = db.getInvoices(context.orgId);
      const expenses = db.getExpenses(context.orgId);

      // Output VAT from sales invoices
      const totalSalesCents = invoices.reduce((sum, i) => sum + i.subtotal_cents, 0);
      const outputVatCents = Math.round(totalSalesCents * 0.15);

      // Input VAT from claimable business expenses
      const claimableExpenses = expenses.filter((e) => e.is_vat_claimable);
      const totalPurchasesCents = claimableExpenses.reduce((sum, e) => sum + e.amount_cents, 0);
      const inputVatCents = claimableExpenses.reduce((sum, e) => sum + e.tax_cents, 0);

      const netPayableCents = outputVatCents - inputVatCents;

      return {
        period: args.period || "Current",
        standard_rated_supplies_zar: formatZAR(totalSalesCents),
        output_vat_zar: formatZAR(outputVatCents),
        input_vat_deductions_zar: formatZAR(inputVatCents),
        net_vat_payable_zar: formatZAR(netPayableCents),
        net_payable_cents: netPayableCents,
        invoices_included: invoices.length,
        claimable_expenses_included: claimableExpenses.length,
        disclaimer: "Draft calculation workpaper for SARS eFiling submission. Not formal tax advice.",
      };
    },
  },

  check_sars_deadlines: {
    name: "check_sars_deadlines",
    description: "Inspect upcoming South African statutory tax deadlines (VAT201, EMP201, Provisional IRP6, CIPC).",
    module: "compliance",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const obligations = db.getComplianceObligations(context.orgId);
      return obligations.map((o) => ({
        tax_type: o.tax_type,
        title: o.title,
        period: o.period_label,
        due_date: o.due_date,
        status: o.status,
        calculated_liability: formatZAR(o.calculated_tax_cents),
      }));
    },
  },

  // --- Document & Knowledge Base Tools ---
  search_knowledge_base: {
    name: "search_knowledge_base",
    description: "Search corporate documents, policies, contracts, and company guidelines.",
    module: "documents",
    isSensitive: false,
    parameters: {
      query: { type: "string", description: "Search query", required: true },
    },
    handler: async (args, context) => {
      const docs = db.getDocuments(context.orgId);
      const query = (args.query || "").toLowerCase();
      const matched = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          (d.summary && d.summary.toLowerCase().includes(query)) ||
          (d.extracted_text && d.extracted_text.toLowerCase().includes(query))
      );
      return matched.map((d) => ({
        title: d.title,
        folder: d.folder,
        summary: d.summary,
      }));
    },
  },
};
