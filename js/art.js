// Графика: люди в костюмах с настоящими лицами, мониторы, медведь с логотипа, часы, предметы.
import { PEOPLE, FACES, CAMS } from './data.js';

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SUIT = `
<path class="suit" d="M14 200 L18 98 Q20 75 40 68 L50 78 L60 68 Q80 75 82 98 L86 200 Z"/>
<path class="shirt" d="M41 67 L50 98 L59 67 L55 63 L45 63 Z"/>
<path class="tie" d="M48 72 L52 72 L55 104 L50 113 L45 104 Z"/>
<path class="lapel" d="M40 68 L47 100 M60 68 L53 100"/>
<path class="arm" d="M24 112 L22 176 M76 112 L78 176"/>`;
const NECK = `<rect class="neck" x="43" y="50" width="14" height="17" rx="4"/>`;

// Нет фото: голова закрыта мозаикой, как у засекреченного свидетеля.
const hash = s => { let x = 7; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return () => ((x = (x * 1103515245 + 12345) >>> 0) / 4294967296); };
const MOSAIC_TONES = ['#23342a', '#3a5243', '#5b7763', '#7f9b85', '#a4bea8'];
function mosaic(id) {
  const rnd = hash(id);
  let out = '';
  const s = 4.4;
  for (let y = 12; y < 56; y += s) for (let x = 32; x < 68; x += s) {
    const cx = x + s / 2, cy = y + s / 2;
    if (((cx - 50) / 17.5) ** 2 + ((cy - 34) / 21.5) ** 2 > 1) continue;
    const hair = cy < 22 || (cy < 32 && Math.abs(cx - 50) > 12);
    const t = hair ? Math.floor(rnd() * 2) : 1 + Math.floor(rnd() * 4);
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s + 0.2}" height="${s + 0.2}" fill="${MOSAIC_TONES[t]}"/>`;
  }
  return `<g class="mosaic">${out}</g><g class="f-grin"><circle cx="43.5" cy="31.5" r="2.4"/><circle cx="56.5" cy="31.5" r="2.4"/><path d="M34 40 Q50 63 66 40 Z"/><path class="grin-teeth" d="M36.5 41.2 Q50 50 63.5 41.2 Z"/></g>`;
}

const SNOW = `<g class="snow"><rect x="69" y="64" width="15" height="128" rx="7.5" transform="rotate(10 76 128)"/><rect class="snow-bind" x="70" y="100" width="13" height="8" rx="2" transform="rotate(10 76 128)"/><rect class="snow-bind" x="70" y="146" width="13" height="8" rx="2" transform="rotate(10 76 128)"/></g>`;

// Голова-вырезка лежит под костюмом: воротник закрывает шею.
// Кадр 300x365, ширина лица 43.5% кадра. На фигуре: left 11%, top -0.7%, width 78%, height 47.45%.
const FACE_BOX = { left: 11, top: -0.7, w: 78, h: 47.45 };
function grinOverlay(mouth) {
  const [mx, my] = mouth;
  const left = FACE_BOX.left + mx * FACE_BOX.w, top = FACE_BOX.top + my * FACE_BOX.h;
  return `<svg class="grin-ov" viewBox="0 0 60 30" style="left:${(left - 21).toFixed(1)}%;top:${(top - 4.2).toFixed(1)}%" aria-hidden="true"><path d="M2 4 Q30 40 58 4 Q30 14 2 4 Z"/><path class="grin-teeth" d="M6 6.5 Q30 22 54 6.5 Q30 13 6 6.5 Z"/></svg>`;
}

export function person(id, { cls = '', name = true, snow = false } = {}) {
  const p = PEOPLE[id];
  if (!p) return '';
  if (p.remote) return monitor(id, { cls, name });
  const f = FACES[id];
  const badge = name ? `<span class="pname">${esc(p.name)}</span>` : '';
  if (f) {
    return `<div class="person has-face ${cls}" data-person="${id}">
      <img class="face" src="${f.n}" alt="" draggable="false">
      <svg class="fig" viewBox="0 0 100 200" aria-hidden="true">${SUIT}${snow ? SNOW : ''}</svg>
      ${grinOverlay(f.mouth)}${badge}
    </div>`;
  }
  return `<div class="person no-face ${cls}" data-person="${id}">
    <svg class="fig" viewBox="0 0 100 200" aria-hidden="true">${SUIT}${NECK}${mosaic(id)}${snow ? SNOW : ''}</svg>${badge}
  </div>`;
}

