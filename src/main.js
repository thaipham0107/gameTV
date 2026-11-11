import './style.css';
import { SOUND_GROUPS, LEVELS, MONSTERS, QUESTIONS_PER_MATCH, buildQuiz } from './data.js';
import { hasSpeechRecognition, listen, speakText, judge } from './speech.js';
import { sfx, sfxState } from './audio.js';

const STAGE_SIZE = 10; // mỗi 10 câu gặp một quái vật mới
const PASS_RATIO = 0.7; // đạt khi đúng từ 70% trở lên
const HIT_DAMAGE = 100 / STAGE_SIZE;
const DEFEAT_HP = 100 - 7 * HIT_DAMAGE; // đúng ≥7/10 câu thì hạ gục quái
const MAX_SPEAK_TRIES = 2;

const app = document.getElementById('app');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- Lưu trữ ----------

const STORE_KEY = 'dau-quai-vat.v1';
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}
const saved = load();
const settings = {
  groups: saved.groups?.length ? saved.groups : SOUND_GROUPS.map((g) => g.id),
  mode: hasSpeechRecognition ? saved.mode || 'both' : 'choose',
  sfx: saved.sfx !== false,
};
const best = saved.best || {}; // { [level]: { stars, acc } }
sfxState.on = settings.sfx;
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...settings, best }));
  } catch {
    /* bỏ qua: chế độ riêng tư */
  }
}

// ---------- Màn hình chính ----------

const MODES = [
  ['both', '🎤✍️ Nói + chọn'],
  ['speak', '🎤 Chỉ nói'],
  ['choose', '✍️ Chỉ chọn chính tả'],
];

const starsText = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

function renderHome() {
  const allOn = settings.groups.length === SOUND_GROUPS.length;
  app.innerHTML = `
  <main class="home">
    <header class="title">
      <div class="title-emoji">👊 👹</div>
      <h1>Đấu Quái Vật</h1>
      <p>Nói đúng, chọn đúng chính tả để đấm, đá hạ gục quái vật!</p>
    </header>

    <section class="card">
      <h2>1. Âm cần luyện</h2>
      <div class="chips" id="groups">
        ${SOUND_GROUPS.map((g) => `<button class="chip ${settings.groups.includes(g.id) ? 'on' : ''}" data-g="${g.id}">${esc(g.label)}</button>`).join('')}
        <button class="chip all ${allOn ? 'on' : ''}" data-g="all">Tất cả</button>
      </div>
    </section>

    <section class="card">
      <h2>2. Cách chơi</h2>
      <div class="chips" id="modes">
        ${MODES.map(([id, label]) => `<button class="chip ${settings.mode === id ? 'on' : ''}" data-m="${id}" ${!hasSpeechRecognition && id !== 'choose' ? 'disabled' : ''}>${label}</button>`).join('')}
      </div>
      ${hasSpeechRecognition ? '' : '<p class="note">Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy mở bằng Chrome hoặc Edge để luyện nói; tạm thời bạn vẫn luyện chọn chính tả được.</p>'}
    </section>

    <section class="card">
      <h2>3. Chọn cấp độ · ${QUESTIONS_PER_MATCH} câu / ván</h2>
      <div class="levels">
        ${LEVELS.map((lv, i) => {
          const b = best[i];
          return `<button class="level" data-l="${i}">
            <span class="lv-icon">${lv.icon}</span>
            <span class="lv-body"><strong>${esc(lv.name)}</strong><small>${esc(lv.desc)}</small></span>
            <span class="lv-stars ${b ? 'has' : ''}">${starsText(b ? b.stars : 0)}</span>
          </button>`;
        }).join('')}
      </div>
    </section>

    <footer class="foot">
      <button class="link" id="sfx">${settings.sfx ? '🔊 Âm thanh: bật' : '🔇 Âm thanh: tắt'}</button>
      <span>Ván đạt khi đúng từ ${PASS_RATIO * 100}% trở lên</span>
    </footer>
  </main>`;

  app.querySelector('#groups').onclick = (e) => {
    const g = e.target.closest('[data-g]')?.dataset.g;
    if (!g) return;
    if (g === 'all') settings.groups = SOUND_GROUPS.map((x) => x.id);
    else if (settings.groups.includes(g)) {
      if (settings.groups.length > 1) settings.groups = settings.groups.filter((x) => x !== g);
    } else settings.groups = [...settings.groups, g];
    save();
    renderHome();
  };
  app.querySelector('#modes').onclick = (e) => {
    const m = e.target.closest('[data-m]');
    if (!m || m.disabled) return;
    settings.mode = m.dataset.m;
    save();
    renderHome();
  };
  app.querySelector('.levels').onclick = (e) => {
    const l = e.target.closest('[data-l]')?.dataset.l;
    if (l !== undefined) startGame(+l);
  };
  app.querySelector('#sfx').onclick = () => {
    settings.sfx = !settings.sfx;
    sfxState.on = settings.sfx;
    save();
    renderHome();
  };
}

