interface HighballGlassProps {
  fillPercent: number;
  className?: string;
}

export function HighballGlass({ fillPercent, className = "" }: HighballGlassProps) {
  const fillHeight = (fillPercent / 100) * 110;

  return (
    <svg viewBox="0 0 90 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="45" cy="195" rx="30" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline - straight highball */}
      <path
        d="M 20 70 L 20 180 Q 20 185 25 185 L 65 185 Q 70 185 70 180 L 70 70 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 23 75 L 23 180 Q 23 183 25 183 L 65 183 Q 67 183 67 180 L 67 75"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="highball-clip">
          <path d="M 22 75 L 22 180 Q 22 183 25 183 L 65 183 Q 68 183 68 180 L 68 75 Z"/>
        </clipPath>
        <linearGradient id="highball-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="22"
        y={183 - fillHeight}
        width="46"
        height={fillHeight}
        fill="url(#highball-liquid)"
        clipPath="url(#highball-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="45"
        cy={183 - fillHeight}
        rx="22"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#highball-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 30 80 L 30 165"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 36 85 L 36 150"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
