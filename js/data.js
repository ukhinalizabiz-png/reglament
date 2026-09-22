// Люди, отделы и раскладка офиса. Тексты реплик лежат в tasks.js и gates.js.

export const PEOPLE = {
  ira:      { name: 'Ира',    role: 'главный бухгалтер' },
  vika_b:   { name: 'Вика',   role: 'бухгалтер, оплаты от продаж' },
  leonid:   { name: 'Леонид', role: 'руководитель отдела продаж' },
  egor:     { name: 'Егор',   role: 'менеджер по продажам' },
  nastya:   { name: 'Настя',  role: 'менеджер по продажам' },
  andrey:   { name: 'Андрей', role: 'продажи, Сибирь · на мониторе', remote: true },
  yulya:    { name: 'Юля',    role: 'три склада и логистика' },
  tanya:    { name: 'Таня',   role: 'документы и логистика' },
  viktor:   { name: 'Виктор', role: 'продукт, связь с Китаем' },
  asya:     { name: 'Ася',    role: 'поставки из Китая' },
  liza:     { name: 'Лиза',   role: 'маркетолог' },
  yana:     { name: 'Яна',    role: 'SMM · на мониторе', remote: true },
  nata:     { name: 'Ната',   role: 'инфлюенс-менеджер · на мониторе', remote: true },
  sergey_d: { name: 'Сергей', role: 'руководитель дизайна · на мониторе', remote: true },
  anara:    { name: 'Анара',  role: 'дизайнер · на мониторе', remote: true },
  seryozha: { name: 'Серёжа', role: 'коммерческий директор' },
  vlad:     { name: 'Влад',   role: 'единственный айтишник' },
  masha_m:  { name: 'Маша',   role: 'маркетинг коммерции' },
  vika_s:   { name: 'Вика',   role: 'поддержка клиентов' },
  masha_s:  { name: 'Маша',   role: 'техподдержка · на мониторе', remote: true },
  katya:    { name: 'Катя',   role: 'маркетплейсы · на мониторе', remote: true },
  yura:     { name: 'Юра',    role: 'именинник' },
};

// Лица. n: вырезанная голова в зелёной гамме, mouth: где рот (для жуткой улыбки в сцене сбоя).
// У кого фото нет, голова закрыта мозаикой.
export const FACES = {
  asya: { n: 'assets/faces/asya.webp', mouth: [0.473, 0.589] },
  egor: { n: 'assets/faces/egor.webp', mouth: [0.461, 0.544] },
  vika_s: { n: 'assets/faces/vika_s.webp', mouth: [0.529, 0.545] },
  yulya: { n: 'assets/faces/yulya.webp', mouth: [0.613, 0.544] },
  ira: { n: 'assets/faces/ira.webp', mouth: [0.522, 0.547] },
  leonid: { n: 'assets/faces/leonid.webp', mouth: [0.457, 0.551] },
  liza: { n: 'assets/faces/liza.webp', mouth: [0.507, 0.544] },
  masha_m: { n: 'assets/faces/masha_m.webp', mouth: [0.416, 0.544] },
  nastya: { n: 'assets/faces/nastya.webp', mouth: [0.511, 0.547] },
  seryozha: { n: 'assets/faces/seryozha.webp', mouth: [0.482, 0.55] },
  tanya: { n: 'assets/faces/tanya.webp', mouth: [0.448, 0.546] },
  vika_b: { n: 'assets/faces/vika_b.webp', mouth: [0.614, 0.541] },
  viktor: { n: 'assets/faces/viktor.webp', mouth: [0.493, 0.553] },
  yura: { n: 'assets/faces/yura.webp', mouth: [0.513, 0.55] },
};

// Кадры «с камеры» для мониторов удалёнщиков и пропуска Юры. Нет кадра: «камера выключена».
export const CAMS = {
  andrey: 'assets/faces/andrey-cam.webp',
  anara: 'assets/faces/anara-cam.webp',
  nata: 'assets/faces/nata-cam.webp',
  sergey_d: 'assets/faces/sergey_d-cam.webp',
  yana: 'assets/faces/yana-cam.webp',
  yura: 'assets/faces/yura-cam.webp',
};

// Общее фото команды для финала (если пришлют).
export const GROUP_PHOTO = '';

