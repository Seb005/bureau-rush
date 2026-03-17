import { type Client, generateClient } from "./clientGenerator";
import { type DocumentType } from "./documentTypes";
import { getLevelConfig } from "./levelConfig";
import { generateMinistryDeductions, type MinistryDeduction } from "./ministryDeductions";
import { checkBadges, type Badge } from "./badges";
import { type GameEvent, shouldTriggerEvent, EVENT_TYPES } from "./events";
import { type PowerUp, shouldSpawnPowerUp, POWER_UP_TYPES } from "./powerUps";

export type GamePhase = "menu" | "playing" | "paused" | "sickLeave" | "event" | "gameOver" | "ministrySequence";

export interface ActiveDocument {
  type: DocumentType;
  stepsCompleted: number;
  timeRemaining: number;
}

export interface ActivePowerUp {
  powerUp: PowerUp;
  timeRemaining: number;
}

export interface GameState {
  phase: GamePhase;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  level: number;
  clientsServed: number;
  clientsServedThisLevel: number;
  clientsLost: number;
  waitingClients: Client[];
  activeClient: Client | null;
  activeDocument: ActiveDocument | null;
  sickLeavesRemaining: number;
  sickLeaveCooldown: number;
  sickLeaveTimer: number;
  playTime: number; // seconds
  timeSinceLastClient: number;
  inZoneMode: boolean;
  zoneModeTimer: number;
  // Events
  activeEvent: GameEvent | null;
  eventCooldown: number;
  eventClickCount: number; // for printer jam mini-game
  // Power-ups
  activePowerUps: ActivePowerUp[];
  pendingPowerUp: PowerUp | null;
  // Game over
  ministryDeductions: MinistryDeduction[];
  finalScore: number;
  earnedBadges: Badge[];
  // Level transition
  showLevelBanner: boolean;
  levelBannerTimer: number;
  // Coffee spill effect
  coffeeSpillActive: boolean;
  coffeeSpillTimer: number;
  // Meeting block
  meetingBlockActive: boolean;
  meetingBlockTimer: number;
  // Network outage
  networkOutageActive: boolean;
  networkOutageTimer: number;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "TICK"; deltaSeconds: number }
  | { type: "SELECT_CLIENT"; clientId: string }
  | { type: "FILL_STEP" }
  | { type: "USE_SICK_LEAVE" }
  | { type: "END_SICK_LEAVE" }
  | { type: "COLLECT_POWER_UP" }
  | { type: "DISMISS_POWER_UP" }
  | { type: "RESPOND_EVENT"; success: boolean }
  | { type: "EVENT_CLICK" } // for printer jam rapid clicking
  | { type: "DISMISS_LEVEL_BANNER" }
  | { type: "START_MINISTRY_SEQUENCE" }
  | { type: "RESET" };

export const INITIAL_STATE: GameState = {
  phase: "menu",
  score: 0,
  lives: 3,
  combo: 0,
  maxCombo: 0,
  level: 1,
  clientsServed: 0,
  clientsServedThisLevel: 0,
  clientsLost: 0,
  waitingClients: [],
  activeClient: null,
  activeDocument: null,
  sickLeavesRemaining: 3,
  sickLeaveCooldown: 0,
  sickLeaveTimer: 0,
  playTime: 0,
  timeSinceLastClient: 0,
  inZoneMode: false,
  zoneModeTimer: 0,
  activeEvent: null,
  eventCooldown: 0,
  eventClickCount: 0,
  activePowerUps: [],
  pendingPowerUp: null,
  ministryDeductions: [],
  finalScore: 0,
  earnedBadges: [],
  showLevelBanner: false,
  levelBannerTimer: 0,
  coffeeSpillActive: false,
  coffeeSpillTimer: 0,
  meetingBlockActive: false,
  meetingBlockTimer: 0,
  networkOutageActive: false,
  networkOutageTimer: 0,
};

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 5;
  if (combo >= 8) return 4;
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  return 1;
}

