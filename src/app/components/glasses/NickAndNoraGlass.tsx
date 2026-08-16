interface NickAndNoraGlassProps {
  fillPercent: number;
  className?: string;
}

export function NickAndNoraGlass({ fillPercent, className = "" }: NickAndNoraGlassProps) {
  const fillHeight = (fillPercent / 100) * 55;

  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="195" rx="28" ry="4" fill="#000" opacity="0.08"/>

      {/* Glass stem and base */}
      <ellipse cx="50" cy="185" rx="22" ry="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
      <rect x="48" y="145" width="4" height="40" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>

      {/* Glass bowl - coupe/champagne saucer shape */}
      <path
        d="M 30 90 Q 28 110 35 145 L 65 145 Q 72 110 70 90 Z"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner depth */}
      <path
        d="M 32 95 Q 31 110 37 143 L 63 143 Q 69 110 68 95"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Liquid */}
      <defs>
        <clipPath id="nick-nora-clip">
          <path d="M 30 95 Q 28 110 35 145 L 65 145 Q 72 110 70 95 Z"/>
        </clipPath>
        <linearGradient id="nick-nora-liquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect
        x="28"
        y={145 - fillHeight}
        width="44"
        height={fillHeight}
        fill="url(#nick-nora-liquid)"
        clipPath="url(#nick-nora-clip)"
      />

      {/* Liquid surface */}
      <ellipse
        cx="50"
        cy={145 - fillHeight}
        rx="19"
        ry="2.5"
        fill="#fbbf24"
        opacity="0.6"
        clipPath="url(#nick-nora-clip)"
      />

      {/* Glass highlights */}
      <path
        d="M 38 100 Q 36 115 40 135"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.4"
        strokeLinecap="round"
      />

      {/* Stem highlight */}
      <rect x="49" y="150" width="2" height="30" fill="#fff" opacity="0.2"/>
    </svg>
  );
}
