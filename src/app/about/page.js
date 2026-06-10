import Image from "next/image";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";

export const metadata = {
  title: "About Communly · GhanaExpats.com",
  description: "Who we are, how we work, and how trust is handled across the GhanaExpats platform."
};

export default async function AboutPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/about");
  const [hero, whoWeAre, howWeWork] = getSectionsByTitle(page, [
    "HERO",
    "WHO WE ARE",
    "HOW WE WORK"
  ]);

  return (
    <AppFrame currentPath="/about" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-ghana"
        eyebrow="About Communly"
        title={hero.fields.Headline}
        copy={whoWeAre.fields.Body}
      />

      <section className="content-section">
        <div className="shell about-editorial-shell">
          <div className="about-editorial-copy">
            <p className="eyebrow">Who we are</p>
            <h2>{whoWeAre.fields.Headline}</h2>
            <div className="copy-stack">
              {whoWeAre.fields.Body.split(/\n+/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="about-editorial-media">
            <figure className="media-frame spotlight">
              <Image
                src="/media/ghana/images/nkrumah-museum.jpg"
                alt="Kwame Nkrumah Memorial Park in Accra"
                fill
                sizes="(max-width: 980px) 100vw, 42vw"
              />
            </figure>
            <figure className="media-frame tall">
              <Image
                src="/media/ghana/images/independence-arch-close.jpg"
                alt="Palm tree in front of the Independence Arch in Accra"
                fill
                sizes="(max-width: 980px) 100vw, 42vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="content-section tone-paper">
        <div className="shell section-shell about-beliefs-shell">
          <div className="section-intro">
            <p className="eyebrow">How we work</p>
            <h2>{howWeWork.fields.Headline}</h2>
          </div>
          <div className="about-beliefs-grid">
            {howWeWork.blocks.map((belief, index) => (
              <article key={`${belief.title}-${index}`} className="about-belief-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{belief.fields.Headline || belief.title}</h3>
                <p>{belief.fields.Body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell about-berecons-shell">
          <div className="about-berecons-panel">
            <p className="eyebrow">Platform accountability</p>
            <h2>Trust is a product decision, not just a design detail.</h2>
            <p>
              Listings, referrals, and support pathways are reviewed against the same public standard. The goal is
              practical clarity: what is verified, what is editorial, and what should still be independently checked.
            </p>
          </div>
          <div className="about-berecons-note">
            <p className="eyebrow">Editorial integrity</p>
            <p>
              The community is managed with independence. Commercial relationships are disclosed, and editorial
              recommendations are kept separate from paid placement.
            </p>
          </div>
        </div>
      </section>

    </AppFrame>
  );
}
