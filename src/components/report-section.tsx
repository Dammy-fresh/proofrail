export function ReportSection({ title, description }: { title: string; description: string }) {
  return (
    <section className="report-card">
      <div className="report-card-heading">
        <h2>{title}</h2>
        <span className="empty-label">Awaiting analysis</span>
      </div>
      <p className="report-card-description">{description}</p>
      <div className="empty-state">
        <span aria-hidden="true">—</span>
        <p>No analysis has been performed yet.</p>
      </div>
    </section>
  );
}
