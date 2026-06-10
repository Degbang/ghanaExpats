import Link from "next/link";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { listListings } from "@/lib/public-data";
import { buildMetadata } from "@/lib/seo";
import { currency } from "@/lib/utils";

export const metadata = buildMetadata("/snug-haven");

function supportItemsFromSection(section) {
  const line = section?.loose.find((entry) => entry.startsWith("- ")) ? null : section?.fields["Service list"];
  if (line) {
    return String(line)
      .split("- ")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return (section?.loose ?? []).filter((entry) => entry.startsWith("- ")).map((entry) => entry.replace(/^- /, ""));
}

export default async function SnugHavenPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/snug-haven");
  const hero = page?.sections?.[0] ?? null;
  const [differentiator, properties, supportServices, institutional, crossLink] = getSectionsByTitle(page, [
    "WHAT SETS US APART",
    "PROPERTIES GRID",
    "RESEARCH SUPPORT SERVICES",
    "INSTITUTIONAL & NGO ENQUIRIES",
    "DIASPORA PROGRAMME CROSS-LINK"
  ]);
  const listings = await listListings("snug-haven");
  const supportItems = supportItemsFromSection(supportServices);

  return (
    <AppFrame currentPath="/snug-haven" session={session}>
      <section className="image-hero">
        <div className="snug-hero-image">
          <img src="/media/ghana/images/nkrumah-museum.jpg" alt="Kwame Nkrumah Memorial Park in Accra" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="image-hero-overlay" style={{ background: "rgba(26, 58, 46, 0.55)" }} />
        <div className="shell video-hero-shell" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="image-hero-copy">
            <p className="eyebrow">{hero?.fields["Eyebrow"]}</p>
            <h1>
              <span className="hero-line hero-line-1">Your base in Ghana,</span>
              <span className="hero-line hero-line-2">wherever the work takes you.</span>
            </h1>
            <p className="hero-copy">{hero?.fields["Sub-headline"]}</p>
            <p className="copy-strong">{hero?.fields["Supporting text"]}</p>
            <div className="button-row" style={{ justifyContent: "center", marginTop: "1.25rem" }}>
              <Link className="button primary-button" href="#collection">
                {hero?.fields["CTA Button 1"] || "Browse the Collection"}
              </Link>
              <Link className="button secondary-button" href="/contact">
                {hero?.fields["CTA Button 2"] || "Enquire for Your Organisation"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">What sets us apart</p>
              <h2>{differentiator?.fields.Headline}</h2>
              <p>{differentiator?.fields.Body}</p>
            </div>
            {differentiator?.fields["Callout text"] ? <p className="copy-strong">{differentiator.fields["Callout text"]}</p> : null}
          </div>
        </div>
      </section>

      <section id="collection" className="content-section">
        <div className="shell">
          <div className="section-header">
            <p className="eyebrow">Properties grid</p>
            <h2>{properties?.fields["Section headline"]}</h2>
            <p>{properties?.fields["Sub-headline"]}</p>
          </div>
          <div className="listing-grid">
            {listings.map((listing) => (
              <article key={listing.slug} className="listing-card section-card">
                {listing.meta.images?.[0] ? <img src={listing.meta.images[0]} alt={listing.title} style={{ borderRadius: "var(--radius-md)", aspectRatio: "3 / 2", objectFit: "cover" }} /> : null}
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <div className="listing-meta">
                  <span className="tag">{listing.meta.type || "Accommodation"}</span>
                  <span className="tag">from {currency(listing.price, listing.currency || "USD")}</span>
                </div>
                <Link href={`/snug-haven/${listing.slug}`}>View &amp; Enquire</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell split-layout">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Research support services</p>
              <h2>{supportServices?.fields["Section headline"]}</h2>
              <p>{supportServices?.fields.Body}</p>
            </div>
            <div className="button-row">
              <Link className="button secondary-button" href="/contact">
                {supportServices?.fields["CTA Button"] || "Request Research Support →"}
              </Link>
            </div>
          </div>
          <div className="support-grid">
            {supportItems.map((item) => (
              <article key={item} className="info-panel">
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell split-layout">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Institutional & NGO enquiries</p>
              <h2>{institutional?.fields.Headline}</h2>
              <p>{institutional?.fields.Body}</p>
            </div>
            <div className="copy-stack">
              <p>Email: snughaven@berecons.org</p>
              <p>WhatsApp: +233 20 149 7813</p>
            </div>
            <div className="button-row">
              <Link className="button secondary-button" href="/contact">
                {institutional?.fields["CTA Button"] || "Submit an Institutional Enquiry →"}
              </Link>
            </div>
          </div>
          <div className="section-card" style={{ background: "rgba(139, 58, 31, 0.92)", color: "var(--ivory-paper)" }}>
            <div className="section-header">
              <p className="eyebrow">Diaspora Heritage Journeys</p>
              <h2>{crossLink?.fields.Headline}</h2>
              <p style={{ color: "rgba(247, 243, 236, 0.82)" }}>{crossLink?.fields.Body}</p>
            </div>
            <div className="button-row">
              <Link className="button secondary-button" href="/diaspora-programme">
                {crossLink?.fields["CTA Button"] || "Explore Diaspora Heritage Journeys →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
