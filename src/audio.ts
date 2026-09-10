let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

export async function unlockAudio() {
  ctx = ctx ?? new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, gain = 0.08) {
  if (!ctx || !enabled) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.02);
}

export function playCorrect() {
  tone(523.25, 0, 0.12, "triangle", 0.07);
  tone(659.25, 0.08, 0.12, "triangle", 0.07);
  tone(783.99, 0.16, 0.18, "triangle", 0.08);
}

export function playNeutral() {
  tone(392, 0, 0.16, "sine", 0.05);
  tone(349.23, 0.1, 0.2, "sine", 0.04);
}

export function playTap() {
  tone(880, 0, 0.04, "sine", 0.03);
}

export function playBeam() {
  tone(240, 0, 0.28, "sawtooth", 0.03);
  tone(720, 0.04, 0.22, "sine", 0.05);
}

export function playWhoosh() {
  tone(180, 0, 0.18, "triangle", 0.04);
  tone(420, 0.08, 0.2, "sine", 0.05);
}
