export interface LevelConfig {
  level: number;
  theme: string;
  themeFr: string;
  maxClients: number;
  clientArrivalInterval: number; // seconds between arrivals
  basePatience: number; // seconds
  clientsToAdvance: number; // clients to serve before next level
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, theme: "Quiet Monday", themeFr: "Lundi tranquille", maxClients: 2, clientArrivalInterval: 6, basePatience: 20, clientsToAdvance: 4 },
  { level: 2, theme: "Quiet Monday", themeFr: "Lundi tranquille", maxClients: 3, clientArrivalInterval: 5.5, basePatience: 18, clientsToAdvance: 5 },
  { level: 3, theme: "Busy Tuesday", themeFr: "Mardi occupé", maxClients: 3, clientArrivalInterval: 5, basePatience: 16, clientsToAdvance: 6 },
  { level: 4, theme: "Busy Tuesday", themeFr: "Mardi occupé", maxClients: 4, clientArrivalInterval: 4.5, basePatience: 15, clientsToAdvance: 7 },
  { level: 5, theme: "Crazy Wednesday", themeFr: "Mercredi fou", maxClients: 4, clientArrivalInterval: 4, basePatience: 13, clientsToAdvance: 8 },
  { level: 6, theme: "Crazy Wednesday", themeFr: "Mercredi fou", maxClients: 5, clientArrivalInterval: 3.5, basePatience: 12, clientsToAdvance: 9 },
  { level: 7, theme: "Critical Thursday", themeFr: "Jeudi critique", maxClients: 5, clientArrivalInterval: 3, basePatience: 11, clientsToAdvance: 10 },
  { level: 8, theme: "Critical Thursday", themeFr: "Jeudi critique", maxClients: 5, clientArrivalInterval: 2.8, basePatience: 10, clientsToAdvance: 11 },
  { level: 9, theme: "End-of-Quarter Friday", themeFr: "Vendredi fin de trimestre", maxClients: 5, clientArrivalInterval: 2.5, basePatience: 9, clientsToAdvance: 12 },
  { level: 10, theme: "End-of-Quarter Friday", themeFr: "Vendredi fin de trimestre", maxClients: 5, clientArrivalInterval: 2.2, basePatience: 8, clientsToAdvance: 13 },
];

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 10) {
    return LEVEL_CONFIGS[level - 1];
  }
  // Survival mode (level 11+)
  return {
    level,
    theme: "Survival Mode",
    themeFr: "Mode survie",
    maxClients: 5,
    clientArrivalInterval: Math.max(1.5, 2.2 - (level - 10) * 0.1),
    basePatience: Math.max(6, 8 - (level - 10) * 0.3),
    clientsToAdvance: 13 + (level - 10),
  };
}
