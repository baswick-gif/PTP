export default function LogoMark({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="18" y="12" width="16" height="76" rx="4" fill="currentColor" />
      <rect x="18" y="12" width="52" height="16" rx="4" fill="currentColor" />
      <rect x="18" y="42" width="40" height="16" rx="4" fill="currentColor" />
      <circle cx="66" cy="64" r="24" fill="none" stroke="#22b5ae" strokeWidth="14" />
    </svg>
  );
}
