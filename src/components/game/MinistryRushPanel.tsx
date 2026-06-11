"use client";

import type { MinistryRush } from "@/engine/ministryRush";
import { MINISTRY_RUSH_INFO } from "@/engine/ministryRush";

interface MinistryRushPanelProps {
  rush: MinistryRush;
  onRushClick: () => void;
  disabled: boolean;
}

export default function MinistryRushPanel({ rush, onRushClick, disabled }: MinistryRushPanelProps) {
  const info = MINISTRY_RUSH_INFO[rush.kind];
  const timeRatio = rush.timeRemaining / rush.totalTime;
  const progress = rush.stepsDone / rush.stepsRequired;
  const isCritical = timeRatio < 0.3;

  return (
    <div
      className={`
        mx-2 mb-1 rounded-lg border-2 px-3 py-2 bg-red-950/80 backdrop-blur-sm
        ${isCritical ? "border-red-500 animate-rush-pulse" : "border-neon-orange"}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[9px] text-neon-orange font-bold flex items-center gap-1">
            <span className="text-sm">{info.icon}</span>
            <span className="truncate">{info.nameFr}</span>
          </div>
          <div className="text-[7px] text-orange-200/80 truncate">{info.description}</div>

          {/* Progress */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-neon-orange transition-all rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-orange-200 mt-0.5">
            <span>
              {rush.stepsDone}/{rush.stepsRequired}
            </span>
            <span className={isCritical ? "text-red-400 font-bold" : ""}>
              ⏱ {Math.ceil(rush.timeRemaining)}s
            </span>
          </div>
        </div>

        <button
          onClick={onRushClick}
          disabled={disabled}
          className={`
            btn-arcade shrink-0 text-[8px] py-2.5 px-3
            ${disabled
              ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
              : "bg-neon-orange text-dark border-neon-orange hover:bg-neon-yellow active:scale-90"
            }
          `}
        >
          {info.buttonLabel}
        </button>
      </div>
    </div>
  );
}
