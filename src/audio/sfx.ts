import * as Tone from "tone";

let synth: Tone.Synth | null = null;
let noiseSynth: Tone.NoiseSynth | null = null;
let initialized = false;

function ensureInit() {
  if (initialized) return;
  initialized = true;
  synth = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.1 },
  }).toDestination();
  noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 },
  }).toDestination();
}

function playNote(note: string, duration: string = "16n") {
  try {
    ensureInit();
    synth?.triggerAttackRelease(note, duration);
  } catch {
    // Ignore audio scheduling errors — never crash the game for sound
  }
}

function playNotes(notes: string[], interval: number = 100) {
  ensureInit();
  notes.forEach((note, i) => {
    setTimeout(() => {
      try {
        synth?.triggerAttackRelease(note, "16n");
      } catch {
        // Ignore
      }
    }, i * interval);
  });
}

export const SFX = {
  buttonClick() {
    playNote("C5", "32n");
  },

  documentComplete() {
    playNotes(["E5", "G5", "C6"], 80);
  },

  lifeLost() {
    playNotes(["E3", "C3"], 150);
  },

  phoneRing() {
    ensureInit();
    const notes = ["A5", "E5", "A5", "E5", "A5", "E5"];
    notes.forEach((note, i) => {
      setTimeout(() => {
        try {
          synth?.triggerAttackRelease(note, "32n");
        } catch {
          // Ignore
        }
      }, i * 80);
    });
  },

  levelComplete() {
    playNotes(["C5", "E5", "G5", "C6", "E6"], 100);
  },

  gameOver() {
    ensureInit();
    const notes = ["G4", "F#4", "F4", "E4", "Eb4", "D4", "Db4", "C3"];
    notes.forEach((note, i) => {
      setTimeout(() => {
        try {
          synth?.triggerAttackRelease(note, "8n");
        } catch {
          // Ignore
        }
      }, i * 150);
    });
  },

  sickLeaveActivate() {
    try {
      ensureInit();
      const lowSynth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.3, decay: 1, sustain: 0.2, release: 0.5 },
      }).toDestination();
      lowSynth.triggerAttackRelease("C2", "2n");
      setTimeout(() => lowSynth.dispose(), 3000);
    } catch {
      // Ignore
    }
  },

  ministryStamp() {
    try {
      ensureInit();
      noiseSynth?.triggerAttackRelease("16n");
    } catch {
      // Ignore
    }
  },

  ministryDeduction() {
    playNotes(["Bb3", "F3"], 120);
  },

  comboUp() {
    playNote("E6", "32n");
  },

  powerUp() {
    playNotes(["C5", "E5", "G5"], 60);
  },

  wrongAction() {
    // Harsh low buzz: you pressed the wrong service button
    try {
      ensureInit();
      const buzz = new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.05 },
      }).toDestination();
      buzz.volume.value = -8;
      buzz.triggerAttackRelease("A2", "16n");
      setTimeout(() => buzz.dispose(), 500);
    } catch {
      // Ignore
    }
  },

  ghostPoof() {
    // Eerie descending glide: a client vanished into thin air
    try {
      ensureInit();
      const ghost = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.2 },
      }).toDestination();
      ghost.volume.value = -6;
      ghost.triggerAttackRelease("A5", "8n");
      ghost.frequency.rampTo("A3", 0.4);
      setTimeout(() => ghost.dispose(), 1000);
    } catch {
      // Ignore
    }
  },

  rushAlarm() {
    // Two urgent high beeps: the ministry wants its numbers
    playNotes(["G5", "G5", "C6"], 130);
  },

  cashIn() {
    // Coins! A donation came through
    playNotes(["E6", "G6", "C7"], 50);
  },
};