// Экран удалёнщика: кадр с камеры или «камера выключена».
export function monFace(id) {
  const cam = CAMS[id];
  if (cam) return `<img class="mon-cam" src="${cam}" alt="" draggable="false">`;
  const p = PEOPLE[id];
  return `<span class="mon-off"><b>${esc(p.name[0])}</b><small>камера выключена</small></span>`;
}

export function monitor(id, { cls = '', name = true } = {}) {
  const p = PEOPLE[id];
  return `<div class="person remote ${cls}" data-person="${id}">
    <div class="mon"><div class="mon-screen">${monFace(id)}<i class="static"></i><b class="mon-msg">ВСЁ В ПОРЯДКЕ. ПРОДОЛЖАЙТЕ РАБОТАТЬ</b></div></div>
    <svg class="chair" viewBox="0 0 100 60" aria-hidden="true"><rect class="seat" x="14" y="2" width="72" height="11" rx="4"/><path class="legs" d="M50 13 V42 M22 56 L50 44 L78 56"/></svg>
    ${name ? `<span class="pname">${esc(p.name)}</span>` : ''}
  </div>`;
}

// Кружок с лицом для окна диалога.
const GROUP_ICON = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="15" r="5"/><circle cx="26" cy="15" r="5"/><path d="M4 33 Q6 22 14 22 Q20 22 21 27 Q22 22 26 22 Q34 22 36 33 Z"/></svg>`;
const READER_ICON = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="11" y="6" width="18" height="28" rx="3"/><circle class="led-dot" cx="20" cy="13" r="3"/><rect class="scr" x="14" y="19" width="12" height="9" rx="1"/></svg>`;
export function avatar(id) {
  if (Array.isArray(id)) return `<span class="ava-pair">${id.map(avatar).join('')}</span>`;
  if (FACES[id]) return `<i class="ava" style="background-image:url(${FACES[id].n})"></i>`;
  if (CAMS[id]) return `<i class="ava cam" style="background-image:url(${CAMS[id]})"></i>`;
  const p = PEOPLE[id];
  if (p?.remote) return `<i class="ava letter"><b>${esc(p.name[0])}</b></i>`;
  if (p) return `<i class="ava mosaic"><svg viewBox="31 11 38 46" aria-hidden="true">${mosaic(id)}</svg></i>`;
  if (id === 'reader') return `<i class="ava icon">${READER_ICON}</i>`;
  if (id === 'bear') return `<i class="ava icon" style="background-image:url(assets/bear.webp)"></i>`;
  return `<i class="ava icon">${GROUP_ICON}</i>`;
}

// Медведь с логотипа TERRO. Поверх картинки: зрачки, «китайская» улыбка, праздничный колпак.
// Координаты в пикселях картинки 600x610.
function bearOverlay() {
  return `<svg class="b-over" viewBox="0 0 600 610" preserveAspectRatio="none" aria-hidden="true">
    <circle class="b-pupil" cx="199" cy="224" r="15"/><circle class="b-pupil" cx="403" cy="224" r="15"/>
    <g class="b-smile"><path class="b-cover" d="M238 348 L362 348 L364 520 Q364 594 300 596 Q236 594 236 520 Z"/><path class="b-smile-line" d="M250 418 Q300 486 350 418"/></g>
    <g class="b-hat"><path class="hat-cone" d="M222 70 L300 -150 L378 70 Z"/><path class="hat-stripe" d="M250 -8 L350 -8 M272 -80 L328 -80"/><circle class="hat-pom" cx="300" cy="-160" r="26"/></g>
  </svg>`;
}
export function bearInner(ink = false) {
  return `<image href="assets/${ink ? 'bear-ink' : 'bear'}.webp" width="600" height="610"/>`;
}
export function bear({ cls = '', ink = false } = {}) {
  return `<span class="bear ${ink ? 'ink ' : ''}${cls}"><img src="assets/${ink ? 'bear-ink' : 'bear'}.webp" alt="" draggable="false">${bearOverlay()}</span>`;
}

// Зрачки медведя: dx, dy от -3 до 3.
export function lookAt(el, dx, dy) {
  el?.querySelectorAll('.b-pupil').forEach(p => { p.style.transform = `translate(${dx * 4}px, ${dy * 3}px)`; });
}

let TICKS = '';
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6, r1 = i % 3 === 0 ? 13 : 15, r2 = 16.6;
  TICKS += `<line x1="${(20 + r1 * Math.sin(a)).toFixed(2)}" y1="${(20 - r1 * Math.cos(a)).toFixed(2)}" x2="${(20 + r2 * Math.sin(a)).toFixed(2)}" y2="${(20 - r2 * Math.cos(a)).toFixed(2)}"/>`;
}

