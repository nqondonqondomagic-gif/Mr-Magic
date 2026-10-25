// ==============================================================================
// BUSINESS MANAGER — INTEGRATION FRAMEWORK & ADAPTER REGISTRY
// MAGIC QUANT TRADING Corp | AI Business Operating System
// ==============================================================================

export interface IntegrationDefinition {
  id: string;
  provider: string;
  name: string;
  category: "payments" | "accounting" | "communication" | "calendar" | "payroll" | "ecommerce";
  description: string;
  authMethod: "api_key" | "oauth2" | "webhook_secret";
  requiredCredentials: { key: string; label: string; placeholder: string; type: "text" | "password" }[];
  capabilities: string[];
  docUrl: string;
}

export const INTEGRATION_REGISTRY: Record<string, IntegrationDefinition> = {
  yoco: {
    id: "yoco",
    provider: "yoco",
    name: "Yoco Payments South Africa",
    category: "payments",
    description: "Accept South African card payments, generate hosted checkout links, and receive automated webhook confirmations.",
    authMethod: "api_key",
    requiredCredentials: [
      { key: "public_key", label: "Yoco Public Key", placeholder: "pk_live_...", type: "text" },
      { key: "secret_key", label: "Yoco Secret Key", placeholder: "sk_live_...", type: "password" },
      { key: "webhook_secret", label: "Webhook Signing Secret", placeholder: "whsec_...", type: "password" },
    ],
    capabilities: ["Hosted card checkout", "Instant EFT", "Real-time payment webhooks", "Automatic subscription activation"],
    docUrl: "https://developer.yoco.com",
  },

  paystack: {
    id: "paystack",
    provider: "paystack",
    name: "Paystack South Africa",
    category: "payments",
    description: "Multi-channel African payments gateway supporting recurring debit orders, Ozow instant EFT, and cards.",
    authMethod: "api_key",
    requiredCredentials: [
      { key: "public_key", label: "Paystack Public Key", placeholder: "pk_live_...", type: "text" },
      { key: "secret_key", label: "Paystack Secret Key", placeholder: "sk_live_...", type: "password" },
    ],
    capabilities: ["Card checkout", "Ozow instant EFT", "Tokenized recurring billing", "Idempotent webhooks"],
    docUrl: "https://paystack.com/docs",
  },

  xero: {
    id: "xero",
    provider: "xero",
    name: "Xero Cloud Accounting",
    category: "accounting",
    description: "Synchronize tax invoices, map chart of accounts, and export customer statements directly to Xero.",
    authMethod: "oauth2",
    requiredCredentials: [
      { key: "client_id", label: "Xero Client ID", placeholder: "Your OAuth2 Client ID", type: "text" },
      { key: "client_secret", label: "Xero Client Secret", placeholder: "Your OAuth2 Secret", type: "password" },
    ],
    capabilities: ["Two-way invoice synchronization", "Chart of accounts mapping", "Payment status updates", "Customer contact sync"],
    docUrl: "https://developer.xero.com",
  },

  sage: {
    id: "sage",
    provider: "sage",
    name: "Sage Business Cloud (South Africa)",
    category: "accounting",
    description: "Connect to Sage South Africa for local ledger accounting, VAT201 matching, and supplier expense reconciliation.",
    authMethod: "api_key",
    requiredCredentials: [
      { key: "api_key", label: "Sage API Key", placeholder: "Sage developer key", type: "password" },
      { key: "company_id", label: "Sage Company ID", placeholder: "Company identifier", type: "text" },
    ],
    capabilities: ["Sage ledger sync", "South African VAT reporting", "Customer balances", "Supplier invoices"],
    docUrl: "https://developer.sage.com",
  },

  whatsapp: {
    id: "whatsapp",
    provider: "whatsapp",
    name: "WhatsApp Business Cloud API",
    category: "communication",
    description: "Send automated payment reminders, meeting links, and customer service updates directly via Meta WhatsApp API.",
    authMethod: "api_key",
    requiredCredentials: [
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "Meta Phone ID", type: "text" },
      { key: "access_token", label: "Permanent Access Token", placeholder: "Bearer EAAG...", type: "password" },
    ],
    capabilities: ["Automated invoice payment reminders", "Appointment confirmations", "Agent support dispatch"],
    docUrl: "https://developers.facebook.com/docs/whatsapp",
  },

  google_calendar: {
    id: "google_calendar",
    provider: "google_calendar",
    name: "Google Calendar & Workspace",
    category: "calendar",
    description: "Bi-directional scheduling sync for executive appointments, client demonstrations, and meeting reminders.",
    authMethod: "oauth2",
    requiredCredentials: [
      { key: "client_id", label: "Google OAuth Client ID", placeholder: "xxx.apps.googleusercontent.com", type: "text" },
      { key: "client_secret", label: "Client Secret", placeholder: "GOCSPX-...", type: "password" },
    ],
    capabilities: ["Real-time appointment sync", "Google Meet link generation", "Executive calendar blocking"],
    docUrl: "https://developers.google.com/calendar",
  },

  simplepay: {
    id: "simplepay",
    provider: "simplepay",
    name: "SimplePay South Africa",
    category: "payroll",
    description: "Specialized South African payroll integration with automated EMP201 payroll tax export and IRP5 certificates.",
    authMethod: "api_key",
    requiredCredentials: [
      { key: "api_key", label: "SimplePay API Key", placeholder: "API Token from SimplePay settings", type: "password" },
    ],
    capabilities: ["South African BCEA leave sync", "Monthly EMP201 tax totals", "IRP5 payroll certificates"],
    docUrl: "https://www.simplepay.co.za/api",
  },
};
