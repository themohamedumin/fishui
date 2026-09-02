// Dynamic SVG "sight glass" of the pond vessel — no static images.
// Shows both float switches (upper = FULL, lower = EMPTY) as tick marks
// that light up when triggered, plus an animated liquid fill + bubbles
// when the aerator is running.
export default function PondVessel({ fillPct, full, empty, aerating }) {
  const W = 132;
  const H = 220;
  const padTop = 14;
  const padBottom = 14;
  const usable = H - padTop - padBottom;
  const fillY = padTop + usable * (1 - fillPct / 100);
  const upperY = padTop + usable * 0.12; // FULL switch position
  const lowerY = padTop + usable * 0.86; // EMPTY switch position

  const bubbles = aerating
    ? Array.from({ length: 5 }).map((_, i) => (
        <circle
          key={i}
          className="bubble"
          cx={40 + i * 12 + (i % 2 === 0 ? -4 : 4)}
          cy={H - padBottom - 6}
          r={2 + (i % 3)}
          style={{ animationDelay: `${i * 0.55}s` }}
        />
      ))
    : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="132"
      height="220"
      role="img"
      aria-label={`Pond vessel, ${Math.round(fillPct)} percent full`}
    >
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#1a5aa8" />
        </linearGradient>
        <clipPath id="vesselClip">
          <rect x="8" y={padTop} width={W - 16} height={usable} rx="14" />
        </clipPath>
      </defs>

      {/* vessel outline */}
      <rect
        x="8"
        y={padTop}
        width={W - 16}
        height={usable}
        rx="14"
        fill="var(--abyss)"
        stroke="var(--stroke)"
        strokeWidth="2"
      />

      {/* liquid */}
      <g clipPath="url(#vesselClip)">
        <rect x="8" y={fillY} width={W - 16} height={H} fill="url(#waterGrad)" opacity="0.85">
          <animate attributeName="y" dur="0.6s" fill="freeze" />
        </rect>
        <rect x="8" y={fillY - 2} width={W - 16} height="4" fill="#7fe9db" opacity="0.55" />
        {bubbles}
      </g>

      {/* sensor tick: upper / FULL */}
      <g>
        <line x1="4" y1={upperY} x2={W - 4} y2={upperY} stroke={full ? '#34d399' : 'var(--ink-faint)'} strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx={W - 10} cy={upperY} r="4" fill={full ? '#34d399' : 'var(--stroke)'} />
      </g>

      {/* sensor tick: lower / EMPTY */}
      <g>
        <line x1="4" y1={lowerY} x2={W - 4} y2={lowerY} stroke={empty ? '#f5a623' : 'var(--ink-faint)'} strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx={W - 10} cy={lowerY} r="4" fill={empty ? '#f5a623' : 'var(--stroke)'} />
      </g>
    </svg>
  );
}