// Часы, на которых всегда 9:59.
export function clock(cls = '') {
  return `<svg class="clock ${cls}" viewBox="0 0 40 40" aria-hidden="true"><circle class="c-face" cx="20" cy="20" r="18.5"/><g class="c-ticks">${TICKS}</g><line class="c-h" x1="20" y1="20" x2="20" y2="10.5"/><line class="c-m" x1="20" y1="20" x2="20" y2="5.5"/><line class="c-s" x1="20" y1="23" x2="20" y2="4.5"/><circle class="c-pin" cx="20" cy="20" r="1.3"/></svg>`;
}

let HOLES = '';
for (let i = 0; i < 10; i++) {
  const a = (i * 27 + 40) * Math.PI / 180;
  HOLES += `<circle cx="${(60 + 10.5 * Math.cos(a)).toFixed(1)}" cy="${(55 + 10.5 * Math.sin(a)).toFixed(1)}" r="2.3"/>`;
}

export const PHONE = `<svg class="phone" viewBox="0 0 120 80" aria-hidden="true">
  <path class="ph-base" d="M18 78 L30 34 Q60 26 90 34 L102 78 Z"/>
  <circle class="ph-dial" cx="60" cy="55" r="16"/><g class="ph-holes">${HOLES}</g><circle class="ph-dial-in" cx="60" cy="55" r="5"/>
  <path class="ph-cord" d="M16 30 Q2 50 14 64 Q26 76 18 78"/>
  <path class="ph-handset" d="M8 25 Q8 11 22 11 L98 11 Q112 11 112 25 L112 29 Q112 33 104 33 L92 33 Q88 33 88 27 L88 23 L32 23 L32 27 Q32 33 26 33 L16 33 Q8 33 8 29 Z"/>
</svg>`;

export const FAX = `<svg class="fax" viewBox="0 0 120 84" aria-hidden="true">
  <rect class="fx-paper" x="30" y="2" width="60" height="30" rx="1"/>
  <rect class="fx-body" x="6" y="28" width="108" height="50" rx="7"/>
  <rect class="fx-slot" x="24" y="25" width="72" height="8" rx="2"/>
  <rect class="fx-panel" x="74" y="40" width="32" height="26" rx="3"/>
  <g class="fx-keys"><rect x="14" y="44" width="8" height="6" rx="1"/><rect x="26" y="44" width="8" height="6" rx="1"/><rect x="38" y="44" width="8" height="6" rx="1"/><rect x="14" y="54" width="8" height="6" rx="1"/><rect x="26" y="54" width="8" height="6" rx="1"/><rect x="38" y="54" width="8" height="6" rx="1"/></g>
</svg>`;

export const IRON = `<svg class="iron" viewBox="0 0 80 60" aria-hidden="true"><path d="M4 18 Q4 11 14 11 L62 11 Q76 12 77 18 L77 21 L4 21 Z"/><path class="legs" d="M22 21 L52 56 M54 21 L24 56"/></svg>`;

// Доска для «найди отличия»: настоящее фото TERRO, отличия нарисованы поверх.
// sample: образец с фабрики, где «TERO», медведь улыбается и длина другая.
export function board({ sample = false } = {}) {
  return `<div class="bd ${sample ? 'sample' : 'ref'}">
    <img class="bd-img" src="assets/goods/board_mid.webp" alt="${sample ? 'Образец с фабрики' : 'Наш макет'}" draggable="false">
    <span class="bd-el bd-logo" ${sample ? 'data-diff="logo"' : ''}>${sample ? 'TERO' : 'TERRO'}</span>
    <span class="bd-el bd-bear" ${sample ? 'data-diff="bear"' : ''}>${bear({ cls: sample ? 'smile' : '' })}</span>
    <span class="bd-el bd-num" ${sample ? 'data-diff="num"' : ''}>${sample ? '56' : '55'}</span>
    ${sample ? '<i class="bd-hit"></i>' : ''}
  </div>`;
}

export const MIC = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none"/><path class="mic-slash" d="M4 4 L20 20" fill="none"/></svg>`;

