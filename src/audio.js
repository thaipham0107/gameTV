// Âm thanh hiệu ứng đơn giản bằng WebAudio (không cần tệp âm thanh).
let ctx = null;
export const sfxState = { on: true };

function tone(freq, start, dur, type = 'square', vol = 0.08) {
  if (!sfxState.on) return;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(vol, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur);
}

export const sfx = {
  hit() {
    tone(180, 0, 0.09, 'sawtooth', 0.12);
    tone(90, 0.04, 0.12, 'square', 0.1);
  },
  miss() {
    tone(220, 0, 0.12, 'triangle');
    tone(150, 0.12, 0.2, 'triangle');
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.2, 'triangle', 0.1));
  },
  lose() {
    [330, 262, 196].forEach((f, i) => tone(f, i * 0.18, 0.25, 'triangle', 0.1));
  },
};
