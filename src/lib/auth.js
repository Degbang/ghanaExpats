import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient, getSupabasePublicClient } from "@/lib/supabase";

export const SESSION_COOKIE = "ghana_expats_session";

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || "ghana-expats-dev-secret";
}

function signValue(value) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSessionCookie(payload) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${signValue(encoded)}`;
}

function decodeSessionCookie(value) {
  if (!value || !value.includes(".")) return null;
  const [encoded, signature] = value.split(".");
  const expected = signValue(encoded);
  const isValid =
    signature &&
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!isValid) return null;

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function toAppSession(user) {
  const metadata = user.user_metadata || {};
  return {
    user_id: user.id,
    email: user.email,
    name: metadata.contact_name || metadata.business_name || user.email,
    role: metadata.role || "registered_vendor",
    status: metadata.status || "pending",
    business_name: metadata.business_name || "",
    section: metadata.section || "directory",
    category: metadata.category || "",
    application_id: metadata.application_id || null,
    owned_listings: Array.isArray(metadata.owned_listings) ? metadata.owned_listings : [],
    phone: metadata.phone || "",
    website: metadata.website || ""
  };
}

async function persistSessionCookie(user) {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    encodeSessionCookie({
      user_id: user.id,
      email: user.email
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
      path: "/"
    }
  );
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(token);
  if (!payload?.user_id) return null;

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(payload.user_id);
  if (error || !data?.user) return null;
  return toAppSession(data.user);
}

export async function requireSession(allowedRoles = []) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    redirect("/");
  }

  return session;
}

export async function loginWithPassword(email, password) {
  const client = getSupabasePublicClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data?.user) {
    return { ok: false, error: "Invalid email or password." };
  }

  await persistSessionCookie(data.user);
  const session = toAppSession(data.user);
  return { ok: true, role: session.role };
}

export async function registerSupabaseUser({
  email,
  password,
  businessName,
  contactName,
  phone,
  website,
  section,
  category,
  applicationId
}) {
  const admin = getSupabaseAdminClient();
  const role =
    section === "marketplace"
      ? "registered_seller"
      : section === "snug-haven"
        ? "snug_haven_partner"
        : "registered_vendor";

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      status: "pending_review",
      business_name: businessName,
      contact_name: contactName,
      phone,
      website: website || "",
      section,
      category,
      application_id: applicationId,
      owned_listings: []
    }
  });

  if (error || !data?.user) {
    return { ok: false, error: error?.message || "Unable to create account." };
  }

  await persistSessionCookie(data.user);
  return { ok: true, role };
}

export async function updateAuthUserMetadata(userId, updater) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    throw new Error(error?.message || "User not found.");
  }
  const currentMetadata = data.user.user_metadata || {};
  const nextMetadata = await updater(currentMetadata);
  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: nextMetadata
  });
  if (updateError) {
    throw new Error(updateError.message);
  }
  return nextMetadata;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getClientIp() {
  const headerStore = await headers();
  return headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
}

export async function ensureAdminIp() {
  const ip = await getClientIp();
  const allowList = (process.env.ADMIN_ALLOWED_IPS ?? "127.0.0.1,::1,::ffff:127.0.0.1").split(",").map((entry) => entry.trim());
  return allowList.includes(ip);
}
