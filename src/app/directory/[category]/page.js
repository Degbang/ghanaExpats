import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchToolbar } from "@/components/forms";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { directoryCategories } from "@/lib/catalog";
import { listDirectoryByCategory } from "@/lib/public-data";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const found = directoryCategories.find((item) => item.slug === category);
  return {
    title: found ? `${found.label} in Ghana · GhanaExpats.com` : "Directory category · GhanaExpats.com",
    description: found ? `Verified ${found.label.toLowerCase()} providers trusted by Ghana's expat and diaspora community.` : "Directory category listings."
  };
}

export default async function DirectoryCategoryPage({ params }) {
  const session = await getCurrentSession();
  const { category } = await params;
  const categoryItem = directoryCategories.find((item) => item.slug === category);
  if (!categoryItem) notFound();
  const listings = await listDirectoryByCategory(category);

  return (
    <AppFrame currentPath="/directory" session={session}>
      <PageHero
        tone="paper"
        backdrop="hero-paper"
        eyebrow="Directory category"
        title={`${categoryItem.label} in Ghana`}
        copy={`Verified ${categoryItem.label.toLowerCase()} providers trusted by Ghana's expat and diaspora community. Every Communly Verified listing has been reviewed by our team.`}
        search={
          <SearchToolbar
            action={`/directory/${category}`}
            placeholder={`Search within ${categoryItem.label}`}
            filters={[
              { name: "location", label: "Location or neighbourhood", type: "text", placeholder: "Accra, Tema, Kumasi..." }
            ]}
            submitLabel="Search this category"
          />
        }
      />

      <section className="content-section">
        <div className="shell section-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/directory", label: "Directory" }, { label: categoryItem.label }]} />
          <div className="section-header">
            <p className="eyebrow">Listings</p>
            <h2>{listings.length} providers in this category.</h2>
          </div>
          <div className="listing-grid">
            {listings.map((listing) => (
              <article key={listing.slug} className="listing-card section-card">
                <p className="eyebrow">{listing.verified_tier}</p>
                <h3>{listing.title}</h3>
                <p>{listing.summary}</p>
                <div className="listing-meta">
                  <span className="tag">{listing.category}</span>
                  <span className="tag">{listing.location}</span>
                </div>
                <Link href={`/directory/${listing.category_slug}/${listing.slug}`}>View Profile</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Not finding what you need?</p>
              <h2>Ask the community directly.</h2>
              <p>Our directory grows every week. Ask the community directly in the Expats in Ghana Facebook Group — 26,000 members with first-hand recommendations.</p>
            </div>
            <div className="button-row">
              <Link className="button primary-button" href="/join">
                Ask the Community →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
