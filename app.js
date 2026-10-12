/* ============================================================
 * 小学学习乐园 · 游戏引擎 + 奖励系统（统一版，1~6 年级）
 * 关卡数据来自 window.YW_LEVELS / SX_LEVELS / YY_LEVELS（按年级拆分）
 * 年级切换、成就、周计划均由数据动态生成，加关卡零侵入。
 * ============================================================ */
(function () {
  var CORE = window.APP_CORE || {};
  var DATA = {
    levels: (window.YW_LEVELS || []).concat(window.SX_LEVELS || [], window.YY_LEVELS || []),
    subjects: CORE.subjects || [],
    petStages: CORE.petStages || [],
    ranks: CORE.ranks || [],
    PER_ROUND: CORE.PER_ROUND || 5,
    COIN_PER_RIGHT: CORE.COIN_PER_RIGHT || 1
  };
  var GRADES = [0, 1, 2, 3, 4, 5, 6];
  var GRADE_NAMES = { 0: '幼小衔接', 1: '一年级', 2: '二年级', 3: '三年级', 4: '四年级', 5: '五年级', 6: '六年级' };
  var STORE_KEY = 'xiaoxue-progress-v1';

  /* ---------- 工具 ---------- */
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function currentGrade() { return (typeof progress.grade === 'number' && progress.grade >= 0 && progress.grade <= 6) ? progress.grade : 1; }

  /* ---------- 语音朗读 ---------- */
  function speak(text, lang) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'zh-CN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------- 音效 ---------- */
  var audioCtx = null;
  function ensureAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) { return null; }
  }
  function tone(freq, start, dur, type) {
    try {
      var ctx = ensureAudio();
      if (!ctx) return;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      var t = ctx.currentTime + start;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function beepOK() { tone(660, 0, 0.18); tone(880, 0.14, 0.22); }
  function beepNG() { tone(240, 0, 0.25); }
  function beepCoin() { tone(1047, 0, 0.08, 'square'); tone(1319, 0.07, 0.16, 'square'); }
  function beepWin() { tone(523, 0, 0.15); tone(659, 0.12, 0.15); tone(784, 0.24, 0.3); }
  function flyStars() {
    try {
      var cx = window.innerWidth / 2, cy = window.innerHeight * 0.38;
      for (var i = 0; i < 4; i++) {
        var s = document.createElement('div');
        s.className = 'fx-star';
        s.textContent = (i % 2) ? '⭐' : '✨';
        s.style.left = (cx + (i - 1.5) * 28 + (Math.random() * 20 - 10)) + 'px';
        s.style.top = cy + 'px';
        document.body.appendChild(s);
        (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 950); })(s);
      }
    } catch (e) {}
  }

  /* ---------- 进度存储 ---------- */
  function defaultProgress() {
    return {
      levels: {}, coins: 0, correctCount: 0, streak: 0, lastPlayDate: '',
      achievements: [], hasPerfect: false, hasCombo5: false,
      grade: 1,
      plan: null,
      daily: {},
      wrong: {},
      written: {}
    };
  }
  function loadProgress() {
    var p = defaultProgress();
    var raw = null;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (raw) { try { p = JSON.parse(raw) || defaultProgress(); } catch (e) { p = defaultProgress(); } }
    p.levels = p.levels || {};
    p.achievements = p.achievements || [];
    if (typeof p.coins !== 'number') p.coins = 0;
    if (typeof p.correctCount !== 'number') p.correctCount = 0;
    if (typeof p.streak !== 'number') p.streak = 0;
    if (typeof p.grade !== 'number' || p.grade < 0 || p.grade > 6) p.grade = 1;
    p.daily = p.daily || {};
    p.wrong = p.wrong || {};
    p.written = p.written || {};
    return p;
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  var progress = loadProgress();

  /* ---------- 统计 ---------- */
  function totalStarsOf(p) {
    var sum = 0;
    DATA.levels.forEach(function (lv) { sum += (p.levels[lv.id] || 0); });
    return sum;
  }
  function subjectStarsOf(p, subjectId, grade) {
    var sum = 0;
    DATA.levels.forEach(function (lv) { if (lv.subject === subjectId && lv.grade === grade) sum += (p.levels[lv.id] || 0); });
    return sum;
  }
  function playedCount(p) {
    var n = 0;
    DATA.levels.forEach(function (lv) { if ((p.levels[lv.id] || 0) > 0) n++; });
    return n;
  }
  function petStageIndex(coins) {
    var idx = 0;
    DATA.petStages.forEach(function (st, i) { if (coins >= st.need) idx = i; });
    return idx;
  }
  function rankIndex(stars) {
    var idx = 0;
    DATA.ranks.forEach(function (r, i) { if (stars >= r.min) idx = i; });
    return idx;
  }

  /* 成就动态生成：全局成就 + 每个「年级×科目」满星成就 */
  function buildAchievements() {
    var list = [
      { id: 'first', name: '初来乍到', icon: '👋', desc: '完成任意一关', check: function (s) { return s.playedLevels >= 1; } },
      { id: 'star10', name: '十星小达人', icon: '🌟', desc: '累计获得 10 颗星', check: function (s) { return s.totalStars >= 10; } },
      { id: 'star20', name: '二十星高手', icon: '✨', desc: '累计获得 20 颗星', check: function (s) { return s.totalStars >= 20; } },
      { id: 'star40', name: '四十星大神', icon: '⭐', desc: '累计获得 40 颗星', check: function (s) { return s.totalStars >= 40; } },
      { id: 'star80', name: '八十星学神', icon: '💫', desc: '累计获得 80 颗星', check: function (s) { return s.totalStars >= 80; } },
      { id: 'full', name: '全科制霸', icon: '🏆', desc: '语文·数学·英语都有星星', check: function (s) { return s.subjectHas.yuwen && s.subjectHas.shuxue && s.subjectHas.yingyu; } },
      { id: 'perfect', name: '满分神童', icon: '💯', desc: '任意一关全对（3 星）', check: function (s) { return s.hasPerfect; } },
      { id: 'combo5', name: '连击高手', icon: '🔥', desc: '单关连对 5 题', check: function (s) { return s.hasCombo5; } },
      { id: 'coin50', name: '小小富翁', icon: '💰', desc: '累计 50 金币', check: function (s) { return s.coins >= 50; } },
      { id: 'coin150', name: '金币大亨', icon: '🤑', desc: '累计 150 金币', check: function (s) { return s.coins >= 150; } },
      { id: 'dragon', name: '恐龙饲养员', icon: '🐉', desc: '把宠物养成最终形态', check: function (s) { return s.petMax; } },
      { id: 'streak3', name: '坚持不懈', icon: '📅', desc: '连续学习 3 天', check: function (s) { return s.streak >= 3; } },
      { id: 'streak7', name: '习惯养成', icon: '🗓️', desc: '连续学习 7 天', check: function (s) { return s.streak >= 7; } },
      { id: 'correct100', name: '百发百中', icon: '🎯', desc: '累计答对 100 题', check: function (s) { return s.correctCount >= 100; } },
      { id: 'correct500', name: '题海战术', icon: '🌊', desc: '累计答对 500 题', check: function (s) { return s.correctCount >= 500; } }
    ];
    GRADES.forEach(function (g) {
      DATA.subjects.forEach(function (sub) {
        var lvls = DATA.levels.filter(function (l) { return l.grade === g && l.subject === sub.id; });
        if (!lvls.length) return;
        list.push({
          id: 'g' + g + '_' + sub.id,
          name: GRADE_NAMES[g] + sub.name + '全满星',
          icon: sub.icon,
          desc: GRADE_NAMES[g] + sub.name + '所有关卡都拿到 3 星',
          check: function (s) { return !!(s.gradeSubjectMax && s.gradeSubjectMax[g] && s.gradeSubjectMax[g][sub.id]); }
        });
      });
    });
    return list;
  }
  DATA.achievements = buildAchievements();

  function buildStats(p) {
    var ss = { yuwen: 0, shuxue: 0, yingyu: 0 };
    DATA.levels.forEach(function (lv) { ss[lv.subject] += (p.levels[lv.id] || 0); });
    var subjectMax = {}, subjectHas = {};
    DATA.subjects.forEach(function (s) {
      var lvls = DATA.levels.filter(function (l) { return l.subject === s.id; });
      var maxPossible = lvls.length * 3;
      subjectMax[s.id] = ss[s.id] >= maxPossible && maxPossible > 0;
      subjectHas[s.id] = ss[s.id] > 0;
    });
    // 按 年级×科目 统计满星
    var gradeStars = {};
    GRADES.forEach(function (g) { gradeStars[g] = { yuwen: 0, shuxue: 0, yingyu: 0 }; });
    DATA.levels.forEach(function (lv) { if (gradeStars[lv.grade]) gradeStars[lv.grade][lv.subject] += (p.levels[lv.id] || 0); });
    var gradeSubjectMax = {};
    GRADES.forEach(function (g) {
      gradeSubjectMax[g] = {};
      DATA.subjects.forEach(function (s) {
        var lvls = DATA.levels.filter(function (l) { return l.grade === g && l.subject === s.id; });
        var max = lvls.length * 3;
        gradeSubjectMax[g][s.id] = lvls.length > 0 && gradeStars[g][s.id] >= max;
      });
    });
    return {
      playedLevels: playedCount(p),
      totalStars: totalStarsOf(p),
      subjectMax: subjectMax,
      subjectHas: subjectHas,
      gradeSubjectMax: gradeSubjectMax,
      hasPerfect: !!p.hasPerfect,
      hasCombo5: !!p.hasCombo5,
      coins: p.coins,
      petMax: petStageIndex(p.coins) >= DATA.petStages.length - 1,
      streak: p.streak,
      correctCount: p.correctCount
    };
  }
  function checkAchievements(p) {
    var stats = buildStats(p);
    var unlocked = [];
    DATA.achievements.forEach(function (a) {
      if (p.achievements.indexOf(a.id) === -1) {
        try {
          if (a.check(stats)) { p.achievements.push(a.id); unlocked.push(a); }
        } catch (e) {}
      }
    });
    if (unlocked.length) saveProgress(p);
    return unlocked;
  }
  function updateStreak(p) {
    var today = dateStr(new Date());
    if (p.lastPlayDate === today) return;
    var y = new Date(Date.now() - 86400000);
    var yesterday = dateStr(y);
    if (p.lastPlayDate === yesterday) p.streak += 1;
    else p.streak = 1;
    p.lastPlayDate = today;
  }

  /* ---------- 渲染基础 ---------- */
  var app = $('#app');
  function starsHtml(n, max) {
    max = max || 3;
    var s = '';
    for (var i = 0; i < max; i++) s += '<span class="star' + (i < n ? ' on' : '') + '">★</span>';
    return s;
  }

  /* ---------- 首页 ---------- */
  function showHome() {
    var g = currentGrade();
    var st = totalStarsOf(progress);
    var pet = DATA.petStages[petStageIndex(progress.coins)];
    var rank = DATA.ranks[rankIndex(st)];
    var html = '';
    html += '<header class="topbar">'
      + '<div class="brand">🎒 小学学习乐园</div>'
      + '<button class="rewards-btn" data-act="rewards">🏆 奖励</button>'
      + '</header>';

    html += '<div class="hero">'
      + '<div class="pet-wrap"><div class="pet-emoji">' + pet.emoji + '</div>'
      + '<div class="pet-name">' + pet.name + '</div></div>'
      + '<div class="rank-line">' + rank.emoji + ' ' + rank.name + '</div>'
      + '<div class="hero-stats">'
      + '<div class="hs"><span class="hs-num">💰 ' + progress.coins + '</span><span class="hs-label">金币</span></div>'
      + '<div class="hs"><span class="hs-num">⭐ ' + st + '</span><span class="hs-label">星星</span></div>'
      + '<div class="hs"><span class="hs-num">🔥 ' + progress.streak + '</span><span class="hs-label">连学天数</span></div>'
      + '</div></div>';

    var nextStage = DATA.petStages[petStageIndex(progress.coins) + 1];
    if (nextStage) {
      var cur = pet.need, need = nextStage.need;
      var pct = Math.min(100, Math.round((progress.coins - cur) / (need - cur) * 100));
      html += '<div class="pet-progress"><div class="pp-text">离「' + nextStage.name + '」还差 ' + (need - progress.coins) + ' 金币</div>'
        + '<div class="pp-bar"><div class="pp-fill" style="width:' + pct + '%"></div></div></div>';
    }

    // 年级切换
    html += '<div class="grade-wrap"><div class="grade-label">选择年级（当前：' + GRADE_NAMES[g] + '）</div><div class="grade-tabs">';
    GRADES.forEach(function (gg) {
      html += '<button class="grade-tab' + (gg === g ? ' on' : '') + '" data-grade="' + gg + '">' + GRADE_NAMES[gg] + '</button>';
    });
    html += '</div></div>';

    // 今日任务入口
    var tdN = todayProgress();
    var wkTxt = progress.plan ? ('第 ' + currentWeek() + ' 周 · ') : '';
    var subTxt = progress.plan ? '点开看今天要学什么、玩什么' : '还没设置计划，点开选个节奏';
    html += '<button class="task-entry" data-act="tasks">'
      + '<div class="te-icon">📅</div>'
      + '<div class="te-mid"><div class="te-title">今日任务 ' + wkTxt + tdN + '/3</div>'
      + '<div class="te-sub">' + subTxt + '</div></div>'
      + '<div class="te-arrow">›</div></button>';

    // 书写练习入口
    var hanziN = Object.keys(window.HANZI_DATA || {}).length;
    var latinN = (window.LATIN_GROUPS || []).reduce(function (a, gr) { return a + gr.chars.length; }, 0);
    var totalWrite = hanziN + latinN;
    var writtenN = Object.keys(progress.written).length;
    html += '<button class="write-entry" data-act="write">'
      + '<div class="we-icon">✍️</div>'
      + '<div class="we-mid"><div class="we-title">书写练习 · 描红</div>'
      + '<div class="we-sub">汉字 / 拼音 / 英语，已练 ' + writtenN + ' / ' + totalWrite + '</div></div>'
      + '<div class="te-arrow">›</div></button>';

    // 学情看板入口
    var wrongN = Object.keys(progress.wrong).reduce(function (a, k) { return a + (progress.wrong[k] || []).length; }, 0);
    html += '<button class="write-entry" data-act="stats">'
      + '<div class="we-icon">📊</div>'
      + '<div class="we-mid"><div class="we-title">家长学情看板</div>'
      + '<div class="we-sub">正确率 · 薄弱点 · 错题本（' + wrongN + ' 道）</div></div>'
      + '<div class="te-arrow">›</div></button>';

    // 三科（当前年级）
    html += '<div class="subjects">';
    DATA.subjects.forEach(function (s) {
      var sst = subjectStarsOf(progress, s.id, g);
      var total = DATA.levels.filter(function (l) { return l.subject === s.id && l.grade === g; }).length * 3;
      html += '<button class="subject-card" data-sub="' + s.id + '" style="--c:' + s.color + '">'
        + '<div class="s-icon">' + s.icon + '</div>'
        + '<div class="s-name">' + s.name + '</div>'
        + '<div class="s-desc">' + s.desc + '</div>'
        + '<div class="s-stars">' + sst + ' / ' + total + ' ⭐</div>'
        + '</button>';
    });
    html += '</div>';
    html += '<p class="tip">💡 先选好年级（' + GRADE_NAMES[g] + '），再进入语文/数学/英语。答对赚金币养恐龙～</p>';
    app.innerHTML = html;

    app.querySelector('[data-act=rewards]').addEventListener('click', showRewards);
    app.querySelector('[data-act=tasks]').addEventListener('click', showTasks);
    app.querySelector('[data-act=write]').addEventListener('click', function () {
      if (window.YSX && window.YSX.nav && window.YSX.nav.showWriting) window.YSX.nav.showWriting();
    });
    app.querySelector('[data-act=stats]').addEventListener('click', showStats);
    app.querySelectorAll('.grade-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        progress.grade = +btn.dataset.grade; saveProgress(progress); showHome();
      });
    });
    app.querySelectorAll('.subject-card').forEach(function (btn) {
      btn.addEventListener('click', function () { openSubject(btn.dataset.sub); });
    });
  }

  /* ---------- 科目页 ---------- */
  function openSubject(subjectId) {
    var g = currentGrade();
    var s = DATA.subjects.filter(function (x) { return x.id === subjectId; })[0];
    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">' + GRADE_NAMES[g] + ' · ' + s.icon + ' ' + s.name + '</div><div class="total">⭐ ' + subjectStarsOf(progress, subjectId, g) + '</div></header>';
    html += '<div class="levels">';
    DATA.levels.filter(function (lv) { return lv.subject === subjectId && lv.grade === g; }).forEach(function (lv) {
      var st = progress.levels[lv.id] || 0;
      html += '<button class="level-card" data-level="' + lv.id + '">'
        + '<div class="l-icon">' + lv.icon + '</div>'
        + '<div class="l-info"><div class="l-name">' + lv.name + '</div><div class="l-desc">' + lv.desc + '</div></div>'
        + '<div class="l-stars">' + starsHtml(st) + '</div>'
        + '</button>';
    });
    html += '</div>';
    app.innerHTML = html;
    app.querySelector('.back').addEventListener('click', showHome);
    app.querySelectorAll('.level-card').forEach(function (btn) {
      btn.addEventListener('click', function () { playLevel(btn.dataset.level); });
    });
  }

  /* ---------- 答题（正式关卡 / 错题复习 共用） ---------- */
  function startQuiz(meta, qs, onBack) {
    var idx = 0, score = 0, answered = false, combo = 0;
    var total = qs.length;
    var coinsEarned = 0;
    var isLevel = !!meta.id;
    if (!onBack) onBack = showHome;

    function render() {
      var q = qs[idx];
      var opts = shuffle(q.options);
      var html = '';
      html += '<header class="topbar"><button class="back" data-act="quit">✕</button><div class="brand">' + meta.icon + ' ' + meta.name + '</div><div class="coin">💰 ' + progress.coins + '</div></header>';
      html += '<div class="progress"><div class="bar" style="width:' + (idx / total * 100) + '%"></div></div>';
      html += '<div class="qnum">第 ' + (idx + 1) + ' / ' + total + ' 题' + (combo >= 2 ? ' · 🔥 连击 x' + combo : '') + '</div>';
      html += '<div class="quiz">';
      html += '<div class="question">' + q.q;
      if (q.speak) html += '<button class="speak" data-speak="1">🔊</button>';
      html += '</div>';
      if (q.sub) html += '<div class="sub">' + q.sub + '</div>';
      html += '<div class="options">';
      opts.forEach(function (o) {
        html += '<button class="opt" data-val="' + escAttr(o) + '">' + o + '</button>';
      });
      html += '</div></div>';
      app.innerHTML = html;
      answered = false;

      var spk = app.querySelector('.speak');
      if (spk) spk.addEventListener('click', function () { speak(q.speak, q.speakLang || 'zh-CN'); });
      app.querySelectorAll('.opt').forEach(function (btn) {
        btn.addEventListener('click', function () { onAnswer(btn, q); });
      });
      app.querySelector('.back').addEventListener('click', function () { showHome(); });
    }

    function onAnswer(btn, q) {
      if (answered) return;
      answered = true;
      var val = btn.dataset.val;
      var ok = (val === q.answer);
      var btns = app.querySelectorAll('.opt');
      btns.forEach(function (b) {
        b.disabled = true;
        if (b.dataset.val === q.answer) b.classList.add('right');
      });
      if (ok) {
        score++; combo++; coinsEarned += DATA.COIN_PER_RIGHT;
        progress.coins += DATA.COIN_PER_RIGHT;
        progress.correctCount += 1;
        if (combo === 5) progress.hasCombo5 = true;
        saveProgress(progress);
        beepCoin();
        var coinEl = app.querySelector('.coin');
        if (coinEl) { coinEl.classList.remove('bump'); void coinEl.offsetWidth; coinEl.classList.add('bump'); }
        flyStars();
        if (combo >= 3) beepOK();
      } else {
        combo = 0;
        btn.classList.add('wrong');
        beepNG();
        if (isLevel) recordWrong(meta.id, q);
      }
      setTimeout(function () {
        idx++;
        if (idx >= total) finish();
        else render();
      }, ok ? 650 : 1100);
    }

    function finish() {
      var stars = Math.max(1, Math.ceil(score / total * 3));
      if (isLevel) {
        var oldStars = progress.levels[meta.id] || 0;
        if (stars > oldStars) progress.levels[meta.id] = stars;
        if (stars === 3) progress.hasPerfect = true;
        progress.attempts = progress.attempts || [];
        progress.attempts.push({ d: dateStr(new Date()), lv: meta.id, r: score, t: total });
        if (progress.attempts.length > 300) progress.attempts = progress.attempts.slice(-300);
      }
      updateStreak(progress);

      var newAch = checkAchievements(progress);
      saveProgress(progress);

      var petNow = petStageIndex(progress.coins);
      var petPrev = petStageIndex(progress.coins - coinsEarned);
      var evolved = petNow > petPrev;

      var msg = stars === 3 ? '太棒了！全对！🎉' : stars === 2 ? '很不错哦！继续加油！💪' : '完成了！再来一次会更好～🌟';
      var html = '';
      html += '<header class="topbar"><div class="brand">' + meta.icon + ' ' + meta.name + '</div><div class="coin">💰 ' + progress.coins + '</div></header>';
      html += '<div class="result">';
      html += '<div class="res-emoji">' + (stars === 3 ? '🏆' : stars === 2 ? '🎖️' : '⭐') + '</div>';
      html += '<div class="res-stars">' + starsHtml(stars) + '</div>';
      html += '<div class="res-score">答对 ' + score + ' / ' + total + ' 题</div>';
      html += '<div class="res-coins">+ ' + coinsEarned + ' 💰 金币</div>';
      html += '<div class="res-msg">' + msg + '</div>';

      if (evolved) {
        var pet = DATA.petStages[petNow];
        html += '<div class="evo-banner">🎉 恐龙进化啦！现在它是 <b>' + pet.emoji + ' ' + pet.name + '</b></div>';
      }
      if (newAch.length) {
        html += '<div class="ach-unlock"><div class="au-title">🎊 解锁新成就</div>';
        newAch.forEach(function (a) {
          html += '<div class="au-item">' + a.icon + ' ' + a.name + '</div>';
        });
        html += '</div>';
      }

      html += '<div class="res-btns"><button class="btn primary" data-act="again">再来一次</button><button class="btn" data-act="back">返回</button></div>';
      html += '</div>';
      app.innerHTML = html;
      if (evolved || newAch.length) beepWin();
      app.querySelector('[data-act=again]').addEventListener('click', function () {
        if (isLevel) playLevel(meta.id);
        else startQuiz(meta, shuffle(qs), onBack);
      });
      app.querySelector('[data-act=back]').addEventListener('click', function () { onBack(); });
    }

    render();
  }

  /* ---------- 关卡入口 ---------- */
  function playLevel(levelId) {
    var lv = DATA.levels.filter(function (x) { return x.id === levelId; })[0];
    if (!lv) return;
    startQuiz(lv, lv.make(DATA.PER_ROUND), function () { openSubject(lv.subject); });
  }

  /* ---------- 错题本 ---------- */
  function recordWrong(levelId, q) {
    var k = dateStr(new Date());
    progress.wrong[k] = progress.wrong[k] || [];
    if (progress.wrong[k].length >= 30) return;
    var dup = progress.wrong[k].some(function (w) { return w.q === q.q; });
    if (dup) return;
    progress.wrong[k].push({
      lv: levelId, q: q.q, sub: q.sub || '',
      options: (q.options || []).slice(), answer: q.answer
    });
    pruneWrong();
    saveProgress(progress);
  }
  function pruneWrong() {
    var keys = Object.keys(progress.wrong).sort();
    while (keys.length > 30) { delete progress.wrong[keys[0]]; keys.shift(); }
  }
  function collectWrong(n) {
    var out = [];
    var keys = Object.keys(progress.wrong).sort().reverse();
    keys.forEach(function (k) {
      (progress.wrong[k] || []).forEach(function (w) { out.push(w); });
    });
    return out.slice(0, n || 10);
  }
  function playWrong() {
    var ws = collectWrong(10);
    if (!ws.length) return;
    var qs = ws.map(function (w) {
      return { q: w.q, sub: w.sub, options: w.options, answer: w.answer, speak: w.answer, speakLang: 'zh-CN' };
    });
    startQuiz({ icon: '🔁', name: '错题复习' }, qs, function () { showStats(); });
  }

  /* ---------- 奖励中心 ---------- */
  function showRewards() {
    var st = totalStarsOf(progress);
    var petIdx = petStageIndex(progress.coins);
    var pet = DATA.petStages[petIdx];
    var rank = DATA.ranks[rankIndex(st)];

    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">🏆 奖励中心</div><div class="coin">💰 ' + progress.coins + '</div></header>';

    html += '<div class="reward-card pet-card">'
      + '<div class="rc-title">🦕 我的恐龙伙伴</div>'
      + '<div class="pet-big">' + pet.emoji + '</div>'
      + '<div class="pet-big-name">' + pet.name + '</div>'
      + '<div class="pet-big-desc">' + pet.desc + '</div>';
    var nextStage = DATA.petStages[petIdx + 1];
    if (nextStage) {
      var cur = pet.need, need = nextStage.need;
      var pct = Math.min(100, Math.round((progress.coins - cur) / (need - cur) * 100));
      html += '<div class="pp-text">离「' + nextStage.emoji + ' ' + nextStage.name + '」还差 ' + (need - progress.coins) + ' 金币</div>'
        + '<div class="pp-bar"><div class="pp-fill" style="width:' + pct + '%"></div></div>';
    } else {
      html += '<div class="pp-text">已养成最终形态，太厉害啦！</div>';
    }
    html += '</div>';

    var nextRank = DATA.ranks[rankIndex(st) + 1];
    html += '<div class="reward-card">'
      + '<div class="rc-title">🎖️ 我的称号</div>'
      + '<div class="rank-big">' + rank.emoji + ' <b>' + rank.name + '</b></div>'
      + (nextRank ? '<div class="pp-text">再拿 ' + (nextRank.min - st) + ' 颗星升级为「' + nextRank.emoji + ' ' + nextRank.name + '」</div>' : '<div class="pp-text">已是最高称号！</div>')
      + '</div>';

    html += '<div class="stat-grid">'
      + '<div class="stat"><span class="stat-num">💰 ' + progress.coins + '</span><span class="stat-label">金币</span></div>'
      + '<div class="stat"><span class="stat-num">⭐ ' + st + '</span><span class="stat-label">总星数</span></div>'
      + '<div class="stat"><span class="stat-num">🎯 ' + progress.correctCount + '</span><span class="stat-label">答对题数</span></div>'
      + '<div class="stat"><span class="stat-num">🔥 ' + progress.streak + '</span><span class="stat-label">连续天数</span></div>'
      + '</div>';

    html += '<div class="reward-card">'
      + '<div class="rc-title">🎊 成就徽章（' + progress.achievements.length + '/' + DATA.achievements.length + '）</div>'
      + '<div class="badge-grid">';
    DATA.achievements.forEach(function (a) {
      var got = progress.achievements.indexOf(a.id) !== -1;
      html += '<div class="badge' + (got ? ' got' : '') + '">'
        + '<div class="badge-ico">' + (got ? a.icon : '🔒') + '</div>'
        + '<div class="badge-name">' + a.name + '</div>'
        + '<div class="badge-desc">' + a.desc + '</div>'
        + '</div>';
    });
    html += '</div></div>';

    html += '<p class="tip">💡 答对题就赚金币养恐龙；星星多了称号会升级；每个年级每科全满星都有专属徽章！</p>';
    app.innerHTML = html;
    app.querySelector('.back').addEventListener('click', showHome);
  }

  /* ---------- 今日任务 ---------- */
  function planOf() {
    var mode = (progress.plan && progress.plan.mode) || '16';
    return window.APP_PLAN.getPlan(currentGrade(), mode);
  }
  function currentWeek() {
    var plan = planOf();
    if (!progress.plan || !progress.plan.startDate) return 1;
    var start = new Date(progress.plan.startDate + 'T00:00:00');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var days = Math.floor((today - start) / 86400000);
    var w = Math.floor(days / 7) + 1;
    if (w < 1) w = 1;
    if (w > plan.length) w = plan.length;
    return w;
  }
  function todayKey() { return dateStr(new Date()); }
  function todayRec() { return progress.daily[todayKey()] || {}; }
  function todayProgress() {
    var d = todayRec();
    return (d.yw ? 1 : 0) + (d.sx ? 1 : 0) + (d.yy ? 1 : 0);
  }
  function subjKey(subjectId) {
    return subjectId === 'yuwen' ? 'yw' : subjectId === 'shuxue' ? 'sx' : 'yy';
  }
  function toggleDone(key) {
    var k = todayKey();
    var d = progress.daily[k] || {};
    d[key] = d[key] ? 0 : 1;
    progress.daily[k] = d;
    if (d.yw && d.sx && d.yy && !d.bonus) {
      d.bonus = 1;
      progress.coins += 5;
      updateStreak(progress);
      checkAchievements(progress);
      beepWin();
    }
    saveProgress(progress);
    showTasks();
  }

  function showPlanSetup() {
    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">📅 设置学习计划</div><div class="coin"></div></header>';
    html += '<div class="setup">';
    html += '<p class="setup-tip">选一个节奏，我会按周告诉你每天该学什么、玩什么（' + GRADE_NAMES[currentGrade()] + '）</p>';
    window.APP_PLAN.modes.forEach(function (m) {
      html += '<button class="mode-card" data-mode="' + m.id + '">'
        + '<div class="mc-icon">' + m.icon + '</div>'
        + '<div class="mc-info"><div class="mc-name">' + m.name + '</div><div class="mc-desc">' + m.desc + '</div></div>'
        + '</button>';
    });
    html += '<div class="date-row"><label>开始日期</label><input type="date" id="startDate" value="' + todayKey() + '"></div>';
    html += '</div>';
    app.innerHTML = html;
    app.querySelector('.back').addEventListener('click', showHome);
    app.querySelectorAll('.mode-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dv = (app.querySelector('#startDate') || {}).value || dateStr(new Date());
        progress.plan = { mode: btn.dataset.mode, startDate: dv };
        saveProgress(progress);
        showTasks();
      });
    });
  }

  function showTasks() {
    if (!progress.plan) { showPlanSetup(); return; }
    var plan = planOf();
    var wk = currentWeek();
    var weekData = plan[wk - 1];
    var rec = todayRec();
    var doneN = todayProgress();

    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">📅 今日任务</div><div class="coin">💰 ' + progress.coins + '</div></header>';
    html += '<div class="week-card">'
      + '<div class="wc-top"><span class="wc-week">' + GRADE_NAMES[currentGrade()] + ' · 第 ' + wk + ' 周 / 共 ' + plan.length + ' 周</span>'
      + '<button class="wc-switch" data-act="setup">切换计划</button></div>'
      + '<div class="wc-bar"><div class="wc-fill" style="width:' + (wk / plan.length * 100) + '%"></div></div>'
      + '<div class="wc-date">开始于 ' + progress.plan.startDate + ' · ' + (progress.plan.mode === '8' ? '8 周暑期冲刺' : '16 周慢速版') + '</div>'
      + '</div>';

    DATA.subjects.forEach(function (s) {
      var key = subjKey(s.id);
      var t = weekData[key];
      var isDone = !!rec[key];
      html += '<div class="task-card" style="--c:' + s.color + '">';
      html += '<div class="tc-head">'
        + '<span class="tc-icon">' + s.icon + '</span>'
        + '<span class="tc-name">' + s.name + '</span>'
        + '<button class="tc-done' + (isDone ? ' on' : '') + '" data-done="' + key + '">' + (isDone ? '✓ 已完成' : '标记完成') + '</button>'
        + '</div>';
      html += '<div class="tc-content">' + (t.c || '') + '</div>';
      if (t.l && t.l.length) {
        html += '<div class="tc-levels">';
        t.l.forEach(function (lid) {
          if (lid === 'write') {
            html += '<button class="tc-lv" data-write="1">✍️ 汉字书写 ›</button>';
            return;
          }
          var lv = DATA.levels.filter(function (x) { return x.id === lid; })[0];
          if (lv) html += '<button class="tc-lv" data-level="' + lid + '">' + lv.icon + ' ' + lv.name + ' ›</button>';
        });
        html += '</div>';
      }
      if (t.a && t.a.length) {
        html += '<div class="tc-acts">';
        t.a.forEach(function (aid) {
          var a = window.APP_PLAN.activities[aid];
          if (!a) return;
          html += '<div class="tca"><div class="tca-top"><b>' + aid + ' ' + a.name + '</b><em>' + a.time + '</em></div>'
            + '<span>' + a.how + '</span></div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });

    html += '<div class="task-foot">'
      + '<div class="tf-text">今日进度 <b>' + doneN + ' / 3</b></div>'
      + (doneN === 3 ? '<div class="tf-bonus">🎉 今日全部完成，已奖励 5 金币！</div>' : '<div class="tf-hint">三科都完成，额外奖励 5 金币</div>')
      + '</div>';

    app.innerHTML = html;
    app.querySelector('.back').addEventListener('click', showHome);
    app.querySelector('[data-act=setup]').addEventListener('click', showPlanSetup);
    app.querySelectorAll('[data-done]').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleDone(btn.dataset.done); });
    });
    app.querySelectorAll('.tc-lv').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.write) {
          if (window.YSX && window.YSX.nav && window.YSX.nav.showWriting) window.YSX.nav.showWriting();
        } else {
          playLevel(btn.dataset.level);
        }
      });
    });
  }

  /* ---------- 家长学情看板 ---------- */
  function showStats() {
    var p = progress;
    var bySubject = {}, byLevel = {}, totalR = 0, totalT = 0;
    (p.attempts || []).forEach(function (a) {
      var lv = DATA.levels.filter(function (x) { return x.id === a.lv; })[0];
      if (!lv) return;
      bySubject[lv.subject] = bySubject[lv.subject] || { r: 0, t: 0 };
      bySubject[lv.subject].r += a.r; bySubject[lv.subject].t += a.t;
      byLevel[a.lv] = byLevel[a.lv] || { r: 0, t: 0 };
      byLevel[a.lv].r += a.r; byLevel[a.lv].t += a.t;
      totalR += a.r; totalT += a.t;
    });
    var rate = totalT ? Math.round(totalR / totalT * 100) : 0;

    var days = [];
    var today0 = new Date(); today0.setHours(0, 0, 0, 0);
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today0.getTime() - i * 86400000);
      var k = dateStr(d);
      var rec = p.daily[k] || {};
      days.push({ k: k, w: '日一二三四五六'.charAt(d.getDay()), n: (rec.yw ? 1 : 0) + (rec.sx ? 1 : 0) + (rec.yy ? 1 : 0) });
    }
    var weekDone = days.filter(function (x) { return x.n >= 3; }).length;

    var weak = Object.keys(byLevel).filter(function (id) { return byLevel[id].t >= 5; })
      .map(function (id) {
        var lv = DATA.levels.filter(function (x) { return x.id === id; })[0];
        return { id: id, name: lv ? lv.name : id, icon: lv ? lv.icon : '📌', rate: Math.round(byLevel[id].r / byLevel[id].t * 100), t: byLevel[id].t };
      })
      .sort(function (a, b) { return a.rate - b.rate; })
      .slice(0, 3);

    var wrongs = collectWrong(999);
    var wrongN = wrongs.length;

    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">📊 学情看板</div><div class="coin">💰 ' + p.coins + '</div></header>';

    html += '<div class="reward-card"><div class="rc-title">📈 总体情况</div>'
      + '<div class="stat-grid">'
      + '<div class="stat"><span class="stat-num">' + totalT + '</span><span class="stat-label">累计答题</span></div>'
      + '<div class="stat"><span class="stat-num">' + (totalT ? rate + '%' : '—') + '</span><span class="stat-label">正确率</span></div>'
      + '<div class="stat"><span class="stat-num">🔥 ' + p.streak + '</span><span class="stat-label">连续天数</span></div>'
      + '<div class="stat"><span class="stat-num">' + weekDone + '/7</span><span class="stat-label">本周全勤</span></div>'
      + '</div></div>';

    html += '<div class="reward-card"><div class="rc-title">📚 各科正确率</div>';
    if (!totalT) {
      html += '<div class="empty">还没有答题记录，去玩几关就有数据啦</div>';
    } else {
      DATA.subjects.forEach(function (s) {
        var v = bySubject[s.id] || { r: 0, t: 0 };
        var pr = v.t ? Math.round(v.r / v.t * 100) : 0;
        html += '<div class="subj-row">'
          + '<span class="sr-name">' + s.icon + ' ' + s.name + '</span>'
          + '<div class="sr-bar"><div class="sr-fill" style="width:' + pr + '%;background:' + s.color + '"></div></div>'
          + '<span class="sr-val">' + (v.t ? pr + '%' : '—') + '</span>'
          + '</div>';
      });
    }
    html += '</div>';

    html += '<div class="reward-card"><div class="rc-title">⚠️ 需要加强</div>';
    if (!weak.length) {
      html += '<div class="empty">暂时没有明显薄弱点，继续保持！</div>';
    } else {
      weak.forEach(function (w) {
        html += '<button class="weak-row" data-level="' + w.id + '">'
          + '<span class="wk-icon">' + w.icon + '</span>'
          + '<span class="wk-name">' + w.name + '</span>'
          + '<span class="wk-rate bad">' + w.rate + '%</span>'
          + '<span class="wk-go">去练 ›</span>'
          + '</button>';
      });
    }
    html += '</div>';

    html += '<div class="reward-card"><div class="rc-title">📅 最近 7 天</div><div class="week-grid">';
    days.forEach(function (d) {
      var cls = d.n >= 3 ? 'full' : (d.n > 0 ? 'part' : '');
      html += '<div class="wg-day ' + cls + '"><span class="wg-w">' + d.w + '</span><span class="wg-n">' + (d.n ? d.n + '/3' : '·') + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="reward-card"><div class="rc-title">❌ 错题本（' + wrongN + ' 道）</div>';
    if (!wrongN) {
      html += '<div class="empty">还没有错题，很棒！</div>';
    } else {
      html += '<button class="btn primary redo-btn" data-act="redo">🔁 重做最近 ' + Math.min(10, wrongN) + ' 道错题</button>';
      html += '<div class="wrong-list">';
      wrongs.slice(0, 5).forEach(function (w) {
        var lv = DATA.levels.filter(function (x) { return x.id === w.lv; })[0];
        html += '<div class="wrong-item">'
          + '<div class="wi-q">' + w.q + '</div>'
          + '<div class="wi-a">正确答案：<b>' + w.answer + '</b>' + (lv ? ' · ' + lv.name : '') + '</div>'
          + '</div>';
      });
      if (wrongN > 5) html += '<div class="wi-more">还有 ' + (wrongN - 5) + ' 道…</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<p class="tip">💡 答对过的错题不会自动消失，建议每周重做一次巩固</p>';

    app.innerHTML = html;
    app.querySelector('.back').addEventListener('click', showHome);
    var redo = app.querySelector('[data-act=redo]');
    if (redo) redo.addEventListener('click', playWrong);
    app.querySelectorAll('.weak-row').forEach(function (btn) {
      btn.addEventListener('click', function () { playLevel(btn.dataset.level); });
    });
  }

  showHome();

  /* ---------- 对外接口（供书写练习等模块使用） ---------- */
  window.YSX = {
    getProgress: function () { return progress; },
    save: function () { saveProgress(progress); },
    addCoins: function (n) { progress.coins += n; saveProgress(progress); },
    checkAchievements: function () { return checkAchievements(progress); },
    updateStreak: function () { updateStreak(progress); },
    speak: speak,
    beep: { ok: beepOK, ng: beepNG, coin: beepCoin, win: beepWin },
    nav: { home: showHome, rewards: showRewards, tasks: showTasks, stats: showStats, subject: openSubject, level: playLevel }
  };

  /* 首次用户手势时解锁音频/语音（iOS/Safari 要求） */
  function unlockMedia() {
    ensureAudio();
    try {
      var u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch (e) {}
    document.removeEventListener('pointerdown', unlockMedia);
    document.removeEventListener('touchstart', unlockMedia);
    document.removeEventListener('keydown', unlockMedia);
  }
  document.addEventListener('pointerdown', unlockMedia, { once: false });
  document.addEventListener('touchstart', unlockMedia, { once: false });
  document.addEventListener('keydown', unlockMedia, { once: false });
})();
