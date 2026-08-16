interface ShotGlassProps {
  fillPercent: number;
  className?: string;
}

export function ShotGlass({ fillPercent, className = "" }: ShotGlassProps) {
  const fillHeight = (fillPercent / 100) * 50;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="28" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass base */}
      <rect x="30" y="180" width="40" height="5" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>

      {/* Glass outline - traditional shot glass (slightly tapered) */}
      <path
        d="M 32 130 L 28 180 L 72 180 L 68 130 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner glass depth */}
      <path
        d="M 33 135 L 30 178 L 70 178 L 67 135"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="shot-clip">
          <path d="M 30 135 L 28 180 L 72 180 L 70 135 Z"/>
        </clipPath>
        <linearGradient id="shot-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="28"
        y={180 - fillHeight}
        width="44"
        height={fillHeight}
        fill="url(#shot-liquid)"
        clipPath="url(#shot-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={180 - fillHeight}
        rx="20"
        ry="2"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#shot-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 38 140 L 35 165"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 43 145 L 41 160"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
