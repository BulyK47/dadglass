interface CordialGlassProps {
  fillPercent: number;
  className?: string;
}

export function CordialGlass({ fillPercent, className = "" }: CordialGlassProps) {
  const fillHeight = (fillPercent / 100) * 45;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="25" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass stem and base */}
      <ellipse cx="50" cy="185" rx="20" ry="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
      <rect x="48" y="155" width="4" height="30" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>

      {/* Glass bowl - small tulip shape */}
      <path
        d="M 35 120 Q 32 135 35 155 L 65 155 Q 68 135 65 120 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 37 125 Q 35 135 37 153 L 63 153 Q 65 135 63 125"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="cordial-clip">
          <path d="M 35 125 Q 32 135 35 155 L 65 155 Q 68 135 65 125 Z"/>
        </clipPath>
        <linearGradient id="cordial-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="32"
        y={155 - fillHeight}
        width="36"
        height={fillHeight}
        fill="url(#cordial-liquid)"
        clipPath="url(#cordial-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={155 - fillHeight}
        rx="16"
        ry="2"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#cordial-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 42 130 Q 40 140 42 150"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* Stem highlight */}
      <rect x="49" y="160" width="2" height="20" fill="#fff" opacity="0.2"/>
    </svg>
  );
}
