interface WineGlassProps {
  fillPercent: number;
  className?: string;
}

export function WineGlass({ fillPercent, className = "" }: WineGlassProps) {
  const fillHeight = (fillPercent / 100) * 90;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="30" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass stem and base */}
      <ellipse cx="50" cy="185" rx="25" ry="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
      <rect x="48" y="135" width="4" height="50" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>

      {/* Glass bowl - traditional wine glass (rounded) */}
      <path
        d="M 30 45 Q 25 80 30 135 L 70 135 Q 75 80 70 45 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 32 50 Q 28 80 32 133 L 68 133 Q 72 80 68 50"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="wine-clip">
          <path d="M 30 50 Q 25 80 30 135 L 70 135 Q 75 80 70 50 Z"/>
        </clipPath>
        <linearGradient id="wine-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="25"
        y={135 - fillHeight}
        width="50"
        height={fillHeight}
        fill="url(#wine-liquid)"
        clipPath="url(#wine-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={135 - fillHeight}
        rx="21"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#wine-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 38 60 Q 35 85 38 120"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 44 65 Q 42 85 44 110"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Stem highlight */}
      <rect x="49" y="140" width="2" height="40" fill="#fff" opacity="0.2"/>
    </svg>
  );
}
