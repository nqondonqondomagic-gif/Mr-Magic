"use client";

import { useState } from "react";
import { Users, Plus, ShieldCheck, Mail, CheckCircle2, UserCheck } from "lucide-react";
import { db } from "@/lib/db/store";
import { OrgRole } from "@/types";

export default function TeamPage() {
  const orgId = "org-apex-001";
  const [members, setMembers] = useState(db.getOrganisationMembers(orgId));
  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "staff_member" as OrgRole,
    title: "",
    department: "Operations",
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = db.createUserProfile({
      id: `user-${Date.now()}`,
      email: newMember.email,
      full_name: newMember.name,
      is_platform_admin: false,
      created_at: new Date().toISOString(),
    });

    db.addOrganisationMember({
      id: `mem-${Date.now()}`,
      organisation_id: orgId,
      user_id: newUser.id,
      role: newMember.role,
      title: newMember.title,
      department: newMember.department,
      is_active: true,
      user: newUser,
      created_at: new Date().toISOString(),
    });

    setMembers(db.getOrganisationMembers(orgId));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            Team Members & Access Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Role-Based Access Control (RBAC). Restrict access to finances, HR records, and AI agent approval permissions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Invite Member</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Title / Department</th>
                <th className="py-3.5 px-4">Configured Role</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{m.user?.full_name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{m.user?.email}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{m.title || "Team Member"}</p>
                    <p className="text-[10px] text-slate-500">{m.department || "Operations"}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                        m.role === "business_owner"
                          ? "bg-brand-100 text-brand-800"
                          : m.role === "finance_manager"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {m.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Explanations Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          Configured Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Business Owner</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Full workspace control, billing management, organization settings, and approval queue authority.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Finance Manager</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Access to invoices, expenses, SARS compliance workpapers, debtor reports, and financial workflows.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Staff Member / Read-only</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Restricted to assigned operational tasks and customer projects. No access to salaries or billing.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Invite Team Member
            </h3>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Naidoo"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="priya@company.co.za"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Lead"
                    value={newMember.title}
                    onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as OrgRole })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="business_admin">Business Administrator</option>
                    <option value="finance_manager">Finance Manager</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="staff_member">Staff Member</option>
                    <option value="read_only">Read-only User</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-white font-bold hover:bg-slate-800"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
