export interface GameRecord {
  date: string;
  rawScore: number;
  finalScore: number;
  level: number;
  clientsServed: number;
  clientsLost: number;
  maxCombo: number;
  playTimeSeconds: number;
  deductions: { reason: string; amount: number }[];
  badges: string[];
}

const STORAGE_KEY = "bureau-rush-scores";
const BADGES_KEY = "bureau-rush-badges";

export function saveGameRecord(record: GameRecord): void {
  const records = getGameRecords();
  records.unshift(record);
  // Keep last 50 games
  if (records.length > 50) records.length = 50;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // localStorage full or unavailable
  }
}

export function getGameRecords(): GameRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getBestScore(): number {
  const records = getGameRecords();
  return records.reduce((max, r) => Math.max(max, r.finalScore), 0);
}

export function getMaxLevel(): number {
  const records = getGameRecords();
  return records.reduce((max, r) => Math.max(max, r.level), 0);
}

export function getTotalGamesPlayed(): number {
  return getGameRecords().length;
}

export function getUnlockedBadges(): string[] {
  try {
    const data = localStorage.getItem(BADGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBadges(newBadgeIds: string[]): void {
  const existing = getUnlockedBadges();
  const merged = [...new Set([...existing, ...newBadgeIds])];
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable
  }
}
