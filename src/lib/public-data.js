import { directoryCategories } from "@/lib/catalog";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

function categorySlug(value = "") {
  const match = directoryCategories.find((item) => item.label === value);
  return match?.slug ?? slugify(value);
}

function excerpt(value = "", limit = 180) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}

function parsePrice(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function withDefaultArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeDirectoryListing(row) {
  return {
    id: row.id,
    section: "directory",
    slug: row.slug,
    title: row.name,
    category: row.category,
    category_slug: categorySlug(row.category),
    location: row.location || "Ghana",
    summary: excerpt(row.description),
    description: row.description || "",
    price: null,
    currency: "GHS",
    created_at: row.created_at,
    featured: Boolean(row.top),
    verified_tier: row.verified ? "Communly Verified" : "Verified listing",
    vendor_slug: row.slug,
    meta: {
      services: withDefaultArray(row.services),
      hours: row.hours || "",
      image: row.image || "",
      phone: row.phone || "",
      email: row.email || "",
      website: row.website || "",
      whatsapp: row.phone || ""
    },
    reviews: []
  };
}

function normalizeMarketplaceListing(row) {
  return {
    id: row.id,
    section: "marketplace",
    slug: row.slug,
    title: row.title,
    category: row.category,
    category_slug: slugify(row.category),
    location: "Delivery available across Ghana",
    summary: excerpt(row.description),
    description: row.description || "",
    price: parsePrice(row.sale_price) ?? parsePrice(row.original_price),
    currency: "GHS",
    created_at: row.created_at,
    featured: Boolean(row.top),
    verified_tier: "Verified seller",
    vendor_slug: slugify(row.category || "seller"),
    meta: {
      condition: row.discount ? "On offer" : "Available",
      delivery: "Delivery or arranged pickup",
      features: withDefaultArray(row.features),
      images: withDefaultArray(row.images),
      inStock: row.in_stock
    },
    reviews: []
  };
}

function normalizePropertyListing(row) {
  return {
    id: row.id,
    section: "real-estate",
    slug: row.slug,
    title: row.title,
    category: row.sale_type || row.type || "Property",
    category_slug: slugify(row.sale_type || row.type || "property"),
    location: row.location || "Ghana",
    summary: excerpt(row.description),
    description: row.description || "",
    price: parsePrice(row.price),
    currency: "USD",
    created_at: row.created_at,
    featured: Boolean(row.top),
    verified_tier: "Communly Verified",
    vendor_slug: slugify(row.type || "property"),
    meta: {
      type: row.type || "",
      condition: row.condition || "",
      bedrooms: null,
      furnished: null,
      features: withDefaultArray(row.features),
      images: withDefaultArray(row.images)
    },
    reviews: []
  };
}

function normalizeAccommodationListing(row) {
  return {
    id: row.id,
    section: "snug-haven",
    slug: row.slug,
    title: row.title,
    category: row.type || "Accommodation",
    category_slug: slugify(row.type || "accommodation"),
    location: row.location || "Ghana",
    summary: excerpt(row.description),
    description: row.description || "",
    price: parsePrice(row.price),
    currency: "USD",
    created_at: row.created_at,
    featured: Boolean(row.top),
    verified_tier: "Fieldwork-ready stay",
    vendor_slug: "snug-haven",
    meta: {
      type: row.type || "",
      bedrooms: row.bedrooms || null,
      bathrooms: row.bathrooms || null,
      amenities: withDefaultArray(row.amenities),
      features: withDefaultArray(row.features),
      images: withDefaultArray(row.images),
      parking: row.parking || ""
    },
    reviews: []
  };
}

async function fetchTable(table, orderColumn = "created_at") {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from(table).select("*").order("top", { ascending: false, nullsFirst: false }).order(orderColumn, { ascending: false });
  if (error) {
    throw new Error(`Failed to fetch ${table}: ${error.message}`);
  }
  return data ?? [];
}

export async function listListings(section) {
  switch (section) {
    case "directory":
      return (await fetchTable("businesses")).map(normalizeDirectoryListing);
    case "marketplace":
      return (await fetchTable("products")).map(normalizeMarketplaceListing);
    case "real-estate":
      return (await fetchTable("properties")).map(normalizePropertyListing);
    case "snug-haven":
      return (await fetchTable("accommodations")).map(normalizeAccommodationListing);
    default:
      return [];
  }
}

export async function findListing(section, slug) {
  const listings = await listListings(section);
  return listings.find((listing) => listing.slug === slug) ?? null;
}

export async function listDirectoryByCategory(categorySlugValue) {
  const listings = await listListings("directory");
  return listings.filter((listing) => listing.category_slug === categorySlugValue);
}

export async function findVendorProfile(slug) {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("businesses").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch vendor profile: ${error.message}`);
  }
  if (!data) return null;

  const listing = normalizeDirectoryListing(data);
  return {
    slug: data.slug,
    display_name: data.name,
    verified_tier: data.verified ? "Communly Verified" : "Verified listing",
    role: "Business",
    category: data.category,
    bio: data.description || "",
    contact_email: data.email || "",
    listings: [listing]
  };
}
