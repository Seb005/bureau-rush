"use client";

import { getClientVisuals } from "@/engine/clientGenerator";

export type AvatarMood = "happy" | "impatient" | "angry";

interface PixelAvatarProps {
  seed: number;
  size?: number;
  animated?: "sway" | "fidget" | "none";
  mood?: AvatarMood;
  ghost?: boolean;
  className?: string;
}

// Lighten (amt > 0) or darken (amt < 0) a #RRGGBB color
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Chibi "3D render" avatar: soft gradients, highlights and drop shadow.
// Same procedural variety as before — skin, hair, cap, glasses, mood, ghost.
export default function PixelAvatar({
  seed,
  size = 48,
  animated = "none",
  mood = "happy",
  ghost = false,
  className = "",
}: PixelAvatarProps) {
  const v = getClientVisuals(seed);
  const uid = `av${seed % 1000000}`;

  const animClass = ghost
    ? "animate-ghost-float"
    : animated === "sway"
      ? "animate-sway"
      : animated === "fidget"
        ? "animate-fidget"
        : "";

  const skin = ghost ? "#B8D8F0" : v.skinColor;
  const hair = ghost ? "#8FB8DC" : v.hairColor;
  const shirt = ghost ? "#A0C4E8" : v.shirtColor;
  const pants = ghost ? "#88AEDA" : v.pantsColor;
  const cap = ghost ? "#9FBEE4" : v.capColor;
  const angry = mood === "angry";
  const upset = mood === "angry" || mood === "impatient";

  return (
    <div
      className={`relative ${animClass} ${className}`}
      style={{ width: size, height: size * 1.3, opacity: ghost ? 0.6 : 1 }}
    >
      <svg viewBox="0 0 64 84" width={size} height={size * 1.3}>
        <defs>
          <radialGradient id={`${uid}-skin`} cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor={shade(skin, 35)} />
            <stop offset="55%" stopColor={skin} />
            <stop offset="100%" stopColor={shade(skin, -40)} />
          </radialGradient>
          <linearGradient id={`${uid}-shirt`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shade(shirt, 45)} />
            <stop offset="55%" stopColor={shirt} />
            <stop offset="100%" stopColor={shade(shirt, -45)} />
          </linearGradient>
          <linearGradient id={`${uid}-hair`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={shade(hair, 50)} />
            <stop offset="60%" stopColor={hair} />
            <stop offset="100%" stopColor={shade(hair, -35)} />
          </linearGradient>
          <linearGradient id={`${uid}-pants`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(pants, 25)} />
            <stop offset="100%" stopColor={shade(pants, -25)} />
          </linearGradient>
          <linearGradient id={`${uid}-cap`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={shade(cap, 45)} />
            <stop offset="100%" stopColor={shade(cap, -30)} />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        {!ghost && <ellipse cx="32" cy="80" rx="17" ry="3.5" fill="#000" opacity="0.3" />}

        {/* Long hair behind the head */}
        {!v.hasCap && v.hairStyle === 3 && (
          <path
            d="M 14 22 Q 13 8 32 7 Q 51 8 50 22 L 50 44 Q 50 50 44 49 L 20 49 Q 14 50 14 44 Z"
            fill={`url(#${uid}-hair)`}
          />
        )}

        {ghost ? (
          /* Ghost: wavy tail instead of legs */
          <path
            d="M 16 52 L 48 52 L 48 74 Q 44 70 40 74 Q 36 78 32 74 Q 28 70 24 74 Q 20 78 16 74 Z"
            fill={`url(#${uid}-shirt)`}
          />
        ) : (
          <>
            {/* Legs */}
            <rect x="21" y="60" width="9" height="17" rx="4" fill={`url(#${uid}-pants)`} />
            <rect x="34" y="60" width="9" height="17" rx="4" fill={`url(#${uid}-pants)`} />
            {/* Shoes */}
            <ellipse cx="25" cy="78" rx="6" ry="3" fill="#2b2b30" />
            <ellipse cx="39" cy="78" rx="6" ry="3" fill="#2b2b30" />
            <ellipse cx="23.5" cy="77" rx="2" ry="0.9" fill="#55555e" />
            <ellipse cx="37.5" cy="77" rx="2" ry="0.9" fill="#55555e" />
          </>
        )}

        {/* Body */}
        <path
          d="M 18 47 Q 18 40 25 40 L 39 40 Q 46 40 46 47 L 46 58 Q 46 63 41 63 L 23 63 Q 18 63 18 58 Z"
          fill={`url(#${uid}-shirt)`}
        />
        {/* Collar shadow under the chin */}
        <ellipse cx="32" cy="41.5" rx="8" ry="2.5" fill="#000" opacity="0.18" />

        {/* Arms */}
        <rect x="13" y="42" width="7" height="17" rx="3.5" fill={shade(shirt, -18)} />
        <rect x="44" y="42" width="7" height="17" rx="3.5" fill={shade(shirt, -18)} />
        {/* Hands */}
        <circle cx="16.5" cy="60" r="3.2" fill={`url(#${uid}-skin)`} />
        <circle cx="47.5" cy="60" r="3.2" fill={`url(#${uid}-skin)`} />

        {/* Head */}
        <circle cx="32" cy="24" r="15.5" fill={`url(#${uid}-skin)`} />
        {/* Ears */}
        <circle cx="16.8" cy="25" r="2.6" fill={skin} />
        <circle cx="47.2" cy="25" r="2.6" fill={shade(skin, -20)} />

        {/* Hair / cap */}
        {v.hasCap ? (
          <>
            <path d="M 17 21 Q 17 7.5 32 7.5 Q 47 7.5 47 21 L 47 22 L 17 22 Z" fill={`url(#${uid}-cap)`} />
            <path d="M 15 21 L 49 21 Q 53 21 53 23.5 Q 53 25.5 49.5 25 L 15 23.8 Z" fill={shade(cap, -45)} />
            <circle cx="32" cy="8.5" r="2" fill={shade(cap, -30)} />
          </>
        ) : (
          <>
            {v.hairStyle === 0 && (
              <path d="M 16.5 24 Q 15.5 8 32 8 Q 48.5 8 47.5 24 Q 47 18 42 17 Q 35 15 30 16.5 Q 21 18 19.5 22 Q 17.5 24 16.5 24 Z" fill={`url(#${uid}-hair)`} />
            )}
            {v.hairStyle === 1 && (
              <path d="M 16.5 27 Q 15 8 32 8 Q 49 8 47.5 27 L 45.5 27 Q 46 19 40 17.5 Q 32 15.5 25 17.5 Q 18.5 19.5 18.5 27 Z" fill={`url(#${uid}-hair)`} />
            )}
            {v.hairStyle === 2 && (
              <path d="M 17.5 19 Q 20 9.5 32 9.5 Q 44 9.5 46.5 19 Q 40 14.5 32 14.5 Q 24 14.5 17.5 19 Z" fill={`url(#${uid}-hair)`} />
            )}
            {v.hairStyle === 3 && (
              <path d="M 16.5 24 Q 15.5 8 32 8 Q 48.5 8 47.5 24 Q 46 17.5 40 16.5 Q 32 15 25.5 16.8 Q 18 18.5 16.5 24 Z" fill={`url(#${uid}-hair)`} />
            )}
            {/* Hair shine */}
            <ellipse cx="26" cy="12.5" rx="5" ry="2" fill="#fff" opacity="0.25" transform="rotate(-12 26 12.5)" />
          </>
        )}

        {/* Eyebrows */}
        <line
          x1="22.5" y1={angry ? 19.5 : 18.5} x2="28.5" y2={angry ? 17.5 : 18}
          stroke={shade(hair, -25)} strokeWidth="1.6" strokeLinecap="round"
          transform={angry ? "" : "rotate(-4 25.5 18)"}
        />
        <line
          x1="35.5" y1={angry ? 17.5 : 18} x2="41.5" y2={angry ? 19.5 : 18.5}
          stroke={shade(hair, -25)} strokeWidth="1.6" strokeLinecap="round"
          transform={angry ? "" : "rotate(4 38.5 18)"}
        />

        {/* Eyes: white + pupil + sparkle */}
        <ellipse cx="25.5" cy="24" rx="3.4" ry={upset ? 3 : 3.8} fill="#fff" />
        <ellipse cx="38.5" cy="24" rx="3.4" ry={upset ? 3 : 3.8} fill="#fff" />
        <circle cx="26" cy="24.5" r="1.8" fill={angry ? "#7a1f1f" : "#2b2017"} />
        <circle cx="39" cy="24.5" r="1.8" fill={angry ? "#7a1f1f" : "#2b2017"} />
        <circle cx="26.7" cy="23.7" r="0.7" fill="#fff" />
        <circle cx="39.7" cy="23.7" r="0.7" fill="#fff" />
        {/* Impatient: heavy eyelids */}
        {upset && (
          <>
            <path d="M 22 21.5 Q 25.5 20 29 21.5" stroke={shade(skin, -50)} strokeWidth="1.2" fill="none" />
            <path d="M 35 21.5 Q 38.5 20 42 21.5" stroke={shade(skin, -50)} strokeWidth="1.2" fill="none" />
          </>
        )}

        {/* Glasses */}
        {v.hasGlasses && (
          <g stroke="#3a3a42" strokeWidth="1.4" fill="rgba(160,210,255,0.18)">
            <circle cx="25.5" cy="24" r="5.2" />
            <circle cx="38.5" cy="24" r="5.2" />
            <line x1="30.7" y1="23.5" x2="33.3" y2="23.5" />
          </g>
        )}

        {/* Blush */}
        {upset && (
          <>
            <ellipse cx="21" cy="29.5" rx="2.6" ry="1.5" fill="#E57373" opacity="0.55" />
            <ellipse cx="43" cy="29.5" rx="2.6" ry="1.5" fill="#E57373" opacity="0.55" />
          </>
        )}

        {/* Mouth */}
        {mood === "happy" && (
          <path d="M 27.5 31.5 Q 32 35.5 36.5 31.5" stroke="#9c4a3c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {mood === "impatient" && (
          <line x1="28" y1="32.5" x2="36" y2="32.5" stroke="#9c4a3c" strokeWidth="1.8" strokeLinecap="round" />
        )}
        {mood === "angry" && (
          <path d="M 27.5 34.5 Q 32 30.5 36.5 34.5" stroke="#7a1f1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}
