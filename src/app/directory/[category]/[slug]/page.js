import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { findListing } from "@/lib/public-data";

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const listing = await findListing("directory", slug);
  return {
    title: listing ? `${listing.title} · ${category} · GhanaExpats.com` : "Directory listing · GhanaExpats.com",
    description: listing?.summary ?? "Verified directory listing in Ghana."
  };
}

export default async function DirectoryListingPage({ params }) {
  const session = await getCurrentSession();
  const { category, slug } = await params;
  const listing = await findListing("directory", slug);
  if (!listing || listing.category_slug !== category) notFound();

  const services = Array.isArray(listing.meta.services) ? listing.meta.services.filter(Boolean) : [];
  const websiteHref = listing.meta.website ? (listing.meta.website.startsWith("http") ? listing.meta.website : `https://${listing.meta.website}`) : "";
  const whatsappHref = listing.meta.whatsapp ? `https://wa.me/${listing.meta.whatsapp.replace(/\D/g, "")}` : "";

  return (
    <AppFrame currentPath="/directory" session={session}>
      <PageHero
        tone="paper"
        backdrop="hero-paper"
        eyebrow={listing.verified_tier || "Listing"}
        title={listing.title}
        copy={listing.summary}
      />

      <section className="content-section">
        <div className="shell vendor-detail-shell">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/directory", label: "Directory" },
              { href: `/directory/${listing.category_slug}`, label: listing.category },
              { label: listing.title }
            ]}
          />
          <div className="vendor-detail-stage">
            <div className="vendor-detail-copy">
              <p className="eyebrow">About</p>
              <h2>About {listing.title}</h2>
              <p>{listing.description || listing.summary}</p>
              <div className="listing-meta">
                <span className="tag">{listing.category}</span>
                <span className="tag">{listing.location}</span>
                {listing.verified_tier ? <span className="tag verified">{listing.verified_tier}</span> : null}
              </div>
            </div>
            <div className="vendor-contact-panel">
              <h3>Get in Touch</h3>
              <div className="contact-stack">
                {listing.meta.email ? <p>Email: {listing.meta.email}</p> : null}
                {listing.meta.phone ? <p>Phone: {listing.meta.phone}</p> : null}
                {!listing.meta.email && !listing.meta.phone ? <p>Use Communly if you want this introduction handled for you.</p> : null}
              </div>
              {whatsappHref ? <a className="button whatsapp-button" href={whatsappHref}>WhatsApp {listing.title}</a> : null}
              <Link className="button primary-button" href="/contact">
                Send an Enquiry
              </Link>
              {websiteHref ? <a className="button secondary-button" href={websiteHref} target="_blank" rel="noreferrer">Visit Website</a> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell vendor-services-shell">
          <div className="section-intro">
            <p className="eyebrow">Services</p>
            <h2>Services Offered</h2>
          </div>
          <div className="vendor-services-grid">
            {services.length > 0 ? (
              services.map((service) => (
                <article key={service} className="vendor-service-card">
                  <h3>{service}</h3>
                </article>
              ))
            ) : (
              <article className="vendor-service-card">
                <p>Service details available on request.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      {listing.verified_tier?.toLowerCase().includes("verified") ? (
        <section className="content-section">
          <div className="shell vendor-reviews-shell">
            <div className="section-intro">
              <p className="eyebrow">Reviews</p>
              <h2>Community Reviews</h2>
            </div>
            {listing.reviews.length > 0 ? (
              <div className="vendor-reviews-grid">
                {listing.reviews.map((review, index) => (
                  <article key={`${review.author}-${index}`} className="vendor-review-card">
                    <strong>{review.author}</strong>
                    <span>{review.rating}/5</span>
                    <p>{review.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="section-card">
                <p>No reviews yet. Be the first to leave a recommendation.</p>
                <div className="button-row">
                  <Link className="button secondary-button" href="/contact">
                    Leave a Review
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="content-section">
        <div className="shell vendor-report-shell">
          <div>
            <p className="eyebrow">Report listing</p>
            <h2>If something looks wrong, flag it.</h2>
          </div>
          <Link className="button secondary-button" href="/contact">
            Report this listing
          </Link>
        </div>
      </section>
    </AppFrame>
  );
}
