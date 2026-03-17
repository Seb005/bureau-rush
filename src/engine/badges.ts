import type { GameState } from "./gameState";

export interface Badge {
  id: string;
  nameFr: string;
  condition: string;
  icon: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "first-coffee", nameFr: "Premier café", condition: "Compléter le niveau 1", icon: "☕" },
  { id: "cv-machine", nameFr: "Machine à CV", condition: "Écrire 10 CV en une partie", icon: "📄" },
  { id: "pro-bureaucrat", nameFr: "Bureaucrate pro", condition: "5 formulaires sans erreur", icon: "📋" },
  { id: "friday-survivor", nameFr: "Survivant du vendredi", condition: "Atteindre le niveau 9", icon: "🏆" },
  { id: "zen-master", nameFr: "Maître zen", condition: "20 clients sans en perdre un", icon: "🧘" },
  { id: "legendary-combo", nameFr: "Combo légendaire", condition: "Atteindre combo x10", icon: "🔥" },
  { id: "auto-answerer", nameFr: "Standardiste", condition: "Répondre à 10 appels", icon: "☎️" },
  { id: "future-director", nameFr: "Futur directeur", condition: "Score final de 5 000+", icon: "👔" },
  { id: "network-legend", nameFr: "Légende du réseau", condition: "Score final de 15 000+", icon: "🌟" },
  { id: "burnout-prevented", nameFr: "Burnout prévenu", condition: "Utiliser 3 congés santé et survivre", icon: "🛡️" },
  { id: "marathoner", nameFr: "Marathonien", condition: "Jouer 10 parties", icon: "🏃" },
  { id: "system-victim", nameFr: "Victime du système", condition: "Perdre 100% du score au ministère", icon: "📜" },
  { id: "resilient", nameFr: "Résilient", condition: "Score > 0 malgré 5 déductions", icon: "💪" },
];

export function checkBadges(state: GameState): Badge[] {
  const earned: Badge[] = [];

  if (state.level >= 2) earned.push(ALL_BADGES[0]); // first-coffee
  if (state.level >= 9) earned.push(ALL_BADGES[3]); // friday-survivor
  if (state.maxCombo >= 10) earned.push(ALL_BADGES[5]); // legendary-combo
  if (state.sickLeavesRemaining === 0 && state.lives > 0) earned.push(ALL_BADGES[9]); // burnout-prevented
  if (state.finalScore === 0 && state.score > 0) earned.push(ALL_BADGES[11]); // system-victim
  if (state.finalScore > 0 && state.ministryDeductions.length >= 5) earned.push(ALL_BADGES[12]); // resilient
  if (state.finalScore >= 5000) earned.push(ALL_BADGES[7]); // future-director
  if (state.finalScore >= 15000) earned.push(ALL_BADGES[8]); // network-legend
  if (state.clientsLost === 0 && state.clientsServed >= 20) earned.push(ALL_BADGES[4]); // zen-master

  return earned;
}
