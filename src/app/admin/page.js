import Link from "next/link";
import { AppFrame, PageHero } from "@/components/site-shell";
import { ensureAdminIp, requireSession } from "@/lib/auth";
import { getApplicationQueue, getMessagesInbox, getRevenueSummary, listAllListingsForAdmin } from "@/lib/private-data";

function AdminNav() {
  return (
    <div className="admin-nav">
      <Link href="/admin">Overview</Link>
      <Link href="/admin/vendors/pending">Pending vendors</Link>
      <Link href="/admin/listings">All listings</Link>
      <Link href="/admin/featured">Featured placements</Link>
      <Link href="/admin/messages">Vendor communications</Link>
    </div>
  );
}

export default async function AdminPage() {
  const session = await requireSession(["admin"]);
  const allowed = await ensureAdminIp();
  if (!allowed) {
    return (
      <AppFrame currentPath="/admin" session={session}>
        <section className="content-section">
          <div className="shell section-shell">
            <div className="form-shell">
              <h1>Admin access blocked</h1>
              <p>This route is IP restricted in line with the functional spec.</p>
            </div>
          </div>
        </section>
      </AppFrame>
    );
  }

  const applications = await getApplicationQueue();
  const messages = await getMessagesInbox();
  const listings = await listAllListingsForAdmin();
  const revenue = await getRevenueSummary();

  return (
    <AppFrame currentPath="/admin" session={session}>
      <PageHero tone="dark" backdrop="hero-solid-forest" eyebrow="Admin dashboard" title="Platform operations" copy="Applications, listings, revenue, and communications in one place." />
      <section className="content-section">
        <div className="shell section-shell">
          <AdminNav />
          <div className="stat-grid">
            <div className="stat-card"><p className="eyebrow">Pending applications</p><h3>{applications.filter((item) => item.status === "pending").length}</h3></div>
            <div className="stat-card"><p className="eyebrow">Active listings</p><h3>{listings.length}</h3></div>
            <div className="stat-card"><p className="eyebrow">Inbox</p><h3>{messages.length}</h3></div>
            <div className="stat-card"><p className="eyebrow">Orders</p><h3>{revenue.length}</h3></div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
