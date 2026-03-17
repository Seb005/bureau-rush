"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GameEvent } from "@/engine/events";
import { FOUNDER_QUESTIONS, INTERN_QUESTIONS } from "@/engine/events";

interface EventOverlayProps {
  event: GameEvent;
  clickCount: number;
  onRespond: (success: boolean) => void;
  onEventClick: () => void;
}

export default function EventOverlay({
  event,
  clickCount,
  onRespond,
  onEventClick,
}: EventOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(event.timeLimit);
  const respondedRef = useRef(false);
  const onRespondRef = useRef(onRespond);
  onRespondRef.current = onRespond;

  const [quizQuestion] = useState(() => {
    if (event.id === "founder-visit") {
      return FOUNDER_QUESTIONS[Math.floor(Math.random() * FOUNDER_QUESTIONS.length)];
    }
    if (event.id === "intern-questions") {
      return INTERN_QUESTIONS[Math.floor(Math.random() * INTERN_QUESTIONS.length)];
    }
    return null;
  });

  const handleRespond = useCallback((success: boolean) => {
    if (respondedRef.current) return;
    respondedRef.current = true;
    onRespondRef.current(success);
  }, []);

  useEffect(() => {
    if (event.timeLimit <= 0) return;
    respondedRef.current = false;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 0.1;
        if (next <= 0) {
          clearInterval(interval);
          // Use setTimeout to avoid calling dispatch during render
          setTimeout(() => handleRespond(false), 0);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [event.id, event.timeLimit, handleRespond]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70">
      <div className="bg-dark-blue border-2 border-neon-yellow p-6 rounded-lg max-w-sm text-center shadow-[0_0_20px_rgba(255,230,0,0.3)]">
        <div className="text-3xl mb-3">{event.icon}</div>
        <h3 className="text-neon-yellow text-xs mb-2">{event.nameFr}</h3>
        <p className="text-[9px] text-gray-300 mb-4">{event.description}</p>

        {/* Timer bar */}
        {event.timeLimit > 0 && (
          <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-neon-yellow transition-all rounded-full"
              style={{ width: `${(timeLeft / event.timeLimit) * 100}%` }}
            />
          </div>
        )}

        {/* Phone ringing */}
        {event.id === "phone-ringing" && (
          <button
            onClick={() => handleRespond(true)}
            className="btn-arcade bg-neon-green text-dark border-neon-green text-xs animate-pulse"
          >
            📞 RÉPONDRE
          </button>
        )}

        {/* Printer jam */}
        {event.id === "printer-jam" && (
          <div>
            <button
              onClick={onEventClick}
              className="btn-arcade bg-neon-orange text-dark border-neon-orange text-xs active:scale-90"
            >
              🖨️ DÉBLOQUER ({clickCount}/10)
            </button>
            <div className="w-full h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-neon-orange transition-all rounded-full"
                style={{ width: `${(clickCount / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quiz (founder visit / intern) */}
        {quizQuestion && (
          <div>
            <p className="text-[10px] text-white mb-3">{quizQuestion.question}</p>
            <div className="flex flex-col gap-2">
              {quizQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleRespond(i === quizQuestion.correct)}
                  className="btn-arcade bg-dark text-neon-cyan border-neon-cyan text-[9px] hover:bg-neon-cyan hover:text-dark"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