function hasActivePowerUp(state: GameState, id: string): boolean {
  return state.activePowerUps.some((ap) => ap.powerUp.id === id);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const config = getLevelConfig(1);
      const firstClient = generateClient(1, config.basePatience);
      return {
        ...INITIAL_STATE,
        phase: "playing",
        waitingClients: [firstClient],
        timeSinceLastClient: 0,
      };
    }

    case "TICK": {
      if (state.phase !== "playing") return state;

      const dt = action.deltaSeconds;
      const config = getLevelConfig(state.level);
      const timeScale = state.inZoneMode ? 0.5 : 1;
      const scaledDt = dt * timeScale;

      let newState = { ...state };
      newState.playTime += dt;

      // Update sick leave cooldown
      if (newState.sickLeaveCooldown > 0) {
        newState.sickLeaveCooldown = Math.max(0, newState.sickLeaveCooldown - dt);
      }

      // Level banner timer
      if (newState.showLevelBanner) {
        newState.levelBannerTimer -= dt;
        if (newState.levelBannerTimer <= 0) {
          newState.showLevelBanner = false;
        }
      }

      // Zone mode timer
      if (newState.inZoneMode) {
        newState.zoneModeTimer -= dt;
        if (newState.zoneModeTimer <= 0) {
          newState.inZoneMode = false;
        }
      }

      // Coffee spill timer
      if (newState.coffeeSpillActive) {
        newState.coffeeSpillTimer -= dt;
        if (newState.coffeeSpillTimer <= 0) {
          newState.coffeeSpillActive = false;
        }
      }

      // Meeting block timer
      if (newState.meetingBlockActive) {
        newState.meetingBlockTimer -= dt;
        if (newState.meetingBlockTimer <= 0) {
          newState.meetingBlockActive = false;
        }
      }

      // Network outage timer
      if (newState.networkOutageActive) {
        newState.networkOutageTimer -= dt;
        if (newState.networkOutageTimer <= 0) {
          newState.networkOutageActive = false;
        }
      }

      // Update power-up timers
      newState.activePowerUps = newState.activePowerUps
        .map((ap) => ({ ...ap, timeRemaining: ap.timeRemaining - dt }))
        .filter((ap) => ap.timeRemaining > 0);

      // Update active document timer
      if (newState.activeDocument) {
        const doc = newState.activeDocument;
        const docSpeedMultiplier = hasActivePowerUp(newState, "strong-coffee") ? 0.5 : 1;
        const networkSlowdown = newState.networkOutageActive ? 2 : 1;
        const effectiveDt = scaledDt * docSpeedMultiplier * networkSlowdown;

        newState.activeDocument = {
          type: doc.type,
          stepsCompleted: doc.stepsCompleted,
          timeRemaining: doc.timeRemaining - effectiveDt,
        };

        if (newState.activeDocument.timeRemaining <= 0) {
          // Document expired
          newState.combo = 0;
          newState.activeDocument = null;
          // Move to next document or dismiss client
          if (newState.activeClient) {
            const nextDocIndex = newState.activeClient.currentDocIndex + 1;
            if (nextDocIndex < newState.activeClient.documents.length) {
              newState.activeClient = { ...newState.activeClient, currentDocIndex: nextDocIndex };
              const nextDoc = newState.activeClient.documents[nextDocIndex];
              const stepsReduction = hasActivePowerUp(newState, "new-photocopier") ? 1 : 0;
              newState.activeDocument = {
                type: nextDoc,
                stepsCompleted: 0,
                timeRemaining: nextDoc.timeLimit,
              };
              if (stepsReduction > 0) {
                newState.activeDocument.type = { ...nextDoc, steps: Math.max(1, nextDoc.steps - stepsReduction) };
              }
            } else {
              newState.activeClient = null;
            }
          }
        }
      }

      // Update client patience
      const patienceMultiplier = hasActivePowerUp(newState, "motivational-playlist") ? 0.5 : 1;
      const updatedClients: Client[] = [];
      let lostClient = false;
      for (const client of newState.waitingClients) {
        const newPatience = client.patience - scaledDt * patienceMultiplier;
        if (newPatience <= 0) {
          lostClient = true;
          newState.clientsLost++;
        } else {
          updatedClients.push({ ...client, patience: newPatience });
        }
      }
      newState.waitingClients = updatedClients;

      if (lostClient) {
        newState.lives--;
        newState.combo = 0;
        if (newState.lives <= 0) {
          newState.phase = "gameOver";
          const deductions = generateMinistryDeductions(newState.score, newState.level);
          newState.ministryDeductions = deductions;
          newState.finalScore = Math.max(0, deductions.reduce((score, d) => score - d.amount, newState.score));
          newState.earnedBadges = checkBadges(newState);
          return newState;
        }
      }

      // Spawn new clients
      newState.timeSinceLastClient += dt;
      if (
        newState.timeSinceLastClient >= config.clientArrivalInterval &&
        newState.waitingClients.length < config.maxClients &&
        !newState.meetingBlockActive
      ) {
        const newClient = generateClient(newState.level, config.basePatience);
        newState.waitingClients = [...newState.waitingClients, newClient];
        newState.timeSinceLastClient = 0;
      }

      // Check for random events
      if (newState.eventCooldown > 0) {
        newState.eventCooldown -= dt;
      } else if (!newState.activeEvent && newState.level >= 2) {
        const event = shouldTriggerEvent(newState.level, dt);
        if (event) {
          if (event.id === "network-outage") {
            newState.networkOutageActive = true;
            newState.networkOutageTimer = 10;
            newState.eventCooldown = 15;
          } else if (event.id === "unexpected-meeting") {
            newState.meetingBlockActive = true;
            newState.meetingBlockTimer = 8;
            newState.eventCooldown = 15;
          } else if (event.id === "coffee-spill") {
            newState.coffeeSpillActive = true;
            newState.coffeeSpillTimer = 5;
            newState.eventCooldown = 15;
          } else {
            newState.activeEvent = event;
            newState.eventClickCount = 0;
            newState.eventCooldown = 15;
          }
        }
      }

      // Check for power-up spawns
      if (!newState.pendingPowerUp) {
        const powerUp = shouldSpawnPowerUp(newState.level, newState.combo, newState.clientsServedThisLevel, dt);
        if (powerUp) {
          newState.pendingPowerUp = powerUp;
        }
      }

      return newState;
    }

    case "SELECT_CLIENT": {
      if (state.phase !== "playing" || state.activeClient || state.meetingBlockActive) return state;
      const clientIndex = state.waitingClients.findIndex((c) => c.id === action.clientId);
      if (clientIndex === -1) return state;

      const client = state.waitingClients[clientIndex];
      const remainingClients = state.waitingClients.filter((_, i) => i !== clientIndex);
      const firstDoc = client.documents[0];
      const stepsReduction = hasActivePowerUp(state, "new-photocopier") ? 1 : 0;
      const adjustedDoc = stepsReduction > 0 ? { ...firstDoc, steps: Math.max(1, firstDoc.steps - stepsReduction) } : firstDoc;

      return {
        ...state,
        activeClient: { ...client, currentDocIndex: 0 },
        waitingClients: remainingClients,
        activeDocument: {
          type: adjustedDoc,
          stepsCompleted: 0,
          timeRemaining: firstDoc.timeLimit,
        },
      };
    }

    case "FILL_STEP": {
      if (state.phase !== "playing" || !state.activeDocument || !state.activeClient) return state;
      if (state.meetingBlockActive) return state;

      const doc = state.activeDocument;
      const newSteps = doc.stepsCompleted + 1;

      if (newSteps >= doc.type.steps) {
        // Document completed!
        const newCombo = state.combo + 1;
        const multiplier = getComboMultiplier(newCombo);
        const points = doc.type.points * multiplier;
        const newScore = state.score + points;
        const newMaxCombo = Math.max(state.maxCombo, newCombo);

        let newState: GameState = {
          ...state,
          score: newScore,
          combo: newCombo,
          maxCombo: newMaxCombo,
        };

        // Check for zone mode at combo x10
        if (newCombo >= 10 && !state.inZoneMode) {
          newState.inZoneMode = true;
          newState.zoneModeTimer = 10;
        }

        // Check for colleague reinforcement at combo 5+
        if (newCombo === 5 && newState.waitingClients.length > 0) {
          // Auto-serve first waiting client
          const autoClient = newState.waitingClients[0];
          const autoPoints = autoClient.documents.reduce((sum, d) => sum + d.points, 0);
          newState.score += autoPoints;
          newState.clientsServed++;
          newState.clientsServedThisLevel++;
          newState.waitingClients = newState.waitingClients.slice(1);
        }

        // Check if client has more documents
        const nextDocIndex = state.activeClient.currentDocIndex + 1;
        if (nextDocIndex < state.activeClient.documents.length) {
          const nextDoc = state.activeClient.documents[nextDocIndex];
          const stepsReduction = hasActivePowerUp(newState, "new-photocopier") ? 1 : 0;
          newState.activeClient = { ...state.activeClient, currentDocIndex: nextDocIndex };
          newState.activeDocument = {
            type: stepsReduction > 0 ? { ...nextDoc, steps: Math.max(1, nextDoc.steps - stepsReduction) } : nextDoc,
            stepsCompleted: 0,
            timeRemaining: nextDoc.timeLimit,
          };
        } else {
          // Client fully served
          newState.clientsServed++;
          newState.clientsServedThisLevel++;
          newState.activeClient = null;
          newState.activeDocument = null;

          // Check level advancement
          const config = getLevelConfig(newState.level);
          if (newState.clientsServedThisLevel >= config.clientsToAdvance) {
            newState.level++;
            newState.clientsServedThisLevel = 0;
            newState.showLevelBanner = true;
            newState.levelBannerTimer = 2;

            // Turbo Wi-Fi every 3 levels
            if (newState.level % 3 === 0) {
              // Add 3 seconds to all waiting clients' patience
              newState.waitingClients = newState.waitingClients.map((c) => ({
                ...c,
                patience: c.patience + 3,
              }));
            }
          }
        }

        return newState;
      }

      // Step not complete yet, just increment
      return {
        ...state,
        activeDocument: {
          ...doc,
          stepsCompleted: newSteps,
          timeRemaining: doc.timeRemaining, // timer keeps running
        },
      };
    }

    case "USE_SICK_LEAVE": {
      if (state.phase !== "playing" || state.sickLeavesRemaining <= 0 || state.sickLeaveCooldown > 0) {
        return state;
      }
      return {
        ...state,
        phase: "sickLeave",
        sickLeavesRemaining: state.sickLeavesRemaining - 1,
        sickLeaveTimer: 5,
      };
    }

    case "END_SICK_LEAVE": {
      return {
        ...state,
        phase: "playing",
        sickLeaveCooldown: 10,
        sickLeaveTimer: 0,
      };
    }

    case "COLLECT_POWER_UP": {
      if (!state.pendingPowerUp) return state;
      const pu = state.pendingPowerUp;
      return {
        ...state,
        pendingPowerUp: null,
        activePowerUps: [...state.activePowerUps, { powerUp: pu, timeRemaining: pu.duration }],
      };
    }

    case "DISMISS_POWER_UP": {
      return { ...state, pendingPowerUp: null };
    }

    case "RESPOND_EVENT": {
      if (!state.activeEvent) return state;
      const event = state.activeEvent;
      let newState = { ...state, activeEvent: null };

      if (action.success) {
        if (event.id === "intern-questions") {
          newState.score += 15;
        }
      } else {
        if (event.id === "phone-ringing") {
          newState.lives--;
          if (newState.lives <= 0) {
            newState.phase = "gameOver";
            const deductions = generateMinistryDeductions(newState.score, newState.level);
            newState.ministryDeductions = deductions;
            newState.finalScore = Math.max(0, deductions.reduce((s, d) => s - d.amount, newState.score));
            newState.earnedBadges = checkBadges(newState);
          }
        } else if (event.id === "founder-visit") {
          newState.score = Math.floor(newState.score * 0.8);
        } else if (event.id === "intern-questions" && newState.activeDocument) {
          newState.activeDocument = {
            ...newState.activeDocument,
            timeRemaining: newState.activeDocument.timeRemaining - 5,
          };
        }
      }

      return newState;
    }

    case "EVENT_CLICK": {
      if (!state.activeEvent || state.activeEvent.id !== "printer-jam") return state;
      const newCount = state.eventClickCount + 1;
      if (newCount >= 10) {
        return { ...state, activeEvent: null, eventClickCount: 0 };
      }
      return { ...state, eventClickCount: newCount };
    }

    case "DISMISS_LEVEL_BANNER": {
      return { ...state, showLevelBanner: false };
    }

    case "START_MINISTRY_SEQUENCE": {
      if (state.phase !== "gameOver") return state;
      return { ...state, phase: "ministrySequence" };
    }

    case "RESET": {
      return { ...INITIAL_STATE };
    }

    default:
      return state;
  }
}
