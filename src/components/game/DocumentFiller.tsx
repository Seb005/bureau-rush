"use client";

import type { ActiveDocument } from "@/engine/gameState";

interface DocumentFillerProps {
  document: ActiveDocument;
  onFillStep: () => void;
  coffeeSpillActive: boolean;
  disabled: boolean;
}

export default function DocumentFiller({
  document,
  onFillStep,
  coffeeSpillActive,
  disabled,
}: DocumentFillerProps) {
  const progress = document.stepsCompleted / document.type.steps;
  const timeRatio = document.timeRemaining / document.type.timeLimit;
  const isUrgent = timeRatio < 0.3;

  // Random offset for coffee spill effect
  const spillOffset = coffeeSpillActive
    ? { transform: `translate(${Math.sin(Date.now() / 100) * 8}px, ${Math.cos(Date.now() / 130) * 4}px)` }
    : {};

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      {/* Document header */}
      <div className="flex items-center gap-2 text-[10px]">
        <span className="text-lg">{document.type.icon}</span>
        <span className="text-neon-cyan">{document.type.nameFr}</span>
      </div>

      {/* Progress bar (steps) */}
      <div className="w-full max-w-[200px]">
        <div className="flex gap-1 mb-1">
          {[...Array(document.type.steps)].map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm transition-all duration-200 ${
                i < document.stepsCompleted
                  ? "bg-neon-green shadow-[0_0_6px_#39FF14]"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
        <div className="text-[8px] text-center text-gray-400">
          {document.stepsCompleted} / {document.type.steps}
        </div>
      </div>

      {/* Time bar */}
      <div className="w-full max-w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all rounded-full ${
            isUrgent ? "bg-red-500 animate-pulse" : "bg-neon-cyan"
          }`}
          style={{ width: `${timeRatio * 100}%` }}
        />
      </div>

      {/* Fill button */}
      <button
        onClick={onFillStep}
        disabled={disabled}
        style={spillOffset}
        className={`
          btn-arcade text-sm py-3 px-8
          ${disabled
            ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
            : "bg-neon-green text-dark border-neon-green hover:bg-neon-yellow active:scale-90"
          }
          ${coffeeSpillActive ? "transition-none" : ""}
        `}
      >
        REMPLIR
      </button>

      {/* Points preview */}
      <div className="text-[8px] text-gray-500">
        +{document.type.points} pts
      </div>
    </div>
  );
}
