const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSiteUrl(origin = "") {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || origin || "http://localhost:3000";
}

function toMinorUnit(amount, currency) {
  const multiplier = ["GHS", "USD"].includes(currency) ? 100 : 100;
  return Math.round(Number(amount) * multiplier);
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export async function initializePaystackTransaction({ email, amount, currency, callbackUrl, metadata = {} }) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      amount: toMinorUnit(amount, currency),
      currency,
      callback_url: callbackUrl,
      metadata
    })
  });

  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(json?.message || "Unable to initialize Paystack transaction.");
  }
  return json.data;
}

export async function verifyPaystackTransaction(reference) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
    cache: "no-store"
  });
  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(json?.message || "Unable to verify Paystack transaction.");
  }
  return json.data;
}

export { getSiteUrl };
