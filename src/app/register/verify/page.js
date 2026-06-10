import { verificationAction } from "@/app/actions";
import { StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";
import { getCurrentSession, requireSession } from "@/lib/auth";
import { getPageContent } from "@/lib/content";

export default async function VerifyPage({ searchParams }) {
  await requireSession();
  const session = await getCurrentSession();
  const page = getPageContent("/register/verify");
  const [hero, sectionHeader, uploadSection] = page.sections;
  const params = await searchParams;

  return (
    <AppFrame currentPath="/register" session={session}>
      <PageHero tone="green" backdrop="hero-ghana" eyebrow="Verification form" title={hero.fields.Headline} copy={hero.fields.Body} />
      <section className="content-section">
        <div className="shell section-shell">
          {params?.created ? <StatusNotice title="Application received" body="Your application is with us. Complete the verification form now so the admin team can review it." /> : null}
          <form action={verificationAction} className="form-shell">
            <div className="section-intro">
              <p className="eyebrow">{sectionHeader.title}</p>
              <h2>{sectionHeader.fields.Headline}</h2>
              <p>{sectionHeader.fields.Body}</p>
            </div>
            <div className="form-grid">
              <div className="field"><label>Legal business or individual name</label><input name="legal_name" required defaultValue={session.business_name || ""} /></div>
              <div className="field"><label>Trading name</label><input name="trading_name" /></div>
              <div className="field"><label>Primary contact phone</label><input name="primary_phone" required /></div>
              <div className="field"><label>WhatsApp</label><input name="whatsapp" required /></div>
              <div className="field"><label>Business address or operating area</label><input name="address" required /></div>
              <div className="field"><label>Years in operation</label><input name="years_in_operation" required /></div>
              <div className="field full"><label>Brief business description</label><textarea name="business_description" required /></div>
              <div className="field full"><label>Client reference</label><input name="client_reference" placeholder="Name and contact" required /></div>
              <div className="field full"><label>Declaration</label><select name="declaration" required><option value="yes">I confirm the above is accurate and I am authorised to list this business</option></select></div>
            </div>
            <div className="section-intro">
              <p className="eyebrow">{uploadSection.title}</p>
              <h2>{uploadSection.fields.Headline}</h2>
            </div>
            <div className="form-grid">
              <div className="field"><label>Document upload 1</label><input name="document_1" type="file" /></div>
              <div className="field"><label>Document upload 2</label><input name="document_2" type="file" /></div>
              <div className="field"><label>Document upload 3</label><input name="document_3" type="file" /></div>
              <div className="field"><label>Photo upload 1</label><input name="photo_1" type="file" /></div>
              <div className="field"><label>Photo upload 2</label><input name="photo_2" type="file" /></div>
              <div className="field"><label>Photo upload 3</label><input name="photo_3" type="file" /></div>
            </div>
            <div className="button-row">
              <button className="button primary-button" type="submit">Submit verification</button>
            </div>
          </form>
        </div>
      </section>
    </AppFrame>
  );
}
