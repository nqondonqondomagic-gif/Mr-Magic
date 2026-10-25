-- ==============================================================================
-- BUSINESS MANAGER — SCHEMA MIGRATION 20261024000000
-- MAGIC QUANT TRADING Corp | Multi-Tenant AI Business Operating System
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles
CREATE TYPE org_role AS ENUM (
  'platform_owner',
  'business_owner',
  'business_admin',
  'finance_manager',
  'hr_manager',
  'staff_member',
  'read_only'
);

-- Subscription Status
CREATE TYPE subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'expired',
  'trialing'
);

CREATE TYPE billing_interval AS ENUM (
  'one_time',
  'monthly',
  'annual'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'issued',
  'paid',
  'partially_paid',
  'overdue',
  'void'
);

CREATE TYPE task_status AS ENUM (
  'todo',
  'in_progress',
  'in_review',
  'completed',
  'blocked'
);

CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE agent_category AS ENUM (
  'executive_assistant',
  'sales_agent',
  'customer_service',
  'finance_assistant',
  'hr_assistant',
  'operations_agent',
  'sars_compliance'
);

CREATE TYPE approval_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE compliance_tax_type AS ENUM (
  'vat201',
  'paye_emp201',
  'emp501',
  'provisional_irp6',
  'annual_itr14',
  'cipc_annual'
);

CREATE TYPE compliance_status AS ENUM (
  'upcoming',
  'in_progress',
  'ready_to_file',
  'filed',
  'overdue'
);

-- 1. ORGANISATIONS (Tenants)
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  legal_name TEXT,
  registration_number TEXT,
  tax_number TEXT,
  vat_number TEXT,
  country TEXT DEFAULT 'ZA',
  currency TEXT DEFAULT 'ZAR',
  timezone TEXT DEFAULT 'Africa/Johannesburg',
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  is_platform_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANISATION MEMBERSHIP & RBAC
CREATE TABLE organisation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'staff_member',
  title TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, user_id)
);

-- 4. PLANS & PRICING
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents BIGINT NOT NULL, -- in ZAR cents (e.g. 49900 = R499.00)
  currency TEXT DEFAULT 'ZAR',
  billing_interval billing_interval NOT NULL DEFAULT 'one_time',
  features JSONB DEFAULT '[]'::jsonb,
  max_users INT DEFAULT 1,
  max_agents INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_provider TEXT DEFAULT 'yoco',
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS & TRANSACTIONS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount_cents BIGINT NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  status TEXT NOT NULL, -- 'successful', 'failed', 'refunded', 'pending'
  payment_provider TEXT NOT NULL, -- 'yoco', 'paystack', 'eft'
  provider_transaction_id TEXT,
  provider_payment_method TEXT,
  idempotency_key TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMERS & CRM
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  vat_number TEXT,
  credit_limit_cents BIGINT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTACTS
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DEALS & PIPELINE
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value_cents BIGINT NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'lead', -- 'lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'
  probability INT DEFAULT 20,
  expected_close_date DATE,
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVOICES
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_number TEXT NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal_cents BIGINT NOT NULL DEFAULT 0,
  tax_cents BIGINT NOT NULL DEFAULT 0, -- 15% SA VAT standard
  total_cents BIGINT NOT NULL DEFAULT 0,
  balance_due_cents BIGINT NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  notes TEXT,
  terms TEXT DEFAULT 'Payment due within 30 days. EFT to banking details on statement.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, invoice_number)
);

-- 11. INVOICE ITEMS
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price_cents BIGINT NOT NULL,
  tax_rate_percent NUMERIC(5, 2) DEFAULT 15.00,
  total_cents BIGINT NOT NULL
);

