/* 把 9 个 JS 内联进 index.html，生成单文件即开版 */
var fs = require('fs'), path = require('path');
var dir = __dirname;
var html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
var files = ['data_g1.js', 'data_yw_26.js', 'data_sx_26.js', 'data_yy_26.js', 'data_yxqj.js', 'plan.js', 'hanzi.js', 'latin.js', 'app.js', 'writing.js'];

files.forEach(function (f) {
  var code = fs.readFileSync(path.join(dir, f), 'utf8');
  var tag = '<script src="' + f + '"></script>';
  if (html.indexOf(tag) < 0) throw new Error('index.html 里没找到 ' + tag);
  // 防止代码里的 </script> 提前结束脚本块
  var safe = code.replace(/<\/script>/gi, '<\\/script>');
  html = html.replace(tag, '<script>\n' + safe + '\n</script>');
});

var out = path.join(dir, '..', '小学学习乐园.html');
fs.writeFileSync(out, html, 'utf8');
console.log('✅ 已生成：' + out);
console.log('   大小：' + (fs.statSync(out).size / 1024).toFixed(1) + ' KB');
console.log('   内联文件：' + files.join(', '));
