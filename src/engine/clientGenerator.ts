import { pickRandomDocument, type DocumentType } from "./documentTypes";

export interface Client {
  id: string;
  seed: number;
  documents: DocumentType[];
  currentDocIndex: number;
  patience: number; // remaining seconds
  maxPatience: number;
  arrivedAt: number; // tick when arrived
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
  hairStyle: number; // 0-2
  shirtColor: string;
  hasGlasses: boolean;
}

const SKIN_COLORS = ["#FFDBB4", "#E8B88A", "#C68642", "#8D5524", "#6B3A1F", "#4A2511"];
const HAIR_COLORS = ["#2C1B18", "#4A3728", "#8B6914", "#B8860B", "#D4A04A", "#E8D5B7", "#C41E3A", "#1B4D3E"];
const SHIRT_COLORS = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#795548", "#607D8B", "#E91E63", "#3F51B5"];

export function getClientVisuals(seed: number): ClientVisuals {
  const rng = seededRandom(seed);
  return {
    skinColor: SKIN_COLORS[Math.floor(rng() * SKIN_COLORS.length)],
    hairColor: HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)],
    hairStyle: Math.floor(rng() * 3),
    shirtColor: SHIRT_COLORS[Math.floor(rng() * SHIRT_COLORS.length)],
    hasGlasses: rng() < 0.25,
  };
}

export function generateClient(level: number, basePatience: number): Client {
  clientCounter++;
  const seed = Date.now() + clientCounter * 7919;
  const numDocs = Math.min(1 + Math.floor(Math.random() * Math.min(3, 1 + level / 3)), 3);
  const documents: DocumentType[] = [];
  for (let i = 0; i < numDocs; i++) {
    documents.push(pickRandomDocument(level));
  }

  const patienceVariance = 0.8 + Math.random() * 0.4; // 80%-120%
  const patience = basePatience * patienceVariance;

  return {
    id: `client-${clientCounter}`,
    seed,
    documents,
    currentDocIndex: 0,
    patience,
    maxPatience: patience,
    arrivedAt: 0,
  };
}
