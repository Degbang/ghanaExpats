import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { addDays } from "date-fns";
import {
  seedDirectoryListings,
  seedMarketplaceListings,
  seedMessages,
  seedPayments,
  seedPropertyListings,
  seedSnugHavenListings,
  seedUsers,
  seedVendorProfiles
} from "./catalog.js";
import { hashPassword, parseJson, randomToken, slugify } from "./utils.js";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "ghana-expats.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

initialise();

function initialise() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      business_name TEXT,
      section TEXT,
      category TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      section TEXT NOT NULL,
      category TEXT NOT NULL,
      website TEXT,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      review_notes TEXT,
      verification_complete INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      section TEXT NOT NULL,
      payload TEXT NOT NULL,
      uploads TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      vendor_slug TEXT,
      section TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT,
      category_slug TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      verified_tier TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      location TEXT,
      summary TEXT,
      description TEXT,
      price REAL,
      currency TEXT,
      meta TEXT,
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendor_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      user_id INTEGER,
      display_name TEXT NOT NULL,
      verified_tier TEXT,
      role TEXT,
      category TEXT,
      bio TEXT,
      contact_email TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      email TEXT NOT NULL UNIQUE,
      persona TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_slug TEXT NOT NULL,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      kind TEXT NOT NULL,
      status TEXT NOT NULL,
      provider TEXT NOT NULL,
      due_date TEXT,
      paid_at TEXT,
      reference TEXT,
      meta TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_user_id INTEGER,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      meta TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedUsersTable();
  seedProfilesAndListings();
  seedMessagesTable();
  seedPaymentsTable();
}

function seedUsersTable() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (existing.count > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, status, business_name, section, category)
    VALUES (@name, @email, @password_hash, @role, @status, @business_name, @section, @category)
  `);

  const insertApplication = db.prepare(`
    INSERT INTO applications (user_id, section, category, website, description, status, verification_complete)
    VALUES (@user_id, @section, @category, @website, @description, @status, @verification_complete)
  `);

  for (const user of seedUsers) {
    const result = insertUser.run({
      name: user.name,
      email: user.email,
      password_hash: hashPassword(user.password),
      role: user.role,
      status: user.status,
      business_name: user.businessName,
      section: user.section ?? null,
      category: user.category ?? null
    });

    if (user.role !== "admin") {
      insertApplication.run({
        user_id: result.lastInsertRowid,
        section: user.section ?? "directory",
        category: user.category ?? "General",
        website: `https://${slugify(user.businessName)}.example.com`,
        description: `${user.businessName} application record`,
        status: user.status,
        verification_complete: 1
      });
    }
  }
}

