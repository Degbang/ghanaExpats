import Link from "next/link";
import { contactAction } from "@/app/actions";
import { HumanCheckField, StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent, getSectionsByTitle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/contact");

export default async function ContactPage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/contact");
  const [hero, categories, formSection] = getSectionsByTitle(page, [
    "HERO",
    "CONTACT CATEGORIES",
    "CONTACT FORM"
  ]);
  const params = await searchParams;
  const categoryRows = (categories?.loose ?? [])
    .filter((line) => line.includes("·"))
    .map((line) => {
      const [title, description] = line.split("·").map((item) => item.trim());
      return { title, description };
    });

  return (
    <AppFrame currentPath="/contact" session={session}>
      <PageHero
        tone="green"
        backdrop="hero-green"
        eyebrow="Contact"
        title={["Talk", "to us."]}
        copy={hero?.fields["Sub-headline"] || hero?.fields.Body}
      />

      <section className="content-section">
        <div className="shell contact-routing-shell">
          {params?.submitted ? (
            <StatusNotice title="Thank you" body="We have received your message and will be in touch within one working day. For urgent matters, WhatsApp is fastest: +233 20 149 7813." />
          ) : null}
          <div className="section-intro">
            <p className="eyebrow">Contact categories</p>
            <h2>Start in the right lane and the response gets faster.</h2>
          </div>
          <div className="contact-routing-table">
            {categoryRows.map((row) => (
              <article key={row.title} className="contact-routing-card">
                <h3>{row.title}</h3>
                <p>{row.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell contact-form-shell">
          <div className="contact-form-copy">
            <p className="eyebrow">Contact form</p>
            <h2>{formSection?.fields.Headline}</h2>
            <p>{formSection?.fields["Supporting text"]}</p>
            <div className="contact-direct-links">
              <Link className="button secondary-button" href="/join">
                Join the community
              </Link>
              <a className="button whatsapp-button" href="https://wa.me/233201497813">
                WhatsApp fast route
              </a>
            </div>
          </div>
          <form action={contactAction} className="form-shell contact-form-card">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" />
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option>General enquiry</option>
                  <option>Vendor support</option>
                  <option>Press and media</option>
                  <option>Partnerships and advertising</option>
                  <option>Snug Haven accommodation</option>
                  <option>Diaspora Heritage Journeys</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
              <HumanCheckField />
            </div>
            <div className="button-row">
              <button className="button primary-button" type="submit">
                {formSection?.fields["Submit Button"] || "Send message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </AppFrame>
  );
}
