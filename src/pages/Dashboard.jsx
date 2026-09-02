import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useControlState, useLiveData, useThresholds } from '../hooks/usePondData';
import TopBar from '../components/TopBar';
import { SideNav, BottomNav, TABS } from '../components/Nav';
import OverviewPanel from '../components/OverviewPanel';
import FeederPanel from '../components/FeederPanel';
import LogsPanel from '../components/LogsPanel';
import SettingsPanel from '../components/SettingsPanel';
import '../styles/shell.css';
import '../styles/components.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { live, connection } = useLiveData();
  const { control, updatePump } = useControlState();
  const { thresholds } = useThresholds();
  const [tab, setTab] = useState('overview');

  const title = TABS.find((t) => t.id === tab)?.label || '';

  return (
    <div className="shell">
      <TopBar connection={connection} userEmail={user?.email} onLogout={logout} />
      <SideNav active={tab} onSelect={setTab} />

      <main className="main">
        <h1 className="page-title">{title}</h1>

        {tab === 'overview' && <OverviewPanel live={live} thresholds={thresholds} control={control} updatePump={updatePump} />}
        {tab === 'feeder' && <FeederPanel live={live || {}} />}
        {tab === 'logs' && <LogsPanel live={live} connection={connection} />}
        {tab === 'settings' && <SettingsPanel />}
      </main>

      <BottomNav active={tab} onSelect={setTab} />
    </div>
  );
}