-- 12. EXPENSES
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  payee TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  tax_cents BIGINT NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  date DATE NOT NULL,
  receipt_url TEXT,
  payment_method TEXT DEFAULT 'credit_card',
  is_vat_claimable BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PROJECTS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  due_date DATE,
  budget_cents BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. APPOINTMENTS & CALENDAR
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DOCUMENTS & KNOWLEDGE BASE
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  folder TEXT DEFAULT 'General',
  title TEXT NOT NULL,
  file_path TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  mime_type TEXT,
  extracted_text TEXT,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. EMPLOYEES & HR
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  id_or_passport TEXT,
  job_title TEXT NOT NULL,
  department TEXT,
  start_date DATE NOT NULL,
  salary_cents BIGINT DEFAULT 0,
  employment_type TEXT DEFAULT 'permanent', -- 'permanent', 'contract', 'intern'
  annual_leave_days INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. LEAVE REQUESTS
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL, -- 'annual', 'sick', 'family_responsibility', 'maternity', 'unpaid'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days NUMERIC(4, 1) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. INTEGRATIONS
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'yoco', 'paystack', 'xero', 'sage', 'whatsapp', 'google_calendar', 'simplepay'
  category TEXT NOT NULL, -- 'payments', 'accounting', 'communication', 'calendar', 'payroll'
  status TEXT NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'pending'
  config JSONB DEFAULT '{}'::jsonb,
  credentials_encrypted TEXT,
  last_synced_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, provider)
);

-- 20. AGENTS (AI Agent Orchestration)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category agent_category NOT NULL,
  description TEXT,
  system_instructions TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4o',
  permitted_tools TEXT[] DEFAULT '{}',
  permitted_modules TEXT[] DEFAULT '{}',
  schedule TEXT, -- e.g. '0 8 * * 1-5' for daily 8am
  requires_approval_for TEXT[] DEFAULT '{}', -- tools that require human gatekeeper
  budget_tokens INT DEFAULT 10000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AGENT EXECUTIONS
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  trigger_source TEXT NOT NULL, -- 'manual', 'schedule', 'webhook', 'user_prompt'
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed', 'waiting_approval', 'paused'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_tokens INT DEFAULT 0,
  execution_duration_ms INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AGENT EXECUTION STEPS
CREATE TABLE agent_execution_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_input JSONB DEFAULT '{}'::jsonb,
  tool_output JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL, -- 'success', 'failed', 'blocked_approval'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. AGENT APPROVALS (Human in the Loop)
CREATE TABLE agent_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'send_invoice', 'modify_customer', 'send_external_email', 'approve_leave'
  description TEXT NOT NULL,
  proposed_payload JSONB NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  comments TEXT,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. SARS COMPLIANCE OBLIGATIONS
CREATE TABLE compliance_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tax_type compliance_tax_type NOT NULL,
  period_label TEXT NOT NULL, -- e.g. '2026/08 VAT Period', '2026/02 2nd Provisional'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  status compliance_status NOT NULL DEFAULT 'upcoming',
  prepared_by UUID REFERENCES user_profiles(id),
  filed_at TIMESTAMPTZ,
  reference_number TEXT,
  calculated_tax_cents BIGINT DEFAULT 0,
  workpaper_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'approval_required'
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- POSTGRESQL ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policy Pattern using current_setting
-- Tenant isolation ensures that organisation_id matches session context
CREATE POLICY org_isolation_customers ON customers
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

CREATE POLICY org_isolation_invoices ON invoices
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

CREATE POLICY org_isolation_deals ON deals
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

CREATE POLICY org_isolation_tasks ON tasks
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

CREATE POLICY org_isolation_agents ON agents
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

CREATE POLICY org_isolation_compliance ON compliance_obligations
  FOR ALL USING (
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::uuid
  );

-- SEED DEFAULT SYSTEM PLANS
INSERT INTO plans (code, name, description, price_cents, currency, billing_interval, features, max_users, max_agents) VALUES
(
  'starter_month',
  'Starter — 1 Month Access',
  'Get organised fast. Full access for one month. Non-renewing single purchase.',
  49900,
  'ZAR',
  'one_time',
  '["1 User License", "Core Business Modules (CRM, Invoicing, Tasks)", "1 Active AI Agent (Executive Assistant)", "Basic Integrations (Email, Calendar, Yoco)", "SARS Compliance & eFiling Assistance", "Email Support", "Non-renewing one-time access"]'::jsonb,
  1,
  1
),
(
  'business_monthly',
  'Business Manager — Monthly',
  'Automatic monthly recurring billing for growing teams with multi-agent orchestration.',
  129900,
  'ZAR',
  'monthly',
  '["Up to 5 Users", "All Core Business Modules", "All 7 Specialized AI Agents", "Visual Agent Builder & Custom Tools", "Unlimited Integrations (Xero, Sage, WhatsApp, Yoco)", "Advanced SARS eFiling Workpapers & EMP501", "Priority WhatsApp & Email Support", "Continuous monthly updates"]'::jsonb,
  5,
  7
) ON CONFLICT (code) DO NOTHING;
