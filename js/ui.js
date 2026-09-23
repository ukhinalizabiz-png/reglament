// Субтитры, всплывающие экраны, панели заданий, бумажки с подсказками.
import { PEOPLE, DEPTS } from './data.js';
import { avatar } from './art.js';
import * as A from './audio.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
// ?fast в адресе ускоряет все в 10 раз, для проверки.
export const FAST = new URLSearchParams(location.search).has('fast');
export const sleep = ms => new Promise(r => setTimeout(r, FAST ? ms / 10 : ms));
export const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Уход из сцены посреди задания: все, что еще ждет, тихо обрывается.
export const ABORT = Symbol('abort');
let token = 0;
let cleanups = [];
export const tok = () => token;
export function check(t) { if (t !== token) throw ABORT; }
export async function wait(ms) { const t = token; await sleep(ms); check(t); }
export function cleanup(fn) { cleanups.push(fn); }
export function runCleanups() { const c = cleanups; cleanups = []; c.forEach(fn => { try { fn(); } catch {} }); }
export function abortAll() { token++; clearSubs(); runCleanups(); }

// Ждем клик по элементу, подходящему под selector внутри root.
export function pickFrom(root, sel) {
  const t = token;
  return new Promise(res => {
    const fn = e => {
      const x = e.target.closest(sel);
      if (!x || !root.contains(x) || x.disabled || x.classList.contains('used')) return;
      root.removeEventListener('click', fn);
      A.sfx('click');
      res(x);
    };
    root.addEventListener('click', fn);
    cleanup(() => root.removeEventListener('click', fn));
  }).then(x => { check(t); return x; });
}

export function onceClick(el) {
  const t = token;
  return new Promise(res => {
    const fn = () => { el.removeEventListener('click', fn); A.sfx('click'); res(el); };
    el.addEventListener('click', fn);
    cleanup(() => el.removeEventListener('click', fn));
  }).then(x => { check(t); return x; });
}

export function until(setup) {
  const t = token;
  return new Promise(res => setup(res)).then(v => { check(t); return v; });
}

// ---------- реплики ----------
// Окно диалога: кто говорит (лицо, имя, должность) и реплика целиком.
const LABELS = { all: 'ВСЕ', office: 'КОЛЛЕГИ', sys: 'СИСТЕМА', reader: 'СЧИТЫВАТЕЛЬ', bear: '???' };
const ROLES = { all: 'хором', office: 'откуда-то из офиса', sys: '', reader: 'у двери офиса 205', bear: '' };
function labelOf(who) {
  if (!who) return '';
  if (Array.isArray(who)) return who.map(labelOf).join(' И ');
  return LABELS[who] || (PEOPLE[who]?.name || who).toUpperCase();
}
function roleOf(who) {
  if (Array.isArray(who)) {
    const d = Object.values(DEPTS).find(x => who.every(id => x.cast.includes(id)));
    return d ? d.sign.toLowerCase() : '';
  }
  return who in ROLES ? ROLES[who] : (PEOPLE[who]?.role || '');
}
function highlight(who, on, keepDim = false) {
  const top = $('#screens .screen:last-child');
  if (!who || !top) return;
  if (on) top.classList.add('speaking'); else if (!keepDim) top.classList.remove('speaking');
  if (who === 'all') { top.classList.toggle('chorus', on); $('.person', top).forEach(el => el.classList.toggle('talking', on)); return; }
  (Array.isArray(who) ? who : [who]).forEach(id => $$(`[data-person="${id}"]`, top).forEach(el => el.classList.toggle('talking', on)));
}

let sayId = 0;
export function clearSubs() { sayId++; const s = $('#subs'); s.className = ''; s.innerHTML = ''; $$('#screens .speaking').forEach(e => e.classList.remove('speaking')); }

// block: окно ловит нажатия. Первое нажатие допечатывает реплику, второе листает дальше.
// Без нажатий реплика сама уходит, когда ее успели бы прочитать.
export async function say(who, text, { block = true, big = false } = {}) {
  const t = token, id = ++sayId;
  const subs = $('#subs');
  subs.className = 'show' + (block ? ' block' : ' aside') + (big ? ' big' : '');
  subs.innerHTML = `<div class="dlg">
    ${who ? `<div class="dlg-who">${avatar(who)}<span class="dlg-name"><b>${labelOf(who)}</b>${roleOf(who) ? `<small>${roleOf(who)}</small>` : ''}</span></div>` : ''}
    <p class="dlg-text"><span class="dlg-on"></span><span class="dlg-off"></span></p>
    ${block ? '<div class="dlg-foot"><i class="dlg-timer"></i><span>нажми, чтобы дальше ›</span></div>' : ''}
  </div>`;
  const on = $('.dlg-on', subs), off = $('.dlg-off', subs), timer = $('.dlg-timer', subs);
  off.textContent = text;
  highlight(who, true);
  let tap = false, wake = null;
  const onTap = e => { e.preventDefault(); tap = true; wake && wake(); };
  if (block) subs.addEventListener('pointerdown', onTap);
  const nap = ms => new Promise(r => { wake = r; setTimeout(r, FAST ? ms / 10 : ms); });
  const alive = () => t === token && id === sayId;
  try {
    // печатаем по буквам, примерно 120 знаков в секунду
    const step = big ? text.length : 3;
    for (let n = 0; n < text.length && alive() && !tap; n += step) {
      on.textContent = text.slice(0, n + step);
      off.textContent = text.slice(n + step);
      if (n % 9 === 0) A.sfx('type');
      await nap(24);
    }
    on.textContent = text; off.textContent = '';
    tap = false;
    if (alive()) {
      const read = Math.round((block ? 800 : 700) + text.length * (block ? 32 : 28));
      if (timer) timer.style.animationDuration = `${FAST ? read / 10 : read}ms`;
      subs.classList.add('done');
      await nap(read);
    }
  } finally {
    if (block) subs.removeEventListener('pointerdown', onTap);
    highlight(who, false, id !== sayId);
    if (id === sayId) { subs.className = ''; subs.innerHTML = ''; }
  }
  check(t);
}

