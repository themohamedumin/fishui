import { useState } from 'react';
import { feedNow } from '../hooks/usePondData';
import { StatusRow } from './StatusPieces';

function FeederDial({ dispensing }) {
  return (
    <svg viewBox="0 0 120 120" width="112" height="112" role="img" aria-label="Feeder gate dial">
      <circle cx="60" cy="60" r="52" fill="var(--abyss)" stroke="var(--stroke)" strokeWidth="3" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--teal-glow)" strokeWidth="3" opacity={dispensing ? 1 : 0} style={{ transition: 'opacity .3s' }} />
      <g
        style={{
          transformOrigin: '60px 60px',
          transform: `rotate(${dispensing ? 90 : 0}deg)`,
          transition: 'transform 1.1s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <line x1="60" y1="60" x2="60" y2="20" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="5" fill="var(--teal)" />
    </svg>
  );
}

export default function FeederPanel({ live }) {
  const [sending, setSending] = useState(false);
  const dispensing = !!live?.feed_in_progress;

  const onFeed = async () => {
    setSending(true);
    try {
      await feedNow();
    } finally {
      setSending(false);
    }
  };

  const status = dispensing ? 'Dispensing…' : sending ? 'Sending…' : 'Ready';

  return (
    <div className="card">
      <div className="section-title">Automatic Fish Feeder</div>
      <p className="section-sub">
        Feeds automatically on a schedule (times below, synced via NTP), or on demand with the
        button. The gate servo opens to 90°, holds for 15 seconds, then closes back to 0°.
      </p>

      <div className="feeder-row">
        <FeederDial dispensing={dispensing} />
        <div>
          <button className="feed-btn" onClick={onFeed} disabled={dispensing || sending}>
            🐟 Feed Now
          </button>
          <div className="feed-meta">{status}</div>
        </div>
      </div>

      <StatusRow
        label="Scheduled feeds"
        value={
          live?.feed_schedule_morning && live?.feed_schedule_evening
            ? `${live.feed_schedule_morning} & ${live.feed_schedule_evening}`
            : '08:00 & 20:00'
        }
      />
      <StatusRow
        label="Last feed"
        value={live?.last_feed_ms ? `Uptime ${(live.last_feed_ms / 1000).toFixed(0)}s at last dispense` : 'No feed yet'}
      />
      <StatusRow label="Total feed cycles (since boot)" value={live?.feed_count ?? '0'} />
    </div>
  );
}
