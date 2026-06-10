import { GenericDocSection } from "@/components/page-blocks";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/guides/finding-housing-accra");

export default async function HousingGuidePage() {
  const session = await getCurrentSession();
  const page = getPageContent("/guides/finding-housing-accra");
  const [hero, ...sections] = page.sections;

  return (
    <AppFrame currentPath="/guides" session={session}>
      <PageHero tone="paper" backdrop="hero-ghana" eyebrow="Guide" title={hero.fields.Headline} copy={hero.fields["Sub-headline"]} />
      <section className="content-section">
        <div className="shell section-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }, { label: "Finding Housing" }]} />
        </div>
      </section>
      {sections.map((section, index) => (
        <GenericDocSection key={section.title} section={section} tone={index % 2 === 0 ? "paper" : "dark"} />
      ))}
    </AppFrame>
  );
}
