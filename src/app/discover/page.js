import Image from "next/image";
import Link from "next/link";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";

export const metadata = {
  title: "Social & Lifestyle · GhanaExpats.com",
  description: "Food, nightlife, cultural hubs, weekend escapes, and community rhythm across Ghana."
};

export default async function DiscoverPage() {
  const session = await getCurrentSession();
  const page = getPageContent("/discover");
  const [hero, food, arts, leisure, meetup] = getSectionsByTitle(page, [
    "HERO",
    "FOOD & DINING",
    "ART, CULTURE & HERITAGE",
    "LEISURE & COMMUNITY",
    "MONTHLY MEET & GREET"
  ]);

  return (
    <AppFrame currentPath="/discover" session={session}>
      <section className="discover-hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="discover-hero-video"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/nice%20slow%20mo%20shot%20of%20car%20and%20tricycle%20moving.mp4" type="video/mp4" />
        </video>
        <div className="discover-hero-overlay" />
        <div className="shell discover-hero-shell">
          <div className="discover-hero-copy">
            <p className="eyebrow">Social &amp; Lifestyle</p>
            <h1>{hero.fields.Headline}</h1>
            <p className="hero-copy" style={{ color: "rgba(247,243,236,0.8)", marginTop: "0.75rem" }}>
              {hero.fields["Sub-headline"]}
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell discover-editorial-shell">
          <div className="discover-editorial-copy">
            <p className="eyebrow">Food &amp; dining</p>
            <h2>{food.fields.Headline}</h2>
            <p>{food.fields.Body}</p>
          </div>
        </div>
        <div className="shell discover-card-grid">
          {food.blocks.map((block) => (
            <article key={block.title} className="discover-card">
              <p className="eyebrow">Route</p>
              <h3>{block.fields.Headline || block.title}</h3>
              <p>{block.fields.Body}</p>
              <Link className="text-link" href="/contact">
                {block.fields["CTA Button"]} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section tone-paper">
        <div className="shell discover-culture-shell">
          <div className="discover-culture-copy">
            <p className="eyebrow">Art, culture &amp; heritage</p>
            <h2>{arts.fields.Headline}</h2>
            <p>{arts.fields.Body}</p>
            {arts.blocks.map((block) => (
              <article key={block.title} className="discover-inline-panel">
                <h3>{block.fields.Headline || block.title}</h3>
                <p>{block.fields.Body}</p>
                <Link className="button secondary-button" href="/contact">
                  {block.fields["CTA Button"]}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell section-shell">
          <div className="section-intro">
            <p className="eyebrow">Leisure &amp; community</p>
            <h2>Find your off-duty rhythm.</h2>
            <p>These routes keep the page from feeling like a list of attractions and instead make it feel lived in.</p>
          </div>
          <div className="discover-leisure-grid">
            {leisure.blocks.map((block, index) => (
              <article key={block.title} className="discover-leisure-card">
                <div className="discover-leisure-copy">
                  <p className="eyebrow">{index === 0 ? "Weekend escapes" : "Peer community"}</p>
                  <h3>{block.fields.Headline || block.title}</h3>
                  <p>{block.fields.Body}</p>
                  <Link className="text-link" href="/join">
                    {block.fields["CTA Button"]} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section tone-sand">
        <div className="shell discover-meet-shell">
          <div className="discover-meet-copy">
            <p className="eyebrow">Monthly meet &amp; greet</p>
            <h2>{meetup.fields.Headline}</h2>
            <p>{meetup.fields.Body}</p>
            <p className="secondary-copy">{meetup.fields["Sub-text"]}</p>
            <Link className="button primary-button" href="/join">
              {meetup.fields["CTA Button"]}
            </Link>
          </div>
          <figure className="media-frame spotlight">
            <Image
              src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/ghana%20black%20stars%20suporteer%20in%20red%20yellow%20green%20shirt.jpg"
              alt="Ghana supporter in a red, gold, and green shirt among a cheering crowd"
              fill
              sizes="(max-width: 980px) 100vw, 40vw"
            />
          </figure>
        </div>
      </section>

    </AppFrame>
  );
}
