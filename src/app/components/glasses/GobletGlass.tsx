interface GobletGlassProps {
  fillPercent: number;
  className?: string;
}

export function GobletGlass({ fillPercent, className = "" }: GobletGlassProps) {
  const fillHeight = (fillPercent / 100) * 100;

  return (
    <svg viewBox="0 0 110 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="55" cy="195" rx="32" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass stem and base */}
      <ellipse cx="55" cy="185" rx="28" ry="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
      <rect x="53" y="125" width="4" height="60" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>

      {/* Glass bowl - large rounded goblet */}
      <path
        d="M 25 25 Q 20 70 25 125 L 85 125 Q 90 70 85 25 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 27 30 Q 23 70 27 123 L 83 123 Q 87 70 83 30"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="goblet-clip">
          <path d="M 25 30 Q 20 70 25 125 L 85 125 Q 90 70 85 30 Z"/>
        </clipPath>
        <linearGradient id="goblet-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="20"
        y={125 - fillHeight}
        width="70"
        height={fillHeight}
        fill="url(#goblet-liquid)"
        clipPath="url(#goblet-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="55"
        cy={125 - fillHeight}
        rx="30"
        ry="3"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#goblet-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 35 40 Q 32 70 35 110"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 42 45 Q 40 70 42 100"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Stem highlight */}
      <rect x="54" y="130" width="2" height="50" fill="#fff" opacity="0.2"/>
    </svg>
  );
}
