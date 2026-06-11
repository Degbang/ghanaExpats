import { AppFrame } from "@/components/site-shell";
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
      <section className="image-hero">
        <div className="about-hero-image">
          <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/freedom%20and%20justice%202.jpg" alt="Independence Arch in Accra with palm trees" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="image-hero-overlay" style={{ background: "rgba(26, 58, 46, 0.60)" }} />
        <div className="shell video-hero-shell" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="image-hero-copy">
            <h1>
              <span className="hero-line hero-line-1">{hero?.fields.Headline || "About Communly"}</span>
            </h1>
            <p className="hero-copy" style={{ maxWidth: "520px" }}>{whoWeAre.fields.Body}</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="about-editorial-copy">
            <p className="eyebrow">Who we are</p>
            <h2>{whoWeAre.fields.Headline}</h2>
            <div className="copy-stack">
              {whoWeAre.fields.Body.split(/\n+/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
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
