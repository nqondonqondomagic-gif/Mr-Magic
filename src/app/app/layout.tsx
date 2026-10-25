"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingApprovalsCount={2}
        overdueComplianceCount={1}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AppHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          activeOrgName="Apex Solutions (Pty) Ltd"
          activeUserName="Sipho Ndlovu"
          activeUserRole="Business Owner"
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
