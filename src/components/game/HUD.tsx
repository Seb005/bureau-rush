"use client";

import type { GameState } from "@/engine/gameState";

interface HUDProps {
  state: GameState;
}

export default function HUD({ state }: HUDProps) {
  const comboMultiplier =
    state.combo >= 10 ? 5 : state.combo >= 8 ? 4 : state.combo >= 5 ? 3 : state.combo >= 3 ? 2 : 1;

  const minutes = Math.floor(state.playTime / 60);
  const seconds = Math.floor(state.playTime % 60);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-dark/90 border-b-2 border-neon-cyan/30 text-[8px] sm:text-[10px]">
      {/* Score */}
      <div className="text-neon-green text-glow-green">
        SCORE: {state.score.toString().padStart(6, "0")}
      </div>

      {/* Lives */}
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={i < state.lives ? "text-red-500" : "text-gray-700"}>
            ♥
          </span>
        ))}
      </div>

      {/* Combo */}
      {state.combo >= 2 && (
        <div className={`text-neon-yellow ${state.inZoneMode ? "animate-pulse" : ""}`}>
          x{comboMultiplier} COMBO
        </div>
      )}

      {/* Level */}
      <div className="text-neon-cyan">
        NIVEAU {state.level}
      </div>

      {/* Time */}
      <div className="text-gray-400">
        {timeStr}
      </div>
    </div>
  );
}
