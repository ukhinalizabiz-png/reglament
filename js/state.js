// Прогресс хранится в браузере, чтобы можно было закрыть вкладку и вернуться.
const KEY = 'kvest-yura-v1';

const fresh = () => ({
  entered: false,
  done: {},
  clues: { 1: [], 2: [] },
  gift1: false,
  gift2: false,
  glitch: { 1: false, 2: false },
  seen: {},
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(fresh(), JSON.parse(raw));
  } catch {}
  return fresh();
}

export const S = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
}

export function reset() {
  Object.assign(S, fresh());
  save();
}
