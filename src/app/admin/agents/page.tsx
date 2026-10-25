"use client";

import { useState } from "react";
import {
  Bot,
  Cpu,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AdminAgentsPage() {
  const [activeModel, setActiveModel] = useState("anthropic/claude-3-5-sonnet");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [savedNotice, setSavedNotice] = useState(false);

  const modelOptions = [
    {
      id: "anthropic/claude-3-5-sonnet",
      name: "Anthropic Claude 3.5 Sonnet",
      provider: "Anthropic API",
      status: "Recommended (Default)",
      latency: "340ms",
      costPer1k: "R 0.054",
      description: "State-of-the-art reasoning for complex legal, tax, and multi-step planning tasks.",
    },
    {
      id: "openai/gpt-4o",
      name: "OpenAI GPT-4o",
      provider: "OpenAI Platform",
      status: "Available",
      latency: "290ms",
      costPer1k: "R 0.045",
      description: "High speed multimodal model optimized for fast document extraction and CRM tools.",
    },
    {
      id: "google/gemini-2.0-flash",
      name: "Google Gemini 2.0 Flash",
      provider: "Google Cloud Vertex AI",
      status: "Available",
      latency: "180ms",
      costPer1k: "R 0.018",
      description: "Ultra-low latency inference for live conversational assistant and calendar booking.",
    },
  ];

  const agentWorkloads = [
    { name: "Executive Assistant", calls24h: 1842, tokens24h: "4.8M", avgLatency: "380ms", status: "Healthy" },
    { name: "Sales & Pipeline Agent", calls24h: 3120, tokens24h: "6.2M", avgLatency: "295ms", status: "Healthy" },
    { name: "Customer Service Agent", calls24h: 4890, tokens24h: "8.1M", avgLatency: "210ms", status: "Healthy" },
    { name: "Finance & Invoicing Assistant", calls24h: 1205, tokens24h: "3.4M", avgLatency: "410ms", status: "Healthy" },
    { name: "HR & People Assistant", calls24h: 640, tokens24h: "1.1M", avgLatency: "310ms", status: "Healthy" },
    { name: "Operations & Tasks Agent", calls24h: 2450, tokens24h: "5.0M", avgLatency: "340ms", status: "Healthy" },
    { name: "SARS Compliance Assistant", calls24h: 910, tokens24h: "3.9M", avgLatency: "520ms", status: "Healthy" },
  ];

  const handleSaveConfig = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-quant-400" />
            AI Models & Agent Token Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global LLM routing, token rate limits, and multi-tenant agent performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveConfig}
            className="inline-flex items-center gap-2 px-4 py-2 bg-quant-600 hover:bg-quant-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Save Routing Rules
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>LLM routing configuration saved successfully and propagated to all 7 agent execution pipelines.</span>
        </div>
      )}

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Tokens (24h)</span>
            <Cpu className="w-4 h-4 text-quant-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">32.5M</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            +14.2% vs previous day
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Agent Executions</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">15,057</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Across all tenant businesses</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average P95 Latency</span>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">315 ms</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">Within 500ms SLA target</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Human Approval Gate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">100% Intercept</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Zero unauthorized write actions</p>
        </div>
      </div>

      {/* Model Selection & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-quant-400" />
            Global LLM Routing Configuration
          </h2>

          <div className="space-y-3">
            {modelOptions.map((model) => (
              <label
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  activeModel === model.id
                    ? "bg-slate-800/80 border-quant-500 shadow-sm"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="model_choice"
                  checked={activeModel === model.id}
                  onChange={() => setActiveModel(model.id)}
                  className="mt-1 text-quant-600 focus:ring-quant-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{model.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-quant-300 border border-slate-700">
                      {model.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{model.description}</p>
                  <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400">
                    <span>Provider: <strong className="text-slate-300">{model.provider}</strong></span>
                    <span>Avg Latency: <strong className="text-slate-300">{model.latency}</strong></span>
                    <span>Est. Cost: <strong className="text-slate-300">{model.costPer1k} / 1k</strong></span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-quant-400" />
            Execution Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Deterministic Temperature</span>
                <span className="font-mono text-quant-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-quant-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lower values (0.1–0.3) ensure strict compliance with VAT and invoicing schemas.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Max Output Tokens Per Step</span>
                <span className="font-mono text-quant-400">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="1024"
                max="8192"
                step="512"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-quant-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Agent Safety Rails</span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enforce 12-step max loop ceiling</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict multi-tenant organisation_id query filter</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Human approval required for financial actions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Workloads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-white">24-Hour Agent Fleet Telemetry</h3>
            <p className="text-xs text-slate-400">Execution counts, token consumption, and response health.</p>
          </div>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Fleet Operational
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Agent Name</th>
                <th className="px-6 py-3">Invocations (24h)</th>
                <th className="px-6 py-3">Token Consumption</th>
                <th className="px-6 py-3">Avg Step Latency</th>
                <th className="px-6 py-3">Fleet Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {agentWorkloads.map((agent) => (
                <tr key={agent.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-quant-400" />
                    {agent.name}
                  </td>
                  <td className="px-6 py-3.5 font-mono">{agent.calls24h.toLocaleString()}</td>
                  <td className="px-6 py-3.5 font-mono text-quant-300">{agent.tokens24h}</td>
                  <td className="px-6 py-3.5 font-mono">{agent.avgLatency}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
