import Link from "next/link";
import { SearchToolbar } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { directoryCategories } from "@/lib/catalog";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/directory");

export default async function DirectoryPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/directory");
  const [hero, verified, vendorCta] = getSectionsByTitle(page, [
    "HERO",
    "VERIFIED BADGE EXPLAINER",
    "VENDOR CTA"
  ]);

  return (
    <AppFrame currentPath="/directory" session={session}>
      <PageHero
        tone="paper"
        backdrop="hero-paper"
        eyebrow="Verified Directory"
        title={["Find it.", "Trust it.", "Get on with your life."]}
        copy={hero?.fields["Sub-headline"]}
        search={
          <SearchToolbar
            action="/directory"
            placeholder={hero?.fields["Search bar placeholder"]}
            filters={[
              { name: "category", label: hero?.fields["Filter 1 label"] || "Category", type: "select", options: directoryCategories.map((item) => item.label) },
              { name: "location", label: hero?.fields["Filter 2 label"] || "Location", type: "text", placeholder: "Accra, Tema, Kumasi..." }
            ]}
            submitLabel="Search the Directory"
          />
        }
      />

      <section className="content-section">
        <div className="beach-parallax" aria-hidden="true" />
      </section>

      <section className="content-section directory-preview-grid">
        <div className="shell">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Category grid</p>
              <h2>Browse all 28 verified categories.</h2>
            </div>
            <div className="directory-category-grid">
              {directoryCategories.map((category) => (
                <Link key={category.slug} href={`/directory/${category.slug}`} className="category-tile directory-category-tile">
                  <span className="directory-category-icon" aria-hidden="true">○</span>
                  <strong>{category.label}</strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="directory-badge-note">
            <p className="eyebrow">Communly Verified</p>
            <h2>{verified?.fields.Headline}</h2>
            <p>{verified?.fields.Body}</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Vendor CTA</p>
              <h2>{vendorCta?.fields.Headline}</h2>
              <p>{vendorCta?.fields.Body}</p>
            </div>
            <div className="button-row">
              <Link className="button primary-button" href="/list">
                {vendorCta?.fields["CTA Button"] || "List Your Business →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
