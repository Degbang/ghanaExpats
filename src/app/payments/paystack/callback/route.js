import { NextResponse } from "next/server";
import { getMarketplaceOrderById, updateMarketplaceOrderStatus } from "@/lib/private-data";
import { isPaystackConfigured, verifyPaystackTransaction } from "@/lib/payments";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  if (!reference || !isPaystackConfigured()) {
    return NextResponse.redirect(new URL("/dashboard?payment=config", origin));
  }

  try {
    const verification = await verifyPaystackTransaction(reference);
    const paymentId = verification?.metadata?.orderId;
    const payment = await getMarketplaceOrderById(paymentId);

    if (!payment) {
      return NextResponse.redirect(new URL("/dashboard?payment=missing", origin));
    }

    if (verification.status === "success") {
      const nextItems = Array.isArray(payment.items) ? payment.items : [];
      nextItems.push({
        type: "payment_confirmation",
        reference,
        verified_at: new Date().toISOString(),
        gateway_response: verification.gateway_response || ""
      });
      await updateMarketplaceOrderStatus(payment.id, "paid", {
        items: nextItems
      });
      return NextResponse.redirect(new URL("/dashboard?payment=success", origin));
    }
  } catch {
    return NextResponse.redirect(new URL("/dashboard?payment=failed", origin));
  }

  return NextResponse.redirect(new URL("/dashboard?payment=failed", origin));
}
