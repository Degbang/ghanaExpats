import { notFound } from "next/navigation";
import { dashboardListingUpdateAction } from "@/app/actions";
import { AppFrame, PageHero } from "@/components/site-shell";
import { requireSession } from "@/lib/auth";
import { getOwnedListingById } from "@/lib/private-data";

export default async function EditListingPage({ params }) {
  const session = await requireSession(["registered_vendor", "registered_seller", "snug_haven_partner"]);
  const { id } = await params;
  const listing = await getOwnedListingById(session, id);
  if (!listing) notFound();

  return (
    <AppFrame currentPath="/dashboard" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="Edit listing" title={listing.title} copy="Update your own listing details, then save changes." />
      <section className="content-section">
        <div className="shell section-shell">
          <form action={dashboardListingUpdateAction} className="form-shell">
            <input type="hidden" name="id" value={listing.id} />
            <div className="form-grid">
              <div className="field"><label>Title</label><input name="title" defaultValue={listing.title} required /></div>
              <div className="field"><label>Category</label><input name="category" defaultValue={listing.category} required /></div>
              <div className="field"><label>Location</label><input name="location" defaultValue={listing.location} required /></div>
              <div className="field"><label>Price</label><input name="price" type="number" defaultValue={listing.price || ""} /></div>
              <div className="field"><label>Currency</label><select name="currency" defaultValue={listing.currency || "GHS"}><option>GHS</option><option>USD</option></select></div>
              <div className="field"><label>Status</label><select name="status" defaultValue={listing.status}><option value="published">Published</option><option value="paused">Paused</option></select></div>
              <div className="field"><label>Bedrooms</label><input name="bedrooms" defaultValue={listing.meta.bedrooms || ""} /></div>
              <div className="field"><label>Condition</label><input name="condition" defaultValue={listing.meta.condition || ""} /></div>
              <div className="field"><label>Furnished</label><input name="furnished" defaultValue={listing.meta.furnished || ""} /></div>
              <div className="field"><label>Delivery</label><input name="delivery" defaultValue={listing.meta.delivery || ""} /></div>
              <div className="field full"><label>Summary</label><textarea name="summary" defaultValue={listing.summary} required /></div>
              <div className="field full"><label>Description</label><textarea name="description" defaultValue={listing.description} required /></div>
              <div className="field full"><label>Features</label><input name="features" defaultValue={(listing.meta.features || []).join(", ")} /></div>
            </div>
            <div className="button-row">
              <button className="button primary-button" type="submit">Save changes</button>
            </div>
          </form>
        </div>
      </section>
    </AppFrame>
  );
}
