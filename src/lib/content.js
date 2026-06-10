import fs from "node:fs";
import path from "node:path";
import { slugify } from "@/lib/utils";

const contentPath = path.join(process.cwd(), "content", "website-copy.md");
const rawCopy = fs.readFileSync(contentPath, "utf8");

const pageAliases = {
  "/": "HOMEPAGE",
  "/emergency-response/": "24/7 EMERGENCY RESPONSE & UTILITIES",
  "/real-estate/": "PROPERTY & INVESTMENT",
  "/directory/": "VERIFIED DIRECTORY",
  "/business/": "BUSINESS IN GHANA",
  "/snug-haven/": "THE SNUG HAVEN COLLECTION",
  "/diaspora-programme/": "DIASPORA HERITAGE JOURNEYS",
  "/discover/": "SOCIAL & LIFESTYLE",
  "/guides/": "RELOCATION GUIDES HUB",
  "/guides/arriving-in-accra/": "GUIDE: ARRIVING IN ACCRA",
  "/guides/finding-housing-accra/": "GUIDE: FINDING HOUSING IN ACCRA",
  "/guides/international-schools-ghana/": "GUIDE: INTERNATIONAL SCHOOLS IN GHANA",
  "/guides/healthcare-expats-ghana/": "GUIDE: HEALTHCARE FOR EXPATS IN GHANA",
  "/marketplace/": "MARKETPLACE",
  "/list/": "LIST YOUR BUSINESS",
  "/about/": "ABOUT COMMUNLY",
  "/join/": "JOIN THE COMMUNITY",
  "/contact/": "CONTACT",
  "/register/": "VENDOR REGISTRATION",
  "/register/verify/": "VENDOR VERIFICATION FORM",
  "/dashboard/": "VENDOR DASHBOARD",
  "/dashboard/listings/new/": "CREATE LISTING",
  "/vendors/[slug]/": "VENDOR PUBLIC PROFILE",
  "/directory/[category]/": "DIRECTORY CATEGORY PAGE",
  "/directory/[category]/[slug]/": "INDIVIDUAL DIRECTORY LISTING"
};

const pages = parsePages(rawCopy);
const pagesByPath = new Map(
  pages.map((page) => [normalisePath(page.url), page])
);

export function getPageContent(route) {
  const pathKey = normalisePath(route);
  return pagesByPath.get(pathKey) ?? pages.find((page) => page.title === pageAliases[pathKey]);
}

export function getAllPageContent() {
  return pages;
}

export function getSection(pageRoute, sectionTitle) {
  const page = getPageContent(pageRoute);
  if (!page) return null;
  return page.sections.find((section) => section.title === sectionTitle) ?? null;
}

export function getSectionsByTitle(page, sectionTitles = []) {
  const sections = page?.sections ?? [];
  const lookup = new Map(sections.map((section) => [section.title, section]));
  return sectionTitles.map((title, index) => lookup.get(title) ?? sections[index] ?? null);
}

function parsePages(markdown) {
  return markdown
    .split(/\n# PAGE /)
    .slice(1)
    .map((part) => `# PAGE ${part}`.trim())
    .map((block) => {
      const heading = block.split("\n")[0].trim();
      const titleMatch = heading.match(/^# PAGE\s+(.+?)\s+—\s+(.+)$/);
      const urlMatch = block.match(/\*\*URL:\s*([^*]+)\*\*/);
      const sections = [...block.matchAll(/^## Section\s+[^:]+:\s*(.+)\n([\s\S]*?)(?=^## Section\s+[^:]+:|(?![\s\S]))/gm)]
        .map((match) => parseSection(match[1].trim(), match[2].trim()));

      return {
        id: titleMatch?.[1]?.trim() ?? heading,
        title: titleMatch?.[2]?.trim() ?? heading,
        slug: slugify(titleMatch?.[2] ?? heading),
        url: urlMatch?.[1]?.trim() ?? "",
        sections
      };
    });
}

function parseSection(title, body) {
  const lines = body.split("\n");
  const section = { title, fields: {}, blocks: [], loose: [] };
  let currentTarget = section;
  let currentField = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line === "---" || line.startsWith("*[DEV NOTE")) {
      currentField = null;
      continue;
    }

    const blockMatch = line.match(/^\*\*((?:Card|Panel|Step|Row|Column|Sub-section|Belief)\s*[^*]*)\*\*(?:\s+\*\((.+?)\)\*)?$/i);
    if (blockMatch) {
      const descriptor = blockMatch[1];
      const prefix = descriptor.match(/^(Card|Panel|Step|Row|Column|Sub-section|Belief)/i)?.[1]?.toLowerCase() ?? "panel";
      const kind = prefix === "sub-section" || prefix === "belief" ? "panel" : prefix;
      const blockTitle = descriptor
        .replace(/^(?:Card|Panel|Step|Row|Column|Sub-section|Belief)\s*[A-Za-z0-9-]*(?:\s+—\s+)?/i, "")
        .trim();
      currentTarget = {
        type: kind,
        label: descriptor,
        title: blockTitle || descriptor,
        note: blockMatch[2] ?? "",
        fields: {}
      };
      section.blocks.push(currentTarget);
      currentField = null;
      continue;
    }

    const fieldMatch = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (fieldMatch) {
      const key = fieldMatch[1].trim();
      currentTarget.fields[key] = fieldMatch[2].trim();
      currentField = { target: currentTarget.fields, key };
      continue;
    }

    const plainFieldMatch = line.match(
      /^(Headline|Sub-headline|Body|CTA(?: Button(?: \d+)?)?|Eyebrow|Secondary text|Search bar placeholder|Filter(?: \d+ label| labels)?|Inline CTA|Table headers|Badge text|Sub-text):\s*(.*)$/i
    );
    if (plainFieldMatch) {
      const key = plainFieldMatch[1].trim();
      currentTarget.fields[key] = plainFieldMatch[2].trim();
      currentField = { target: currentTarget.fields, key };
      continue;
    }

    if (currentField) {
      currentField.target[currentField.key] = [currentField.target[currentField.key], line].filter(Boolean).join(" ");
      continue;
    }

    section.loose.push(line);
  }

  return section;
}

function normalisePath(url) {
  if (!url) return "/";
  const stripped = url
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^[a-z0-9.-]+\.[a-z]{2,}(?=\/|$)/i, "");
  if (!stripped || stripped === "/") return "/";
  return `/${stripped.replace(/^\/+|\/+$/g, "")}/`;
}
