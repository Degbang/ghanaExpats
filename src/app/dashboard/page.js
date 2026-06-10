import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { requireSession } from "@/lib/auth";
import { getBusinessApplicationsForEmail, getDashboardListings, getDashboardOrders } from "@/lib/private-data";

export const metadata = {
  title: "Vendor Dashboard · GhanaExpats.com",
  description: "Manage your listings, renewals, billing, and verification status."
};

export default async function DashboardPage({ searchParams }) {
  const session = await requireSession(["registered_vendor", "registered_seller", "snug_haven_partner", "admin"]);
  const params = await searchParams;
  const listings = await getDashboardListings(session);
  const applications = await getBusinessApplicationsForEmail(session.email);
  const payments = await getDashboardOrders(session);
  const expiringListings = listings.filter((listing) => listing.expires_at && new Date(listing.expires_at).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7);

  return (
    <AppFrame currentPath="/dashboard" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="Vendor dashboard" title="Manage your listings" copy="Create, update, pause, renew, and review the status of your Communly presence." />
      <section className="content-section">
        <div className="shell section-shell">
          {params?.verified ? <StatusNotice title="Verification submitted" body="Your supporting documents are with the Communly team for review." /> : null}
          {params?.listingCreated ? <StatusNotice title="Listing created" body="Your new listing is live and visible immediately after field completion." /> : null}
          {params?.listingUpdated ? <StatusNotice title="Listing updated" body="Your changes have been saved." /> : null}
          <div className="dashboard-grid">
            <div className="stack">
              <div className="dashboard-panel">
                <p className="eyebrow">Overview</p>
                <h2>{session.business_name || session.name}</h2>
                <p>Role: {session.role} · Section: {session.section || "Community"}</p>
                {applications.length > 0 ? <p>Application status: {applications[0].status}</p> : null}
                {expiringListings.length > 0 ? (
                  <StatusNotice title="Renewal reminder" body={`${expiringListings.length} listing(s) are within 7 days of expiry.`} />
                ) : null}
                {session.role === "registered_vendor" ? (
                  <StatusNotice title="Upgrade prompt" body="Free tier vendors can upgrade to Communly Verified for reviews, trust badges, and search priority." />
                ) : null}
              </div>
              <div className="dashboard-panel">
                <div className="cta-strip">
                  <Link className="button primary-button" href="/dashboard/listings/new">Create listing</Link>
                  <form action={logoutAction}><button className="button secondary-button" type="submit">Log out</button></form>
                </div>
              </div>
              <div className="dashboard-panel">
                <p className="eyebrow">Your listings</p>
                <div className="stack">
                  {listings.map((listing) => (
                    <div key={listing.id} className="detail-card">
                      <h3>{listing.title}</h3>
                      <p>{listing.location}</p>
                      <div className="cta-strip">
                        <Link className="text-link" href={`/dashboard/listings/${listing.id}/edit`}>Edit listing</Link>
                        <Link className="text-link" href={listing.section === "marketplace" ? `/marketplace/${listing.slug}` : listing.section === "real-estate" ? `/real-estate/${listing.slug}` : listing.section === "snug-haven" ? `/snug-haven/${listing.slug}` : `/directory/${listing.category_slug}/${listing.slug}`}>View public page</Link>
                      </div>
                    </div>
                  ))}
                  {listings.length === 0 ? <p>You do not have any listings yet.</p> : null}
                </div>
              </div>
            </div>
            <div className="stack">
              <div className="dashboard-panel">
                <p className="eyebrow">Billing</p>
                <div className="stack">
                  {payments.map((payment) => (
                    <div key={payment.id} className="detail-card">
                      <h3>{payment.kind.replaceAll("_", " ")}</h3>
                      <p>{payment.currency} {payment.amount} · {payment.status}</p>
                      <p>{payment.provider} · {payment.reference || "No reference yet"}</p>
                      {payment.status === "pending" ? (
                        <Link className="text-link" href={`/payments/paystack/start?target=${payment.target}&id=${payment.target_id}`}>
                          Pay now
                        </Link>
                      ) : null}
                    </div>
                  ))}
                  {payments.length === 0 ? <p>No active payment items yet.</p> : null}
                </div>
              </div>
              <div className="dashboard-panel">
                <p className="eyebrow">Public profile</p>
                <Link className="button secondary-button" href={`/vendors/${(session.business_name || session.name).toLowerCase().replaceAll(" ", "-")}`}>Open public profile</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