// ---------- Ván chơi ----------

let G = null; // trạng thái ván hiện tại

function startGame(level) {
  G = {
    level,
    quiz: buildQuiz(level, settings.groups, settings.mode),
    i: 0,
    correct: 0,
    streak: 0,
    hp: 100,
    stageHits: 0,
    wrong: [],
    attackKick: false,
    busy: false,
    rec: null,
    alive: true,
  };
  app.innerHTML = `
  <main class="game">
    <header class="hud">
      <button class="icon-btn" id="quit" aria-label="Thoát">✕</button>
      <div class="hud-mid"><strong>${esc(LEVELS[level].name)}</strong><span id="count"></span></div>
      <div class="combo" id="combo"></div>
    </header>
    <div class="progress" aria-hidden="true"><span id="prog"></span><i style="left:33.33%"></i><i style="left:66.66%"></i></div>
    <section class="arena" id="arena">
      <div class="fighter hero" id="hero">🦸</div>
      <div class="mbox" id="mbox">
        <div class="mname" id="mname"></div>
        <div class="hpbar"><span id="hp"></span></div>
        <div class="fighter monster" id="monster"></div>
      </div>
      <div class="banner" id="banner"></div>
    </section>
    <section class="panel" id="panel"></section>
  </main>`;
  app.querySelector('#quit').onclick = () => {
    if (confirm('Thoát ván này?')) endSession();
  };
  spawnMonster(0);
  showQuestion();
}

function endSession() {
  if (G) {
    G.alive = false;
    G.rec?.stop();
  }
  window.speechSynthesis?.cancel();
  G = null;
  renderHome();
}

const $ = (id) => document.getElementById(id);
const stageOf = (i) => Math.min(2, Math.floor(i / STAGE_SIZE));

function spawnMonster(stage) {
  const [emoji, name] = MONSTERS[G.level][stage];
  G.hp = 100;
  G.stageHits = 0;
  $('monster').textContent = emoji;
  $('mname').textContent = `${name} · màn ${stage + 1}/3`;
  $('hp').style.width = '100%';
  replay($('monster'), 'enter');
}

function replay(el, cls, ms = 600) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

function popText(text, cls = '') {
  const el = document.createElement('div');
  el.className = `pop ${cls}`;
  el.textContent = text;
  $('arena').appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function updateHud() {
  $('count').textContent = `Câu ${Math.min(G.i + 1, QUESTIONS_PER_MATCH)}/${QUESTIONS_PER_MATCH}`;
  $('prog').style.width = `${(G.i / QUESTIONS_PER_MATCH) * 100}%`;
  $('combo').textContent = G.streak >= 2 ? `🔥 x${G.streak}` : '';
}

const HIT_WORDS = ['BỐP!', 'BỤP!', 'CHÁT!', 'BÙM!'];

async function playerAttack() {
  const kick = G.attackKick;
  G.attackKick = !kick;
  const hero = $('hero');
  replay(hero, kick ? 'kick' : 'punch', 500);
  await sleep(220);
  sfx.hit();
  replay($('monster'), 'hurt', 450);
  popText(G.streak >= 5 ? 'SIÊU ĐÒN!' : HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)], kick ? 'kick' : 'punch');
  G.hp = Math.max(0, G.hp - HIT_DAMAGE);
  $('hp').style.width = `${G.hp}%`;
  G.stageHits++;
  await sleep(350);
}

async function monsterAttack() {
  replay($('monster'), 'strike', 500);
  await sleep(220);
  sfx.miss();
  replay($('hero'), 'hurt', 450);
  popText('ÁI!', 'ouch');
  await sleep(350);
}

async function stageEnd() {
  const [, name] = MONSTERS[G.level][stageOf(G.i - 1)];
  const monster = $('monster');
  if (G.hp <= DEFEAT_HP) {
    sfx.win();
    replay(monster, 'ko', 900);
    $('banner').textContent = `Hạ gục ${name}!`;
  } else {
    $('banner').textContent = `${name} chạy mất…`;
    replay(monster, 'flee', 900);
  }
  $('banner').classList.add('show');
  await sleep(1300);
  $('banner').classList.remove('show');
}

