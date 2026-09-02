const STATUS_COLOR = {
  SAFE: 'var(--mint)',
  CAUTION: 'var(--amber)',
  DANGER: 'var(--coral)',
};

export default function MetricCard({ label, value, unit, badge, riskPct, foot }) {
  return (
    <div className="card">
      <div className="metric-head">
        <span className="metric-label">{label}</span>
        {badge && <span className={`badge ${badge}`}>{badge}</span>}
      </div>
      <div className="metric-value">
        {value}
        {unit && <small> {unit}</small>}
      </div>
      {riskPct != null && (
        <div className="risk-track">
          <div
            className="risk-fill"
            style={{
              width: `${riskPct}%`,
              background: STATUS_COLOR[badge] || 'var(--mint)',
            }}
          />
        </div>
      )}
      {foot && <p className="metric-foot">{foot}</p>}
    </div>
  );
}