function seedProfilesAndListings() {
  const profileCount = db.prepare("SELECT COUNT(*) as count FROM vendor_profiles").get();
  if (profileCount.count === 0) {
    const insertProfile = db.prepare(`
      INSERT INTO vendor_profiles (slug, user_id, display_name, verified_tier, role, category, bio, contact_email)
      VALUES (@slug, @user_id, @display_name, @verified_tier, @role, @category, @bio, @contact_email)
    `);

    for (const profile of seedVendorProfiles) {
      const user = db.prepare("SELECT id FROM users WHERE business_name = ?").get(profile.displayName);
      insertProfile.run({
        slug: profile.slug,
        user_id: user?.id ?? null,
        display_name: profile.displayName,
        verified_tier: profile.verifiedTier,
        role: profile.role,
        category: profile.category,
        bio: profile.bio,
        contact_email: profile.contactEmail
      });
    }
  }

  const listingCount = db.prepare("SELECT COUNT(*) as count FROM listings").get();
  if (listingCount.count > 0) return;

  const insertListing = db.prepare(`
    INSERT INTO listings (user_id, vendor_slug, section, slug, title, category, category_slug, status, verified_tier, featured, location, summary, description, price, currency, meta, expires_at)
    VALUES (@user_id, @vendor_slug, @section, @slug, @title, @category, @category_slug, @status, @verified_tier, @featured, @location, @summary, @description, @price, @currency, @meta, @expires_at)
  `);
  const insertReview = db.prepare(`
    INSERT INTO reviews (listing_slug, author, rating, body)
    VALUES (@listing_slug, @author, @rating, @body)
  `);

  const vendorUser = db.prepare("SELECT id FROM users WHERE email = 'vendor@ghanaexpats.test'").get();
  const sellerUser = db.prepare("SELECT id FROM users WHERE email = 'seller@ghanaexpats.test'").get();
  const hostUser = db.prepare("SELECT id FROM users WHERE email = 'host@ghanaexpats.test'").get();

  for (const listing of seedDirectoryListings) {
    insertListing.run({
      user_id: vendorUser?.id ?? null,
      vendor_slug: slugify(listing.title),
      section: "directory",
      slug: listing.slug,
      title: listing.title,
      category: listing.category,
      category_slug: listing.categorySlug,
      status: "published",
      verified_tier: listing.verifiedTier,
      featured: listing.verifiedTier === "Communly Verified" ? 1 : 0,
      location: listing.location,
      summary: listing.summary,
      description: listing.about,
      price: null,
      currency: null,
      meta: JSON.stringify({
        phone: listing.phone,
        whatsapp: listing.whatsapp,
        email: listing.email,
        services: listing.services
      }),
      expires_at: addDays(new Date(), 28).toISOString()
    });

    for (const review of listing.reviews) {
      insertReview.run({
        listing_slug: listing.slug,
        author: review.author,
        rating: review.rating,
        body: review.body
      });
    }
  }

  for (const property of seedPropertyListings) {
    insertListing.run({
      user_id: vendorUser?.id ?? null,
      vendor_slug: property.vendorSlug,
      section: "real-estate",
      slug: property.slug,
      title: property.title,
      category: property.type,
      category_slug: slugify(property.type),
      status: "published",
      verified_tier: property.verifiedTier,
      featured: property.slug === "airport-residential-workstay-suite" ? 1 : 0,
      location: property.location,
      summary: property.summary,
      description: property.description,
      price: property.price,
      currency: property.currency,
      meta: JSON.stringify({
        bedrooms: property.bedrooms,
        furnished: property.furnished,
        features: property.features,
        type: property.type
      }),
      expires_at: addDays(new Date(), 30).toISOString()
    });
  }

  for (const listing of seedMarketplaceListings) {
    insertListing.run({
      user_id: sellerUser?.id ?? null,
      vendor_slug: "heritage-market-collective",
      section: "marketplace",
      slug: listing.slug,
      title: listing.title,
      category: listing.category,
      category_slug: listing.categorySlug,
      status: "published",
      verified_tier: listing.verifiedTier,
      featured: 0,
      location: listing.location,
      summary: listing.summary,
      description: listing.description,
      price: listing.price,
      currency: listing.currency,
      meta: JSON.stringify({
        condition: listing.condition,
        delivery: listing.delivery
      }),
      expires_at: addDays(new Date(), 30).toISOString()
    });
  }

  for (const listing of seedSnugHavenListings) {
    insertListing.run({
      user_id: hostUser?.id ?? null,
      vendor_slug: slugify(listing.title),
      section: "snug-haven",
      slug: listing.slug,
      title: listing.title,
      category: "Snug Haven Collection",
      category_slug: "snug-haven-collection",
      status: "published",
      verified_tier: "Communly Verified",
      featured: 0,
      location: listing.location,
      summary: listing.summary,
      description: listing.description,
      price: listing.priceFrom,
      currency: listing.currency,
      meta: JSON.stringify({
        amenities: listing.amenities
      }),
      expires_at: addDays(new Date(), 60).toISOString()
    });
  }
}

function seedMessagesTable() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM messages").get();
  if (existing.count > 0) return;
  const insert = db.prepare(`
    INSERT INTO messages (type, subject, message, email)
    VALUES (@type, @subject, @message, @email)
  `);
  seedMessages.forEach((message) => insert.run(message));
}

