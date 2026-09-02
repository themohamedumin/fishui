import { DEVICE_ID } from '../firebase';

const CONN_LABEL = {
  waiting: 'Awaiting ESP32…',
  online: 'Live',
  offline: 'ESP32 Offline',
  denied: 'Access Denied',
};

export default function TopBar({ connection, userEmail, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 16s2.5-3 5-3 4 2 7 2 5-3 5-3" />
            <path d="M2 12s2.5-3 5-3 4 2 7 2 5-3 5-3" />
          </svg>
        </span>
        <span>Smart Fish Pond</span>
        <span className="device-id">{DEVICE_ID}</span>
      </div>
      <div className="topbar-right">
        <span className="conn-pill">
          <span className={`conn-dot ${connection}`} />
          {CONN_LABEL[connection] || 'Connecting…'}
        </span>
        <span className="user-email">{userEmail}</span>
        <button className="logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
