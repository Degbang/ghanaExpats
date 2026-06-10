import { DirectoryListingCard, MarketplaceListingCard, PropertyListingCard, SnugHavenCard } from "@/components/listing-cards";
import { AppFrame, PageHero } from "@/components/site-shell";
import { ensureAdminIp, requireSession } from "@/lib/auth";
import { listAllListingsForAdmin } from "@/lib/private-data";

export default async function AdminListingsPage() {
  const session = await requireSession(["admin"]);
  if (!(await ensureAdminIp())) {
    return (
      <AppFrame currentPath="/admin" session={session}>
        <section className="content-section">
          <div className="shell section-shell"><div className="form-shell"><h1>Admin access blocked</h1></div></div>
        </section>
      </AppFrame>
    );
  }
  const listings = await listAllListingsForAdmin();

  return (
    <AppFrame currentPath="/admin" session={session}>
      <PageHero tone="dark" backdrop="hero-solid-forest" eyebrow="Admin" title="All listings" copy="View, flag, or remove any listing." />
      <section className="content-section">
        <div className="shell section-shell">
          <div className="listing-grid">
            {listings.map((listing) => {
              if (listing.section === "real-estate") return <PropertyListingCard key={listing.slug} listing={listing} />;
              if (listing.section === "marketplace") return <MarketplaceListingCard key={listing.slug} listing={listing} />;
              if (listing.section === "snug-haven") return <SnugHavenCard key={listing.slug} listing={listing} />;
              return <DirectoryListingCard key={listing.slug} listing={listing} />;
            })}
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
