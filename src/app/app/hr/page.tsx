"use client";

import { useState } from "react";
import { UserCheck, Plus, CheckCircle2, XCircle, Clock, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatZAR, formatDate } from "@/lib/utils";
import { LeaveRequest } from "@/types";

export default function HRPage() {
  const orgId = "org-apex-001";
  const [employees, setEmployees] = useState(db.getEmployees(orgId));
  const [leaveRequests, setLeaveRequests] = useState(db.getLeaveRequests(orgId));
  const [activeTab, setActiveTab] = useState<"directory" | "leave">("directory");

  const handleApproveLeave = (id: string, action: "approved" | "rejected") => {
    db.updateLeaveStatus(id, orgId, action);
    setLeaveRequests(db.getLeaveRequests(orgId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-brand-600" />
            HR & Employee Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Employee profiles, BCEA statutory leave administration, and role-based confidentiality controls.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "directory" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Staff Directory ({employees.length})
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "leave" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            BCEA Leave Requests ({leaveRequests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: STAFF DIRECTORY */}
      {activeTab === "directory" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Department</th>
                  <th className="py-3.5 px-4">SA ID Number</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">Annual Leave Days</th>
                  <th className="py-3.5 px-4 text-right">Gross Monthly Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                      <p className="text-[11px] text-slate-500">{emp.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{emp.job_title}</p>
                      <p className="text-[10px] text-slate-500">{emp.department || "General"}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {emp.id_or_passport || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{emp.start_date}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {emp.annual_leave_days} days / yr
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatZAR(emp.salary_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE REQUESTS */}
      {activeTab === "leave" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Period</th>
                    <th className="py-3.5 px-4">Total Days</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Owner Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{req.employee_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 text-[10px]">
                          {req.leave_type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {req.start_date} to {req.end_date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{req.total_days} days</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{req.reason || "—"}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            req.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleApproveLeave(req.id, "approved")}
                              className="text-xs text-emerald-600 font-bold hover:underline"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveLeave(req.id, "rejected")}
                              className="text-xs text-rose-600 font-semibold hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
