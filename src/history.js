// Nhớ các câu đã gặp (theo nhóm câu) để những lần chơi sau không lặp lại cho tới khi hết kho.
const KEY = 'dau-quai-vat.seen.v1';
let state = { version: '', groups: new Set() };

export function loadSeen(version) {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.version === version) state = { version, groups: new Set(raw.groups) };
    else state = { version, groups: new Set() };
  } catch {
    state = { version, groups: new Set() };
  }
  return state.groups;
}

export function markSeen(g) {
  state.groups.add(g);
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: state.version, groups: [...state.groups] }));
  } catch {
    /* bỏ qua */
  }
}

export const seenCount = () => state.groups.size;

export function resetSeen() {
  state.groups = new Set();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* bỏ qua */
  }
}
