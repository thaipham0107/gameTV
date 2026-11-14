// Hiệu ứng đòn đánh: tia lửa, rung màn hình, pháo giấy. Tắt được trong phần cài đặt.
export const fxState = { on: true };

const rand = (a, b) => a + Math.random() * (b - a);

export function shake(el, cls = 'fx-shake', ms = 380) {
  if (!fxState.on || !el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

/** Bắn các hạt từ điểm (x, y) tính theo `host`. */
export function burst(host, x, y, { items = ['✨', '💥', '⭐'], n = 9, spread = 90 } = {}) {
  if (!fxState.on || !host) return;
  for (let k = 0; k < n; k++) {
    const p = document.createElement('span');
    p.className = 'fx-p';
    p.textContent = items[k % items.length];
    const a = rand(0, Math.PI * 2);
    const d = rand(spread * 0.4, spread);
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 20}px;--r:${rand(-200, 200)}deg;font-size:${rand(14, 26)}px`;
    host.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

/** Pháo giấy rơi từ trên xuống. */
export function confetti(host, n = 26) {
  if (!fxState.on || !host) return;
  const w = host.clientWidth;
  const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9ecd'];
  for (let k = 0; k < n; k++) {
    const p = document.createElement('i');
    p.className = 'fx-c';
    p.style.cssText = `left:${rand(0, w)}px;background:${colors[k % colors.length]};--dx:${rand(-40, 40)}px;--r:${rand(180, 720)}deg;animation-delay:${rand(0, 0.35)}s`;
    host.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}

/** Tâm một phần tử so với `host`. */
export function centerOf(el, host) {
  const a = el.getBoundingClientRect();
  const b = host.getBoundingClientRect();
  return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
}
