import Link from "next/link";
import { newsletterAction } from "@/app/actions";
import { HumanCheckField, StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/join");

export default async function JoinPage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/join");
  const [hero, benefits, emailCapture] = getSectionsByTitle(page, [
    "HERO",
    "WHAT YOU GET",
    "EMAIL NEWSLETTER"
  ]);
  const params = searchParams;
  const benefitItems = (benefits?.loose ?? [])
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, ""));

  return (
    <AppFrame currentPath="/join" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-green"
        eyebrow="Join the Community"
        title={["26,500 people", "who get it."]}
        copy={hero?.fields.Body}
        actions={[{ href: "#community-join", label: "Join the Facebook Group →" }]}
      />

      {params?.subscribed ? (
        <section className="content-section">
          <div className="shell section-shell">
            <StatusNotice title="You’re subscribed" body="We’ve added you to the Communly newsletter list." />
          </div>
        </section>
      ) : null}

      <section className="content-section" id="community-join">
        <div className="shell join-stage-shell">
            <div className="join-stage-media">
            <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/clad%20in%20kente%20people.jpg" alt="People dressed in kente holding Ghana flags together" />
          </div>
          <div className="join-stage-copy">
            <p className="eyebrow">What you get</p>
            <h2>{benefits?.fields.Headline}</h2>
            <p>{hero?.fields["Sub-headline"] || "Ask better questions, get faster answers, and move through Ghana with more confidence."}</p>
            <ul className="join-benefit-list">
              {benefitItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="join-stage-actions">
              <Link className="button primary-button" href="#">
                Join the Facebook Group →
              </Link>
              <p className="join-microcopy">Free. Takes 30 seconds. Lasts for years.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="newsletter">
        <div className="shell join-secondary-shell">
          <div className="join-secondary-media">
            <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/ghana%20black%20stars%20suporteer%20in%20red%20yellow%20green%20shirt.jpg" alt="Ghana supporter in a red, gold, and green shirt in a cheering crowd" />
          </div>
          <div className="join-newsletter-panel">
            <div className="join-newsletter-copy">
              <p className="eyebrow">Email newsletter</p>
              <h2>{emailCapture?.fields.Headline}</h2>
              <p>{emailCapture?.fields.Body}</p>
              <div className="join-newsletter-notes">
                <span>One useful email per week</span>
                <span>No promotional spam</span>
                <span>Community highlights and new guides</span>
              </div>
            </div>
            <form action={newsletterAction} className="form-shell join-newsletter-form">
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="first_name">First name</label>
                  <input id="first_name" name="first_name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <div className="field full">
                  <label htmlFor="persona">I am</label>
                  <select id="persona" name="persona">
                    <option>Relocating to Ghana</option>
                    <option>Already in Ghana</option>
                    <option>Considering a move</option>
                    <option>Diaspora returnee</option>
                    <option>Researcher or NGO</option>
                    <option>Other</option>
                  </select>
                </div>
                <HumanCheckField />
              </div>
              <div className="button-row">
                <button className="button primary-button" type="submit">
                  Subscribe to the newsletter
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
