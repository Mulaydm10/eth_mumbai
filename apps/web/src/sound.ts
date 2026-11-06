// Offline clock sync by sound. Any phone plays the 3-tone sync signal; every listening phone (including the player)
// records the instant it heard the first tone, in its own wall clock. No internet needed to produce the anchor.
import { SYNC_ORDERS, SYNC_TONES, SYNC_TONE_MS, ToneSyncDetector } from "@tw/core";

const BLOCK = 256;
let ctx: AudioContext | null = null;
const audio = () => (ctx ??= new AudioContext());

/**
 * Play the sync signal in a random one of 6 tone orders. Returns the chirp ID and the moment (performance clock) the
 * first tone leaves the speaker, from the audio clock: the emitter anchors on this because it often can't hear itself.
 */
export async function playSyncSignal(): Promise<{ chirp: number; emitPerfMs: number }> {
  const c = audio();
  await c.resume();
  const chirp = Math.floor(Math.random() * SYNC_ORDERS.length);
  const order = SYNC_ORDERS[chirp]!;
  const t0 = c.currentTime + 0.08;
  order.forEach((toneIdx, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = SYNC_TONES[toneIdx]!;
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
  // Map audio-context time to performance time. getOutputTimestamp reports what is reaching the speaker now.
  const ts = c.getOutputTimestamp?.();
  const emitPerfMs =
    ts && ts.contextTime !== undefined && ts.performanceTime !== undefined && ts.performanceTime > 0
      ? ts.performanceTime + (t0 - ts.contextTime) * 1000
      : performance.now() + (t0 - c.currentTime) * 1000 + (c.outputLatency ?? 0) * 1000;
  return { chirp, emitPerfMs };
}

/** Listen on the microphone; calls onHeard(wallClockMs) once per sync signal. Returns a stop function. */
export async function listenForSync(toWallFromPerf: (perfMs: number) => number, onHeard: (wallMs: number, chirp: number) => void): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  const c = audio();
  await c.resume();
  const src = c.createMediaStreamSource(stream);
  // ScriptProcessor is deprecated but universally available on mobile Chrome and adequate for 5 ms blocks.
  const proc = c.createScriptProcessor(2048, 1, 1);
  const det = new ToneSyncDetector(c.sampleRate, (perfMs, chirp) => onHeard(toWallFromPerf(perfMs), chirp));
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
