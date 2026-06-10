import { registerAction } from "@/app/actions";
import { HumanCheckField, StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";

export default async function RegisterPage({ searchParams }) {
  const session = await getCurrentSession();
  const page = getPageContent("/register");
  const [hero, formIntro] = page.sections;
  const params = await searchParams;

  return (
    <AppFrame currentPath="/register" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="Vendor registration" title={hero.fields.Headline} copy={hero.fields.Body} />
      <section className="content-section">
        <div className="shell section-shell">
          {params?.error ? <StatusNotice title="Registration problem" body={params.error} tone="alert" /> : null}
          <div className="feature-grid">
            <div className="callout-box">
              <p className="eyebrow">{formIntro.title}</p>
              <h3>{formIntro.fields.Headline}</h3>
              <p>{formIntro.fields.Body}</p>
            </div>
            <form action={registerAction} className="form-shell">
              <div className="form-grid">
                <div className="field"><label>Business name</label><input name="business_name" required /></div>
                <div className="field"><label>Contact name</label><input name="contact_name" required /></div>
                <div className="field"><label>Email</label><input name="email" type="email" required /></div>
                <div className="field"><label>Phone</label><input name="phone" required /></div>
                <div className="field"><label>Section</label><select name="section" required><option value="directory">Directory</option><option value="real-estate">Real Estate</option><option value="marketplace">Marketplace</option><option value="snug-haven">Snug Haven partner</option></select></div>
                <div className="field"><label>Category</label><input name="category" required /></div>
                <div className="field full"><label>Website or social proof</label><input name="website" /></div>
                <div className="field full"><label>Brief description</label><textarea name="description" required /></div>
                <div className="field"><label>Password</label><input name="password" type="password" required /></div>
                <HumanCheckField />
              </div>
              <div className="button-row">
                <button className="button primary-button" type="submit">Create vendor account</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
