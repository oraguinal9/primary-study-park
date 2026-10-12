/* ============================================================
 * 拼音 + 英文字母 描红数据
 * 说明：Latin 字母没有现成的"笔顺骨架"数据，因此书写判定改为
 *   “字体遮罩覆盖率”——把目标字母渲染成浅色虚影，孩子描的时候
 *   统计覆盖到的笔画像素比例，≥ 阈值即算写好。无需逐字手绘路径。
 * ============================================================ */
(function () {
  var PINYIN_DANYUNMU = ['a', 'o', 'e', 'i', 'u', 'ü'];
  var PINYIN_SHENGMU = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'r', 'y', 'w', 'zh', 'ch', 'sh'];
  var EN_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var EN_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  window.LATIN_GROUPS = [
    { icon: '🔤', name: '拼音 · 单韵母', cat: 'pinyin', chars: PINYIN_DANYUNMU },
    { icon: '🔡', name: '拼音 · 声母', cat: 'pinyin', chars: PINYIN_SHENGMU },
    { icon: '🔠', name: '英语 · 小写', cat: 'english', chars: EN_LOWER },
    { icon: '🔡', name: '英语 · 大写', cat: 'english', chars: EN_UPPER }
  ];
})();
