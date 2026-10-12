/* ============================================================
 * 一年级学习乐园 · 题库数据 + 奖励体系数据
 * 三科：语文 / 数学 / 英语（核心重点版）
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

  // 拼音拼读：复韵母 + 前后鼻音 + 整体认读音节（带调号字）
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
    { ch: '口', py: 'kǒu', opts: ['kǒu', 'kōu', 'kòu'] },
    { ch: '球', py: 'qiú', opts: ['qiú', 'qiū', 'quí'] },
    { ch: '田', py: 'tián', opts: ['tián', 'tiān', 'tán'] },
    { ch: '春', py: 'chūn', opts: ['chūn', 'chēn', 'cūn'] },
    { ch: '风', py: 'fēng', opts: ['fēng', 'fēn', 'fōng'] },
    { ch: '明', py: 'míng', opts: ['míng', 'mín', 'mēng'] },
    { ch: '花', py: 'huā', opts: ['huā', 'huà', 'fā'] },
    { ch: '草', py: 'cǎo', opts: ['cǎo', 'cào', 'chǎo'] },
    { ch: '长', py: 'cháng', opts: ['cháng', 'chǎng', 'cáng'] },
    { ch: '雪', py: 'xuě', opts: ['xuě', 'xiě', 'xué'] },
    { ch: '来', py: 'lái', opts: ['lái', 'nái', 'lài'] },
    { ch: '去', py: 'qù', opts: ['qù', 'qú', 'qū'] },
    { ch: '高', py: 'gāo', opts: ['gāo', 'kāo', 'háo'] },
    { ch: '桥', py: 'qiáo', opts: ['qiáo', 'qiǎo', 'jiào'] },
    { ch: '台', py: 'tái', opts: ['tái', 'tāi', 'tài'] },
    { ch: '水', py: 'shuǐ', opts: ['shuǐ', 'suǐ', 'shuì'] },
    { ch: '鸟', py: 'niǎo', opts: ['niǎo', 'liǎo', 'miǎo'] },
    { ch: '虫', py: 'chóng', opts: ['chóng', 'cóng', 'zhóng'] },
    { ch: '车', py: 'chē', opts: ['chē', 'cē', 'chēng'] },
    { ch: '书', py: 'shū', opts: ['shū', 'sū', 'shuí'] },
    { ch: '弟', py: 'dì', opts: ['dì', 'tì', 'dī'] },
    { ch: '哥', py: 'gē', opts: ['gē', 'gé', 'gēn'] },
    { ch: '马', py: 'mǎ', opts: ['mǎ', 'mā', 'má'] },
    { ch: '鱼', py: 'yú', opts: ['yú', 'yǔ', 'wú'] }
  ];

  // 整体认读音节（不可拼，直接读）
  var zhengti = [
    { ch: '吃', py: 'chī', opts: ['chī', 'chǐ', 'cī'] },
    { ch: '师', py: 'shī', opts: ['shī', 'sī', 'shí'] },
    { ch: '日', py: 'rì', opts: ['rì', 'lì', 'yì'] },
    { ch: '字', py: 'zì', opts: ['zì', 'zhì', 'cí'] },
    { ch: '词', py: 'cí', opts: ['cí', 'chí', 'cǐ'] },
    { ch: '雨', py: 'yǔ', opts: ['yǔ', 'yú', 'yù'] },
    { ch: '衣', py: 'yī', opts: ['yī', 'yú', 'wū'] },
    { ch: '无', py: 'wú', opts: ['wú', 'wǔ', 'hú'] },
    { ch: '夜', py: 'yè', opts: ['yè', 'yiè', 'yé'] },
    { ch: '月', py: 'yuè', opts: ['yuè', 'yüè', 'yé'] },
    { ch: '云', py: 'yún', opts: ['yún', 'yóng', 'yǘn'] },
    { ch: '音', py: 'yīn', opts: ['yīn', 'yīng', 'yín'] },
    { ch: '迎', py: 'yíng', opts: ['yíng', 'yín', 'yīng'] },
    { ch: '圆', py: 'yuán', opts: ['yuán', 'yuǎn', 'yán'] },
    { ch: '晕', py: 'yùn', opts: ['yùn', 'yūn', 'yìn'] },
    { ch: '运', py: 'yùn', opts: ['yùn', 'yún', 'yòng'] }
  ];

  // 看拼音选字（一年级识字）
  // 看拼音选字 / 识字：每个 py 唯一（避免同题干多答案），干扰项不得与答案同音
  var readChar = [
    { py: 'rén', zi: '人', opts: ['人', '入', '八'] },
    { py: 'kǒu', zi: '口', opts: ['口', '日', '田'] },
    { py: 'mù', zi: '木', opts: ['木', '本', '禾'] },
    { py: 'huǒ', zi: '火', opts: ['火', '水', '木'] },
    { py: 'shān', zi: '山', opts: ['山', '石', '川'] },
    { py: 'tián', zi: '田', opts: ['田', '日', '目'] },
    { py: 'niú', zi: '牛', opts: ['牛', '午', '马'] },
    { py: 'yáng', zi: '羊', opts: ['羊', '牛', '半'] },
    { py: 'mǎ', zi: '马', opts: ['马', '鸟', '妈'] },
    { py: 'niǎo', zi: '鸟', opts: ['鸟', '乌', '马'] },
    { py: 'yú', zi: '鱼', opts: ['鱼', '龟', '角'] },
    { py: 'huā', zi: '花', opts: ['花', '草', '化'] },
    { py: 'shù', zi: '树', opts: ['树', '林', '对'] },
    { py: 'fēng', zi: '风', opts: ['风', '凤', '分'] },
    { py: 'yǔ', zi: '雨', opts: ['雨', '两', '雪'] },
    { py: 'tiān', zi: '天', opts: ['天', '大', '夫'] },
    { py: 'dì', zi: '地', opts: ['地', '他', '池'] },
    { py: 'shǒu', zi: '手', opts: ['手', '毛', '拿'] },
    { py: 'zú', zi: '足', opts: ['足', '是', '走'] },
    { py: 'ěr', zi: '耳', opts: ['耳', '目', '自'] },
    { py: 'shí', zi: '石', opts: ['石', '右', '古'] },
    { py: 'xīn', zi: '心', opts: ['心', '必', '思'] },
    { py: 'lì', zi: '力', opts: ['力', '刀', '九'] },
    { py: 'nǚ', zi: '女', opts: ['女', '父', '母'] },
    { py: 'shēng', zi: '生', opts: ['生', '牛', '王'] },
    { py: 'tóu', zi: '头', opts: ['头', '兴', '买'] },
    { py: 'mǐ', zi: '米', opts: ['米', '来', '木'] },
    { py: 'chǐ', zi: '尺', opts: ['尺', '只', '尽'] },
    { py: 'yá', zi: '牙', opts: ['牙', '乐', '穿'] },
    { py: 'bà', zi: '爸', opts: ['爸', '爷', '把'] },
    { py: 'mā', zi: '妈', opts: ['妈', '马', '麻'] },
    { py: 'gē', zi: '哥', opts: ['哥', '可', '奇'] },
    { py: 'gāo', zi: '高', opts: ['高', '亮', '京'] },
    { py: 'chē', zi: '车', opts: ['车', '东', '尺'] },
    { py: 'shū', zi: '书', opts: ['书', '木', '本'] },
    { py: 'shuǐ', zi: '水', opts: ['水', '小', '永'] },
    { py: 'mén', zi: '门', opts: ['门', '间', '问'] },
    { py: 'nián', zi: '年', opts: ['年', '牛', '午'] },
    { py: 'bái', zi: '白', opts: ['白', '日', '自'] }
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
    { a: '早', b: '晚', opts: ['晚', '午', '夜'] },
    { a: '哭', b: '笑', opts: ['笑', '叫', '唱'] },
    { a: '有', b: '无', opts: ['无', '没', '空'] },
    { a: '来', b: '去', opts: ['去', '回', '走'] },
    { a: '南', b: '北', opts: ['北', '东', '西'] },
    { a: '真', b: '假', opts: ['假', '错', '坏'] },
    { a: '干净', b: '脏', opts: ['脏', '乱', '净'] },
    { a: '高兴', b: '难过', opts: ['难过', '生气', '害怕'] },
    { a: '安全', b: '危险', opts: ['危险', '平安', '保护'] },
    { a: '喜欢', b: '讨厌', opts: ['讨厌', '厌恶', '爱'] },
    { a: '马虎', b: '认真', opts: ['认真', '仔细', '小心'] }
  ];

  // 古诗填空（一年级上册必背）
  var gushi = [
    { q: '鹅，鹅，鹅，曲项向天<span class="slot">___</span>。', w: '歌', opts: ['歌', '喝', '唱'] },
    { q: '白毛浮绿<span class="slot">___</span>，红掌拨清波。', w: '水', opts: ['水', '江', '河'] },
    { q: '江南可采<span class="slot">___</span>，莲叶何田田。', w: '莲', opts: ['莲', '鱼', '荷'] },
    { q: '鱼戏莲叶<span class="slot">___</span>：鱼戏莲叶东，鱼戏莲叶西。', w: '间', opts: ['间', '中', '东'] },
    { q: '远看山有<span class="slot">___</span>，近听水无声。', w: '色', opts: ['色', '画', '景'] },
    { q: '春去花还在，<span class="slot">___</span>来鸟不惊。', w: '人', opts: ['人', '风', '云'] },
    { q: '锄禾日当午，汗滴禾下<span class="slot">___</span>。', w: '土', opts: ['土', '田', '地'] },
    { q: '谁知盘<span class="slot">___</span>餐，粒粒皆辛苦。', w: '中', opts: ['中', '里', '间'] },
    { q: '解落三秋<span class="slot">___</span>，能开二月花。', w: '叶', opts: ['叶', '风', '雨'] },
    { q: '过江千尺浪，入竹万竿<span class="slot">___</span>。', w: '斜', opts: ['斜', '歪', '弯'] },
    { q: '春眠不觉<span class="slot">___</span>，处处闻啼鸟。', w: '晓', opts: ['晓', '醒', '早'] },
    { q: '夜来风<span class="slot">___</span>声，花落知多少。', w: '雨', opts: ['雨', '雪', '雷'] },
    { q: '儿童散学归<span class="slot">___</span>早，忙趁东风放纸鸢。', w: '来', opts: ['来', '去', '回'] },
    { q: '小荷才露尖尖<span class="slot">___</span>，早有蜻蜓立上头。', w: '角', opts: ['角', '头', '尖'] },
    { q: '牧童骑黄<span class="slot">___</span>，歌声振林樾。', w: '牛', opts: ['牛', '马', '羊'] },
    { q: '床前明<span class="slot">___</span>光，疑是地上霜。', w: '月', opts: ['月', '日', '星'] },
    { q: '疑是地<span class="slot">___</span>霜。', w: '上', opts: ['上', '下', '中'] },
    { q: '举头望明<span class="slot">___</span>，低头思故乡。', w: '月', opts: ['月', '日', '云'] },
    { q: '低头思<span class="slot">___</span>乡。', w: '故', opts: ['故', '旧', '亲'] },
    { q: '小娃撑小<span class="slot">___</span>，偷采白莲回。', w: '艇', opts: ['艇', '船', '舟'] },
    { q: '偷采白<span class="slot">___</span>回。', w: '莲', opts: ['莲', '荷', '花'] },
    { q: '头上红冠不用<span class="slot">___</span>，满身雪白走将来。', w: '裁', opts: ['裁', '载', '戴'] },
    { q: '满身雪<span class="slot">___</span>走将来。', w: '白', opts: ['白', '百', '自'] },
    { q: '碧玉妆成一树<span class="slot">___</span>，万条垂下绿丝绦。', w: '高', opts: ['高', '红', '绿'] },
    { q: '二月春风似剪<span class="slot">___</span>。', w: '刀', opts: ['刀', '刃', '剑'] },
    { q: '松下问<span class="slot">___</span>，言师采药去。', w: '童', opts: ['童', '同', '工'] }
  ];

  // 词语认读
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
    { e: '🌸🌳', w: '植物', opts: ['植物', '动物', '天气'] },
    { e: '🏫📖', w: '学校', opts: ['学校', '医院', '公园'] },
    { e: '❄️🔥', w: '天气', opts: ['天气', '季节', '时间'] },
    { e: '⬆️⬇️', w: '方向', opts: ['方向', '位置', '数字'] },
    { e: '👨‍⚕️👩‍🏫', w: '职业', opts: ['职业', '家人', '朋友'] },
    { e: '🌸🌞', w: '季节', opts: ['季节', '天气', '植物'] },
    { e: 'A B C', w: '字母', opts: ['字母', '数字', '拼音'] },
    { e: '🌞', w: '太阳', opts: ['太阳', '月亮', '星星'] },
    { e: '🌙', w: '月亮', opts: ['月亮', '太阳', '云'] },
    { e: '⭐', w: '星星', opts: ['星星', '太阳', '月亮'] },
    { e: '🏠', w: '房子', opts: ['房子', '车', '树'] },
    { e: '🚪', w: '门', opts: ['门', '窗', '床'] },
    { e: '🪟', w: '窗户', opts: ['窗户', '门', '墙'] },
    { e: '🌳', w: '树', opts: ['树', '花', '草'] },
    { e: '🌸', w: '花', opts: ['花', '树', '云'] },
    { e: '🐟', w: '鱼', opts: ['鱼', '鸟', '虫'] },
    { e: '🔥', w: '火', opts: ['火', '水', '风'] },
    { e: '💧', w: '水', opts: ['水', '火', '冰'] },
    { e: '⛄', w: '雪人', opts: ['雪人', '雪花', '云'] },
    { e: '🎈', w: '气球', opts: ['气球', '球', '花'] },
    { e: '🍬', w: '糖', opts: ['糖', '盐', '米'] }
  ];

  // 笔画笔顺：选笔画数
  var bihua = [
    { zi: '一', n: 1 }, { zi: '二', n: 2 }, { zi: '十', n: 2 }, { zi: '七', n: 2 },
    { zi: '八', n: 2 }, { zi: '九', n: 2 }, { zi: '人', n: 2 }, { zi: '入', n: 2 },
    { zi: '大', n: 3 }, { zi: '天', n: 4 }, { zi: '土', n: 3 }, { zi: '上', n: 3 },
    { zi: '下', n: 3 }, { zi: '个', n: 3 }, { zi: '口', n: 3 }, { zi: '日', n: 4 },
    { zi: '中', n: 4 }, { zi: '月', n: 4 }, { zi: '木', n: 4 }, { zi: '水', n: 4 },
    { zi: '火', n: 4 }, { zi: '山', n: 3 }, { zi: '石', n: 5 }, { zi: '田', n: 5 },
    { zi: '目', n: 5 }, { zi: '耳', n: 6 }, { zi: '手', n: 4 }, { zi: '足', n: 7 },
    { zi: '牙', n: 4 }, { zi: '尺', n: 4 }, { zi: '牛', n: 4 }, { zi: '马', n: 3 },
    { zi: '鸟', n: 5 }, { zi: '虫', n: 6 }, { zi: '云', n: 4 }, { zi: '雨', n: 8 },
    { zi: '风', n: 4 }, { zi: '花', n: 7 }, { zi: '心', n: 4 }, { zi: '力', n: 2 },
    { zi: '女', n: 3 }, { zi: '子', n: 3 }, { zi: '门', n: 3 }, { zi: '五', n: 4 },
    { zi: '六', n: 4 }, { zi: '王', n: 4 }, { zi: '用', n: 5 }, { zi: '生', n: 5 },
    { zi: '头', n: 5 }, { zi: '米', n: 6 }, { zi: '白', n: 5 }, { zi: '自', n: 6 },
    { zi: '衣', n: 6 }, { zi: '少', n: 4 }, { zi: '多', n: 6 }, { zi: '见', n: 4 },
    { zi: '爸', n: 8 }, { zi: '妈', n: 6 }, { zi: '哥', n: 10 },     { zi: '弟', n: 7 },
    { zi: '西', n: 6 }, { zi: '车', n: 4 }, { zi: '东', n: 5 }, { zi: '书', n: 4 },
    { zi: '飞', n: 3 }, { zi: '不', n: 4 }, { zi: '开', n: 4 }, { zi: '电', n: 5 },
    { zi: '出', n: 5 },     { zi: '年', n: 6 }, { zi: '全', n: 6 }, { zi: '回', n: 6 }
  ];

  // 形近字：选正确的字
  var xingjin = [
    { e: '👀', q: '眼睛的（ &nbsp; ）', opts: ['目', '木'], answer: '目' },
    { e: '🌳', q: '树（ &nbsp; ）', opts: ['木', '目'], answer: '木' },
    { e: '🚪', q: '（ &nbsp; ）头', opts: ['入', '人'], answer: '入' },
    { e: '🧍', q: '（ &nbsp; ）口', opts: ['人', '入'], answer: '人' },
    { e: '☀️', q: '（ &nbsp; ）天', opts: ['大', '天'], answer: '天' },
    { e: '🐘', q: '很（ &nbsp; ）', opts: ['大', '天'], answer: '大' },
    { e: '🐑', q: '（ &nbsp; ）云', opts: ['去', '云'], answer: '云' },
    { e: '🚶', q: '（ &nbsp; ）掉', opts: ['去', '云'], answer: '去' },
    { e: '🌾', q: '（ &nbsp; ）苗', opts: ['禾', '木'], answer: '禾' },
    { e: '🪑', q: '桌（ &nbsp; ）', opts: ['子', '了'], answer: '子' },
    { e: '✅', q: '好（ &nbsp; ）', opts: ['了', '子'], answer: '了' },
    { e: '🔪', q: '小（ &nbsp; ）', opts: ['刀', '力'], answer: '刀' },
    { e: '💪', q: '用（ &nbsp; ）', opts: ['力', '刀'], answer: '力' },
    { e: '🤴', q: '大（ &nbsp; ）', opts: ['王', '玉'], answer: '王' },
    { e: '💎', q: '（ &nbsp; ）石', opts: ['玉', '王'], answer: '玉' },
    { e: '👦', q: '（ &nbsp; ）边', opts: ['左', '右'], answer: '左' },
    { e: '👧', q: '（ &nbsp; ）边', opts: ['右', '左'], answer: '右' },
    { e: '🐂', q: '中（ &nbsp; ）', opts: ['午', '牛'], answer: '午' },
    { e: '🐮', q: '（ &nbsp; ）奶', opts: ['牛', '午'], answer: '牛' },
    { e: '🐟', q: '小（ &nbsp; ）', opts: ['鱼', '渔'], answer: '鱼' },
    { e: '🌞', q: '（ &nbsp; ）阳', opts: ['太', '大'], answer: '太' },
    { e: '🌙', q: '（ &nbsp; ）亮', opts: ['月', '用'], answer: '月' },
    { e: '🐝', q: '（ &nbsp; ）窝', opts: ['蜂', '峰'], answer: '蜂' },
    { e: '🔥', q: '（ &nbsp; ）苗', opts: ['火', '禾'], answer: '火' },
    { e: '🪟', q: '窗（ &nbsp; ）', opts: ['户', '护'], answer: '户' },
    { e: '🌧️', q: '（ &nbsp; ）雨', opts: ['下', '不'], answer: '下' }
  ];

  /* ============================================================
   * 数学
   * ============================================================ */
  var FRUIT = ['🍎', '🍌', '🍓', '🍇', '🍊', '🐟', '🐞', '⭐', '🎈', '🍭', '🐤', '🌸'];

  function countQ() {
    var n = rand(2, 20);
    var e = FRUIT[rand(0, FRUIT.length - 1)];
    var emojis = repeat(e, n);
    var correct = String(n);
    var pool = [];
    for (var k = 1; k <= 20; k++) if (k !== n) pool.push(String(k));
    var dis = pick(pool, 2);
    return { q: '数一数，一共有几个？', sub: emojis, options: shuffle([correct].concat(dis)), answer: correct, speak: correct, speakLang: 'zh-CN' };
  }

  function compareQ() {
    if (Math.random() < 0.5) return compareCountQ();
    return compareNumQ();
  }
  function compareCountQ() {
    var a = rand(2, 12), b = rand(2, 12);
    if (a === b) a = a < 12 ? a + 1 : a - 1;
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
    var a = rand(1, 20), b = rand(1, 20);
    if (a === b) a = a < 20 ? a + 1 : a - 1;
    var bigger = a > b ? a : b;
    var smaller = a > b ? b : a;
    var opts = [bigger, smaller];
    var guard = 0;
    while (opts.length < 3 && guard++ < 50) {
      var d = rand(1, 21);
      if (opts.indexOf(d) === -1) opts.push(d);
    }
    return {
      q: a + ' 和 ' + b + '，谁更大？',
      options: shuffle(opts.map(String)),
      answer: String(bigger), speak: String(bigger), speakLang: 'zh-CN'
    };
  }

  function addSubQ(limit, lo) {
    lo = lo || 1;
    var op = Math.random() < 0.5 ? '+' : '-';
    var a, b, correct;
    if (op === '+') {
      a = rand(lo, limit - 1); b = rand(lo, limit - a);
      correct = a + b;
    } else {
      a = rand(lo + 1, limit); b = rand(lo, a - 1);
      correct = a - b;
    }
    var opts = [correct];
    while (opts.length < 3) {
      var d = correct + rand(-2, 2);
      if (d >= 0 && d <= limit && opts.indexOf(d) === -1) opts.push(d);
    }
    return { q: a + ' ' + op + ' ' + b + ' = ?', options: shuffle(opts.map(String)), answer: String(correct), speak: String(correct), speakLang: 'zh-CN' };
  }

  function makeTenQ() {
    var a = rand(1, 9);
    var b = 10 - a;
    var correct = String(b);
    var pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== b; });
    var dis = pick(pool, 2).map(String);
    return { q: a + ' + <span class="slot">?</span> = 10，问号是几？', options: shuffle([correct].concat(dis)), answer: correct, speak: correct, speakLang: 'zh-CN' };
  }

  // 20 以内进位加法（个位满十进一）
  function carryAddQ() {
    var a = rand(6, 9);
    var lo = Math.max(1, 11 - a);
    var b = rand(lo, 9);
    var correct = a + b;
    var opts = [correct];
    while (opts.length < 3) {
      var d = correct + rand(-3, 3);
      if (d >= 2 && d <= 20 && opts.indexOf(d) === -1) opts.push(d);
    }
    return { q: a + ' + ' + b + ' = ?', options: shuffle(opts.map(String)), answer: String(correct), speak: String(correct), speakLang: 'zh-CN' };
  }

  // 20 以内退位减法（破十法）
  function borrowSubQ() {
    var a = rand(11, 18);
    var u = a % 10;
    var b = rand(u + 1, 9);
    var correct = a - b;
    var opts = [correct];
    while (opts.length < 3) {
      var d = correct + rand(-2, 2);
      if (d >= 1 && d <= 18 && opts.indexOf(d) === -1) opts.push(d);
    }
    return { q: a + ' - ' + b + ' = ?', options: shuffle(opts.map(String)), answer: String(correct), speak: String(correct), speakLang: 'zh-CN' };
  }

  // 人民币：元角分
  function moneyQ() {
    if (Math.random() < 0.5) {
      var a = rand(1, 10), b = rand(1, 10);
      var correct = a + b;
      var opts = [correct];
      while (opts.length < 3) {
        var d = correct + rand(-2, 2);
        if (d >= 1 && d <= 20 && opts.indexOf(d) === -1) opts.push(d);
      }
      return { q: a + ' 元 + ' + b + ' 元 = ? 元', options: shuffle(opts.map(String)), answer: String(correct), speak: correct + '元', speakLang: 'zh-CN' };
    }
    var q = [
      { q: '1 元 = ? 角', ans: '10', opts: ['10', '100', '1'] },
      { q: '1 角 = ? 分', ans: '10', opts: ['10', '100', '1'] },
      { q: '2 元 = ? 角', ans: '20', opts: ['20', '2', '200'] },
      { q: '5 角 = ? 分', ans: '50', opts: ['50', '5', '500'] },
      { q: '10 角 = ? 元', ans: '1', opts: ['1', '10', '100'] },
      { q: '1 元 = ? 分', ans: '100', opts: ['100', '10', '1'] }
    ];
    var t = q[rand(0, q.length - 1)];
    return { q: t.q, options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' };
  }

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

  var SHAPES = [
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="#f0b429"/></svg>', name: '圆形', opts: ['圆形', '三角形', '正方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,6 66,64 4,64" fill="#e8543f"/></svg>', name: '三角形', opts: ['三角形', '圆形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><rect x="6" y="6" width="58" height="58" fill="#2f80c9"/></svg>', name: '正方形', opts: ['正方形', '长方形', '圆形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><rect x="2" y="6" width="76" height="38" fill="#2fa35b"/></svg>', name: '长方形', opts: ['长方形', '正方形', '三角形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><ellipse cx="40" cy="25" rx="36" ry="18" fill="#9b6fe0"/></svg>', name: '椭圆形', opts: ['椭圆形', '圆形', '长方形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,5 42.4,24.8 63.5,25.7 47,38.9 52.6,59.3 35,47.6 17.4,59.3 23,38.9 6.5,25.7 27.6,24.8" fill="#f5a623"/></svg>', name: '五角星', opts: ['五角星', '三角形', '正方形'] },
    { svg: '<svg width="80" height="50" viewBox="0 0 80 50"><polygon points="14,8 66,8 54,42 26,42" fill="#e06fd0"/></svg>', name: '梯形', opts: ['梯形', '长方形', '三角形'] },
    { svg: '<svg width="70" height="64" viewBox="0 0 70 64"><path d="M35 60 C10 40 8 18 22 14 C30 11 35 18 35 22 C35 18 40 11 48 14 C62 18 60 40 35 60 Z" fill="#ff7a9a"/></svg>', name: '心形', opts: ['心形', '圆形', '五角星'] },
    { svg: '<svg width="70" height="42" viewBox="0 0 70 42"><path d="M5 37 A30 30 0 0 1 65 37 Z" fill="#ff9f43"/></svg>', name: '半圆形', opts: ['半圆形', '圆形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,6 64,35 35,64 6,35" fill="#54a0ff"/></svg>', name: '菱形', opts: ['菱形', '正方形', '三角形'] },
    { svg: '<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="28" fill="none" stroke="#5f27cd" stroke-width="12"/></svg>', name: '圆环', opts: ['圆环', '圆形', '五角星'] }
  ];
  var SHAPES3D = [
    { emoji: '📦', name: '正方体', opts: ['正方体', '长方体', '球'] },
    { emoji: '🟦', name: '长方体', opts: ['长方体', '正方体', '圆柱'] },
    { emoji: '🥫', name: '圆柱', opts: ['圆柱', '球', '正方体'] },
    { emoji: '⚽', name: '球', opts: ['球', '圆柱', '正方体'] },
    { emoji: '🍦', name: '圆锥', opts: ['圆锥', '圆柱', '球'] }
  ];

  var numPatterns = [
    { seq: '1 · 2 · 3 · <b>?</b>', ans: '4', opts: ['4', '5', '2'] },
    { seq: '2 · 4 · 6 · <b>?</b>', ans: '8', opts: ['8', '7', '9'] },
    { seq: '5 · 7 · 9 · <b>?</b>', ans: '11', opts: ['11', '10', '12'] },
    { seq: '1 · 3 · 5 · <b>?</b>', ans: '7', opts: ['7', '6', '8'] },
    { seq: '9 · 8 · 7 · <b>?</b>', ans: '6', opts: ['6', '5', '4'] },
    { seq: '3 · 3 · 4 · 4 · <b>?</b>', ans: '5', opts: ['5', '6', '3'] },
    { seq: '4 · 6 · 8 · <b>?</b>', ans: '10', opts: ['10', '9', '12'] },
    { seq: '3 · 6 · 9 · <b>?</b>', ans: '12', opts: ['12', '10', '11'] },
    { seq: '20 · 18 · 16 · <b>?</b>', ans: '14', opts: ['14', '15', '12'] },
    { seq: '5 · 10 · 15 · <b>?</b>', ans: '20', opts: ['20', '25', '15'] },
    { seq: '21 · 22 · 23 · <b>?</b>', ans: '24', opts: ['24', '25', '22'] },
    { seq: '2 · 4 · 8 · <b>?</b>', ans: '16', opts: ['16', '10', '14'] },
    { seq: '3 · 5 · 7 · <b>?</b>', ans: '9', opts: ['9', '8', '10'] },
    { seq: '2 · 3 · 5 · 8 · <b>?</b>', ans: '13', opts: ['13', '12', '11'] },
    { seq: '30 · 27 · 24 · <b>?</b>', ans: '21', opts: ['21', '18', '24'] },
    { seq: '10 · 20 · 30 · <b>?</b>', ans: '40', opts: ['40', '50', '30'] },
    { seq: '100 · 90 · 80 · <b>?</b>', ans: '70', opts: ['70', '60', '80'] }
  ];
  var emojiPatterns = [
    { seq: '🍎 🍌 🍎 🍌 <b>?</b>', ans: '🍎', opts: ['🍎', '🍌', '🍇'] },
    { seq: '⭐ 🌙 ⭐ 🌙 <b>?</b>', ans: '⭐', opts: ['⭐', '🌙', '☀️'] },
    { seq: '🐱 🐶 🐱 🐶 <b>?</b>', ans: '🐱', opts: ['🐱', '🐶', '🐭'] },
    { seq: '🔴 🔵 🔴 🔵 <b>?</b>', ans: '🔴', opts: ['🔴', '🔵', '🟢'] },
    { seq: '🍎 🍎 🍌 🍎 🍎 <b>?</b>', ans: '🍌', opts: ['🍌', '🍎', '🍇'] },
    { seq: '🔺 🔻 🔺 🔻 <b>?</b>', ans: '🔺', opts: ['🔺', '🔻', '🔶'] },
    { seq: '🐰 🐰 🐻 🐰 🐰 🐻 <b>?</b>', ans: '🐰', opts: ['🐰', '🐻', '🐱'] },
    { seq: '🌸 🍀 🌸 🍀 <b>?</b>', ans: '🌸', opts: ['🌸', '🍀', '🌟'] },
    { seq: '🐶 🐱 🐶 🐱 🐶 <b>?</b>', ans: '🐶', opts: ['🐶', '🐱', '🐭'] }
  ];
  function patternQ() {
    if (Math.random() < 0.5) {
      var n = numPatterns[rand(0, numPatterns.length - 1)];
      return { q: '找规律，? 处应该填什么？', sub: '<div class="pattern">' + n.seq + '</div>', options: n.opts, answer: n.ans, speak: n.ans, speakLang: 'zh-CN' };
    }
    var e = emojiPatterns[rand(0, emojiPatterns.length - 1)];
    return { q: '找规律，? 处应该放什么？', sub: '<div class="pattern">' + e.seq + '</div>', options: e.opts, answer: e.ans };
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
    { e: '👕', cn: '衬衫', w: 'shirt', opts: ['shirt', 'skirt', 'short'] },
    { e: '👖', cn: '裤子', w: 'pants', opts: ['pants', 'plant', 'paint'] },
    { e: '⚫', cn: '黑色', w: 'black', opts: ['black', 'white', 'blue'] },
    { e: '⚪', cn: '白色', w: 'white', opts: ['white', 'black', 'red'] },
    { e: '🟣', cn: '紫色', w: 'purple', opts: ['purple', 'pink', 'blue'] },
    { e: '🌞', cn: '太阳', w: 'sun', opts: ['sun', 'son', 'run'] },
    { e: '⭐', cn: '星星', w: 'star', opts: ['star', 'sun', 'stair'] },
    { e: '🌙', cn: '月亮', w: 'moon', opts: ['moon', 'noon', 'soon'] },
    { e: '🏫', cn: '学校', w: 'school', opts: ['school', 'zoo', 'park'] },
    { e: '📚', cn: '书', w: 'book', opts: ['book', 'look', 'cook'] },
    { e: '✏️', cn: '铅笔', w: 'pencil', opts: ['pencil', 'pen', 'penny'] },
    { e: '👩‍🏫', cn: '老师', w: 'teacher', opts: ['teacher', 'student', 'doctor'] },
    { e: '🐭', cn: '老鼠', w: 'mouse', opts: ['mouse', 'mouth', 'house'] },
    { e: '🐝', cn: '蜜蜂', w: 'bee', opts: ['bee', 'bear', 'tea'] },
    { e: '🐴', cn: '马', w: 'horse', opts: ['horse', 'house', 'rose'] },
    { e: '🍐', cn: '梨', w: 'pear', opts: ['pear', 'bear', 'pea'] },
    { e: '🍅', cn: '番茄', w: 'tomato', opts: ['tomato', 'potato', 'photo'] },
    { e: '🌽', cn: '玉米', w: 'corn', opts: ['corn', 'coin', 'cow'] },
    { e: '🧦', cn: '袜子', w: 'socks', opts: ['socks', 'shoes', 'box'] },
    { e: '👟', cn: '鞋', w: 'shoes', opts: ['shoes', 'socks', 'shirt'] },
    { e: '🍩', cn: '甜甜圈', w: 'donut', opts: ['donut', 'dot', 'nut'] }
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
    { e: '30', w: 'thirty', opts: ['thirty', 'thirteen', 'three'] },
    { e: '40', w: 'forty', opts: ['forty', 'fourteen', 'four'] },
    { e: '100', w: 'one hundred', opts: ['one hundred', 'hundred', 'ten'] }
  ];

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
    { e: '🐱', w: 'cat', opts: ['cat', 'fat', 'mat'] },
    { e: '🏃', w: 'run', opts: ['run', 'fun', 'sun'] },
    { e: '🎒', w: 'bag', opts: ['bag', 'bug', 'big'] },
    { e: '🦵', w: 'leg', opts: ['leg', 'log', 'lug'] },
    { e: '🔴', w: 'red', opts: ['red', 'bed', 'led'] },
    { e: '🪑', w: 'sit', opts: ['sit', 'sat', 'set'] },
    { e: '💍', w: 'ring', opts: ['ring', 'rang', 'rung'] },
    { e: '🐝', w: 'bee', opts: ['bee', 'bet', 'bit'] },
    { e: '🐍', w: 'snake', opts: ['snake', 'snack', 'sake'] },
    { e: '🐴', w: 'horse', opts: ['horse', 'house', 'hose'] },
    { e: '🍎', w: 'red', opts: ['red', 'bed', 'led'] },
    { e: '🐟', w: 'fish', opts: ['fish', 'dish', 'wish'] },
    { e: '🌟', w: 'star', opts: ['star', 'tar', 'car'] }
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
    { e: '🏫', q: 'I go to <span class="slot">___</span>.', w: 'school', opts: ['school', 'zoo', 'park'] },
    { e: '📚', q: 'I read a <span class="slot">___</span>.', w: 'book', opts: ['book', 'look', 'cook'] },
    { e: '🐰', q: 'I see a <span class="slot">___</span>.', w: 'rabbit', opts: ['rabbit', 'cat', 'rat'] },
    { e: '🦁', q: 'This is a <span class="slot">___</span>.', w: 'lion', opts: ['lion', 'tiger', 'line'] },
    { e: '🍐', q: 'I eat a <span class="slot">___</span>.', w: 'pear', opts: ['pear', 'bear', 'pea'] },
    { e: '🐝', q: 'I see a <span class="slot">___</span>.', w: 'bee', opts: ['bee', 'bear', 'tea'] },
    { e: '🐴', q: 'This is a <span class="slot">___</span>.', w: 'horse', opts: ['horse', 'house', 'rose'] },
    { e: '🐻', q: 'This is a <span class="slot">___</span>.', w: 'bear', opts: ['bear', 'beer', 'pear'] },
    { e: '🐼', q: 'I see a <span class="slot">___</span>.', w: 'panda', opts: ['panda', 'pan', 'band'] },
    { e: '🐵', q: 'This is a <span class="slot">___</span>.', w: 'monkey', opts: ['monkey', 'donkey', 'key'] },
    { e: '🐸', q: 'I see a <span class="slot">___</span>.', w: 'frog', opts: ['frog', 'dog', 'log'] },
    { e: '🥚', q: 'I eat an <span class="slot">___</span>.', w: 'egg', opts: ['egg', 'leg', 'peg'] },
    { e: '🐟', q: 'This is a <span class="slot">___</span>.', w: 'fish', opts: ['fish', 'dish', 'wish'] },
    { e: '🐘', q: 'This is an <span class="slot">___</span>.', w: 'elephant', opts: ['elephant', 'ant', 'elf'] },
    { e: '🦋', q: 'I see a <span class="slot">___</span>.', w: 'butterfly', opts: ['butterfly', 'fly', 'butter'] },
    { e: '🐑', q: 'This is a <span class="slot">___</span>.', w: 'sheep', opts: ['sheep', 'ship', 'shop'] },
    { e: '🌞', q: 'The sun is <span class="slot">___</span>.', w: 'yellow', opts: ['yellow', 'red', 'blue'] }
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
    { e: '🧒', cn: '小孩', w: 'kid', opts: ['kid', 'cat', 'dad'] },
    { e: '👨‍🦳', cn: '外公', w: 'grandpa', opts: ['grandpa', 'grandma', 'dad'] },
    { e: '👩‍🦳', cn: '外婆', w: 'grandma', opts: ['grandma', 'grandpa', 'mom'] },
    { e: '🧑‍🏫', cn: '同学', w: 'classmate', opts: ['classmate', 'class', 'mate'] }
  ];

  var greet = [
    { e: '👋', q: '"Hello" 是什么意思？', opts: ['你好', '再见', '谢谢'], answer: '你好', speak: 'Hello', speakLang: 'en-US' },
    { e: '🤝', q: '"Goodbye" 是什么意思？', opts: ['你好', '再见', '早上好'], answer: '再见', speak: 'Goodbye', speakLang: 'en-US' },
    { e: '🌅', q: '"Good morning" 是什么意思？', opts: ['早上好', '晚上好', '晚安'], answer: '早上好', speak: 'Good morning', speakLang: 'en-US' },
    { e: '🌇', q: '"Good evening" 是什么意思？', opts: ['早上好', '晚上好', '下午好'], answer: '晚上好', speak: 'Good evening', speakLang: 'en-US' },
    { e: '🙏', q: '"Thank you" 是什么意思？', opts: ['谢谢', '对不起', '你好'], answer: '谢谢', speak: 'Thank you', speakLang: 'en-US' },
    { e: '😊', q: '"How are you?" 是问什么？', opts: ['你好吗', '你叫什么', '谢谢'], answer: '你好吗', speak: 'How are you', speakLang: 'en-US' },
    { e: '😊', q: '怎样用英语回答"我很好"？', opts: ['I am fine', 'Goodbye', 'Thank you'], answer: 'I am fine', speak: 'I am fine', speakLang: 'en-US' },
    { e: '👧', q: '"What is your name?" 是问什么？', opts: ['你叫什么名字', '你好吗', '你几岁'], answer: '你叫什么名字', speak: 'What is your name', speakLang: 'en-US' },
    { e: '👋', q: '"Hi" 是什么意思？', opts: ['你好', '再见', '谢谢'], answer: '你好', speak: 'Hi', speakLang: 'en-US' },
    { e: '🙌', q: '"See you" 是什么意思？', opts: ['再见', '你好', '谢谢'], answer: '再见', speak: 'See you', speakLang: 'en-US' },
    { e: '🌞', q: '"Good afternoon" 是什么意思？', opts: ['下午好', '早上好', '晚上好'], answer: '下午好', speak: 'Good afternoon', speakLang: 'en-US' },
    { e: '🌜', q: '"Good night" 是什么意思？', opts: ['晚安', '晚上好', '再见'], answer: '晚安', speak: 'Good night', speakLang: 'en-US' },
    { e: '😔', q: '"Sorry" 是什么意思？', opts: ['对不起', '谢谢', '你好'], answer: '对不起', speak: 'Sorry', speakLang: 'en-US' },
    { e: '🙇', q: '"Excuse me" 是什么意思？', opts: ['打扰一下', '谢谢', '你好'], answer: '打扰一下', speak: 'Excuse me', speakLang: 'en-US' },
    { e: '🤗', q: '"You\'re welcome" 是什么意思？', opts: ['不客气', '谢谢', '对不起'], answer: '不客气', speak: 'You are welcome', speakLang: 'en-US' },
    { e: '🙏', q: '"Please" 是什么意思？', opts: ['请', '谢谢', '对不起'], answer: '请', speak: 'Please', speakLang: 'en-US' },
    { e: '😄', q: '"Nice to meet you" 是什么意思？', opts: ['很高兴见到你', '你好吗', '再见'], answer: '很高兴见到你', speak: 'Nice to meet you', speakLang: 'en-US' },
    { e: '❓', q: '"What\'s this?" 是问什么？', opts: ['这是什么', '那是什么', '你好吗'], answer: '这是什么', speak: 'What is this', speakLang: 'en-US' },
    { e: '🔢', q: '"How old are you?" 是问什么？', opts: ['你几岁', '你叫什么', '你好吗'], answer: '你几岁', speak: 'How old are you', speakLang: 'en-US' },
    { e: '👋', q: '"Bye" 是什么意思？', opts: ['再见', '你好', '谢谢'], answer: '再见', speak: 'Bye', speakLang: 'en-US' }
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
   * 一年级·丰富版新增数据（三科各 +4 关 → 38 关）
   * ============================================================ */

  // 语文：声调（给带调字，选第几声）
  var shengdiao = [
    { ch: '妈', py: 'mā', t: '一声' }, { ch: '麻', py: 'má', t: '二声' },
    { ch: '马', py: 'mǎ', t: '三声' }, { ch: '骂', py: 'mà', t: '四声' },
    { ch: '花', py: 'huā', t: '一声' }, { ch: '华', py: 'huá', t: '二声' },
    { ch: '火', py: 'huǒ', t: '三声' }, { ch: '贺', py: 'hè', t: '四声' },
    { ch: '书', py: 'shū', t: '一声' }, { ch: '熟', py: 'shú', t: '二声' },
    { ch: '数', py: 'shǔ', t: '三声' }, { ch: '树', py: 'shù', t: '四声' },
    { ch: '知', py: 'zhī', t: '一声' }, { ch: '直', py: 'zhí', t: '二声' },
    { ch: '纸', py: 'zhǐ', t: '三声' }, { ch: '治', py: 'zhì', t: '四声' },
    { ch: '高', py: 'gāo', t: '一声' }, { ch: '搞', py: 'gǎo', t: '三声' },
    { ch: '汉', py: 'hàn', t: '四声' },     { ch: '鸡', py: 'jī', t: '一声' },
    { ch: '包', py: 'bāo', t: '一声' }, { ch: '拔', py: 'bá', t: '二声' },
    { ch: '把', py: 'bǎ', t: '三声' }, { ch: '爸', py: 'bà', t: '四声' },
    { ch: '衣', py: 'yī', t: '一声' }, { ch: '姨', py: 'yí', t: '二声' },
    { ch: '椅', py: 'yǐ', t: '三声' }, { ch: '意', py: 'yì', t: '四声' },
    { ch: '哥', py: 'gē', t: '一声' }, { ch: '国', py: 'guó', t: '二声' }
  ];

  // 语文：词语搭配（形容词 + 名词）
  var peitao = [
    { a: '红红的', b: '苹果', opts: ['苹果', '大海', '月亮'] },
    { a: '蓝蓝的', b: '天空', opts: ['天空', '草地', '太阳'] },
    { a: '白白的', b: '云朵', opts: ['云朵', '苹果', '树叶'] },
    { a: '绿绿的', b: '草地', opts: ['草地', '晚霞', '果汁'] },
    { a: '甜甜的', b: '糖果', opts: ['糖果', '辣椒', '苦瓜'] },
    { a: '圆圆的', b: '月亮', opts: ['月亮', '饼干', '书本'] },
    { a: '大大的', b: '西瓜', opts: ['西瓜', '芝麻', '蚂蚁'] },
    { a: '弯弯的', b: '香蕉', opts: ['香蕉', '木棍', '筷子'] },
    { a: '闪闪的', b: '星星', opts: ['星星', '石头', '泥土'] },
    { a: '香香的', b: '花儿', opts: ['花儿', '臭豆腐', '泥土'] },
    { a: '暖暖的', b: '太阳', opts: ['太阳', '冰块', '雪花'] },
    { a: '清清的', b: '河水', opts: ['河水', '泥浆', '墨水'] },
    { a: '青青的', b: '小草', opts: ['小草', '红花', '大树'] },
    { a: '亮亮的', b: '眼睛', opts: ['眼睛', '石头', '灯光'] },
    { a: '咸咸的', b: '海水', opts: ['海水', '糖果', '淡水'] },
    { a: '软软的', b: '棉花', opts: ['棉花', '石头', '木头'] },
    { a: '甜甜的', b: '西瓜', opts: ['西瓜', '苦瓜', '辣椒'] }
  ];

  // 语文：量词
  var liangci = [
    { n: '牛', l: '头', opts: ['头', '只', '条'] },
    { n: '羊', l: '只', opts: ['只', '头', '匹'] },
    { n: '鱼', l: '条', opts: ['条', '只', '头'] },
    { n: '鸟', l: '只', opts: ['只', '条', '头'] },
    { n: '马', l: '匹', opts: ['匹', '只', '头'] },
    { n: '书', l: '本', opts: ['本', '个', '张'] },
    { n: '花', l: '朵', opts: ['朵', '棵', '片'] },
    { n: '树', l: '棵', opts: ['棵', '朵', '根'] },
    { n: '狗', l: '只', opts: ['只', '头', '匹'] },
    { n: '云', l: '朵', opts: ['朵', '片', '个'] },
    { n: '星', l: '颗', opts: ['颗', '个', '粒'] },
    { n: '笔', l: '支', opts: ['支', '把', '根'] },
    { n: '人', l: '个', opts: ['个', '位', '名'] },
    { n: '车', l: '辆', opts: ['辆', '台', '只'] },
    { n: '猫', l: '只', opts: ['只', '条', '头'] },
    { n: '门', l: '扇', opts: ['扇', '个', '张'] },
    { n: '船', l: '艘', opts: ['艘', '条', '只'] },
    { n: '山', l: '座', opts: ['座', '个', '堆'] },
    { n: '鸡', l: '只', opts: ['只', '条', '头'] },
    { n: '雨', l: '场', opts: ['场', '滴', '个'] },
    { n: '糖', l: '颗', opts: ['颗', '块', '粒'] },
    { n: '纸', l: '张', opts: ['张', '片', '块'] },
    { n: '鞋', l: '双', opts: ['双', '只', '对'] }
  ];

  // 语文：偏旁部首
  var pianpang = [
    { zi: '河', bu: '氵', opts: ['氵', '木', '火'] },
    { zi: '树', bu: '木', opts: ['木', '氵', '艹'] },
    { zi: '妈', bu: '女', opts: ['女', '父', '口'] },
    { zi: '爸', bu: '父', opts: ['父', '女', '八'] },
    { zi: '花', bu: '艹', opts: ['艹', '木', '禾'] },
    { zi: '吃', bu: '口', opts: ['口', '氵', '扌'] },
    { zi: '跑', bu: '⻊', opts: ['⻊', '口', '足'] },
    { zi: '红', bu: '纟', opts: ['纟', '火', '工'] },
    { zi: '字', bu: '宀', opts: ['宀', '子', '冖'] },
    { zi: '苗', bu: '艹', opts: ['艹', '田', '木'] },
    { zi: '打', bu: '扌', opts: ['扌', '丁', '手'] },
    { zi: '狗', bu: '犭', opts: ['犭', '句', '犬'] },
    { zi: '们', bu: '亻', opts: ['亻', '门', '人'] },
    { zi: '话', bu: '讠', opts: ['讠', '舌', '口'] },
    { zi: '秋', bu: '禾', opts: ['禾', '火', '木'] },
    { zi: '扛', bu: '扌', opts: ['扌', '工', '亢'] },
    { zi: '江', bu: '氵', opts: ['氵', '工', '红'] },
    { zi: '桃', bu: '木', opts: ['木', '兆', '挑'] },
    { zi: '姐', bu: '女', opts: ['女', '且', '姐'] },
    { zi: '奶', bu: '女', opts: ['女', '乃', '奶'] },
    { zi: '草', bu: '艹', opts: ['艹', '早', '草'] },
    { zi: '快', bu: '忄', opts: ['忄', '块', '央'] }
  ];

  // 数学：100 以内读数
  var NUM_READ = [
    { n: 21, r: '二十一' }, { n: 35, r: '三十五' }, { n: 42, r: '四十二' },
    { n: 58, r: '五十八' }, { n: 67, r: '六十七' }, { n: 73, r: '七十三' },
    { n: 89, r: '八十九' }, { n: 96, r: '九十六' }, { n: 45, r: '四十五' },
    { n: 54, r: '五十四' }, { n: 38, r: '三十八' }, { n: 61, r: '六十一' },
    { n: 79, r: '七十九' }, { n: 84, r: '八十四' }, { n: 90, r: '九十' },
    { n: 100, r: '一百' }
  ];
  function read100Q() {
    var t = NUM_READ[rand(0, NUM_READ.length - 1)];
    var pool = NUM_READ.filter(function (x) { return x.n !== t.n; }).map(function (x) { return x.r; });
    var dis = pick(pool, 2);
    return { q: '数字 <b>' + t.n + '</b> 读作？', options: shuffle([t.r].concat(dis)), answer: t.r, speak: t.r, speakLang: 'zh-CN' };
  }
  // 数学：100 以内比大小
  function cmp100Q() {
    var a = rand(21, 99), b = rand(21, 99);
    if (a === b) b = b < 99 ? b + 1 : b - 1;
    var bigger = a > b ? a : b;
    var opts = [bigger, a > b ? b : a];
    var guard = 0;
    while (opts.length < 3 && guard++ < 50) {
      var d = rand(20, 100);
      if (opts.indexOf(d) === -1) opts.push(d);
    }
    return { q: a + ' 和 ' + b + '，谁更大？', options: shuffle(opts.map(String)), answer: String(bigger), speak: String(bigger), speakLang: 'zh-CN' };
  }
  // 数学：分类整理（数出指定类别的数量）
  var CLASSIFY_POOL = {
    '🍎': '水果', '🍌': '水果', '🍇': '水果', '🍓': '水果',
    '🐱': '动物', '🐶': '动物', '🐰': '动物', '🐘': '动物',
    '⭐': '图形', '🔺': '图形', '🔵': '图形', '🟦': '图形'
  };
  function randKeyOf(cat) {
    var ks = Object.keys(CLASSIFY_POOL).filter(function (k) { return CLASSIFY_POOL[k] === cat; });
    return ks[rand(0, ks.length - 1)];
  }
  function classifyQ() {
    var kinds = ['水果', '动物', '图形'];
    var target = kinds[rand(0, 2)];
    var items = [];
    var want = rand(2, 4);
    for (var i = 0; i < want; i++) items.push(randKeyOf(target));
    while (items.length < rand(8, 11)) {
      var k = rand(0, 2);
      if (k !== kinds.indexOf(target)) items.push(randKeyOf(kinds[k]));
    }
    items = shuffle(items);
    var correct = String(items.filter(function (x) { return CLASSIFY_POOL[x] === target; }).length);
    var opts = [correct];
    while (opts.length < 3) {
      var d = String(rand(0, items.length));
      if (opts.indexOf(d) === -1 && d !== correct) opts.push(d);
    }
    return {
      q: '数一数，<b>' + target + '</b> 有几个？',
      sub: '<div class="cmp"><div class="cmp-side">' + items.join(' ') + '</div></div>',
      options: shuffle(opts), answer: correct, speak: correct, speakLang: 'zh-CN'
    };
  }
  // 数学：看图列式（应用题）
  var APPLY = [
    function () { var a = rand(3, 8), b = rand(2, 6); return { q: '树上有 <b>' + a + '</b> 只鸟，又飞来 <b>' + b + '</b> 只，一共几只？', ans: a + b }; },
    function () { var a = rand(8, 14), b = rand(2, 6); return { q: '停车场原来有 <b>' + a + '</b> 辆车，开走 <b>' + b + '</b> 辆，还剩几辆？', ans: a - b }; },
    function () { var a = rand(4, 9); return { q: '小明有 <b>' + a + '</b> 颗糖，妈妈又给他 <b>3</b> 颗，现在有几颗？', ans: a + 3 }; },
    function () { var a = rand(10, 16), b = rand(3, 7); return { q: '教室里有 <b>' + a + '</b> 个小朋友，走了 <b>' + b + '</b> 个，还有几个？', ans: a - b }; },
    function () { var a = rand(5, 9), b = rand(5, 9); return { q: '左边 <b>' + a + '</b> 个苹果，右边 <b>' + b + '</b> 个苹果，一共几个？', ans: a + b }; },
    function () { var a = rand(12, 18), b = rand(3, 8); return { q: '盘子里有 <b>' + a + '</b> 块饼干，吃掉 <b>' + b + '</b> 块，还剩几块？', ans: a - b }; },
    function () { var a = rand(6, 10); return { q: '小红买了 <b>' + a + '</b> 支铅笔，用掉 <b>2</b> 支，还剩几支？', ans: a - 2 }; },
    function () { var a = rand(7, 11), b = rand(4, 7); return { q: '花园里开了 <b>' + a + '</b> 朵红花、<b>' + b + '</b> 朵黄花，一共几朵？', ans: a + b }; }
  ];
  function applyQ() {
    var t = APPLY[rand(0, APPLY.length - 1)]();
    var correct = String(t.ans);
    var opts = [correct];
    while (opts.length < 3) {
      var d = String(t.ans + rand(-3, 3));
      if (opts.indexOf(d) === -1 && d !== correct && parseInt(d, 10) >= 0) opts.push(d);
    }
    return { q: t.q, options: shuffle(opts), answer: correct, speak: correct, speakLang: 'zh-CN' };
  }

  // 英语：从 vocab 拆出四个主题类别（更专项）
  // 颜色：小学一年级基础颜色，词汇量有限（已扩展到课程 realistically 最大，capped）
  var colorVocab = [
    { e: '🔴', cn: '红色', w: 'red', opts: ['red', 'blue', 'yellow'] },
    { e: '🟠', cn: '橙色', w: 'orange', opts: ['orange', 'red', 'yellow'] },
    { e: '🟡', cn: '黄色', w: 'yellow', opts: ['yellow', 'green', 'red'] },
    { e: '🟢', cn: '绿色', w: 'green', opts: ['green', 'red', 'blue'] },
    { e: '🔵', cn: '蓝色', w: 'blue', opts: ['blue', 'green', 'red'] },
    { e: '🟣', cn: '紫色', w: 'purple', opts: ['purple', 'pink', 'blue'] },
    { e: '🌸', cn: '粉色', w: 'pink', opts: ['pink', 'purple', 'red'] },
    { e: '⚫', cn: '黑色', w: 'black', opts: ['black', 'white', 'blue'] },
    { e: '⚪', cn: '白色', w: 'white', opts: ['white', 'black', 'red'] },
    { e: '🟤', cn: '棕色', w: 'brown', opts: ['brown', 'black', 'blue'] },
    { e: '🌫️', cn: '灰色', w: 'gray', opts: ['gray', 'green', 'blue'] }
  ];
  // 动物：扩展到 26
  var animalVocab = [
    { e: '🐱', cn: '猫', w: 'cat', opts: ['cat', 'dog', 'bird'] },
    { e: '🐶', cn: '狗', w: 'dog', opts: ['dog', 'cat', 'pig'] },
    { e: '🐦', cn: '鸟', w: 'bird', opts: ['bird', 'fish', 'duck'] },
    { e: '🐟', cn: '鱼', w: 'fish', opts: ['fish', 'bird', 'cat'] },
    { e: '🦆', cn: '鸭子', w: 'duck', opts: ['duck', 'pig', 'cow'] },
    { e: '🐷', cn: '猪', w: 'pig', opts: ['pig', 'cow', 'dog'] },
    { e: '🐮', cn: '奶牛', w: 'cow', opts: ['cow', 'duck', 'pig'] },
    { e: '🐰', cn: '兔子', w: 'rabbit', opts: ['rabbit', 'cat', 'rat'] },
    { e: '🐯', cn: '老虎', w: 'tiger', opts: ['tiger', 'lion', 'bear'] },
    { e: '🐻', cn: '熊', w: 'bear', opts: ['bear', 'beer', 'pear'] },
    { e: '🦁', cn: '狮子', w: 'lion', opts: ['lion', 'tiger', 'line'] },
    { e: '🐘', cn: '大象', w: 'elephant', opts: ['elephant', 'ant', 'elf'] },
    { e: '🐵', cn: '猴子', w: 'monkey', opts: ['monkey', 'donkey', 'key'] },
    { e: '🐼', cn: '熊猫', w: 'panda', opts: ['panda', 'pan', 'band'] },
    { e: '🐍', cn: '蛇', w: 'snake', opts: ['snake', 'snack', 'cake'] },
    { e: '🐸', cn: '青蛙', w: 'frog', opts: ['frog', 'dog', 'log'] },
    { e: '🦋', cn: '蝴蝶', w: 'butterfly', opts: ['butterfly', 'fly', 'butter'] },
    { e: '🐑', cn: '绵羊', w: 'sheep', opts: ['sheep', 'ship', 'shop'] },
    { e: '🐴', cn: '马', w: 'horse', opts: ['horse', 'house', 'rose'] },
    { e: '🐭', cn: '老鼠', w: 'mouse', opts: ['mouse', 'mouth', 'house'] },
    { e: '🐝', cn: '蜜蜂', w: 'bee', opts: ['bee', 'bear', 'tea'] },
    { e: '🐔', cn: '鸡', w: 'chicken', opts: ['chicken', 'kitchen', 'check'] },
    { e: '🕷️', cn: '蜘蛛', w: 'spider', opts: ['spider', 'spy', 'spit'] },
    { e: '🐢', cn: '乌龟', w: 'turtle', opts: ['turtle', 'turkey', 'table'] },
    { e: '🦊', cn: '狐狸', w: 'fox', opts: ['fox', 'box', 'fix'] },
    { e: '🐊', cn: '鳄鱼', w: 'crocodile', opts: ['crocodile', 'crop', 'code'] }
  ];
  // 身体部位：词汇量有限（已扩展到课程 realistically 最大，capped）
  var bodyVocab = [
    { e: '👤', cn: '头', w: 'head', opts: ['head', 'hand', 'hair'] },
    { e: '👁️', cn: '眼睛', w: 'eye', opts: ['eye', 'ear', 'nose'] },
    { e: '👂', cn: '耳朵', w: 'ear', opts: ['ear', 'eye', 'nose'] },
    { e: '👃', cn: '鼻子', w: 'nose', opts: ['nose', 'ear', 'mouth'] },
    { e: '👄', cn: '嘴巴', w: 'mouth', opts: ['mouth', 'nose', 'eye'] },
    { e: '✋', cn: '手', w: 'hand', opts: ['hand', 'head', 'foot'] },
    { e: '💪', cn: '胳膊', w: 'arm', opts: ['arm', 'leg', 'hand'] },
    { e: '🦵', cn: '腿', w: 'leg', opts: ['leg', 'arm', 'foot'] },
    { e: '🦶', cn: '脚', w: 'foot', opts: ['foot', 'hand', 'leg'] },
    { e: '🙂', cn: '脸', w: 'face', opts: ['face', 'foot', 'fish'] },
    { e: '💇', cn: '头发', w: 'hair', opts: ['hair', 'hand', 'head'] },
    { e: '🦷', cn: '牙齿', w: 'tooth', opts: ['tooth', 'teeth', 'foot'] },
    { e: '👆', cn: '手指', w: 'finger', opts: ['finger', 'foot', 'hand'] },
    { e: '🤷', cn: '肩膀', w: 'shoulder', opts: ['shoulder', 'soldier', 'should'] },
    { e: '🦿', cn: '膝盖', w: 'knee', opts: ['knee', 'need', 'kiss'] },
    { e: '🦶', cn: '脚趾', w: 'toe', opts: ['toe', 'foot', 'two'] }
  ];
  // 食物：扩展到 26
  var foodVocab = [
    { e: '🍎', cn: '苹果', w: 'apple', opts: ['apple', 'banana', 'orange'] },
    { e: '🍌', cn: '香蕉', w: 'banana', opts: ['banana', 'apple', 'grape'] },
    { e: '🍊', cn: '橙子', w: 'orange', opts: ['orange', 'apple', 'pear'] },
    { e: '🥛', cn: '牛奶', w: 'milk', opts: ['milk', 'water', 'juice'] },
    { e: '🍚', cn: '米饭', w: 'rice', opts: ['rice', 'noodle', 'bread'] },
    { e: '🍇', cn: '葡萄', w: 'grape', opts: ['grape', 'apple', 'banana'] },
    { e: '🍉', cn: '西瓜', w: 'watermelon', opts: ['watermelon', 'melon', 'apple'] },
    { e: '🥕', cn: '胡萝卜', w: 'carrot', opts: ['carrot', 'cat', 'card'] },
    { e: '🍞', cn: '面包', w: 'bread', opts: ['bread', 'rice', 'cake'] },
    { e: '🧀', cn: '奶酪', w: 'cheese', opts: ['cheese', 'cat', 'cake'] },
    { e: '🥚', cn: '鸡蛋', w: 'egg', opts: ['egg', 'leg', 'peg'] },
    { e: '🍖', cn: '肉', w: 'meat', opts: ['meat', 'eat', 'meet'] },
    { e: '🐟', cn: '鱼肉', w: 'fish', opts: ['fish', 'dish', 'wish'] },
    { e: '💧', cn: '水', w: 'water', opts: ['water', 'milk', 'juice'] },
    { e: '🧃', cn: '果汁', w: 'juice', opts: ['juice', 'water', 'rice'] },
    { e: '🍐', cn: '梨', w: 'pear', opts: ['pear', 'bear', 'pea'] },
    { e: '🍅', cn: '番茄', w: 'tomato', opts: ['tomato', 'potato', 'photo'] },
    { e: '🌽', cn: '玉米', w: 'corn', opts: ['corn', 'coin', 'cow'] },
    { e: '🍩', cn: '甜甜圈', w: 'donut', opts: ['donut', 'dot', 'nut'] },
    { e: '🍰', cn: '蛋糕', w: 'cake', opts: ['cake', 'cat', 'lake'] },
    { e: '🍔', cn: '汉堡', w: 'burger', opts: ['burger', 'bug', 'bag'] },
    { e: '🍕', cn: '披萨', w: 'pizza', opts: ['pizza', 'panda', 'pit'] },
    { e: '🥟', cn: '饺子', w: 'dumpling', opts: ['dumpling', 'dump', 'ding'] },
    { e: '🍜', cn: '面条', w: 'noodle', opts: ['noodle', 'needle', 'noble'] },
    { e: '🍦', cn: '冰淇淋', w: 'ice cream', opts: ['ice cream', 'ice', 'cream'] },
    { e: '🍪', cn: '饼干', w: 'cookie', opts: ['cookie', 'cook', 'book'] }
  ];

  /* ============================================================
   * 新增数据池（支撑新关 yw13 / yw14 / sx15）
   * ============================================================ */

  // 语文：诗句接龙（给上一句，选下一句）
  var gushiXuan = [
    { q: '“床前明月光”的下一句是？', opts: ['疑是地上霜', '低头思故乡', '举头望明月'], answer: '疑是地上霜' },
    { q: '“疑是地上霜”的下一句是？', opts: ['举头望明月', '低头思故乡', '床前明月光'], answer: '举头望明月' },
    { q: '“举头望明月”的下一句是？', opts: ['低头思故乡', '疑是地上霜', '床前明月光'], answer: '低头思故乡' },
    { q: '“小娃撑小艇”的下一句是？', opts: ['偷采白莲回', '不解藏踪迹', '浮萍一道开'], answer: '偷采白莲回' },
    { q: '“偷采白莲回”的下一句是？', opts: ['不解藏踪迹', '浮萍一道开', '小娃撑小艇'], answer: '不解藏踪迹' },
    { q: '“不解藏踪迹”的下一句是？', opts: ['浮萍一道开', '偷采白莲回', '小娃撑小艇'], answer: '浮萍一道开' },
    { q: '“碧玉妆成一树高”的下一句是？', opts: ['万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'], answer: '万条垂下绿丝绦' },
    { q: '“万条垂下绿丝绦”的下一句是？', opts: ['不知细叶谁裁出', '二月春风似剪刀', '碧玉妆成一树高'], answer: '不知细叶谁裁出' },
    { q: '“不知细叶谁裁出”的下一句是？', opts: ['二月春风似剪刀', '万条垂下绿丝绦', '碧玉妆成一树高'], answer: '二月春风似剪刀' },
    { q: '“头上红冠不用裁”的下一句是？', opts: ['满身雪白走将来', '平生不敢轻言语', '一叫千门万户开'], answer: '满身雪白走将来' },
    { q: '“满身雪白走将来”的下一句是？', opts: ['平生不敢轻言语', '一叫千门万户开', '头上红冠不用裁'], answer: '平生不敢轻言语' },
    { q: '“平生不敢轻言语”的下一句是？', opts: ['一叫千门万户开', '满身雪白走将来', '头上红冠不用裁'], answer: '一叫千门万户开' },
    { q: '“锄禾日当午”的下一句是？', opts: ['汗滴禾下土', '谁知盘中餐', '粒粒皆辛苦'], answer: '汗滴禾下土' },
    { q: '“白毛浮绿水”的下一句是？', opts: ['红掌拨清波', '曲项向天歌', '鹅鹅鹅'], answer: '红掌拨清波' }
  ];

  // 语文：口语交际（礼貌用语·情景应答）
  var kouyu = [
    { q: '在学校见到老师，应该说什么？', opts: ['老师好', '你好坏', '再见'], answer: '老师好' },
    { q: '同学借给你橡皮，你应该说什么？', opts: ['谢谢', '对不起', '没关系'], answer: '谢谢' },
    { q: '不小心撞到同学，应该说什么？', opts: ['对不起', '谢谢', '你好'], answer: '对不起' },
    { q: '同学说“对不起”，你应该回答？', opts: ['没关系', '不客气', '谢谢'], answer: '没关系' },
    { q: '老师夸你真棒，你应该说什么？', opts: ['谢谢老师', '我不好', '再见'], answer: '谢谢老师' },
    { q: '客人要走了，你应该说什么？', opts: ['再见', '你好', '谢谢'], answer: '再见' },
    { q: '想借同学的笔，应该怎么说？', opts: ['请把笔借我好吗', '给我笔', '你的笔'], answer: '请把笔借我好吗' },
    { q: '早上见到小伙伴，应该说什么？', opts: ['早上好', '晚上好', '晚安'], answer: '早上好' },
    { q: '想问别人问题，先说什么？', opts: ['请问', '喂', '哎'], answer: '请问' },
    { q: '过生日收到礼物，应该说什么？', opts: ['谢谢', '不用', '不好'], answer: '谢谢' },
    { q: '看到长辈，应该主动说？', opts: ['爷爷奶奶好', '你好坏', '再见'], answer: '爷爷奶奶好' },
    { q: '和小朋友分享玩具，应该说什么？', opts: ['我们一起玩吧', '给我玩', '不给你'], answer: '我们一起玩吧' }
  ];

  // 数学：解决问题（图文应用题）
  var SOLVE = [
    function () { var a = rand(3, 7), b = rand(3, 7); return { q: '左边有 <b>' + a + '</b> 个🍎，右边有 <b>' + b + '</b> 个🍎，一共几个？', ans: a + b }; },
    function () { var a = rand(8, 15), b = rand(3, 6); return { q: '盘子里有 <b>' + a + '</b> 颗草莓🍓，小红吃了 <b>' + b + '</b> 颗，还剩几颗？', ans: a - b }; },
    function () { var a = rand(4, 9), b = rand(2, 5); return { q: '哥哥有 <b>' + a + '</b> 辆🚗，弟弟有 <b>' + b + '</b> 辆，两人一共几辆？', ans: a + b }; },
    function () { var a = rand(10, 16), b = rand(3, 7); return { q: '树上有 <b>' + a + '</b> 只🐦，飞走了 <b>' + b + '</b> 只，还剩几只？', ans: a - b }; },
    function () { var a = rand(5, 10), b = rand(2, 5); return { q: '小明买了 <b>' + a + '</b> 本📚，小红买了 <b>' + b + '</b> 本，一共几本？', ans: a + b }; },
    function () { var a = rand(7, 12), b = rand(3, 6); return { q: '停车场有 <b>' + a + '</b> 辆车🚙，开走了 <b>' + b + '</b> 辆，还剩几辆？', ans: a - b }; },
    function () { var a = rand(6, 12), b = rand(2, a - 1); return { q: '红气球🎈有 <b>' + a + '</b> 个，蓝气球有 <b>' + b + '</b> 个，红气球比蓝气球多几个？', ans: a - b }; },
    function () { var a = rand(8, 14), b = rand(a + 1, 16); return { q: '小明有 <b>' + a + '</b> 颗糖🍬，小红有 <b>' + b + '</b> 颗，小红比小明多几颗？', ans: b - a }; }
  ];

  /* ============================================================
   * 关卡定义（41 关）
   * ============================================================ */
  var LEVELS = [
    // 语文 14 关
    { id: 'yw1', subject: 'yuwen', name: '拼音拼读', icon: '🔤', desc: '复韵母·鼻韵母·整体认读', make: function (n) {
        var pool = pinyinFu.concat(zhengti);
        return pick(pool, n).map(function (t) { return { q: '“<b>' + t.ch + '</b>” 读哪个音？', options: t.opts, answer: t.py, speak: t.ch, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw2', subject: 'yuwen', name: '看拼音选字', icon: '🔡', desc: '拼音 → 汉字', make: function (n) {
        return pick(readChar, n).map(function (t) { return { q: '“<b>' + t.py + '</b>” 是哪个字？', options: t.opts, answer: t.zi, speak: t.zi, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw3', subject: 'yuwen', name: '看字选拼音', icon: '🀄', desc: '汉字 → 拼音', make: function (n) {
        // 干扰项取自池内其它真实音节（readChar 的 py 已唯一），避免"照着字形选同一个字"的送分题
        return pick(readChar, n).map(function (t) {
          var others = shuffle(readChar.filter(function (x) { return x.py !== t.py; }).map(function (x) { return x.py; })).slice(0, 2);
          return { q: '这个字念什么？', sub: '<span class="big-emoji">【' + t.zi + '】</span>', options: shuffle([t.py].concat(others)), answer: t.py, speak: t.zi, speakLang: 'zh-CN' };
        });
      } },
    { id: 'yw4', subject: 'yuwen', name: '反义词', icon: '🔄', desc: '大对小·多对少', make: function (n) {
        return pick(fanyi, n).map(function (t) { return { q: '“<b>' + t.a + '</b>” 的反义词是？', options: t.opts, answer: t.b, speak: t.a + '的反义词是' + t.b, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw5', subject: 'yuwen', name: '古诗填空', icon: '📜', desc: '一年级必背古诗', make: function (n) {
        return pick(gushi, n).map(function (t) { return { q: t.q, options: t.opts, answer: t.w, speak: t.w, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw6', subject: 'yuwen', name: '词语认读', icon: '📚', desc: '看图选词语', make: function (n) {
        return pick(words, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> 这是？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw7', subject: 'yuwen', name: '笔画笔顺', icon: '✍️', desc: '一个字有几画', make: function (n) {
        return pick(bihua, n).map(function (t) {
          var pool = [t.n - 2, t.n - 1, t.n + 1, t.n + 2].filter(function (x) { return x >= 1 && x !== t.n; });
          var opts = [t.n].concat(shuffle(pool).slice(0, 2));
          return { q: '“<b>' + t.zi + '</b>” 字一共有几画？', options: shuffle(opts).map(String), answer: String(t.n), speak: t.zi + '共' + t.n + '画', speakLang: 'zh-CN' };
        });
      } },
    { id: 'yw8', subject: 'yuwen', name: '形近字', icon: '🔍', desc: '木还是目？', make: function (n) {
        return pick(xingjin, n).map(function (t) { return { q: t.q, sub: '<span class="big-emoji">' + t.e + '</span>', options: t.opts, answer: t.answer, speak: t.answer, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw9', subject: 'yuwen', name: '声调辨别', icon: '🔊', desc: '几声·第几声', make: function (n) {
        return pick(shengdiao, n).map(function (t) {
          var allT = ['一声', '二声', '三声', '四声'];
          var opts = shuffle(allT.filter(function (x) { return x !== t.t; }).slice(0, 2).concat([t.t]));
          return { q: '“<b>' + t.ch + '</b>”（' + t.py + '）是第几声？', options: opts, answer: t.t, speak: t.ch, speakLang: 'zh-CN' };
        });
      } },
    { id: 'yw10', subject: 'yuwen', name: '词语搭配', icon: '🧩', desc: '大大的什么？', make: function (n) {
        return pick(peitao, n).map(function (t) { return { q: t.a + '（ &nbsp; ）', options: shuffle(t.opts), answer: t.b, speak: t.a + t.b, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw11', subject: 'yuwen', name: '量词', icon: '🔢', desc: '一头牛·一朵花', make: function (n) {
        return pick(liangci, n).map(function (t) { return { q: '一（ &nbsp; ）' + t.n, options: shuffle(t.opts), answer: t.l, speak: t.l + t.n, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw12', subject: 'yuwen', name: '偏旁部首', icon: '🧱', desc: '河·氵', make: function (n) {
        return pick(pianpang, n).map(function (t) { return { q: '“<b>' + t.zi + '</b>” 的偏旁是？', options: shuffle(t.opts), answer: t.bu, speak: t.zi + '的偏旁是' + t.bu, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw13', subject: 'yuwen', name: '诗句接龙', icon: '📜', desc: '古诗接上下句', make: function (n) {
        return pick(gushiXuan, n).map(function (t) { return { q: t.q, options: shuffle(t.opts), answer: t.answer, speak: t.answer, speakLang: 'zh-CN' }; });
      } },
    { id: 'yw14', subject: 'yuwen', name: '口语交际', icon: '💬', desc: '礼貌用语应答', make: function (n) {
        return pick(kouyu, n).map(function (t) { return { q: t.q, options: shuffle(t.opts), answer: t.answer, speak: t.answer, speakLang: 'zh-CN' }; });
      } },

    // 数学 15 关
    { id: 'sx1', subject: 'shuxue', name: '数一数', icon: '🔢', desc: '1~20 数感', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(countQ()); return r; } },
    { id: 'sx2', subject: 'shuxue', name: '比大小', icon: '⚖️', desc: '多少·大小比较', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(compareQ()); return r; } },
    { id: 'sx3', subject: 'shuxue', name: '10以内加减', icon: '➕', desc: '加减入门', make: function (n) { var r = [], seen = {}; while (r.length < n) { var q = addSubQ(10); var k = String(q.q) + '@' + q.answer; if (!seen[k]) { seen[k] = 1; r.push(q); } } return r; } },
    { id: 'sx4', subject: 'shuxue', name: '凑十法', icon: '🔟', desc: '10 的组成', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(makeTenQ()); return r; } },
    { id: 'sx5', subject: 'shuxue', name: '进位加法', icon: '🧮', desc: '20以内进位加', make: function (n) { var r = [], seen = {}; while (r.length < n) { var q = carryAddQ(); var k = String(q.q) + '@' + q.answer; if (!seen[k]) { seen[k] = 1; r.push(q); } } return r; } },
    { id: 'sx6', subject: 'shuxue', name: '退位减法', icon: '➖', desc: '20以内退位减', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(borrowSubQ()); return r; } },
    { id: 'sx7', subject: 'shuxue', name: '认识人民币', icon: '💰', desc: '元·角·分', make: function (n) {
        var bank = [
          { q: '1 元 = ? 角', ans: '10', opts: ['10', '100', '1'] },
          { q: '1 角 = ? 分', ans: '10', opts: ['10', '100', '1'] },
          { q: '2 元 = ? 角', ans: '20', opts: ['20', '2', '200'] },
          { q: '5 角 = ? 分', ans: '50', opts: ['50', '5', '500'] },
          { q: '10 角 = ? 元', ans: '1', opts: ['1', '10', '100'] },
          { q: '1 元 = ? 分', ans: '100', opts: ['100', '10', '1'] }
        ];
        return pickN(bank, n).map(function (t) {
          if (Math.random() < 0.5) {
            var a = rand(1, 10), b = rand(1, 10), correct = a + b, opts = [correct];
            while (opts.length < 3) { var d = correct + rand(-2, 2); if (d >= 1 && d <= 20 && opts.indexOf(d) === -1) opts.push(d); }
            return { q: a + ' 元 + ' + b + ' 元 = ? 元', options: shuffle(opts.map(String)), answer: String(correct), speak: correct + '元', speakLang: 'zh-CN' };
          }
          return { q: t.q, options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' };
        });
      } },
    { id: 'sx8', subject: 'shuxue', name: '认识钟表', icon: '🕐', desc: '整点认读', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(clockQ()); return r; } },
    { id: 'sx9', subject: 'shuxue', name: '认识图形', icon: '🔷', desc: '平面·立体图形', make: function (n) {
        var pool = SHAPES.map(function (t) { return { sub: t.svg, name: t.name, opts: t.opts }; }).concat(SHAPES3D.map(function (t) { return { sub: '<span class="big-emoji">' + t.emoji + '</span>', name: t.name, opts: t.opts }; }));
        return pick(pool, n).map(function (t) { return { q: '这是什么形状？', sub: t.sub, options: t.opts, answer: t.name, speak: t.name, speakLang: 'zh-CN' }; });
      } },
    { id: 'sx10', subject: 'shuxue', name: '找规律', icon: '🔁', desc: '数字·图形规律', make: function (n) {
        var pool = numPatterns.map(function (t) { return { q: '找规律，? 处应该填什么？', sub: '<div class="pattern">' + t.seq + '</div>', options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' }; })
          .concat(emojiPatterns.map(function (t) { return { q: '找规律，? 处应该放什么？', sub: '<div class="pattern">' + t.seq + '</div>', options: t.opts, answer: t.ans, speak: t.ans, speakLang: 'zh-CN' }; }));
        return pickN(pool, n);
      } },
    { id: 'sx11', subject: 'shuxue', name: '100以内读数', icon: '🔭', desc: '21~100 怎么读', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(read100Q()); return r; } },
    { id: 'sx12', subject: 'shuxue', name: '100以内比大小', icon: '📏', desc: '几十和几十比', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(cmp100Q()); return r; } },
    { id: 'sx13', subject: 'shuxue', name: '分类整理', icon: '🗂️', desc: '数出同类有几个', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(classifyQ()); return r; } },
    { id: 'sx14', subject: 'shuxue', name: '看图列式', icon: '🧮', desc: '应用题·图文', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(applyQ()); return r; } },
    { id: 'sx15', subject: 'shuxue', name: '解决问题', icon: '🧩', desc: '图文应用题', make: function (n) { var r = []; for (var i = 0; i < n; i++) { var t = SOLVE[rand(0, SOLVE.length - 1)](); var correct = String(t.ans); var opts = [correct]; while (opts.length < 3) { var d = String(t.ans + rand(-3, 3)); if (opts.indexOf(d) === -1 && d !== correct && parseInt(d, 10) >= 0) opts.push(d); } r.push({ q: t.q, options: shuffle(opts), answer: correct, speak: correct, speakLang: 'zh-CN' }); } return r; } },

    // 英语 12 关
    { id: 'yy1', subject: 'yingyu', name: '字母认读', icon: '🔠', desc: '听音选字母', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(letterQ()); return r; } },
    { id: 'yy2', subject: 'yingyu', name: '大小写配对', icon: '🅰️', desc: '给大写找小写', make: function (n) { var r = []; for (var i = 0; i < n; i++) r.push(caseQ()); return r; } },
    { id: 'yy3', subject: 'yingyu', name: '主题词汇', icon: '🦁', desc: '颜色·动物·身体·食物·学校', make: function (n) { return pick(vocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy4', subject: 'yingyu', name: '数字单词', icon: '🔟', desc: 'one two three', make: function (n) { return pick(numbers, n).map(function (t) { return { q: '数字 <b>' + t.e + '</b> 用英语怎么说？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy5', subject: 'yingyu', name: '自然拼读', icon: '🔤', desc: 'CVC 简单词', make: function (n) { return pick(cvc, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> 是哪个词？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy6', subject: 'yingyu', name: '简单句型', icon: '💬', desc: '选词填空', make: function (n) { return pick(sentence, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.q, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy7', subject: 'yingyu', name: '家庭成员', icon: '👨‍👩‍👧', desc: '爸爸妈妈爷爷奶奶', make: function (n) { return pick(family, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn + ' 用英语怎么说？', options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy8', subject: 'yingyu', name: '问候语', icon: '👋', desc: 'Hello / Thank you', make: function (n) { return pick(greet, n).map(function (t) { return { q: t.q, options: t.opts, answer: t.answer, speak: t.speak, speakLang: t.speakLang }; }); } },
    { id: 'yy9', subject: 'yingyu', name: '颜色', icon: '🌈', desc: 'red·blue·green', make: function (n) { return pick(colorVocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy10', subject: 'yingyu', name: '动物', icon: '🐾', desc: 'cat·dog·lion', make: function (n) { return pick(animalVocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy11', subject: 'yingyu', name: '身体部位', icon: '🧍', desc: 'hand·head·eye', make: function (n) { return pick(bodyVocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } },
    { id: 'yy12', subject: 'yingyu', name: '食物', icon: '🍔', desc: 'apple·milk·bread', make: function (n) { return pick(foodVocab, n).map(function (t) { return { q: '<span class="big-emoji">' + t.e + '</span> ' + t.cn, options: t.opts, answer: t.w, speak: t.w, speakLang: 'en-US' }; }); } }
  ];

  /* ============================================================
   * 奖励体系数据
   * ============================================================ */
  var PET_STAGES = [
    { need: 0,   name: '恐龙蛋', emoji: '🥚', desc: '答对题赚金币，把它孵出来！' },
    { need: 15,  name: '破壳啦', emoji: '🐣', desc: '小家伙探出头来啦～' },
    { need: 40,  name: '小恐龙', emoji: '🦖', desc: '会蹦会跳，超可爱！' },
    { need: 80,  name: '大恐龙', emoji: '🦕', desc: '越长越大，越来越神气！' },
    { need: 150, name: '恐龙王', emoji: '👑', desc: '戴上王冠，成为森林之王！' },
    { need: 250, name: '神龙', emoji: '🐉', desc: '飞起来啦！你是最强的饲养员！' }
  ];

  var RANKS = [
    { min: 0,  name: '学习小萌芽', emoji: '🌱' },
    { min: 12, name: '闯关小学徒', emoji: '📚' },
    { min: 24, name: '智慧小达人', emoji: '⭐' },
    { min: 36, name: '全能小状元', emoji: '🎓' },
    { min: 48, name: '超级小学霸', emoji: '👑' },
    { min: 60, name: '学习小英雄', emoji: '🏆' }
  ];

  var ACHIEVEMENTS = [
    { id: 'first', name: '初来乍到', icon: '👋', desc: '完成任意一关', check: function (s) { return s.playedLevels >= 1; } },
    { id: 'star10', name: '十星小达人', icon: '🌟', desc: '累计获得 10 颗星', check: function (s) { return s.totalStars >= 10; } },
    { id: 'star20', name: '二十星高手', icon: '✨', desc: '累计获得 20 颗星', check: function (s) { return s.totalStars >= 20; } },
    { id: 'star40', name: '四十星大神', icon: '⭐', desc: '累计获得 40 颗星', check: function (s) { return s.totalStars >= 40; } },
    { id: 'yuwen', name: '语文小状元', icon: '📖', desc: '语文全部满星', check: function (s) { return s.subjectMax.yuwen; } },
    { id: 'shuxue', name: '数学小能手', icon: '🧮', desc: '数学全部满星', check: function (s) { return s.subjectMax.shuxue; } },
    { id: 'yingyu', name: '英语小专家', icon: '🔤', desc: '英语全部满星', check: function (s) { return s.subjectMax.yingyu; } },
    { id: 'full', name: '全科制霸', icon: '🏆', desc: '语文·数学·英语都有星星', check: function (s) { return s.subjectHas.yuwen && s.subjectHas.shuxue && s.subjectHas.yingyu; } },
    { id: 'perfect', name: '满分神童', icon: '💯', desc: '任意一关全对（3 星）', check: function (s) { return s.hasPerfect; } },
    { id: 'combo5', name: '连击高手', icon: '🔥', desc: '单关连对 5 题', check: function (s) { return s.hasCombo5; } },
    { id: 'coin50', name: '小小富翁', icon: '💰', desc: '累计 50 金币', check: function (s) { return s.coins >= 50; } },
    { id: 'dragon', name: '恐龙饲养员', icon: '🐉', desc: '把宠物养成最终形态', check: function (s) { return s.petMax; } },
    { id: 'streak3', name: '坚持不懈', icon: '📅', desc: '连续学习 3 天', check: function (s) { return s.streak >= 3; } },
    { id: 'streak7', name: '习惯养成', icon: '🗓️', desc: '连续学习 7 天', check: function (s) { return s.streak >= 7; } },
    { id: 'correct100', name: '百发百中', icon: '🎯', desc: '累计答对 100 题', check: function (s) { return s.correctCount >= 100; } }
  ];

  /* 一年级内容统一标记为 grade:1，并按科目拆进各自的关卡池 */
  LEVELS.forEach(function (l) { if (!l.grade) l.grade = 1; });
  var G1_YW = LEVELS.filter(function (l) { return l.subject === 'yuwen'; });
  var G1_SX = LEVELS.filter(function (l) { return l.subject === 'shuxue'; });
  var G1_YY = LEVELS.filter(function (l) { return l.subject === 'yingyu'; });
  window.YW_LEVELS = (window.YW_LEVELS || []).concat(G1_YW);
  window.SX_LEVELS = (window.SX_LEVELS || []).concat(G1_SX);
  window.YY_LEVELS = (window.YY_LEVELS || []).concat(G1_YY);

  /* 共享核心：科目 / 宠物 / 称号 / 常量（成就由各年级动态生成，不放这里） */
  window.APP_CORE = {
    subjects: [
      { id: 'yuwen', name: '语文', icon: '📖', color: '#e8543f', desc: '拼音 · 识字 · 古诗' },
      { id: 'shuxue', name: '数学', icon: '🧮', color: '#2f80c9', desc: '加减 · 人民币 · 钟表' },
      { id: 'yingyu', name: '英语', icon: '🔤', color: '#2fa35b', desc: '字母 · 词汇 · 问候' }
    ],
    petStages: PET_STAGES,
    ranks: RANKS,
    PER_ROUND: 5,        // 每关题目数
    COIN_PER_RIGHT: 1    // 每答对 1 题奖励金币
  };
})();
