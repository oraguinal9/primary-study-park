/* ============================================================
 * 小学学习乐园 · 课程计划 + 线下活动库
 * 计划由各年级的关卡数据「动态生成」，无需手写每周内容。
 * 用法：window.APP_PLAN.getPlan(grade, mode) -> 周计划数组
 * ============================================================ */

(function () {
  /* ---------- 线下活动库（通用，跨年级复用） ---------- */
  var ACTIVITIES = {
    // 语文
    Y1:  { name: '拼音卡片对战', how: '两人各翻一张卡，先读对对方那张的人赢走两张卡', time: '8~10 分钟', subj: 'yuwen' },
    Y2:  { name: '听音拍卡', how: '家长念一个音，孩子快速用手拍对应的卡片', time: '5~8 分钟', subj: 'yuwen' },
    Y3:  { name: '拼音跳房子', how: '地上画格子写拼音，孩子跳到哪格就读出哪格', time: '8~10 分钟', subj: 'yuwen' },
    Y4:  { name: '拼音扑克拼读接龙', how: '声母卡+韵母卡各翻一张，孩子拼读（b+a→ba）', time: '8~10 分钟', subj: 'yuwen' },
    Y5:  { name: '字卡钓鱼', how: '字卡当"鱼"摊开，孩子钓起一张读一个字', time: '8~10 分钟', subj: 'yuwen' },
    Y6:  { name: '找字游戏', how: '找身边认识的字（门牌、招牌、包装），集满 5 个有奖励', time: '5~10 分钟', subj: 'yuwen' },
    Y7:  { name: '识字绘本', how: '家长读孩子指字，再让孩子"找一找"认识的字', time: '10~15 分钟', subj: 'yuwen' },
    Y8:  { name: '砂纸描字', how: '用食指沿砂纸字的笔画描，边描边说笔画名', time: '5~8 分钟', subj: 'yuwen' },
    Y9:  { name: '笔画拼图', how: '把字拆成笔画卡，孩子拼回完整字并说出笔顺', time: '8 分钟', subj: 'yuwen' },
    Y10: { name: '看图说话', how: '按"谁—在哪—干什么—结果"引导孩子说完整句子', time: '8~10 分钟', subj: 'yuwen' },
    Y11: { name: '故事接龙', how: '家长讲一句孩子接一句，轮流往下编故事', time: '5~8 分钟', subj: 'yuwen' },
    Y12: { name: '成语接龙', how: '用学过的成语玩接龙，不会的查一查再记', time: '8 分钟', subj: 'yuwen' },

    // 数学
    M1:  { name: '数豆子', how: '点一个数一个，数完报总数再找出数字卡', time: '8 分钟', subj: 'shuxue' },
    M2:  { name: '扑克比大小', how: '各翻一张比大小，大者收牌，引出"多/少、大/小"', time: '8 分钟', subj: 'shuxue' },
    M3:  { name: '找数字', how: '家长报数，孩子找对应数字卡或按顺序排列', time: '5~8 分钟', subj: 'shuxue' },
    M4:  { name: '积木凑十', how: '把 10 块积木分成两堆，说"1 和 9 合成 10"', time: '8 分钟', subj: 'shuxue' },
    M5:  { name: '掷骰子相加', how: '同时掷两粒骰子，孩子把点数相加报和', time: '8 分钟', subj: 'shuxue' },
    M6:  { name: '超市扮演', how: '玩具贴价格标签，算"买两样一共多少""找多少"', time: '10~15 分钟', subj: 'shuxue' },
    M7:  { name: '口算计时', how: '1 分钟内尽量多答，记录今天比昨天多几题', time: '5~8 分钟', subj: 'shuxue' },
    M8:  { name: '数位积木', how: '一捆 10 根代表"10"，加几根就是"十几"', time: '8 分钟', subj: 'shuxue' },
    M9:  { name: '扑克凑十接龙', how: '翻一张牌，快速找能凑成 10 的牌（8 找 2）', time: '8~10 分钟', subj: 'shuxue' },
    M10: { name: '破十手指法', how: '如 13−5：先拿 3，再从 10 里拿 2 → 8，用积木摆出来', time: '8 分钟', subj: 'shuxue' },
    M11: { name: '零钱购物', how: '玩"小卖部"，用不同面额凑出应付的钱', time: '10 分钟', subj: 'shuxue' },
    M12: { name: '图形分类', how: '按形状分类，再按"有几条边、有没有角"分', time: '8 分钟', subj: 'shuxue' },
    M13: { name: '找规律画图', how: '摆"红蓝红蓝"，让孩子接着摆并自己编规律', time: '8 分钟', subj: 'shuxue' },
    M14: { name: '自制时钟', how: '硬纸板做钟面，孩子拨指针到指定时间', time: '8 分钟', subj: 'shuxue' },

    // 英语
    E1:  { name: '儿歌跟唱', how: '每天固定 10 分钟听英文儿歌并跟唱、做动作', time: '10 分钟', subj: 'yingyu' },
    E2:  { name: '字母歌', how: '每天唱一遍字母歌，配合字母挂图指认', time: '5 分钟', subj: 'yingyu' },
    E3:  { name: '字母闪卡', how: '快速翻卡，孩子读出字母名', time: '5~8 分钟', subj: 'yingyu' },
    E4:  { name: '大小写配对', how: '打乱字母卡，给每个大写字母找对应小写', time: '8 分钟', subj: 'yingyu' },
    E5:  { name: '字母找朋友', how: '家长说一个字母，孩子抢拍对应的卡', time: '5~8 分钟', subj: 'yingyu' },
    E6:  { name: '字母 Bingo', how: '家长报字母孩子标记，先连成一行喊 Bingo', time: '8~10 分钟', subj: 'yingyu' },
    E7:  { name: '字母音儿歌', how: '跟唱 Phonics 儿歌，配合动作（A—apple 咬一口）', time: '8 分钟', subj: 'yingyu' },
    E8:  { name: '闪卡抢答', how: '快速翻主题词卡，孩子抢答英文', time: '5~8 分钟', subj: 'yingyu' },
    E9:  { name: '找东西', how: '家长说 "Where is the red ball?" 孩子找出并回答', time: '5~10 分钟', subj: 'yingyu' },
    E10: { name: 'Simon Says', how: '"Simon says touch your nose." 没加 Simon says 就不做', time: '5~8 分钟', subj: 'yingyu' },
    E11: { name: '情景对话', how: '设定场景（打招呼、买东西），引导孩子开口说', time: '8~10 分钟', subj: 'yingyu' },
    E12: { name: '每日一句', how: '每天一个句型（如 I like…），不同场景说 3~5 次', time: '3~5 分钟', subj: 'yingyu' },
    E13: { name: '自我介绍', how: '教孩子说 "My name is… I am 7. I like…" 并录视频', time: '5 分钟', subj: 'yingyu' }
  };

  function allLevels() {
    return (window.YW_LEVELS || []).concat(window.SX_LEVELS || [], window.YY_LEVELS || []);
  }
  function findLevel(id) {
    return allLevels().filter(function (l) { return l.id === id; })[0];
  }
  function actBySub(subj) {
    return Object.keys(ACTIVITIES).filter(function (k) { return ACTIVITIES[k].subj === subj; });
  }

  /* 根据某年级关卡，动态生成 16 周或 8 周计划 */
  function buildPlan(grade, weeks) {
    var lv = allLevels().filter(function (l) { return l.grade === grade; });
    var subs = { yuwen: [], shuxue: [], yingyu: [] };
    lv.forEach(function (l) { if (subs[l.subject]) subs[l.subject].push(l); });

    var plan = [];
    for (var w = 0; w < weeks; w++) {
      plan.push({ w: w + 1, yw: { c: '', a: [], l: [] }, sx: { c: '', a: [], l: [] }, yy: { c: '', a: [], l: [] } });
    }

    ['yuwen', 'shuxue', 'yingyu'].forEach(function (s) {
      var key = s === 'yuwen' ? 'yw' : s === 'shuxue' ? 'sx' : 'yy';
      var arr = subs[s];
      var acts = actBySub(s);
      if (!arr.length) return;
      arr.forEach(function (l, i) {
        var wk = plan[i % weeks];
        if (wk[key].l.indexOf(l.id) < 0) wk[key].l.push(l.id);
        var a = acts[i % acts.length];
        if (wk[key].a.indexOf(a) < 0) wk[key].a.push(a);
        // 再多给一个活动，每周 1~2 个
        var a2 = acts[(i + 3) % acts.length];
        if (wk[key].a.length < 2 && wk[key].a.indexOf(a2) < 0) wk[key].a.push(a2);
      });
    });

    // 用关卡名生成每周文案
    plan.forEach(function (wk) {
      ['yw', 'sx', 'yy'].forEach(function (key) {
        var ids = wk[key].l;
        if (!ids.length) { wk[key].c = '自由复习 / 口算打卡'; return; }
        var names = ids.map(function (id) { var l = findLevel(id); return l ? l.name : id; });
        wk[key].c = '本周：' + names.join('、');
      });
    });
    return plan;
  }

  window.APP_PLAN = {
    activities: ACTIVITIES,
    modes: [
      { id: '16', name: '16 周慢速版', desc: '稳步推进，每周一个新主题', icon: '🐢' },
      { id: '8', name: '8 周暑期冲刺', desc: '抓主线快跑，每天 45~60 分钟', icon: '🐇' }
    ],
    getPlan: function (grade, mode) {
      var weeks = (String(mode) === '8') ? 8 : 16;
      return buildPlan(grade, weeks);
    }
  };
})();
