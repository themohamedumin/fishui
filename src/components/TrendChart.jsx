export default function TrendChart({ rows }) {
  if (!rows.length) return <div className="empty-note">No data yet</div>;

  const W = 900;
  const H = 220;
  const padL = 38;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const n = rows.length;

  const maxTemp = Math.max(...rows.map((r) => r.temperature_c || 0), 30);
  const x = (i) => padL + (i * (W - padL - padR)) / Math.max(n - 1, 1);
  const yTemp = (v) => H - padB - (v / maxTemp) * (H - padT - padB);
  const yPh = (v) => H - padB - (v / 14) * (H - padT - padB);
  const yTurb = (v) => H - padB - (v / 4095) * (H - padT - padB);

  const line = (arr, yf) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yf(v).toFixed(1)}`).join(' ');

  const tempPath = line(rows.map((r) => r.temperature_c || 0), yTemp);
  const phPath = line(rows.map((r) => r.ph || 0), yPh);
  const turbPath = line(rows.map((r) => r.turbidity_adc || 0), yTurb);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220 }} preserveAspectRatio="none">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--stroke)" />
      <path d={tempPath} fill="none" stroke="#4f8ef7" strokeWidth="2" />
      <path d={phPath} fill="none" stroke="#2dd4bf" strokeWidth="2" />
      <path d={turbPath} fill="none" stroke="#ff5c72" strokeWidth="2" />
    </svg>
  );
}
