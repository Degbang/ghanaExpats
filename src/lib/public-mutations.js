import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  return getSupabaseAdminClient();
}

export async function createContactSubmission(payload) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("contact_submissions").insert({
    inquiry_type: payload.inquiryType,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone || null,
    subject: payload.subject,
    message: payload.message,
    status: "new"
  });
  if (error) throw new Error(error.message);
}

export async function createNewsletterSubscription(payload) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("newsletter_subscriptions").insert({
    email: payload.email,
    status: "active"
  });
  if (error) throw new Error(error.message);
}

export async function createBusinessLead(payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("business_listings").insert({
    name: payload.businessName,
    category: payload.category,
    email: payload.email,
    phone: payload.phone,
    website: payload.website || null,
    description: payload.description,
    status: "pending",
    location: payload.location || "Ghana",
    services_offered: payload.servicesOffered || null,
    payment_model: payload.paymentModel || null,
    review: payload.contactName || null,
    "Onboarding & Verification": payload.section || null,
    "Payment Status": payload.paymentStatus || "pending",
    "Verification Process": payload.verificationStatus || null
  }).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateBusinessLeadVerification(applicationId, payload) {
  const supabase = requireSupabase();
  const verificationSummary = JSON.stringify(payload);
  const { error } = await supabase
    .from("business_listings")
    .update({
      "Verification Process": verificationSummary,
      "Onboarding & Verification": "submitted",
      updated_at: new Date().toISOString()
    })
    .eq("id", applicationId);
  if (error) throw new Error(error.message);
}
