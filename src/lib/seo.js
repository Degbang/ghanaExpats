import { siteConfig } from "@/lib/catalog";

const pageMeta = {
  "/": {
    title: "Ghana Expats — Verified Directory, Guides & Community · GhanaExpats.com",
    description:
      "Ghana’s most trusted expat and diaspora platform. Verified services, relocation guides, and a community of 26,000 people who’ve been exactly where you are."
  },
  "/emergency-response": {
    title: "24/7 Emergency & Utility Services Ghana · GhanaExpats.com",
    description:
      "Pre-vetted emergency security, ambulance, towing, water delivery, and gas swap services — operational around the clock in Ghana."
  },
  "/real-estate": {
    title: "Find Property in Ghana — Rentals, Sales & Short Stays · GhanaExpats.com",
    description:
      "Browse vetted residential and commercial property listings in Ghana. Short-stay serviced apartments, long-term leases, land, and sales — agents checked by Communly."
  },
  "/directory": {
    title: "Verified Expat Services Directory — Ghana · GhanaExpats.com",
    description:
      "Search Ghana’s most comprehensive verified directory: healthcare, legal, schools, transport, domestic help and more. Every Communly Verified listing has been checked."
  },
  "/snug-haven": {
    title: "The Snug Haven Collection — Fieldwork Accommodation Across Ghana · GhanaExpats.com",
    description:
      "Work-ready short-stay accommodation and research support for academics, consultants, and NGO personnel in Ghana. From US$35/night."
  },
  "/diaspora-programme": {
    title: "Diaspora Heritage Journeys — Heritage & Cultural Immersion · GhanaExpats.com",
    description:
      "Transformative heritage journeys for the African diaspora and Black African returnees across six African nations. Ancestral reconnection, homestays, and cultural immersion."
  },
  "/business": {
    title: "Doing Business in Ghana — Registration, Compliance & Advisory · GhanaExpats.com",
    description:
      "Practical guide to business registration, statutory compliance, and due diligence in Ghana. Verified corporate lawyers and advisory professionals listed."
  },
  "/guides/arriving-in-accra": {
    title: "Arriving in Accra: Your First 30 Days Guide · GhanaExpats.com",
    description:
      "Everything you need for your first month in Accra — SIM cards, money, accommodation, healthcare, and staying safe. Written by people who live here."
  },
  "/guides/finding-housing-accra": {
    title: "Finding Housing in Accra: The Expat Guide · GhanaExpats.com",
    description:
      "How the Accra rental market actually works. Neighbourhoods, agents, fees, lease advice, and how to avoid the most common scams. Updated 2026."
  },
  "/guides/international-schools-ghana": {
    title: "International Schools in Ghana — 2026 Guide · GhanaExpats.com",
    description:
      "Comprehensive guide to international and accredited schools in Ghana: curriculum options, fees, neighbourhoods, admission timelines, and parent recommendations."
  },
  "/guides/healthcare-expats-ghana": {
    title: "Healthcare for Expats in Ghana · GhanaExpats.com",
    description:
      "The expat guide to healthcare in Ghana. Private hospitals, international insurance, pharmacies, dental care, and emergency procedures — honest and up to date."
  },
  "/marketplace": {
    title: "Ghana Expats Marketplace — Buy, Sell & Find Services · GhanaExpats.com",
    description:
      "Community marketplace for expats and diaspora in Ghana. Verified sellers. Physical goods, digital products, and professional services."
  }
};

export function buildMetadata(pathname, overrides = {}) {
  const base = pageMeta[pathname] ?? {
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description:
      "Verified services, practical guides, and a trusted community platform for life in Ghana."
  };
  return {
    title: overrides.title ?? base.title,
    description: overrides.description ?? base.description
  };
}
