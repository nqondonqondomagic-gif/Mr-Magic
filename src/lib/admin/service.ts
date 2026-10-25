// ==============================================================================
// BUSINESS MANAGER — PLATFORM ADMINISTRATION SERVICE
// MAGIC QUANT TRADING Corp | Enterprise Operator Control Plane
// ==============================================================================

import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalRevenueZAR: string;
  totalRevenueCents: number;
  totalAgentExecutions: number;
  pendingApprovalsGlobal: number;
  systemHealth: "healthy" | "degraded" | "critical";
}

export class PlatformAdminService {
  /**
   * Aggregate platform-wide executive metrics for MAGIC QUANT TRADING Corp leadership
   */
  public getPlatformMetrics(): PlatformMetrics {
    const orgs = db.getAllOrganisations();
    const payments = db.getAllPayments();
    const allExecutions = db.state.agentExecutions;
    const allApprovals = db.state.agentApprovals.filter((a) => a.status === "pending");

    const successfulPayments = payments.filter((p) => p.status === "successful");
    const totalRevCents = successfulPayments.reduce((sum, p) => sum + p.amount_cents, 0);

    return {
      totalTenants: orgs.length,
      activeTenants: orgs.filter((o) => o.is_active).length,
      totalUsers: db.state.userProfiles.length,
      totalRevenueZAR: formatZAR(totalRevCents),
      totalRevenueCents: totalRevCents,
      totalAgentExecutions: allExecutions.length,
      pendingApprovalsGlobal: allApprovals.length,
      systemHealth: "healthy",
    };
  }

  /**
   * Manually activates an organisation subscription as an administrator exception
   */
  public manualActivateOrganisation(orgId: string, adminUserId: string, reason: string) {
    const org = db.getOrganisation(orgId);
    if (!org) throw new Error("Organisation not found.");

    const plan = db.getPlanByCode("starter_month") || db.getPlans()[0];
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 86400000);

    const subscription = {
      id: `sub-manual-${Date.now()}`,
      organisation_id: org.id,
      plan_id: plan.id,
      plan,
      status: "active" as const,
      current_period_start: startDate.toISOString(),
      current_period_end: endDate.toISOString(),
      cancel_at_period_end: true,
      payment_provider: "admin_override",
      created_at: startDate.toISOString(),
    };
    db.createSubscription(subscription);

    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: org.id,
      user_id: adminUserId,
      user_name: "Platform Administrator",
      action: "manual_account_activation",
      entity_type: "organisation",
      entity_id: org.id,
      details: `Platform admin override activation for 30 days. Reason: ${reason}`,
      created_at: new Date().toISOString(),
    });

    return subscription;
  }

  /**
   * Toggle organisation active/suspended state
   */
  public toggleOrganisationSuspension(orgId: string, adminUserId: string, suspend: boolean) {
    const org = db.updateOrganisation(orgId, { is_active: !suspend });
    if (!org) throw new Error("Organisation not found.");

    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: org.id,
      user_id: adminUserId,
      user_name: "Platform Administrator",
      action: suspend ? "organisation_suspended" : "organisation_reactivated",
      entity_type: "organisation",
      entity_id: org.id,
      details: `Tenant account was ${suspend ? "SUSPENDED" : "REACTIVATED"} by Platform Admin.`,
      created_at: new Date().toISOString(),
    });

    return org;
  }
}

export const platformAdminService = new PlatformAdminService();
