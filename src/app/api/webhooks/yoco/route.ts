import { NextRequest, NextResponse } from "next/server";
import { yocoProvider } from "@/lib/billing/providers/yoco";
import { billingManager } from "@/lib/billing/manager";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("webhook-signature") || req.headers.get("x-yoco-signature");

    // Verify HMAC-SHA256 signature
    const isValid = yocoProvider.verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type || payload.event;

    // Handle payment.succeeded
    if (eventType === "payment.succeeded" || eventType === "charge.successful") {
      const paymentData = payload.data || payload;
      const metadata = paymentData.metadata || {};

      const result = await billingManager.processVerifiedPayment({
        organisationId: metadata.organisationId,
        customerEmail: paymentData.customerEmail || metadata.customerEmail || "customer@example.co.za",
        customerName: paymentData.customerName || metadata.customerName || "Valued Customer",
        organisationName: metadata.organisationName || "New South African Enterprise",
        planCode: metadata.planCode || "starter_month",
        amountCents: paymentData.amount || 49900,
        currency: paymentData.currency || "ZAR",
        provider: "yoco",
        providerTransactionId: paymentData.id || `yoco_txn_${Date.now()}`,
        idempotencyKey: payload.id || `idem_${paymentData.id || Date.now()}`,
        metadata: { ...metadata, yoco_event_id: payload.id },
      });

      return NextResponse.json({ received: true, ...result });
    }

    return NextResponse.json({ received: true, ignored: true });
  } catch (err: any) {
    console.error("Yoco webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
