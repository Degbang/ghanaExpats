import { GenericDocSection } from "@/components/page-blocks";
import { AppFrame, Breadcrumbs, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/guides/international-schools-ghana");

export default async function SchoolsGuidePage() {
  const session = await getCurrentSession();
  const page = getPageContent("/guides/international-schools-ghana");
  const [hero, ...sections] = page.sections;

  return (
    <AppFrame currentPath="/guides" session={session}>
      <PageHero tone="paper" backdrop="hero-ghana" eyebrow="Guide" title={hero.fields.Headline} copy={hero.fields["Sub-headline"]} />
      <section className="content-section">
        <div className="shell section-shell">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }, { label: "International Schools" }]} />
        </div>
      </section>
      {sections.map((section) => (
        <GenericDocSection key={section.title} section={section} tone="paper" />
      ))}
    </AppFrame>
  );
}
