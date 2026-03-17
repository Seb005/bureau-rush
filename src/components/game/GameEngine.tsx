"use client";

import { useReducer, useEffect, useRef, useCallback, useState } from "react";
import { gameReducer, INITIAL_STATE, type GamePhase } from "@/engine/gameState";
import { getLevelConfig } from "@/engine/levelConfig";
import HUD from "./HUD";
import WaitingRoom from "./WaitingRoom";
import DocumentFiller from "./DocumentFiller";
import SickLeaveButton from "./SickLeaveButton";
import EventOverlay from "./EventOverlay";
import GameOver from "./GameOver";
import PixelAvatar from "@/components/avatar/PixelAvatar";

// Lazy-load audio modules
let audioImported = false;
let SFX: typeof import("@/audio/sfx").SFX | null = null;
let audioManager: typeof import("@/audio/AudioManager") | null = null;
let chiptuneModule: typeof import("@/audio/chiptuneLayers") | null = null;

async function loadAudio() {
  if (audioImported) return;
  audioImported = true;
  const [sfxMod, amMod, ctMod] = await Promise.all([
    import("@/audio/sfx"),
    import("@/audio/AudioManager"),
    import("@/audio/chiptuneLayers"),
  ]);
  SFX = sfxMod.SFX;
  audioManager = amMod;
  chiptuneModule = ctMod;
}

