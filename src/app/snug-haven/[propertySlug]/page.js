import { notFound } from "next/navigation";
import Link from "next/link";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { findListing } from "@/lib/public-data";

export default async function SnugHavenPropertyPage({ params }) {
  const session = await getCurrentSession();
  const { propertySlug } = await params;
  const listing = await findListing("snug-haven", propertySlug);
  if (!listing) notFound();
  const images = Array.isArray(listing.meta.images) ? listing.meta.images.filter(Boolean).slice(0, 4) : [];

  return (
    <AppFrame currentPath="/snug-haven" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-green"
        eyebrow="Snug Haven property"
        title={listing.title}
        copy={listing.summary}
        actions={[{ href: "/contact", label: "Enquire now" }]}
      />
      <section className="content-section">
        <div className="shell snug-detail-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/snug-haven", label: "Snug Haven" }, { label: listing.title }]} />
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
          <div className="snug-detail-stage">
            <div className="snug-detail-copy">
              <p className="eyebrow">Property details</p>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <div className="listing-meta">
                <span className="tag">{listing.location}</span>
                <span className="tag verified">From ${listing.price}/night</span>
              </div>
            </div>
            <div className="snug-detail-panel">
              <div className="snug-detail-price">
                <strong>From ${listing.price}/night</strong>
                <span>Fieldwork-ready stay</span>
              </div>
              <div className="snug-detail-actions">
                <h3>Enquiry route</h3>
                <p>For institutional or fieldwork bookings, accommodation and support are coordinated together.</p>
                <Link className="button primary-button" href="/contact">
                  Send booking enquiry
                </Link>
                <Link className="button secondary-button" href="/contact">
                  Contact Snug Haven
                </Link>
              </div>
            </div>
          </div>
          <div className="snug-detail-amenities">
            {(listing.meta.amenities || []).map((amenity) => (
              <article key={amenity} className="snug-amenity-card">
                <h3>{amenity}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="shell property-features-shell">
          <div className="button-row">
            <Link className="button secondary-button" href="/contact">
              Request research support too
            </Link>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
