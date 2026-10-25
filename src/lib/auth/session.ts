// ==============================================================================
// BUSINESS MANAGER — AUTHENTICATION & MULTI-TENANT SESSION
// MAGIC QUANT TRADING Corp | AI Business Operating System
// ==============================================================================

import { db } from "@/lib/db/store";
import { UserProfile, Organisation, OrganisationMember, OrgRole } from "@/types";

export interface SessionContext {
  user: UserProfile;
  organisation: Organisation;
  member: OrganisationMember;
  roles: OrgRole[];
  isPlatformAdmin: boolean;
}

// Default session for fast local development & seamless interactive evaluation
export const DEFAULT_SESSION_USER_ID = "user-sipho-001";
export const DEFAULT_SESSION_ORG_ID = "org-apex-001";

/**
 * Resolves the active user session and active organisation
 */
export async function getSession(
  userId: string = DEFAULT_SESSION_USER_ID,
  orgId: string = DEFAULT_SESSION_ORG_ID
): Promise<SessionContext | null> {
  const user = db.getUserProfile(userId);
  if (!user) return null;

  // Platform Admin override
  if (user.is_platform_admin) {
    const org = db.getOrganisation(orgId) || db.getAllOrganisations()[0];
    const member = db.getOrganisationMembers(org.id)[0] || {
      id: "platform-admin-mem",
      organisation_id: org.id,
      user_id: user.id,
      role: "platform_owner" as OrgRole,
      title: "Platform Admin",
      is_active: true,
      created_at: new Date().toISOString(),
    };

    return {
      user,
      organisation: org,
      member,
      roles: ["platform_owner", "business_owner"],
      isPlatformAdmin: true,
    };
  }

  const userOrgs = db.getUserOrganisations(user.id);
  const activeOrg = userOrgs.find((o) => o.id === orgId) || userOrgs[0];
  if (!activeOrg) return null;

  const member = db
    .getOrganisationMembers(activeOrg.id)
    .find((m) => m.user_id === user.id && m.is_active);

  if (!member) return null;

  return {
    user,
    organisation: activeOrg,
    member,
    roles: [member.role],
    isPlatformAdmin: false,
  };
}

/**
 * Validates that the active tenant has permission for the specified organisation ID.
 * Throws or returns false if cross-tenant breach is attempted.
 */
export function validateTenantAccess(session: SessionContext, targetOrgId: string): boolean {
  if (session.isPlatformAdmin) return true;
  return session.organisation.id === targetOrgId;
}

/**
 * Role-Based Access Control (RBAC) Entitlement Checker
 */
export function checkPermission(
  role: OrgRole,
  action:
    | "manage_billing"
    | "view_finances"
    | "issue_invoices"
    | "view_hr"
    | "approve_leave"
    | "approve_agents"
    | "manage_integrations"
    | "manage_team"
): boolean {
  switch (action) {
    case "manage_billing":
      return role === "platform_owner" || role === "business_owner";
    case "view_finances":
    case "issue_invoices":
      return (
        role === "platform_owner" ||
        role === "business_owner" ||
        role === "business_admin" ||
        role === "finance_manager"
      );
    case "view_hr":
    case "approve_leave":
      return (
        role === "platform_owner" ||
        role === "business_owner" ||
        role === "business_admin" ||
        role === "hr_manager"
      );
    case "approve_agents":
      return (
        role === "platform_owner" ||
        role === "business_owner" ||
        role === "business_admin" ||
        role === "finance_manager"
      );
    case "manage_integrations":
    case "manage_team":
      return role === "platform_owner" || role === "business_owner" || role === "business_admin";
    default:
      return false;
  }
}
