interface PintGlassIllustrationProps {
  fillPercent: number;
  className?: string;
}

export function PintGlassIllustration({ fillPercent, className = "" }: PintGlassIllustrationProps) {
  const fillHeight = (fillPercent / 100) * 145;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="32" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline */}
      <path
        d="M 25 30 L 30 175 Q 30 180 35 182 L 65 182 Q 70 180 70 175 L 75 30 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner glass depth */}
      <path
        d="M 27 35 L 32 175 Q 32 178 35 180 L 65 180 Q 68 178 68 175 L 73 35"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="pint-clip">
          <path d="M 27 35 L 32 175 Q 32 178 35 180 L 65 180 Q 68 178 68 175 L 73 35 Z"/>
        </clipPath>
        <linearGradient id="pint-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="27"
        y={180 - fillHeight}
        width="46"
        height={fillHeight}
        fill="url(#pint-liquid)"
        clipPath="url(#pint-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={180 - fillHeight}
        rx="21"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#pint-clip)"
      />

      {/* Beer foam/head (only show when fill is high) */}
      {fillPercent > 85 && (
        <>
          <ellipse
            cx="50"
            cy={180 - fillHeight - 8}
            rx="20"
            ry="8"
            fill="#fef3c7"
            opacity="0.9"
          />
          <ellipse
            cx="50"
            cy={180 - fillHeight - 8}
            rx="18"
            ry="6"
            fill="#fff"
            opacity="0.7"
          />
        </>
      )}

      {/* Glass highlights */}
      <path
        d="M 35 40 L 37 140"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 42 45 L 44 120"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
