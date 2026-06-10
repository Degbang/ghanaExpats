import { AppFrame, PageHero } from "@/components/site-shell";
import { ensureAdminIp, requireSession } from "@/lib/auth";
import { getApplicationQueue } from "@/lib/private-data";

export default async function PendingVendorsAdminPage() {
  const session = await requireSession(["admin"]);
  if (!(await ensureAdminIp())) {
    return (
      <AppFrame currentPath="/admin" session={session}>
        <section className="content-section">
          <div className="shell section-shell"><div className="form-shell"><h1>Admin access blocked</h1></div></div>
        </section>
      </AppFrame>
    );
  }
  const queue = await getApplicationQueue();

  return (
    <AppFrame currentPath="/admin" session={session}>
      <PageHero tone="dark" backdrop="hero-solid-forest" eyebrow="Admin" title="Pending vendor applications" copy="Approve, reject, or request more information." />
      <section className="content-section">
        <div className="shell section-shell stack">
          {queue.map((item) => (
            <div key={item.id} className="detail-card">
              <h3>{item.business_name}</h3>
              <p>{item.email} · {item.section} · {item.category}</p>
              <p>Status: {item.status} · Verification complete: {item.verification_complete ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
