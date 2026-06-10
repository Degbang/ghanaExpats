"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession, loginWithPassword, logout as performLogout, registerSupabaseUser, updateAuthUserMetadata } from "@/lib/auth";
import { createDashboardListing, getOwnedListingById, updateDashboardListing } from "@/lib/private-data";
import { checkRateLimit } from "@/lib/rate-limit";
import { createBusinessLead, createContactSubmission, createNewsletterSubscription as createSupabaseNewsletterSubscription, updateBusinessLeadVerification } from "@/lib/public-mutations";
import { slugify } from "@/lib/utils";

const publicUploadDir = path.join(process.cwd(), "public", "uploads");

const registrationSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  section: z.string().min(2),
  category: z.string().min(2),
  website: z.string().optional(),
  description: z.string().min(10),
  password: z.string().min(8),
  humanCheck: z.string().toLowerCase().refine((value) => value === "ghana", "Human check failed.")
});

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
  humanCheck: z.string().toLowerCase().refine((value) => value === "ghana")
});

const newsletterSchema = z.object({
  firstName: z.string().optional(),
  email: z.string().email(),
  persona: z.string().optional(),
  humanCheck: z.string().toLowerCase().refine((value) => value === "ghana")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const listingSchema = z.object({
  title: z.string().min(3),
  section: z.string().min(2),
  category: z.string().min(2),
  location: z.string().min(2),
  summary: z.string().min(10),
  description: z.string().min(20),
  price: z.coerce.number().optional(),
  currency: z.string().optional()
});

function fail(pathname, reason) {
  redirect(`${pathname}?error=${encodeURIComponent(reason)}`);
}

function assertPublicHumanCheck(formData, pathname) {
  const honeypot = formData.get("website_confirmation");
  if (honeypot) {
    fail(pathname, "Submission blocked.");
  }
}

async function saveUploads(files = [], prefix = "upload") {
  await fs.mkdir(publicUploadDir, { recursive: true });
  const saved = [];
  for (const file of files) {
    if (!file || typeof file.name !== "string" || file.size === 0) continue;
    const ext = path.extname(file.name) || ".bin";
    const fileName = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    const targetPath = path.join(publicUploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, buffer);
    saved.push(`/uploads/${fileName}`);
  }
  return saved;
}

export async function loginAction(formData) {
  const limiter = checkRateLimit(`login:${formData.get("email")}`);
  if (!limiter.ok) {
    fail("/login", `Too many attempts. Retry in ${limiter.retryAfter}s.`);
  }
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!parsed.success) {
    fail("/login", "Please enter a valid email and password.");
  }
  const result = await loginWithPassword(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    fail("/login", result.error);
  }
  redirect(result.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await performLogout();
  redirect("/");
}

export async function contactAction(formData) {
  assertPublicHumanCheck(formData, "/contact");
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    humanCheck: formData.get("human_check")
  });
  if (!parsed.success) {
    fail("/contact", "Please complete every required field.");
  }
  await createContactSubmission({
    inquiryType: parsed.data.subject,
    fullName: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message
  });
  redirect("/contact?submitted=1");
}

export async function newsletterAction(formData) {
  assertPublicHumanCheck(formData, "/join");
  const parsed = newsletterSchema.safeParse({
    firstName: formData.get("first_name"),
    email: formData.get("email"),
    persona: formData.get("persona"),
    humanCheck: formData.get("human_check")
  });
  if (!parsed.success) {
    fail("/join", "Please complete the newsletter form.");
  }
  await createSupabaseNewsletterSubscription(parsed.data);
  redirect("/join?subscribed=1");
}

export async function registerAction(formData) {
  const limiter = checkRateLimit(`register:${formData.get("email")}`);
  if (!limiter.ok) {
    fail("/register", `Too many attempts. Retry in ${limiter.retryAfter}s.`);
  }
  assertPublicHumanCheck(formData, "/register");
  const parsed = registrationSchema.safeParse({
    businessName: formData.get("business_name"),
    contactName: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    section: formData.get("section"),
    category: formData.get("category"),
    website: formData.get("website"),
    description: formData.get("description"),
    password: formData.get("password"),
    humanCheck: formData.get("human_check")
  });
  if (!parsed.success) {
    fail("/register", "Please complete all required registration fields.");
  }
  const application = await createBusinessLead({
    businessName: parsed.data.businessName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    section: parsed.data.section,
    category: parsed.data.category,
    website: parsed.data.website,
    description: parsed.data.description,
    location: "Ghana",
    servicesOffered: parsed.data.description,
    paymentModel: "Pending review"
  });
  const authResult = await registerSupabaseUser({
    email: parsed.data.email,
    password: parsed.data.password,
    businessName: parsed.data.businessName,
    contactName: parsed.data.contactName,
    phone: parsed.data.phone,
    website: parsed.data.website,
    section: parsed.data.section,
    category: parsed.data.category,
    applicationId: application.id
  });
  if (!authResult.ok) {
    fail("/register", authResult.error);
  }
  redirect(`/register/verify?created=1&user=${application.id}`);
}

