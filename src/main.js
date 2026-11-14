import './style.css';
import { LEVELS, MONSTERS, STAGE_SIZE, PROVINCES, buildQuiz, loadBank } from './data.js';
import { startRunner, getRunBest } from './runner.js';
import { markSeen, seenCount, resetSeen } from './history.js';
import { hasSpeechRecognition, primeMic, listen, speakText, judge } from './speech.js';
import { sfx, sfxState } from './audio.js';

const PASS_RATIO = 0.7; // đạt khi đúng từ 70% trở lên
const REVIEW_MS = 2600; // câu đúng: giữ kết quả trên màn hình trước khi qua câu mới
const HIT_DAMAGE = 100 / STAGE_SIZE;
const DEFEAT_HP = 100 - 7 * HIT_DAMAGE; // đúng ≥7/10 câu thì hạ gục quái
const SKIP_AFTER_TRIES = 3; // đọc sai bấy nhiêu lần thì mới hiện nút Bỏ qua

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
  scope: ['p', 'v', 'all'].includes(saved.scope) ? saved.scope : 'p',
  province: saved.province || 'all',
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

// Cấp 1 luôn mở; đạt cấp n (≥70%) thì mở cấp n+1; cấp 'perfect' cần đúng 100% cấp liền trước.
function isUnlocked(i) {
  if (i === 0) return true;
  const prev = best[i - 1];
  if (!prev) return false;
  return LEVELS[i].unlock === 'perfect' ? prev.acc >= 1 : true;
}

const starsText = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

const SCOPES = [
  ['p', '📚 Phổ thông'],
  ['v', '🗺️ Vùng miền'],
  ['all', '🌟 Tất cả'],
];

const SCOPE_HINT = {
  p: 'Phát âm l/n, s/x, ch/tr, r/d/gi, hỏi/ngã, chính tả, ca dao – tục ngữ.',
  v: 'Từ ngữ và câu nói của các vùng miền, đổi sang tiếng phổ thông.',
  all: 'Trộn cả nội dung phổ thông và vùng miền.',
};

