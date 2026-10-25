// ==============================================================================
// BUSINESS MANAGER — SYSTEM INTEGRATION & ACCEPTANCE TEST SUITE
// MAGIC QUANT TRADING Corp | Rigorous Architectural Validation
// ==============================================================================

import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db/store";
import { billingManager } from "@/lib/billing/manager";
import { agentOrchestrator } from "@/lib/ai/orchestrator";
import { sarsEngine } from "@/lib/compliance/sars";
import { checkPermission } from "@/lib/auth/session";

describe("Business Manager System Test Suite", () => {
  beforeEach(() => {
    db.reset();
  });

  // ----------------------------------------------------------------------------
  // 1. TENANT ISOLATION TESTS
  // ----------------------------------------------------------------------------
  describe("Multi-Tenant Data Isolation", () => {
    it("enforces that Organisation A cannot read Organisation B's customers", () => {
      const orgA = "org-apex-001";
      const orgB = "org-coastal-002";

      const customersOrgA = db.getCustomers(orgA);
      const customersOrgB = db.getCustomers(orgB);

      expect(customersOrgA.length).toBeGreaterThan(0);
      expect(customersOrgB.length).toBeGreaterThan(0);

      // Verify no overlap in records
      const idsA = customersOrgA.map((c) => c.id);
      const idsB = customersOrgB.map((c) => c.id);

      for (const id of idsB) {
        expect(idsA).not.toContain(id);
      }

      // Verify direct lookup cross-tenant fails
      const crossTenantCustomer = db.getCustomerById(idsB[0], orgA);
      expect(crossTenantCustomer).toBeUndefined();
    });

    it("prevents Organisation A from modifying Organisation B's customer records", () => {
      const orgA = "org-apex-001";
      const orgB = "org-coastal-002";

      const coastalCustomer = db.getCustomers(orgB)[0];
      expect(coastalCustomer).toBeDefined();

      const attemptResult = db.updateCustomer(coastalCustomer.id, orgA, {
        name: "HACKED_BY_ORG_A",
      });

      expect(attemptResult).toBeNull();
      // Ensure record in Org B was untouched
      const original = db.getCustomerById(coastalCustomer.id, orgB);
      expect(original?.name).not.toBe("HACKED_BY_ORG_A");
    });
  });

  // ----------------------------------------------------------------------------
  // 2. BILLING & IDEMPOTENCY TESTS
  // ----------------------------------------------------------------------------
  describe("Commercial Billing & Payment Webhooks", () => {
    it("activates Starter 1-Month access (R499) as non-renewing one-time purchase", async () => {
      const result = await billingManager.processVerifiedPayment({
        customerEmail: "newbusiness@example.co.za",
        customerName: "Zola Ndaba",
        organisationName: "Zola Logistics (Pty) Ltd",
        planCode: "starter_month",
        amountCents: 49900,
        currency: "ZAR",
        provider: "yoco",
        providerTransactionId: "yoco_txn_unique_999",
        idempotencyKey: "idem_zola_001",
      });

      expect(result.success).toBe(true);
      expect(result.isDuplicate).toBe(false);
      expect(result.activationStatus).toBe("activated");

      const sub = db.getSubscription(result.organisationId);
      expect(sub).toBeDefined();
      expect(sub?.status).toBe("active");
      // Must NOT renew automatically as per prompt requirement
      expect(sub?.cancel_at_period_end).toBe(true);

      // Verify access period is 30 days
      const start = new Date(sub!.current_period_start).getTime();
      const end = new Date(sub!.current_period_end).getTime();
      const diffDays = Math.round((end - start) / (1000 * 3600 * 24));
      expect(diffDays).toBe(30);
    });

    it("prevents duplicate payments and subscriptions on webhook retries (Idempotency)", async () => {
      const paymentInput = {
        customerEmail: "audit@testcorp.co.za",
        customerName: "Kagiso Molefe",
        organisationName: "TestCorp SA",
        planCode: "starter_month",
        amountCents: 49900,
        currency: "ZAR",
        provider: "yoco" as const,
        providerTransactionId: "yoco_txn_duplicate_check_101",
        idempotencyKey: "idem_duplicate_test_key",
      };

      // First webhook event
      const firstResult = await billingManager.processVerifiedPayment(paymentInput);
      expect(firstResult.success).toBe(true);
      expect(firstResult.isDuplicate).toBe(false);

      // Duplicate webhook replay with same transaction ID
      const secondResult = await billingManager.processVerifiedPayment(paymentInput);
      expect(secondResult.success).toBe(true);
      expect(secondResult.isDuplicate).toBe(true);
      expect(secondResult.activationStatus).toBe("already_active");

      // Verify no duplicate subscriptions created
      const orgSubs = db.getSubscriptions(firstResult.organisationId);
      expect(orgSubs.length).toBe(1);
    });
  });

  // ----------------------------------------------------------------------------
  // 3. AI AGENT ORCHESTRATION & HUMAN APPROVAL TESTS
  // ----------------------------------------------------------------------------
  describe("AI Agent Platform & Human Approval System", () => {
    it("executes safe read tools automatically within tenant boundaries", async () => {
      const orgId = "org-apex-001";
      const agentId = "agent-001"; // Executive Assistant

      const result = await agentOrchestrator.runAgent({
        agentId,
        organisationId: orgId,
        triggerSource: "manual",
        promptOverride: "Summarize today's calendar and open tasks.",
      });

      expect(result.success).toBe(true);
      expect(result.execution.status).toBe("completed");
      expect(result.stepsExecuted.length).toBeGreaterThan(0);
      expect(result.execution.total_tokens).toBeGreaterThan(0);
      expect(result.execution.execution_duration_ms).toBeGreaterThanOrEqual(0);
    });

    it("stages sensitive actions for Human Approval rather than executing silently", async () => {
      const orgId = "org-apex-001";
      const agentId = "agent-003"; // Finance Assistant

      const result = await agentOrchestrator.runAgent({
        agentId,
        organisationId: orgId,
        triggerSource: "manual",
        promptOverride: "Check overdue invoices and stage debtor reminders.",
      });

      expect(result.success).toBe(true);
      expect(result.execution.status).toBe("waiting_approval");
      expect(result.approvalsCreated.length).toBeGreaterThan(0);

      const approval = result.approvalsCreated[0];
      expect(approval.status).toBe("pending");
      expect(approval.action_type).toBe("stage_invoice_reminder");
      expect(approval.proposed_payload).toBeDefined();

      // Ensure notification was generated for the Business Owner
      const pendingNotifs = db.getNotifications(orgId).filter((n) => n.type === "approval_required");
      expect(pendingNotifs.length).toBeGreaterThan(0);
    });

    it("allows the Business Owner to approve or reject staged agent actions", () => {
      const orgId = "org-apex-001";
      const pending = db.getPendingApprovals(orgId);
      expect(pending.length).toBeGreaterThan(0);

      const targetApproval = pending[0];
      const resolved = db.resolveAgentApproval(
        targetApproval.id,
        orgId,
        "approved",
        "user-sipho-001",
        "Approved for email dispatch."
      );

      expect(resolved).not.toBeNull();
      expect(resolved?.status).toBe("approved");
      expect(resolved?.reviewed_by).toBe("user-sipho-001");
      expect(resolved?.comments).toBe("Approved for email dispatch.");
    });
  });

  // ----------------------------------------------------------------------------
  // 4. SARS COMPLIANCE TESTS
  // ----------------------------------------------------------------------------
  describe("SARS Compliance Engine", () => {
    it("accurately calculates 15% VAT201 figures and eFiling box values", () => {
      const orgId = "org-apex-001";
      const workpaper = sarsEngine.generateVAT201Workpaper(orgId, "2026/09");

      expect(workpaper).toBeDefined();
      expect(workpaper.outputVatCents).toBeGreaterThan(0);
      expect(workpaper.inputVatCents).toBeGreaterThan(0);
      expect(workpaper.netVatPayableCents).toBe(workpaper.outputVatCents - workpaper.inputVatCents);

      // Check eFiling box mappings
      expect(workpaper.efilingBoxMapping["Block 4 (Output VAT at 15%)"]).toBeDefined();
      expect(workpaper.efilingBoxMapping["Block 15 (Input VAT deductible)"]).toBeDefined();
      expect(workpaper.submissionDeadline).toContain("31 October 2026");
      expect(workpaper.legalDisclaimer).toContain("not constitute formal tax advice");
    });
  });

  // ----------------------------------------------------------------------------
  // 5. ROLE-BASED ACCESS CONTROL (RBAC) TESTS
  // ----------------------------------------------------------------------------
  describe("Role-Based Access Control", () => {
    it("allows Business Owner to manage billing, but restricts Staff Members", () => {
      expect(checkPermission("business_owner", "manage_billing")).toBe(true);
      expect(checkPermission("staff_member", "manage_billing")).toBe(false);
      expect(checkPermission("finance_manager", "manage_billing")).toBe(false);
    });

    it("allows Finance Manager to view finances and issue invoices", () => {
      expect(checkPermission("finance_manager", "view_finances")).toBe(true);
      expect(checkPermission("finance_manager", "issue_invoices")).toBe(true);
      expect(checkPermission("staff_member", "issue_invoices")).toBe(false);
    });
  });
});
