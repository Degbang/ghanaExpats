import Link from "next/link";
import { CounterRoll } from "@/components/counter-roll";
import { RevealOnView } from "@/components/reveal-on-view";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { siteConfig } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/");

function routeFromCta(label = "") {
  const cleaned = label.toLowerCase();
  if (cleaned.includes("snug haven")) return "/snug-haven";
  if (cleaned.includes("diaspora")) return "/diaspora-programme";
  if (cleaned.includes("directory")) return "/directory";
  return "/guides";
}

export default async function HomePage() {
  const session = await getCurrentSession();
  const page = getPageContent("/");
  const [hero, audience, programmes, directory, guides, community] = getSectionsByTitle(page, [
    "HERO",
    "AUDIENCE ROUTING",
    "FEATURED PROGRAMMES",
    "DIRECTORY PREVIEW",
    "GUIDES PREVIEW",
    "COMMUNITY SECTION"
  ]);

  const audienceCards = (audience?.blocks ?? []).map((block) => ({
    label: block.title,
    title: block.fields.Headline || block.title,
    copy: block.fields.Body || "",
    cta: block.fields.CTA || "",
    href: routeFromCta(block.fields.CTA || "")
  }));

  const programmeCards = (programmes?.blocks ?? []).map((block) => ({
    eyebrow: block.fields.Eyebrow || block.title,
    title: block.fields.Headline || block.title,
    copy: block.fields.Body || "",
    note: block.fields["Secondary text"] || "",
    cta: block.fields.CTA || "",
    href: routeFromCta(block.fields.CTA || "")
  }));

  const categoryLabels = String(directory?.fields["Category labels (12 icons)"] || "")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);

  const guideCards = [
    {
      title: guides?.fields["Guide card 1 title"],
      copy: guides?.fields["Guide card 1 sub"]
    },
    {
      title: guides?.fields["Guide card 2 title"],
      copy: guides?.fields["Guide card 2 sub"]
    },
    {
      title: guides?.fields["Guide card 3 title"],
      copy: guides?.fields["Guide card 3 sub"]
    }
  ].filter((item) => item.title);

  return (
    <AppFrame currentPath="/" session={session}>
      <section className="home-hero">
        <video autoPlay muted loop playsInline poster="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/freedom%20and%20justice%201.jpg">
          <source src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/drone%20shot%20of%20cars%20parked%20an%20dpeople%20getting%20off.mp4" type="video/mp4" />
        </video>
        <div className="home-hero-overlay" />
        <div className="shell home-hero-shell">
          <div className="home-hero-copy">
            <p className="eyebrow">ACCRA · GHANA · EST. 2018</p>
            <h1>
              <span className="hero-line hero-line-1">Ghana,</span>
              <span className="hero-line hero-line-2">without the guesswork.</span>
            </h1>
            <p className="hero-copy">{hero?.fields["Sub-headline"]}</p>
            <div className="button-row">
              <Link className="button primary-button" href="/directory">
                Browse the Directory →
              </Link>
              <Link className="button secondary-button" href="/join">
                Join the Community →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="community-band">
            <div className="community-band-copy">
              <p className="eyebrow">Expats in Ghana</p>
              <strong><CounterRoll target={26500} /></strong>
              <h2>people who get it.</h2>
              <p>{community?.fields.Body}</p>
              <div className="button-row">
                <Link className="button primary-button" href="/join">
                  Join the Facebook Group →
                </Link>
              </div>
            </div>
            <div className="community-band-media">
              <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/clad%20in%20kente%20people.jpg" alt="Community members in kente holding Ghana flags" />
              <div className="community-band-overlay" />
              <div className="community-band-caption">
                <h3>{siteConfig.memberCount} people who get it.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section audience-section">
        <div className="shell audience-shell">
          <div className="section-header">
            <p className="eyebrow">Audience routing</p>
            <h2>{audience?.fields["Section headline"]}</h2>
          </div>
          <div className="audience-grid">
            {audienceCards.map((card) => (
              <article key={card.title} className="audience-card">
                <p className="eyebrow">{card.label}</p>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <Link href={card.href}>{card.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <RevealOnView as="div" className="photo-break reveal-up">
          <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/overview%20of%20ghana%20fishing%20community%2C%20top%20angle.jpg" alt="Overview of a fishing community on the Ghanaian coast" />
        </RevealOnView>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-header">
            <p className="eyebrow">Featured programmes</p>
            <h2>{programmes?.fields["Section headline"]}</h2>
          </div>
          <div className="programme-panels">
            {programmeCards.map((card, index) => (
              <article
                key={card.title}
                className={`programme-panel ${index === 1 ? "is-diaspora" : ""}`}
                style={{ background: index === 0 ? "var(--deep-forest)" : "var(--laterite)" }}
              >
                <div className="programme-panel-copy">
                  <p className="eyebrow">{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  {card.note ? <p className="copy-strong">{card.note}</p> : null}
                  <div>
                    <Link className="button secondary-button" href={card.href}>
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="beach-parallax" aria-hidden="true" />
      </section>

      <section className="content-section directory-preview-grid">
        <div className="shell">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Directory preview</p>
              <h2>{directory?.fields["Section headline"]}</h2>
              <p>{directory?.fields.Body}</p>
            </div>
            <div className="category-grid">
              {categoryLabels.map((item) => (
                <Link key={item} href="/directory" className="category-tile">
                  <strong>{item}</strong>
                  <span>Verified and community-checked</span>
                </Link>
              ))}
            </div>
            <div className="button-row" style={{ marginTop: "1.25rem" }}>
              <Link className="button primary-button" href="/directory">
                Search the Directory
              </Link>
              <Link className="button secondary-button" href="/list">
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-header">
            <p className="eyebrow">Guides preview</p>
            <h2>{guides?.fields["Section headline"]}</h2>
          </div>
          <div className="guide-grid">
            {guideCards.map((card) => (
              <article key={card.title} className="guide-card section-card">
                <p className="eyebrow">Guide</p>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <Link href="/guides">Read guide</Link>
              </article>
            ))}
          </div>
          <div className="button-row" style={{ marginTop: "1.25rem" }}>
            <Link className="button secondary-button" href="/guides">
              Browse All Guides →
            </Link>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
