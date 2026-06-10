import { addDays, subDays } from "date-fns";
import { slugify } from "./utils.js";

export const siteConfig = {
  name: "GhanaExpats.com",
  brand: "Communly",
  tagline: "Ghana, without the guesswork.",
  memberCount: "26,500",
  primaryNav: [
    { label: "Emergency", href: "/emergency-response" },
    { label: "Property", href: "/real-estate" },
    { label: "Directory", href: "/directory" },
    { label: "Business", href: "/business" },
    { label: "Guides", href: "/guides" },
    { label: "Research Hub", href: "/snug-haven" },
    { label: "Diaspora", href: "/diaspora-programme" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Social", href: "/discover" }
  ],
  footerColumns: [
    {
      title: "Explore",
      links: [
        ["Directory", "/directory"],
        ["Property & Investment", "/real-estate"],
        ["Marketplace", "/marketplace"],
        ["The Snug Haven Collection", "/snug-haven"],
        ["Diaspora Heritage Journeys", "/diaspora-programme"],
        ["Business in Ghana", "/business"],
        ["Social & Lifestyle", "/discover"]
      ]
    },
    {
      title: "Guides",
      links: [
        ["Arriving in Accra", "/guides/arriving-in-accra"],
        ["Finding Housing", "/guides/finding-housing-accra"],
        ["International Schools", "/guides/international-schools-ghana"],
        ["Healthcare", "/guides/healthcare-expats-ghana"],
        ["Driving in Accra", "/guides"],
        ["Visa & Immigration", "/guides"],
        ["Cost of Living", "/guides"],
        ["Safety & Security", "/guides"]
      ]
    },
    {
      title: "Work With Us",
      links: [
        ["List Your Business", "/list"],
        ["Register as a Vendor", "/register"],
        ["Communly Verified Badge", "/directory"],
        ["Featured Placement", "/contact"],
        ["Partner with Communly", "/contact"]
      ]
    },
    {
      title: "About",
      links: [
        ["About Communly", "/about"],
        ["Contact", "/contact"],
        ["Join the Community", "/join"],
        ["Privacy Policy", "/contact"],
        ["Terms of Use", "/contact"]
      ]
    }
  ],
  socialLinks: [
    { label: "Facebook", href: "/join" },
    { label: "Instagram", href: "/join" },
    { label: "WhatsApp", href: "https://wa.me/233201497813" }
  ]
};

export const directoryCategories = [
  "Healthcare",
  "Legal & Solicitors",
  "Schools & Education",
  "Security & Guarding",
  "Immigration & Visa",
  "Customs & Clearance",
  "Transport & Logistics",
  "Home Services",
  "Domestic Support",
  "Nanny & Childcare",
  "Chauffeur Services",
  "Car Rental",
  "Beauty & Wellness",
  "Food & Catering",
  "Event Planning",
  "Photography & Media",
  "IT & Tech Support",
  "Shipping & Removals",
  "Financial & Banking",
  "Fitness & Sport",
  "Language & Tutoring",
  "Pet Care & Vets",
  "Mental Health",
  "Religious & Pastoral",
  "Artisans & Trades",
  "Emergency Contacts",
  "Tours & Travel",
  "Arts & Culture"
].map((label, index) => ({
  id: index + 1,
  label,
  slug: slugify(label),
  icon: "category"
}));

export const marketplaceCategories = [
  "Electronics & Tech",
  "Furniture & Home",
  "Clothing & Fashion",
  "Books & Education",
  "Food & Groceries",
  "Professional Services",
  "Digital Products",
  "Events & Experiences",
  "Vehicles",
  "Arts & Crafts",
  "Baby & Kids",
  "Other"
].map((label) => ({
  label,
  slug: slugify(label)
}));

export const propertyTypes = [
  "Short-stay serviced apartment",
  "Mid-term rental",
  "Long-term lease",
  "Commercial property",
  "Land & property acquisition",
  "House swap"
];

const directoryVendors = [
  "Kokrobite Care",
  "Accra Legal Desk",
  "Meridian Schools Advisory",
  "Black Star Security",
  "Visa Bridge Ghana",
  "Harbour Freight Ghana",
  "Cantonments Home Assist",
  "Labone Family Support",
  "A&C Drivers Collective",
  "Osu Wellness Hub"
];

export const seedDirectoryListings = Array.from({ length: 40 }).map((_, index) => {
  const category = directoryCategories[index % 10];
  const vendorName = `${directoryVendors[index % directoryVendors.length]} ${Math.floor(index / 10) + 1}`;
  return {
    section: "directory",
    slug: slugify(`${vendorName}-${category.slug}`),
    title: vendorName,
    category: category.label,
    categorySlug: category.slug,
    summary: `Verified ${category.label.toLowerCase()} support for expats, returnees, and international visitors living in Ghana.`,
    location: ["Accra", "Tema", "Kumasi", "Takoradi"][index % 4],
    verifiedTier: index % 3 === 0 ? "Communly Verified" : "Free",
    phone: "+233 20 149 7813",
    whatsapp: "+233 20 149 7813",
    email: `${slugify(vendorName)}@ghanaexpats.test`,
    services: [
      "Consultation and onboarding",
      "Direct WhatsApp support",
      "Verified local operating history"
    ],
    about: `${vendorName} serves the ${category.label} category with a focus on reliability, responsiveness, and expat-friendly communication.`,
    reviews: index % 2 === 0 ? [
      {
        author: "Community Member",
        rating: 5,
        body: "Responsive, clear, and genuinely helpful."
      }
    ] : []
  };
});

export const seedPropertyListings = [
  {
    section: "real-estate",
    slug: "airport-residential-workstay-suite",
    title: "Airport Residential Workstay Suite",
    type: "Short-stay serviced apartment",
    bedrooms: 2,
    location: "Airport Residential, Accra",
    price: 220,
    currency: "USD",
    furnished: "Furnished",
    verifiedTier: "Communly Verified",
    summary: "Quiet, generator-backed apartment suited to first arrivals and short assignments.",
    features: ["Generator backup", "Fast Wi-Fi", "Security", "Workspace"],
    description: "Fully serviced apartment with airport access, daily cleaning option, and a ready-made home office setup.",
    vendorSlug: "akosua-property-partners"
  },
  {
    section: "real-estate",
    slug: "east-legon-consultant-flat",
    title: "East Legon Consultant Flat",
    type: "Mid-term rental",
    bedrooms: 1,
    location: "East Legon, Accra",
    price: 1850,
    currency: "USD",
    furnished: "Part-furnished",
    verifiedTier: "Communly Verified",
    summary: "One to six month base for visiting consultants and researchers.",
    features: ["A/C", "Parking", "En suite", "Water tank"],
    description: "Flexible mid-term flat with secure compound access and easy routes to the city’s main business districts.",
    vendorSlug: "akosua-property-partners"
  },
  {
    section: "real-estate",
    slug: "roman-ridge-family-townhouse",
    title: "Roman Ridge Family Townhouse",
    type: "Long-term lease",
    bedrooms: 4,
    location: "Roman Ridge, Accra",
    price: 4500,
    currency: "USD",
    furnished: "Unfurnished",
    verifiedTier: "Communly Verified",
    summary: "Long-term family home with school routes and strong water storage.",
    features: ["Garden", "Security post", "Water reserve", "Covered parking"],
    description: "Spacious long-let townhouse for families relocating to Accra and needing proximity to schools and embassies.",
    vendorSlug: "akosua-property-partners"
  },
  {
    section: "real-estate",
    slug: "osu-creative-studio-retail",
    title: "Osu Creative Studio Retail",
    type: "Commercial property",
    bedrooms: 0,
    location: "Osu, Accra",
    price: 3100,
    currency: "USD",
    furnished: "Fitted shell",
    verifiedTier: "Free",
    summary: "Ground-floor retail space for hospitality, design, or boutique uses.",
    features: ["Street frontage", "Storage", "Washroom", "Footfall"],
    description: "Compact commercial unit suited to premium service brands that need a visible Osu address.",
    vendorSlug: "akosua-property-partners"
  },
  {
    section: "real-estate",
    slug: "ada-waterfront-land-plot",
    title: "Ada Waterfront Land Plot",
    type: "Land & property acquisition",
    bedrooms: 0,
    location: "Ada Foah",
    price: 180000,
    currency: "USD",
    furnished: "N/A",
    verifiedTier: "Communly Verified",
    summary: "Due-diligenced waterfront parcel with title support pathway.",
    features: ["Survey plan", "Legal due diligence", "Road access", "Utilities nearby"],
    description: "Land parcel with advisory support for diaspora buyers and institutional projects.",
    vendorSlug: "akosua-property-partners"
  },
  {
    section: "real-estate",
    slug: "house-swap-cape-coast-retreat",
    title: "Cape Coast Exchange Retreat",
    type: "House swap",
    bedrooms: 3,
    location: "Cape Coast",
    price: 0,
    currency: "USD",
    furnished: "Furnished",
    verifiedTier: "Free",
    summary: "Owner-listed seasonal exchange for diaspora families returning to Ghana.",
    features: ["Ocean breeze", "Kitchen", "Parking", "Family friendly"],
    description: "Free-to-enquire seasonal house swap between Ghana and partner diaspora cities.",
    vendorSlug: "akosua-property-partners"
  }
];

export const seedMarketplaceListings = marketplaceCategories.map((category, index) => ({
  section: "marketplace",
  slug: slugify(`${category.label}-listing-${index + 1}`),
  title: `${category.label} Listing ${index + 1}`,
  category: category.label,
  categorySlug: category.slug,
  condition: index % 2 === 0 ? "New" : "Pre-owned",
  price: 75 + index * 18,
  currency: "GHS",
  location: ["Accra", "Tema", "Kumasi"][index % 3],
  delivery: index % 2 === 0 ? "Delivery available" : "Collection only",
  summary: `Trusted ${category.label.toLowerCase()} offer from a verified marketplace seller.`,
  description: `This ${category.label.toLowerCase()} listing is designed for the Ghana expat and diaspora community and includes clear pricing, seller verification, and reporting controls.`,
  verifiedTier: index % 3 === 0 ? "Communly Verified" : "Verified seller"
}));

export const seedSnugHavenListings = [
  {
    section: "snug-haven",
    slug: "north-ridge-research-residence",
    title: "North Ridge Research Residence",
    location: "North Ridge, Accra",
    priceFrom: 55,
    currency: "USD",
    amenities: ["A/C", "Workspace", "Generator", "Airport pickup"],
    summary: "Small research residence with secure study spaces and host support.",
    description: "Purpose-built short-stay base for academics and consultants needing quiet, stability, and rapid city access."
  },
  {
    section: "snug-haven",
    slug: "tamale-fieldwork-base",
    title: "Tamale Fieldwork Base",
    location: "Tamale",
    priceFrom: 45,
    currency: "USD",
    amenities: ["Workspace", "Kitchen", "Community access", "Translation support"],
    summary: "Northern Ghana base suited to fieldwork teams and NGO researchers.",
    description: "Combines accommodation with logistics support, local introductions, and field planning."
  },
  {
    section: "snug-haven",
    slug: "cape-coast-archive-house",
    title: "Cape Coast Archive House",
    location: "Cape Coast",
    priceFrom: 60,
    currency: "USD",
    amenities: ["Library corner", "Wi-Fi", "Veranda", "Host liaison"],
    summary: "Coastal research base for historians, heritage scholars, and visiting faculty.",
    description: "Quiet property near archival and heritage sites with ready-made study space."
  }
];

export const seedVendorProfiles = [
  {
    slug: "akosua-property-partners",
    displayName: "Akosua Property Partners",
    verifiedTier: "Communly Verified",
    role: "registered_vendor",
    category: "Property & Investment",
    bio: "Accra-based property advisory team supporting expats, NGOs, and diaspora returnees.",
    contactEmail: "akosua@property.test"
  },
  {
    slug: "heritage-market-collective",
    displayName: "Heritage Market Collective",
    verifiedTier: "Verified seller",
    role: "registered_seller",
    category: "Marketplace",
    bio: "Curated marketplace seller focused on culture-led goods and diaspora gifting.",
    contactEmail: "heritage@market.test"
  }
];

export const seedUsers = [
  {
    name: "Communly Admin",
    email: "admin@communly.test",
    password: "Admin123!",
    role: "admin",
    status: "approved",
    businessName: "Communly"
  },
  {
    name: "Vendor Demo",
    email: "vendor@ghanaexpats.test",
    password: "Vendor123!",
    role: "registered_vendor",
    status: "approved",
    businessName: "Akosua Property Partners",
    section: "real-estate",
    category: "Property & Investment"
  },
  {
    name: "Seller Demo",
    email: "seller@ghanaexpats.test",
    password: "Seller123!",
    role: "registered_seller",
    status: "approved",
    businessName: "Heritage Market Collective",
    section: "marketplace",
    category: "Marketplace"
  },
  {
    name: "Host Demo",
    email: "host@ghanaexpats.test",
    password: "Host123!",
    role: "snug_haven_partner",
    status: "approved",
    businessName: "North Ridge Research Residence",
    section: "snug-haven",
    category: "Snug Haven partner"
  }
];

export const seedMessages = [
  {
    subject: "Vendor support",
    message: "Need help updating my listing gallery and payment details.",
    email: "vendor@ghanaexpats.test",
    type: "vendor_support"
  },
  {
    subject: "Partnership enquiry",
    message: "Would like to discuss a diaspora programme partnership.",
    email: "partner@example.com",
    type: "partnership"
  }
];

export const seedPayments = [
  {
    email: "vendor@ghanaexpats.test",
    amount: 250,
    currency: "GHS",
    kind: "verified_badge_subscription",
    status: "scheduled",
    provider: "paystack",
    dueDate: addDays(new Date(), 12).toISOString()
  },
  {
    email: "vendor@ghanaexpats.test",
    amount: 500,
    currency: "GHS",
    kind: "verified_badge_setup",
    status: "paid",
    provider: "paystack",
    dueDate: subDays(new Date(), 18).toISOString(),
    paidAt: subDays(new Date(), 18).toISOString()
  }
];
