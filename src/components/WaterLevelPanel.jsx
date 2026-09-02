import PondVessel from './PondVessel';
import { StatusRow } from './StatusPieces';

export default function WaterLevelPanel({ live }) {
  const full = !!live?.water_level_full;
  const empty = !!live?.water_level_empty;
  const aerating = !!live?.air_pump_on;

  let fillPct = 50;
  let levelLabel = 'OK';
  if (full) {
    fillPct = 100;
    levelLabel = 'FULL';
  } else if (empty) {
    fillPct = 8;
    levelLabel = 'LOW';
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="section-title">Water Level Sensors</div>
        <p className="section-sub">
          Two float switches, not a continuous level sensor — the upper sensor marks FULL, the
          lower sensor marks EMPTY. The controller fills until FULL, drains until EMPTY.
        </p>

        <div className="pond-vessel-card">
          <PondVessel fillPct={fillPct} full={full} empty={empty} aerating={aerating} />
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-dim)', margin: '2px 0 14px' }}>
          {levelLabel} · {Math.round(fillPct)}%
        </p>

        <StatusRow
          label="Upper sensor (FULL)"
          value={full ? 'TRIGGERED' : 'clear'}
          tone={full ? 'on' : undefined}
        />
        <StatusRow
          label="Lower sensor (EMPTY)"
          value={empty ? 'TRIGGERED' : 'clear'}
          tone={empty ? 'warn' : undefined}
        />
      </div>

      <div className="card">
        <div className="section-title">Automatic Pump Control</div>
        <p className="section-sub" style={{ marginBottom: 0 }}>
          The controller automatically manages the water change cycle. It drains on bad pH, bad
          turbidity, or an aerator cooling timeout, then refills until the upper sensor trips. A
          plain top-up (fill only) happens if the lower sensor trips with no water-quality
          problem.
        </p>
        <div style={{ marginTop: 16 }}>
          <StatusRow
            label="Water state"
            value={live?.water_state || '--'}
            tone={live?.water_state === 'IDLE' ? 'on' : 'warn'}
          />
          <StatusRow
            label="Aerator / air pump"
            value={live?.air_pump_on ? `ON (${live?.aerator_state || ''})` : 'OFF'}
            tone={live?.air_pump_on ? 'on' : undefined}
          />
        </div>
      </div>
    </div>
  );
}
