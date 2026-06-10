import { AppFrame, PageHero } from "@/components/site-shell";
import { ensureAdminIp, requireSession } from "@/lib/auth";
import { listAllListingsForAdmin } from "@/lib/private-data";

export default async function AdminFeaturedPage() {
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
  const featured = (await listAllListingsForAdmin()).filter((listing) => listing.featured);

  return (
    <AppFrame currentPath="/admin" session={session}>
      <PageHero tone="dark" backdrop="hero-solid-forest" eyebrow="Admin" title="Featured placements" copy="Assign and schedule featured vendor slots." />
      <section className="content-section">
        <div className="shell section-shell stack">
          {featured.map((item) => (
            <div key={item.slug} className="detail-card">
              <h3>{item.title}</h3>
              <p>{item.section} · {item.location}</p>
            </div>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