export async function verificationAction(formData) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }
  const uploads = await saveUploads(
    [
      formData.get("document_1"),
      formData.get("document_2"),
      formData.get("document_3"),
      formData.get("photo_1"),
      formData.get("photo_2"),
      formData.get("photo_3")
    ],
    "verification"
  );
  const payload = Object.fromEntries(formData.entries());
  await updateBusinessLeadVerification(session.application_id, {
    ...payload,
    uploads
  });
  await updateAuthUserMetadata(session.user_id, (metadata) => ({
    ...metadata,
    status: "pending_review",
    verification_submitted_at: new Date().toISOString(),
    verification_uploads: uploads
  }));
  redirect("/dashboard?verified=1");
}

export async function freeListingAction(formData) {
  assertPublicHumanCheck(formData, "/list");
  const session = await getCurrentSession();
  const payload = {
    title: formData.get("business_name"),
    section: "directory",
    category: formData.get("category"),
    location: formData.get("location"),
    summary: formData.get("description"),
    description: formData.get("description"),
    verifiedTier: "Free",
    vendorSlug: slugify(formData.get("business_name") || "vendor"),
    userId: session?.user_id ?? null,
    meta: {
      contactName: formData.get("contact_name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      website: formData.get("website")
    }
  };
  const parsed = listingSchema.safeParse(payload);
  if (!parsed.success) {
    fail("/list", "Please complete the free listing form.");
  }
  await createBusinessLead({
    businessName: payload.title,
    contactName: payload.meta.contactName,
    email: payload.meta.email,
    phone: payload.meta.phone,
    section: "directory",
    category: payload.category,
    website: payload.meta.website,
    description: payload.description,
    location: payload.location,
    servicesOffered: payload.summary,
    paymentModel: "Free listing"
  });
  redirect("/list?submitted=1");
}

export async function dashboardListingCreateAction(formData) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const payload = {
    title: formData.get("title"),
    section: formData.get("section") || session.section || "directory",
    category: formData.get("category") || session.category || "General",
    location: formData.get("location"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    price: formData.get("price") || undefined,
    currency: formData.get("currency") || "GHS",
    userId: session.user_id,
    vendorSlug: slugify(session.business_name || session.name),
    verifiedTier: session.status === "approved" ? "Communly Verified" : "Free",
    meta: {
      bedrooms: formData.get("bedrooms") || null,
      condition: formData.get("condition") || null,
      furnished: formData.get("furnished") || null,
      delivery: formData.get("delivery") || null,
      features: String(formData.get("features") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }
  };
  const parsed = listingSchema.safeParse(payload);
  if (!parsed.success) {
    fail("/dashboard/listings/new", "Please complete all required listing fields.");
  }
  await createDashboardListing(session, payload, updateAuthUserMetadata);
  redirect("/dashboard?listingCreated=1");
}

export async function dashboardListingUpdateAction(formData) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const id = String(formData.get("id"));
  const existing = await getOwnedListingById(session, id);
  if (!existing) {
    fail("/dashboard", "Listing not found.");
  }
  const payload = {
    title: formData.get("title"),
    category: formData.get("category"),
    location: formData.get("location"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    price: formData.get("price") || undefined,
    currency: formData.get("currency") || existing.currency || "GHS",
    status: formData.get("status") || existing.status,
    meta: {
      ...existing.meta,
      bedrooms: formData.get("bedrooms") || existing.meta.bedrooms || null,
      furnished: formData.get("furnished") || existing.meta.furnished || null,
      condition: formData.get("condition") || existing.meta.condition || null,
      delivery: formData.get("delivery") || existing.meta.delivery || null,
      features: String(formData.get("features") || existing.meta.features || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }
  };
  await updateDashboardListing(session, id, payload);
  redirect("/dashboard?listingUpdated=1");
}