function renderHome() {
  const provinceChips = PROVINCES.map((p) => `<button class="chip ${settings.province === p.id ? 'on' : ''}" data-p="${p.id}">${esc(p.name)}</button>`).join('');
  app.innerHTML = `
  <main class="home">
    <header class="title">
      <div class="title-emoji">👊 👹</div>
      <h1>Đấu Quái Vật</h1>
      <p>Nói đúng, chọn đúng chính tả để đấm, đá hạ gục quái vật!</p>
    </header>


    <section class="card runner-card">
      <h2>🦖 Thử thách chạy vô tận</h2>
      <p class="hint">Khủng long chạy mãi, nói đúng từ trước khi xương rồng tới để nhảy qua. Sai nhịp là game over! Câu càng về sau càng dài.</p>
      <div class="actions"><button class="btn big" id="runner" ${hasSpeechRecognition ? '' : 'disabled'}>▶ Vào thử thách${getRunBest() ? ` · Kỷ lục ${getRunBest()}` : ''}</button></div>
      ${hasSpeechRecognition ? '' : '<p class="note">Cần trình duyệt hỗ trợ nhận giọng nói (Chrome, Edge, Safari).</p>'}
    </section>

    <section class="card">
      <h2>1. Nội dung</h2>
      <div class="chips" id="scopes">
        ${SCOPES.map(([id, label]) => `<button class="chip ${settings.scope === id ? 'on' : ''}" data-s="${id}">${label}</button>`).join('')}
      </div>
      <p class="hint">${SCOPE_HINT[settings.scope]}</p>
      ${
        settings.scope === 'v'
          ? `<h3>Chọn tỉnh / vùng</h3><div class="chips" id="provinces">
              <button class="chip all ${settings.province === 'all' ? 'on' : ''}" data-p="all">Tất cả</button>${provinceChips}</div>`
          : ''
      }
    </section>

    <section class="card">
      <h2>2. Cách chơi</h2>
      <div class="chips" id="modes">
        ${MODES.map(([id, label]) => `<button class="chip ${settings.mode === id ? 'on' : ''}" data-m="${id}" ${!hasSpeechRecognition && id !== 'choose' ? 'disabled' : ''}>${label}</button>`).join('')}
      </div>
      ${hasSpeechRecognition ? '' : '<p class="note">Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy mở bằng Chrome hoặc Edge để luyện nói; tạm thời bạn vẫn luyện chọn chính tả được.</p>'}
    </section>

    <section class="card">
      <h2>3. Chọn cấp độ · qua cấp để mở khoá cấp tiếp theo</h2>
      <div class="levels">
        ${LEVELS.map((lv, i) => {
          const b = best[i];
          const open = isUnlocked(i);
          const need = lv.unlock === 'perfect' ? `Cần đúng ${LEVELS[i - 1].count}/${LEVELS[i - 1].count} câu ở ${LEVELS[i - 1].name.split(' · ')[0]}` : `Qua ${LEVELS[i - 1]?.name.split(' · ')[0]} để mở`;
          return `<button class="level ${open ? '' : 'locked'}" data-l="${i}" ${open ? '' : 'disabled'}>
            <span class="lv-icon">${open ? lv.icon : '🔒'}</span>
            <span class="lv-body"><strong>${esc(lv.name)} · ${lv.count} câu</strong><small>${esc(open ? lv.desc : need)}</small></span>
            <span class="lv-stars ${b ? 'has' : ''}">${starsText(b ? b.stars : 0)}</span>
          </button>`;
        }).join('')}
      </div>
    </section>

    <footer class="foot">
      <button class="link" id="sfx">${settings.sfx ? '🔊 Âm thanh: bật' : '🔇 Âm thanh: tắt'}</button>
      <span id="bankinfo">Đạt khi đúng từ ${PASS_RATIO * 100}% số câu</span>
      <button class="link" id="resetseen" hidden>Chơi lại các câu đã gặp</button>
    </footer>
  </main>`;

  loadBank().then((bank) => {
    const info = document.getElementById('bankinfo');
    if (!info) return;
    info.textContent = `Kho ${bank.items.length.toLocaleString('vi-VN')} câu hỏi · đã gặp ${seenCount().toLocaleString('vi-VN')} câu gốc`;
    const reset = document.getElementById('resetseen');
    if (reset && seenCount() > 0) {
      reset.hidden = false;
      reset.onclick = () => {
        resetSeen();
        renderHome();
      };
    }
  });

  app.querySelector('#runner').onclick = () => startRunner({ root: app, scope: settings.scope, province: settings.province, onExit: renderHome });
  app.querySelector('#scopes').onclick = (e) => {
    const sc = e.target.closest('[data-s]')?.dataset.s;
    if (!sc) return;
    settings.scope = sc;
    save();
    renderHome();
  };
  app.querySelector('#provinces')?.addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]')?.dataset.p;
    if (!p) return;
    settings.province = p;
    save();
    renderHome();
  });
  app.querySelector('#modes').onclick = (e) => {
    const m = e.target.closest('[data-m]');
    if (!m || m.disabled) return;
    settings.mode = m.dataset.m;
    save();
    renderHome();
  };
  app.querySelector('.levels').onclick = (e) => {
    const b = e.target.closest('[data-l]');
    if (b && !b.disabled) startGame(+b.dataset.l);
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

async function startGame(level) {
  app.innerHTML = '<main class="home"><p class="loading">⏳ Đang chuẩn bị câu hỏi…</p></main>';
  let quiz;
  try {
    quiz = await buildQuiz(level, { scope: settings.scope, province: settings.province, mode: settings.mode });
  } catch (err) {
    console.error(err);
    alert('Không tải được kho câu hỏi. Hãy kiểm tra mạng rồi thử lại.');
    return renderHome();
  }
  if (!quiz.length) {
    alert('Chưa có câu hỏi phù hợp với lựa chọn này.');
    return renderHome();
  }
  G = {
    level,
    count: quiz.length,
    quiz,
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
    <div class="progress" aria-hidden="true"><span id="prog"></span>${Array.from({ length: Math.ceil(G.count / STAGE_SIZE) - 1 }, (_, k) => `<i style="left:${((k + 1) * STAGE_SIZE * 100) / G.count}%"></i>`).join('')}</div>
    <section class="arena" id="arena">
      <div class="fighter hero" id="hero">🦸</div>
      <div class="mbox" id="mbox">
        <div class="mhud">
          <div class="mname" id="mname"></div>
          <div class="mstage" id="mstage"></div>
          <div class="hpbar"><span id="hp"></span></div>
        </div>
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
const stageOf = (i) => Math.floor(i / STAGE_SIZE);

function spawnMonster(stage) {
  const [emoji, name] = MONSTERS[G.level][Math.min(stage, MONSTERS[G.level].length - 1)];
  G.hp = 100;
  G.stageHits = 0;
  $('monster').textContent = emoji;
  $('mname').textContent = name;
  $('mstage').textContent = `màn ${stage + 1}/${Math.ceil(G.count / STAGE_SIZE)}`;
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
  $('count').textContent = `Câu ${Math.min(G.i + 1, G.count)}/${G.count}`;
  $('prog').style.width = `${(G.i / G.count) * 100}%`;
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
  const [, name] = MONSTERS[G.level][Math.min(stageOf(G.i - 1), MONSTERS[G.level].length - 1)];
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
  markSeen(q.g);
  const fb = $('fb');
  if (ok) {
    G.correct++;
    G.streak++;
    fb.className = 'fb good';
    const praise = ['Đúng rồi! 🎉', 'Tuyệt vời! ⭐', 'Giỏi quá! 👏', 'Chuẩn luôn! 💪'][G.i % 4];
    // Câu chọn chính tả: hiện lại cả câu viết đúng để bé kịp nhìn.
    fb.innerHTML = q.kind === 'speak' ? esc(praise) : `${esc(praise)}<br><span class="answer">${esc(answerText)}</span>`;
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
  if (!ok) await waitNext();
  else if (q.kind === 'speak') await sleep(450);
  else await waitNext(REVIEW_MS);
  await advance();
}

// Chờ bấm "Tiếp"; có autoMs thì tự qua câu sau khoảng đó (bấm sớm hơn cũng được).
function waitNext(autoMs) {
  return new Promise((resolveWait) => {
    const row = document.createElement('div');
    row.className = 'actions';
    row.innerHTML = '<button class="btn big" id="next">Tiếp ▶</button>';
    $('panel').appendChild(row);
    $('next').focus();
    const timer = autoMs && setTimeout(resolveWait, autoMs);
    $('next').onclick = () => {
      clearTimeout(timer);
      resolveWait();
    };
  });
}

async function advance() {
  if (!G?.alive) return;
  G.i++;
  if (G.i % STAGE_SIZE === 0) await stageEnd();
  if (!G?.alive) return;
  if (G.i >= G.count) return renderResult();
  if (G.i % STAGE_SIZE === 0) spawnMonster(stageOf(G.i));
  showQuestion();
}

// ----- Dạng câu hỏi: nói -----

function renderSpeak(panel, q) {
  panel.innerHTML = `
    <div class="q-label">${q.prompt ? '🗺️ Nói câu này bằng tiếng phổ thông' : q.tag === 'prov' ? '📜 Đọc to câu ca dao – tục ngữ' : '🎤 Nói to và rõ câu sau'}</div>
    <div class="phrase ${q.askTier >= 4 ? 'long' : ''} ${q.prompt ? 'dia' : ''}" id="phrase">${esc(q.prompt || q.text)}</div>
    <div class="heard" id="heard">&nbsp;</div>
    <div class="fb" id="fb"></div>
    <div class="actions">
      <button class="btn big" id="mic" aria-label="Bấm để nói" title="Bấm để nói">🎤</button>
      ${q.prompt ? '' : '<button class="btn ghost" id="hear">🔊 Nghe mẫu</button>'}
      <button class="btn ghost" id="skip" hidden>Bỏ qua</button>
    </div>`;
  const mic = $('mic');
  let listening = false;

  if ($('hear')) $('hear').onclick = () => speakText(q.text);
  $('skip').onclick = () => resolve(false, q.text);
  mic.onclick = async () => {
    if (G.busy) return;
    if (listening) return G.rec?.stop();
    window.speechSynthesis?.cancel();
    listening = true;
    const denied = await primeMic();
    if (denied) {
      listening = false;
      $('fb').className = 'fb bad';
      $('fb').textContent = denied;
      return;
    }
    mic.classList.add('rec');
    mic.textContent = '⏹';
    mic.setAttribute('aria-label', 'Nói xong');
    $('fb').textContent = '';
    $('heard').textContent = 'Đang nghe…';
    G.rec = listen({
      onInterim: (t) => ($('heard').textContent = t),
      onDone: ({ alternatives, error }) => {
        listening = false;
        if (!G?.alive || G.busy) return;
        mic.classList.remove('rec');
        mic.textContent = '🎤';
        mic.setAttribute('aria-label', 'Nói lại');
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
        if (G.tries >= SKIP_AFTER_TRIES) $('skip').hidden = false;
        $('fb').className = 'fb warn';
        $('fb').textContent = 'Chưa đúng, các từ màu đỏ cần đọc lại. Thử thêm lần nữa nhé!';
      },
    });
  };
}

// ----- Dạng câu hỏi: điền từ đúng chính tả -----

function renderBlank(panel, q) {
  panel.innerHTML = `
    <div class="q-label">${q.tag === 'dia' ? '🗺️ Chọn đáp án đúng' : q.tag === 'prov' ? '📜 Hoàn thành câu ca dao – tục ngữ' : '✍️ Chọn từ viết đúng chính tả'}</div>
    <div class="sentence ${q.askTier >= 4 || q.before.length + q.after.length > 70 ? 'long' : ''}">${esc(q.before)}<span class="gap" id="gap">＿＿＿</span>${esc(q.after)}</div>
    <div class="options">${q.options.map((o) => `<button class="opt ${o.length > 14 ? 'wide' : ''}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
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
  const n = q.wrongCount;
  panel.innerHTML = `
    <div class="q-label">${q.tag === 'prov' ? '📜 ' : '🔍 '}Bấm chọn ${n === 1 ? '1 từ' : `<strong>${n} từ</strong>`} viết sai chính tả, rồi bấm Kiểm tra</div>
    <div class="sentence find ${q.askTier >= 4 ? 'long' : ''}">${q.tokens
      .map((t, k) => `<button class="tok" data-k="${k}" aria-pressed="false">${esc(t.text)}</button>`)
      .join(' ')}</div>
    <div class="fb" id="fb"></div>
    <div class="actions"><button class="btn big" id="check" disabled>Kiểm tra ✓</button></div>`;
  const toks = [...panel.querySelectorAll('.tok')];
  const picked = () => toks.filter((x) => x.classList.contains('sel'));
  const check = $('check');
  const sync = () => {
    check.disabled = picked().length === 0;
    $('fb').textContent = `Đã chọn ${picked().length}/${n} từ`;
  };
  sync();
  panel.querySelector('.find').onclick = (e) => {
    const b = e.target.closest('.tok');
    if (!b || G.busy) return;
    b.classList.toggle('sel');
    b.setAttribute('aria-pressed', b.classList.contains('sel'));
    sync();
  };
  check.onclick = () => {
    if (G.busy || !picked().length) return;
    let ok = true;
    toks.forEach((x) => {
      const t = q.tokens[+x.dataset.k];
      const sel = x.classList.contains('sel');
      x.disabled = true;
      if (t.wrong) {
        x.textContent = t.right;
        x.classList.add(sel ? 'right' : 'missed');
        if (!sel) ok = false;
      } else if (sel) {
        x.classList.add('wrong');
        ok = false;
      }
    });
    check.remove();
    resolve(ok, q.full);
  };
}

// ---------- Kết quả ----------

function renderResult() {
  const total = G.count;
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
