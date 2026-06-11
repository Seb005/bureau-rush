"use client";

// Full-bleed pixel-art office scene: wall, windows on the night city,
// clock, motivational poster, plant and filing cabinet.
// Rendered behind the game UI — pure SVG, no external assets.
export default function OfficeBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* Wall */}
      <rect x="0" y="0" width="160" height="62" fill="#1d2a4a" />
      {/* Wainscot strip */}
      <rect x="0" y="58" width="160" height="4" fill="#16213E" />
      {/* Floor */}
      <rect x="0" y="62" width="160" height="38" fill="#101830" />
      {/* Floor tiles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={`tile-${i}`} x={i * 20} y="62" width="0.6" height="38" fill="#0a1124" />
      ))}
      <rect x="0" y="78" width="160" height="0.6" fill="#0a1124" />

      {/* Windows: night city */}
      {[14, 96].map((wx) => (
        <g key={`win-${wx}`}>
          <rect x={wx - 1.5} y="6.5" width="39" height="29" fill="#0a1124" />
          <rect x={wx} y="8" width="36" height="26" fill="#0d1f3c" />
          {/* Moon in the left window only */}
          {wx === 14 && <rect x={wx + 26} y="11" width="4" height="4" fill="#FFF9C4" opacity="0.9" />}
          {/* Skyline */}
          <rect x={wx + 2} y="22" width="6" height="12" fill="#1a2c52" />
          <rect x={wx + 9} y="18" width="5" height="16" fill="#152544" />
          <rect x={wx + 15} y="24" width="7" height="10" fill="#1a2c52" />
          <rect x={wx + 23} y="20" width="5" height="14" fill="#152544" />
          <rect x={wx + 29} y="25" width="6" height="9" fill="#1a2c52" />
          {/* Lit windows in the buildings */}
          <rect x={wx + 3} y="24" width="1" height="1" fill="#FFE600" opacity="0.8" />
          <rect x={wx + 6} y="27" width="1" height="1" fill="#FFE600" opacity="0.6" />
          <rect x={wx + 10} y="20" width="1" height="1" fill="#00FFFF" opacity="0.6" />
          <rect x={wx + 12} y="25" width="1" height="1" fill="#FFE600" opacity="0.7" />
          <rect x={wx + 17} y="26" width="1" height="1" fill="#FF6EC7" opacity="0.6" />
          <rect x={wx + 24} y="23" width="1" height="1" fill="#FFE600" opacity="0.7" />
          <rect x={wx + 31} y="27" width="1" height="1" fill="#00FFFF" opacity="0.5" />
          {/* Cross frame */}
          <rect x={wx + 17.4} y="8" width="1.2" height="26" fill="#0a1124" />
          <rect x={wx} y="20.4" width="36" height="1.2" fill="#0a1124" />
        </g>
      ))}

      {/* Clock */}
      <g>
        <rect x="76" y="8" width="9" height="9" fill="#263238" />
        <rect x="77" y="9" width="7" height="7" fill="#ECEFF1" />
        <rect x="80.2" y="10" width="0.8" height="3" fill="#222" />
        <rect x="80.5" y="12.2" width="2.5" height="0.8" fill="#CC0000" />
      </g>

      {/* Motivational poster */}
      <g>
        <rect x="60" y="22" width="17" height="13" fill="#37474F" />
        <rect x="61" y="23" width="15" height="11" fill="#FFE08A" />
        <rect x="63" y="25" width="11" height="1" fill="#7a5c00" />
        <rect x="63" y="27.5" width="8" height="1" fill="#7a5c00" />
        {/* Tiny rising chart */}
        <rect x="63" y="31.5" width="1.6" height="1.5" fill="#388E3C" />
        <rect x="65.2" y="30.5" width="1.6" height="2.5" fill="#388E3C" />
        <rect x="67.4" y="29.5" width="1.6" height="3.5" fill="#CC0000" />
      </g>

      {/* "SALLE D'ATTENTE" sign panel */}
      <rect x="86" y="24" width="6" height="9" fill="#16213E" stroke="#0a1124" strokeWidth="0.5" />
      <rect x="87" y="25.5" width="4" height="1" fill="#00FFFF" opacity="0.6" />
      <rect x="87" y="27.5" width="4" height="1" fill="#00FFFF" opacity="0.4" />
      <rect x="87" y="29.5" width="4" height="1" fill="#00FFFF" opacity="0.25" />

      {/* Filing cabinet */}
      <g>
        <rect x="3" y="44" width="13" height="22" fill="#455A64" />
        <rect x="4" y="46" width="11" height="6" fill="#546E7A" />
        <rect x="4" y="53" width="11" height="6" fill="#546E7A" />
        <rect x="4" y="60" width="11" height="5" fill="#546E7A" />
        <rect x="8.5" y="48.5" width="2" height="1" fill="#263238" />
        <rect x="8.5" y="55.5" width="2" height="1" fill="#263238" />
        <rect x="8.5" y="61.5" width="2" height="1" fill="#263238" />
        {/* Overflowing papers on top */}
        <rect x="4" y="42.5" width="5" height="1.5" fill="#ECEFF1" />
        <rect x="7" y="41.5" width="5" height="1.5" fill="#CFD8DC" />
      </g>

      {/* Plant */}
      <g>
        <rect x="146" y="52" width="8" height="8" fill="#BF360C" />
        <rect x="147" y="51" width="6" height="1" fill="#8D2F0B" />
        <rect x="149" y="42" width="2" height="9" fill="#2E7D32" />
        <rect x="146" y="44" width="3" height="2" fill="#43A047" />
        <rect x="151" y="42" width="3" height="2" fill="#43A047" />
        <rect x="147" y="40" width="2" height="2" fill="#43A047" />
        <rect x="151" y="46" width="3" height="2" fill="#2E7D32" />
      </g>

      {/* Ceiling glow strips */}
      <rect x="20" y="0" width="30" height="1.2" fill="#FFF9C4" opacity="0.25" />
      <rect x="105" y="0" width="30" height="1.2" fill="#FFF9C4" opacity="0.25" />
    </svg>
  );
}
