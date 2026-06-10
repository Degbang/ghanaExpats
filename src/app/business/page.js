import Link from "next/link";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/business");

const routingCards = [
  {
    eyebrow: "Legal",
    href: "/directory/legal-and-solicitors",
    fallback: "Find a Verified Corporate Lawyer"
  },
  {
    eyebrow: "Registration",
    href: "/directory/legal-and-solicitors",
    fallback: "Find a Business Registration Agent"
  }
];

export default async function BusinessPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/business");
  const [hero, overview, registration, compliance, dueDiligence, directoryRouting] = getSectionsByTitle(page, [
    "HERO",
    "OVERVIEW INTRO",
    "BUSINESS REGISTRATION",
    "STATUTORY COMPLIANCE",
    "DUE DILIGENCE",
    "DIRECTORY ROUTING"
  ]);

  const businessSections = [
    registration,
    compliance,
    dueDiligence
  ].filter(Boolean);

  return (
    <AppFrame currentPath="/business" session={session}>
      <PageHero
        tone="dark"
        backdrop="hero-dark"
        eyebrow="Business in Ghana"
        title={["Ghana is open", "for business."]}
        copy={hero?.fields["Sub-headline"]}
      />

      <section className="content-section">
        <div className="shell business-overview-shell">
          <div className="business-overview-copy">
            <p className="eyebrow">Overview intro</p>
            <h2>Practical, honest guidance before you commit capital.</h2>
            <p>{overview?.fields.Body}</p>
          </div>
          <div className="business-overview-panel">
            <strong>Operating principle</strong>
            <p>Always verify the requirement with a qualified Ghanaian legal or advisory professional before proceeding.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell business-article-shell">
          <div className="section-intro">
            <p className="eyebrow">Operating sequence</p>
            <h2>Registration, compliance, and due diligence in the right order.</h2>
          </div>
          <div className="business-article-list">
            {businessSections.map((section, index) => (
              <article key={section.title} className="business-article">
                <div className="business-article-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="business-article-body">
                  <h3>{section.fields.Headline}</h3>
                  <p>{section.fields.Body}</p>
                  {section.fields["Inline CTA"] ? <p className="copy-strong">{section.fields["Inline CTA"]}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell business-routing-shell">
          <div className="section-intro">
            <p className="eyebrow">Directory routing</p>
            <h2>{directoryRouting?.fields.Headline}</h2>
          </div>
          <div className="business-routing-grid">
            {routingCards.map((card, index) => (
              <Link key={card.eyebrow} className="business-routing-card" href={card.href}>
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{directoryRouting?.fields[`CTA Button ${index + 1}`] || card.fallback}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
