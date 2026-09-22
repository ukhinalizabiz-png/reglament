// Зерно, мигание ламп, тряска, конфетти.
import * as A from './audio.js';

export function startNoise(canvas) {
  const w = 120, hgt = 214;
  canvas.width = w; canvas.height = hgt;
  const c = canvas.getContext('2d');
  const frames = Array.from({ length: 5 }, () => {
    const img = c.createImageData(w, hgt);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    return img;
  });
  let k = 0;
  setInterval(() => { if (!document.hidden) c.putImageData(frames[k++ % frames.length], 0, 0); }, 83);
}

export function flicker(times = 3) {
  const f = document.querySelector('#fx .flash');
  const kf = [{ opacity: 0 }];
  for (let i = 0; i < times; i++) kf.push({ opacity: 0.75 }, { opacity: 0.1 });
  kf.push({ opacity: 0 });
  f.animate(kf, { duration: 140 * times + 120, easing: 'steps(1, end)' });
}

// Время от времени одна из ламп на экране моргает.
export function lampLife() {
  const go = () => {
    const top = document.querySelector('#screens .screen:last-child');
    const lamps = [...(top?.querySelectorAll('.lamp') || [])];
    const bg = top?.querySelector('.scene-bg');
    if (!lamps.length && bg) lamps.push(bg);
    if (lamps.length && !document.hidden) {
      const l = lamps[Math.floor(Math.random() * lamps.length)];
      l.classList.add('flick');
      if (Math.random() < 0.4) A.sfx('buzz');
      setTimeout(() => l.classList.remove('flick'), 420);
    }
    setTimeout(go, 5000 + Math.random() * 9000);
  };
  setTimeout(go, 4000);
}

export function shake(el) {
  el?.animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' },
    { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' },
  ], { duration: 280 });
}

const COLORS = ['#f6d86b', '#ff8fb1', '#8fd6ff', '#b6f59b', '#ffffff', '#ffb46b', '#c9a8ff'];

// Хлопушки из двух нижних углов.
export function confetti(n = 90) {
  const box = document.getElementById('confetti');
  const W = box.clientWidth, H = box.clientHeight;
  for (let i = 0; i < n; i++) {
    const left = i % 2 === 0;
    const p = document.createElement('i');
    p.style.background = COLORS[i % COLORS.length];
    p.style.width = `${5 + Math.random() * 6}px`;
    p.style.height = `${8 + Math.random() * 8}px`;
    box.appendChild(p);
    const x0 = left ? -10 : W + 10, y0 = H * 0.9;
    const vx = (left ? 1 : -1) * (W * (0.25 + Math.random() * 0.6));
    const peak = H * (0.25 + Math.random() * 0.55);
    const rot = (Math.random() * 2 - 1) * 900;
    const dur = 1800 + Math.random() * 1600;
    const a = p.animate([
      { transform: `translate(${x0}px, ${y0}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${x0 + vx * 0.6}px, ${y0 - peak}px) rotate(${rot * 0.5}deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${x0 + vx}px, ${H + 30}px) rotate(${rot}deg)`, opacity: 0.9 },
    ], { duration: dur, easing: 'cubic-bezier(.2,.7,.4,1)', delay: Math.random() * 180, fill: 'backwards' });
    a.onfinish = () => p.remove();
  }
  A.sfx('pop');
  setTimeout(() => A.sfx('pop'), 120);
}
