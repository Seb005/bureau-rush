export interface PowerUp {
  id: string;
  nameFr: string;
  description: string;
  duration: number; // seconds (0 = instant)
  icon: string;
}

export const POWER_UP_TYPES: PowerUp[] = [
  { id: "strong-coffee", nameFr: "Café fort", description: "Documents 50% plus rapides!", duration: 15, icon: "☕" },
  { id: "colleague-reinforcement", nameFr: "Renfort collègue", description: "Un collègue sert 1 client!", duration: 0, icon: "🤝" },
  { id: "turbo-wifi", nameFr: "Turbo Wi-Fi", description: "+3s sur tous les timers!", duration: 0, icon: "📶" },
  { id: "motivational-playlist", nameFr: "Playlist motivante", description: "Patience réduite 50% moins vite!", duration: 20, icon: "🎵" },
  { id: "new-photocopier", nameFr: "Nouveau photocopieur", description: "Documents ont 1 étape de moins!", duration: 30, icon: "🖨️" },
];

export function shouldSpawnPowerUp(
  level: number,
  combo: number,
  clientsServedThisLevel: number,
  deltaSeconds: number
): PowerUp | null {
  // Random power-ups: ~1.5% chance per second
  if (Math.random() < 0.015 * deltaSeconds) {
    // Filter by availability
    const available = POWER_UP_TYPES.filter((pu) => {
      if (pu.id === "motivational-playlist" && level < 3) return false;
      if (pu.id === "new-photocopier" && level < 5) return false;
      if (pu.id === "colleague-reinforcement") return false; // combo-triggered only
      if (pu.id === "turbo-wifi") return false; // level-triggered only
      return true;
    });
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
  }
  return null;
}