function seedPaymentsTable() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM payments").get();
  if (existing.count > 0) return;
  const insert = db.prepare(`
    INSERT INTO payments (user_id, amount, currency, kind, status, provider, due_date, paid_at, reference, meta)
    VALUES (@user_id, @amount, @currency, @kind, @status, @provider, @due_date, @paid_at, @reference, @meta)
  `);

  seedPayments.forEach((payment) => {
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(payment.email);
    insert.run({
      user_id: user?.id ?? null,
      amount: payment.amount,
      currency: payment.currency,
      kind: payment.kind,
      status: payment.status,
      provider: payment.provider,
      due_date: payment.dueDate,
      paid_at: payment.paidAt ?? null,
      reference: randomToken(8),
      meta: JSON.stringify({ mode: "mock" })
    });
  });
}

export function listListings(section) {
  return db.prepare("SELECT * FROM listings WHERE section = ? AND status != 'deleted' ORDER BY featured DESC, created_at DESC").all(section).map(hydrateListing);
}

export function findListing(section, slug) {
  const listing = db.prepare("SELECT * FROM listings WHERE section = ? AND slug = ?").get(section, slug);
  return listing ? hydrateListing(listing) : null;
}

export function listDirectoryByCategory(categorySlug) {
  return db.prepare("SELECT * FROM listings WHERE section = 'directory' AND category_slug = ? ORDER BY featured DESC, created_at DESC").all(categorySlug).map(hydrateListing);
}

export function listVendorProfiles() {
  return db.prepare("SELECT * FROM vendor_profiles ORDER BY display_name").all();
}

export function findVendorProfile(slug) {
  const profile = db.prepare("SELECT * FROM vendor_profiles WHERE slug = ?").get(slug);
  if (!profile) return null;
  const listings = db.prepare("SELECT * FROM listings WHERE vendor_slug = ? ORDER BY created_at DESC").all(slug).map(hydrateListing);
  return { ...profile, listings };
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function createUserSession(userId) {
  const token = randomToken(24);
  const expiresAt = addDays(new Date(), 14).toISOString();
  db.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);
  return token;
}

export function getSession(token) {
  return db.prepare(`
    SELECT sessions.*, users.name, users.email, users.role, users.status, users.business_name, users.section, users.category
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE token = ? AND expires_at > datetime('now')
  `).get(token);
}

export function deleteSession(token) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function createApplication(payload) {
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, status, business_name, section, category)
    VALUES (@name, @email, @password_hash, @role, 'pending', @business_name, @section, @category)
  `);
  const result = insertUser.run({
    name: payload.contactName,
    email: payload.email,
    password_hash: hashPassword(payload.password),
    role: payload.section === "marketplace" ? "registered_seller" : payload.section === "snug-haven" ? "snug_haven_partner" : "registered_vendor",
    business_name: payload.businessName,
    section: payload.section,
    category: payload.category
  });

  db.prepare(`
    INSERT INTO applications (user_id, section, category, website, description, status, verification_complete)
    VALUES (?, ?, ?, ?, ?, 'pending', 0)
  `).run(result.lastInsertRowid, payload.section, payload.category, payload.website ?? null, payload.description ?? null);

  logAudit(null, "application.created", "application", String(result.lastInsertRowid), payload);
  return Number(result.lastInsertRowid);
}

export function saveVerification(userId, section, payload, uploads = []) {
  db.prepare(`
    INSERT INTO verifications (user_id, section, payload, uploads)
    VALUES (?, ?, ?, ?)
  `).run(userId, section, JSON.stringify(payload), JSON.stringify(uploads));

  db.prepare(`
    UPDATE applications
    SET verification_complete = 1, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(userId);
}

export function createMessage(payload) {
  db.prepare(`
    INSERT INTO messages (user_id, type, subject, message, email, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, 'open')
  `).run(payload.userId ?? null, payload.type ?? "general", payload.subject, payload.message, payload.email, payload.phone ?? null);
}

export function createNewsletterSubscription(payload) {
  db.prepare(`
    INSERT OR REPLACE INTO newsletter_subscriptions (first_name, email, persona)
    VALUES (?, ?, ?)
  `).run(payload.firstName ?? null, payload.email, payload.persona ?? null);
}