export default function GameEngine() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const sickLeaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseRef = useRef<GamePhase>("menu");
  const prevLevelRef = useRef(1);
  const prevLivesRef = useRef(3);
  const prevComboRef = useRef(0);
  const [muted, setMuted] = useState(false);

  // Audio effects based on state changes
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const prevLevel = prevLevelRef.current;
    const prevLives = prevLivesRef.current;
    const prevCombo = prevComboRef.current;

    // Phase transitions
    if (state.phase !== prevPhase) {
      if (state.phase === "playing" && prevPhase === "menu") {
        chiptuneModule?.startMusic(state.level);
      } else if (state.phase === "sickLeave") {
        SFX?.sickLeaveActivate();
        chiptuneModule?.pauseMusic();
      } else if (state.phase === "playing" && prevPhase === "sickLeave") {
        chiptuneModule?.resumeMusic();
      } else if (state.phase === "gameOver") {
        chiptuneModule?.stopMusic();
        SFX?.gameOver();
      } else if (state.phase === "playing" && (prevPhase === "gameOver" || prevPhase === "ministrySequence")) {
        chiptuneModule?.startMusic(state.level);
      }
    }

    // Level up
    if (state.level > prevLevel && state.phase === "playing") {
      SFX?.levelComplete();
      chiptuneModule?.updateTempo(state.level);
    }

    // Life lost
    if (state.lives < prevLives) {
      SFX?.lifeLost();
    }

    // Combo up
    if (state.combo > prevCombo && state.combo >= 2) {
      SFX?.comboUp();
    }

    prevPhaseRef.current = state.phase;
    prevLevelRef.current = state.level;
    prevLivesRef.current = state.lives;
    prevComboRef.current = state.combo;
  }, [state.phase, state.level, state.lives, state.combo]);

  // Game loop
  useEffect(() => {
    if (state.phase !== "playing") {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    lastTickRef.current = Date.now();
    tickRef.current = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      dispatch({ type: "TICK", deltaSeconds: Math.min(deltaSeconds, 0.2) });
    }, 100);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.phase]);

  // Sick leave timer
  useEffect(() => {
    if (state.phase !== "sickLeave") {
      if (sickLeaveTimerRef.current) {
        clearInterval(sickLeaveTimerRef.current);
        sickLeaveTimerRef.current = null;
      }
      return;
    }

    const startTime = Date.now();
    sickLeaveTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 5) {
        dispatch({ type: "END_SICK_LEAVE" });
      }
    }, 100);

    return () => {
      if (sickLeaveTimerRef.current) clearInterval(sickLeaveTimerRef.current);
    };
  }, [state.phase]);

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && state.phase === "playing") {
        dispatch({ type: "USE_SICK_LEAVE" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [state.phase]);

  const handleStartMinistry = useCallback(() => {
    dispatch({ type: "START_MINISTRY_SEQUENCE" });
  }, []);

  const handleStartGame = useCallback(async () => {
    await loadAudio();
    await audioManager?.ensureAudioStarted();
    dispatch({ type: "START_GAME" });
  }, []);

  const handleFillStep = useCallback(() => {
    SFX?.buttonClick();
    dispatch({ type: "FILL_STEP" });
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuted = audioManager?.toggleMute() ?? false;
    setMuted(newMuted);
  }, []);

  const config = getLevelConfig(state.level);

  // Menu screen
  if (state.phase === "menu") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark vignette p-4">
        <h1 className="text-2xl text-neon-green text-glow-green mb-4">BUREAU RUSH</h1>
        <p className="text-[9px] text-neon-cyan mb-2">La folie de l&apos;employabilité</p>
        <p className="text-[8px] text-gray-400 mb-8 max-w-xs text-center">
          Les clients arrivent, les documents s&apos;empilent.
          <br />Survie à la bureaucratie!
        </p>
        <button
          onClick={handleStartGame}
          className="btn-arcade bg-neon-green text-dark border-neon-green hover:bg-neon-yellow text-sm"
        >
          JOUER
        </button>
      </div>
    );
  }

  // Game Over / Ministry sequence
  if (state.phase === "gameOver" || state.phase === "ministrySequence") {
    return (
      <GameOver
        state={state}
        onReplay={handleStartGame}
        onStartMinistry={handleStartMinistry}
      />
    );
  }

  const isPlaying = state.phase === "playing";
  const isSickLeave = state.phase === "sickLeave";

  return (
    <div className="flex flex-col h-screen bg-dark vignette overflow-hidden relative">
      {/* HUD */}
      <HUD state={state} />

      {/* Mute button */}
      <button
        onClick={handleToggleMute}
        className="absolute top-2 right-2 z-40 text-lg opacity-60 hover:opacity-100 transition-opacity"
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Level banner */}
      {state.showLevelBanner && (
        <div className="absolute top-12 left-0 right-0 z-30 flex justify-center">
          <div className="bg-dark-blue border-2 border-neon-yellow px-6 py-3 rounded-lg text-center animate-[fadeIn_0.3s]">
            <div className="text-neon-yellow text-xs">NIVEAU {state.level}</div>
            <div className="text-[8px] text-gray-300 mt-1">{config.themeFr}</div>
          </div>
        </div>
      )}

      {/* Active power-ups indicator */}
      {state.activePowerUps.length > 0 && (
        <div className="flex gap-2 justify-center py-1 bg-dark/50">
          {state.activePowerUps.map((ap) => (
            <div
              key={ap.powerUp.id}
              className="text-[8px] text-neon-yellow flex items-center gap-1"
            >
              <span>{ap.powerUp.icon}</span>
              <span>{Math.ceil(ap.timeRemaining)}s</span>
            </div>
          ))}
        </div>
      )}

      {/* Status banners */}
      {state.networkOutageActive && (
        <div className="bg-red-900/40 text-center py-1 text-[8px] text-red-300">
          📡 PANNE RÉSEAU — Documents ralentis!
        </div>
      )}
      {state.meetingBlockActive && (
        <div className="bg-yellow-900/40 text-center py-1 text-[8px] text-yellow-300">
          🗓️ RÉUNION SURPRISE — Bureau bloqué {Math.ceil(state.meetingBlockTimer)}s
        </div>
      )}

      {/* Zone mode visual effect */}
      {state.inZoneMode && (
        <div className="absolute inset-0 z-20 pointer-events-none border-4 border-neon-yellow/30 animate-pulse rounded-lg" />
      )}

      {/* Main game area */}
      <div className="flex-1 flex flex-col relative"
        style={{
          backgroundImage: "url(/bureau-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay on the background for readability */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Waiting room */}
          <div className="bg-black/50 backdrop-blur-sm">
            <div className="text-[8px] text-gray-400 text-center pt-1">SALLE D&apos;ATTENTE</div>
            <WaitingRoom
              clients={state.waitingClients}
              onSelectClient={(id) => {
                SFX?.buttonClick();
                dispatch({ type: "SELECT_CLIENT", clientId: id });
              }}
              disabled={!isPlaying || !!state.activeClient || state.meetingBlockActive}
            />
          </div>

          {/* Desk area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {state.activeClient && state.activeDocument ? (
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-neon-cyan/20">
                {/* Client being served */}
                <div className="flex items-center gap-3 mb-3">
                  <PixelAvatar seed={state.activeClient.seed} size={36} animated="none" />
                  <div className="text-[9px] text-gray-300">
                    Doc {state.activeClient.currentDocIndex + 1}/{state.activeClient.documents.length}
                  </div>
                </div>

                <DocumentFiller
                  document={state.activeDocument}
                  onFillStep={handleFillStep}
                  coffeeSpillActive={state.coffeeSpillActive}
                  disabled={!isPlaying || state.meetingBlockActive}
                />
              </div>
            ) : (
              <div className="text-gray-500 text-[10px] text-center">
                {state.meetingBlockActive
                  ? "🗓️ En réunion..."
                  : "Cliquez sur un client pour le servir"}
              </div>
            )}
          </div>

          {/* Sick leave button */}
          <div className="flex justify-center pb-4">
            <SickLeaveButton
              remaining={state.sickLeavesRemaining}
              cooldown={state.sickLeaveCooldown}
              onUse={() => dispatch({ type: "USE_SICK_LEAVE" })}
              disabled={!isPlaying}
            />
          </div>
        </div>
      </div>

      {/* Pending power-up notification */}
      {state.pendingPowerUp && isPlaying && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-dark-blue border-2 border-neon-yellow rounded-lg p-4 text-center animate-bounce">
          <div className="text-2xl mb-1">{state.pendingPowerUp.icon}</div>
          <div className="text-[9px] text-neon-yellow mb-1">{state.pendingPowerUp.nameFr}</div>
          <div className="text-[8px] text-gray-300 mb-3">{state.pendingPowerUp.description}</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                SFX?.powerUp();
                dispatch({ type: "COLLECT_POWER_UP" });
              }}
              className="btn-arcade bg-neon-green text-dark border-neon-green text-[8px] py-1 px-3"
            >
              PRENDRE
            </button>
            <button
              onClick={() => dispatch({ type: "DISMISS_POWER_UP" })}
              className="btn-arcade bg-transparent text-gray-400 border-gray-600 text-[8px] py-1 px-3"
            >
              NON
            </button>
          </div>
        </div>
      )}

      {/* Event overlay */}
      {state.activeEvent && (
        <EventOverlay
          event={state.activeEvent}
          clickCount={state.eventClickCount}
          onRespond={(success) => dispatch({ type: "RESPOND_EVENT", success })}
          onEventClick={() => dispatch({ type: "EVENT_CLICK" })}
        />
      )}

      {/* Sick leave overlay */}
      {isSickLeave && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-900/80">
          <div className="text-center">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-xl text-blue-200 mb-2">CONGÉ SANTÉ</h2>
            <div className="text-3xl text-white mb-4">
              {Math.ceil(state.sickLeaveTimer || 5)}
            </div>
            <p className="text-[9px] text-blue-300 italic">
              La conseillère se repose... le bureau peut attendre.
            </p>
          </div>
        </div>
      )}

      {/* Coffee spill indicator */}
      {state.coffeeSpillActive && (
        <div className="absolute top-16 right-2 text-[8px] text-neon-orange z-20">
          ☕ Clavier mouillé! {Math.ceil(state.coffeeSpillTimer)}s
        </div>
      )}
    </div>
  );
}
