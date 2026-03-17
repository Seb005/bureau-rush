export interface GameEvent {
  id: string;
  nameFr: string;
  description: string;
  unlockLevel: number;
  timeLimit: number; // seconds to respond
  icon: string;
}

export const EVENT_TYPES: GameEvent[] = [
  { id: "phone-ringing", nameFr: "Téléphone qui sonne!", description: "Répondez dans les 5 secondes!", unlockLevel: 2, timeLimit: 5, icon: "📞" },
  { id: "printer-jam", nameFr: "Bourrage d'imprimante!", description: "Cliquez 10 fois rapidement!", unlockLevel: 3, timeLimit: 6, icon: "🖨️" },
  { id: "founder-visit", nameFr: "Visite du bailleur de fonds!", description: "Répondez aux questions!", unlockLevel: 4, timeLimit: 10, icon: "🏛️" },
  { id: "intern-questions", nameFr: "Le stagiaire a une question!", description: "Choisissez la bonne réponse!", unlockLevel: 2, timeLimit: 8, icon: "🧑‍🎓" },
  { id: "network-outage", nameFr: "Panne réseau!", description: "Les documents ralentissent pendant 10s...", unlockLevel: 5, timeLimit: 0, icon: "📡" },
  { id: "unexpected-meeting", nameFr: "Réunion surprise!", description: "Le bureau est bloqué 8 secondes!", unlockLevel: 6, timeLimit: 0, icon: "🗓️" },
  { id: "coffee-spill", nameFr: "Café renversé sur le clavier!", description: "Les boutons bougent pendant 5s!", unlockLevel: 4, timeLimit: 0, icon: "☕" },
];

export function shouldTriggerEvent(level: number, deltaSeconds: number): GameEvent | null {
  const availableEvents = EVENT_TYPES.filter((e) => e.unlockLevel <= level);
  if (availableEvents.length === 0) return null;

  // Base chance per tick: ~2% per second, doubles in survival mode
  const survivalMultiplier = level >= 11 ? 2 : 1;
  const chance = 0.02 * deltaSeconds * survivalMultiplier;

  if (Math.random() < chance) {
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
  }
  return null;
}

// Quiz data for founder visit
export const FOUNDER_QUESTIONS = [
  { question: "Combien de CJE au Québec?", options: ["85", "111", "150"], correct: 1 },
  { question: "Que veut dire CJE?", options: ["Centre Jeunesse-Emploi", "Carrefour Jeunesse-Emploi", "Comité Jeunesse-Emploi"], correct: 1 },
  { question: "Quelle est la mission des CJE?", options: ["Faire des rapports", "Accompagner les jeunes", "Organiser des réunions"], correct: 1 },
];

// Quiz data for intern questions
export const INTERN_QUESTIONS = [
  { question: "Comment on fait un plan d'action?", options: ["On copie le voisin", "Étape par étape avec le client", "On improvise"], correct: 1 },
  { question: "Le client veut un CV, on commence par?", options: ["La mise en page", "Les objectifs professionnels", "La photo"], correct: 1 },
  { question: "Un client frustré, on fait quoi?", options: ["On l'ignore", "Écoute active et empathie", "On appelle la police"], correct: 1 },
];
