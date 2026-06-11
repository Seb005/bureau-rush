"use client";

import { useState, useCallback } from "react";
import type { ActiveDocument } from "@/engine/gameState";
import type { Client } from "@/engine/clientGenerator";
import { getAvailableServices, pickPhrase } from "@/engine/serviceRequests";

interface DocumentFillerProps {
  document: ActiveDocument;
  client: Client;
  level: number;
  onServeAction: (serviceId: string, correct: boolean) => void;
  coffeeSpillActive: boolean;
  disabled: boolean;
}

export default function DocumentFiller({
  document,
  client,
  level,
  onServeAction,
  coffeeSpillActive,
  disabled,
}: DocumentFillerProps) {
  const timeRatio = document.timeRemaining / document.type.timeLimit;
  const isUrgent = timeRatio < 0.3;
  const [wrongFlash, setWrongFlash] = useState(false);

  const request = client.requests[client.currentDocIndex];
  const phrase = request ? pickPhrase(request, client.seed + client.currentDocIndex) : "";
  const services = getAvailableServices(level);

  const handleClick = useCallback(
    (serviceId: string) => {
      if (disabled) return;
      const correct = !!request && serviceId === request.id;
      if (!correct) {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 250);
      }
      onServeAction(serviceId, correct);
    },
    [disabled, request, onServeAction]
  );

  // Coffee spill effect: the whole button grid wobbles
  const spillClass = coffeeSpillActive ? "animate-[coffeeWobble_0.3s_ease-in-out_infinite]" : "";

  return (
    <div className={`flex flex-col items-center gap-3 p-2 w-full ${wrongFlash ? "animate-wrong-shake" : ""}`}>
      {/* Client speech bubble: what they actually need */}
      <div className="relative bg-white text-dark rounded-lg px-4 py-2.5 max-w-[360px] text-center">
        <div className="text-[10px] sm:text-[11px] leading-relaxed">«{phrase}»</div>
        <div className="text-[11px] sm:text-xs mt-1 font-bold">
          {request?.icon} {request?.nameFr}
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
      </div>

      {/* Document header + steps */}
      <div className="flex items-center gap-2 text-[11px] mt-1">
        <span className="text-xl">{document.type.icon}</span>
        <span className="text-neon-cyan">{document.type.nameFr}</span>
        <span className="text-gray-400">
          {document.stepsCompleted}/{document.type.steps}
        </span>
      </div>

      {/* Progress bar (steps) */}
      <div className="w-full max-w-[400px]">
        <div className="flex gap-1">
          {[...Array(document.type.steps)].map((_, i) => (
            <div
              key={i}
              className={`h-4 flex-1 rounded-sm transition-all duration-200 ${
                i < document.stepsCompleted
                  ? "bg-neon-green shadow-[0_0_6px_#39FF14]"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Time bar */}
      <div className="w-full max-w-[400px] h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all rounded-full ${
            isUrgent ? "bg-red-500 animate-pulse" : "bg-neon-cyan"
          }`}
          style={{ width: `${Math.max(0, timeRatio) * 100}%` }}
        />
      </div>

      {/* Service buttons: press the one matching the client's request */}
      <div className={`grid grid-cols-3 gap-2 sm:gap-3 mt-1 w-full max-w-[440px] ${spillClass}`}>
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleClick(service.id)}
            disabled={disabled}
            className={`
              btn-arcade text-[9px] sm:text-[10px] py-3 px-2 w-full leading-tight
              ${disabled
                ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                : "bg-dark text-neon-green border-neon-green/60 hover:bg-neon-green hover:text-dark active:scale-90"
              }
            `}
          >
            <span className="block text-xl mb-1">{service.icon}</span>
            {service.nameFr}
          </button>
        ))}
      </div>

      {/* Points preview */}
      <div className="text-[9px] text-gray-500">
        +{document.type.points} pts — mauvais bouton: -0.8s!
      </div>
    </div>
  );
}
