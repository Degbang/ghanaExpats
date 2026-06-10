import Image from "next/image";
import Link from "next/link";
import { AppFrame, PageHero } from "@/components/site-shell";
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
      <PageHero
        tone="sand"
        backdrop="hero-sand"
        eyebrow="Social & Lifestyle"
        title={hero.fields.Headline}
        copy={hero.fields["Sub-headline"]}
      />

      <section className="content-section">
        <div className="shell discover-editorial-shell">
          <div className="discover-editorial-copy">
            <p className="eyebrow">Food & dining</p>
            <h2>{food.fields.Headline}</h2>
            <p>{food.fields.Body}</p>
          </div>
          <figure className="media-frame spotlight">
            <Image
              src="/media/ghana/images/beach-umbrellas.jpg"
              alt="Colourful umbrellas arranged on a beach in Ghana"
              fill
              sizes="(max-width: 980px) 100vw, 46vw"
            />
          </figure>
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
          <figure className="media-frame spotlight">
            <Image
              src="/media/ghana/images/kente-community.jpg"
              alt="People dressed in kente holding Ghana flags"
              fill
              sizes="(max-width: 980px) 100vw, 44vw"
            />
          </figure>
          <div className="discover-culture-copy">
            <p className="eyebrow">Art, culture & heritage</p>
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
            <p className="eyebrow">Leisure & community</p>
            <h2>Find your off-duty rhythm.</h2>
            <p>These routes keep the page from feeling like a list of attractions and instead make it feel lived in.</p>
          </div>
          <div className="discover-leisure-grid">
            {leisure.blocks.map((block, index) => (
              <article key={block.title} className="discover-leisure-card">
                <div className="media-frame wide">
                  <Image
                    src={index === 0 ? "/media/ghana/images/fishing-community-overview.jpg" : "/media/ghana/images/black-stars-supporter.jpg"}
                    alt={index === 0
                      ? "Fishing community and harbour viewed from above"
                      : "Ghana supporter in a red, gold, and green shirt among a cheering crowd"}
                    fill
                    sizes="(max-width: 980px) 100vw, 50vw"
                  />
                </div>
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
            <p className="eyebrow">Monthly meet & greet</p>
            <h2>{meetup.fields.Headline}</h2>
            <p>{meetup.fields.Body}</p>
            <p className="secondary-copy">{meetup.fields["Sub-text"]}</p>
            <Link className="button primary-button" href="/join">
              {meetup.fields["CTA Button"]}
            </Link>
          </div>
          <figure className="media-frame spotlight">
            <Image
              src="/media/ghana/images/kente-community.jpg"
              alt="Community members in Ghana holding flags and gathering together"
              fill
              sizes="(max-width: 980px) 100vw, 40vw"
            />
          </figure>
        </div>
      </section>

    </AppFrame>
  );
}
