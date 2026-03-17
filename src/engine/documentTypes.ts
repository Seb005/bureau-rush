export interface DocumentType {
  id: string;
  name: string;
  nameFr: string;
  steps: number;
  timeLimit: number; // seconds
  points: number;
  unlockLevel: number;
  icon: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  { id: "cv", name: "CV", nameFr: "CV", steps: 3, timeLimit: 4, points: 15, unlockLevel: 1, icon: "📄" },
  { id: "form", name: "Form", nameFr: "Formulaire", steps: 4, timeLimit: 5, points: 20, unlockLevel: 1, icon: "📋" },
  { id: "report", name: "Report", nameFr: "Rapport", steps: 5, timeLimit: 6, points: 25, unlockLevel: 1, icon: "📝" },
  { id: "letter", name: "Letter", nameFr: "Lettre", steps: 2, timeLimit: 3.5, points: 12, unlockLevel: 1, icon: "✉️" },
  { id: "action-plan", name: "Action Plan", nameFr: "Plan d'action", steps: 6, timeLimit: 7, points: 30, unlockLevel: 3, icon: "📊" },
  { id: "accountability", name: "Accountability", nameFr: "Reddition de comptes", steps: 7, timeLimit: 8, points: 40, unlockLevel: 5, icon: "📑" },
  { id: "grant", name: "Grant Request", nameFr: "Demande de subvention", steps: 8, timeLimit: 10, points: 50, unlockLevel: 7, icon: "💰" },
];

export function getAvailableDocuments(level: number): DocumentType[] {
  return DOCUMENT_TYPES.filter((d) => d.unlockLevel <= level);
}

export function pickRandomDocument(level: number): DocumentType {
  const available = getAvailableDocuments(level);
  return available[Math.floor(Math.random() * available.length)];
}
