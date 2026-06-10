import { notFound } from "next/navigation";
import Link from "next/link";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { findListing } from "@/lib/public-data";
import { currency } from "@/lib/utils";

export default async function MarketplaceDetailPage({ params }) {
  const session = await getCurrentSession();
  const { slug } = await params;
  const listing = await findListing("marketplace", slug);
  if (!listing) notFound();
  const images = Array.isArray(listing.meta.images) ? listing.meta.images.filter(Boolean).slice(0, 4) : [];

  return (
    <AppFrame currentPath="/marketplace" session={session}>
      <PageHero
        tone="dark"
        backdrop="hero-dark"
        eyebrow={listing.category}
        title={listing.title}
        copy={listing.summary}
        actions={[{ href: "/contact", label: "Contact seller via Communly" }]}
      />
      <section className="content-section">
        <div className="shell marketplace-detail-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/marketplace", label: "Marketplace" }, { label: listing.title }]} />
          {images.length > 0 ? (
            <div className="detail-gallery">
              <div className="detail-gallery-main">
                <img src={images[0]} alt={listing.title} />
              </div>
              <div className="detail-gallery-side">
                {images.slice(1).map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt="" aria-hidden="true" />
                ))}
              </div>
            </div>
          ) : null}
          <div className="marketplace-detail-stage">
            <div className="marketplace-detail-copy">
              <p className="eyebrow">Item details</p>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <div className="listing-meta">
                <span className="tag">{listing.category}</span>
                <span className="tag">{listing.meta.condition}</span>
                <span className="tag verified">{listing.verified_tier}</span>
                <span className="tag">{currency(listing.price, listing.currency || "GHS")}</span>
              </div>
            </div>
            <div className="marketplace-detail-panel">
              <div className="marketplace-price-card">
                <strong>{currency(listing.price, listing.currency || "GHS")}</strong>
                <span>{listing.meta.delivery}</span>
              </div>
              <div className="marketplace-detail-actions">
                <h3>Seller route</h3>
                <p>Use the marketplace contact path first, then escalate to Communly if needed.</p>
                <Link className="button primary-button" href="/contact">
                  Message seller
                </Link>
                <Link className="button secondary-button" href="/contact">
                  Report listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
