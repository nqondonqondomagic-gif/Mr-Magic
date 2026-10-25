// ==============================================================================
// BUSINESS MANAGER — CORE TYPES
// MAGIC QUANT TRADING Corp | Multi-Tenant AI Business Operating System
// ==============================================================================

export type OrgRole =
  | 'platform_owner'
  | 'business_owner'
  | 'business_admin'
  | 'finance_manager'
  | 'hr_manager'
  | 'staff_member'
  | 'read_only';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'expired'
  | 'trialing';

export type BillingInterval = 'one_time' | 'monthly' | 'annual';

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'void';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AgentCategory =
  | 'executive_assistant'
  | 'sales_agent'
  | 'customer_service'
  | 'finance_assistant'
  | 'hr_assistant'
  | 'operations_agent'
  | 'sars_compliance';

export type AgentStatus = 'idle' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'paused';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type ComplianceTaxType =
  | 'vat201'
  | 'paye_emp201'
  | 'emp501'
  | 'provisional_irp6'
  | 'annual_itr14'
  | 'cipc_annual';

export type ComplianceStatus =
  | 'upcoming'
  | 'in_progress'
  | 'ready_to_file'
  | 'filed'
  | 'overdue';

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  legal_name: string;
  registration_number?: string;
  tax_number?: string;
  vat_number?: string;
  country: string;
  currency: string;
  timezone: string;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  is_platform_admin: boolean;
  created_at: string;
}

export interface OrganisationMember {
  id: string;
  organisation_id: string;
  user_id: string;
  role: OrgRole;
  title?: string;
  department?: string;
  is_active: boolean;
  user?: UserProfile;
  created_at: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cents: number; // In ZAR cents
  currency: string;
  billing_interval: BillingInterval;
  features: string[];
  max_users: number;
  max_agents: number;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  organisation_id: string;
  plan_id: string;
  plan?: Plan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_provider: string;
  external_subscription_id?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  organisation_id: string;
  subscription_id?: string;
  amount_cents: number;
  currency: string;
  status: 'successful' | 'failed' | 'refunded' | 'pending';
  payment_provider: 'yoco' | 'paystack' | 'eft';
  provider_transaction_id?: string;
  provider_payment_method?: string;
  idempotency_key?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Customer {
  id: string;
  organisation_id: string;
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  vat_number?: string;
  credit_limit_cents?: number;
  tags?: string[];
  notes?: string;
  status: 'active' | 'lead' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  organisation_id: string;
  customer_id?: string;
  customer_name?: string;
  title: string;
  value_cents: number;
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number;
  expected_close_date?: string;
  assigned_to?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  tax_rate_percent: number; // 15% standard SA VAT
  total_cents: number;
}

export interface Invoice {
  id: string;
  organisation_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  balance_due_cents: number;
  currency: string;
  items?: InvoiceItem[];
  notes?: string;
  terms?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  organisation_id: string;
  category: string;
  payee: string;
  amount_cents: number;
  tax_cents: number;
  currency: string;
  date: string;
  receipt_url?: string;
  payment_method: string;
  is_vat_claimable: boolean;
  notes?: string;
  created_at: string;
}

export interface Project {
  id: string;
  organisation_id: string;
  customer_id?: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  start_date?: string;
  due_date?: string;
  budget_cents: number;
  progress_percent?: number;
  created_at: string;
}

export interface Task {
  id: string;
  organisation_id: string;
  project_id?: string;
  project_name?: string;
  assigned_to?: string;
  assignee_name?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  is_recurring?: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  organisation_id: string;
  customer_id?: string;
  customer_name?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_link?: string;
  status: 'confirmed' | 'pending' | 'canceled';
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  organisation_id: string;
  folder: string;
  title: string;
  file_path?: string;
  file_size_bytes: number;
  mime_type: string;
  extracted_text?: string;
  summary?: string;
  tags?: string[];
  created_at: string;
}

export interface Employee {
  id: string;
  organisation_id: string;
  first_name: string;
  last_name: string;
  email: string;
  id_or_passport?: string;
  job_title: string;
  department?: string;
  start_date: string;
  salary_cents: number;
  employment_type: 'permanent' | 'contract' | 'intern';
  annual_leave_days: number;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  organisation_id: string;
  employee_id: string;
  employee_name?: string;
  leave_type: 'annual' | 'sick' | 'family_responsibility' | 'maternity' | 'unpaid';
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  created_at: string;
}

export interface Integration {
  id: string;
  organisation_id: string;
  provider: 'yoco' | 'paystack' | 'xero' | 'sage' | 'whatsapp' | 'google_calendar' | 'simplepay';
  category: 'payments' | 'accounting' | 'communication' | 'calendar' | 'payroll';
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending_auth';
  config?: Record<string, any>;
  last_synced_at?: string;
  error_message?: string;
}

export interface Agent {
  id: string;
  organisation_id: string;
  name: string;
  category: AgentCategory;
  description: string;
  system_instructions: string;
  model: string;
  permitted_tools: string[];
  permitted_modules: string[];
  schedule?: string;
  requires_approval_for: string[];
  budget_tokens: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AgentExecution {
  id: string;
  organisation_id: string;
  agent_id: string;
  agent_name?: string;
  trigger_source: string;
  status: AgentStatus;
  started_at: string;
  completed_at?: string;
  total_tokens: number;
  execution_duration_ms: number;
  error_message?: string;
  steps?: AgentExecutionStep[];
  created_at: string;
}

export interface AgentExecutionStep {
  id: string;
  execution_id: string;
  step_number: number;
  tool_name: string;
  tool_input: Record<string, any>;
  tool_output?: Record<string, any>;
  status: 'success' | 'failed' | 'blocked_approval';
  created_at: string;
}

export interface AgentApproval {
  id: string;
  organisation_id: string;
  execution_id: string;
  agent_id: string;
  agent_name?: string;
  action_type: string;
  description: string;
  proposed_payload: Record<string, any>;
  status: ApprovalStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  comments?: string;
  expires_at: string;
  created_at: string;
}

export interface ComplianceObligation {
  id: string;
  organisation_id: string;
  tax_type: ComplianceTaxType;
  title: string;
  period_label: string;
  period_start: string;
  period_end: string;
  due_date: string;
  status: ComplianceStatus;
  prepared_by?: string;
  filed_at?: string;
  reference_number?: string;
  calculated_tax_cents: number;
  workpaper_data?: Record<string, any>;
  checklist?: { item: string; done: boolean; note?: string }[];
  created_at: string;
}

export interface NotificationItem {
  id: string;
  organisation_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'approval_required';
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organisation_id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}
