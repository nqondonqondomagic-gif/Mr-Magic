// ==============================================================================
// BUSINESS MANAGER — BILLING & SUBSCRIPTION LIFECYCLE MANAGER
// MAGIC QUANT TRADING Corp | South African Payments Architecture
// ==============================================================================

import { db } from "@/lib/db/store";
import { Payment, Subscription, Plan } from "@/types";

export interface ProcessPaymentInput {
  organisationId?: string;
  customerEmail: string;
  customerName: string;
  organisationName: string;
  planCode: string;
  amountCents: number;
  currency: string;
  provider: "yoco" | "paystack" | "eft";
  providerTransactionId: string;
  idempotencyKey: string;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentResult {
  success: boolean;
  isDuplicate: boolean;
  organisationId: string;
  subscriptionId: string;
  paymentId: string;
  activationStatus: "activated" | "already_active" | "failed";
  message: string;
}

export class BillingManager {
  /**
   * Process a verified payment event with idempotency protection.
   * Proves Requirement:
   * "The initial purchase is a one-time payment for one month of access. It must not renew automatically."
   * "The customer can purchase another access period when the current one expires."
   * "Backend validates the transaction and prevents duplicate processing."
   */
  public async processVerifiedPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
    // 1. Idempotency Check: prevent duplicate processing on webhook retries
    const existingPayments = db.getAllPayments();
    const duplicate = existingPayments.find(
      (p) =>
        (p.idempotency_key && p.idempotency_key === input.idempotencyKey) ||
        (p.provider_transaction_id && p.provider_transaction_id === input.providerTransactionId)
    );

    if (duplicate) {
      return {
        success: true,
        isDuplicate: true,
        organisationId: duplicate.organisation_id,
        subscriptionId: duplicate.subscription_id || "",
        paymentId: duplicate.id,
        activationStatus: "already_active",
        message: "Payment already processed previously (Idempotent replay).",
      };
    }

    // 2. Validate Plan
    const plan = db.getPlanByCode(input.planCode);
    if (!plan) {
      throw new Error(`Plan with code "${input.planCode}" not recognized in catalogue.`);
    }

    // 3. Resolve or Create Organisation & User Profile
    let orgId = input.organisationId;
    let userId: string;

    const existingUser = db.getUserProfileByEmail(input.customerEmail);
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUser = db.createUserProfile({
        id: `user-${Date.now()}`,
        email: input.customerEmail,
        full_name: input.customerName,
        is_platform_admin: false,
        created_at: new Date().toISOString(),
      });
      userId = newUser.id;
    }

    if (!orgId) {
      const slug = input.organisationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const newOrg = db.createOrganisation({
        id: `org-${Date.now()}`,
        name: input.organisationName,
        slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
        legal_name: input.organisationName,
        country: "ZA",
        currency: "ZAR",
        timezone: "Africa/Johannesburg",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      orgId = newOrg.id;

      // Add user as Business Owner
      db.addOrganisationMember({
        id: `mem-${Date.now()}`,
        organisation_id: orgId,
        user_id: userId,
        role: "business_owner",
        title: "Business Owner",
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }

    // 4. Calculate Subscription Dates
    // Starter R499 is strictly 30 days one-time, does NOT auto-renew
    const startDate = new Date();
    const durationDays = plan.billing_interval === "one_time" ? 30 : 30; // 1 month
    const endDate = new Date(startDate.getTime() + durationDays * 86400000);

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      organisation_id: orgId,
      plan_id: plan.id,
      plan,
      status: "active",
      current_period_start: startDate.toISOString(),
      current_period_end: endDate.toISOString(),
      cancel_at_period_end: plan.billing_interval === "one_time", // Non-renewing!
      payment_provider: input.provider,
      external_subscription_id: input.providerTransactionId,
      created_at: startDate.toISOString(),
    };
    db.createSubscription(subscription);

    // 5. Record Payment
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      organisation_id: orgId,
      subscription_id: subscription.id,
      amount_cents: input.amountCents,
      currency: input.currency || "ZAR",
      status: "successful",
      payment_provider: input.provider,
      provider_transaction_id: input.providerTransactionId,
      idempotency_key: input.idempotencyKey,
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
    };
    db.addPayment(payment);

    // 6. Record Audit Log
    db.addAuditLog({
      id: `audit-${Date.now()}`,
      organisation_id: orgId,
      user_id: userId,
      user_name: input.customerName,
      action: "subscription_activated",
      entity_type: "subscription",
      entity_id: subscription.id,
      details: `Plan ${plan.name} activated for R${(input.amountCents / 100).toFixed(2)} (${input.provider}). Expires ${endDate.toISOString().split("T")[0]}. Auto-renew: ${!subscription.cancel_at_period_end}.`,
      created_at: new Date().toISOString(),
    });

    // 7. Dispatch Notification
    db.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      organisation_id: orgId,
      title: "Account & Subscription Activated",
      message: `Welcome to Business Manager! Your ${plan.name} is active until ${endDate.toISOString().split("T")[0]}.`,
      type: "success",
      action_url: "/app",
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      isDuplicate: false,
      organisationId: orgId,
      subscriptionId: subscription.id,
      paymentId: payment.id,
      activationStatus: "activated",
      message: "Subscription provisioned successfully.",
    };
  }

  /**
   * Check if organization has active entitlement
   */
  public hasActiveEntitlement(orgId: string): boolean {
    const sub = db.getSubscription(orgId);
    if (!sub) return false;
    if (sub.status !== "active") return false;

    // Check expiry
    const expiry = new Date(sub.current_period_end).getTime();
    return expiry > Date.now();
  }
}

export const billingManager = new BillingManager();
