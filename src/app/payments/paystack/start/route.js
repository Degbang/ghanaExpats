import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { getMarketplaceOrderById, updateMarketplaceOrderStatus } from "@/lib/private-data";
import { getSiteUrl, initializePaystackTransaction, isPaystackConfigured } from "@/lib/payments";

export async function GET(request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const searchParams = new URL(request.url).searchParams;
  const target = searchParams.get("target");
  const id = searchParams.get("id");

  if (target !== "marketplace_order" || !id) {
    return NextResponse.redirect(new URL("/dashboard?payment=missing", request.url));
  }

  const payment = await getMarketplaceOrderById(id);

  if (!payment || (session.role !== "admin" && payment.customer_email !== session.email)) {
    return NextResponse.redirect(new URL("/dashboard?payment=missing", request.url));
  }

  if (!isPaystackConfigured()) {
    return NextResponse.redirect(new URL("/dashboard?payment=config", request.url));
  }

  const origin = new URL(request.url).origin;
  const callbackUrl = `${getSiteUrl(origin)}/payments/paystack/callback`;
  const initialized = await initializePaystackTransaction({
    email: payment.customer_email,
    amount: payment.subtotal,
    currency: "GHS",
    callbackUrl,
    metadata: {
      orderId: payment.id,
      userId: session.user_id,
      kind: "marketplace_order"
    }
  });

  const nextItems = Array.isArray(payment.items) ? payment.items : [];
  nextItems.push({
    type: "payment_reference",
    reference: initialized.reference,
    access_code: initialized.access_code
  });
  await updateMarketplaceOrderStatus(payment.id, "payment_pending", {
    items: nextItems
  });

  return NextResponse.redirect(initialized.authorization_url);
}
