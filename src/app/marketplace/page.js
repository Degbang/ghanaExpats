import Link from "next/link";
import { VideoSpotlight } from "@/components/ghana-media";
import { MarketplaceListingCard } from "@/components/listing-cards";
import { SearchToolbar } from "@/components/forms";
import { PageSection } from "@/components/page-blocks";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { marketplaceCategories } from "@/lib/catalog";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { marketplaceFeature } from "@/lib/ghana-media";
import { listListings } from "@/lib/public-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/marketplace");

async function filterMarketplace(listings, searchParams) {
  const sp = await searchParams;
  const q = sp?.q?.toLowerCase() ?? "";
  const category = sp?.category ?? "";
  return listings.filter((listing) => {
    const matchesQ = !q || [listing.title, listing.summary, listing.category].join(" ").toLowerCase().includes(q);
    const matchesCategory = !category || listing.category === category;
    return matchesQ && matchesCategory;
  });
}

export default async function MarketplacePage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/marketplace");
  const [hero, trustNote, prohibited, sellerCta] = getSectionsByTitle(page, [
    "HERO",
    "TRUST NOTE",
    "PROHIBITED ITEMS",
    "SELLER CTA"
  ]);
  const listings = await filterMarketplace(await listListings("marketplace"), searchParams);
  const featuredListings = listings.slice(0, 3);
  const otherListings = listings.slice(3);
  const categoryLeads = marketplaceCategories.slice(0, 6);
  const categoryTrail = marketplaceCategories.slice(6);

  return (
    <AppFrame currentPath="/marketplace" session={session}>
      <PageHero
        tone="dark"
        backdrop="hero-marketplace"
        eyebrow="Marketplace"
        title={hero.fields.Headline}
        copy={hero.fields.Body}
        search={
          <SearchToolbar
            action="/marketplace"
            placeholder={hero.fields["Search bar placeholder"]}
            filters={[
              { name: "category", label: "Category", type: "select", options: marketplaceCategories.map((category) => category.label) },
              { name: "condition", label: "Condition", type: "select", options: ["New", "Pre-owned"] },
              { name: "price_range", label: "Price range", type: "text", placeholder: "e.g. 0-200" },
              { name: "location", label: "Location or delivery", type: "text", placeholder: "Accra / delivery" }
            ]}
            submitLabel="Search marketplace"
          />
        }
      />
      <section className="content-section">
        <div className="shell marketplace-category-shell">
          <div className="section-intro">
            <p className="eyebrow">Categories</p>
            <h2>Browse commerce by how people actually search.</h2>
          </div>
          <div className="marketplace-category-grid">
            {categoryLeads.map((category) => (
              <Link key={category.slug} href={`/marketplace?category=${encodeURIComponent(category.label)}`} className="marketplace-category-card">
                <strong>{category.label}</strong>
                <span>Browse live offers</span>
              </Link>
            ))}
          </div>
          <div className="marketplace-category-rail">
            {categoryTrail.map((category) => (
              <Link key={category.slug} href={`/marketplace?category=${encodeURIComponent(category.label)}`}>
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="shell section-shell tone-dark">
          <VideoSpotlight {...marketplaceFeature} reverse />
        </div>
      </section>
      <section className="content-section">
        <div className="shell marketplace-trust-shell">
          <div className="marketplace-trust-copy">
            <p className="eyebrow">Buying with confidence</p>
            <h2>{trustNote.fields.Headline}</h2>
            <p>{trustNote.fields.Body}</p>
          </div>
          <div className="marketplace-trust-points">
            <span>Seller verification before first listing</span>
            <span>Communly Verified reference checks</span>
            <span>Report and review workflow</span>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="shell section-shell marketplace-listing-shell">
          <div className="section-intro">
            <p className="eyebrow">Live listings</p>
            <h2>Products and services moving through the community.</h2>
          </div>
          <div className="marketplace-feature-grid">
            {featuredListings.map((listing) => (
              <MarketplaceListingCard key={listing.slug} listing={listing} />
            ))}
          </div>
          {otherListings.length > 0 ? (
            <div className="marketplace-support-grid">
              {otherListings.map((listing) => (
                <MarketplaceListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <section className="content-section">
        <div className="shell marketplace-prohibited-shell">
          <p className="eyebrow">Prohibited items</p>
          <h2>{prohibited.fields.Headline}</h2>
          <p>{prohibited.fields.Body}</p>
        </div>
      </section>
      <PageSection
        section={sellerCta}
        tone="sand"
        titleOverride={sellerCta.fields.Headline}
        actions={[{ href: "/register", label: sellerCta.fields["CTA Button"] }]}
      />
    </AppFrame>
  );
}
