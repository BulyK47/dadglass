interface RocksGlassProps {
  fillPercent: number;
  className?: string;
}

export function RocksGlass({ fillPercent, className = "" }: RocksGlassProps) {
  const fillHeight = (fillPercent / 100) * 65;

  return (
    <svg viewBox="0 0 120 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="195" rx="35" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline - Old Fashioned/Rocks glass (wide tumbler) */}
      <path
        d="M 25 115 L 25 180 Q 25 185 30 185 L 90 185 Q 95 185 95 180 L 95 115 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner glass depth */}
      <path
        d="M 28 120 L 28 180 Q 28 183 30 183 L 90 183 Q 92 183 92 180 L 92 120"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="rocks-clip">
          <path d="M 27 120 L 27 180 Q 27 183 30 183 L 90 183 Q 93 183 93 180 L 93 120 Z"/>
        </clipPath>
        <linearGradient id="rocks-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="27"
        y={183 - fillHeight}
        width="66"
        height={fillHeight}
        fill="url(#rocks-liquid)"
        clipPath="url(#rocks-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="60"
        cy={183 - fillHeight}
        rx="30"
        ry="3"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#rocks-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 35 125 L 35 170"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 42 130 L 42 160"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
