import { loginAction } from "@/app/actions";
import { StatusNotice } from "@/components/forms";
import { AppFrame, PageHero } from "@/components/site-shell";

export const metadata = {
  title: "Log in · GhanaExpats.com",
  description: "Vendor and admin access for the GhanaExpats platform."
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return (
    <AppFrame currentPath="/login">
      <PageHero tone="green" backdrop="hero-solid-forest" eyebrow="Log in" title="Access your dashboard" copy="Vendor and admin access for GhanaExpats.com." />
      <section className="content-section">
        <div className="shell section-shell">
          <div className="auth-shell">
            <div className="auth-note-panel">
              <p className="eyebrow">Demo access</p>
              <h2>Use the launch credentials to review the full working flows.</h2>
              <p className="form-note">Admin: `admin@communly.test / Admin123!`</p>
              <p className="form-note">Vendor: `vendor@ghanaexpats.test / Vendor123!`</p>
              <p className="form-note">Seller: `seller@ghanaexpats.test / Seller123!`</p>
            </div>
            <form action={loginAction} className="form-shell auth-form-card">
              {params?.error ? <StatusNotice title="Login problem" body={params.error} tone="alert" /> : null}
              <div className="form-grid">
                <div className="field"><label>Email</label><input name="email" type="email" required /></div>
                <div className="field"><label>Password</label><input name="password" type="password" required /></div>
              </div>
              <div className="button-row">
                <button className="button primary-button btn--primary" type="submit">Log in</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
