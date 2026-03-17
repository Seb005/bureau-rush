"use client";

import type { Client } from "@/engine/clientGenerator";
import PixelAvatar from "@/components/avatar/PixelAvatar";

interface WaitingRoomProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  disabled: boolean;
}

export default function WaitingRoom({ clients, onSelectClient, disabled }: WaitingRoomProps) {
  return (
    <div className="flex items-end gap-2 justify-center p-2 min-h-[100px]">
      {clients.map((client) => {
        const patienceRatio = client.patience / client.maxPatience;
        const isImpatient = patienceRatio < 0.3;
        const isUrgent = patienceRatio < 0.15;

        return (
          <button
            key={client.id}
            onClick={() => !disabled && onSelectClient(client.id)}
            disabled={disabled}
            className={`
              flex flex-col items-center gap-1 p-1 rounded transition-all
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/10 active:scale-95"}
              ${isUrgent ? "animate-pulse" : ""}
            `}
          >
            <PixelAvatar
              seed={client.seed}
              size={40}
              animated={isImpatient ? "fidget" : "sway"}
              className={isImpatient ? "hue-rotate-[340deg] saturate-150" : ""}
            />

            {/* Patience bar */}
            <div className="w-10 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  patienceRatio > 0.5
                    ? "bg-neon-green"
                    : patienceRatio > 0.25
                      ? "bg-neon-yellow"
                      : "bg-red-500"
                }`}
                style={{ width: `${patienceRatio * 100}%` }}
              />
            </div>

            {/* Document icons */}
            <div className="flex gap-0.5 text-[8px]">
              {client.documents.map((doc, i) => (
                <span
                  key={i}
                  className={i < client.currentDocIndex ? "opacity-30" : ""}
                >
                  {doc.icon}
                </span>
              ))}
            </div>
          </button>
        );
      })}

      {/* Empty slots */}
      {[...Array(Math.max(0, 5 - clients.length))].map((_, i) => (
        <div
          key={`empty-${i}`}
          className="w-12 h-16 border border-dashed border-gray-700/30 rounded flex items-center justify-center"
        >
          <span className="text-gray-700/30 text-xs">·</span>
        </div>
      ))}
    </div>
  );
}
