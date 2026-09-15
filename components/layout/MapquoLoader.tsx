interface MapquoLoaderProps {
  label?: string;
  /** `overlay` covers the viewport; `inline` fills the parent. */
  variant?: "overlay" | "inline";
}

export function MapquoLoader({
  label = "Loading…",
  variant = "overlay",
}: MapquoLoaderProps) {
  const body = (
    <div className="mapquo-loader-center" role="status" aria-live="polite" aria-label={label}>
      <span className="mapquo-loader-orbit" aria-hidden />
      <p className="mapquo-loader-label">{label}</p>
    </div>
  );

  if (variant === "inline") {
    return <div className="mapquo-loader-inline">{body}</div>;
  }

  return (
    <div className="mapquo-loader-overlay">
      {body}
      <p className="mapquo-loader-credit">
        <span className="mapquo-kicker">Powered by</span>
        <span className="mapquo-wordmark">Mapquo</span>
      </p>
    </div>
  );
}
