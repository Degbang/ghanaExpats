import Link from "next/link";
import { currency, formatDate } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";

export function DirectoryListingCard({ listing }) {
  const isCommunlyVerified = listing.verified_tier === "Communly Verified";

  return (
    <article className="listing-card">
      <div className="listing-card-header">
        <div className="listing-meta">
          <span className="tag data-tag">{listing.category}</span>
          {isCommunlyVerified ? <VerifiedBadge compact /> : null}
          {!isCommunlyVerified && listing.verified_tier ? (
            <span className={`tag ${listing.verified_tier?.includes("Verified") ? "verified" : ""}`}>
              {listing.verified_tier}
            </span>
          ) : null}
        </div>
      </div>
      <h3>{listing.title}</h3>
      <p>{listing.summary}</p>
      <div className="listing-footer-row">
        <p>{listing.location}</p>
        <Link className="text-link" href={`/directory/${listing.category_slug}/${listing.slug}`}>
          View listing →
        </Link>
      </div>
    </article>
  );
}

export function PropertyListingCard({ listing }) {
  return (
    <article className="listing-card">
      <div className="listing-meta">
        <span className="tag">{listing.meta.type || listing.category}</span>
        {listing.verified_tier ? <span className="tag verified">{listing.verified_tier}</span> : null}
      </div>
      <h3>{listing.title}</h3>
      <p>{listing.summary}</p>
      <p>
        {listing.location}
        {listing.meta.bedrooms ? ` · ${listing.meta.bedrooms} bed` : ""}
      </p>
      <p>
        {listing.price ? currency(listing.price, listing.currency || "USD") : "Enquire"}
        {listing.created_at ? ` · Listed ${formatDate(listing.created_at)}` : ""}
      </p>
      <Link className="text-link" href={`/real-estate/${listing.slug}`}>
        View listing →
      </Link>
    </article>
  );
}

export function MarketplaceListingCard({ listing }) {
  return (
    <article className="listing-card">
      <div className="listing-meta">
        <span className="tag">{listing.category}</span>
        <span className="tag">{listing.meta.condition}</span>
      </div>
      <h3>{listing.title}</h3>
      <p>{listing.summary}</p>
      <p>
        {currency(listing.price, listing.currency || "GHS")} · {listing.meta.delivery}
      </p>
      <Link className="text-link" href={`/marketplace/${listing.slug}`}>
        View item →
      </Link>
    </article>
  );
}

export function SnugHavenCard({ listing }) {
  return (
    <article className="listing-card">
      <div className="listing-meta">
        <span className="tag verified">From {currency(listing.price, listing.currency || "USD")}/night</span>
      </div>
      <h3>{listing.title}</h3>
      <p>{listing.summary}</p>
      <p>{listing.location}</p>
      <div className="listing-meta">
        {(listing.meta.amenities || []).map((amenity) => (
          <span key={amenity} className="tag">
            {amenity}
          </span>
        ))}
      </div>
      <Link className="text-link" href={`/snug-haven/${listing.slug}`}>
        Enquire →
      </Link>
    </article>
  );
}

export function FeaturedPanel({ listing, href, ctaLabel }) {
  if (!listing) return null;

  return (
    <div className="feature-grid">
      <div className="callout-box tone-paper">
        <p className="eyebrow">Featured</p>
        <h3>{listing.title}</h3>
        <p>{listing.summary}</p>
        <div className="listing-meta">
          <span className="tag">{listing.location}</span>
          {listing.price ? <span className="tag verified">{currency(listing.price, listing.currency || "USD")}</span> : null}
        </div>
        <Link className="button primary-button" href={href}>
          {ctaLabel}
        </Link>
      </div>
      <div className="callout-box">
        <div className="copy-stack">
          <p className="copy-strong">Why it stands out</p>
          <p>{listing.description}</p>
          {"features" in listing.meta && Array.isArray(listing.meta.features) ? (
            <div className="listing-meta">
              {listing.meta.features.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
