import { VideoSpotlight } from "@/components/ghana-media";
import { FeaturedPanel, PropertyListingCard } from "@/components/listing-cards";
import { SearchToolbar } from "@/components/forms";
import { CardGrid, DataTable, PageSection } from "@/components/page-blocks";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { realEstateFeature } from "@/lib/ghana-media";
import { listListings } from "@/lib/public-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/real-estate");

function filterListings(listings, searchParams) {
  const q = searchParams?.q?.toLowerCase() ?? "";
  const type = searchParams?.type ?? "";
  const furnished = searchParams?.furnished ?? "";

  return listings.filter((listing) => {
    const matchesQ = !q || [listing.title, listing.location, listing.summary].join(" ").toLowerCase().includes(q);
    const matchesType = !type || (listing.meta.type || listing.category) === type;
    const matchesFurnished = !furnished || (listing.meta.furnished || "") === furnished;
    return matchesQ && matchesType && matchesFurnished;
  });
}

export default async function RealEstatePage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/real-estate");
  const [hero, trustNote, listingTypes, pricing] = getSectionsByTitle(page, [
    "HERO",
    "TRUST NOTE",
    "LISTING TYPES",
    "VENDOR PRICING"
  ]);
  const listings = await listListings("real-estate");
  const filteredListings = filterListings(listings, await searchParams);
  const featured = listings.find((listing) => listing.featured);

  const typeCards = listingTypes.blocks.map((block) => ({
    eyebrow: block.title.includes("Mid-term") ? "Soft link: Snug Haven available for fully supported research stays" : "Property type",
    title: block.fields.Headline || block.title,
    copy: block.fields.Body
  }));

  return (
    <AppFrame currentPath="/real-estate" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-ghana"
        eyebrow="Property & Investment"
        title={hero.fields.Headline}
        copy={hero.fields["Sub-headline"]}
        search={
          <SearchToolbar
            action="/real-estate"
            placeholder={hero.fields["Search bar placeholder"]}
            filters={[
              { name: "type", label: "Type", type: "select", options: listingTypes.blocks.map((block) => block.fields.Headline || block.title) },
              { name: "bedrooms", label: "Bedrooms", type: "select", options: ["1", "2", "3", "4+"] },
              { name: "price", label: "Price range", type: "text", placeholder: "e.g. 2000" },
              { name: "furnished", label: "Furnished / Unfurnished", type: "select", options: ["Furnished", "Part-furnished", "Unfurnished"] }
            ]}
            submitLabel="Search property"
          />
        }
      />
      <section className="content-section">
        <div className="shell section-shell">
          <VideoSpotlight {...realEstateFeature} />
        </div>
      </section>
      <PageSection section={trustNote} tone="paper" titleOverride="Trust note" />
      <PageSection section={listingTypes} tone="paper">
        <CardGrid cards={typeCards} />
      </PageSection>
      <PageSection section={{ title: "Featured property", fields: { Headline: "Featured property", Body: "Admin-curated premium listing." }, blocks: [], loose: [] }} tone="sand">
        <FeaturedPanel listing={featured} href={`/real-estate/${featured.slug}`} ctaLabel="View property" />
      </PageSection>
      <PageSection section={{ title: "Listings grid", fields: { Headline: "Listings grid", Body: "Filterable card grid of vetted properties." }, blocks: [], loose: [] }} tone="paper">
        <div className="listing-grid">
          {filteredListings.map((listing) => (
            <PropertyListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </PageSection>
      <PageSection
        section={pricing}
        tone="paper"
        actions={[{ href: "/list", label: pricing.fields["CTA Button"] }]}
      >
        <DataTable
          headers={pricing.fields["Table headers"].split("·").map((item) => item.trim())}
          rows={pricing.blocks.map((row) => (Object.values(row.fields)[0] || "").split("·").map((item) => item.trim()))}
        />
      </PageSection>
    </AppFrame>
  );
}
