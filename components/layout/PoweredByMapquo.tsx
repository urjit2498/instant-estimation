/**
 * Mapquo product mark shown on every page. Replaces the old site footer —
 * contractor branding stays in the header; this is our attribution.
 */
export function PoweredByMapquo() {
  return (
    <div className="relative z-10 mt-auto flex justify-center px-4 py-6 sm:px-6">
      <aside className="mapquo-lockup" aria-label="Powered by Mapquo">
        <span className="mapquo-kicker">Powered by</span>
        <span className="mapquo-wordmark">Mapquo</span>
      </aside>
    </div>
  );
}
