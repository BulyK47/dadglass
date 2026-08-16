interface PintGlassProps {
  fillPercent: number;
  className?: string;
}

export function PintGlass({ fillPercent, className = "" }: PintGlassProps) {
  const fillHeight = (fillPercent / 100) * 135;

  return (
    <svg viewBox="0 0 95 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="47.5" cy="195" rx="32" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline - traditional pint (slight taper) */}
      <path
        d="M 22 40 L 27 180 Q 27 185 32 185 L 63 185 Q 68 185 68 180 L 73 40 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 24 45 L 29 180 Q 29 183 32 183 L 63 183 Q 66 183 66 180 L 71 45"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="pint-clip">
          <path d="M 24 45 L 29 180 Q 29 183 32 183 L 63 183 Q 66 183 66 180 L 71 45 Z"/>
        </clipPath>
        <linearGradient id="pint-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="24"
        y={183 - fillHeight}
        width="47"
        height={fillHeight}
        fill="url(#pint-liquid)"
        clipPath="url(#pint-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="47.5"
        cy={183 - fillHeight}
        rx="22"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#pint-clip)"
      />

      {/* Beer foam/head (only show when fill is high) */}
      {fillPercent > 85 && (
        <>
          <ellipse
            cx="47.5"
            cy={183 - fillHeight - 8}
            rx="21"
            ry="7"
            fill="#fef3c7"
            opacity="0.9"
          />
          <ellipse
            cx="47.5"
            cy={183 - fillHeight - 8}
            rx="19"
            ry="5"
            fill="#fff"
            opacity="0.7"
          />
        </>
      )}

      {/* Glass highlights */}
      <path
        d="M 32 50 L 34 155"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 38 55 L 40 140"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
