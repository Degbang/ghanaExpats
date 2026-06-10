import { getSupabaseAdminClient } from "@/lib/supabase";
import { findListing, listListings } from "@/lib/public-data";
import { slugify } from "@/lib/utils";

function normalizeApplication(row) {
  return {
    id: row.id,
    business_name: row.name,
    email: row.email,
    phone: row.phone,
    category: row.category,
    section: row["Onboarding & Verification"] || "directory",
    description: row.description,
    status: row.status,
    verification_complete: Boolean(row["Verification Process"]),
    payment_status: row["Payment Status"] || "pending",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function normalizeMessage(row) {
  return {
    id: row.id,
    subject: row.subject,
    email: row.email,
    type: row.inquiry_type || "general",
    message: row.message,
    status: row.status,
    created_at: row.created_at
  };
}

function normalizeOrder(row) {
  return {
    id: row.id,
    kind: "marketplace_order",
    amount: Number(row.subtotal || 0),
    currency: "GHS",
    status: row.status,
    provider: "paystack",
    reference: row.items?.reference || null,
    created_at: row.created_at,
    target: "marketplace_order",
    target_id: row.id
  };
}

function tableForSection(section) {
  if (section === "marketplace") return "products";
  if (section === "real-estate") return "properties";
  if (section === "snug-haven") return "accommodations";
  return "businesses";
}

function buildInsertPayload(section, payload, session) {
  const slug = slugify(payload.title);
  const features = payload.meta?.features || [];

  if (section === "marketplace") {
    return {
      id: slug,
      title: payload.title,
      original_price: null,
      sale_price: String(payload.price || ""),
      discount: null,
      in_stock: 1,
      description: payload.description,
      category: payload.category,
      images: [],
      features,
      slug,
      top: 0
    };
  }

  if (section === "real-estate") {
    return {
      id: slug,
      title: payload.title,
      type: payload.meta?.type || payload.category,
      sale_type: payload.category,
      price: payload.price ? `${payload.currency || "USD"} ${payload.price}` : null,
      condition: payload.meta?.condition || "Available",
      location: payload.location,
      description: payload.description,
      images: [],
      features,
      slug,
      top: 0
    };
  }

  if (section === "snug-haven") {
    return {
      id: slug,
      title: payload.title,
      type: payload.meta?.type || "Daily",
      price: payload.price ? `$${payload.price}` : null,
      price_unit: "/night",
      location: payload.location,
      bedrooms: payload.meta?.bedrooms || null,
      bathrooms: 1,
      amenities: features,
      description: payload.description,
      verified: session.status === "approved",
      images: [],
      features,
      slug,
      parking: "",
      top: 0,
      blocked_dates: {}
    };
  }

  return {
    id: slug,
    name: payload.title,
    category: payload.category,
    location: payload.location,
    hours: "",
    image: "",
    verified: session.status === "approved",
    description: payload.description,
    services: features,
    phone: session.phone || "",
    email: session.email,
    website: session.website || "",
    slug,
    top: 0
  };
}

function buildUpdatePayload(section, payload, existing, session) {
  const features = payload.meta?.features || [];

  if (section === "marketplace") {
    return {
      title: payload.title,
      sale_price: String(payload.price || ""),
      description: payload.description,
      category: payload.category,
      features,
      slug: existing.slug
    };
  }

  if (section === "real-estate") {
    return {
      title: payload.title,
      type: payload.meta?.type || existing.meta?.type || payload.category,
      sale_type: payload.category,
      price: payload.price ? `${payload.currency || "USD"} ${payload.price}` : null,
      condition: payload.meta?.condition || "",
      location: payload.location,
      description: payload.description,
      features,
      slug: existing.slug
    };
  }

  if (section === "snug-haven") {
    return {
      title: payload.title,
      type: payload.meta?.type || existing.meta?.type || "Daily",
      price: payload.price ? `$${payload.price}` : null,
      location: payload.location,
      bedrooms: payload.meta?.bedrooms || null,
      amenities: features,
      description: payload.description,
      features,
      verified: session.status === "approved",
      slug: existing.slug
    };
  }

  return {
    name: payload.title,
    category: payload.category,
    location: payload.location,
    verified: session.status === "approved",
    description: payload.description,
    services: features,
    email: session.email,
    slug: existing.slug
  };
}

export async function getApplicationQueue() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("business_listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeApplication);
}

export async function getMessagesInbox() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeMessage);
}

export async function getRevenueSummary() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("marketplace_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function listAllListingsForAdmin() {
  const sections = ["directory", "real-estate", "marketplace", "snug-haven"];
  const groups = await Promise.all(sections.map((section) => listListings(section)));
  return groups.flat();
}

export async function getDashboardListings(session) {
  const refs = Array.isArray(session.owned_listings) ? session.owned_listings : [];
  const listings = await Promise.all(
    refs.map((ref) => findListing(ref.section, ref.slug || ref.id))
  );
  return listings.filter(Boolean);
}

export async function getDashboardOrders(session) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("marketplace_orders")
    .select("*")
    .eq("customer_email", session.email)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeOrder);
}

export async function getBusinessApplicationsForEmail(email) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("business_listings")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeApplication);
}

export async function getOwnedListingById(session, id) {
  const listings = await getDashboardListings(session);
  return listings.find((listing) => String(listing.id) === String(id)) ?? null;
}

export async function createDashboardListing(session, payload, updateAuthMetadata) {
  const supabase = getSupabaseAdminClient();
  const section = payload.section || session.section || "directory";
  const table = tableForSection(section);
  const insertPayload = buildInsertPayload(section, payload, session);
  const { data, error } = await supabase.from(table).insert(insertPayload).select("*").single();
  if (error) throw new Error(error.message);

  const nextRef = {
    id: data.id,
    slug: data.slug || insertPayload.slug,
    section
  };
  await updateAuthMetadata(session.user_id, (metadata) => ({
    ...metadata,
    owned_listings: [...(Array.isArray(metadata.owned_listings) ? metadata.owned_listings : []), nextRef]
  }));
  return nextRef;
}

export async function updateDashboardListing(session, id, payload) {
  const supabase = getSupabaseAdminClient();
  const listing = await getOwnedListingById(session, id);
  if (!listing) return null;
  const table = tableForSection(listing.section);
  const updatePayload = buildUpdatePayload(listing.section, payload, listing, session);
  const { error } = await supabase.from(table).update(updatePayload).eq("id", listing.id);
  if (error) throw new Error(error.message);
  return findListing(listing.section, listing.slug);
}

export async function getMarketplaceOrderById(id) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("marketplace_orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMarketplaceOrderStatus(id, status, updates = {}) {
  const supabase = getSupabaseAdminClient();
  const nextItems = updates.items;
  const { error } = await supabase
    .from("marketplace_orders")
    .update({
      status,
      ...(nextItems ? { items: nextItems } : {})
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
