export interface MinistryDeduction {
  reason: string;
  percentage: number;
  amount: number;
}

interface DeductionReason {
  reason: string;
  minPercent: number;
  maxPercent: number;
}

const MINISTRY_REASONS: DeductionReason[] = [
  { reason: "Rapports pas assez longs", minPercent: 5, maxPercent: 15 },
  { reason: "Formulaire rempli au stylo bleu au lieu de noir", minPercent: 8, maxPercent: 20 },
  { reason: "Le fonctionnaire n'a pas compris votre code NAS", minPercent: 10, maxPercent: 25 },
  { reason: "Certains clients rétroactivement annulés", minPercent: 15, maxPercent: 40 },
  { reason: "Votre signature dépasse la case", minPercent: 3, maxPercent: 12 },
  { reason: "Le code de programme a changé hier, rapports invalides", minPercent: 20, maxPercent: 50 },
  { reason: "L'informatique gouvernementale a perdu 3 de vos dossiers", minPercent: 10, maxPercent: 30 },
  { reason: "Utilisation du mauvais formulaire (v47b au lieu de 47c)", minPercent: 12, maxPercent: 35 },
  { reason: "Un client a appelé pour se plaindre qu'il pleuvait", minPercent: 5, maxPercent: 15 },
  { reason: "Vous servez les clients trop vite, c'est louche", minPercent: 15, maxPercent: 45 },
  { reason: "Le rapport trimestriel manque de graphiques circulaires", minPercent: 8, maxPercent: 20 },
  { reason: "N'avez pas rempli le formulaire pour remplir les formulaires", minPercent: 12, maxPercent: 30 },
  { reason: "Usage excessif de trombones", minPercent: 3, maxPercent: 10 },
  { reason: "Mauvaise police (Calibri 11 au lieu de 12!)", minPercent: 8, maxPercent: 20 },
  { reason: "Changement de définition de « client servi » en cours de quart", minPercent: 20, maxPercent: 50 },
  { reason: "Pénalité pour avoir tenté de comprendre le système", minPercent: 10, maxPercent: 25 },
  { reason: "Un client a trouvé un emploi. Vérification requise.", minPercent: 10, maxPercent: 30 },
  { reason: "Votre bureau est trop bien rangé, ça paraît suspect", minPercent: 5, maxPercent: 15 },
  { reason: "Le comité d'évaluation n'a pas été évalué", minPercent: 8, maxPercent: 20 },
  { reason: "Votre mot de passe a expiré pendant la reddition", minPercent: 10, maxPercent: 25 },
  { reason: "Le rapport a été reçu un mardi. On accepte seulement les jeudis.", minPercent: 12, maxPercent: 30 },
  { reason: "Le stagiaire a touché au photocopieur", minPercent: 5, maxPercent: 15 },
  { reason: "Vos résultats sont trop bons, ça ne cadre pas avec nos prévisions", minPercent: 15, maxPercent: 40 },
];

export function generateMinistryDeductions(rawScore: number, level: number): MinistryDeduction[] {
  const numDeductions = Math.min(5, 2 + Math.floor(level / 2));

  // Shuffle and pick reasons
  const shuffled = [...MINISTRY_REASONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numDeductions);

  return selected.map((reason) => {
    const percentage = reason.minPercent + Math.random() * (reason.maxPercent - reason.minPercent);
    const roundedPercent = Math.round(percentage);
    const amount = Math.round((rawScore * roundedPercent) / 100);
    return {
      reason: reason.reason,
      percentage: roundedPercent,
      amount,
    };
  });
}

export function getConclusion(finalScore: number, level: number): string {
  if (finalScore === 0) {
    return "Le ministère a effacé toute trace de votre travail. Félicitations.";
  }
  if (level >= 5) {
    return "Malgré la bureaucratie, vous tenez le coup. Respect.";
  }
  if (level >= 3) {
    return "Le ministère salue votre résilience. Presque.";
  }
  return "Votre dossier est en traitement. Prévoir 6 à 8 semaines.";
}
