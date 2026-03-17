import * as Tone from "tone";

let audioStarted = false;
let muted = false;

const MUTE_KEY = "bureau-rush-muted";

export async function ensureAudioStarted(): Promise<boolean> {
  if (audioStarted) return true;
  try {
    await Tone.start();
    audioStarted = true;
    // Restore mute preference
    if (typeof window !== "undefined") {
      muted = localStorage.getItem(MUTE_KEY) === "true";
      if (muted) {
        Tone.getDestination().mute = true;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  Tone.getDestination().mute = muted;
  try {
    localStorage.setItem(MUTE_KEY, String(muted));
  } catch {
    // ignore
  }
  return muted;
}

export function isAudioStarted(): boolean {
  return audioStarted;
}