function showQuestion() {
  updateHud();
  const q = G.quiz[G.i];
  const panel = $('panel');
  G.busy = false;
  G.tries = 0;
  if (q.kind === 'speak') renderSpeak(panel, q);
  else if (q.kind === 'blank') renderBlank(panel, q);
  else renderFind(panel, q);
}

async function resolve(ok, answerText) {
  if (G.busy) return;
  G.busy = true;
  G.rec?.stop();
  const q = G.quiz[G.i];
  const fb = $('fb');
  if (ok) {
    G.correct++;
    G.streak++;
    fb.className = 'fb good';
    fb.textContent = ['Đúng rồi! 🎉', 'Tuyệt vời! ⭐', 'Giỏi quá! 👏', 'Chuẩn luôn! 💪'][G.i % 4];
    updateHud();
    await playerAttack();
  } else {
    G.streak = 0;
    G.wrong.push(q);
    fb.className = 'fb bad';
    fb.innerHTML = `Đáp án đúng: <strong>${esc(answerText)}</strong>`;
    updateHud();
    await monsterAttack();
  }
  if (ok) await sleep(450);
  else await waitNext();
  await advance();
}

function waitNext() {
  return new Promise((resolveWait) => {
    const row = document.createElement('div');
    row.className = 'actions';
    row.innerHTML = '<button class="btn big" id="next">Tiếp ▶</button>';
    $('panel').appendChild(row);
    $('next').focus();
    $('next').onclick = resolveWait;
  });
}

async function advance() {
  if (!G?.alive) return;
  G.i++;
  if (G.i % STAGE_SIZE === 0) await stageEnd();
  if (!G?.alive) return;
  if (G.i >= QUESTIONS_PER_MATCH) return renderResult();
  if (G.i % STAGE_SIZE === 0) spawnMonster(stageOf(G.i));
  showQuestion();
}

// ----- Dạng câu hỏi: nói -----

function renderSpeak(panel, q) {
  panel.innerHTML = `
    <div class="q-label">🎤 Nói to và rõ câu sau</div>
    <div class="phrase ${q.askTier >= 4 ? 'long' : ''}" id="phrase">${esc(q.text)}</div>
    <div class="heard" id="heard">&nbsp;</div>
    <div class="fb" id="fb"></div>
    <div class="actions">
      <button class="btn big" id="mic">🎤 Bấm để nói</button>
      <button class="btn ghost" id="hear">🔊 Nghe mẫu</button>
      <button class="btn ghost" id="skip">Bỏ qua</button>
    </div>`;
  const mic = $('mic');
  let listening = false;

  $('hear').onclick = () => speakText(q.text);
  $('skip').onclick = () => resolve(false, q.text);
  mic.onclick = () => {
    if (G.busy) return;
    if (listening) return G.rec?.stop();
    window.speechSynthesis?.cancel();
    listening = true;
    mic.classList.add('rec');
    mic.textContent = '⏹ Nói xong';
    $('fb').textContent = '';
    $('heard').textContent = 'Đang nghe…';
    G.rec = listen({
      onInterim: (t) => ($('heard').textContent = t),
      onDone: ({ alternatives, error }) => {
        listening = false;
        if (!G?.alive || G.busy) return;
        mic.classList.remove('rec');
        mic.textContent = '🎤 Nói lại';
        if (error) {
          $('heard').innerHTML = '&nbsp;';
          $('fb').className = 'fb bad';
          $('fb').textContent = error;
          return;
        }
        const r = judge(q.text, alternatives, q.tier);
        $('heard').textContent = `Máy nghe được: “${r.heard}”`;
        $('phrase').innerHTML = q.text
          .split(' ')
          .map((w) => w) // giữ nguyên dấu câu; tô màu theo từ
          .map((w, k) => `<span class="${r.matched[k] ? 'w-ok' : 'w-bad'}">${esc(w)}</span>`)
          .join(' ');
        if (r.ok) return resolve(true);
        G.tries++;
        if (G.tries >= MAX_SPEAK_TRIES) return resolve(false, q.text);
        $('fb').className = 'fb warn';
        $('fb').textContent = 'Gần đúng rồi! Các từ màu đỏ cần đọc lại, thử thêm lần nữa nhé.';
      },
    });
  };
}

// ----- Dạng câu hỏi: điền từ đúng chính tả -----

