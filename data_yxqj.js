/* ============================================================
 * 幼小衔接学习乐园 · 题库数据 + 奖励体系数据
 * 三科：语文 / 数学 / 英语
 * 每题统一结构：
 *   { q: 题干(可含html/emoji), sub: 配图, options:[...],
 *     answer:正确选项"值", speak: 朗读文本, speakLang: 朗读语言 }
 * 注：answer 用"值"比较，不怕洗牌。
 * ============================================================ */

(function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr, n) { return shuffle(arr).slice(0, n); }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  /* 无放回取恰好 n 个：先打乱取前 n，池不足时循环补足，保证返回 n 项且前 pool.length 项互不重复 */
  function pickN(pool, n) { var base = shuffle(pool), out = []; for (var i = 0; i < n; i++) out.push(base[i % base.length]); return out; }
  function repeat(s, n) { var r = ''; for (var i = 0; i < n; i++) r += s; return r; }

  /* ============================================================
   * 语文
   * ============================================================ */
  // 拼音认读：看汉字选正确拼音（声母 + 单韵母）
  var pinyinBase = [
    { ch: '八', py: 'bā', opts: ['bā', 'pā', 'dā'] },
    { ch: '爸', py: 'bà', opts: ['bà', 'pà', 'dà'] },
    { ch: '马', py: 'mǎ', opts: ['mǎ', 'nǎ', 'fǎ'] },
    { ch: '大', py: 'dà', opts: ['dà', 'tà', 'bà'] },
    { ch: '拿', py: 'ná', opts: ['ná', 'lá', 'má'] },
    { ch: '拉', py: 'lā', opts: ['lā', 'nā', 'dā'] },
    { ch: '哥', py: 'gē', opts: ['gē', 'kē', 'hē'] },
    { ch: '河', py: 'hé', opts: ['hé', 'gé', 'kè'] },
    { ch: '鸡', py: 'jī', opts: ['jī', 'qī', 'xī'] },
    { ch: '七', py: 'qī', opts: ['qī', 'jī', 'xī'] },
    { ch: '西', py: 'xī', opts: ['xī', 'jī', 'qī'] },
    { ch: '书', py: 'shū', opts: ['shū', 'sū', 'xū'] },
    { ch: '波', py: 'bō', opts: ['bō', 'pō', 'mō'] },
    { ch: '佛', py: 'fó', opts: ['fó', 'fú', 'fù'] },
    { ch: '得', py: 'dé', opts: ['dé', 'tè', 'dè'] },
    { ch: '猪', py: 'zhū', opts: ['zhū', 'zū', 'chū'] },
    { ch: '出', py: 'chū', opts: ['chū', 'zhū', 'cū'] },
    { ch: '人', py: 'rén', opts: ['rén', 'lén', 'rèng'] },
    { ch: '坐', py: 'zuò', opts: ['zuò', 'cuò', 'zòu'] },
    { ch: '说', py: 'shuō', opts: ['shuō', 'suō', 'shu'] },
    { ch: '三', py: 'sān', opts: ['sān', 'shān', 'cān'] },
    { ch: '天', py: 'tiān', opts: ['tiān', 'diān', 'tiāng'] },
    { ch: '鸟', py: 'niǎo', opts: ['niǎo', 'liǎo', 'miǎo'] },
    { ch: '六', py: 'liù', opts: ['liù', 'niù', 'liú'] },
    { ch: '白', py: 'bái', opts: ['bái', 'pái', 'dái'] },
    { ch: '木', py: 'mù', opts: ['mù', 'mó', 'nù'] },
    { ch: '米', py: 'mǐ', opts: ['mǐ', 'nǐ', 'mì'] },
    { ch: '力', py: 'lì', opts: ['lì', 'nì', 'lí'] },
    { ch: '心', py: 'xīn', opts: ['xīn', 'xīng', 'xín'] },
    { ch: '中', py: 'zhōng', opts: ['zhōng', 'zōng', 'chōng'] },
    { ch: '上', py: 'shàng', opts: ['shàng', 'sàng', 'shāng'] },
    { ch: '下', py: 'xià', opts: ['xià', 'xiā', 'xà'] },
    { ch: '小', py: 'xiǎo', opts: ['xiǎo', 'xiāo', 'shǎo'] },
    { ch: '女', py: 'nǚ', opts: ['nǚ', 'lǚ', 'nù'] },
    { ch: '子', py: 'zǐ', opts: ['zǐ', 'zhǐ', 'cǐ'] },
    { ch: '儿', py: 'ér', opts: ['ér', 'èr', 'ěr'] },
    { ch: '雨', py: 'yǔ', opts: ['yǔ', 'yú', 'yù'] },
    { ch: '工', py: 'gōng', opts: ['gōng', 'kōng', 'hōng'] },
    { ch: '电', py: 'diàn', opts: ['diàn', 'tiàn', 'dián'] },
    { ch: '车', py: 'chē', opts: ['chē', 'cē', 'zhē'] }
  ];

  // 拼读闯关：复韵母 + 鼻韵母
  var pinyinFu = [
    { ch: '爱', py: 'ài', opts: ['ài', 'èi', 'āo'] },
    { ch: '飞', py: 'fēi', opts: ['fēi', 'huī', 'fēn'] },
    { ch: '牛', py: 'niú', opts: ['niú', 'liú', 'miú'] },
    { ch: '月', py: 'yuè', opts: ['yuè', 'yè', 'yuē'] },
    { ch: '耳', py: 'ěr', opts: ['ěr', 'ér', 'è'] },
    { ch: '山', py: 'shān', opts: ['shān', 'sān', 'shāng'] },
    { ch: '门', py: 'mén', opts: ['mén', 'mēn', 'méng'] },
    { ch: '云', py: 'yún', opts: ['yún', 'yín', 'yíng'] },
    { ch: '星', py: 'xīng', opts: ['xīng', 'xīn', 'xíng'] },
    { ch: '红', py: 'hóng', opts: ['hóng', 'hēng', 'hóu'] },
    { ch: '好', py: 'hǎo', opts: ['hǎo', 'hào', 'hāo'] },
    { ch: '猫', py: 'māo', opts: ['māo', 'máo', 'mòu'] },
    { ch: '口', py: 'kǒu', opts: ['kǒu', 'kòu', 'kōu'] },
    { ch: '球', py: 'qiú', opts: ['qiú', 'qiū', 'quí'] },
    { ch: '田', py: 'tián', opts: ['tián', 'tiān', 'tán'] },
    { ch: '春', py: 'chūn', opts: ['chūn', 'chēn', 'cūn'] },
    { ch: '风', py: 'fēng', opts: ['fēng', 'fēn', 'fōng'] },
    { ch: '明', py: 'míng', opts: ['míng', 'mín', 'mēng'] },
    { ch: '花', py: 'huā', opts: ['huā', 'huà', 'fā'] },
    { ch: '草', py: 'cǎo', opts: ['cǎo', 'cào', 'chǎo'] },
    { ch: '长', py: 'cháng', opts: ['cháng', 'chǎng', 'cáng'] },
    { ch: '鸭', py: 'yā', opts: ['yā', 'yá', 'yà'] },
    { ch: '雪', py: 'xuě', opts: ['xuě', 'xiě', 'xué'] },
    { ch: '来', py: 'lái', opts: ['lái', 'nái', 'lài'] },
    { ch: '去', py: 'qù', opts: ['qù', 'qú', 'qū'] },
    { ch: '话', py: 'huà', opts: ['huà', 'huá', 'fà'] },
    { ch: '文', py: 'wén', opts: ['wén', 'wēn', 'wèng'] },
    { ch: '字', py: 'zì', opts: ['zì', 'zhì', 'cí'] },
    { ch: '学', py: 'xué', opts: ['xué', 'xié', 'xüé'] },
    { ch: '生', py: 'shēng', opts: ['shēng', 'shēn', 'shéng'] },
    { ch: '先', py: 'xiān', opts: ['xiān', 'qiān', 'xián'] },
    { ch: '后', py: 'hòu', opts: ['hòu', 'hóu', 'huò'] },
    { ch: '高', py: 'gāo', opts: ['gāo', 'kāo', 'háo'] },
    { ch: '低', py: 'dī', opts: ['dī', 'tī', 'dí'] }
  ];

  // 声调辨认：看音节判断第几声
  var toneData = [
    { py: 'mā', tone: '一声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'má', tone: '二声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'mǎ', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'mà', tone: '四声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'bā', tone: '一声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'bǎ', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'dà', tone: '四声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'dì', tone: '四声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'hé', tone: '二声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'huǒ', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'shuǐ', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'shān', tone: '一声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'cháng', tone: '二声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'tiān', tone: '一声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'shí', tone: '二声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'hǎo', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'mèi', tone: '四声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'gē', tone: '一声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'nǐ', tone: '三声', opts: ['一声', '二声', '三声', '四声'] },
    { py: 'kuài', tone: '四声', opts: ['一声', '二声', '三声', '四声'] }
  ];

  // 象形字识字：看图选字
  var xiangxing = [
    { e: '☀️', zi: '日', opts: ['日', '月', '火'] },
    { e: '🌙', zi: '月', opts: ['月', '日', '云'] },
    { e: '⛰️', zi: '山', opts: ['山', '水', '门'] },
    { e: '💧', zi: '水', opts: ['水', '火', '山'] },
    { e: '🔥', zi: '火', opts: ['火', '水', '木'] },
    { e: '🌳', zi: '木', opts: ['木', '禾', '火'] },
    { e: '🧍', zi: '人', opts: ['人', '入', '大'] },
    { e: '👄', zi: '口', opts: ['口', '日', '目'] },
    { e: '✋', zi: '手', opts: ['手', '毛', '干'] },
    { e: '👁️', zi: '目', opts: ['目', '日', '口'] },
    { e: '🚪', zi: '门', opts: ['门', '闪', '问'] },
    { e: '🌊', zi: '川', opts: ['川', '州', '水'] },
    { e: '☁️', zi: '云', opts: ['云', '去', '天'] },
    { e: '🌧️', zi: '雨', opts: ['雨', '雪', '云'] },
    { e: '🌾', zi: '禾', opts: ['禾', '木', '田'] },
    { e: '🐦', zi: '鸟', opts: ['鸟', '马', '鱼'] },
    { e: '🐟', zi: '鱼', opts: ['鱼', '鸟', '虾'] },
    { e: '🐴', zi: '马', opts: ['马', '牛', '羊'] },
    { e: '🐮', zi: '牛', opts: ['牛', '马', '羊'] },
    { e: '🐑', zi: '羊', opts: ['羊', '牛', '马'] },
    { e: '🌿', zi: '草', opts: ['草', '花', '苗'] },
    { e: '🪨', zi: '石', opts: ['石', '土', '山'] },
    { e: '🐰', zi: '兔', opts: ['兔', '免', '色'] },
    { e: '🐯', zi: '虎', opts: ['虎', '豹', '虚'] },
    { e: '🐻', zi: '熊', opts: ['熊', '能', '热'] },
    { e: '🐭', zi: '鼠', opts: ['鼠', '老', '喜'] },
    { e: '🐲', zi: '龙', opts: ['龙', '尤', '笼'] },
    { e: '🐍', zi: '蛇', opts: ['蛇', '它', '驼'] },
    { e: '🐔', zi: '鸡', opts: ['鸡', '鸭', '鹅'] },
    { e: '🌻', zi: '花', opts: ['花', '草', '苗'] },
    { e: '🍎', zi: '果', opts: ['果', '里', '课'] }
  ];

  // 反义词
  var fanyi = [
    { a: '大', b: '小', opts: ['小', '多', '少'] },
    { a: '多', b: '少', opts: ['少', '小', '大'] },
    { a: '上', b: '下', opts: ['下', '左', '右'] },
    { a: '高', b: '矮', opts: ['矮', '胖', '瘦'] },
    { a: '长', b: '短', opts: ['短', '高', '大'] },
    { a: '冷', b: '热', opts: ['热', '暖', '温'] },
    { a: '黑', b: '白', opts: ['白', '红', '黄'] },
    { a: '开', b: '关', opts: ['关', '合', '闭'] },
    { a: '快', b: '慢', opts: ['慢', '急', '迟'] },
    { a: '前', b: '后', opts: ['后', '左', '右'] },
    { a: '胖', b: '瘦', opts: ['瘦', '高', '长'] },
    { a: '左', b: '右', opts: ['右', '上', '下'] },
    { a: '里', b: '外', opts: ['外', '内', '中'] },
    { a: '新', b: '旧', opts: ['旧', '老', '古'] },
    { a: '轻', b: '重', opts: ['重', '软', '硬'] },
    { a: '甜', b: '苦', opts: ['苦', '酸', '辣'] },
    { a: '远', b: '近', opts: ['近', '进', '金'] },
    { a: '粗', b: '细', opts: ['细', '组', '红'] },
    { a: '早', b: '晚', opts: ['晚', '午', '夜'] },
    { a: '哭', b: '笑', opts: ['笑', '叫', '唱'] }
  ];

  // 古诗填空
  var gushi = [
    { q: '床前明月光，疑是地上<span class="slot">___</span>。', w: '霜', opts: ['霜', '雪', '露'] },
    { q: '春眠不觉晓，处处闻啼<span class="slot">___</span>。', w: '鸟', opts: ['鸟', '鸡', '虫'] },
    { q: '锄禾日当午，汗滴禾下<span class="slot">___</span>。', w: '土', opts: ['土', '田', '地'] },
    { q: '白日依山尽，黄河入海<span class="slot">___</span>。', w: '流', opts: ['流', '河', '江'] },
    { q: '欲穷千里目，更上一层<span class="slot">___</span>。', w: '楼', opts: ['楼', '山', '塔'] },
    { q: '离离原上草，一岁一枯<span class="slot">___</span>。', w: '荣', opts: ['荣', '青', '绿'] },
    { q: '举头望明月，低头思故<span class="slot">___</span>。', w: '乡', opts: ['乡', '家', '园'] },
    { q: '小时不识月，呼作白玉<span class="slot">___</span>。', w: '盘', opts: ['盘', '盆', '碗'] },
    { q: '夜来风雨声，花落知多<span class="slot">___</span>。', w: '少', opts: ['少', '多', '早'] },
    { q: '谁知盘中餐，粒粒皆辛<span class="slot">___</span>。', w: '苦', opts: ['苦', '甜', '辣'] },
    { q: '春种一粒粟，秋收万颗<span class="slot">___</span>。', w: '子', opts: ['子', '米', '粮'] },
    { q: '两个黄鹂鸣翠柳，一行白鹭上青<span class="slot">___</span>。', w: '天', opts: ['天', '云', '空'] },
    { q: '接天莲叶无穷<span class="slot">___</span>，映日荷花别样红。', w: '碧', opts: ['碧', '绿', '蓝'] },
    { q: '千山鸟飞<span class="slot">___</span>，万径人踪灭。', w: '绝', opts: ['绝', '尽', '灭'] },
    { q: '慈母手中线，游子身上<span class="slot">___</span>。', w: '衣', opts: ['衣', '裤', '衫'] },
    { q: '远看山有色，近听水无<span class="slot">___</span>。', w: '声', opts: ['声', '色', '水'] },
    { q: '春去花还在，人来鸟不<span class="slot">___</span>。', w: '惊', opts: ['惊', '飞', '叫'] },
    { q: '鹅，鹅，鹅，曲项向天<span class="slot">___</span>。', w: '歌', opts: ['歌', '叫', '唱'] },
    { q: '白毛浮绿<span class="slot">___</span>，红掌拨清波。', w: '水', opts: ['水', '山', '云'] },
    { q: '一去二三里，烟村四五<span class="slot">___</span>。', w: '家', opts: ['家', '村', '户'] },
    { q: '小荷才露尖尖<span class="slot">___</span>，早有蜻蜓立上头。', w: '角', opts: ['角', '头', '尖'] },
    { q: '不知细叶谁裁出，二月春风似剪<span class="slot">___</span>。', w: '刀', opts: ['刀', '风', '春'] },
    { q: '迟日江山丽，春风花草<span class="slot">___</span>。', w: '香', opts: ['香', '花', '绿'] },
    { q: '窗含西岭千秋<span class="slot">___</span>，门泊东吴万里船。', w: '雪', opts: ['雪', '冰', '风'] },
    { q: '桃花潭水深千尺，不及汪伦送我<span class="slot">___</span>。', w: '情', opts: ['情', '心', '谊'] },
    { q: '粉骨碎身浑不怕，要留清白在人<span class="slot">___</span>。', w: '间', opts: ['间', '世', '心'] },
    { q: '千锤万凿出深<span class="slot">___</span>，烈火焚烧若等闲。', w: '山', opts: ['山', '石', '土'] }
  ];

  /* ============================================================
   * 数学
   * ============================================================ */
  var FRUIT = ['🍎', '🍌', '🍓', '🍇', '🍊', '🐟', '🐞', '⭐', '🎈', '🍭', '🐤', '🌸'];

  function countQ() {
    var n = rand(2, 10);
    var e = FRUIT[rand(0, FRUIT.length - 1)];
    var emojis = repeat(e, n);
    var correct = String(n);
    var pool = [];
    for (var k = 1; k <= 10; k++) if (k !== n) pool.push(String(k));
    var dis = pick(pool, 2);
    var opts = shuffle([correct].concat(dis));
    return { q: '数一数，一共有几个？', sub: emojis, options: opts, answer: correct, speak: correct, speakLang: 'zh-CN' };
  }

  // 比大小：实物多少 + 数字大小 混合
  function compareQ() {
    if (Math.random() < 0.5) return compareCountQ();
    return compareNumQ();
  }
  function compareCountQ() {
    var a = rand(2, 9), b = rand(2, 9);
    if (a === b) a = a < 9 ? a + 1 : a - 1;
    var ea = FRUIT[rand(0, FRUIT.length - 1)];
    var eb = FRUIT[rand(0, FRUIT.length - 1)];
    var answer = a > b ? '左边多' : '右边多';
    return {
      q: '哪边更多？',
      sub: '<div class="cmp"><div class="cmp-side">' + repeat(ea, a) + '</div><div class="cmp-vs">VS</div><div class="cmp-side">' + repeat(eb, b) + '</div></div>',
      options: ['左边多', '右边多', '一样多'],
      answer: answer, speak: answer, speakLang: 'zh-CN'
    };
  }
  function compareNumQ() {
    var a = rand(1, 19), b = rand(1, 19);
    if (a === b) a = a < 19 ? a + 1 : a - 1;
    var bigger = a > b ? a : b;
    var smaller = a > b ? b : a;
    var opts = [bigger, smaller];
    var guard = 0;
    while (opts.length < 3 && guard++ < 50) {
      var d = rand(1, 20);
      if (opts.indexOf(d) === -1) opts.push(d);
    }
    return {
      q: a + ' 和 ' + b + '，谁更大？',
      options: shuffle(opts.map(String)),
      answer: String(bigger), speak: String(bigger), speakLang: 'zh-CN'
    };
  }

  function addSubQ(limit) {
    var op = Math.random() < 0.5 ? '+' : '-';
    var a, b, correct;
    if (op === '+') {
      a = rand(1, limit - 1); b = rand(1, limit - a);
      correct = a + b;
    } else {
      a = rand(2, limit); b = rand(1, a - 1);
      correct = a - b;
    }
    var opts = [correct];
    while (opts.length < 3) {
      var d = correct + rand(-2, 2);
      if (d >= 0 && d <= limit && opts.indexOf(d) === -1) opts.push(d);
    }
    opts = shuffle(opts.map(String));
    return { q: a + ' ' + op + ' ' + b + ' = ?', options: opts, answer: String(correct), speak: String(correct), speakLang: 'zh-CN' };
  }

  // 凑十法：10 的组成
  function makeTenQ() {
    var a = rand(1, 9);
    var b = 10 - a;
    var correct = String(b);
    var pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== b; });
    var dis = pick(pool, 2).map(String);
    return { q: a + ' + <span class="slot">?</span> = 10，问号是几？', options: shuffle([correct].concat(dis)), answer: correct, speak: correct, speakLang: 'zh-CN' };
  }

  var SHAPES = [
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="#f0b429"/></svg>', name: '圆形', opts: ['圆形', '三角形', '正方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,6 66,64 4,64" fill="#e8543f"/></svg>', name: '三角形', opts: ['三角形', '圆形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><rect x="6" y="6" width="58" height="58" fill="#2f80c9"/></svg>', name: '正方形', opts: ['正方形', '长方形', '圆形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><rect x="2" y="6" width="76" height="38" fill="#2fa35b"/></svg>', name: '长方形', opts: ['长方形', '正方形', '三角形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><ellipse cx="40" cy="25" rx="36" ry="18" fill="#9b6fe0"/></svg>', name: '椭圆形', opts: ['椭圆形', '圆形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,5 42.4,24.8 63.5,25.7 47,38.9 52.6,59.3 35,47.6 17.4,59.3 23,38.9 6.5,25.7 27.6,24.8" fill="#f5a623"/></svg>', name: '五角星', opts: ['五角星', '三角形', '正方形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><polygon points="14,8 66,8 54,42 26,42" fill="#e06fd0"/></svg>', name: '梯形', opts: ['梯形', '长方形', '三角形'] },
    { svg: '<svg width="70" height="64" viewBox="0 0 70 64"><path d="M35 60 C10 40 8 18 22 14 C30 11 35 18 35 22 C35 18 40 11 48 14 C62 18 60 40 35 60 Z" fill="#ff7a9a"/></svg>', name: '心形', opts: ['心形', '圆形', '五角星'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><path d="M2 45 A38 38 0 0 1 78 45 Z" fill="#f59e0b"/></svg>', name: '半圆形', opts: ['半圆形', '圆形', '扇形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,5 65,35 35,65 5,35" fill="#34c759"/></svg>', name: '菱形', opts: ['菱形', '正方形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,5 63,20 63,50 35,65 7,50 7,20" fill="#ff6b6b"/></svg>', name: '六边形', opts: ['六边形', '五边形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="22,5 48,5 65,22 65,48 48,65 22,65 5,48 5,22" fill="#5ac8fa"/></svg>', name: '八边形', opts: ['八边形', '六边形', '圆形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><polygon points="20,8 76,8 60,42 4,42" fill="#af7bff"/></svg>', name: '平行四边形', opts: ['平行四边形', '长方形', '梯形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><path d="M35 35 L35 6 A29 29 0 0 1 62 50 Z" fill="#ff9f0a"/></svg>', name: '扇形', opts: ['扇形', '半圆形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="10,22 35,8 60,22 60,48 35,62 10,48" fill="#ffd60a"/><polygon points="10,22 35,8 35,32 10,46" fill="#ffe98a"/><polygon points="60,22 35,8 35,32 60,46" fill="#e6b800"/></svg>', name: '正方体', opts: ['正方体', '正方形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="#ff6b6b"/><ellipse cx="35" cy="35" rx="12" ry="30" fill="#ff9b9b" opacity="0.5"/></svg>', name: '球体', opts: ['球体', '圆形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><ellipse cx="35" cy="14" rx="24" ry="8" fill="#5ac8fa"/><rect x="11" y="14" width="48" height="42" fill="#5ac8fa"/><ellipse cx="35" cy="56" rx="24" ry="8" fill="#3aa0d0"/></svg>', name: '圆柱体', opts: ['圆柱体', '长方形', '正方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,8 62,58 8,58" fill="#af7bff"/><ellipse cx="35" cy="58" rx="27" ry="8" fill="#8a5be0"/></svg>', name: '圆锥体', opts: ['圆锥体', '三角形', '梯形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><path d="M45 8 A30 30 0 1 0 45 62 A22 22 0 1 1 45 8 Z" fill="#ffd60a"/></svg>', name: '月牙形', opts: ['月牙形', '圆形', '半圆形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,5 66,28 54,63 16,63 4,28" fill="#ffb340"/></svg>', name: '五边形', opts: ['五边形', '六边形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="#4cd964"/><circle cx="35" cy="35" r="13" fill="#ffffff"/></svg>', name: '环形', opts: ['环形', '圆形', '扇形'] }
  ];

  // 找规律：数字 + 图形 混合
  var numPatterns = [
    { seq: '1 · 2 · 3 · <b>?</b>', ans: '4', opts: ['4', '5', '2'] },
    { seq: '2 · 4 · 6 · <b>?</b>', ans: '8', opts: ['8', '7', '9'] },
    { seq: '5 · 6 · 7 · <b>?</b>', ans: '8', opts: ['8', '9', '6'] },
    { seq: '1 · 3 · 5 · <b>?</b>', ans: '7', opts: ['7', '6', '8'] },
    { seq: '10 · 9 · 8 · <b>?</b>', ans: '7', opts: ['7', '6', '9'] },
    { seq: '2 · 2 · 3 · 3 · <b>?</b>', ans: '4', opts: ['4', '3', '5'] },
    { seq: '4 · 5 · 6 · <b>?</b>', ans: '7', opts: ['7', '8', '5'] },
    { seq: '3 · 6 · 9 · <b>?</b>', ans: '12', opts: ['12', '10', '11'] },
    { seq: '20 · 18 · 16 · <b>?</b>', ans: '14', opts: ['14', '15', '12'] },
    { seq: '1 · 4 · 7 · <b>?</b>', ans: '10', opts: ['10', '9', '11'] },
    { seq: '3 · 5 · 7 · <b>?</b>', ans: '9', opts: ['9', '8', '10'] },
    { seq: '2 · 4 · 6 · 8 · <b>?</b>', ans: '10', opts: ['10', '9', '12'] },
    { seq: '9 · 8 · 7 · <b>?</b>', ans: '6', opts: ['6', '5', '7'] },
    { seq: '5 · 10 · 15 · <b>?</b>', ans: '20', opts: ['20', '25', '15'] },
    { seq: '1 · 2 · 4 · 8 · <b>?</b>', ans: '16', opts: ['16', '12', '14'] },
    { seq: '1 · 1 · 2 · 3 · <b>?</b>', ans: '5', opts: ['5', '4', '6'] },
    { seq: '11 · 9 · 7 · <b>?</b>', ans: '5', opts: ['5', '3', '6'] },
    { seq: '100 · 90 · 80 · <b>?</b>', ans: '70', opts: ['70', '60', '75'] },
    { seq: '2 · 3 · 5 · 8 · <b>?</b>', ans: '13', opts: ['13', '12', '11'] },
    { seq: '4 · 8 · 12 · <b>?</b>', ans: '16', opts: ['16', '14', '20'] }
  ];
  var emojiPatterns = [
    { seq: '🍎 🍌 🍎 🍌 <b>?</b>', ans: '🍎', opts: ['🍎', '🍌', '🍇'] },
    { seq: '⭐ 🌙 ⭐ 🌙 <b>?</b>', ans: '⭐', opts: ['⭐', '🌙', '☀️'] },
    { seq: '🐱 🐶 🐱 🐶 <b>?</b>', ans: '🐱', opts: ['🐱', '🐶', '🐭'] },
    { seq: '🔴 🔵 🔴 🔵 <b>?</b>', ans: '🔴', opts: ['🔴', '🔵', '🟢'] },
    { seq: '🍎 🍎 🍌 🍎 🍎 <b>?</b>', ans: '🍌', opts: ['🍌', '🍎', '🍇'] },
    { seq: '🔺 🔻 🔺 🔻 <b>?</b>', ans: '🔺', opts: ['🔺', '🔻', '🔶'] },
    { seq: '🐱 🐱 🐶 🐱 🐱 <b>?</b>', ans: '🐶', opts: ['🐶', '🐱', '🐭'] },
    { seq: '🍎 🍊 🍎 🍊 <b>?</b>', ans: '🍎', opts: ['🍎', '🍊', '🍇'] },
    { seq: '🔴 🟡 🔴 🟡 <b>?</b>', ans: '🔴', opts: ['🔴', '🟡', '🟢'] },
    { seq: '🌞 🌙 🌞 🌙 <b>?</b>', ans: '🌞', opts: ['🌞', '🌙', '⭐'] },
    { seq: '🐶 🐱 🐶 🐱 <b>?</b>', ans: '🐶', opts: ['🐶', '🐱', '🐰'] },
    { seq: '⭐ ⭐ 🌙 ⭐ ⭐ <b>?</b>', ans: '🌙', opts: ['🌙', '⭐', '☀️'] },
    { seq: '🔺 🔺 🔻 🔺 🔺 <b>?</b>', ans: '🔻', opts: ['🔻', '🔺', '🔶'] },
    { seq: '🍇 🍓 🍇 🍓 <b>?</b>', ans: '🍇', opts: ['🍇', '🍓', '🍌'] }
  ];
  function patternQ() {
    if (Math.random() < 0.5) {
      var n = numPatterns[rand(0, numPatterns.length - 1)];
      return { q: '找规律，? 处应该填什么？', sub: '<div class="pattern">' + n.seq + '</div>', options: n.opts, answer: n.ans, speak: n.ans, speakLang: 'zh-CN' };
    }
    var e = emojiPatterns[rand(0, emojiPatterns.length - 1)];
    return { q: '找规律，? 处应该放什么？', sub: '<div class="pattern">' + e.seq + '</div>', options: e.opts, answer: e.ans };
  }

  // 认识钟表：整点认读（用时钟 emoji 表示）
  var CLOCK = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
  function clockQ() {
    var h = rand(1, 12);
    var correct = h + ' 点';
    var pool = [];
    for (var k = 1; k <= 12; k++) if (k !== h) pool.push(k + ' 点');
    var dis = pick(pool, 2);
    return {
      q: '看看钟表，现在是几点？',
      sub: '<span class="big-emoji">' + CLOCK[h - 1] + '</span>',
      options: shuffle([correct].concat(dis)),
      answer: correct, speak: h + ' 点', speakLang: 'zh-CN'
    };
  }

  /* ============================================================
   * 英语
   * ============================================================ */
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  var vocab = [
    { e: '🔴', cn: '红色', w: 'red', opts: ['red', 'blue', 'yellow'] },
    { e: '🔵', cn: '蓝色', w: 'blue', opts: ['blue', 'green', 'red'] },
    { e: '🟢', cn: '绿色', w: 'green', opts: ['green', 'red', 'blue'] },
    { e: '🟡', cn: '黄色', w: 'yellow', opts: ['yellow', 'green', 'red'] },
    { e: '🐱', cn: '猫', w: 'cat', opts: ['cat', 'dog', 'bird'] },
    { e: '🐶', cn: '狗', w: 'dog', opts: ['dog', 'cat', 'pig'] },
    { e: '🐦', cn: '鸟', w: 'bird', opts: ['bird', 'fish', 'duck'] },
    { e: '🐟', cn: '鱼', w: 'fish', opts: ['fish', 'bird', 'cat'] },
    { e: '🦆', cn: '鸭子', w: 'duck', opts: ['duck', 'pig', 'cow'] },
    { e: '🐷', cn: '猪', w: 'pig', opts: ['pig', 'cow', 'dog'] },
    { e: '🐮', cn: '奶牛', w: 'cow', opts: ['cow', 'duck', 'pig'] },
    { e: '✋', cn: '手', w: 'hand', opts: ['hand', 'head', 'foot'] },
    { e: '👤', cn: '头', w: 'head', opts: ['head', 'hand', 'hair'] },
    { e: '👁️', cn: '眼睛', w: 'eye', opts: ['eye', 'ear', 'nose'] },
    { e: '👂', cn: '耳朵', w: 'ear', opts: ['ear', 'eye', 'nose'] },
    { e: '👃', cn: '鼻子', w: 'nose', opts: ['nose', 'ear', 'mouth'] },
    { e: '👄', cn: '嘴巴', w: 'mouth', opts: ['mouth', 'nose', 'eye'] },
    { e: '🦶', cn: '脚', w: 'foot', opts: ['foot', 'hand', 'leg'] },
    { e: '🍎', cn: '苹果', w: 'apple', opts: ['apple', 'banana', 'orange'] },
    { e: '🍌', cn: '香蕉', w: 'banana', opts: ['banana', 'apple', 'grape'] },
    { e: '🍊', cn: '橙子', w: 'orange', opts: ['orange', 'apple', 'pear'] },
    { e: '🥛', cn: '牛奶', w: 'milk', opts: ['milk', 'water', 'juice'] },
    { e: '💧', cn: '水', w: 'water', opts: ['water', 'milk', 'juice'] },
    { e: '🍚', cn: '米饭', w: 'rice', opts: ['rice', 'noodle', 'bread'] },
    { e: '🍇', cn: '葡萄', w: 'grape', opts: ['grape', 'apple', 'banana'] },
    { e: '🍉', cn: '西瓜', w: 'watermelon', opts: ['watermelon', 'melon', 'apple'] },
    { e: '🥕', cn: '胡萝卜', w: 'carrot', opts: ['carrot', 'cat', 'card'] },
    { e: '🍞', cn: '面包', w: 'bread', opts: ['bread', 'rice', 'cake'] },
    { e: '🧀', cn: '奶酪', w: 'cheese', opts: ['cheese', 'cat', 'cake'] },
    { e: '🐰', cn: '兔子', w: 'rabbit', opts: ['rabbit', 'cat', 'rat'] },
    { e: '🐯', cn: '老虎', w: 'tiger', opts: ['tiger', 'lion', 'bear'] },
    { e: '🐻', cn: '熊', w: 'bear', opts: ['bear', 'beer', 'pear'] },
    { e: '🦁', cn: '狮子', w: 'lion', opts: ['lion', 'tiger', 'line'] },
    { e: '🐘', cn: '大象', w: 'elephant', opts: ['elephant', 'ant', 'elf'] },
    { e: '🐭', cn: '老鼠', w: 'mouse', opts: ['mouse', 'mouth', 'house'] },
    { e: '👕', cn: '衬衫', w: 'shirt', opts: ['shirt', 'skirt', 'short'] },
    { e: '👖', cn: '裤子', w: 'pants', opts: ['pants', 'plant', 'paint'] },
    { e: '👟', cn: '鞋子', w: 'shoe', opts: ['shoe', 'show', 'shop'] },
    { e: '⚫', cn: '黑色', w: 'black', opts: ['black', 'white', 'blue'] },
    { e: '⚪', cn: '白色', w: 'white', opts: ['white', 'black', 'red'] },
    { e: '🟣', cn: '紫色', w: 'purple', opts: ['purple', 'pink', 'blue'] },
    { e: '🌞', cn: '太阳', w: 'sun', opts: ['sun', 'son', 'run'] },
    { e: '⭐', cn: '星星', w: 'star', opts: ['star', 'sun', 'stair'] },
    { e: '🌙', cn: '月亮', w: 'moon', opts: ['moon', 'noon', 'soon'] },
    { e: '🏫', cn: '学校', w: 'school', opts: ['school', 'park', 'home'] },
    { e: '📚', cn: '书', w: 'book', opts: ['book', 'box', 'look'] },
    { e: '✏️', cn: '铅笔', w: 'pencil', opts: ['pencil', 'pen', 'pencil2'] },
    { e: '🏃', cn: '跑', w: 'run', opts: ['run', 'fun', 'sun'] },
    { e: '🚶', cn: '走', w: 'walk', opts: ['walk', 'talk', 'work'] },
    { e: '🎁', cn: '礼物', w: 'gift', opts: ['gift', 'left', 'lift'] },
    { e: '🌳', cn: '树', w: 'tree', opts: ['tree', 'three', 'free'] },
    { e: '🐝', cn: '蜜蜂', w: 'bee', opts: ['bee', 'see', 'tea'] },
    { e: '⛅', cn: '云', w: 'cloud', opts: ['cloud', 'clown', 'crowd'] },
    { e: '🌈', cn: '彩虹', w: 'rainbow', opts: ['rainbow', 'window', 'yellow'] },
    { e: '🎂', cn: '蛋糕', w: 'cake', opts: ['cake', 'cat', 'lake'] }
  ];

  var numbers = [
    { e: '1', w: 'one', opts: ['one', 'two', 'three'] },
    { e: '2', w: 'two', opts: ['two', 'one', 'three'] },
    { e: '3', w: 'three', opts: ['three', 'four', 'five'] },
    { e: '4', w: 'four', opts: ['four', 'five', 'three'] },
    { e: '5', w: 'five', opts: ['five', 'four', 'six'] },
    { e: '6', w: 'six', opts: ['six', 'seven', 'five'] },
    { e: '7', w: 'seven', opts: ['seven', 'six', 'eight'] },
    { e: '8', w: 'eight', opts: ['eight', 'nine', 'seven'] },
    { e: '9', w: 'nine', opts: ['nine', 'eight', 'ten'] },
    { e: '10', w: 'ten', opts: ['ten', 'nine', 'two'] },
    { e: '11', w: 'eleven', opts: ['eleven', 'twelve', 'ten'] },
    { e: '12', w: 'twelve', opts: ['twelve', 'eleven', 'twenty'] },
    { e: '13', w: 'thirteen', opts: ['thirteen', 'thirty', 'three'] },
    { e: '14', w: 'fourteen', opts: ['fourteen', 'forty', 'four'] },
    { e: '15', w: 'fifteen', opts: ['fifteen', 'fifty', 'five'] },
    { e: '16', w: 'sixteen', opts: ['sixteen', 'sixty', 'six'] },
    { e: '17', w: 'seventeen', opts: ['seventeen', 'seventy', 'seven'] },
    { e: '18', w: 'eighteen', opts: ['eighteen', 'eighty', 'eight'] },
    { e: '19', w: 'nineteen', opts: ['nineteen', 'ninety', 'nine'] },
    { e: '20', w: 'twenty', opts: ['twenty', 'twelve', 'ten'] },
    { e: '21', w: 'twenty-one', opts: ['twenty-one', 'twenty-two', 'twenty'] },
    { e: '22', w: 'twenty-two', opts: ['twenty-two', 'twenty-one', 'twelve'] },
    { e: '23', w: 'twenty-three', opts: ['twenty-three', 'twenty-thirteen', 'thirty'] },
    { e: '30', w: 'thirty', opts: ['thirty', 'thirteen', 'twenty'] },
    { e: '40', w: 'forty', opts: ['forty', 'fourteen', 'fifty'] },
    { e: '50', w: 'fifty', opts: ['fifty', 'fifteen', 'forty'] },
    { e: '60', w: 'sixty', opts: ['sixty', 'sixteen', 'six'] },
    { e: '70', w: 'seventy', opts: ['seventy', 'seventeen', 'seventy-one'] },
    { e: '80', w: 'eighty', opts: ['eighty', 'eighteen', 'eight'] },
    { e: '90', w: 'ninety', opts: ['ninety', 'nineteen', 'nine'] },
    { e: '100', w: 'one hundred', opts: ['one hundred', 'hundred', 'ten'] }
  ];

  // 自然拼读 CVC 简单词
  var cvc = [
    { e: '🐱', w: 'cat', opts: ['cat', 'cut', 'cap'] },
    { e: '🐶', w: 'dog', opts: ['dog', 'dig', 'dot'] },
    { e: '🦇', w: 'bat', opts: ['bat', 'bet', 'bit'] },
    { e: '🐷', w: 'pig', opts: ['pig', 'peg', 'pug'] },
    { e: '🐞', w: 'bug', opts: ['bug', 'bag', 'big'] },
    { e: '🌞', w: 'sun', opts: ['sun', 'son', 'sin'] },
    { e: '🎩', w: 'hat', opts: ['hat', 'hot', 'hit'] },
    { e: '🦊', w: 'fox', opts: ['fox', 'fix', 'box'] },
    { e: '🚌', w: 'bus', opts: ['bus', 'but', 'bug'] },
    { e: '🛏️', w: 'bed', opts: ['bed', 'bad', 'bud'] },
    { e: '☕', w: 'cup', opts: ['cup', 'cap', 'cut'] },
    { e: '🐔', w: 'hen', opts: ['hen', 'han', 'hot'] },
    { e: '🗺️', w: 'map', opts: ['map', 'mop', 'nap'] },
    { e: '✏️', w: 'pen', opts: ['pen', 'pan', 'pin'] },
    { e: '🪭', w: 'fan', opts: ['fan', 'fin', 'fun'] },
    { e: '🌞', w: 'sun', opts: ['sun', 'fun', 'run'] },
    { e: '🏃', w: 'run', opts: ['run', 'fun', 'sun'] },
    { e: '🎒', w: 'bag', opts: ['bag', 'bug', 'big'] },
    { e: '🦵', w: 'leg', opts: ['leg', 'log', 'lug'] },
    { e: '🔴', w: 'red', opts: ['red', 'bed', 'led'] },
    { e: '🪑', w: 'sit', opts: ['sit', 'sat', 'set'] },
    { e: '🧦', w: 'sock', opts: ['sock', 'sack', 'sick'] },
    { e: '💍', w: 'ring', opts: ['ring', 'rang', 'rung'] }
  ];

  var sentence = [
    { e: '🍎', q: 'I like <span class="slot">___</span>.', w: 'apples', opts: ['apples', 'cats', 'red'] },
    { e: '🐶', q: 'This is a <span class="slot">___</span>.', w: 'dog', opts: ['dog', 'duck', 'pig'] },
    { e: '🐦', q: 'I see a <span class="slot">___</span>.', w: 'bird', opts: ['bird', 'fish', 'cow'] },
    { e: '🔴', q: 'My favorite color is <span class="slot">___</span>.', w: 'red', opts: ['red', 'blue', 'green'] },
    { e: '🐱', q: 'I have a <span class="slot">___</span>.', w: 'cat', opts: ['cat', 'dog', 'bird'] },
    { e: '🔵', q: 'The sky is <span class="slot">___</span>.', w: 'blue', opts: ['blue', 'green', 'yellow'] },
    { e: '🐮', q: 'This is a <span class="slot">___</span>.', w: 'cow', opts: ['cow', 'pig', 'duck'] },
    { e: '🟢', q: 'The grass is <span class="slot">___</span>.', w: 'green', opts: ['green', 'red', 'yellow'] },
    { e: '🍌', q: 'I eat a <span class="slot">___</span>.', w: 'banana', opts: ['banana', 'apple', 'milk'] },
    { e: '🥛', q: 'I drink some <span class="slot">___</span>.', w: 'milk', opts: ['milk', 'water', 'juice'] },
    { e: '🐱', q: 'I love my <span class="slot">___</span>.', w: 'cat', opts: ['cat', 'dog', 'bird'] },
    { e: '🍎', q: 'I eat an <span class="slot">___</span>.', w: 'apple', opts: ['apple', 'orange', 'banana'] },
    { e: '🐶', q: 'I play with my <span class="slot">___</span>.', w: 'dog', opts: ['dog', 'cat', 'toy'] },
    { e: '🌞', q: 'The <span class="slot">___</span> is big.', w: 'sun', opts: ['sun', 'moon', 'star'] },
    { e: '🌙', q: 'The <span class="slot">___</span> is bright.', w: 'moon', opts: ['moon', 'sun', 'sky'] },
    { e: '⭐', q: 'I see a <span class="slot">___</span>.', w: 'star', opts: ['star', 'moon', 'cloud'] },
    { e: '🍇', q: 'I like <span class="slot">___</span>.', w: 'grapes', opts: ['grapes', 'apples', 'bananas'] },
    { e: '🐟', q: 'This is a <span class="slot">___</span>.', w: 'fish', opts: ['fish', 'bird', 'cat'] },
    { e: '🐰', q: 'The <span class="slot">___</span> is small.', w: 'rabbit', opts: ['rabbit', 'dog', 'bear'] },
    { e: '🦁', q: 'The <span class="slot">___</span> is strong.', w: 'lion', opts: ['lion', 'cat', 'tiger'] },
    { e: '🍊', q: 'I drink <span class="slot">___</span> juice.', w: 'orange', opts: ['orange', 'apple', 'water'] },
    { e: '📚', q: 'I read a <span class="slot">___</span>.', w: 'book', opts: ['book', 'box', 'look'] },
    { e: '🎨', q: 'I like <span class="slot">___</span>.', w: 'art', opts: ['art', 'red', 'music'] },
    { e: '🚗', q: 'This is a <span class="slot">___</span>.', w: 'car', opts: ['car', 'bus', 'cat'] },
    { e: '🐘', q: 'The <span class="slot">___</span> is big.', w: 'elephant', opts: ['elephant', 'ant', 'bee'] },
    { e: '👟', q: 'I wear my <span class="slot">___</span>.', w: 'shoes', opts: ['shoes', 'shirt', 'hat'] },
    { e: '🌈', q: 'The <span class="slot">___</span> is beautiful.', w: 'rainbow', opts: ['rainbow', 'cloud', 'sky'] }
  ];

  var family = [
    { e: '👨', cn: '爸爸', w: 'dad', opts: ['dad', 'mom', 'cat'] },
    { e: '👩', cn: '妈妈', w: 'mom', opts: ['mom', 'dad', 'dog'] },
    { e: '👦', cn: '男孩', w: 'boy', opts: ['boy', 'girl', 'baby'] },
    { e: '👧', cn: '女孩', w: 'girl', opts: ['girl', 'boy', 'baby'] },
    { e: '👶', cn: '宝宝', w: 'baby', opts: ['baby', 'boy', 'girl'] },
    { e: '👴', cn: '爷爷', w: 'grandpa', opts: ['grandpa', 'grandma', 'dad'] },
    { e: '👵', cn: '奶奶', w: 'grandma', opts: ['grandma', 'grandpa', 'mom'] },
    { e: '👧', cn: '姐姐', w: 'sister', opts: ['sister', 'brother', 'mom'] },
    { e: '👦', cn: '哥哥', w: 'brother', opts: ['brother', 'sister', 'baby'] },
    { e: '🧑', cn: '叔叔', w: 'uncle', opts: ['uncle', 'aunt', 'dad'] },
    { e: '👩', cn: '阿姨', w: 'aunt', opts: ['aunt', 'uncle', 'mom'] },
    { e: '🐱', cn: '宠物', w: 'pet', opts: ['pet', 'pen', 'net'] },
    { e: '👨‍👩‍👧', cn: '家庭', w: 'family', opts: ['family', 'friend', 'father'] },
    { e: '🧑', cn: '朋友', w: 'friend', opts: ['friend', 'family', 'frog'] },
    { e: '👨', cn: '父亲', w: 'father', opts: ['father', 'mother', 'brother'] },
    { e: '👩', cn: '母亲', w: 'mother', opts: ['mother', 'father', 'sister'] },
    { e: '👦', cn: '儿子', w: 'son', opts: ['son', 'daughter', 'boy'] },
    { e: '👧', cn: '女儿', w: 'daughter', opts: ['daughter', 'son', 'girl'] },
    { e: '🧑', cn: '表兄', w: 'cousin', opts: ['cousin', 'brother', 'friend'] },
    { e: '👨‍🏫', cn: '老师', w: 'teacher', opts: ['teacher', 'father', 'friend'] }
  ];

  // 词语认读：看图选双字词
  var words = [
    { e: '🐱🐶', w: '动物', opts: ['动物', '水果', '颜色'] },
    { e: '🍎🍌', w: '水果', opts: ['水果', '蔬菜', '动物'] },
    { e: '🔴🔵', w: '颜色', opts: ['颜色', '数字', '形状'] },
    { e: '1️⃣2️⃣', w: '数字', opts: ['数字', '字母', '颜色'] },
    { e: '👨👩', w: '家人', opts: ['家人', '朋友', '老师'] },
    { e: '🚗✈️', w: '交通工具', opts: ['交通工具', '动物', '食物'] },
    { e: '☀️🌧️', w: '自然', opts: ['自然', '时间', '方向'] },
    { e: '📚✏️', w: '学习用品', opts: ['学习用品', '玩具', '食物'] },
    { e: '⚽🏀', w: '运动', opts: ['运动', '游戏', '音乐'] },
    { e: '🍚🥣', w: '食物', opts: ['食物', '饮料', '水果'] },
    { e: '🎵🎨', w: '艺术', opts: ['艺术', '科学', '运动'] },
    { e: '🌸🌳', w: '植物', opts: ['植物', '动物', '天气'] },
    { e: '🍅🥕🥦', w: '蔬菜', opts: ['蔬菜', '水果', '肉'] },
    { e: '🅰️🅱️🆎', w: '字母', opts: ['字母', '数字', '符号'] },
    { e: '🎸🎹🎺', w: '乐器', opts: ['乐器', '玩具', '工具'] },
    { e: '🍔🍟🍕', w: '快餐', opts: ['快餐', '主食', '甜点'] },
    { e: '🧥🧣🧤', w: '衣物', opts: ['衣物', '玩具', '食物'] },
    { e: '🐟🐠🐡', w: '鱼', opts: ['鱼', '虾', '蟹'] },
    { e: '🐜🐝🦋', w: '昆虫', opts: ['昆虫', '动物', '鸟类'] },
    { e: '🚲🛴🛵', w: '代步工具', opts: ['代步工具', '玩具', '车'] },
    { e: '💡🔦🔋', w: '电器', opts: ['电器', '工具', '玩具'] },
    { e: '📱💻⌚', w: '电子产品', opts: ['电子产品', '学习用品', '玩具'] },
    { e: '🥤🧃🍹', w: '饮料', opts: ['饮料', '食物', '水果'] },
    { e: '🏠🏢🏘️', w: '建筑', opts: ['建筑', '房子', '车'] },
    { e: '🐔🐧🦆', w: '鸟类', opts: ['鸟类', '鱼类', '昆虫'] },
    { e: '💪🦵🦷', w: '身体部位', opts: ['身体部位', '食物', '动物'] },
    { e: '😊😢😡', w: '表情', opts: ['表情', '颜色', '天气'] },
    { e: '📖📕📗', w: '书本', opts: ['书本', '文具', '玩具'] },
    { e: '🧸🎲🪀', w: '玩具', opts: ['玩具', '食物', '文具'] },
    { e: '🌶️🧄🧅', w: '调料', opts: ['调料', '蔬菜', '水果'] }
  ];

  function letterQ() {
    var c = LETTERS[rand(0, LETTERS.length - 1)];
    var dis = pick(LETTERS.filter(function (x) { return x !== c; }), 2);
    return { q: '听一听，选字母', options: shuffle([c].concat(dis)), answer: c, speak: c, speakLang: 'en-US' };
  }
  function caseQ() {
    var c = LETTERS[rand(0, LETTERS.length - 1)];
    var low = c.toLowerCase();
    var dis = pick('abcdefghijklmnopqrstuvwxyz'.split('').filter(function (x) { return x !== low; }), 2);
    return { q: '大写 <b>' + c + '</b> 对应的小写是？', options: shuffle([low].concat(dis)), answer: low, speak: c, speakLang: 'en-US' };
  }

  /* ============================================================
   * 幼小衔接 · 进阶题库（深挖新增）
   * ============================================================ */
  // 三拼音节：声母 + 介母 + 韵母
  var pinyinThree = [
    { ch: '家', py: 'jiā', opts: ['jiā', 'jā', 'jà'] },
    { ch: '花', py: 'huā', opts: ['huā', 'hā', 'huà'] },
    { ch: '瓜', py: 'guā', opts: ['guā', 'gā', 'guá'] },
    { ch: '火', py: 'huǒ', opts: ['huǒ', 'hǒ', 'huò'] },
    { ch: '窗', py: 'chuāng', opts: ['chuāng', 'chuān', 'chuáng'] },
    { ch: '双', py: 'shuāng', opts: ['shuāng', 'shuān', 'shuǎng'] },
    { ch: '选', py: 'xuǎn', opts: ['xuǎn', 'xuán', 'xuàn'] },
    { ch: '圈', py: 'quān', opts: ['quān', 'quán', 'qiān'] },
    { ch: '光', py: 'guāng', opts: ['guāng', 'guān', 'guǎng'] },
    { ch: '亮', py: 'liàng', opts: ['liàng', 'lián', 'liǎng'] },
    { ch: '小', py: 'xiǎo', opts: ['xiǎo', 'xiáo', 'xiào'] },
    { ch: '叫', py: 'jiào', opts: ['jiào', 'jiáo', 'jiǎo'] },
    { ch: '挂', py: 'guà', opts: ['guà', 'guā', 'guá'] },
    { ch: '想', py: 'xiǎng', opts: ['xiǎng', 'xiáng', 'xiàn'] },
    { ch: '假', py: 'jiǎ', opts: ['jiǎ', 'jiā', 'jà'] },
    { ch: '夏', py: 'xià', opts: ['xià', 'xiā', 'xiá'] },
    { ch: '跨', py: 'kuà', opts: ['kuà', 'kuā', 'kà'] },
    { ch: '夸', py: 'kuā', opts: ['kuā', 'kuà', 'kà'] },
    { ch: '华', py: 'huá', opts: ['huá', 'huà', 'há'] },
    { ch: '国', py: 'guó', opts: ['guó', 'guò', 'gó'] },
    { ch: '果', py: 'guǒ', opts: ['guǒ', 'guō', 'gó'] },
    { ch: '扩', py: 'kuò', opts: ['kuò', 'kuō', 'kó'] },
    { ch: '活', py: 'huó', opts: ['huó', 'huò', 'hó'] },
    { ch: '左', py: 'zuǒ', opts: ['zuǒ', 'zuō', 'zó'] },
    { ch: '错', py: 'cuò', opts: ['cuò', 'cuō', 'có'] },
    { ch: '所', py: 'suǒ', opts: ['suǒ', 'suō', 'só'] },
    { ch: '卷', py: 'juǎn', opts: ['juǎn', 'juān', 'jǎn'] },
    { ch: '全', py: 'quán', opts: ['quán', 'quān', 'qán'] },
    { ch: '宣', py: 'xuān', opts: ['xuān', 'xuán', 'xán'] },
    { ch: '鸟', py: 'niǎo', opts: ['niǎo', 'niáo', 'nǎo'] },
    { ch: '略', py: 'lüè', opts: ['lüè', 'luè', 'lè'] },
    { ch: '决', py: 'jué', opts: ['jué', 'juē', 'jé'] },
    { ch: '缺', py: 'quē', opts: ['quē', 'què', 'qé'] },
    { ch: '雪', py: 'xuě', opts: ['xuě', 'xué', 'xé'] },
    { ch: '抓', py: 'zhuā', opts: ['zhuā', 'zhuá', 'zhā'] }
  ];

  // 整体认读音节
  var pinyinWhole = [
    { ch: '知', py: 'zhī', opts: ['zhī', 'zī', 'jī'] },
    { ch: '吃', py: 'chī', opts: ['chī', 'cī', 'qī'] },
    { ch: '师', py: 'shī', opts: ['shī', 'sī', 'xī'] },
    { ch: '日', py: 'rì', opts: ['rì', 'lì', 'èr'] },
    { ch: '字', py: 'zì', opts: ['zì', 'zhì', 'cí'] },
    { ch: '词', py: 'cí', opts: ['cí', 'chí', 'zí'] },
    { ch: '思', py: 'sī', opts: ['sī', 'shī', 'xī'] },
    { ch: '一', py: 'yī', opts: ['yī', 'yǔ', 'wū'] },
    { ch: '五', py: 'wǔ', opts: ['wǔ', 'wú', 'yǔ'] },
    { ch: '雨', py: 'yǔ', opts: ['yǔ', 'yú', 'wǔ'] },
    { ch: '夜', py: 'yè', opts: ['yè', 'yé', 'yuè'] },
    { ch: '月', py: 'yuè', opts: ['yuè', 'yè', 'yé'] },
    { ch: '元', py: 'yuán', opts: ['yuán', 'yán', 'yǔ'] },
    { ch: '音', py: 'yīn', opts: ['yīn', 'yīng', 'yún'] },
    { ch: '英', py: 'yīng', opts: ['yīng', 'yīn', 'yún'] },
    { ch: '云', py: 'yún', opts: ['yún', 'yǔn', 'yǔ'] }
  ];

  // 书写准备：笔画数
  var strokeCount = [
    { ch: '一', n: '1 画', opts: ['1 画', '2 画', '3 画'] },
    { ch: '二', n: '2 画', opts: ['2 画', '1 画', '3 画'] },
    { ch: '三', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '十', n: '2 画', opts: ['2 画', '3 画', '1 画'] },
    { ch: '人', n: '2 画', opts: ['2 画', '3 画', '1 画'] },
    { ch: '口', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '日', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '月', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '水', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '火', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '木', n: '4 画', opts: ['4 画', '5 画', '3 画'] },
    { ch: '山', n: '3 画', opts: ['3 画', '4 画', '2 画'] },
    { ch: '上', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '下', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '大', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '小', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '中', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '了', n: '2 画', opts: ['2 画', '3 画', '1 画'] },
    { ch: '田', n: '5 画', opts: ['5 画', '4 画', '6 画'] },
    { ch: '石', n: '5 画', opts: ['5 画', '4 画', '6 画'] },
    { ch: '力', n: '2 画', opts: ['2 画', '3 画', '1 画'] },
    { ch: '牛', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '羊', n: '6 画', opts: ['6 画', '5 画', '7 画'] },
    { ch: '米', n: '6 画', opts: ['6 画', '5 画', '7 画'] },
    { ch: '雨', n: '8 画', opts: ['8 画', '7 画', '9 画'] },
    { ch: '马', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '鸟', n: '5 画', opts: ['5 画', '4 画', '6 画'] },
    { ch: '虫', n: '6 画', opts: ['6 画', '5 画', '7 画'] },
    { ch: '耳', n: '6 画', opts: ['6 画', '5 画', '7 画'] },
    { ch: '目', n: '5 画', opts: ['5 画', '4 画', '6 画'] },
    { ch: '女', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '子', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '王', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '天', n: '4 画', opts: ['4 画', '3 画', '5 画'] },
    { ch: '飞', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '门', n: '3 画', opts: ['3 画', '2 画', '4 画'] },
    { ch: '刀', n: '2 画', opts: ['2 画', '3 画', '1 画'] },
    { ch: '工', n: '3 画', opts: ['3 画', '2 画', '4 画'] }
  ];

  // 位置与方向
  var POS = [
    { q: '早上，太阳从（ ）边升起？', a: '东', opts: ['东', '西', '南'] },
    { q: '写字一般用（ ）手？', a: '右', opts: ['右', '左', '上'] },
    { q: '书通常放在桌子的（ ）面？', a: '上', opts: ['上', '下', '里'] },
    { q: '地板在桌子的（ ）面？', a: '下', opts: ['下', '上', '前'] },
    { q: '天在地的（ ）面？', a: '上', opts: ['上', '下', '中'] },
    { q: '排队时，排第一的后面是第（ ）个？', a: '二', opts: ['二', '一', '三'] },
    { q: '出门先迈（ ），进门后转身？', a: '前', opts: ['前', '后', '上'] },
    { q: '鞋子穿在脚（ ）？', a: '上', opts: ['上', '下', '里'] },
    { q: '书包背在（ ）？', a: '背上', opts: ['背上', '脚下', '头上'] },
    { q: '星星在夜空的（ ）方？', a: '上', opts: ['上', '下', '左'] },
    { q: '太阳从（ ）边落下？', a: '西', opts: ['西', '东', '南'] },
    { q: '我们面向北，背后是（ ）？', a: '南', opts: ['南', '北', '东'] },
    { q: '面向太阳升起的方向站着，左边是（ ）？', a: '北', opts: ['北', '南', '东'] },
    { q: '糖藏在盒子（ ）面？', a: '里', opts: ['里', '外', '上'] },
    { q: '操场在校园的（ ）面？', a: '外', opts: ['外', '里', '中'] },
    { q: '三个字中间的那个在（ ）？', a: '中间', opts: ['中间', '左边', '右边'] }
  ];

  function parityQ() {
    var x = rand(1, 20);
    var isEven = x % 2 === 0;
    var ans = isEven ? '双数' : '单数';
    var dis = ['单数', '双数'].filter(function (o) { return o !== ans; });
    return { q: x + ' 是单数还是双数？', options: shuffle([ans].concat(dis)), answer: ans, speak: String(x), speakLang: 'zh-CN' };
  }

  // 分类与整理
  var category = [
    { e: '🍎🍌🍇', a: '水果', opts: ['水果', '蔬菜', '动物'] },
    { e: '🥕🥦🍅', a: '蔬菜', opts: ['蔬菜', '水果', '肉'] },
    { e: '🐱🐶🐰', a: '动物', opts: ['动物', '植物', '食物'] },
    { e: '🔴🔵🟢', a: '颜色', opts: ['颜色', '数字', '形状'] },
    { e: '1️⃣2️⃣3️⃣', a: '数字', opts: ['数字', '字母', '符号'] },
    { e: '⚽🏀🏈', a: '球类', opts: ['球类', '水果', '颜色'] },
    { e: '✏️📚📏', a: '学习用品', opts: ['学习用品', '玩具', '餐具'] },
    { e: '👕👖👟', a: '衣服', opts: ['衣服', '食物', '动物'] },
    { e: '🌸🌳🌿', a: '植物', opts: ['植物', '动物', '天气'] },
    { e: '🚗✈️🚀', a: '交通工具', opts: ['交通工具', '动物', '食物'] },
    { e: '☀️🌧️❄️', a: '天气', opts: ['天气', '时间', '方向'] },
    { e: '🍞🥛🍎', a: '食物', opts: ['食物', '饮料', '玩具'] },
    { e: '🐅🐆🐻', a: '野兽', opts: ['野兽', '家禽', '宠物'] },
    { e: '🐔🐧🦆', a: '鸟类', opts: ['鸟类', '鱼类', '昆虫'] },
    { e: '🐟🐠🐡', a: '鱼类', opts: ['鱼类', '鸟类', '虫类'] },
    { e: '🍰🍪🍩', a: '点心', opts: ['点心', '水果', '主食'] },
    { e: '🥤🧃🍹', a: '饮料', opts: ['饮料', '食物', '水果'] },
    { e: '🎸🎹🎺', a: '乐器', opts: ['乐器', '玩具', '工具'] },
    { e: '🌶️🧄🧅', a: '调料', opts: ['调料', '蔬菜', '水果'] },
    { e: '🚲🛴🛵', a: '代步工具', opts: ['代步工具', '玩具', '车'] },
    { e: '💡🔦🔋', a: '电器', opts: ['电器', '工具', '玩具'] },
    { e: '🧸🎲🪀', a: '玩具', opts: ['玩具', '食物', '文具'] },
    { e: '🌡️🔥❄️', a: '温度', opts: ['温度', '天气', '季节'] },
    { e: '🐜🐝🦋', a: '昆虫', opts: ['昆虫', '动物', '鸟类'] },
    { e: '📱💻⌚', a: '电子产品', opts: ['电子产品', '学习用品', '玩具'] },
    { e: '🍞🥐🥨', a: '面食', opts: ['面食', '米饭', '水果'] },
    { e: '🧥🧣🧤', a: '衣物', opts: ['衣物', '玩具', '食物'] },
    { e: '🌍🌕🌟', a: '星球', opts: ['星球', '天体', '云'] }
  ];

  // 英语听音选义
  var listenMeaning = [
    { w: 'apple', cn: '苹果', opts: ['苹果', '香蕉', '橘子'] },
    { w: 'red', cn: '红色', opts: ['红色', '蓝色', '绿色'] },
    { w: 'cat', cn: '猫', opts: ['猫', '狗', '鸟'] },
    { w: 'dog', cn: '狗', opts: ['狗', '猫', '鱼'] },
    { w: 'sun', cn: '太阳', opts: ['太阳', '月亮', '星星'] },
    { w: 'book', cn: '书', opts: ['书', '笔', '桌子'] },
    { w: 'water', cn: '水', opts: ['水', '牛奶', '果汁'] },
    { w: 'happy', cn: '开心', opts: ['开心', '伤心', '生气'] },
    { w: 'run', cn: '跑', opts: ['跑', '走', '跳'] },
    { w: 'big', cn: '大', opts: ['大', '小', '高'] },
    { w: 'blue', cn: '蓝色', opts: ['蓝色', '红色', '黄色'] },
    { w: 'bird', cn: '鸟', opts: ['鸟', '鱼', '狗'] },
    { w: 'milk', cn: '牛奶', opts: ['牛奶', '水', '茶'] },
    { w: 'hand', cn: '手', opts: ['手', '脚', '头'] },
    { w: 'star', cn: '星星', opts: ['星星', '太阳', '月亮'] },
    { w: 'jump', cn: '跳', opts: ['跳', '跑', '走'] },
    { w: 'banana', cn: '香蕉', opts: ['香蕉', '苹果', '橘子'] },
    { w: 'orange', cn: '橙子', opts: ['橙子', '苹果', '梨'] },
    { w: 'green', cn: '绿色', opts: ['绿色', '红色', '蓝色'] },
    { w: 'yellow', cn: '黄色', opts: ['黄色', '红色', '绿色'] },
    { w: 'fish', cn: '鱼', opts: ['鱼', '鸟', '猫'] },
    { w: 'duck', cn: '鸭子', opts: ['鸭子', '鸡', '鹅'] },
    { w: 'pig', cn: '猪', opts: ['猪', '牛', '羊'] },
    { w: 'eye', cn: '眼睛', opts: ['眼睛', '耳朵', '鼻子'] },
    { w: 'ear', cn: '耳朵', opts: ['耳朵', '眼睛', '嘴巴'] },
    { w: 'nose', cn: '鼻子', opts: ['鼻子', '耳朵', '眼睛'] },
    { w: 'head', cn: '头', opts: ['头', '手', '脚'] },
    { w: 'tree', cn: '树', opts: ['树', '花', '草'] },
    { w: 'flower', cn: '花', opts: ['花', '树', '草'] },
    { w: 'school', cn: '学校', opts: ['学校', '公园', '家'] },
    { w: 'teacher', cn: '老师', opts: ['老师', '学生', '医生'] },
    { w: 'small', cn: '小', opts: ['小', '大', '高'] },
    { w: 'eat', cn: '吃', opts: ['吃', '喝', '跑'] },
    { w: 'drink', cn: '喝', opts: ['喝', '吃', '走'] }
  ];

  // 英语日常问候
  var greet = [
    { q: '别人说 “Hello!”，你回？', a: 'Hi!', opts: ['Hi!', 'Bye!', 'Sorry!'] },
    { q: '早上见到老师说？', a: 'Good morning!', opts: ['Good morning!', 'Good night!', 'Good afternoon!'] },
    { q: '下午见面说？', a: 'Good afternoon!', opts: ['Good afternoon!', 'Good morning!', 'Good evening!'] },
    { q: '晚上睡觉前说？', a: 'Good night!', opts: ['Good night!', 'Good morning!', 'Hello!'] },
    { q: '想说“谢谢”，用英语？', a: 'Thank you!', opts: ['Thank you!', 'Please!', 'Sorry!'] },
    { q: '不小心碰到别人说？', a: 'Sorry!', opts: ['Sorry!', 'Hello!', 'Thanks!'] },
    { q: '想问“你叫什么名字？”用英语？', a: "What's your name?", opts: ["What's your name?", 'How are you?', 'My name is Tom.'] },
    { q: '问“你好吗？”用英语？', a: 'How are you?', opts: ['How are you?', "What's your name?", 'I am fine.'] },
    { q: '回答“我很好，谢谢”用英语？', a: 'I am fine, thank you.', opts: ['I am fine, thank you.', 'Goodbye!', 'See you!'] },
    { q: '告别说“再见”用英语？', a: 'Goodbye!', opts: ['Goodbye!', 'Hello!', 'Thanks!'] },
    { q: '别人说 “Thank you!”，你回？', a: "You're welcome!", opts: ["You're welcome!", 'Sorry!', 'Goodbye!'] },
    { q: '想说“请”，用英语？', a: 'Please!', opts: ['Please!', 'Thank you!', 'Sorry!'] },
    { q: '晚上见面说？', a: 'Good evening!', opts: ['Good evening!', 'Good morning!', 'Good night!'] },
    { q: '问“你几岁了？”用英语？', a: 'How old are you?', opts: ['How old are you?', 'How are you?', "What's your name?"] },
    { q: '夸奖说“好极了！”用英语？', a: 'Great!', opts: ['Great!', 'Goodbye!', 'Sorry!'] },
    { q: '问“这是什么？”用英语？', a: 'What is this?', opts: ['What is this?', "What's your name?", 'How are you?'] }
  ];

  /* ============================================================
   * 关卡定义（22 关 → 深挖新增 8 关，共 30 关）
   * ============================================================ */
  var LEVELS = [
    // 语文 7 关
    { id: 'yx_yw1', subject: 'yuwen', grade: 0, name: '拼音认读', icon: '🔤', desc: '声母·单韵母', make: function (n) { return pick(pinyinBase, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 读哪个音？', options: t.opts, answer: t.py, speak: t.ch, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw2', subject: 'yuwen', grade: 0, name: '拼读闯关', icon: '🎵', desc: '复韵母·鼻韵母', make: function (n) { return pick(pinyinFu, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 读哪个音？', options: t.opts, answer: t.py, speak: t.ch, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw3', subject: 'yuwen', grade: 0, name: '声调辨认', icon: '🎶', desc: '一声·二声·三声·四声', make: function (n) { return pick(toneData, n).map(function (t) { return { q: '“<b>' + t.py + '</b>” 是第几声？', options: t.opts, answer: t.tone, speak: t.py, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw4', subject: 'yuwen', grade: 0, name: '看图识字', icon: '🀄', desc: '象形字·会意字', make: function (n) { return pick(xiangxing, n).map(function (t) { return { q: '这是什么字？', sub: '<span class="big-emoji">' + t.e + '</span>', options: t.opts, answer: t.zi, speak: t.zi, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw5', subject: 'yuwen', grade: 0, name: '反义词', icon: '🔄', desc: '大对小·多对少', make: function (n) { return pick(fanyi, n).map(function (t) { return { q: '“<b>' + t.a + '</b>” 的反义词是？', options: t.opts, answer: t.b, speak: t.a + '的反义词是' + t.b, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw6', subject: 'yuwen', grade: 0, name: '古诗填空', icon: '📜', desc: '经典古诗补一补', make: function (n) { return pick(gushi, n).map(function (t) { return { q: t.q, options: t.opts, answer: t.w, speak: t.w, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw7', subject: 'yuwen', grade: 0, name: '词语认读', icon: '📚', desc: '看图选词语', make: function (n) { return pick(words, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> 这是？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'zh-CN' }; }); } },

    // 数学 8 关
    { id: 'yx_sx1', subject: 'shuxue', grade: 0, name: '数一数', icon: '🔢', desc: '数与量的对应', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(countQ()); return r; } },
    { id: 'yx_sx2', subject: 'shuxue', grade: 0, name: '比大小', icon: '⚖️', desc: '多少·大小比较', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(compareQ()); return r; } },
    { id: 'yx_sx3', subject: 'shuxue', grade: 0, name: '10以内加减', icon: '➕', desc: '加减入门', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(addSubQ(10)); return r; } },
    { id: 'yx_sx4', subject: 'shuxue', grade: 0, name: '凑十法', icon: '🔟', desc: '10 的组成', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(makeTenQ()); return r; } },
    { id: 'yx_sx5', subject: 'shuxue', grade: 0, name: '20以内加减', icon: '🧮', desc: '凑十·破十', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(addSubQ(20)); return r; } },
    { id: 'yx_sx6', subject: 'shuxue', grade: 0, name: '认识图形', icon: '🔷', desc: '平面图形', make: function (n) { return pick(SHAPES, n).map(function (t) { return { q: '这是什么形状？', sub: t.svg, options: t.opts, answer: t.name, speak: t.name, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_sx7', subject: 'shuxue', grade: 0, name: '找规律', icon: '🔁', desc: '数字·图形规律', make: function (n) {
        var pool = numPatterns.map(function (t) { return { q: '找规律，? 处应该填什么？', sub: '<div class="pattern">' + t.seq + '</div>', options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' }; })
          .concat(emojiPatterns.map(function (t) { return { q: '找规律，? 处应该放什么？', sub: '<div class="pattern">' + t.seq + '</div>', options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' }; }));
        return pickN(pool, n);
      } },
    { id: 'yx_sx8', subject: 'shuxue', grade: 0, name: '认识钟表', icon: '🕐', desc: '整点认读', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(clockQ()); return r; } },

    // 英语 7 关
    { id: 'yx_yy1', subject: 'yingyu', grade: 0, name: '字母认读', icon: '🔠', desc: '听音选字母', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(letterQ()); return r; } },
    { id: 'yx_yy2', subject: 'yingyu', grade: 0, name: '大小写配对', icon: '🅰️', desc: '给大写找小写', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(caseQ()); return r; } },
    { id: 'yx_yy3', subject: 'yingyu', grade: 0, name: '主题词汇', icon: '🦁', desc: '颜色·动物·身体·食物', make: function (n) { return pick(vocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yx_yy4', subject: 'yingyu', grade: 0, name: '数字单词', icon: '🔟', desc: 'one two three', make: function (n) { return pick(numbers, n).map(function (t) { return { q: '数字 <b>' + t.e + '</b> 用英语怎么说？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yx_yy5', subject: 'yingyu', grade: 0, name: '自然拼读', icon: '🔤', desc: 'CVC 简单词', make: function (n) { return pick(cvc, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> 是哪个词？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yx_yy6', subject: 'yingyu', grade: 0, name: '简单句型', icon: '💬', desc: '选词填空', make: function (n) { return pick(sentence, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.q, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yx_yy7', subject: 'yingyu', grade: 0, name: '家庭成员', icon: '👨‍👩‍👧', desc: '爸爸妈妈爷爷奶奶', make: function (n) { return pick(family, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn + ' 用英语怎么说？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },

    // 语文 进阶：拼音三拼 / 整体认读 / 书写准备
    { id: 'yx_yw8', subject: 'yuwen', grade: 0, name: '拼音进阶·三拼', icon: '🧩', desc: '三拼音节', make: function (n) { return pick(pinyinThree, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 的拼音是？', options: t.opts, answer: t.py, speak: t.ch, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw9', subject: 'yuwen', grade: 0, name: '拼音进阶·整体认读', icon: '🔆', desc: '整体认读音节', make: function (n) { return pick(pinyinWhole, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 的拼音是？', options: t.opts, answer: t.py, speak: t.ch, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_yw10', subject: 'yuwen', grade: 0, name: '书写准备·笔画数', icon: '✍️', desc: '数一数几画', make: function (n) { return pick(strokeCount, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 一共有几画？', options: t.opts, answer: t.n, speak: t.ch, speakLang: 'zh-CN' }; }); } },

    // 数学 进阶：位置方向 / 单双数 / 分类整理
    { id: 'yx_sx9', subject: 'shuxue', grade: 0, name: '位置与方向', icon: '🧭', desc: '上下左右前后', make: function (n) { return pick(POS, n).map(function (t) { return { q: t.q, options: t.opts, answer: t.a, speak: t.a, speakLang: 'zh-CN' }; }); } },
    { id: 'yx_sx10', subject: 'shuxue', grade: 0, name: '单双数', icon: '🔢', desc: '单数·双数', make: function (n) {
        var xs = []; for (var k = 1; k <= 20; k++) xs.push(k);
        return pickN(xs, n).map(function (x) {
          var isEven = x % 2 === 0, ans = isEven ? '双数' : '单数';
          var dis = ['单数', '双数'].filter(function (o) { return o !== ans; });
          return { q: x + ' 是单数还是双数？', options: shuffle([ans].concat(dis)), answer: ans, speak: String(x), speakLang: 'zh-CN' };
        });
      } },
    { id: 'yx_sx11', subject: 'shuxue', grade: 0, name: '分类与整理', icon: '🗂️', desc: '按类分一分', make: function (n) { return pick(category, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> 都是什么？', options: t.opts, answer: t.a, speak: t.a, speakLang: 'zh-CN' }; }); } },

    // 英语 进阶：听音选义 / 日常问候
    { id: 'yx_yy8', subject: 'yingyu', grade: 0, name: '听音选义', icon: '👂', desc: '听单词选意思', make: function (n) { return pick(listenMeaning, n).map(function (t) { return { q: '🔊 听一听，选意思', sub: '<span class="big-emoji">🔊</span>', options: t.opts, answer: t.cn, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yx_yy9', subject: 'yingyu', grade: 0, name: '日常问候', icon: '💡', desc: '礼貌用语', make: function (n) { return pick(greet, n).map(function (t) { return { q: t.q, options: t.opts, answer: t.a, speak: t.a, speakLang: 'en-US' }; }); } }
  ];

  /* ============================================================
   * 奖励体系数据
   * ============================================================ */
  // 宠物成长（依据累计金币）
  var PET_STAGES = [
    { need: 0,   name: '恐龙蛋', emoji: '🥚', desc: '答对题赚金币，把它孵出来！' },
    { need: 15,  name: '破壳啦', emoji: '🐣', desc: '小家伙探出头来啦～' },
    { need: 40,  name: '小恐龙', emoji: '🦖', desc: '会蹦会跳，超可爱！' },
    { need: 80,  name: '大恐龙', emoji: '🦕', desc: '越长越大，越来越神气！' },
    { need: 150, name: '恐龙王', emoji: '👑', desc: '戴上王冠，成为森林之王！' },
    { need: 250, name: '神龙', emoji: '🐉', desc: '飞起来啦！你是最强的饲养员！' }
  ];

  // 称号（依据总星数）
  var RANKS = [
    { min: 0,  name: '学习小萌芽', emoji: '🌱' },
    { min: 12, name: '闯关小学徒', emoji: '📚' },
    { min: 24, name: '智慧小达人', emoji: '⭐' },
    { min: 36, name: '全能小状元', emoji: '🎓' },
    { min: 48, name: '超级小学霸', emoji: '👑' },
    { min: 60, name: '学习小英雄', emoji: '🏆' }
  ];

  // 成就徽章（check 接收 stats 对象）
  var ACHIEVEMENTS = [
    { id: 'first', name: '初来乍到', icon: '👋', desc: '完成任意一关', check: function (s) { return s.playedLevels >= 1; } },
    { id: 'star10', name: '十星小达人', icon: '🌟', desc: '累计获得 10 颗星', check: function (s) { return s.totalStars >= 10; } },
    { id: 'star20', name: '二十星高手', icon: '✨', desc: '累计获得 20 颗星', check: function (s) { return s.totalStars >= 20; } },
    { id: 'star40', name: '四十星大神', icon: '⭐', desc: '累计获得 40 颗星', check: function (s) { return s.totalStars >= 40; } },
    { id: 'yuwen', name: '语文小状元', icon: '📖', desc: '语文 6 关全部满星', check: function (s) { return s.subjectMax.yuwen; } },
    { id: 'shuxue', name: '数学小能手', icon: '🧮', desc: '数学 7 关全部满星', check: function (s) { return s.subjectMax.shuxue; } },
    { id: 'yingyu', name: '英语小专家', icon: '🔤', desc: '英语 7 关全部满星', check: function (s) { return s.subjectMax.yingyu; } },
    { id: 'full', name: '全科制霸', icon: '🏆', desc: '语文·数学·英语都有星星', check: function (s) { return s.subjectHas.yuwen && s.subjectHas.shuxue && s.subjectHas.yingyu; } },
    { id: 'perfect', name: '满分神童', icon: '💯', desc: '任意一关全对（3 星）', check: function (s) { return s.hasPerfect; } },
    { id: 'combo5', name: '连击高手', icon: '🔥', desc: '单关连对 5 题', check: function (s) { return s.hasCombo5; } },
    { id: 'coin50', name: '小小富翁', icon: '💰', desc: '累计 50 金币', check: function (s) { return s.coins >= 50; } },
    { id: 'dragon', name: '恐龙饲养员', icon: '🐉', desc: '把宠物养成最终形态', check: function (s) { return s.petMax; } },
    { id: 'streak3', name: '坚持不懈', icon: '📅', desc: '连续学习 3 天', check: function (s) { return s.streak >= 3; } },
    { id: 'streak7', name: '习惯养成', icon: '🗓️', desc: '连续学习 7 天', check: function (s) { return s.streak >= 7; } },
    { id: 'correct100', name: '百发百中', icon: '🎯', desc: '累计答对 100 题', check: function (s) { return s.correctCount >= 100; } }
  ];

  
  LEVELS.forEach(function (l) { if (!l.grade && l.grade !== 0) l.grade = 0; });
  var YX_YW = LEVELS.filter(function (l) { return l.subject === 'yuwen'; });
  var YX_SX = LEVELS.filter(function (l) { return l.subject === 'shuxue'; });
  var YX_YY = LEVELS.filter(function (l) { return l.subject === 'yingyu'; });
  window.YW_LEVELS = (window.YW_LEVELS || []).concat(YX_YW);
  window.SX_LEVELS = (window.SX_LEVELS || []).concat(YX_SX);
  window.YY_LEVELS = (window.YY_LEVELS || []).concat(YX_YY);
})();

/* 通用单轮去重包装：保证每次 make(n) 返回的 n 题在同一轮内题干不重复。
   题库足够时完全无重复；题库极小时降级为允许重复（保证返回恰好 n 题，不破坏引擎校验）。 */
(function () {
  var qkey = function (q) { return String(q.q || '') + '@@' + String(q.sub || '') + '@@' + String(q.speak || '') + '@@' + (q.options || []).join('|'); };
  var all = (window.YW_LEVELS || []).concat(window.SX_LEVELS || [], window.YY_LEVELS || []);
  all.forEach(function (l) {
    if (!l || typeof l.make !== 'function') return;
    var orig = l.make;
    l.make = function (n) {
      n = n || 5;
      var seen = {}, r = [], guard = 0;
      while (r.length < n && guard < 60) {
        var qs = orig(Math.max(n, 6));
        if (!qs || !qs.length) break;
        for (var i = 0; i < qs.length && r.length < n; i++) {
          var k = qkey(qs[i]);
          if (!seen[k]) { seen[k] = 1; r.push(qs[i]); }
        }
        guard++;
      }
      if (r.length < n) {
        var extra = orig(n);
        for (var j = 0; j < extra.length && r.length < n; j++) r.push(extra[j]);
      }
      return r;
    };
  });
})();
