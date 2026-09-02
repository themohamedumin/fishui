import { useState } from 'react';
import PondVessel from './PondVessel';
import { StatusRow } from './StatusPieces';

const SENSOR_STATUS_TONE = {
  LOW: 'warn',
  NORMAL: undefined,
  HIGH: 'on',
};

const SENSOR_LABELS = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
};

export default function WaterLevelPanel({ live, control = {}, updatePump }) {
  const [pendingPump, setPendingPump] = useState(null);
  const [pumpError, setPumpError] = useState('');

  const full = !!live?.water_level_full;
  const empty = !!live?.water_level_empty;
  const aerating = !!live?.air_pump_on;

  const waterSensor1Status = live?.water_sensor1_status || 'NORMAL';
  const waterSensor2Status = live?.water_sensor2_status || 'NORMAL';
  const fillPumpState = !!control.fill_pump;
  const drainPumpState = !!control.drain_pump;

  const waterState = live?.water_state || 'IDLE';
  const overallWaterLevel =
    waterSensor1Status === 'HIGH' || waterSensor2Status === 'HIGH'
      ? 'HIGH'
      : waterSensor1Status === 'LOW' || waterSensor2Status === 'LOW'
        ? 'LOW'
        : 'NORMAL';

  let fillPct = 50;
  let levelLabel = 'OK';
  if (full) {
    fillPct = 100;
    levelLabel = 'FULL';
  } else if (empty) {
    fillPct = 8;
    levelLabel = 'LOW';
  }

  const handlePumpToggle = async (pumpKey, targetValue) => {
    if (!updatePump) return;

    const otherPumpKey = pumpKey === 'fill_pump' ? 'drain_pump' : 'fill_pump';
    const otherPumpActive = !!control[otherPumpKey];

    if (targetValue && otherPumpActive) {
      setPumpError('Safety: the other pump was switched off before enabling this pump.');
    } else {
      setPumpError('');
    }

    setPendingPump(pumpKey);

    try {
      await updatePump(pumpKey, targetValue);
      setPumpError('');
    } catch (error) {
      setPumpError('Failed to update pump state. Please try again.');
    } finally {
      setPendingPump(null);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="section-title">Water Level</div>
        <p className="section-sub">
          Live water sensor readings and the current automatic water state. The dashboard reflects
          the values reported by the ESP32 rather than recalculating the sensor thresholds.
        </p>

        <div className="pond-vessel-card">
          <PondVessel fillPct={fillPct} full={full} empty={empty} aerating={aerating} />
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-dim)', margin: '2px 0 14px' }}>
          {levelLabel} · {Math.round(fillPct)}%
        </p>

        <StatusRow label="Overall Water Level" value={overallWaterLevel} tone={overallWaterLevel === 'HIGH' ? 'on' : overallWaterLevel === 'LOW' ? 'warn' : undefined} />
        <StatusRow label="Water state" value={waterState} tone={waterState === 'IDLE' ? 'on' : 'warn'} />
        <StatusRow label="High Water Sensor ADC" value={live?.water_sensor1_adc ?? '--'} />
        <StatusRow label="High Water Sensor" value={SENSOR_LABELS[waterSensor1Status] || waterSensor1Status || 'UNKNOWN'} tone={SENSOR_STATUS_TONE[waterSensor1Status] || undefined} />
        <StatusRow label="Low Water Sensor ADC" value={live?.water_sensor2_adc ?? '--'} />
        <StatusRow label="Low Water Sensor" value={SENSOR_LABELS[waterSensor2Status] || waterSensor2Status || 'UNKNOWN'} tone={SENSOR_STATUS_TONE[waterSensor2Status] || undefined} />
      </div>

      <div className="card">
        <div className="section-title">Manual Pump Control</div>
        <p className="section-sub" style={{ marginBottom: 0 }}>
          Manual controls are patched into the existing Firebase control path without clearing the
          other settings. If one pump is enabled, the other is switched off before the new one is turned on.
        </p>

        <div className="pump-card">
          <div className="pump-row">
            <div>
              <div className="pump-label">Fill Pump 1</div>
              <div className="pump-state">{fillPumpState ? 'ON' : 'OFF'}</div>
            </div>
            <div className="pump-buttons">
              <button className="btn-primary pump-btn" disabled={pendingPump === 'fill_pump'} onClick={() => handlePumpToggle('fill_pump', true)}>
                ON
              </button>
              <button className="btn-secondary pump-btn" disabled={pendingPump === 'fill_pump'} onClick={() => handlePumpToggle('fill_pump', false)}>
                OFF
              </button>
            </div>
          </div>

          <div className="pump-row">
            <div>
              <div className="pump-label">Drain Pump 2</div>
              <div className="pump-state">{drainPumpState ? 'ON' : 'OFF'}</div>
            </div>
            <div className="pump-buttons">
              <button className="btn-primary pump-btn" disabled={pendingPump === 'drain_pump'} onClick={() => handlePumpToggle('drain_pump', true)}>
                ON
              </button>
              <button className="btn-secondary pump-btn" disabled={pendingPump === 'drain_pump'} onClick={() => handlePumpToggle('drain_pump', false)}>
                OFF
              </button>
            </div>
          </div>
        </div>

        {pumpError && <div className="info-note" style={{ marginTop: 12 }}>{pumpError}</div>}

        <div style={{ marginTop: 18 }}>
          <StatusRow
            label="Automatic fill pump"
            value={live?.fill_pump_on ? 'ON' : 'OFF'}
            tone={live?.fill_pump_on ? 'on' : undefined}
          />
          <StatusRow
            label="Automatic drain pump"
            value={live?.drain_pump_on ? 'ON' : 'OFF'}
            tone={live?.drain_pump_on ? 'warn' : undefined}
          />
          <StatusRow
            label="Controller auto state"
            value={waterState}
            tone={waterState === 'IDLE' ? 'on' : 'warn'}
          />
        </div>
      </div>
    </div>
  );
}
