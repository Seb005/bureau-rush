"use client";

interface ConseillereSpriteProps {
  size?: number;
  typing?: boolean; // frantic typing animation when serving a client
  resting?: boolean; // sick leave: chair is empty
  className?: string;
}

// The conseillère behind her desk: monitor, coffee mug, paper stack.
// Soft-shaded vector style matching the client avatars — no external assets.
export default function ConseillereSprite({
  size = 120,
  typing = false,
  resting = false,
  className = "",
}: ConseillereSpriteProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 0.75 }}>
      <svg viewBox="0 0 128 96" width={size} height={size * 0.75}>
        <defs>
          <radialGradient id="cs-skin" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#F5D5AC" />
            <stop offset="55%" stopColor="#E8B88A" />
            <stop offset="100%" stopColor="#C08F5E" />
          </radialGradient>
          <linearGradient id="cs-cardigan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A94FD4" />
            <stop offset="55%" stopColor="#7B1FA2" />
            <stop offset="100%" stopColor="#581572" />
          </linearGradient>
          <linearGradient id="cs-hair" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#6E563F" />
            <stop offset="100%" stopColor="#33241A" />
          </linearGradient>
          <linearGradient id="cs-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A1887F" />
            <stop offset="30%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
          <linearGradient id="cs-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD8F7" />
            <stop offset="100%" stopColor="#2E6E8E" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="64" cy="92" rx="52" ry="4" fill="#000" opacity="0.25" />

        {/* Chair */}
        <rect x="48" y="18" width="32" height="42" rx="8" fill="#3E2723" />
        <rect x="50" y="20" width="28" height="38" rx="7" fill="#5D4037" />

        {!resting ? (
          <g className={typing ? "animate-typing" : ""}>
            {/* Bun */}
            <circle cx="64" cy="8" r="6" fill="url(#cs-hair)" />
            {/* Hair */}
            <path d="M 50 26 Q 48 10 64 10 Q 80 10 78 26 Q 76 18 70 17 Q 64 15.5 58 17 Q 52 18 50 26 Z" fill="url(#cs-hair)" />
            {/* Head */}
            <circle cx="64" cy="24" r="12.5" fill="url(#cs-skin)" />
            {/* Glasses (3/4 view, slightly turned to the screen) */}
            <g stroke="#3a3a42" strokeWidth="1.2" fill="rgba(160,210,255,0.18)">
              <circle cx="59" cy="24" r="4" />
              <circle cx="69.5" cy="24" r="4" />
              <line x1="63" y1="23.6" x2="65.5" y2="23.6" />
            </g>
            {/* Focused mouth */}
            <line x1="61" y1="31.5" x2="67" y2="31.5" stroke="#9c4a3c" strokeWidth="1.4" strokeLinecap="round" />

            {/* Cardigan body */}
            <path d="M 48 44 Q 48 36 56 36 L 72 36 Q 80 36 80 44 L 80 58 Q 80 62 76 62 L 52 62 Q 48 62 48 58 Z" fill="url(#cs-cardigan)" />
            <ellipse cx="64" cy="37.5" rx="7" ry="2" fill="#000" opacity="0.18" />

            {/* Arms reaching the keyboard */}
            <g className={typing ? "animate-arm-left" : ""}>
              <path d="M 50 42 Q 40 46 36 52" stroke="#7B1FA2" strokeWidth="6" fill="none" strokeLinecap="round" />
              <circle cx="35" cy="53.5" r="3.4" fill="url(#cs-skin)" />
            </g>
            <g className={typing ? "animate-arm-right" : ""}>
              <path d="M 78 42 Q 88 46 92 52" stroke="#7B1FA2" strokeWidth="6" fill="none" strokeLinecap="round" />
              <circle cx="93" cy="53.5" r="3.4" fill="url(#cs-skin)" />
            </g>
          </g>
        ) : (
          /* Sleeping emoji floats above the empty chair during sick leave */
          <text x="64" y="34" textAnchor="middle" fontSize="22">
            😴
          </text>
        )}

        {/* Desk */}
        <rect x="8" y="56" width="112" height="8" rx="3" fill="url(#cs-desk)" />
        <rect x="12" y="64" width="6" height="28" rx="2" fill="#4E342E" />
        <rect x="110" y="64" width="6" height="28" rx="2" fill="#4E342E" />
        {/* Desk front panel */}
        <rect x="22" y="64" width="84" height="20" rx="2" fill="#5D4037" />
        <rect x="22" y="64" width="84" height="3" fill="#000" opacity="0.15" />

        {/* Monitor (screen toward the conseillère, glow visible) */}
        <rect x="24" y="30" width="30" height="22" rx="3" fill="#263238" />
        <rect x="26.5" y="32.5" width="25" height="17" rx="2" fill="url(#cs-screen)" opacity={typing ? 1 : 0.55} />
        {typing && (
          <>
            <rect x="29" y="36" width="14" height="1.6" rx="0.8" fill="#fff" opacity="0.7" />
            <rect x="29" y="40" width="18" height="1.6" rx="0.8" fill="#fff" opacity="0.5" />
            <rect x="29" y="44" width="10" height="1.6" rx="0.8" fill="#fff" opacity="0.6" />
          </>
        )}
        <rect x="36" y="52" width="6" height="4" fill="#263238" />
        <rect x="31" y="55" width="16" height="2" rx="1" fill="#263238" />

        {/* Keyboard */}
        <rect x="56" y="53" width="24" height="3.5" rx="1.5" fill="#455A64" />
        <rect x="58" y="54" width="20" height="1" rx="0.5" fill="#78909C" />

        {/* Coffee mug with steam */}
        <rect x="90" y="48" width="9" height="8" rx="1.5" fill="#D32F2F" />
        <path d="M 99 50 Q 103 50 103 53 Q 103 55.5 99 55" stroke="#B71C1C" strokeWidth="1.6" fill="none" />
        <path d="M 93 45 Q 94.5 43 93.5 41" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.5" className="animate-pulse" />
        <path d="M 96.5 45 Q 95 43 96 41" stroke="#fff" strokeWidth="1" fill="none" opacity="0.35" className="animate-pulse" />

        {/* Paper stack */}
        <rect x="104" y="52" width="14" height="2" rx="0.8" fill="#ECEFF1" transform="rotate(-2 111 53)" />
        <rect x="104.5" y="54" width="14" height="2" rx="0.8" fill="#CFD8DC" transform="rotate(1.5 111 55)" />
        <rect x="104" y="55.5" width="14" height="2" rx="0.8" fill="#ECEFF1" />
      </svg>
    </div>
  );
}
