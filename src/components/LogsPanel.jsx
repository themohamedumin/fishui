import { useEffect } from 'react';
import { useLogs } from '../hooks/useLogs';
import TrendChart from './TrendChart';

export default function LogsPanel() {
  const { rows, loading, loaded, loadLogs } = useLogs();

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayRows = rows.slice().reverse();

  return (
    <>
      <div className="card">
        <div className="section-title">Recent Trend (last 50 logged readings)</div>
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
        {loading && !loaded ? <div className="empty-note">Loading log history…</div> : <TrendChart rows={rows} />}
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
                    <td>{new Date(r.timestamp_ms || 0).toLocaleString()}</td>
                    <td>{(r.temperature_c ?? 0).toFixed(1)}</td>
                    <td>{(r.ph ?? 0).toFixed(2)}</td>
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
