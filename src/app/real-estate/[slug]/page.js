import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { findListing } from "@/lib/public-data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = await findListing("real-estate", slug);
  return {
    title: listing ? `${listing.title} · GhanaExpats.com` : "Property listing · GhanaExpats.com",
    description: listing?.summary ?? "Vetted Ghana property listing."
  };
}

function formatPrice(listing) {
  if (!listing.price) return "Enquire";
  return `${listing.currency || "USD"} ${listing.price}`;
}

export default async function PropertyDetailPage({ params }) {
  const session = await getCurrentSession();
  const { slug } = await params;
  const listing = await findListing("real-estate", slug);
  if (!listing) notFound();

  const images = Array.isArray(listing.meta.images) ? listing.meta.images.filter(Boolean).slice(0, 4) : [];

  return (
    <AppFrame currentPath="/real-estate" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-green"
        eyebrow={listing.meta.type || listing.category}
        title={listing.title}
        copy={listing.summary}
      />

      <section className="content-section">
        <div className="shell property-detail-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/real-estate", label: "Property & Investment" }, { label: listing.title }]} />
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
          <div className="property-detail-stage">
            <div className="property-detail-copy">
              <p className="eyebrow">Property overview</p>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <div className="listing-meta">
                <span className="tag">{listing.location}</span>
                <span className="tag">{listing.meta.type || listing.category}</span>
                {listing.verified_tier ? <span className="tag verified">{listing.verified_tier}</span> : null}
              </div>
            </div>
            <div className="property-detail-panel">
              <div className="property-price-card">
                <strong>{formatPrice(listing)}</strong>
                <span>Per term as listed</span>
              </div>
              <div className="property-action-card">
                <h3>Viewing and negotiation</h3>
                <p>Communly can route serious interest, clarify the listing, and connect you to the right next step.</p>
                <Link className="button primary-button" href="/contact">
                  Enquire through Communly
                </Link>
                <a className="button whatsapp-button" href="https://wa.me/233201497813">
                  WhatsApp fast route
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell property-features-shell">
          <div className="section-intro">
            <p className="eyebrow">What is included</p>
            <h2>Key features at a glance.</h2>
          </div>
          <div className="property-feature-grid">
            {(listing.meta.features || []).map((feature) => (
              <article key={feature} className="property-feature-card">
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
          <div className="button-row">
            <Link className="button secondary-button" href="/guides/finding-housing-accra">
              Read the housing guide
            </Link>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
