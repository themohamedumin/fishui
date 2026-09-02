function formatTime(timestamp) {
  return timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'No timestamp';
}

function formatTimestamp(row) {
  const time = formatTime(row.timestamp_ms);
  if (row.timestamp_source === 'hardware') return `ESP32 time ${time}`;
  if (row.timestamp_source === 'firebase') return `Firebase recorded ${time}`;
  if (row.timestamp_source === 'live-received') return `Received by dashboard ${time}`;
  return time;
}

function sensorValue(value) {
  const number = Number(value);
  return value == null || value === '' || !Number.isFinite(number) ? null : number;
}

export default function TrendChart({ rows }) {
  if (!rows.length) return <div className="empty-note">No data yet</div>;

  const W = 900;
  const H = 280;
  const padL = 52;
  const padR = 18;
  const padT = 18;
  const padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = rows.length;
  const colors = { temp: '#68a0ff', ph: '#35d6bd', turb: '#ff6d82' };
  const values = {
    temp: rows.map((row) => sensorValue(row.temperature_c)),
    ph: rows.map((row) => sensorValue(row.ph)),
    turb: rows.map((row) => sensorValue(row.turbidity_adc)),
  };
  const scales = { temp: [0, Math.max(...values.temp.filter((value) => value != null), 30)], ph: [0, 14], turb: [0, 4095] };
  const x = (index) => padL + (index * plotW) / Math.max(n - 1, 1);
  const y = (value, key) => value == null ? null : padT + plotH - (value / scales[key][1]) * plotH;
  const line = (key) => {
    const points = values[key].map((value, index) => value == null ? null : `${x(index).toFixed(1)} ${y(value, key).toFixed(1)}`);
    if (points.filter(Boolean).length === 1) {
      const index = points.findIndex(Boolean);
      return `M ${padL} ${y(values[key][index], key)} L ${W - padR} ${y(values[key][index], key)}`;
    }
    return points.map((point, i) => point ? `${i && points[i - 1] ? 'L' : 'M'} ${point}` : '').join(' ');
  };
  const area = (key) => values[key].every((value) => value != null) ? `${line(key)} L ${x(n - 1).toFixed(1)} ${padT + plotH} L ${padL} ${padT + plotH} Z` : '';
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const labelIndexes = [...new Set([0, Math.floor((n - 1) / 2), n - 1])];

  return (
    <div className="trend-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Temperature, pH, and turbidity trends over time">
        <defs>
          {Object.entries(colors).map(([key, color]) => (
            <linearGradient key={key} id={`${key}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity=".22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {gridLines.map((position) => {
          const lineY = padT + plotH * position;
          return <line key={position} x1={padL} y1={lineY} x2={W - padR} y2={lineY} className="chart-grid" />;
        })}
        <text x={padL - 10} y={padT + 4} textAnchor="end" className="chart-scale">high</text>
        <text x={padL - 10} y={padT + plotH} textAnchor="end" className="chart-scale">low</text>
        {Object.keys(colors).map((key) => <path key={`${key}-area`} d={area(key)} fill={`url(#${key}-fill)`} />)}
        {Object.keys(colors).map((key) => <path key={`${key}-line`} d={line(key)} fill="none" stroke={colors[key]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />)}
        {Object.keys(colors).map((key) => values[key].map((value, index) => (
          value == null ? null : <circle key={`${key}-${index}`} cx={x(index)} cy={y(value, key)} r={n > 30 ? 2.2 : 3.2} fill={colors[key]} stroke="var(--panel)" strokeWidth="1.5">
            <title>{`${formatTimestamp(rows[index])} · Temperature ${values.temp[index] == null ? '--' : values.temp[index].toFixed(1)} °C · pH ${values.ph[index] == null ? '--' : values.ph[index].toFixed(2)} · Turbidity ${values.turb[index] == null ? '--' : values.turb[index].toFixed(0)} ADC`}</title>
          </circle>
        )))}
        {labelIndexes.map((index) => (
          <text key={index} x={x(index)} y={H - 10} textAnchor={index === 0 ? 'start' : index === n - 1 ? 'end' : 'middle'} className="chart-time">
            {formatTime(rows[index].timestamp_ms)}
          </text>
        ))}
      </svg>
    </div>
  );
}
