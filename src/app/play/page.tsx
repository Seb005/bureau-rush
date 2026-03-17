"use client";

import GameEngine from "@/components/game/GameEngine";
import GameErrorBoundary from "@/components/game/ErrorBoundary";

export default function PlayPage() {
  return (
    <GameErrorBoundary>
      <GameEngine />
    </GameErrorBoundary>
  );
}
