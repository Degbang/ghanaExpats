import { AppFrame, PageHero } from "@/components/site-shell";
import { ensureAdminIp, requireSession } from "@/lib/auth";
import { getMessagesInbox } from "@/lib/private-data";

export default async function AdminMessagesPage() {
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
  const messages = await getMessagesInbox();

  return (
    <AppFrame currentPath="/admin" session={session}>
      <PageHero tone="dark" backdrop="hero-solid-forest" eyebrow="Admin" title="Vendor communications" copy="Direct messaging with vendors and inbound support requests." />
      <section className="content-section">
        <div className="shell section-shell stack">
          {messages.map((message) => (
            <div key={message.id} className="detail-card">
              <h3>{message.subject}</h3>
              <p>{message.email} · {message.type}</p>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
