export default function MilkingAnimation() {
  return (
    <svg viewBox="0 0 300 170" className="h-32 w-full max-w-xs" aria-hidden="true">
      {/* ground shadow */}
      <ellipse cx="165" cy="158" rx="130" ry="7" fill="rgba(255,255,255,0.08)" />

      {/* buffalo */}
      <g>
        {/* hind legs */}
        <rect x="130" y="120" width="9" height="32" rx="4" fill="rgba(255,255,255,0.5)" />
        <rect x="152" y="120" width="9" height="32" rx="4" fill="rgba(255,255,255,0.5)" />
        {/* front legs */}
        <rect x="205" y="120" width="9" height="32" rx="4" fill="rgba(255,255,255,0.5)" />
        <rect x="232" y="120" width="9" height="32" rx="4" fill="rgba(255,255,255,0.5)" />

        {/* tail */}
        <path
          className="milk-tail"
          d="M118 95 Q104 118 110 142"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <circle className="milk-tail" cx="110" cy="142" r="5" fill="rgba(255,255,255,0.65)" />

        {/* body */}
        <ellipse cx="195" cy="95" rx="72" ry="34" fill="rgba(255,255,255,0.92)" />

        {/* head + muzzle */}
        <ellipse cx="256" cy="80" rx="21" ry="17" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="273" cy="87" rx="8" ry="6" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="245" cy="63" rx="5" ry="9" fill="rgba(255,255,255,0.7)" />

        {/* horns */}
        <path
          d="M244 66 Q230 50 216 55"
          stroke="#f4d98d"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M262 64 Q272 46 288 49"
          stroke="#f4d98d"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* udder */}
        <ellipse cx="152" cy="126" rx="9" ry="7" fill="#f4d98d" />
      </g>

      {/* farmer */}
      <g>
        {/* stool */}
        <rect x="78" y="140" width="22" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
        <rect x="82" y="145" width="3" height="9" fill="rgba(255,255,255,0.4)" />
        <rect x="93" y="145" width="3" height="9" fill="rgba(255,255,255,0.4)" />

        {/* body */}
        <rect x="80" y="105" width="22" height="34" rx="11" fill="rgba(255,255,255,0.9)" />
        {/* head */}
        <circle cx="91" cy="95" r="9" fill="rgba(255,255,255,0.9)" />

        {/* resting arm */}
        <path
          d="M82 115 Q75 122 78 132"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* milking arm */}
        <path
          className="milk-arm"
          d="M100 112 Q120 118 144 124"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* bucket */}
      <path
        d="M138 140 L162 140 L157 162 L143 162 Z"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
      />
      <ellipse cx="150" cy="140" rx="12" ry="3" fill="rgba(255,255,255,0.3)" />

      {/* milk drops */}
      <circle className="milk-drop" cx="152" cy="132" r="2.6" fill="#f4d98d" />
      <circle className="milk-drop milk-drop-delay-1" cx="152" cy="132" r="2.6" fill="#f4d98d" />
      <circle className="milk-drop milk-drop-delay-2" cx="152" cy="132" r="2.6" fill="#f4d98d" />
    </svg>
  );
}
