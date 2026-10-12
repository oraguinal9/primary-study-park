/* ============================================================
 * 幼小衔接学习乐园 · 书写练习（汉字笔顺 + 拼音/英文字母描红）
 * 依赖：
 *   window.HANZI_DATA / window.HANZI_GROUPS  —— 汉字笔顺
 *   window.LATIN_GROUPS                       —— 拼音/英文字母
 *   window.YSX                                —— 进度/金币/音效/语音/导航
 * ============================================================ */
(function () {
  var HANZI = window.HANZI_DATA || {};
  var GROUPS = window.HANZI_GROUPS || [];
  var SIZE = 260;                       // 书写框尺寸（CSS px）
  var DPR = window.devicePixelRatio || 1;
  var curTab = 'hanzi';                 // hanzi | pinyin | english

  function root() { return document.getElementById('app'); }
  function Y() { return window.YSX; }

  function toCanvas(pt) { return { x: pt[0] / 1024 * SIZE, y: (900 - pt[1]) / 1024 * SIZE }; }
  function dist(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }
  function charList() {
    var list = [];
    GROUPS.forEach(function (g) { g.chars.forEach(function (c) { list.push(c); }); });
    return list;
  }
  function latinList(cat) {
    var list = [];
    (window.LATIN_GROUPS || []).forEach(function (g) { if (g.cat === cat) g.chars.forEach(function (c) { list.push(c); }); });
    return list;
  }
  function wrKey(ch, cat) { return cat ? (cat + ':' + ch) : ch; }
  function medianPath(m) {
    var d = '';
    for (var i = 0; i < m.length; i++) d += (i ? ' L ' : 'M ') + m[i][0] + ' ' + m[i][1];
    return d;
  }

  /* ============================================================
   * 汉字：描红判定（宽松，适合幼儿）—— 沿骨架中线判定
   * ============================================================ */
  function judge(pts, M) {
    if (!pts || pts.length < 2) return false;
    var tol = SIZE * 0.20, coverTol = SIZE * 0.15;
    var startD = dist(pts[0], M[0]);
    var endD = dist(pts[pts.length - 1], M[M.length - 1]);
    var covered = 0;
    for (var i = 0; i < M.length; i++) {
      for (var j = 0; j < pts.length; j++) {
        if (dist(pts[j], M[i]) < coverTol) { covered++; break; }
      }
    }
    return (startD < tol * 1.4 && endD < tol * 1.7 && (covered / M.length) >= 0.55);
  }

  /* ============================================================
   * 选字首页（带 汉字/拼音/英语 分页签）
   * ============================================================ */
  function tabsHtml() {
    var t = [
      { k: 'hanzi', label: '汉字' },
      { k: 'pinyin', label: '拼音' },
      { k: 'english', label: '英语' }
    ];
    return '<div class="wr-tabs">' + t.map(function (x) {
      return '<button class="wr-tab' + (curTab === x.k ? ' on' : '') + '" data-tab="' + x.k + '">' + x.label + '</button>';
    }).join('') + '</div>';
  }

  function renderHanzi(p) {
    var total = Object.keys(HANZI).length;
    var writtenN = Object.keys(p.written).filter(function (k) { return k.indexOf(':') < 0; }).length;
    var h = '';
    h += '<div class="wr-head">已练 <b>' + writtenN + '</b> / ' + total + ' 字 · 先看笔顺演示，再用手指描红</div>';
    GROUPS.forEach(function (g) {
      h += '<div class="wr-group"><div class="wg-title">' + g.icon + ' ' + g.name + '</div><div class="wg-chars">';
      g.chars.forEach(function (ch) {
        var n = p.written[ch] || 0;
        h += '<button class="wr-char' + (n ? ' done' : '') + '" data-ch="' + ch + '">'
          + '<span class="wc-c">' + ch + '</span>'
          + (n ? '<span class="wc-ok">✓</span>' : '')
          + '</button>';
      });
      h += '</div></div>';
    });
    return h;
  }

  function renderLatin(p) {
    var groups = (window.LATIN_GROUPS || []).filter(function (g) { return g.cat === curTab; });
    var total = groups.reduce(function (a, g) { return a + g.chars.length; }, 0);
    var done = 0;
    groups.forEach(function (g) { g.chars.forEach(function (c) { if (p.written[wrKey(c, curTab)] > 0) done++; }); });
    var h = '';
    h += '<div class="wr-head">已练 <b>' + done + '</b> / ' + total + ' 个' + (curTab === 'pinyin' ? '拼音' : '字母') + ' · 看示范再描红</div>';
    groups.forEach(function (g) {
      h += '<div class="wr-group"><div class="wg-title">' + g.icon + ' ' + g.name + '</div><div class="wg-chars">';
      g.chars.forEach(function (c) {
        var n = p.written[wrKey(c, curTab)] || 0;
        h += '<button class="wr-char' + (n ? ' done' : '') + '" data-ch="' + c + '" data-cat="' + curTab + '">'
          + '<span class="wc-c">' + c + '</span>'
          + (n ? '<span class="wc-ok">✓</span>' : '')
          + '</button>';
      });
      h += '</div></div>';
    });
    return h;
  }

  function showWriting(tab) {
    if (tab) curTab = tab;
    var p = Y().getProgress();
    var html = '';
    html += '<header class="topbar"><button class="back" data-act="home">‹ 返回</button><div class="brand">✍️ 书写练习</div><div class="coin">💰 ' + p.coins + '</div></header>';
    html += tabsHtml();
    html += (curTab === 'hanzi') ? renderHanzi(p) : renderLatin(p);
    root().innerHTML = html;

    root().querySelector('.back').addEventListener('click', Y().nav.home);
    root().querySelectorAll('.wr-tab').forEach(function (b) {
      b.addEventListener('click', function () { showWriting(b.dataset.tab); });
    });
    root().querySelectorAll('.wr-char').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (curTab === 'hanzi') practiceChar(btn.dataset.ch);
        else practiceLatin(btn.dataset.ch, btn.dataset.cat);
      });
    });
  }

  /* ============================================================
   * 单字练习页（汉字）
   * ============================================================ */
  function practiceChar(ch) {
    var d = HANZI[ch];
    if (!d) { showWriting('hanzi'); return; }
    var strokes = d.s, medians = d.m;
    var total = strokes.length;
    var cur = 0, mode = 'idle', pts = [], drawing = false, finished = false;

    function stageHtml() {
      var s = '';
      s += '<svg class="zi-svg" viewBox="0 0 1024 1024" width="' + SIZE + '" height="' + SIZE + '">';
      s += '<defs>';
      strokes.forEach(function (sp, i) {
        s += '<mask id="zmask' + i + '" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1640" height="1640">'
          + '<path id="zmp' + i + '" d="' + medianPath(medians[i]) + '" fill="none" stroke="#fff"'
          + ' stroke-width="200" stroke-linecap="round" stroke-linejoin="round"/>'
          + '</mask>';
      });
      s += '</defs>';
      s += '<g class="grid">'
        + '<rect x="3" y="3" width="1018" height="1018" fill="#fff" stroke="#dcd2be" stroke-width="6"/>'
        + '<line x1="512" y1="0" x2="512" y2="1024" stroke="#f2d3a0" stroke-width="4" stroke-dasharray="34 22"/>'
        + '<line x1="0" y1="512" x2="1024" y2="512" stroke="#f2d3a0" stroke-width="4" stroke-dasharray="34 22"/>'
        + '</g>';
      s += '<g transform="translate(0, 900) scale(1, -1)">';
      strokes.forEach(function (sp, i) {
        var cls = finished ? 'stroke done' : (i < cur ? 'stroke done' : (i === cur ? 'stroke cur' : 'stroke fut'));
        s += '<path id="zst' + i + '" class="' + cls + '" d="' + sp + '"/>';
      });
      s += '</g></svg>';
      s += '<canvas class="zi-canvas" id="ziCanvas"></canvas>';
      return s;
    }

    function setFb(el, k, t) {
      if (!el) return;
      el.className = 'wr-fb ' + k;
      el.textContent = t;
      el.style.display = 'block';
    }

    function render(fb) {
      var p = Y().getProgress();
      var html = '';
      html += '<header class="topbar"><button class="back" data-act="list">‹ 返回</button><div class="brand">✍️ 写「' + ch + '」</div><div class="coin">💰 ' + p.coins + '</div></header>';
      html += '<div class="wr-stage-wrap"><div class="wr-stage" id="stage">' + stageHtml() + '</div></div>';
      html += '<div class="wr-info">' + (finished ? '🎉 全部完成' : '第 <b>' + (cur + 1) + '</b> / ' + total + ' 笔') + ' · 共 ' + total + ' 画</div>';
      html += '<div class="wr-fb" id="wrFb" style="display:' + (fb ? 'block' : 'none') + '">' + (fb ? fb.t : '') + '</div>';
      html += '<div class="wr-btns">';
      html += '<button class="wr-btn" data-act="demo">▶ 看笔顺</button>';
      html += '<button class="wr-btn" data-act="say">🔊 读音</button>';
      if (!finished) html += '<button class="wr-btn primary" data-act="trace">' + (mode === 'trace' ? '✍️ 正在写…' : '✍️ 我来写') + '</button>';
      else html += '<button class="wr-btn primary" data-act="next">下一个字 ›</button>';
      html += '</div>';
      if (mode === 'trace' && !finished) html += '<button class="wr-skip" data-act="skip">这笔太难，跳过 ›</button>';
      html += '<p class="wr-tip">💡 点「看笔顺」先看动画，再点「我来写」用手指沿浅色笔画描</p>';
      root().innerHTML = html;

      root().querySelector('.back').addEventListener('click', function () { showWriting('hanzi'); });
      root().querySelector('[data-act=demo]').addEventListener('click', demo);
      root().querySelector('[data-act=say]').addEventListener('click', function () { Y().speak(ch, 'zh-CN'); });
      var traceBtn = root().querySelector('[data-act=trace]');
      if (traceBtn) traceBtn.addEventListener('click', function () {
        mode = 'trace'; pts = []; render({ k: 'tip', t: '沿着浅色那一笔描，从橙点开始～' });
      });
      var nextBtn = root().querySelector('[data-act=next]');
      if (nextBtn) nextBtn.addEventListener('click', function () {
        var list = charList(); var i = list.indexOf(ch);
        if (i >= 0 && i < list.length - 1) practiceChar(list[i + 1]); else showWriting('hanzi');
      });
      var skipBtn = root().querySelector('[data-act=skip]');
      if (skipBtn) skipBtn.addEventListener('click', function () {
        cur++; pts = [];
        if (cur >= total) finishChar(); else render({ k: 'tip', t: '跳过这一笔，继续下一笔' });
      });
      setupCanvas();
    }

    function setupCanvas() {
      var c = document.getElementById('ziCanvas'); if (!c) return;
      c.width = SIZE * DPR; c.height = SIZE * DPR;
      c.style.width = SIZE + 'px'; c.style.height = SIZE + 'px';
      var ctx = c.getContext('2d');
      ctx.scale(DPR, DPR); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      function pos(e) {
        var r = c.getBoundingClientRect();
        var t = (e.touches && e.touches[0]) ? e.touches[0] : e;
        return { x: (t.clientX - r.left) * (SIZE / r.width), y: (t.clientY - r.top) * (SIZE / r.height) };
      }
      function redraw() {
        ctx.clearRect(0, 0, SIZE, SIZE);
        if (!finished && mode === 'trace' && cur < medians.length) {
          var s = toCanvas(medians[cur][0]);
          ctx.beginPath(); ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(240,165,0,.4)'; ctx.fill();
        }
        if (pts.length) {
          ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
          for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 13; ctx.stroke();
        }
      }
      function start(e) { if (mode !== 'trace' || finished) return; e.preventDefault(); drawing = true; pts = [pos(e)]; redraw(); }
      function move(e) { if (!drawing) return; e.preventDefault(); pts.push(pos(e)); redraw(); }
      function end(e) {
        if (!drawing) return; e.preventDefault(); drawing = false; checkStroke();
      }
      c.addEventListener('touchstart', start, { passive: false });
      c.addEventListener('touchmove', move, { passive: false });
      c.addEventListener('touchend', end, { passive: false });
      c.addEventListener('mousedown', start);
      c.addEventListener('mousemove', move);
      c.addEventListener('mouseup', end);
      redraw();
    }

    function checkStroke() {
      var M = medians[cur].map(toCanvas);
      if (judge(pts, M)) {
        Y().beep.ok(); cur++; pts = [];
        if (cur >= total) { finishChar(); return; }
        render({ k: 'ok', t: '👍 写得不错！继续下一笔' });
      } else {
        Y().beep.ng(); pts = [];
        setFb(root().querySelector('#wrFb'), 'ng', '再试一次，沿着浅色笔画慢慢描～');
      }
    }

    function finishChar() {
      var p = Y().getProgress();
      finished = true;
      var first = !(p.written[ch] > 0);
      p.written[ch] = (p.written[ch] || 0) + 1;
      var gain = first ? 5 : 2;
      p.coins += gain;
      Y().updateStreak(); Y().checkAchievements(); Y().save();
      Y().beep.win(); Y().speak(ch + '，写好啦', 'zh-CN');
      render({ k: 'win', t: '🎉 写完了！' + (first ? '第一次写这个字，+' + gain : '+' + gain) + ' 金币' });
    }

    /* 笔顺动画：遮罩沿骨架"书写"出来 */
    function demo() {
      mode = 'demo';
      var paths = root().querySelectorAll('.zi-svg path.stroke');
      if (!paths.length) return;
      for (var k = 0; k < paths.length; k++) { paths[k].style.opacity = '0'; paths[k].removeAttribute('mask'); }
      var i = 0;
      function next() {
        if (i >= paths.length || !root().querySelector('#zst0')) {
          mode = 'idle'; render({ k: 'tip', t: '看完了，该你来写啦！' }); return;
        }
        var pth = paths[i];
        var mp = document.getElementById('zmp' + i);
        var len = 1200;
        if (mp) { try { len = mp.getTotalLength() || 1200; } catch (e) {} }
        pth.style.opacity = '1';
        pth.setAttribute('mask', 'url(#zmask' + i + ')');
        if (mp) {
          mp.style.transition = 'none';
          mp.style.strokeDasharray = len + ' ' + len;
          mp.style.strokeDashoffset = len;
        }
        void pth.getBoundingClientRect();
        if (mp) { mp.style.transition = 'stroke-dashoffset 520ms linear'; mp.style.strokeDashoffset = '0'; }
        setTimeout(function () { i++; next(); }, 660);
      }
      next();
    }

    render();
  }

  /* ============================================================
   * 拼音 / 英文字母 练习页（字体遮罩覆盖率判定）
   * ============================================================ */
  function practiceLatin(ch, cat) {
    var key = wrKey(ch, cat);
    var inkMask = null, inkList = [], inkCount = 0, covered = null;
    var inkCell = null, cellTotal = null;              // 3×3 宫格分区（防止只画一竖就通过）
    var pts = [], drawing = false, finished = false, mode = 'idle';
    var hintDots = [];                                 // 未描到的地方，失败时高亮提示

    function fontStr() { return 'bold ' + Math.round(SIZE * 0.72) + 'px "PingFang SC","Helvetica Neue",Arial,sans-serif'; }

    function buildMask() {
      var c = document.createElement('canvas');
      c.width = c.height = SIZE;
      var x = c.getContext('2d');
      x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = fontStr();
      x.fillText(ch, SIZE / 2, SIZE / 2 + SIZE * 0.02);
      var d = x.getImageData(0, 0, SIZE, SIZE).data;
      inkMask = new Uint8Array(SIZE * SIZE);
      inkList = [];
      var x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
      for (var i = 0, p = 3; i < SIZE * SIZE; i++, p += 4) {
        if (d[p] > 60) {
          inkMask[i] = 1; inkList.push(i);
          var yy = (i / SIZE) | 0, xx = i % SIZE;
          if (xx < x0) x0 = xx; if (xx > x1) x1 = xx;
          if (yy < y0) y0 = yy; if (yy > y1) y1 = yy;
        }
      }
      inkCount = inkList.length;
      covered = new Uint8Array(SIZE * SIZE);
      hintDots = [];
      // 按墨迹外框划 3×3 宫格，记录每个墨点属于哪格、每格墨量
      inkCell = new Uint8Array(SIZE * SIZE);
      cellTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      var W = Math.max(1, x1 - x0 + 1), H = Math.max(1, y1 - y0 + 1);
      for (var k = 0; k < inkCount; k++) {
        var idx = inkList[k], gy = (idx / SIZE) | 0, gx = idx % SIZE;
        var cxi = Math.min(2, ((gx - x0) * 3 / W) | 0), cyi = Math.min(2, ((gy - y0) * 3 / H) | 0);
        var cell = cyi * 3 + cxi;
        inkCell[idx] = cell; cellTotal[cell]++;
      }
    }

    function markCovered() {
      var R = Math.max(3, Math.round(SIZE * 0.06));
      for (var i = 0; i < pts.length; i++) {
        var cx = Math.round(pts[i].x), cy = Math.round(pts[i].y);
        for (var dy = -R; dy <= R; dy++) for (var dx = -R; dx <= R; dx++) {
          var px = cx + dx, py = cy + dy;
          if (px < 0 || py < 0 || px >= SIZE || py >= SIZE) continue;
          var idx = py * SIZE + px;
          if (inkMask[idx] && !covered[idx]) covered[idx] = 1;
        }
      }
    }
    function coverRate() {
      if (!inkCount) return 0;
      var cov = 0; for (var k = 0; k < inkCount; k++) if (covered[inkList[k]]) cov++;
      return cov / inkCount;
    }
    // 每个"有料"的宫格（墨量≥总墨量5%）都要描到 35% 以上
    // 否则像 f / t / r 只画一根竖也能靠总覆盖率蒙过去，横画和钩就练不到
    function gridOk() {
      if (!inkCount) return false;
      var hit = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var k = 0; k < inkCount; k++) {
        var idx = inkList[k];
        if (covered[idx]) hit[inkCell[idx]]++;
      }
      for (var c = 0; c < 9; c++) {
        if (cellTotal[c] < inkCount * 0.05) continue;
        if (hit[c] / cellTotal[c] < 0.35) return false;
      }
      return true;
    }
    function passed() { return coverRate() >= 0.6 && gridOk(); }
    // 收集还没描到的墨点，抽稀后画成淡黄小点，孩子一眼看到"哪儿漏了"
    function collectHints() {
      hintDots = [];
      for (var k = 0; k < inkCount; k += 37) {
        var idx = inkList[k];
        if (!covered[idx]) hintDots.push({ x: idx % SIZE, y: (idx / SIZE) | 0 });
      }
    }

    function renderGhost() {
      var g = document.getElementById('ziGhost'); if (!g) return;
      g.width = SIZE; g.height = SIZE;
      var x = g.getContext('2d');
      // 四线三格（上 / 中虚线 / 基 / 下）
      var top = SIZE * 0.12, mid = SIZE * 0.42, base = SIZE * 0.82, bot = SIZE * 0.92;
      x.strokeStyle = '#e3d9c3'; x.lineWidth = 2;
      [top, base, bot].forEach(function (y) { x.beginPath(); x.moveTo(6, y); x.lineTo(SIZE - 6, y); x.stroke(); });
      x.setLineDash([6, 6]); x.strokeStyle = '#cfe0ef';
      x.beginPath(); x.moveTo(6, mid); x.lineTo(SIZE - 6, mid); x.stroke(); x.setLineDash([]);
      // 浅色字母
      x.fillStyle = 'rgba(120,110,200,0.16)';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = fontStr();
      x.fillText(ch, SIZE / 2, SIZE / 2 + SIZE * 0.02);
      // 起点提示（最靠上、最靠左的墨点）
      if (!finished && inkList.length) {
        var best = inkList[0], by = 1e9, bx = 1e9;
        for (var i = 0; i < inkList.length; i++) {
          var idx = inkList[i], yy = (idx / SIZE) | 0, xx = idx % SIZE;
          if (yy < by || (yy === by && xx < bx)) { by = yy; bx = xx; best = idx; }
        }
        var sx = best % SIZE, sy = (best / SIZE) | 0;
        x.beginPath(); x.arc(sx, sy, 9, 0, Math.PI * 2); x.fillStyle = 'rgba(240,165,0,.55)'; x.fill();
      }
    }

    function setFb(k, t) {
      var el = root().querySelector('#wrFb');
      if (!el) return;
      el.className = 'wr-fb ' + k; el.textContent = t; el.style.display = 'block';
    }

    function render(fb) {
      var p = Y().getProgress();
      var html = '';
      html += '<header class="topbar"><button class="back" data-act="list">‹ 返回</button><div class="brand">✍️ 写「' + ch + '」</div><div class="coin">💰 ' + p.coins + '</div></header>';
      html += '<div class="wr-stage-wrap"><div class="wr-stage" id="stage">'
        + '<canvas class="zi-ghost" id="ziGhost" width="' + SIZE + '" height="' + SIZE + '"></canvas>'
        + '<canvas class="zi-canvas" id="ziCanvas"></canvas></div></div>';
      html += '<div class="wr-info">' + (finished ? '🎉 写好啦' : '描一描这个' + (cat === 'pinyin' ? '拼音' : '字母')) + '</div>';
      html += '<div class="wr-fb" id="wrFb" style="display:' + (fb ? 'block' : 'none') + '">' + (fb ? fb.t : '') + '</div>';
      html += '<div class="wr-btns">';
      html += '<button class="wr-btn" data-act="demo">▶ 看示范</button>';
      html += '<button class="wr-btn" data-act="say">🔊 读音</button>';
      if (!finished) html += '<button class="wr-btn primary" data-act="trace">' + (mode === 'trace' ? '✍️ 正在写…' : '✍️ 我来写') + '</button>';
      else html += '<button class="wr-btn primary" data-act="next">下一个 ›</button>';
      html += '</div>';
      if (mode === 'trace' && !finished) html += '<button class="wr-skip" data-act="skip">完成啦，跳过 ›</button>';
      html += '<p class="wr-tip">💡 点「看示范」看写法，再点「我来写」用手指把浅色字母填满</p>';
      root().innerHTML = html;

      root().querySelector('.back').addEventListener('click', function () { showWriting(curTab); });
      root().querySelector('[data-act=demo]').addEventListener('click', demo);
      root().querySelector('[data-act=say]').addEventListener('click', function () { Y().speak(ch, cat === 'pinyin' ? 'zh-CN' : 'en-US'); });
      var tb = root().querySelector('[data-act=trace]');
      if (tb) tb.addEventListener('click', function () { mode = 'trace'; pts = []; render({ k: 'tip', t: '沿着浅色字母慢慢描，把字填满～' }); });
      var nb = root().querySelector('[data-act=next]');
      if (nb) nb.addEventListener('click', function () {
        var list = latinList(curTab); var i = list.indexOf(ch);
        if (i >= 0 && i < list.length - 1) practiceLatin(list[i + 1], curTab); else showWriting(curTab);
      });
      var sb = root().querySelector('[data-act=skip]');
      if (sb) sb.addEventListener('click', finishChar);

      buildMask(); renderGhost(); setupCanvas();
    }

    function setupCanvas() {
      var c = document.getElementById('ziCanvas'); if (!c) return;
      c.width = SIZE * DPR; c.height = SIZE * DPR;
      c.style.width = SIZE + 'px'; c.style.height = SIZE + 'px';
      var ctx = c.getContext('2d');
      ctx.scale(DPR, DPR); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      function pos(e) {
        var r = c.getBoundingClientRect();
        var t = (e.touches && e.touches[0]) ? e.touches[0] : e;
        return { x: (t.clientX - r.left) * (SIZE / r.width), y: (t.clientY - r.top) * (SIZE / r.height) };
      }
      var strokes = [];   // 已写完的笔画，保留在画面上（i 的竖+点、t 的竖+横都要看得见）
      function drawLine(arr) {
        if (arr.length < 1) return;
        ctx.beginPath(); ctx.moveTo(arr[0].x, arr[0].y);
        for (var i = 1; i < arr.length; i++) ctx.lineTo(arr[i].x, arr[i].y);
        if (arr.length === 1) ctx.lineTo(arr[0].x + 0.1, arr[0].y);
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 13; ctx.stroke();
      }
      function redraw() {
        ctx.clearRect(0, 0, SIZE, SIZE);
        for (var s = 0; s < strokes.length; s++) drawLine(strokes[s]);
        drawLine(pts);
        // 漏描提示：淡黄小点标出还没描到的地方
        if (hintDots.length) {
          ctx.fillStyle = 'rgba(245,180,20,.55)';
          for (var h = 0; h < hintDots.length; h++) {
            ctx.beginPath(); ctx.arc(hintDots[h].x, hintDots[h].y, 5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      function success() { Y().beep.ok(); pts = []; strokes = []; hintDots = []; finishChar(); }
      function start(e) {
        if (mode !== 'trace' || finished) return;
        e.preventDefault(); drawing = true; hintDots = []; pts = [pos(e)]; redraw();
      }
      function move(e) {
        if (!drawing) return; e.preventDefault(); pts.push(pos(e));
        markCovered(); redraw();
        if (passed()) { drawing = false; success(); }
      }
      function end(e) {
        if (!drawing) return; e.preventDefault(); drawing = false;
        markCovered();
        if (passed()) { success(); return; }
        strokes.push(pts); pts = [];
        collectHints(); redraw();
        setFb('ng', hintDots.length ? '黄点的地方还没描到，接着描～' : '再描一下没写到的地方～');
      }
      c.addEventListener('touchstart', start, { passive: false });
      c.addEventListener('touchmove', move, { passive: false });
      c.addEventListener('touchend', end, { passive: false });
      c.addEventListener('mousedown', start);
      c.addEventListener('mousemove', move);
      c.addEventListener('mouseup', end);
      redraw();
    }

    function finishChar() {
      var p = Y().getProgress();
      finished = true;
      var first = !(p.written[key] > 0);
      p.written[key] = (p.written[key] || 0) + 1;
      var gain = first ? 5 : 2;
      p.coins += gain;
      Y().updateStreak(); Y().checkAchievements(); Y().save();
      Y().beep.win(); Y().speak(ch + (cat === 'pinyin' ? '，写好啦' : ' 写好啦'), cat === 'pinyin' ? 'zh-CN' : 'en-US');
      render({ k: 'win', t: '🎉 写好啦！' + (first ? '第一次，+' + gain : '+' + gain) + ' 金币' });
    }

    /* 看示范：逐像素“写出”字母 */
    function demo() {
      mode = 'demo';
      if (!inkList.length) return;
      var order = inkList.slice().sort(function (a, b) {
        var ay = (a / SIZE) | 0, by = (b / SIZE) | 0, ax = a % SIZE, bx = b % SIZE;
        return (ay - by) || (ax - bx);
      });
      var fc = document.createElement('canvas'); fc.width = fc.height = SIZE;
      var fx = fc.getContext('2d');
      fx.fillStyle = '#7a6ec8'; fx.textAlign = 'center'; fx.textBaseline = 'middle';
      fx.font = fontStr(); fx.fillText(ch, SIZE / 2, SIZE / 2 + SIZE * 0.02);
      var full = fx.getImageData(0, 0, SIZE, SIZE);
      var g = document.getElementById('ziGhost'); if (!g) return;
      var gx = g.getContext('2d');
      var total = order.length, i = 0;
      function drawGuides() {
        gx.clearRect(0, 0, SIZE, SIZE);
        gx.strokeStyle = '#e3d9c3'; gx.lineWidth = 2;
        var top = SIZE * 0.12, mid = SIZE * 0.42, base = SIZE * 0.82, bot = SIZE * 0.92;
        [top, base, bot].forEach(function (y) { gx.beginPath(); gx.moveTo(6, y); gx.lineTo(SIZE - 6, y); gx.stroke(); });
        gx.setLineDash([6, 6]); gx.strokeStyle = '#cfe0ef';
        gx.beginPath(); gx.moveTo(6, mid); gx.lineTo(SIZE - 6, mid); gx.stroke(); gx.setLineDash([]);
      }
      function step() {
        if (i >= total || !document.getElementById('ziGhost')) { mode = 'idle'; setFb('tip', '看完了，该你来写啦！'); return; }
        drawGuides();
        var img = gx.getImageData(0, 0, SIZE, SIZE);
        var n = Math.min(total, i + Math.max(1, Math.round(total / 40)));
        for (var k = i; k < n; k++) {
          var idx = order[k], p = idx * 4;
          img.data[p] = full.data[p]; img.data[p + 1] = full.data[p + 1];
          img.data[p + 2] = full.data[p + 2]; img.data[p + 3] = full.data[p + 3];
        }
        gx.putImageData(img, 0, 0);
        i = n; setTimeout(step, 35);
      }
      step();
    }

    render();
  }

  // 注册到主程序导航
  window.YSX_NAV = window.YSX_NAV || {};
  window.YSX_NAV.showWriting = showWriting;
  if (window.YSX && window.YSX.nav) window.YSX.nav.showWriting = showWriting;
})();
