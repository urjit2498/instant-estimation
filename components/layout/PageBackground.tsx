/** Fixed decorative layer — animated grid + soft orbs on the white page background. */
export function PageBackground() {
  return (
    <div aria-hidden className="page-bg">
      <div className="page-bg-grid" />
      <div className="page-bg-orb page-bg-orb-a" />
      <div className="page-bg-orb page-bg-orb-b" />
    </div>
  );
}
