import crypto from "node:crypto";

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sentenceCase(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function groupBy(items, key) {
  return items.reduce((accumulator, item) => {
    const group = typeof key === "function" ? key(item) : item[key];
    accumulator[group] ??= [];
    accumulator[group].push(item);
    return accumulator;
  }, {});
}

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function currency(amount, code = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: code,
    maximumFractionDigits: code === "USD" ? 0 : 0
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, digest] = storedHash.split(":");
  if (!salt || !digest) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(digest, "hex"));
}

export function randomToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

export function parseJson(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function fileToDataUrl(buffer, mime = "image/svg+xml") {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}
