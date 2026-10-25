// ==============================================================================
// BUSINESS MANAGER — YOCO PAYMENT GATEWAY ADAPTER
// MAGIC QUANT TRADING Corp | South African Payments Architecture
// ==============================================================================

import crypto from "crypto";

export interface YocoCheckoutOptions {
  amountCents: number;
  currency: string;
  planCode: string;
  customerEmail: string;
  customerName: string;
  organisationName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

export interface YocoCheckoutResponse {
  redirectUrl: string;
  checkoutId: string;
  status: "created" | "simulated";
}

export class YocoPaymentProvider {
  private secretKey: string;
  private webhookSecret: string;

  constructor() {
    this.secretKey = process.env.YOCO_SECRET_KEY || "sk_test_mock_secret";
    this.webhookSecret = process.env.YOCO_WEBHOOK_SECRET || "whsec_mock_secret";
  }

  /**
   * Verify Yoco Webhook Signature
   * Yoco signs webhooks using an HMAC-SHA256 signature passed in the 'webhook-signature' header.
   */
  public verifyWebhookSignature(payload: string, signatureHeader: string | null): boolean {
    if (!signatureHeader) return false;

    // Test bypass for automated tests or mock sandbox when using test keys
    if (signatureHeader === "test-bypass-sig" && process.env.NODE_ENV !== "production") {
      return true;
    }

    try {
      // Yoco signature format: t=timestamp,v1=signature
      const parts = signatureHeader.split(",");
      const timestampPart = parts.find((p) => p.startsWith("t="));
      const sigPart = parts.find((p) => p.startsWith("v1="));

      if (!sigPart) return false;

      const signature = sigPart.replace("v1=", "");
      const timestamp = timestampPart ? timestampPart.replace("t=", "") : "";

      const signedPayload = `${timestamp}.${payload}`;
      const expectedSig = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(signedPayload)
        .digest("hex");

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    } catch {
      // Fallback simple HMAC check if header is raw signature
      try {
        const expected = crypto.createHmac("sha256", this.webhookSecret).update(payload).digest("hex");
        return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
      } catch {
        return false;
      }
    }
  }

  /**
   * Initialize a hosted checkout session
   */
  public async createCheckout(options: YocoCheckoutOptions): Promise<YocoCheckoutResponse> {
    const checkoutId = `yoco_chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // In local dev/sandbox or without live secret key, use integrated simulated checkout URL
    if (this.secretKey.includes("mock") || this.secretKey.includes("sample")) {
      const simulatedUrl = `${options.successUrl}${options.successUrl.includes("?") ? "&" : "?"}checkout_id=${checkoutId}&plan=${options.planCode}&email=${encodeURIComponent(options.customerEmail)}`;
      return {
        redirectUrl: simulatedUrl,
        checkoutId,
        status: "simulated",
      };
    }

    // Live Yoco API invocation
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.secretKey}`,
      },
      body: JSON.stringify({
        amount: options.amountCents,
        currency: options.currency || "ZAR",
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
        metadata: {
          ...options.metadata,
          planCode: options.planCode,
          customerEmail: options.customerEmail,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Yoco API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return {
      redirectUrl: data.redirectUrl,
      checkoutId: data.id,
      status: "created",
    };
  }
}

export const yocoProvider = new YocoPaymentProvider();
