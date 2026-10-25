"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Platform Admin Sidebar */}
      <AdminSidebar />

      {/* Main Operator Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-950 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-quant-600/30 text-quant-300 border border-quant-500/40 font-bold uppercase">
              Operator Control Plane
            </span>
            <span className="text-xs text-slate-400">
              MAGIC QUANT TRADING Corp · Master Administrative Console
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PostgreSQL Database: Operational</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
