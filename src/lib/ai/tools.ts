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
      const filtered =
        args.status && args.status !== "all"
          ? customers.filter((c) => c.status === args.status)
          : customers;
      return filtered.map((c) => ({
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

  update_deal_stage: {
    name: "update_deal_stage",
    description: "Advance or update a deal stage in the sales pipeline. Requires Human Approval.",
    module: "sales",
    isSensitive: true,
    parameters: {
      deal_id: { type: "string", description: "Deal ID", required: true },
      stage: { type: "string", description: "Target stage (e.g. 'proposal', 'negotiation', 'won')", required: true },
    },
    handler: async (args, context) => {
      const updated = db.updateDealStage(args.deal_id, context.orgId, args.stage);
      return {
        action: "update_deal_stage",
        deal_id: args.deal_id,
        new_stage: args.stage,
        updated: Boolean(updated),
      };
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
      return {
        action: "send_customer_email",
        recipient: args.recipient,
        subject: args.subject,
        body: args.body,
        status: "dispatched",
      };
    },
  },

  // --- Finance & Invoicing Tools ---
  get_financial_summary: {
    name: "get_financial_summary",
    description: "Summarize total revenue, outstanding receivables, and monthly operating expenses.",
    module: "reports",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const invoices = db.getInvoices(context.orgId);
      const expenses = db.getExpenses(context.orgId);

      const totalBilledCents = invoices.reduce((sum, i) => sum + i.total_cents, 0);
      const totalOutstandingCents = invoices.reduce((sum, i) => sum + i.balance_due_cents, 0);
      const totalExpensesCents = expenses.reduce((sum, e) => sum + e.amount_cents, 0);

      return {
        total_billed: formatZAR(totalBilledCents),
        outstanding_receivables: formatZAR(totalOutstandingCents),
        total_expenses: formatZAR(totalExpensesCents),
        net_cash_position: formatZAR(totalBilledCents - totalOutstandingCents - totalExpensesCents),
        invoice_count: invoices.length,
        expense_count: expenses.length,
      };
    },
  },

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
      const filtered =
        args.status && args.status !== "all"
          ? invoices.filter((i) => i.status === args.status)
          : invoices;
      return filtered.map((i) => ({
        invoice_number: i.invoice_number,
        customer: i.customer_name,
        total: formatZAR(i.total_cents),
        balance_due: formatZAR(i.balance_due_cents),
        status: i.status,
        due_date: i.due_date,
      }));
    },
  },

  list_expenses: {
    name: "list_expenses",
    description: "Retrieve recorded business expenses, categories, and claimable Input VAT.",
    module: "expenses",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const expenses = db.getExpenses(context.orgId);
      return expenses.map((e) => ({
        id: e.id,
        category: e.category,
        payee: e.payee,
        amount: formatZAR(e.amount_cents),
        input_vat: formatZAR(e.tax_cents),
        date: e.date,
        is_vat_claimable: e.is_vat_claimable,
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
      const overdue = invoices.filter(
        (i) => i.status === "overdue" || (i.balance_due_cents > 0 && new Date(i.due_date) < new Date())
      );
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
        status: "dispatched",
      };
    },
  },

  issue_tax_invoice: {
    name: "issue_tax_invoice",
    description: "Issue a formal SARS Section 20(4) compliant tax invoice to a customer. Requires Human Approval.",
    module: "invoices",
    isSensitive: true,
    parameters: {
      customer_id: { type: "string", description: "Customer ID", required: true },
      description: { type: "string", description: "Line item description", required: true },
      subtotal_cents: { type: "number", description: "Subtotal in cents (excl. VAT)", required: true },
    },
    handler: async (args, context) => {
      return {
        action: "issue_tax_invoice",
        customer_id: args.customer_id,
        description: args.description,
        subtotal_formatted: formatZAR(args.subtotal_cents || 0),
        status: "issued",
      };
    },
  },

  // --- Task, Project & Operations Tools ---
  list_projects: {
    name: "list_projects",
    description: "Fetch active client and internal projects, budgets, and milestone completion percentages.",
    module: "projects",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const projects = db.getProjects(context.orgId);
      return projects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        due_date: p.due_date,
        budget: formatZAR(p.budget_cents || 0),
        progress_percent: `${p.progress_percent ?? 0}%`,
      }));
    },
  },

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
      const filtered =
        args.status && args.status !== "all"
          ? tasks.filter((t) => t.status === args.status)
          : tasks;
      return filtered.map((t) => ({
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

  reschedule_task: {
    name: "reschedule_task",
    description: "Update the due date or priority of an operational task. Requires Human Approval.",
    module: "tasks",
    isSensitive: true,
    parameters: {
      task_id: { type: "string", description: "Task ID", required: true },
      new_due_date: { type: "string", description: "YYYY-MM-DD", required: true },
    },
    handler: async (args, context) => {
      return {
        action: "reschedule_task",
        task_id: args.task_id,
        new_due_date: args.new_due_date,
        status: "rescheduled",
      };
    },
  },

  generate_operational_report: {
    name: "generate_operational_report",
    description: "Generate an operational velocity and bottleneck report across active projects and tasks.",
    module: "reports",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const projects = db.getProjects(context.orgId);
      const tasks = db.getTasks(context.orgId);
      const openTasks = tasks.filter((t) => t.status !== "completed");
      const urgentTasks = openTasks.filter((t) => t.priority === "urgent" || t.priority === "high");

      return {
        active_projects_count: projects.filter((p) => p.status === "active").length,
        average_project_completion:
          projects.length > 0
            ? `${Math.round(projects.reduce((s, p) => s + (p.progress_percent || 0), 0) / projects.length)}%`
            : "0%",
        open_tasks_count: openTasks.length,
        high_priority_bottlenecks: urgentTasks.map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          due_date: t.due_date,
          assignee: t.assignee_name,
        })),
      };
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

  // --- Customer Service & Knowledge Base Tools ---
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
      const matched = query
        ? docs.filter(
            (d) =>
              d.title.toLowerCase().includes(query) ||
              (d.summary && d.summary.toLowerCase().includes(query)) ||
              (d.extracted_text && d.extracted_text.toLowerCase().includes(query))
          )
        : docs;
      const results = matched.length > 0 ? matched : docs;
      return results.map((d) => ({
        title: d.title,
        folder: d.folder,
        summary: d.summary,
      }));
    },
  },

  create_support_task: {
    name: "create_support_task",
    description: "Create a customer support follow-up ticket in the task queue.",
    module: "tasks",
    isSensitive: false,
    parameters: {
      title: { type: "string", description: "Support ticket summary", required: true },
      priority: { type: "string", description: "'low', 'medium', 'high', 'urgent'" },
    },
    handler: async (args, context) => {
      const task = db.createTask({
        id: `task-sup-${Date.now()}`,
        organisation_id: context.orgId,
        title: args.title || "Customer Support Follow-up",
        description: args.description || "Escalated by Customer Service Agent for review.",
        status: "todo",
        priority: (args.priority as any) || "medium",
        due_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        assignee_name: "Sipho Ndlovu",
        created_at: new Date().toISOString(),
      });
      return { support_task_id: task.id, title: task.title, status: "logged" };
    },
  },

  send_client_message: {
    name: "send_client_message",
    description: "Send an external support response to a client. Requires Human Approval.",
    module: "crm",
    isSensitive: true,
    parameters: {
      recipient: { type: "string", description: "Client email", required: true },
      message: { type: "string", description: "Support response body", required: true },
    },
    handler: async (args, context) => {
      return {
        action: "send_client_message",
        recipient: args.recipient,
        message: args.message,
        status: "sent",
      };
    },
  },

  // --- HR & People Tools ---
  list_employees: {
    name: "list_employees",
    description: "Retrieve active employee directory, roles, departments, and BCEA annual leave entitlements.",
    module: "hr",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const employees = db.getEmployees(context.orgId);
      return employees.map((e) => ({
        id: e.id,
        name: `${e.first_name} ${e.last_name}`,
        job_title: e.job_title,
        department: e.department,
        employment_type: e.employment_type,
        annual_leave_days: e.annual_leave_days,
      }));
    },
  },

  list_leave_requests: {
    name: "list_leave_requests",
    description: "List employee leave applications and their approval status.",
    module: "hr",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const requests = db.getLeaveRequests(context.orgId);
      return requests.map((l) => ({
        id: l.id,
        employee: l.employee_name,
        leave_type: l.leave_type,
        start_date: l.start_date,
        end_date: l.end_date,
        total_days: l.total_days,
        status: l.status,
        reason: l.reason,
      }));
    },
  },

  draft_job_spec: {
    name: "draft_job_spec",
    description: "Draft a BCEA-compliant role specification and onboarding checklist.",
    module: "hr",
    isSensitive: false,
    parameters: {
      role_title: { type: "string", description: "Target job title", required: true },
      department: { type: "string", description: "Department name" },
    },
    handler: async (args, context) => {
      return {
        role_title: args.role_title || "Senior Full-Stack Engineer",
        department: args.department || "Engineering",
        bcea_compliant: true,
        onboarding_checklist: [
          "Verify SA ID / Passport & SARS Income Tax Reference Number",
          "Collect UIF UI-19 declaration & banking verification",
          "Sign POPIA data protection & IP assignment addendum",
        ],
      };
    },
  },

  approve_leave_request: {
    name: "approve_leave_request",
    description: "Approve or reject an employee leave application. Requires Human Approval.",
    module: "hr",
    isSensitive: true,
    parameters: {
      leave_id: { type: "string", description: "Leave Request ID", required: true },
      decision: { type: "string", description: "'approved' or 'rejected'", required: true },
    },
    handler: async (args, context) => {
      const updated = db.updateLeaveStatus(
        args.leave_id,
        context.orgId,
        args.decision === "rejected" ? "rejected" : "approved"
      );
      return {
        action: "approve_leave_request",
        leave_id: args.leave_id,
        status: updated?.status || args.decision,
      };
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

  verify_tax_invoices: {
    name: "verify_tax_invoices",
    description: "Audit sales invoices and supplier expenses for Section 20(4) South African VAT Act compliance.",
    module: "compliance",
    isSensitive: false,
    parameters: {},
    handler: async (args, context) => {
      const invoices = db.getInvoices(context.orgId);
      const customers = db.getCustomers(context.orgId);

      const audited = invoices.map((inv) => {
        const cust = customers.find((c) => c.id === inv.customer_id);
        const hasVatNumber = Boolean(cust?.vat_number);
        return {
          invoice_number: inv.invoice_number,
          customer: inv.customer_name,
          customer_vat_number: cust?.vat_number || "Missing",
          section_20_4_compliant: hasVatNumber,
          tax_amount: formatZAR(inv.tax_cents),
        };
      });

      return {
        total_audited: audited.length,
        compliant_count: audited.filter((a) => a.section_20_4_compliant).length,
        invoices: audited,
      };
    },
  },

  export_efiling_pack: {
    name: "export_efiling_pack",
    description: "Export final SARS eFiling workpaper pack for submission. Requires Human Approval.",
    module: "compliance",
    isSensitive: true,
    parameters: {
      period: { type: "string", description: "Tax period (e.g. '2026/09')", required: true },
      tax_type: { type: "string", description: "'vat201' or 'paye_emp201'", required: true },
    },
    handler: async (args, context) => {
      return {
        action: "export_efiling_pack",
        period: args.period,
        tax_type: args.tax_type,
        status: "exported",
      };
    },
  },
};
