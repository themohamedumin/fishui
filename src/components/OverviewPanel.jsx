import MetricCard from './MetricCard';
import WaterLevelPanel from './WaterLevelPanel';
import { StatusBanner, StatusRow } from './StatusPieces';
import {
  calculatePhStatus,
  calculateTurbidityImpurityPercent,
  calculateTurbidityStatus,
} from '../utils/statusCalculators';

const phBadge = (s) => (s === 'OK' ? 'SAFE' : 'DANGER');
const turbBadge = (s) => {
  switch (s) {
    case 'CLEAN':
      return 'SAFE';
    case 'CAUTION':
      return 'CAUTION';
    case 'DANGER':
      return 'DANGER';
    default:
      return 'SAFE';
  }
};

const formatTime = (ms) => {
  const d = ms ? new Date(ms) : new Date();
  return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
};

export default function OverviewPanel({ live, thresholds, control, updatePump }) {
  if (!live) {
    return (
      <>
        <StatusBanner status={null} />
        <div className="empty-note">Waiting for live sensor data…</div>
      </>
    );
  }

  const cooling = live.aerator_state === 'COOLING';
  const impurityPct = calculateTurbidityImpurityPercent(live.turbidity_adc);
  const wifiConnected = live.wifi_rssi != null && live.wifi_rssi > -100;

  // Statuses are derived from the actual raw ADC, matching the ESP32 firmware logic.
  // The overall pond_status remains a separate backend value and may be DANGER for
  // reasons other than turbidity (pH, timeout, etc.).
  const phStatus = thresholds ? calculatePhStatus(live.ph, thresholds) : live.ph_status;
  const turbidityStatus = calculateTurbidityStatus(live.turbidity_adc, thresholds);

  return (
    <>
      <StatusBanner status={live.pond_status} />

      <div className="grid grid-3">
        <MetricCard
          label="Temperature"
          value={Number(live.temperature_c ?? 0).toFixed(1)}
          unit="°C"
          badge={cooling ? 'CAUTION' : 'SAFE'}
          riskPct={cooling ? 70 : 20}
        />
        <MetricCard
          label="pH Level"
          value={Number(live.ph ?? 0).toFixed(2)}
          unit="pH"
          badge={phBadge(phStatus)}
          foot="Safe range: 6.5 – 8.5"
        />
        <MetricCard
          label="Water Clarity"
          value={impurityPct}
          unit="% impurity"
          badge={turbBadge(turbidityStatus)}
          riskPct={impurityPct}
          foot={`Raw sensor: ${live.turbidity_adc ?? '--'} ADC`}
        />
      </div>

      <WaterLevelPanel
        live={live}
        control={control || {}}
        updatePump={updatePump}
      />

      <div className="card">
        <div className="section-title">System Status</div>
        <StatusRow label="Water State" value={live.water_state || '--'} tone={live.water_state === 'IDLE' ? 'on' : 'warn'} />
        <StatusRow
          label="Aerator / Air Pump"
          value={live.air_pump_on ? `ON (${live.aerator_state || ''})` : 'OFF'}
          tone={live.air_pump_on ? 'on' : undefined}
        />
        <StatusRow label="Signal (WiFi RSSI)" value={wifiConnected ? 'CONNECTED' : 'DISCONNECTED'} tone={wifiConnected ? 'on' : 'danger'} />
        <StatusRow label="Last update" value={formatTime(live.timestamp_ms)} />
      </div>
    </>
  );
}
