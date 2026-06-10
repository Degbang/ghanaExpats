import Link from "next/link";
import { VideoSpotlight } from "@/components/ghana-media";
import { GenericDocSection } from "@/components/page-blocks";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";
import { guidesFeature } from "@/lib/ghana-media";

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
      <PageHero
        tone="paper"
        backdrop="hero-ghana"
        eyebrow="Relocation Guides"
        title={hero.fields.Headline}
        copy={hero.fields.Body}
      />
      <section className="content-section">
        <div className="shell section-shell">
          <VideoSpotlight {...guidesFeature} />
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
