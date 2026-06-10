import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-shell">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1>This page seems to have gone off-grid.</h1>
        <p>
          It happens — even in Ghana. The page you are looking for does not exist or may have moved.
        </p>
        <div className="button-row">
          <Link className="button primary-button" href="/">
            Go to the homepage
          </Link>
          <Link className="button secondary-button" href="/directory">
            Search the directory
          </Link>
        </div>
      </div>
    </main>
  );
}
