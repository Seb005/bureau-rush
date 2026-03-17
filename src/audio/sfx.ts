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
  ensureInit();
  synth?.triggerAttackRelease(note, duration);
}

function playNotes(notes: string[], interval: number = 100) {
  ensureInit();
  notes.forEach((note, i) => {
    setTimeout(() => synth?.triggerAttackRelease(note, "16n"), i * interval);
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
      setTimeout(() => synth?.triggerAttackRelease(note, "32n"), i * 80);
    });
  },

  levelComplete() {
    playNotes(["C5", "E5", "G5", "C6", "E6"], 100);
  },

  gameOver() {
    ensureInit();
    const notes = ["G4", "F#4", "F4", "E4", "Eb4", "D4", "Db4", "C3"];
    notes.forEach((note, i) => {
      setTimeout(() => synth?.triggerAttackRelease(note, "8n"), i * 150);
    });
  },

  sickLeaveActivate() {
    ensureInit();
    const lowSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.3, decay: 1, sustain: 0.2, release: 0.5 },
    }).toDestination();
    lowSynth.triggerAttackRelease("C2", "2n");
    setTimeout(() => lowSynth.dispose(), 3000);
  },

  ministryStamp() {
    ensureInit();
    noiseSynth?.triggerAttackRelease("16n");
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
};
