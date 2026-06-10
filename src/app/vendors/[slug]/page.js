import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectoryListingCard, MarketplaceListingCard, PropertyListingCard, SnugHavenCard } from "@/components/listing-cards";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { findVendorProfile } from "@/lib/public-data";

export default async function VendorProfilePage({ params }) {
  const session = await getCurrentSession();
  const { slug } = await params;
  const vendor = await findVendorProfile(slug);
  if (!vendor) notFound();

  return (
    <AppFrame currentPath="/vendors" session={session}>
      <PageHero
        tone="paper"
        backdrop="hero-paper"
        eyebrow={vendor.verified_tier || "Vendor"}
        title={vendor.display_name}
        copy={vendor.bio}
      />

      <section className="content-section">
        <div className="shell vendor-profile-shell">
          <div className="vendor-profile-intro">
            <div>
              <p className="eyebrow">Vendor public profile</p>
              <h2>{vendor.display_name}</h2>
              <p>{vendor.category} · {vendor.role}</p>
            </div>
            <div className="vendor-profile-badges">
              <span className="tag verified">{vendor.verified_tier}</span>
              {vendor.contact_email ? <span className="tag">{vendor.contact_email}</span> : null}
            </div>
          </div>
          <div className="vendor-profile-note">
            <p>Communly uses this profile to show where the vendor is active and how to route enquiries without guesswork.</p>
            <Link className="button secondary-button" href="/contact">
              Contact via Communly
            </Link>
          </div>
          <div className="vendor-listing-grid">
            {vendor.listings.map((listing) => {
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
