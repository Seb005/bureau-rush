"use client";

interface SickLeaveButtonProps {
  remaining: number;
  cooldown: number;
  onUse: () => void;
  disabled: boolean;
}

export default function SickLeaveButton({
  remaining,
  cooldown,
  onUse,
  disabled,
}: SickLeaveButtonProps) {
  const canUse = remaining > 0 && cooldown <= 0 && !disabled;

  return (
    <button
      onClick={onUse}
      disabled={!canUse}
      className={`
        btn-arcade text-[10px] px-4 py-3 min-w-[140px]
        ${canUse
          ? "bg-blue-600 text-white border-blue-400 hover:bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
          : "bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed"
        }
      `}
      title="Pause le chaos pendant 5 secondes"
    >
      <span className="text-sm">😴</span> CONGÉ SANTÉ ({remaining}/3)
      {cooldown > 0 && (
        <div className="text-[8px] mt-1 text-gray-400">
          {Math.ceil(cooldown)}s
        </div>
      )}
    </button>
  );
}
