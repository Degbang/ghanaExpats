import Link from "next/link";
import { GenericDocSection } from "@/components/page-blocks";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";

export const metadata = {
  title: "Relocation Guides · GhanaExpats.com",
  description: "Everything you need to know about living in Ghana, written by people who live here."
};

const guideCards = [
  { eyebrow: "Guide", title: "Arriving in Accra", copy: "Your first 30 days, step by step.", href: "/guides/arriving-in-accra", linkLabel: "Read guide" },
  { eyebrow: "Guide", title: "Finding Housing", copy: "How the Accra rental market really works.", href: "/guides/finding-housing-accra", linkLabel: "Read guide" },
  { eyebrow: "Guide", title: "International Schools", copy: "Curriculum options, fees, timelines, and parent considerations.", href: "/guides/international-schools-ghana", linkLabel: "Read guide" },
  { eyebrow: "Guide", title: "Healthcare for Expats", copy: "Private hospitals, insurance, pharmacies, and emergency procedures.", href: "/guides/healthcare-expats-ghana", linkLabel: "Read guide" }
];

export default async function GuidesPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/guides");
  const [hero, structure, comingSoon] = page.sections;
  const leadGuide = guideCards[0];
  const supportingGuides = guideCards.slice(1);

  return (
    <AppFrame currentPath="/guides" session={session}>
      <section className="image-hero">
        <div className="guides-hero-image">
          <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/freedom%20and%20justice%201.jpg" alt="Independence Arch with palm tree in Accra" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="image-hero-overlay" style={{ background: "linear-gradient(to right, rgba(26, 58, 46, 0.92) 0%, rgba(26, 58, 46, 0.65) 50%, rgba(26, 58, 46, 0.20) 100%)" }} />
        <div className="shell video-hero-shell">
          <div className="image-hero-copy">
            <h1>
              <span className="hero-line hero-line-1">{hero.fields.Headline}</span>
            </h1>
            <p className="hero-copy">{hero.fields.Body}</p>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="shell guides-index-shell">
          <div className="section-intro">
            <p className="eyebrow">Guide cards</p>
            <h2>Phase 1 live guides built for the first real questions.</h2>
          </div>
          <div className="guides-index-grid">
            <article className="guides-lead-card">
              <p className="eyebrow">{leadGuide.eyebrow}</p>
              <h3>{leadGuide.title}</h3>
              <p>{leadGuide.copy}</p>
              <Link className="button primary-button" href={leadGuide.href}>
                {leadGuide.linkLabel}
              </Link>
            </article>
            <div className="guides-support-grid">
              {supportingGuides.map((guide) => (
                <Link key={guide.title} className="guides-support-card" href={guide.href}>
                  <p className="eyebrow">{guide.eyebrow}</p>
                  <h3>{guide.title}</h3>
                  <p>{guide.copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <GenericDocSection section={structure} tone="paper" />
      <section className="content-section">
        <div className="shell guides-coming-shell">
          <div className="section-intro">
            <p className="eyebrow">Coming soon</p>
            <h2>Phase 2 guides</h2>
            <p>Driving in Accra, Visa & Immigration, Cost of Living, Safety & Security, and Business in Ghana remain deferred as documented.</p>
          </div>
          <div className="guides-coming-grid">
            {["Driving in Accra", "Visa & Immigration", "Cost of Living", "Safety & Security", "Business in Ghana"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="button-row">
            <Link className="button secondary-button" href="/join">
              Join for updates
            </Link>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