export const DEPTS = {
  buh:     { floor: 1, sign: 'БУХГАЛТЕРИЯ',  from: 'БУХГАЛТЕРИЯ',   cast: ['ira', 'vika_b'] },
  sales:   { floor: 1, sign: 'ОТДЕЛ ПРОДАЖ', from: 'ОТДЕЛ ПРОДАЖ',  cast: ['leonid', 'egor', 'nastya', 'andrey'] },
  log:     { floor: 1, sign: 'ЛОГИСТИКА',    from: 'ЛОГИСТИКА',     cast: ['yulya', 'tanya'] },
  prod:    { floor: 1, sign: 'ПРОДУКТ',      from: 'ПРОДУКТ',       cast: ['viktor', 'asya'] },
  mkt:     { floor: 1, sign: 'МАРКЕТИНГ',    from: 'МАРКЕТИНГ',     cast: ['liza', 'yana', 'nata'] },
  design:  { floor: 1, sign: 'ДИЗАЙН',       from: 'ДИЗАЙН',        cast: ['sergey_d', 'anara'] },
  haggle:  { floor: 2, sign: 'КОММ. ДИРЕКТОР', from: 'СЕРЁЖА',      cast: ['seryozha'] },
  captcha: { floor: 2, sign: 'IT',           from: 'IT-ОТДЕЛ',      cast: ['vlad'] },
  dossier: { floor: 2, sign: 'МАРКЕТИНГ И ПОДДЕРЖКА', short: 'ПОДДЕРЖКА', from: 'ПОДДЕРЖКА', cast: ['masha_m', 'vika_s'] },
  call:    { floor: 2, sign: 'УДАЛЁНКА',     from: 'КАТЯ',          cast: ['masha_s', 'katya'] },
};

export const NEED = { 1: 6, 2: 4 };

// Координаты зон на разрезе здания, в процентах (здание 9:16).
export const ZONES = {
  haggle:  { x: 3,     y: 6,    w: 46,   h: 15 },
  captcha: { x: 51,    y: 6,    w: 46,   h: 15 },
  dossier: { x: 3,     y: 22,   w: 38,   h: 15 },
  call:    { x: 42,    y: 22,   w: 28,   h: 15 },
  meeting: { x: 71,    y: 22,   w: 26,   h: 15 },
  buh:     { x: 3,     y: 43,   w: 30.5, h: 14.5 },
  sales:   { x: 34.75, y: 43,   w: 30.5, h: 14.5 },
  log:     { x: 66.5,  y: 43,   w: 30.5, h: 14.5 },
  prod:    { x: 3,     y: 58.5, w: 30.5, h: 14.5 },
  mkt:     { x: 34.75, y: 58.5, w: 30.5, h: 14.5 },
  design:  { x: 66.5,  y: 58.5, w: 30.5, h: 14.5 },
  door:    { x: 3,     y: 74,   w: 22,   h: 18 },
  lobby:   { x: 26,    y: 74,   w: 36,   h: 18 },
  stairs:  { x: 63,    y: 74,   w: 34,   h: 18 },
};

export const WALL_SIGNS = {
  buh: 'Подсказки выдаются по предъявлению пропуска',
  sales: 'Сноуборд без согласования не выносить',
  log: 'Именинник, соблюдай регламент',
  prod: 'Сноуборд без согласования не выносить',
  mkt: 'Подсказки выдаются по предъявлению пропуска',
  design: 'Именинник, соблюдай регламент',
  haggle: 'Подсказки выдаются по предъявлению пропуска',
  captcha: 'Именинник, соблюдай регламент',
  dossier: 'Сноуборд без согласования не выносить',
  call: 'Подсказки выдаются по предъявлению пропуска',
};

// Порядок, в котором отделы «зовут» Юру. Проходить можно в любом порядке,
// но подсвечивается всегда первый несделанный.
export const ORDER = { 1: ['buh', 'sales', 'log', 'prod', 'mkt', 'design'], 2: ['haggle', 'captcha', 'dossier', 'call'] };

// Чем зовут в офисе: реплика над отделом.
export const CALLS = {
  buh: 'Налоговая просила передать: тебе…',
  sales: 'Юра, к нам едут вышибалы!',
  log: 'Китайцы прислали не тот стафф',
  prod: 'Пришёл образец с фабрики!',
  mkt: 'Давай создадим аккаунт на Онлифанс',
  design: 'Хорошо, что объяснил. Плохо, что мы не поняли',
  haggle: 'Есть подсказка. Недорого',
  captcha: 'Нужна проверка',
  dossier: 'Клиенты ждут ответа!',
  call: 'Юра, ты на мьюте!',
  stairs: 'Проход только для угадавших',
  meeting: 'Переговорная свободна',
};

// Фоны из фото офиса (зелёная гамма).
export const BG = {
  buh: 'buh', sales: 'sales', log: 'log', prod: 'prod', mkt: 'mkt', design: 'design',
  haggle: 'haggle', captcha: 'captcha', dossier: 'dossier', call: 'call',
  meeting: 'meeting', lobby: 'lobby', stairs: 'stairs',
};
