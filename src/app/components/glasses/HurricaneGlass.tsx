interface HurricaneGlassProps {
  fillPercent: number;
  className?: string;
}

export function HurricaneGlass({ fillPercent, className = "" }: HurricaneGlassProps) {
  const fillHeight = (fillPercent / 100) * 120;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="30" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass stem and base */}
      <ellipse cx="50" cy="185" rx="25" ry="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
      <path
        d="M 48 155 L 48 185"
        stroke="#334155"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 52 155 L 52 185"
        stroke="#334155"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Glass bowl - hurricane/poco shape (curved) */}
      <path
        d="M 30 30 Q 25 60 28 100 Q 30 130 45 155 L 55 155 Q 70 130 72 100 Q 75 60 70 30 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 32 35 Q 28 60 30 100 Q 32 128 45 153 L 55 153 Q 68 128 70 100 Q 72 60 68 35"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="hurricane-clip">
          <path d="M 30 35 Q 25 60 28 100 Q 30 130 45 155 L 55 155 Q 70 130 72 100 Q 75 60 70 35 Z"/>
        </clipPath>
        <linearGradient id="hurricane-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="25"
        y={155 - fillHeight}
        width="50"
        height={fillHeight}
        fill="url(#hurricane-liquid)"
        clipPath="url(#hurricane-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={155 - fillHeight}
        rx="21"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#hurricane-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 38 45 Q 35 70 37 110"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 44 50 Q 42 75 44 105"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
