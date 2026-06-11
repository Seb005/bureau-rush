"use client";

// Full-bleed office scene with soft "3D" shading: gradient lighting, light
// cones from ceiling lamps, layered night city behind the windows, furniture
// with lit/shaded faces and a glossy floor. Pure SVG — no external assets.
export default function OfficeBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* Wall lit from above */}
        <linearGradient id="ob-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e4070" />
          <stop offset="45%" stopColor="#22325c" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
        {/* Glossy floor */}
        <linearGradient id="ob-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2a50" />
          <stop offset="25%" stopColor="#131e3c" />
          <stop offset="100%" stopColor="#0a1124" />
        </linearGradient>
        {/* Night sky in the windows */}
        <linearGradient id="ob-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1230" />
          <stop offset="60%" stopColor="#14264e" />
          <stop offset="100%" stopColor="#23437a" />
        </linearGradient>
        {/* Moon glow */}
        <radialGradient id="ob-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="35%" stopColor="#FFF9C4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0" />
        </radialGradient>
        {/* Ceiling lamp light cone */}
        <linearGradient id="ob-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFF6D8" stopOpacity="0" />
        </linearGradient>
        {/* Cabinet metal */}
        <linearGradient id="ob-cabinet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b8694" />
          <stop offset="35%" stopColor="#546E7A" />
          <stop offset="100%" stopColor="#37474F" />
        </linearGradient>
        {/* Plant pot */}
        <linearGradient id="ob-pot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E2603A" />
          <stop offset="55%" stopColor="#BF360C" />
          <stop offset="100%" stopColor="#7d2407" />
        </linearGradient>
        {/* Water cooler bottle */}
        <linearGradient id="ob-cooler" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfe7f7" />
          <stop offset="50%" stopColor="#7fc4e8" />
          <stop offset="100%" stopColor="#4a90b8" />
        </linearGradient>
        {/* Poster paper */}
        <linearGradient id="ob-poster" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor="#F0D98C" />
        </linearGradient>
      </defs>

      {/* Wall and floor */}
      <rect x="0" y="0" width="160" height="64" fill="url(#ob-wall)" />
      <rect x="0" y="64" width="160" height="36" fill="url(#ob-floor)" />
      {/* Baseboard */}
      <rect x="0" y="62" width="160" height="2.4" fill="#0e1730" />
      <rect x="0" y="62" width="160" height="0.5" fill="#3b507e" opacity="0.6" />
      {/* Floor sheen */}
      <polygon points="20,64 50,64 38,100 -4,100" fill="#ffffff" opacity="0.025" />
      <polygon points="100,64 132,64 150,100 106,100" fill="#ffffff" opacity="0.025" />

      {/* Ceiling lamps with light cones */}
      {[40, 120].map((lx) => (
        <g key={`lamp-${lx}`}>
          <rect x={lx - 0.5} y="0" width="1" height="4" fill="#0e1730" />
          <path d={`M ${lx - 5} 4 Q ${lx} 1.5 ${lx + 5} 4 L ${lx + 4} 6.5 L ${lx - 4} 6.5 Z`} fill="#22325c" />
          <ellipse cx={lx} cy="6.6" rx="3.6" ry="1" fill="#FFF6D8" opacity="0.9" />
          <polygon points={`${lx - 4},7 ${lx + 4},7 ${lx + 16},62 ${lx - 16},62`} fill="url(#ob-cone)" />
        </g>
      ))}

      {/* Windows: deep night city */}
      {[12, 94].map((wx, wi) => (
        <g key={`win-${wx}`}>
          {/* Frame with bevel */}
          <rect x={wx - 2} y="6" width="42" height="32" rx="2" fill="#0a1124" />
          <rect x={wx - 1.2} y="6.8" width="40.4" height="30.4" rx="1.6" fill="#1d2f56" />
          <rect x={wx} y="8" width="38" height="28" rx="1" fill="url(#ob-sky)" />
          {/* Stars */}
          <circle cx={wx + 6} cy="12" r="0.45" fill="#fff" opacity="0.8" />
          <circle cx={wx + 14} cy="10.5" r="0.35" fill="#fff" opacity="0.6" />
          <circle cx={wx + 23} cy="13.5" r="0.4" fill="#fff" opacity="0.7" />
          <circle cx={wx + 31} cy="10" r="0.3" fill="#fff" opacity="0.5" />
          <circle cx={wx + 34} cy="16" r="0.35" fill="#fff" opacity="0.6" />
          {/* Moon with halo (left window only) */}
          {wi === 0 && (
            <>
              <circle cx={wx + 29} cy="14" r="7" fill="url(#ob-moon)" />
              <circle cx={wx + 29} cy="14" r="2.6" fill="#FFFDE7" />
              <circle cx={wx + 28.2} cy="13.2" r="0.6" fill="#EDE7C0" opacity="0.7" />
              <circle cx={wx + 30} cy="15" r="0.45" fill="#EDE7C0" opacity="0.6" />
            </>
          )}
          {/* Far city layer */}
          <g fill="#101e3e">
            <rect x={wx + 2} y="20" width="5" height="16" />
            <rect x={wx + 8} y="17" width="4" height="19" />
            <rect x={wx + 13} y="22" width="6" height="14" />
            <rect x={wx + 20} y="18.5" width="4.5" height="17.5" />
            <rect x={wx + 25.5} y="23" width="5" height="13" />
            <rect x={wx + 31.5} y="20" width="5" height="16" />
          </g>
          {/* Near city layer */}
          <g fill="#1c3158">
            <rect x={wx + 4} y="26" width="7" height="10" rx="0.5" />
            <rect x={wx + 13} y="24" width="6" height="12" rx="0.5" />
            <rect x={wx + 21} y="27" width="8" height="9" rx="0.5" />
            <rect x={wx + 30.5} y="25" width="6" height="11" rx="0.5" />
          </g>
          {/* Lit windows */}
          <g fill="#FFE600">
            <rect x={wx + 5.5} y="28" width="1" height="1" opacity="0.9" />
            <rect x={wx + 8.5} y="31" width="1" height="1" opacity="0.6" />
            <rect x={wx + 14.5} y="26" width="1" height="1" opacity="0.8" />
            <rect x={wx + 16.5} y="30" width="1" height="1" opacity="0.5" />
            <rect x={wx + 23} y="29" width="1" height="1" opacity="0.7" />
            <rect x={wx + 26} y="32" width="1" height="1" opacity="0.5" />
            <rect x={wx + 32.5} y="27.5" width="1" height="1" opacity="0.8" />
          </g>
          <g fill="#00FFFF">
            <rect x={wx + 10} y="19" width="0.9" height="0.9" opacity="0.5" />
            <rect x={wx + 22} y="21" width="0.9" height="0.9" opacity="0.45" />
            <rect x={wx + 34} y="29" width="0.9" height="0.9" opacity="0.5" />
          </g>
          {/* Cross frame */}
          <rect x={wx + 18.4} y="8" width="1.2" height="28" rx="0.5" fill="#0e1a38" />
          <rect x={wx} y="21.4" width="38" height="1.2" rx="0.5" fill="#0e1a38" />
          {/* Glass sheen */}
          <polygon points={`${wx + 3},8 ${wx + 12},8 ${wx + 4},36 ${wx},36 ${wx},20`} fill="#cfe4ff" opacity="0.07" />
          <polygon points={`${wx + 15},8 ${wx + 19},8 ${wx + 9},36 ${wx + 6},36`} fill="#cfe4ff" opacity="0.05" />
          {/* Sill */}
          <rect x={wx - 2.6} y="37.4" width="43.2" height="1.8" rx="0.9" fill="#2c3f6c" />
          <rect x={wx - 2.6} y="37.4" width="43.2" height="0.6" rx="0.3" fill="#46598a" />
        </g>
      ))}

      {/* Clock */}
      <g>
        <ellipse cx="69.5" cy="14.8" rx="5.4" ry="5.4" fill="#0c1428" opacity="0.5" />
        <circle cx="69" cy="14" r="5.2" fill="#37474F" />
        <circle cx="69" cy="14" r="4.4" fill="#F4F7F9" />
        <circle cx="69" cy="14" r="4.4" fill="none" stroke="#222d36" strokeWidth="0.4" />
        {/* Ticks */}
        <line x1="69" y1="10.4" x2="69" y2="11.2" stroke="#90A4AE" strokeWidth="0.4" />
        <line x1="72.6" y1="14" x2="71.8" y2="14" stroke="#90A4AE" strokeWidth="0.4" />
        <line x1="69" y1="17.6" x2="69" y2="16.8" stroke="#90A4AE" strokeWidth="0.4" />
        <line x1="65.4" y1="14" x2="66.2" y2="14" stroke="#90A4AE" strokeWidth="0.4" />
        {/* Hands: 5 to midnight, evidemment */}
        <line x1="69" y1="14" x2="69" y2="11" stroke="#263238" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="69" y1="14" x2="67.2" y2="11.6" stroke="#CC0000" strokeWidth="0.5" strokeLinecap="round" />
        <circle cx="69" cy="14" r="0.6" fill="#263238" />
        {/* Glass highlight */}
        <path d="M 66 11.5 Q 68 10 70.5 11" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>

      {/* Motivational poster, slightly tilted */}
      <g transform="rotate(-1.5 68 28)">
        <rect x="59.5" y="22.5" width="18" height="13.5" rx="0.8" fill="#0c1428" opacity="0.55" />
        <rect x="59" y="22" width="18" height="13.5" rx="0.8" fill="#3b4a58" />
        <rect x="60" y="23" width="16" height="11.5" rx="0.5" fill="url(#ob-poster)" />
        <text x="68" y="26.4" textAnchor="middle" fontSize="2.1" fontFamily="monospace" fontWeight="bold" fill="#6b5400">
          OBJECTIFS
        </text>
        <line x1="61.5" y1="28" x2="74.5" y2="28" stroke="#8a6f1a" strokeWidth="0.5" opacity="0.6" />
        <line x1="61.5" y1="29.6" x2="71" y2="29.6" stroke="#8a6f1a" strokeWidth="0.5" opacity="0.4" />
        {/* Rising chart, last bar in the red */}
        <rect x="62" y="31.8" width="1.8" height="1.7" rx="0.3" fill="#43A047" />
        <rect x="64.6" y="30.8" width="1.8" height="2.7" rx="0.3" fill="#43A047" />
        <rect x="67.2" y="29.8" width="1.8" height="3.7" rx="0.3" fill="#E53935" />
        <path d="M 62.4 31 L 67.8 28.6" stroke="#37474F" strokeWidth="0.4" opacity="0.7" />
        <path d="M 67.8 28.6 l -1 -0.1 l 0.7 0.9 z" fill="#37474F" opacity="0.7" />
      </g>

      {/* "SALLE D'ATTENTE" glowing sign */}
      <g>
        <rect x="82.5" y="23.5" width="7.5" height="10.5" rx="1" fill="#0c1428" opacity="0.55" />
        <rect x="82" y="23" width="7.5" height="10.5" rx="1" fill="#101a33" />
        <rect x="82" y="23" width="7.5" height="10.5" rx="1" fill="none" stroke="#00FFFF" strokeWidth="0.3" opacity="0.5" />
        <rect x="83.2" y="25" width="5" height="1.1" rx="0.5" fill="#00FFFF" opacity="0.75" />
        <rect x="83.2" y="27.4" width="5" height="1.1" rx="0.5" fill="#00FFFF" opacity="0.5" />
        <rect x="83.2" y="29.8" width="5" height="1.1" rx="0.5" fill="#00FFFF" opacity="0.3" />
      </g>

      {/* Filing cabinet with 3D faces */}
      <g>
        <ellipse cx="11" cy="67.5" rx="10" ry="1.8" fill="#000" opacity="0.35" />
        {/* Side face */}
        <polygon points="17,44 20.5,42.5 20.5,64.5 17,66" fill="#26343c" />
        {/* Top face */}
        <polygon points="4,44 17,44 20.5,42.5 7.5,42.5" fill="#74909e" />
        {/* Front face */}
        <rect x="4" y="44" width="13" height="22" rx="0.6" fill="url(#ob-cabinet)" />
        {/* Drawers */}
        {[45.5, 52.5, 59.5].map((dy) => (
          <g key={`drawer-${dy}`}>
            <rect x="5.2" y={dy} width="10.6" height="5.6" rx="0.5" fill="#5f7a87" />
            <rect x="5.2" y={dy} width="10.6" height="1" rx="0.5" fill="#7c97a4" opacity="0.8" />
            <rect x="9" y={dy + 2.4} width="3" height="1" rx="0.5" fill="#22303a" />
          </g>
        ))}
        {/* Overflowing papers */}
        <rect x="5" y="41" width="6" height="1.6" rx="0.4" fill="#ECEFF1" transform="rotate(-4 8 41.8)" />
        <rect x="8.5" y="40.4" width="6" height="1.6" rx="0.4" fill="#CFD8DC" transform="rotate(3 11.5 41.2)" />
        <rect x="6.5" y="39.6" width="6" height="1.6" rx="0.4" fill="#ECEFF1" transform="rotate(-2 9.5 40.4)" />
      </g>

      {/* Water cooler */}
      <g>
        <ellipse cx="135" cy="66.5" rx="6" ry="1.4" fill="#000" opacity="0.3" />
        <rect x="131" y="50" width="8" height="16" rx="1.2" fill="#cfd8dc" />
        <rect x="131" y="50" width="2.5" height="16" rx="1.2" fill="#fff" opacity="0.45" />
        <rect x="137" y="50" width="2" height="16" rx="1" fill="#90a4ae" opacity="0.6" />
        {/* Bottle */}
        <path d="M 132 50 L 132 45 Q 132 43.2 135 43.2 Q 138 43.2 138 45 L 138 50 Z" fill="url(#ob-cooler)" opacity="0.9" />
        <ellipse cx="133.6" cy="45.6" rx="0.8" ry="1.6" fill="#fff" opacity="0.5" />
        {/* Tap and cup */}
        <rect x="133" y="56" width="1.6" height="1.6" rx="0.4" fill="#37474F" />
        <rect x="135.6" y="56" width="1.6" height="1.6" rx="0.4" fill="#1976D2" />
      </g>

      {/* Plant with shaded leaves */}
      <g>
        <ellipse cx="150" cy="64.5" rx="7" ry="1.6" fill="#000" opacity="0.35" />
        <path d="M 145.5 55 L 154.5 55 L 153.5 64 L 146.5 64 Z" fill="url(#ob-pot)" />
        <rect x="145" y="54" width="10" height="1.6" rx="0.8" fill="#8a2a09" />
        {/* Stems and leaves */}
        <path d="M 150 54 Q 149.5 47 147 43" stroke="#2E7D32" strokeWidth="0.9" fill="none" />
        <path d="M 150 54 Q 151 46 154 42.5" stroke="#2E7D32" strokeWidth="0.9" fill="none" />
        <path d="M 150 54 Q 150 47 150 41.5" stroke="#388E3C" strokeWidth="0.9" fill="none" />
        <ellipse cx="146.4" cy="42" rx="2.6" ry="1.5" fill="#43A047" transform="rotate(-38 146.4 42)" />
        <ellipse cx="154.6" cy="41.6" rx="2.6" ry="1.5" fill="#4CAF50" transform="rotate(34 154.6 41.6)" />
        <ellipse cx="150" cy="39.8" rx="1.7" ry="2.8" fill="#66BB6A" />
        <ellipse cx="147.8" cy="46.5" rx="2.2" ry="1.3" fill="#2E7D32" transform="rotate(-30 147.8 46.5)" />
        <ellipse cx="152.4" cy="46" rx="2.2" ry="1.3" fill="#388E3C" transform="rotate(28 152.4 46)" />
        {/* Leaf highlights */}
        <ellipse cx="149.6" cy="38.8" rx="0.5" ry="1" fill="#A5D6A7" opacity="0.7" />
        <ellipse cx="146" cy="41.5" rx="0.8" ry="0.4" fill="#A5D6A7" opacity="0.6" transform="rotate(-38 146 41.5)" />
      </g>
    </svg>
  );
}
