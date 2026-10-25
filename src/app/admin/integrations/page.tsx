"use client";

import { useState } from "react";
import {
  Activity,
  CreditCard,
  Calendar,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function AdminIntegrationsPage() {
  const [filterQuery, setFilterQuery] = useState("");

  const integrationServices = [
    {
      id: "yoco",
      name: "Yoco Payments Ingress",
      category: "Fintech Gateway",
      icon: CreditCard,
      status: "Operational",
      uptime: "99.98%",
      avgResponse: "142ms",
      webhookUrl: "https://businessmanager.co.za/api/webhooks/yoco",
      authMethod: "HMAC-SHA256 Secret Signature",
      activeTenants: 14,
    },
    {
      id: "paystack",
      name: "Paystack Payments Ingress",
      category: "Fintech Gateway",
      icon: CreditCard,
      status: "Operational",
      uptime: "99.95%",
      avgResponse: "165ms",
      webhookUrl: "https://businessmanager.co.za/api/webhooks/paystack",
      authMethod: "HMAC-SHA512 Webhook Signature",
      activeTenants: 9,
    },
    {
      id: "google_calendar",
      name: "Google Calendar & Meet",
      category: "Calendar & Video",
      icon: Calendar,
      status: "Operational",
      uptime: "99.99%",
      avgResponse: "115ms",
      webhookUrl: "https://businessmanager.co.za/api/integrations/google/callback",
      authMethod: "OAuth 2.0 PKCE with Refresh Tokens",
      activeTenants: 18,
    },
    {
      id: "xero",
      name: "Xero Accounting Sync",
      category: "ERP & Ledger",
      icon: FileSpreadsheet,
      status: "Operational",
      uptime: "99.92%",
      avgResponse: "290ms",
      webhookUrl: "https://businessmanager.co.za/api/integrations/xero/sync",
      authMethod: "OAuth 2.0 App Partner",
      activeTenants: 7,
    },
    {
      id: "sage",
      name: "Sage Business Cloud",
      category: "ERP & Ledger",
      icon: FileSpreadsheet,
      status: "Operational",
      uptime: "99.90%",
      avgResponse: "310ms",
      webhookUrl: "https://businessmanager.co.za/api/integrations/sage/sync",
      authMethod: "OAuth 2.0 API Key",
      activeTenants: 5,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Cloud Business API",
      category: "Messaging & Outreach",
      icon: MessageSquare,
      status: "Operational",
      uptime: "99.96%",
      avgResponse: "95ms",
      webhookUrl: "https://businessmanager.co.za/api/webhooks/whatsapp",
      authMethod: "Meta System User Token + Webhook Secret",
      activeTenants: 12,
    },
  ];

  const recentWebhookLogs = [
    {
      id: "evt_yoco_90182",
      provider: "Yoco",
      event: "payment.succeeded",
      status: "verified",
      statusCode: 200,
      timestamp: "2 mins ago",
      tenant: "Apex Solutions (Pty) Ltd",
      payloadSize: "1.4 KB",
    },
    {
      id: "evt_paystack_38102",
      provider: "Paystack",
      event: "charge.success",
      status: "verified",
      statusCode: 200,
      timestamp: "18 mins ago",
      tenant: "Coastal Tech Ventures",
      payloadSize: "2.1 KB",
    },
    {
      id: "evt_gcal_10928",
      provider: "Google Calendar",
      event: "event.created",
      status: "verified",
      statusCode: 200,
      timestamp: "45 mins ago",
      tenant: "Apex Solutions (Pty) Ltd",
      payloadSize: "0.8 KB",
    },
    {
      id: "evt_yoco_90181",
      provider: "Yoco",
      event: "payment.duplicate_prevented",
      status: "idempotent_skip",
      statusCode: 200,
      timestamp: "1 hour ago",
      tenant: "Apex Solutions (Pty) Ltd",
      payloadSize: "1.4 KB",
    },
    {
      id: "evt_wa_55219",
      provider: "WhatsApp Cloud",
      event: "messages.status",
      status: "verified",
      statusCode: 200,
      timestamp: "2 hours ago",
      tenant: "Coastal Tech Ventures",
      payloadSize: "0.6 KB",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-quant-400" />
            Integrations & Webhook Ingress Monitoring
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status of payment gateways, ERP connections, calendar syncs, and webhook verification trails.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All 6 Pipelines Operational
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrationServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-quant-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {service.status}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-white">{service.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{service.category}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Uptime (30d):</span>
                    <strong className="text-slate-200">{service.uptime}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Avg Ingress Latency:</span>
                    <strong className="text-slate-200">{service.avgResponse}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Active Tenant Links:</span>
                    <strong className="text-quant-400">{service.activeTenants} Orgs</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono truncate">
                {service.authMethod}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Webhook Ingress Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cryptographic Ingress Webhook Audit Stream
            </h3>
            <p className="text-xs text-slate-400">
              Live inspection of signed payloads with HMAC-SHA256/512 signature validation and idempotency handling.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total 24h: 1,294 Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Event ID</th>
                <th className="px-6 py-3">Gateway</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Tenant Organisation</th>
                <th className="px-6 py-3">Cryptographic Signature</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {recentWebhookLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-3.5 text-quant-300 font-bold">{log.id}</td>
                  <td className="px-6 py-3.5 font-sans font-medium text-white">{log.provider}</td>
                  <td className="px-6 py-3.5 text-slate-300">{log.event}</td>
                  <td className="px-6 py-3.5 font-sans text-slate-300">{log.tenant}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      HMAC Validated
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {log.status === "verified" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        HTTP 200 OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                        Idempotent Skip
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 font-sans">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
