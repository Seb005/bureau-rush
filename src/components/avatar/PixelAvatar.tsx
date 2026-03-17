"use client";

import { getClientVisuals } from "@/engine/clientGenerator";

interface PixelAvatarProps {
  seed: number;
  size?: number;
  animated?: "sway" | "fidget" | "none";
  className?: string;
}

export default function PixelAvatar({
  seed,
  size = 48,
  animated = "none",
  className = "",
}: PixelAvatarProps) {
  const v = getClientVisuals(seed);
  const px = size / 12; // pixel unit

  const animClass =
    animated === "sway"
      ? "animate-sway"
      : animated === "fidget"
        ? "animate-fidget"
        : "";

  return (
    <div
      className={`relative ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 12 12" width={size} height={size} style={{ imageRendering: "pixelated" }}>
        {/* Head */}
        <rect x="3" y="1" width="6" height="6" rx="0" fill={v.skinColor} />

        {/* Hair */}
        {v.hairStyle === 0 && (
          <>
            <rect x="3" y="0" width="6" height="2" fill={v.hairColor} />
            <rect x="2" y="1" width="1" height="2" fill={v.hairColor} />
            <rect x="9" y="1" width="1" height="2" fill={v.hairColor} />
          </>
        )}
        {v.hairStyle === 1 && (
          <>
            <rect x="3" y="0" width="6" height="2" fill={v.hairColor} />
            <rect x="2" y="0" width="1" height="4" fill={v.hairColor} />
            <rect x="9" y="0" width="1" height="4" fill={v.hairColor} />
          </>
        )}
        {v.hairStyle === 2 && (
          <>
            <rect x="4" y="0" width="4" height="1" fill={v.hairColor} />
            <rect x="3" y="1" width="6" height="1" fill={v.hairColor} />
          </>
        )}

        {/* Eyes */}
        <rect x="4" y="3" width="1" height="1" fill="#1a1a1a" />
        <rect x="7" y="3" width="1" height="1" fill="#1a1a1a" />

        {/* Glasses */}
        {v.hasGlasses && (
          <>
            <rect x="3.5" y="2.5" width="2" height="2" rx="0" fill="none" stroke="#333" strokeWidth="0.4" />
            <rect x="6.5" y="2.5" width="2" height="2" rx="0" fill="none" stroke="#333" strokeWidth="0.4" />
            <line x1="5.5" y1="3.5" x2="6.5" y2="3.5" stroke="#333" strokeWidth="0.3" />
          </>
        )}

        {/* Mouth */}
        <rect x="5" y="5" width="2" height="0.5" fill="#c44" />

        {/* Body / Shirt */}
        <rect x="2" y="7" width="8" height="5" fill={v.shirtColor} />

        {/* Neck */}
        <rect x="5" y="6.5" width="2" height="1" fill={v.skinColor} />
      </svg>
    </div>
  );
}
