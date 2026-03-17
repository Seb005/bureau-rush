"use client";

import { useState, useEffect, useCallback } from "react";
import type { GameState } from "@/engine/gameState";
import { getConclusion } from "@/engine/ministryDeductions";
import { saveGameRecord, saveBadges } from "@/lib/storage";

interface GameOverProps {
  state: GameState;
  onReplay: () => void;
  onStartMinistry: () => void;
}

type SequencePhase = "report" | "stamp" | "deductions" | "final";

export default function GameOver({ state, onReplay, onStartMinistry }: GameOverProps) {
  const [phase, setPhase] = useState<SequencePhase>(
    state.phase === "ministrySequence" ? "report" : "report"
  );
  const [visibleDeductions, setVisibleDeductions] = useState(0);
  const [stampVisible, setStampVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveResults = useCallback(() => {
    if (saved) return;
    setSaved(true);
    saveGameRecord({
      date: new Date().toISOString(),
      rawScore: state.score,
      finalScore: state.finalScore,
      level: state.level,
      clientsServed: state.clientsServed,
      clientsLost: state.clientsLost,
      maxCombo: state.maxCombo,
      playTimeSeconds: Math.floor(state.playTime),
      deductions: state.ministryDeductions.map((d) => ({
        reason: d.reason,
        amount: d.amount,
      })),
      badges: state.earnedBadges.map((b) => b.id),
    });
    saveBadges(state.earnedBadges.map((b) => b.id));
  }, [state, saved]);

  // Start the ministry sequence on mount
  useEffect(() => {
    onStartMinistry();
  }, [onStartMinistry]);

  // Phase progression
  useEffect(() => {
    if (phase === "report") {
      const timer = setTimeout(() => setPhase("stamp"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "stamp") {
      const timer = setTimeout(() => setStampVisible(true), 300);
      const timer2 = setTimeout(() => setPhase("deductions"), 1500);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
    if (phase === "deductions") {
      if (visibleDeductions < state.ministryDeductions.length) {
        const timer = setTimeout(() => setVisibleDeductions((v) => v + 1), 900);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase("final");
          saveResults();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, visibleDeductions, state.ministryDeductions.length, saveResults]);

  const conclusion = getConclusion(state.finalScore, state.level);
  const minutes = Math.floor(state.playTime / 60);
  const seconds = Math.floor(state.playTime % 60);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark/95 overflow-y-auto">
      <div className="max-w-md w-full mx-4 my-8 p-6 bg-dark-blue border-2 border-neon-cyan/30 rounded-lg crt-glow">
        {/* Ministry header */}
        <div className="text-center mb-4">
          <div className="text-[8px] text-gray-400 mb-1">
            Ministère de la Bureaucratie Infinie
          </div>
          <div className="text-[7px] text-gray-500">
            Direction de la Vérification de la Vérification
          </div>
        </div>

        {/* Raw performance report */}
        <div className="bg-black/40 p-4 rounded mb-4 relative">
          <h3 className="text-neon-green text-[10px] mb-3 text-center">
            RAPPORT DE PERFORMANCE
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div className="text-gray-400">Score brut:</div>
            <div className="text-white text-right">{state.score}</div>
            <div className="text-gray-400">Niveau atteint:</div>
            <div className="text-white text-right">{state.level}</div>
            <div className="text-gray-400">Clients servis:</div>
            <div className="text-white text-right">{state.clientsServed}</div>
            <div className="text-gray-400">Clients perdus:</div>
            <div className="text-white text-right">{state.clientsLost}</div>
            <div className="text-gray-400">Combo max:</div>
            <div className="text-white text-right">x{state.maxCombo}</div>
            <div className="text-gray-400">Temps:</div>
            <div className="text-white text-right">{minutes}:{seconds.toString().padStart(2, "0")}</div>
          </div>

          {/* Stamp overlay */}
          {(phase === "stamp" || phase === "deductions" || phase === "final") && stampVisible && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ animation: "stamp-slam 0.5s ease-out forwards" }}
            >
              <div className="text-stamp-red border-4 border-stamp-red px-4 py-2 rotate-[-8deg] text-sm font-bold opacity-80">
                À VÉRIFIER
              </div>
            </div>
          )}
        </div>

        {/* Deductions */}
        {(phase === "deductions" || phase === "final") && (
          <div className="space-y-2 mb-4">
            <h4 className="text-[9px] text-neon-yellow text-center">
              AJUSTEMENTS MINISTÉRIELS
            </h4>
            {state.ministryDeductions.slice(0, visibleDeductions).map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-start bg-red-900/20 border border-red-800/30 px-3 py-2 rounded text-[8px] animate-[fadeIn_0.3s_ease-out]"
              >
                <span className="text-gray-300 flex-1 mr-2">{d.reason}</span>
                <span className="text-red-400 whitespace-nowrap">-{d.amount} ({d.percentage}%)</span>
              </div>
            ))}
          </div>
        )}

        {/* Final score */}
        {phase === "final" && (
          <div className="text-center space-y-4">
            <div className="bg-black/40 p-4 rounded">
              <div className="text-[8px] text-gray-400 mb-1">
                Score approuvé par le Ministère
              </div>
              <div className="text-2xl text-neon-green text-glow-green">
                {state.finalScore}
              </div>
            </div>

            <p className="text-[9px] text-neon-pink italic">{conclusion}</p>

            {/* Earned badges */}
            {state.earnedBadges.length > 0 && (
              <div>
                <div className="text-[8px] text-gray-400 mb-2">Badges obtenus:</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {state.earnedBadges.map((badge) => (
                    <div key={badge.id} className="text-center" title={badge.nameFr}>
                      <span className="text-lg">{badge.icon}</span>
                      <div className="text-[7px] text-gray-400">{badge.nameFr}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onReplay}
              className="btn-arcade bg-neon-green text-dark border-neon-green hover:bg-neon-yellow text-xs mt-4"
            >
              REJOUER (DÉFIE LE MINISTÈRE)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