export const SPEAKER = (on) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${on ? '<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none"/>' : '<path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none"/>'}</svg>`;

export const TURNTABLE = `<svg class="turntable" viewBox="0 0 160 90" aria-hidden="true">
  <rect class="tt-base" x="4" y="20" width="152" height="66" rx="6"/>
  <g transform="translate(70 52) scale(1 .54)"><g class="tt-spin"><circle class="tt-disc" r="48"/><circle class="tt-groove" r="38"/><circle class="tt-groove" r="28"/><circle class="tt-label" r="13"/><rect class="tt-shine" x="-2" y="-46" width="4" height="15" rx="2"/><circle class="tt-hole" r="2"/></g></g>
  <path class="tt-arm" d="M140 30 L132 58 L108 62"/><circle class="tt-pivot" cx="140" cy="30" r="5"/>
</svg>`;

// ---------- ребусы из песен: рисованные картинки вместо эмодзи ----------
const GEAR = (cx, cy, r) => {
  let teeth = '';
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    teeth += `<rect x="${(cx + Math.cos(a) * r - 3.2).toFixed(1)}" y="${(cy + Math.sin(a) * r - 3.2).toFixed(1)}" width="6.4" height="6.4" transform="rotate(${i * 45} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)})"/>`;
  }
  return `${teeth}<circle cx="${cx}" cy="${cy}" r="${r}" class="rb-o"/><circle cx="${cx}" cy="${cy}" r="${r * 0.38}" class="rb-o"/>`;
};
const MAN = (x, y, s = 1, run = false) => `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="0" cy="-26" r="7"/>
  <rect x="-4" y="-18" width="8" height="20" rx="2"/>
  ${run ? '<path class="rb-l" d="M-3 2 L-14 16 M3 2 L12 14 M-4 -12 L-16 -18 M4 -12 L16 -6"/>' : '<path class="rb-l" d="M-3 2 L-6 20 M3 2 L6 20 M-4 -12 L-12 -2 M4 -12 L12 -2"/>'}
</g>`;
const KEY = (x, y, w, label) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="22" rx="3" class="rb-o"/><text x="${w / 2}" y="16" text-anchor="middle" class="rb-t">${label}</text></g>`;

export const REBUS_ART = {
  bike: `<svg class="rb" viewBox="0 0 120 80" aria-hidden="true">
    ${GEAR(32, 46, 17)}${GEAR(74, 50, 12)}
    <path class="rb-l" d="M32 29 L74 38 M32 63 L74 62" />
    <g transform="translate(97 20)"><path d="M-9 14 Q-9 0 0 0 Q9 0 9 14 Z"/><rect x="-11" y="14" width="22" height="3.5" rx="1.5"/><circle cx="0" cy="21" r="3"/><rect x="-1.6" y="-5" width="3.2" height="5"/></g>
  </svg>`,
  simple: `<svg class="rb" viewBox="0 0 120 80" aria-hidden="true">
    <text x="4" y="50" class="rb-big">2+2=4</text>
    <path class="rb-check" d="M92 40 L100 50 L115 25"/>
  </svg>`,
  run: `<svg class="rb" viewBox="0 0 120 80" aria-hidden="true">
    ${MAN(76, 58, 1.15, true)}
    <g class="rb-dust"><circle cx="34" cy="50" r="11"/><circle cx="18" cy="56" r="8"/><circle cx="46" cy="60" r="7"/><circle cx="8" cy="62" r="5"/></g>
    <path class="rb-l" d="M2 40 L26 40 M6 30 L22 30" />
  </svg>`,
  bandits: `<svg class="rb" viewBox="0 0 120 80" aria-hidden="true">
    <g transform="translate(4 18)"><rect x="0" y="4" width="18" height="13" rx="4"/><rect x="24" y="4" width="18" height="13" rx="4"/><rect x="17" y="8" width="8" height="3.5"/></g>
    <g transform="translate(52 24)"><path d="M6 12 Q2 40 18 40 Q34 40 30 12 Z"/><rect x="4" y="6" width="28" height="7" rx="2"/><text x="18" y="34" text-anchor="middle" class="rb-t inv">₽</text></g>
    <g transform="translate(98 16)"><path d="M-10 16 Q-10 0 0 0 Q10 0 10 16 Z"/><rect x="-13" y="16" width="26" height="4" rx="2"/><path class="rb-l" d="M-16 -4 L-22 -10 M16 -4 L22 -10 M0 -8 L0 -16"/></g>
  </svg>`,
  copy: `<svg class="rb" viewBox="0 0 120 80" aria-hidden="true">
    ${KEY(6, 6, 48, 'Ctrl+C')}${KEY(62, 6, 48, 'Ctrl+V')}
    ${MAN(40, 74, 0.9)}${MAN(80, 74, 0.9)}
  </svg>`,
};
