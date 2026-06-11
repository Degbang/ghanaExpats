import Link from "next/link";
import { contactAction } from "@/app/actions";
import { HumanCheckField } from "@/components/forms";
import { AppFrame } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/diaspora-programme");

export default async function DiasporaProgrammePage() {
  const session = await getCurrentSession();
  const page = getPageContent("/diaspora-programme");
  const hero = page?.sections?.[0] ?? null;
  const [intro, offerings, countryReach, enquiry, crossLink] = getSectionsByTitle(page, [
    "WHAT THIS IS",
    "PROGRAMME OFFERINGS",
    "COUNTRY REACH",
    "ENQUIRY FORM",
    "SNUG HAVEN CROSS-LINK"
  ]);
  const countries = String(countryReach?.fields.Body || "")
    .split(":")
    .at(-1)
    ?.split("·")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

  return (
    <AppFrame currentPath="/diaspora-programme" session={session}>
      <section className="video-hero">
        <video autoPlay muted loop playsInline poster="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/freedom%20and%20justice%201.jpg">
          <source src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/video%20of%20ghana%20flag%20on%20a%20map.mp4" type="video/mp4" />
        </video>
        <div className="video-hero-overlay" style={{ background: "linear-gradient(to top, rgba(139, 58, 31, 0.92) 0%, rgba(139, 58, 31, 0.62) 40%, rgba(139, 58, 31, 0.16) 80%, rgba(139, 58, 31, 0) 100%)" }} />
        <div className="shell video-hero-shell" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="video-hero-copy">
            <h1>
              <span className="diaspora-line-1">Go back.</span>
              <span className="diaspora-line-2">Find what was lost.</span>
              <span className="diaspora-line-3">Come home to yourself.</span>
            </h1>
            <p className="hero-copy">{hero?.fields["Sub-headline"]}</p>
            <div className="button-row" style={{ justifyContent: "center" }}>
              <Link className="button primary-button" href="#programmes">
                {hero?.fields["CTA Button 1"] || "Explore the Programmes"}
              </Link>
              <Link className="button secondary-button" href="#enquiry">
                {hero?.fields["CTA Button 2"] || "Register Your Interest"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="full-width-photo">
          <img src="https://pub-934ea8ca1c414fc6bb57081527cb3f4a.r2.dev/clad%20in%20kente%20people.jpg" alt="People in kente holding Ghana flags together" />
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-card">
            <div className="copy-stack">
              <p className="eyebrow">What this is</p>
              <h2>{intro?.fields.Headline}</h2>
              <p>{intro?.fields.Body}</p>
              <blockquote className="pull-quote">This is not a tour. It is a return.</blockquote>
            </div>
          </div>
        </div>
      </section>

      <section id="programmes" className="content-section">
        <div className="shell">
          <div className="section-header">
            <p className="eyebrow">Programme offerings</p>
            <h2>{offerings?.fields["Section headline"]}</h2>
          </div>
          <div className="listing-grid">
            {(offerings?.blocks ?? []).map((item) => (
              <article key={item.title} className="info-panel">
                <p className="eyebrow">{item.title}</p>
                <h3>{item.fields.Headline || item.title}</h3>
                <p>{item.fields.Body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell split-layout">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Country reach</p>
              <h2>{countryReach?.fields["Section headline"]}</h2>
              <p>{countryReach?.fields.Body}</p>
            </div>
            <div className="button-row">
              <Link className="button secondary-button" href="#enquiry">
                {countryReach?.fields["CTA Button"] || "Register Interest in New Countries →"}
              </Link>
            </div>
          </div>
          <div className="support-grid">
            {countries.map((country) => (
              <article key={country} className="info-panel">
                <h3>{country}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="content-section">
        <div className="shell split-layout">
          <div className="section-card">
            <div className="section-header">
              <p className="eyebrow">Enquiry form</p>
              <h2>{enquiry?.fields.Headline}</h2>
              <p>{enquiry?.fields.Body}</p>
            </div>
          </div>
          <form action={contactAction} className="form-shell">
            <input type="hidden" name="subject" value="Diaspora Heritage Journeys" />
            <div className="form-grid">
              <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required /></div>
              <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required /></div>
              <div className="field"><label htmlFor="phone">WhatsApp number</label><input id="phone" name="phone" /></div>
              <div className="field"><label htmlFor="residence">Nationality and country of current residence</label><input id="residence" name="residence" /></div>
              <div className="field">
                <label htmlFor="ancestry_country">Ancestry / country of interest</label>
                <select id="ancestry_country" name="ancestry_country" defaultValue="Ghana">
                  <option>Ghana</option>
                  <option>Senegal</option>
                  <option>Benin</option>
                  <option>Togo</option>
                  <option>Nigeria</option>
                  <option>South Africa</option>
                  <option>Not sure — help me find out</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="programme_type">Programme type</label>
                <select id="programme_type" name="programme_type" defaultValue="Heritage Tour">
                  <option>Heritage Tour</option>
                  <option>Cultural Immersion</option>
                  <option>Ancestral Connections</option>
                  <option>Diaspora Leadership Exchange</option>
                  <option>Healing & Reconnection</option>
                  <option>Pan African Journey</option>
                  <option>Not sure</option>
                </select>
              </div>
              <div className="field"><label htmlFor="travel_window">Preferred travel window</label><input id="travel_window" name="travel_window" /></div>
              <div className="field">
                <label htmlFor="group_size">Group size</label>
                <select id="group_size" name="group_size" defaultValue="solo">
                  <option value="solo">solo</option>
                  <option value="couple">couple</option>
                  <option value="small-group">small group 3–8</option>
                  <option value="large-group">larger group</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="message">Anything else we should know</label>
                <textarea id="message" name="message" required defaultValue="Diaspora Heritage Journeys enquiry" />
              </div>
              <HumanCheckField />
            </div>
            <div className="button-row" style={{ marginTop: "1rem" }}>
              <button className="button primary-button" type="submit">
                Send My Enquiry →
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-card" style={{ background: "var(--deep-forest)", color: "var(--ivory-paper)" }}>
            <div className="section-header">
              <p className="eyebrow">Snug Haven cross-link</p>
              <h2>{crossLink?.fields.Headline}</h2>
              <p style={{ color: "rgba(247, 243, 236, 0.82)" }}>{crossLink?.fields.Body}</p>
            </div>
            <div className="button-row">
              <Link className="button secondary-button" href="/snug-haven">
                {crossLink?.fields["CTA Button"] || "Browse The Snug Haven Collection →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