function renderBlank(panel, q) {
  panel.innerHTML = `
    <div class="q-label">✍️ Chọn từ viết đúng chính tả</div>
    <div class="sentence ${q.askTier >= 4 ? 'long' : ''}">${esc(q.before)}<span class="gap" id="gap">＿＿＿</span>${esc(q.after)}</div>
    <div class="options">${q.options.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    <div class="fb" id="fb"></div>`;
  panel.querySelector('.options').onclick = (e) => {
    const b = e.target.closest('.opt');
    if (!b || G.busy) return;
    const ok = b.dataset.o === q.answer;
    $('gap').textContent = q.answer;
    $('gap').className = 'gap filled';
    panel.querySelectorAll('.opt').forEach((x) => {
      x.disabled = true;
      if (x.dataset.o === q.answer) x.classList.add('right');
    });
    if (!ok) b.classList.add('wrong');
    resolve(ok, `${q.before}${q.answer}${q.after}`);
  };
}

// ----- Dạng câu hỏi: tìm từ viết sai -----

function renderFind(panel, q) {
  panel.innerHTML = `
    <div class="q-label">🔍 Bấm vào từ viết sai chính tả</div>
    <div class="sentence find ${q.askTier >= 4 ? 'long' : ''}">${q.tokens
      .map((t, k) => `<button class="tok" data-k="${k}">${esc(t.text)}</button>`)
      .join(' ')}</div>
    <div class="fb" id="fb"></div>`;
  panel.querySelector('.find').onclick = (e) => {
    const b = e.target.closest('.tok');
    if (!b || G.busy) return;
    const t = q.tokens[+b.dataset.k];
    panel.querySelectorAll('.tok').forEach((x) => {
      x.disabled = true;
      if (q.tokens[+x.dataset.k].wrong) {
        x.classList.add(t.wrong ? 'right' : 'missed');
        x.textContent = q.tokens[+x.dataset.k].right;
      }
    });
    if (!t.wrong) b.classList.add('wrong');
    resolve(!!t.wrong, q.full);
  };
}

// ---------- Kết quả ----------

function renderResult() {
  const total = QUESTIONS_PER_MATCH;
  const acc = G.correct / total;
  const passed = acc >= PASS_RATIO;
  const stars = acc >= 0.95 ? 3 : acc >= 0.85 ? 2 : passed ? 1 : 0;
  const level = G.level;
  const wrong = G.wrong;
  if (passed && (!best[level] || stars > best[level].stars || (stars === best[level].stars && acc > best[level].acc))) {
    best[level] = { stars, acc };
    save();
  }
  (passed ? sfx.win : sfx.lose)();

  app.innerHTML = `
  <main class="home result">
    <header class="title">
      <div class="title-emoji">${passed ? '🏆' : '💪'}</div>
      <h1>${passed ? 'ĐẠT RỒI!' : 'Chưa đạt, cố lên!'}</h1>
      <div class="big-stars">${starsText(stars)}</div>
      <p>Đúng <strong>${G.correct}/${total}</strong> câu (${Math.round(acc * 100)}%) · cần ${Math.ceil(total * PASS_RATIO)} câu để đạt</p>
    </header>
    ${
      wrong.length
        ? `<section class="card"><h2>Những câu cần luyện lại (${wrong.length})</h2>
      <ul class="review">${wrong
        .map((q) => {
          const text = q.kind === 'speak' ? q.text : q.kind === 'blank' ? q.before + q.answer + q.after : q.full;
          return `<li><span>${esc(text)}</span><button class="icon-btn" data-say="${esc(text)}" aria-label="Nghe mẫu">🔊</button></li>`;
        })
        .join('')}</ul></section>`
        : '<section class="card"><h2>Không sai câu nào, quá xuất sắc! 🌟</h2></section>'
    }
    <div class="actions center">
      <button class="btn big" id="again">↻ Chơi lại</button>
      ${passed && level < LEVELS.length - 1 ? '<button class="btn big alt" id="nextlv">Cấp tiếp theo ▶</button>' : ''}
      <button class="btn ghost" id="menu">Về menu</button>
    </div>
  </main>`;
  G = null;
  app.querySelector('.review')?.addEventListener('click', (e) => {
    const t = e.target.closest('[data-say]')?.dataset.say;
    if (t) speakText(t);
  });
  $('again').onclick = () => startGame(level);
  if ($('nextlv')) $('nextlv').onclick = () => startGame(level + 1);
  $('menu').onclick = renderHome;
}

renderHome();
