import { getAvailableDocuments, type DocumentType } from "./documentTypes";
import { pickRandomService, type ServiceRequest } from "./serviceRequests";

export interface Client {
  id: string;
  seed: number;
  documents: DocumentType[];
  requests: ServiceRequest[]; // one per document — the service button to press
  currentDocIndex: number;
  patience: number; // remaining seconds
  maxPatience: number;
  arrivedAt: number; // tick when arrived
  isGhost: boolean;
  ghostTimer: number; // seconds before the ghost vanishes
}

let clientCounter = 0;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export interface ClientVisuals {
  skinColor: string;
  hairColor: string;
  hairStyle: number; // 0-3
  shirtColor: string;
  pantsColor: string;
  hasGlasses: boolean;
  hasCap: boolean;
  capColor: string;
}

const SKIN_COLORS = ["#FFDBB4", "#E8B88A", "#C68642", "#8D5524", "#6B3A1F", "#4A2511"];
const HAIR_COLORS = ["#2C1B18", "#4A3728", "#8B6914", "#B8860B", "#D4A04A", "#E8D5B7", "#C41E3A", "#1B4D3E"];
const SHIRT_COLORS = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#795548", "#607D8B", "#E91E63", "#3F51B5"];
const PANTS_COLORS = ["#37474F", "#3E2723", "#1A237E", "#263238", "#4E342E"];
const CAP_COLORS = ["#D32F2F", "#1976D2", "#388E3C", "#F57C00", "#7B1FA2"];

export function getClientVisuals(seed: number): ClientVisuals {
  const rng = seededRandom(seed);
  return {
    skinColor: SKIN_COLORS[Math.floor(rng() * SKIN_COLORS.length)],
    hairColor: HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)],
    hairStyle: Math.floor(rng() * 4),
    shirtColor: SHIRT_COLORS[Math.floor(rng() * SHIRT_COLORS.length)],
    pantsColor: PANTS_COLORS[Math.floor(rng() * PANTS_COLORS.length)],
    hasGlasses: rng() < 0.25,
    hasCap: rng() < 0.2,
    capColor: CAP_COLORS[Math.floor(rng() * CAP_COLORS.length)],
  };
}

// Paperwork that matches each service request (filtered by unlocked documents)
const SERVICE_DOC_POOLS: Record<string, string[]> = {
  rencontre: ["form", "report"],
  cv: ["cv"],
  lettre: ["letter"],
  perseverance: ["action-plan", "report"],
  budget: ["form", "grant"],
  autre: ["report", "accountability", "grant", "form"],
};

function pickDocumentForService(serviceId: string, level: number): DocumentType {
  const available = getAvailableDocuments(level);
  const pool = available.filter((d) => SERVICE_DOC_POOLS[serviceId]?.includes(d.id));
  const candidates = pool.length > 0 ? pool : available;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function generateClient(level: number, basePatience: number): Client {
  clientCounter++;
  const seed = Date.now() + clientCounter * 7919;
  const numDocs = Math.min(1 + Math.floor(Math.random() * Math.min(3, 1 + level / 3)), 3);
  const documents: DocumentType[] = [];
  const requests: ServiceRequest[] = [];
  for (let i = 0; i < numDocs; i++) {
    const service = pickRandomService(level);
    requests.push(service);
    documents.push(pickDocumentForService(service.id, level));
  }

  const patienceVariance = 0.8 + Math.random() * 0.4; // 80%-120%
  const patience = basePatience * patienceVariance;

  // Ghost clients appear from level 3: they vanish into thin air after a few seconds
  const isGhost = level >= 3 && Math.random() < 0.12;

  return {
    id: `client-${clientCounter}`,
    seed,
    documents,
    requests,
    currentDocIndex: 0,
    patience,
    maxPatience: patience,
    arrivedAt: 0,
    isGhost,
    ghostTimer: isGhost ? 5 + Math.random() * 4 : 0,
  };
}
