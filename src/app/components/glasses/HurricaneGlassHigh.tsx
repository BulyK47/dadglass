interface HurricaneGlassHighProps {
  fillPercent: number;
  className?: string;
}

export function HurricaneGlassHigh({ fillPercent, className = "" }: HurricaneGlassHighProps) {
  const fillHeight = (fillPercent / 100) * 140;

  return (
    <svg viewBox="0 0 120 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="195" rx="35" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass outline and structure */}
      <path
        d="M 35 30 Q 30 50 30 80 L 30 140 Q 30 155 45 155 L 45 175 L 75 175 L 75 155 Q 90 155 90 140 L 90 80 Q 90 50 85 30 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner glass depth */}
      <path
        d="M 37 35 Q 33 50 33 80 L 33 140 Q 33 152 45 152 L 45 173 L 75 173 L 75 152 Q 87 152 87 140 L 87 80 Q 87 50 83 35"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="hurricane-high-clip">
          <path d="M 33 35 Q 33 50 33 80 L 33 140 Q 33 152 45 152 L 45 173 L 75 173 L 75 152 Q 87 152 87 140 L 87 80 Q 87 50 87 35 Z"/>
        </clipPath>
        <linearGradient id="hurricane-high-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="33"
        y={175 - fillHeight}
        width="54"
        height={fillHeight}
        fill="url(#hurricane-high-liquid)"
        clipPath="url(#hurricane-high-clip)"
      />

      {/* Liquid surface highlight */}
      <ellipse
        cx="60"
        cy={175 - fillHeight}
        rx="25"
        ry="3"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#hurricane-high-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 42 40 Q 42 60 42 100 L 42 130"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 48 45 Q 48 65 48 105"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Stem highlights */}
      <rect x="50" y="155" width="3" height="18" fill="#fff" opacity="0.2" rx="1"/>
    </svg>
  );
}
