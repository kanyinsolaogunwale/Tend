/**
 * The Tend brand mark: a clean "T" whose bar and stem are two leaf shapes,
 * separated by a thin diagonal wedge (growth, focus, progress).
 *
 * Single source of the logo. Color via `currentColor`; size via className.
 */
export function TendMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 54"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      {/* Bar leaf: full-width pill */}
      <path d="M11.5 0 H36.5 C42.8 0 48 5.2 48 11.5 C48 17.8 42.8 23 36.5 23 H11.5 C5.2 23 0 17.8 0 11.5 C0 5.2 5.2 0 11.5 0 Z" />
      {/* Stem leaf: diagonal wedge gap at top, sweeping down to a point at bottom left */}
      <path d="M15.2 32.2 L38.2 25.2 C40.1 24.7 41.6 26.2 41.3 28.1 C40.3 36.2 36.8 44.2 29.6 49.9 C26.1 52.6 21.2 53.8 17.3 53.1 C15.6 52.8 14.8 51.4 15.3 49.7 C16.9 44 16.1 37.9 15.2 32.2 Z" />
    </svg>
  );
}
