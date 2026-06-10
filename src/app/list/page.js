import { freeListingAction } from "@/app/actions";
import { HumanCheckField, StatusNotice } from "@/components/forms";
import { DataTable, PageSection } from "@/components/page-blocks";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";

export const metadata = {
  title: "List Your Business · GhanaExpats.com",
  description: "Reach the people already looking for you with free and Verified listing options."
};

export default async function ListBusinessPage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/list");
  const [hero, selector, tierComparison] = page.sections;
  const params = await searchParams;

  return (
    <AppFrame currentPath="/list" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="List your business" title={hero.fields.Headline} copy={hero.fields.Body} />
      <section className="content-section">
        <div className="shell section-shell">
          {params?.submitted ? <StatusNotice title="Submission received" body="Your free listing has been saved and can be reviewed by the Communly team." /> : null}
          <div className="section-intro">
            <p className="eyebrow">{selector.title}</p>
            <h2>{selector.fields.Headline}</h2>
          </div>
          <DataTable
            headers={["Section", "Best for", "What you list"]}
            rows={selector.blocks.map((row) => (Object.values(row.fields)[0] || "").split("·").map((item) => item.trim()))}
          />
        </div>
      </section>
      <section className="content-section">
        <div className="shell section-shell">
          <div className="section-intro">
            <p className="eyebrow">{tierComparison.title}</p>
            <h2>{tierComparison.fields.Headline || "Free vs Communly Verified"}</h2>
          </div>
          <DataTable
            headers={["Feature", "Free Listing", "Communly Verified"]}
            rows={tierComparison.blocks.map((row) => (Object.values(row.fields)[0] || "").split("·").map((item) => item.trim()))}
          />
        </div>
      </section>
      <section className="content-section">
        <div className="shell section-shell">
          <div className="feature-grid">
            <div className="callout-box">
              <p className="eyebrow">Free listing form</p>
              <h3>Lowest-friction entry point</h3>
              <p>List your business free, start being discovered, and upgrade to Communly Verified when you are ready for trust and placement advantages.</p>
            </div>
            <form action={freeListingAction} className="form-shell">
              <div className="form-grid">
                <div className="field"><label>Business name</label><input name="business_name" required /></div>
                <div className="field"><label>Category</label><input name="category" required /></div>
                <div className="field"><label>Contact name</label><input name="contact_name" required /></div>
                <div className="field"><label>Phone</label><input name="phone" required /></div>
                <div className="field"><label>Email</label><input name="email" type="email" required /></div>
                <div className="field"><label>WhatsApp</label><input name="whatsapp" /></div>
                <div className="field"><label>Location or neighbourhood</label><input name="location" required /></div>
                <div className="field"><label>Website</label><input name="website" /></div>
                <div className="field full"><label>Brief description</label><textarea name="description" maxLength={150} required /></div>
                <div className="field full"><label>One photo upload</label><input name="photo" type="file" /></div>
                <HumanCheckField />
              </div>
              <div className="button-row">
                <button className="button primary-button" type="submit">Submit free listing</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
