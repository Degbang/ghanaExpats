export function VerifiedBadge({ label = "Communly Verified", compact = false }) {
  return (
    <span className={`verified-badge ${compact ? "compact" : ""}`} aria-label={label} title="This business has been vetted by the Communly team">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="#1A3A2E" />
        <path d="M7 11.5 9.5 14 15 8.5" stroke="#C9922A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </span>
  );
}
