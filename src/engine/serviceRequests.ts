export interface ServiceRequest {
  id: string;
  nameFr: string; // button label
  icon: string;
  phrases: string[]; // speech bubble lines
  unlockLevel: number;
}

export const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "rencontre",
    nameFr: "Rencontre",
    icon: "🤝",
    phrases: [
      "J'aimerais rencontrer quelqu'un...",
      "C'est ma première fois ici!",
      "On m'a dit de venir vous voir.",
    ],
    unlockLevel: 1,
  },
  {
    id: "cv",
    nameFr: "CV",
    icon: "📄",
    phrases: [
      "J'ai besoin d'un CV!",
      "Mon CV date de 2009...",
      "Le mien est écrit à la main.",
    ],
    unlockLevel: 1,
  },
  {
    id: "lettre",
    nameFr: "Lettre",
    icon: "✉️",
    phrases: [
      "Une lettre de présentation SVP!",
      "L'employeur veut une lettre...",
      "Je sais pas quoi écrire!",
    ],
    unlockLevel: 1,
  },
  {
    id: "perseverance",
    nameFr: "Persévérance",
    icon: "🎓",
    phrases: [
      "Je pense lâcher l'école...",
      "Les cours, c'est pu pour moi.",
      "Mon prof m'a envoyé ici.",
    ],
    unlockLevel: 2,
  },
  {
    id: "budget",
    nameFr: "Budget",
    icon: "💰",
    phrases: [
      "Je suis dans le rouge!",
      "Aide-moi avec mon budget!",
      "Ma carte de crédit déborde...",
    ],
    unlockLevel: 3,
  },
  {
    id: "autre",
    nameFr: "Autre",
    icon: "❓",
    phrases: [
      "C'est compliqué...",
      "Mon dossier est... spécial.",
      "Ça rentre dans aucune case.",
    ],
    unlockLevel: 4,
  },
];

export function getAvailableServices(level: number): ServiceRequest[] {
  return SERVICE_REQUESTS.filter((s) => s.unlockLevel <= level);
}

export function pickRandomService(level: number): ServiceRequest {
  const available = getAvailableServices(level);
  return available[Math.floor(Math.random() * available.length)];
}

export function pickPhrase(service: ServiceRequest, seed: number): string {
  return service.phrases[Math.abs(seed) % service.phrases.length];
}
