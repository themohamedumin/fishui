const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconOverview = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const IconDroplet = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 2.5s6.5 7.2 6.5 12a6.5 6.5 0 0 1-13 0c0-4.8 6.5-12 6.5-12z" />
  </svg>
);

export const IconFeeder = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 8h16l-1.6 11.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 8z" />
    <path d="M2 8h20" />
    <path d="M9 4c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5" />
  </svg>
);

export const IconLogs = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 19V7a2 2 0 0 1 2-2h9l5 5v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M14 5v4a1 1 0 0 0 1 1h4" />
    <path d="M8 13h5M8 16.5h8" />
  </svg>
);

export const IconSettings = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" />
  </svg>
);
