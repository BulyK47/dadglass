interface CollinsGlassProps {
  fillPercent: number;
  className?: string;
}

export function CollinsGlass({ fillPercent, className = "" }: CollinsGlassProps) {
  const fillHeight = (fillPercent / 100) * 125;

  return (
    <svg viewBox="0 0 85 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="42.5" cy="195" rx="28" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline - tall narrow Collins */}
      <path
        d="M 22 55 L 22 180 Q 22 185 27 185 L 58 185 Q 63 185 63 180 L 63 55 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 25 60 L 25 180 Q 25 183 27 183 L 58 183 Q 60 183 60 180 L 60 60"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="collins-clip">
          <path d="M 24 60 L 24 180 Q 24 183 27 183 L 58 183 Q 61 183 61 180 L 61 60 Z"/>
        </clipPath>
        <linearGradient id="collins-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="24"
        y={183 - fillHeight}
        width="37"
        height={fillHeight}
        fill="url(#collins-liquid)"
        clipPath="url(#collins-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="42.5"
        cy={183 - fillHeight}
        rx="18"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#collins-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 32 65 L 32 160"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 37 70 L 37 145"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
