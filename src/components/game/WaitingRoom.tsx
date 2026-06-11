"use client";

import type { Client } from "@/engine/clientGenerator";
import PixelAvatar from "@/components/avatar/PixelAvatar";

interface WaitingRoomProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  disabled: boolean;
}

function PixelChair({ occupied }: { occupied: boolean }) {
  return (
    <svg
      viewBox="0 0 14 10"
      width={64}
      height={45}
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* Backrest only visible on empty chairs */}
      {!occupied && (
        <>
          <rect x="3" y="0" width="8" height="1" fill="#37474F" />
          <rect x="3" y="1" width="1" height="3" fill="#37474F" />
          <rect x="10" y="1" width="1" height="3" fill="#37474F" />
          <rect x="4" y="1" width="6" height="3" fill="#2c3a45" />
        </>
      )}
      <rect x="1" y="4" width="12" height="2" fill="#455A64" />
      <rect x="2" y="6" width="1.5" height="4" fill="#263238" />
      <rect x="10.5" y="6" width="1.5" height="4" fill="#263238" />
    </svg>
  );
}

export default function WaitingRoom({ clients, onSelectClient, disabled }: WaitingRoomProps) {
  return (
    <div className="flex items-end gap-3 sm:gap-5 justify-center p-2 pb-1 min-h-[150px]">
      {clients.map((client) => {
        const patienceRatio = client.patience / client.maxPatience;
        const isImpatient = patienceRatio < 0.3;
        const isUrgent = patienceRatio < 0.15;
        const request = client.requests[client.currentDocIndex];

        return (
          <button
            key={client.id}
            onClick={() => !disabled && onSelectClient(client.id)}
            disabled={disabled}
            className={`
              relative flex flex-col items-center gap-1 p-1 pt-4 rounded transition-all
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/10 active:scale-95"}
              ${isUrgent ? "animate-pulse" : ""}
            `}
          >
            {/* Speech bubble: the client's request */}
            <div
              className={`
                absolute -top-2 left-1/2 -translate-x-1/2 z-10
                bg-white text-dark rounded px-1.5 py-1 text-base leading-none
                ${client.isGhost ? "opacity-60" : ""}
              `}
            >
              {client.isGhost && client.ghostTimer < 2.5 ? "👻" : request?.icon}
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
            </div>

            <div className="relative w-16 h-20 flex items-end justify-center">
              <PixelChair occupied />
              <PixelAvatar
                seed={client.seed}
                size={64}
                animated={isImpatient ? "fidget" : "sway"}
                mood={isUrgent ? "angry" : isImpatient ? "impatient" : "happy"}
                ghost={client.isGhost}
                className="relative z-[1]"
              />
            </div>

            {/* Patience bar */}
            <div className="w-14 h-2 bg-gray-700 rounded-full overflow-hidden">
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
            <div className="flex gap-0.5 text-[11px]">
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

      {/* Empty chairs */}
      {[...Array(Math.max(0, 5 - clients.length))].map((_, i) => (
        <div
          key={`empty-${i}`}
          className="relative w-16 h-[122px] flex items-end justify-center opacity-60"
        >
          <PixelChair occupied={false} />
        </div>
      ))}
    </div>
  );
}
