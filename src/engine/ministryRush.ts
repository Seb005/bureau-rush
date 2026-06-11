export type MinistryRushKind = "reddition" | "rapport" | "commandite";

export interface MinistryRush {
  kind: MinistryRushKind;
  stepsRequired: number;
  stepsDone: number;
  timeRemaining: number;
  totalTime: number;
}

export interface MinistryRushInfo {
  kind: MinistryRushKind;
  nameFr: string;
  description: string;
  buttonLabel: string;
  successMessage: string;
  failMessage: string;
  icon: string;
}

export const MINISTRY_RUSH_INFO: Record<MinistryRushKind, MinistryRushInfo> = {
  reddition: {
    kind: "reddition",
    nameFr: "REDDITION DE COMPTES!",
    description: "Le ministère exige ses chiffres. MAINTENANT.",
    buttonLabel: "📑 COMPILER",
    successMessage: "Le ministère est satisfait... pour l'instant.",
    failMessage: "Reddition en retard! Pénalité ministérielle.",
    icon: "📑",
  },
  rapport: {
    kind: "rapport",
    nameFr: "RAPPORT TRIMESTRIEL!",
    description: "Le rapport était dû hier. Évidemment.",
    buttonLabel: "📊 RÉDIGER",
    successMessage: "Rapport déposé! Personne ne le lira.",
    failMessage: "Rapport manquant! Le ministère sévit.",
    icon: "📊",
  },
  commandite: {
    kind: "commandite",
    nameFr: "HYDRO MENACE DE COUPER!",
    description: "Trouvez des commandites pour payer la facture!",
    buttonLabel: "💡 SOLLICITER",
    successMessage: "La caisse pop a commandité! Lumières sauvées.",
    failMessage: "Pas de commandite... on travaille à la chandelle.",
    icon: "💡",
  },
};

const RUSH_ROTATION: MinistryRushKind[] = ["reddition", "commandite", "rapport"];

// A rush fires when entering even levels from 4 up (4, 6, 8, 10, then every survival level)
export function shouldStartRush(newLevel: number): boolean {
  if (newLevel >= 11) return true; // survival mode: every level
  return newLevel >= 4 && newLevel % 2 === 0;
}

export function createRush(level: number): MinistryRush {
  const kind = RUSH_ROTATION[Math.floor(level / 2) % RUSH_ROTATION.length];
  return {
    kind,
    stepsRequired: Math.min(8 + level, 22),
    stepsDone: 0,
    timeRemaining: 12,
    totalTime: 12,
  };
}

export function rushReward(level: number): number {
  return 50 * level;
}

// Failure costs 15% of the current score
export const RUSH_FAIL_PENALTY = 0.15;
