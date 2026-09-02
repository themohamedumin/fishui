import { useLogs } from '../hooks/useLogs';
import TrendChart from './TrendChart';

function formatLogTime(row) {
  if (row._timestamp_is_receive) return `Received ${new Date(row.timestamp_ms).toLocaleString()}`;
  if (row.timestamp_ms) return new Date(row.timestamp_ms).toLocaleString();
  if (row.hardware_uptime_ms != null) return `Uptime ${(row.hardware_uptime_ms / 1000).toFixed(0)}s`;
  return 'Timestamp unavailable';
}

export default function LogsPanel({ live, connection }) {
  const { rows, loading, loaded, error } = useLogs();

  const liveTimestamp = Number(live?.timestamp_ms) > 0
    ? (Number(live.timestamp_ms) < 1e12 ? Number(live.timestamp_ms) * 1000 : Number(live.timestamp_ms))
    : live?._received_at_ms;
  const liveRow = live
    ? { ...live, timestamp_ms: liveTimestamp, _timestamp_is_receive: !(Number(live.timestamp_ms) > 0) }
    : null;
  const chartRows = liveRow ? [...rows, liveRow] : rows;
  const displayRows = liveRow ? [liveRow, ...rows.slice().reverse()] : rows.slice().reverse();

  return (
    <>
      <div className="card">
        <div className="section-title">Sensor Trends</div>
        <div className="chart-meta">ESP32 {connection === 'online' ? 'live' : connection} · current reading included · hover a point for exact values</div>
        <div className="legend">
          <span>
            <i style={{ background: '#4f8ef7' }} />
            Temperature (°C)
          </span>
          <span>
            <i style={{ background: '#2dd4bf' }} />
            pH
          </span>
          <span>
            <i style={{ background: '#ff5c72' }} />
            Turbidity (ADC)
          </span>
        </div>
        {loading && !loaded ? (
          <div className="empty-note">Loading log history…</div>
        ) : error ? (
          <div className="empty-note">Unable to load log history. Check the database deployment and sign-in.</div>
        ) : (
          <TrendChart rows={chartRows} />
        )}
      </div>

      <div className="card">
        <div className="section-title">Log Table</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>pH</th>
                <th>Clarity ADC</th>
                <th>Water state</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loaded ? (
                <tr>
                  <td colSpan={6} style={{ color: 'var(--ink-faint)' }}>
                    Loading…
                  </td>
                </tr>
              ) : displayRows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ color: 'var(--ink-faint)' }}>
                    No log entries yet.
                  </td>
                </tr>
              ) : (
                displayRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r === liveRow ? 'LIVE · ' : ''}{formatLogTime(r)}</td>
                    <td>{Number(r.temperature_c ?? 0).toFixed(1)}</td>
                    <td>{Number(r.ph ?? 0).toFixed(2)}</td>
                    <td>{r.turbidity_adc ?? '--'}</td>
                    <td>{r.water_state ?? '--'}</td>
                    <td>
                      <span className={`badge ${r.pond_status}`}>{r.pond_status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