// Реплика фоном, не мешает нажимать.
export const aside = (who, text) => { say(who, text, { block: false }).catch(() => {}); };

// ---------- экраны и тосты ----------
export async function crt(html, ms = 1400, { bad = false } = {}) {
  const t = token;
  const el = h(`<div class="crt-pop"><div class="crt-box"><div class="crt-text">${html}</div></div></div>`);
  $('#overlay').append(el);
  A.sfx(bad ? 'deny' : 'beep');
  await sleep(ms);
  el.classList.add('out');
  await sleep(220);
  el.remove();
  check(t);
}

let toastTimer;
export function toast(text, ms = 2600) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  A.sfx('blip');
}

// ---------- панель задания ----------
export function panel(sc, html, { kind = 'paper', title = '' } = {}) {
  closePanel(sc, true);
  const el = h(`<div class="panel ${kind}">${title ? `<div class="panel-title">${title}</div>` : ''}<div class="panel-body">${html}</div></div>`);
  sc.el.append(el);
  sc.panel = el;
  const app = $('#app');
  const upd = () => app.style.setProperty('--subs-bottom', `calc(var(--clue-h) + ${el.offsetHeight + 16}px)`);
  const ro = new ResizeObserver(upd);
  ro.observe(el);
  el._ro = ro;
  void el.offsetHeight;
  upd();
  el.classList.add('open');
  return el.querySelector('.panel-body');
}

export function closePanel(sc, instant = false) {
  const p = sc?.panel;
  if (!p) return;
  sc.panel = null;
  p._ro?.disconnect();
  $('#app').style.removeProperty('--subs-bottom');
  if (instant) { p.remove(); return; }
  p.classList.remove('open');
  setTimeout(() => p.remove(), 320);
}

export async function choose(sc, options, { title = '', kind = 'crt' } = {}) {
  const body = panel(sc, `<div class="stack">${options.map((o, i) => `<button class="btn ghost wide opt" data-i="${i}">${o}</button>`).join('')}</div>`, { kind, title });
  const b = await pickFrom(body, '[data-i]');
  closePanel(sc);
  return +b.dataset.i;
}

// ---------- листы поверх экрана ----------
export function sheet(html, { btn = 'Закрыть', cls = '', onOpen } = {}) {
  const el = h(`<div class="sheet-wrap ${cls}"><div class="sheet">${html}</div><button class="btn sheet-btn">${btn}</button></div>`);
  $('#overlay').append(el);
  onOpen?.(el);
  return new Promise(res => el.querySelector('.sheet-btn').addEventListener('click', () => {
    A.sfx('click');
    el.classList.add('out');
    setTimeout(() => el.remove(), 240);
    res(el);
  }, { once: true }));
}

export async function clueAward(text, from, floor) {
  const t = token;
  await crt('ПОДСКАЗКА<br>ПОЛУЧЕНА', 800);
  const el = h(`<div class="sheet-wrap clue-wrap">
    <div class="paper clue-paper"><div class="clue-head">ПОДСКАЗКА · ${floor} ЭТАЖ · ${from}</div><div class="clue-text">${text}</div><div class="stamp">ВЫДАНО</div></div>
    <button class="btn">Забрать</button></div>`);
  $('#overlay').append(el);
  const taken = new Promise(r => el.querySelector('.btn').addEventListener('click', r, { once: true }));
  A.sfx('paper');
  await sleep(400);
  el.querySelector('.stamp').classList.add('hit');
  A.sfx('stamp');
  await taken;
  A.sfx('whoosh');
  el.classList.add('fly');
  await sleep(450);
  el.remove();
  check(t);
}

// ---------- проверка ответов ----------
export function norm(s) {
  return s.toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
// Совпадение целиком или по любому слову; для слов от 5 букв прощаем одну опечатку.
export function matches(input, list) {
  const x = norm(input);
  if (!x) return false;
  const words = [x, ...x.split(' ')];
  return list.some(w => {
    const y = norm(w);
    return words.some(v => v === y || (y.length >= 5 && Math.abs(v.length - y.length) <= 1 && lev(v, y) <= 1));
  });
}