export function createListing(payload) {
  const slug = payload.slug || slugify(payload.title);
  db.prepare(`
    INSERT INTO listings (user_id, vendor_slug, section, slug, title, category, category_slug, status, verified_tier, featured, location, summary, description, price, currency, meta, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    payload.userId ?? null,
    payload.vendorSlug ?? null,
    payload.section,
    slug,
    payload.title,
    payload.category,
    slugify(payload.category || payload.section),
    payload.status ?? "published",
    payload.verifiedTier ?? "Free",
    payload.featured ? 1 : 0,
    payload.location ?? null,
    payload.summary ?? null,
    payload.description ?? null,
    payload.price ?? null,
    payload.currency ?? null,
    JSON.stringify(payload.meta ?? {}),
    payload.expiresAt ?? addDays(new Date(), payload.section === "real-estate" ? 30 : 30).toISOString()
  );
}

export function updateListing(id, payload) {
  db.prepare(`
    UPDATE listings
    SET title = @title,
        category = @category,
        category_slug = @category_slug,
        location = @location,
        summary = @summary,
        description = @description,
        price = @price,
        currency = @currency,
        status = @status,
        meta = @meta,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id,
    title: payload.title,
    category: payload.category,
    category_slug: slugify(payload.category),
    location: payload.location,
    summary: payload.summary,
    description: payload.description,
    price: payload.price ?? null,
    currency: payload.currency ?? null,
    status: payload.status ?? "published",
    meta: JSON.stringify(payload.meta ?? {})
  });
}

export function getListingById(id) {
  const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(id);
  return listing ? hydrateListing(listing) : null;
}

export function getApplicationQueue() {
  return db.prepare(`
    SELECT applications.*, users.name, users.email, users.business_name
    FROM applications
    JOIN users ON users.id = applications.user_id
    ORDER BY applications.created_at DESC
  `).all();
}

export function getMessagesInbox() {
  return db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
}

export function getPaymentsForUser(userId) {
  return db.prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC").all(userId);
}

export function getPaymentById(id) {
  const payment = db.prepare("SELECT * FROM payments WHERE id = ?").get(id);
  if (!payment) return null;
  return {
    ...payment,
    meta: parseJson(payment.meta, {})
  };
}

export function updatePaymentReference(id, reference, meta = {}) {
  const current = getPaymentById(id);
  if (!current) return null;
  const nextMeta = {
    ...(current.meta ?? {}),
    ...meta
  };
  db.prepare(`
    UPDATE payments
    SET reference = ?, meta = ?
    WHERE id = ?
  `).run(reference, JSON.stringify(nextMeta), id);
  return getPaymentById(id);
}

export function markPaymentPaid(id, meta = {}) {
  const current = getPaymentById(id);
  if (!current) return null;
  const nextMeta = {
    ...(current.meta ?? {}),
    ...meta
  };
  db.prepare(`
    UPDATE payments
    SET status = 'paid', paid_at = ?, meta = ?
    WHERE id = ?
  `).run(meta.verifiedAt ?? new Date().toISOString(), JSON.stringify(nextMeta), id);
  return getPaymentById(id);
}

export function getRevenueSummary() {
  const totals = db.prepare(`
    SELECT kind, SUM(amount) as total
    FROM payments
    WHERE status IN ('paid', 'scheduled')
    GROUP BY kind
  `).all();
  return totals;
}

export function logAudit(actorUserId, action, targetType, targetId, meta = {}) {
  db.prepare(`
    INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, meta)
    VALUES (?, ?, ?, ?, ?)
  `).run(actorUserId ?? null, action, targetType, targetId, JSON.stringify(meta));
}

function hydrateListing(listing) {
  return {
    ...listing,
    meta: parseJson(listing.meta, {}),
    reviews: db.prepare("SELECT * FROM reviews WHERE listing_slug = ? ORDER BY created_at DESC").all(listing.slug)
  };
}
