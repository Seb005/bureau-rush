"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getGameRecords, getBestScore, getMaxLevel, getTotalGamesPlayed, getUnlockedBadges } from "@/lib/storage";
import { ALL_BADGES } from "@/engine/badges";
import type { GameRecord } from "@/lib/storage";

export default function ScoresPage() {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    setRecords(getGameRecords());
    setBestScore(getBestScore());
    setMaxLevel(getMaxLevel());
    setTotalGames(getTotalGamesPlayed());
    setUnlockedBadges(getUnlockedBadges());
  }, []);

  return (
    <div className="min-h-screen bg-dark vignette p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl text-neon-cyan text-glow-cyan text-center mb-6">
          MES SCORES
        </h1>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-dark-blue rounded-lg p-3 text-center border border-neon-cyan/20">
            <div className="text-neon-green text-sm">{bestScore}</div>
            <div className="text-[7px] text-gray-400 mt-1">MEILLEUR SCORE</div>
          </div>
          <div className="bg-dark-blue rounded-lg p-3 text-center border border-neon-cyan/20">
            <div className="text-neon-cyan text-sm">{maxLevel}</div>
            <div className="text-[7px] text-gray-400 mt-1">NIVEAU MAX</div>
          </div>
          <div className="bg-dark-blue rounded-lg p-3 text-center border border-neon-cyan/20">
            <div className="text-neon-yellow text-sm">{totalGames}</div>
            <div className="text-[7px] text-gray-400 mt-1">PARTIES</div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h2 className="text-[10px] text-neon-yellow text-center mb-3">BADGES</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ALL_BADGES.map((badge) => {
              const unlocked = unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`text-center p-2 rounded ${unlocked ? "bg-dark-blue border border-neon-yellow/30" : "bg-gray-900/50 opacity-30"}`}
                  title={`${badge.nameFr}: ${badge.condition}`}
                >
                  <div className="text-lg">{badge.icon}</div>
                  <div className="text-[6px] text-gray-400 mt-1 leading-tight">{badge.nameFr}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game history */}
        <h2 className="text-[10px] text-neon-pink text-center mb-3">HISTORIQUE</h2>
        {records.length === 0 ? (
          <p className="text-[9px] text-gray-500 text-center">Aucune partie jouée encore...</p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 20).map((record, i) => {
              const date = new Date(record.date);
              const dateStr = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
              return (
                <div
                  key={i}
                  className="bg-dark-blue/50 border border-gray-700/30 rounded px-3 py-2 flex items-center justify-between"
                >
                  <div>
                    <div className="text-[9px] text-gray-300">
                      <span className="text-neon-green">{record.finalScore}</span>
                      <span className="text-gray-600 mx-1">|</span>
                      <span className="text-gray-400">Niv. {record.level}</span>
                      <span className="text-gray-600 mx-1">|</span>
                      <span className="text-gray-400">{record.clientsServed} clients</span>
                    </div>
                    {record.deductions.length > 0 && (
                      <div className="text-[7px] text-red-400/60 mt-1 truncate max-w-[250px]">
                        &quot;{record.deductions[0].reason}&quot;
                      </div>
                    )}
                  </div>
                  <div className="text-[7px] text-gray-600 ml-2 whitespace-nowrap">{dateStr}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/"
            className="btn-arcade bg-transparent text-neon-green border-neon-green hover:bg-neon-green hover:text-dark text-xs"
          >
            RETOUR
          </Link>
        </div>
      </div>
    </div>
  );
}
