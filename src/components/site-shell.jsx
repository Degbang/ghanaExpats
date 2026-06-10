import Link from "next/link";
import { siteConfig } from "@/lib/catalog";
import { VerifiedBadge } from "@/components/verified-badge";

export function SiteHeader({ currentPath = "/", session }) {
  return (
    <header className="site-header">
      <div className="shell header-shell">
        <Link className="header-wordmark" href="/">
          <span className="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="11" cy="11" r="10" fill="#1A3A2E" />
              <path d="M7 11.5 9.5 14 15 8.5" stroke="#C9922A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="header-wordmark-copy">
            <strong>{siteConfig.brand}</strong>
            <small>{siteConfig.name}</small>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Primary">
          <div className="header-nav-pill">
            {siteConfig.primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={currentPath === item.href ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="header-meta">
          <Link className="header-verified-link" href="/directory">
            <VerifiedBadge compact />
          </Link>
          {session ? (
            <Link className="header-meta-link" href={session.role === "admin" ? "/admin" : "/dashboard"}>
              {session.role === "admin" ? "Admin" : "Log in"}
            </Link>
          ) : (
            <Link className="header-meta-link" href="/login">
              Log in
            </Link>
          )}
          <Link className="button primary-button" href="/join">
            Join {siteConfig.memberCount} members →
          </Link>
        </div>
        <details className="mobile-nav">
          <summary className="mobile-nav-toggle" aria-label="Toggle navigation">
            <span />
            <span />
            <span />
          </summary>
          <div className="mobile-nav-panel">
            {siteConfig.primaryNav.map((item) => (
              <Link key={`mobile-${item.href}`} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href={session ? (session.role === "admin" ? "/admin" : "/dashboard") : "/login"}>
              {session ? "Dashboard" : "Log in"}
            </Link>
            <Link className="button primary-button" href="/join">
              Join {siteConfig.memberCount} members →
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <section className="footer-join-band">
          <div className="footer-join-copy">
            <p className="eyebrow badge-pill">{siteConfig.memberCount} members</p>
            <h2>Join the Expats in Ghana community</h2>
          </div>
          <Link className="button primary-button" href="/join">
            Join on Facebook →
          </Link>
        </section>
        <div className="footer-grid">
          {siteConfig.footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <h3>{column.title}</h3>
              <div className="footer-links">
                {column.links.map(([label, href]) => (
                  <Link key={`${column.title}-${label}`} href={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="footer-brand">
            <h3>Communly</h3>
            <p>Practical guidance, verified services, and a community that already knows the terrain.</p>
            <div className="footer-links inline">
              {siteConfig.socialLinks.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
            <p className="legal">
              © 2026 GhanaExpats.com · Operated by Communly · All rights reserved · Privacy Policy · Terms of Use · Vendor Terms
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function EmergencyBand({ href = "/emergency-response", label = "Access the 24/7 Hub →" }) {
  return (
    <section className="global-emergency-band">
      <div className="shell global-emergency-shell">
        <p className="global-emergency-copy">
          <span className="pulse-dot" aria-hidden="true" />
          When things go wrong in Ghana, we go to work.
        </p>
        <Link className="global-emergency-link" href={href}>
          {label}
        </Link>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.href ?? item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 ? <span> / </span> : null}
        </span>
      ))}
    </nav>
  );
}

export function JoinBand({ compact = false }) {
  return (
    <section className={`join-band ${compact ? "is-compact" : ""}`}>
      <div className="shell join-band-shell">
        <div className="join-band-copy">
          <p className="eyebrow badge-pill">{siteConfig.memberCount} members</p>
          <h2>Join the Expats in Ghana community</h2>
          <p>Ask better questions, get faster answers, and move through Ghana with more confidence.</p>
        </div>
        <Link className="button primary-button" href="/join">
          Join on Facebook →
        </Link>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  actions = [],
  search = null,
  filters = [],
  tone = "green",
  backdrop = "hero-home"
}) {
  const titleLines = Array.isArray(title)
    ? title.filter(Boolean)
    : String(title || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

  return (
    <section className={`page-hero tone-${tone} ${backdrop}`}>
      <div className="hero-overlay" />
      <div className="shell hero-shell">
        <div className={`hero-panel ${search ? "has-search" : ""}`}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>
            {titleLines.length > 1
              ? titleLines.map((line, index) => (
                  <span key={`${line}-${index}`} className={`hero-line hero-line-${index + 1}`}>
                    {line}
                  </span>
                ))
              : title}
          </h1>
          {copy ? <p className="hero-copy">{copy}</p> : null}
          {actions.length > 0 ? (
            <div className="button-row">
              {actions.map((action, index) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={`button ${index === 0 ? "primary-button" : "secondary-button"}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
          {search}
          {filters.length > 0 ? (
            <div className="filter-chip-row">
              {filters.map((filter) => (
                <span key={filter}>{filter}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AppFrame({ currentPath, session, children }) {
  return (
    <>
      <SiteHeader currentPath={currentPath} session={session} />
      <EmergencyBand />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
