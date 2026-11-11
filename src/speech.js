// Nhận giọng nói (Web Speech API), đọc mẫu (speechSynthesis) và chấm câu nói.

export const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,!?;:"“”‘’()…\-–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** So khớp từng từ theo thứ tự (LCS). Trả về mảng matched cho từng từ của câu mẫu. */
export function alignWords(target, heard) {
  const t = norm(target).split(' ');
  const h = norm(heard).split(' ').filter(Boolean);
  const dp = Array.from({ length: t.length + 1 }, () => new Array(h.length + 1).fill(0));
  for (let i = 1; i <= t.length; i++)
    for (let j = 1; j <= h.length; j++)
      dp[i][j] = t[i - 1] === h[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const matched = new Array(t.length).fill(false);
  let i = t.length;
  let j = h.length;
  while (i > 0 && j > 0) {
    if (t[i - 1] === h[j - 1]) {
      matched[i - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return { words: t, matched, ratio: dp[t.length][h.length] / t.length };
}

// Ngưỡng đúng theo độ khó: câu càng dài càng được du di một chút.
export const PASS_RATIO = { 1: 1, 2: 0.75, 3: 0.8, 4: 0.8, 5: 0.75, 6: 0.75 };

export function judge(target, alternatives, tier) {
  let best = null;
  for (const alt of alternatives) {
    const r = alignWords(target, alt);
    if (!best || r.ratio > best.ratio) best = { ...r, heard: alt };
  }
  if (!best) return null;
  best.ok = best.ratio >= PASS_RATIO[tier];
  return best;
}

// ---- Nhận giọng ----

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
export const hasSpeechRecognition = !!SR;

const ERRORS = {
  'no-speech': 'Chưa nghe thấy tiếng nào, thử nói to hơn nhé.',
  'audio-capture': 'Không tìm thấy micro.',
  'not-allowed': 'Trình duyệt đang chặn micro. Hãy cho phép micro rồi thử lại.',
  'service-not-allowed': 'Trình duyệt đang chặn micro. Hãy cho phép micro rồi thử lại.',
  network: 'Cần có mạng để nhận giọng nói.',
};

/** Bắt đầu nghe. Tự dừng sau ~1.6s im lặng. Trả về { stop }. */
export function listen({ onInterim, onDone }) {
  const rec = new SR();
  rec.lang = 'vi-VN';
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 3;

  let silence = null;
  let finished = false;
  let error = null;
  const finals = []; // mỗi phần tử: mảng các phương án của một đoạn đã chốt
  let interim = '';

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(silence);
    const alts = [];
    for (let k = 0; k < 3; k++) {
      const parts = finals.map((f) => f[k] || f[0]);
      if (interim && k === 0) parts.push(interim);
      const s = parts.join(' ').trim();
      if (s && !alts.includes(s)) alts.push(s);
    }
    onDone({ alternatives: alts, error: alts.length ? null : error || ERRORS['no-speech'] });
  };

  rec.onresult = (e) => {
    interim = '';
    finals.length = 0;
    for (let i = 0; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) finals.push(Array.from(res, (a) => a.transcript));
      else interim += res[0].transcript;
    }
    onInterim([...finals.map((f) => f[0]), interim].join(' ').trim());
    clearTimeout(silence);
    silence = setTimeout(() => rec.stop(), 1600);
  };
  rec.onerror = (e) => {
    error = ERRORS[e.error] || 'Không nhận được giọng nói, thử lại nhé.';
  };
  rec.onend = finish;
  rec.start();
  return { stop: () => rec.stop() };
}

// ---- Đọc mẫu ----

export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'vi-VN';
  u.rate = 0.85;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('vi'));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}
