import { IconOverview, IconFeeder, IconLogs, IconSettings } from './icons';

export const TABS = [
  { id: 'overview', label: 'Overview', Icon: IconOverview },
  { id: 'feeder', label: 'Feeder', Icon: IconFeeder },
  { id: 'logs', label: 'Logs', Icon: IconLogs },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

function NavButtons({ active, onSelect }) {
  return (
    <>
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? 'active' : ''}`}
          onClick={() => onSelect(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </>
  );
}

export function SideNav({ active, onSelect }) {
  return (
    <nav className="side-nav">
      <NavButtons active={active} onSelect={onSelect} />
    </nav>
  );
}

export function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav">
      <NavButtons active={active} onSelect={onSelect} />
    </nav>
  );
}
