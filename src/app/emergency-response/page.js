import Link from "next/link";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/emergency-response");

function emergencyHref(session) {
  return session ? "tel:+233201497813" : "/join?gate=emergency";
}

export default async function EmergencyPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/emergency-response");
  const hero = page?.sections?.[0] ?? null;
  const [critical, utilities, howItWorks, membership] = getSectionsByTitle(page, [
    "CRITICAL EMERGENCIES",
    "URGENT UTILITIES",
    "HOW IT WORKS",
    "MEMBERSHIP GATE"
  ]);

  return (
    <AppFrame currentPath="/emergency-response" session={session}>
      <div className="emergency-page">
        <section className="emergency-hero">
          <div className="emergency-hero-image" />
          <div className="emergency-hero-overlay" />
          <div className="shell emergency-hero-shell">
            <div className="emergency-hero-copy">
              <p className="eyebrow">24/7 Emergency Response</p>
              <h1>
                <span className="hero-line hero-line-1">We are here</span>
                <span className="hero-line hero-line-2">when Ghana is not.</span>
              </h1>
              <p>{hero?.fields.Body}</p>
              <div className="button-row">
                <Link className="button emergency-button" href={emergencyHref(session)}>
                  Get Immediate Help Now
                </Link>
                <Link className="button secondary-button" href="#critical-emergencies">
                  Explore All Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="critical-emergencies" className="content-section">
          <div className="shell emergency-shell">
            <div className="section-header">
              <p className="eyebrow">Critical Emergencies</p>
              <h2>{critical?.fields["Section headline"]}</h2>
              <p>{critical?.fields["Section intro"]}</p>
            </div>
            <div className="service-grid">
              {(critical?.blocks ?? []).map((block) => (
                <article key={block.title} className="service-card">
                  <h3>{block.fields.Headline || block.title}</h3>
                  <p>{block.fields.Body}</p>
                  <div className="button-row" style={{ marginTop: "1rem" }}>
                    <Link className="button emergency-button" href={emergencyHref(session)}>
                      {block.fields["CTA Button"]}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="shell emergency-shell">
            <div className="section-header">
              <p className="eyebrow">Urgent Utilities</p>
              <h2>{utilities?.fields["Section headline"]}</h2>
              <p>{utilities?.fields["Section intro"]}</p>
            </div>
            <div className="service-grid">
              {(utilities?.blocks ?? []).map((block) => {
                const isComingSoon = (block.fields.Headline || "").toLowerCase().includes("coming soon");
                return (
                  <article key={block.title} className="service-card">
                    <h3>{block.fields.Headline || block.title}</h3>
                    <p>{block.fields.Body}</p>
                    <div className="button-row" style={{ marginTop: "1rem" }}>
                      <Link className="button emergency-button" href={isComingSoon ? "/join" : emergencyHref(session)}>
                        {block.fields["CTA Button"]}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="shell emergency-shell">
            <div className="section-header">
              <p className="eyebrow">How it works</p>
              <h2>{howItWorks?.fields["Section headline"]}</h2>
            </div>
            <div className="emergency-process-grid">
              {(howItWorks?.blocks ?? []).map((step, index) => (
                <article key={step.title} className="emergency-process-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.fields.Headline || step.title}</h3>
                  <p>{step.fields.Body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {!session ? (
          <section className="content-section">
            <div className="shell emergency-shell">
              <div className="section-card">
                <div className="section-header">
                  <p className="eyebrow">Membership gate</p>
                  <h2>{membership?.fields.Headline}</h2>
                  <p>{membership?.fields.Body}</p>
                </div>
                <div className="button-row">
                  <Link className="button emergency-button" href="/join">
                    {membership?.fields["CTA Button"]}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </AppFrame>
  );
}
