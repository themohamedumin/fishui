export default function TrendChart({ rows }) {
  if (!rows.length) return <div className="empty-note">No data yet</div>;

  const W = 900;
  const H = 220;
  const padL = 38;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const n = rows.length;

  const maxTemp = Math.max(...rows.map((r) => Number(r.temperature_c) || 0), 30);
  const x = (i) => padL + (i * (W - padL - padR)) / Math.max(n - 1, 1);
  const yTemp = (v) => H - padB - (v / maxTemp) * (H - padT - padB);
  const yPh = (v) => H - padB - (v / 14) * (H - padT - padB);
  const yTurb = (v) => H - padB - (v / 4095) * (H - padT - padB);

  const line = (arr, yf) => {
    const points = arr.map((v, i) => `${x(i).toFixed(1)} ${yf(v).toFixed(1)}`);
    return points.length === 1
      ? `M ${padL} ${yf(arr[0]).toFixed(1)} L ${W - padR} ${yf(arr[0]).toFixed(1)}`
      : points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point}`).join(' ');
  };

  const points = (arr, yf) => arr.map((value, i) => ({ cx: x(i), cy: yf(value) }));

  const temperatures = rows.map((r) => Number(r.temperature_c) || 0);
  const phValues = rows.map((r) => Number(r.ph) || 0);
  const turbidity = rows.map((r) => Number(r.turbidity_adc) || 0);
  const tempPath = line(temperatures, yTemp);
  const phPath = line(phValues, yPh);
  const turbPath = line(turbidity, yTurb);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220 }} preserveAspectRatio="none">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--stroke)" />
      <path d={tempPath} fill="none" stroke="#4f8ef7" strokeWidth="2" />
      <path d={phPath} fill="none" stroke="#2dd4bf" strokeWidth="2" />
      <path d={turbPath} fill="none" stroke="#ff5c72" strokeWidth="2" />
      {points(temperatures, yTemp).map((point, i) => <circle key={`temp-${i}`} {...point} r="3" fill="#4f8ef7" />)}
      {points(phValues, yPh).map((point, i) => <circle key={`ph-${i}`} {...point} r="3" fill="#2dd4bf" />)}
      {points(turbidity, yTurb).map((point, i) => <circle key={`turb-${i}`} {...point} r="3" fill="#ff5c72" />)}
    </svg>
  );
}
