import * as Tone from "tone";

let bassLine: Tone.Sequence | null = null;
let melodyLine: Tone.Sequence | null = null;
let percLine: Tone.Sequence | null = null;
let bassSynth: Tone.Synth | null = null;
let melodySynth: Tone.Synth | null = null;
let noiseSynth: Tone.NoiseSynth | null = null;
let isPlaying = false;

const BASS_PATTERNS = [
  ["C2", null, "C2", null, "G2", null, "G2", null],
  ["Ab2", null, "Ab2", null, "Eb2", null, "Eb2", null],
  ["F2", null, "F2", null, "C2", null, "C2", null],
  ["G2", null, "G2", null, "G2", null, "Ab2", null],
];

const MELODY_PATTERNS = [
  ["C4", "Eb4", "G4", null, "C5", null, "G4", null],
  ["Ab4", null, "Eb4", "Ab4", null, "G4", null, "Eb4"],
  ["F4", "Ab4", null, "C5", "Ab4", null, "F4", null],
  [null, "G4", "Bb4", null, "G4", null, "F4", "Eb4"],
];

const PERC_PATTERN = [
  "kick", null, "hat", null, "kick", "hat", null, "hat",
];

function createSynths() {
  bassSynth = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.1 },
    volume: -12,
  }).toDestination();

  melodySynth = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.1 },
    volume: -15,
  }).toDestination();

  noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    volume: -20,
  }).toDestination();
}

export function startMusic(level: number = 1) {
  try {
    if (isPlaying) {
      updateTempo(level);
      return;
    }

    // Clean up any leftover state from a previous session
    cleanupTransport();

    createSynths();

    const bpm = Math.min(200, 100 + (level - 1) * 15);
    Tone.getTransport().bpm.value = bpm;

    // Bass sequence
    const flatBass = BASS_PATTERNS.flat();
    bassLine = new Tone.Sequence(
      (time, note) => {
        try {
          if (note && bassSynth) {
            bassSynth.triggerAttackRelease(note, "8n", time);
          }
        } catch {
          // Ignore scheduling errors
        }
      },
      flatBass,
      "8n"
    ).start(0);

    // Melody sequence
    const flatMelody = MELODY_PATTERNS.flat();
    melodyLine = new Tone.Sequence(
      (time, note) => {
        try {
          if (note && melodySynth) {
            if (level >= 7) {
              melodySynth.detune.value = Math.random() * 20 - 10;
            }
            melodySynth.triggerAttackRelease(note, "16n", time);
          }
        } catch {
          // Ignore scheduling errors
        }
      },
      flatMelody,
      "8n"
    ).start(0);

    // Percussion
    percLine = new Tone.Sequence(
      (time, hit) => {
        try {
          if (hit === "kick" && noiseSynth) {
            noiseSynth.envelope.decay = 0.08;
            noiseSynth.triggerAttackRelease("16n", time);
          } else if (hit === "hat" && noiseSynth) {
            noiseSynth.envelope.decay = 0.03;
            noiseSynth.triggerAttackRelease("32n", time);
          }
        } catch {
          // Ignore scheduling errors
        }
      },
      PERC_PATTERN,
      "8n"
    ).start(0);

    Tone.getTransport().start();
    isPlaying = true;
  } catch {
    // If music fails to start, continue silently
    isPlaying = false;
  }
}

export function updateTempo(level: number) {
  try {
    const bpm = Math.min(200, 100 + (level - 1) * 15);
    Tone.getTransport().bpm.rampTo(bpm, 2);
  } catch {
    // Ignore
  }
}

export function pauseMusic() {
  try {
    Tone.getTransport().pause();
  } catch {
    // Ignore
  }
}

export function resumeMusic() {
  try {
    // Use the "+" prefix to schedule relative to "now" — avoids the
    // "start time must be strictly greater than previous start time" error
    Tone.getTransport().start("+0.05");
  } catch {
    // Ignore
  }
}

function cleanupTransport() {
  try {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
  } catch {
    // Ignore
  }
  bassLine?.dispose();
  melodyLine?.dispose();
  percLine?.dispose();
  bassSynth?.dispose();
  melodySynth?.dispose();
  noiseSynth?.dispose();
  bassLine = null;
  melodyLine = null;
  percLine = null;
  bassSynth = null;
  melodySynth = null;
  noiseSynth = null;
}

export function stopMusic() {
  cleanupTransport();
  isPlaying = false;
}
