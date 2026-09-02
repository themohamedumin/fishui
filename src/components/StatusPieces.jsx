const SUB_TEXT = {
  SAFE: 'All monitored parameters are within safe range for the stock.',
  CAUTION: 'The aerator is actively cooling the pond down.',
  DANGER: 'Bad pH/turbidity or an aerator cooling timeout — automatic water change engaged.',
};

export function StatusBanner({ status }) {
  const s = status || '--';
  return (
    <div className={`status-banner ${s}`}>
      <div>
        <h2>Pond Status: {s}</h2>
        <p>{status ? SUB_TEXT[status] : 'Waiting for live data from the pond controller…'}</p>
      </div>
    </div>
  );
}

export function StatusRow({ label, value, tone }) {
  // tone: 'on' | 'warn' | 'danger' | undefined
  return (
    <div className="status-row">
      <span className={`dot ${tone || ''}`} />
      <span>{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}
