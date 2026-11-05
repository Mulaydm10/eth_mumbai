// Offline clock sync by sound. Any phone plays the 3-tone sync signal; every listening phone (including the player)
// records the instant it heard the first tone, in its own wall clock. No internet needed to produce the anchor.
import { SYNC_TONES, SYNC_TONE_MS, ToneSyncDetector } from "@tw/core";

const BLOCK = 256;
let ctx: AudioContext | null = null;
const audio = () => (ctx ??= new AudioContext());

export async function playSyncSignal() {
  const c = audio();
  await c.resume();
  const t0 = c.currentTime + 0.05;
  SYNC_TONES.forEach((f, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = f;
    const s = t0 + (i * SYNC_TONE_MS) / 1000;
    const e = s + SYNC_TONE_MS / 1000;
    g.gain.setValueAtTime(0, s);
    g.gain.linearRampToValueAtTime(0.9, s + 0.004);
    g.gain.setValueAtTime(0.9, e - 0.004);
    g.gain.linearRampToValueAtTime(0, e);
    o.connect(g).connect(c.destination);
    o.start(s);
    o.stop(e + 0.01);
  });
}

/** Listen on the microphone; calls onHeard(wallClockMs) once per sync signal. Returns a stop function. */
export async function listenForSync(toWallFromPerf: (perfMs: number) => number, onHeard: (wallMs: number) => void): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  const c = audio();
  await c.resume();
  const src = c.createMediaStreamSource(stream);
  // ScriptProcessor is deprecated but universally available on mobile Chrome and adequate for 5 ms blocks.
  const proc = c.createScriptProcessor(2048, 1, 1);
  const det = new ToneSyncDetector(c.sampleRate, (perfMs) => onHeard(toWallFromPerf(perfMs)));
  proc.onaudioprocess = (ev) => {
    const x = ev.inputBuffer.getChannelData(0);
    // The buffer just captured ends ~now; date each 256-sample block back from the end.
    const endPerf = performance.now();
    const bufMs = (x.length / c.sampleRate) * 1000;
    for (let i = 0; i + BLOCK <= x.length; i += BLOCK) det.push(x.subarray(i, i + BLOCK), endPerf - bufMs + (i / c.sampleRate) * 1000);
  };
  const mute = c.createGain();
  mute.gain.value = 0;
  src.connect(proc).connect(mute).connect(c.destination);
  return () => {
    proc.disconnect();
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
  };
}
