import { dashboardListingCreateAction } from "@/app/actions";
import { AppFrame, PageHero } from "@/components/site-shell";
import { requireSession } from "@/lib/auth";

export default async function NewListingPage() {
  const session = await requireSession(["registered_vendor", "registered_seller", "snug_haven_partner"]);

  return (
    <AppFrame currentPath="/dashboard" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="Create listing" title="Add a new listing" copy="Fields vary by category in production; this launch build supports the documented core listing fields." />
      <section className="content-section">
        <div className="shell section-shell">
          <form action={dashboardListingCreateAction} className="form-shell">
            <div className="form-grid">
              <div className="field"><label>Title</label><input name="title" required /></div>
              <div className="field"><label>Section</label><input name="section" defaultValue={session.section || "directory"} readOnly /></div>
              <div className="field"><label>Category</label><input name="category" defaultValue={session.category || ""} required /></div>
              <div className="field"><label>Location</label><input name="location" required /></div>
              <div className="field"><label>Price</label><input name="price" type="number" /></div>
              <div className="field"><label>Currency</label><select name="currency"><option>GHS</option><option>USD</option></select></div>
              <div className="field"><label>Bedrooms</label><input name="bedrooms" /></div>
              <div className="field"><label>Condition</label><input name="condition" /></div>
              <div className="field"><label>Furnished</label><input name="furnished" /></div>
              <div className="field"><label>Delivery / fulfilment</label><input name="delivery" /></div>
              <div className="field full"><label>Summary</label><textarea name="summary" required /></div>
              <div className="field full"><label>Description</label><textarea name="description" required /></div>
              <div className="field full"><label>Features (comma separated)</label><input name="features" /></div>
            </div>
            <div className="button-row">
              <button className="button primary-button" type="submit">Publish listing</button>
            </div>
          </form>
        </div>
      </section>
    </AppFrame>
  );
}
