/* ============================================================
 * 二年级 ~ 六年级 · 数学（苏教版）闯关关卡
 * 由本文件追加到 window.SX_LEVELS
 * 每题结构：{ q, options, answer, speak?, speakLang? }
 * 约定：所有算式答案都由代码实时计算，干扰项取
 *       「±1 / 忘进位退位 / 忘除 2 / 交换两数 / 凑整 / 点错小数点」等易错值。
 * ============================================================ */
window.SX_LEVELS = window.SX_LEVELS || [];
(function () {
  function shuffle(a){var b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t;}return b;}
  /* 无放回取恰好 n 个：先打乱取前 n，池不足时循环补足，保证返回 n 项且前 pool.length 项互不重复 */
  function pickN(pool, n){var base=shuffle(pool), out=[];for(var i=0;i<n;i++)out.push(base[i % base.length]);return out;}
  function rand(mn,mx){return Math.floor(Math.random()*(mx-mn+1))+mn;}
  function uniq(arr){var s={},o=[];arr.forEach(function(x){if(!s[x]){s[x]=1;o.push(x);}});return o;}

  /* 生成选项：保证正确答案一定在选项里、且选项互不重复；distractors 给几个易错干扰项 */
  function opts(ans, distractors, n){
    var want = n || 4, A = String(ans);
    var d = uniq(distractors.map(String)).filter(function(x){ return x !== A; }).slice(0, want - 1);
    var k = 1;
    while (d.length < want - 1) {                 // 数值型兜底补齐，保证不重复
      var cand = (A !== '' && isFinite(Number(A)))
        ? String(Math.round((Number(A) + k) * 1000) / 1000)   // round 掉浮点误差
        : (A + '（' + k + '）');
      if (cand !== A && d.indexOf(cand) < 0) d.push(cand);
      if (++k > 99) break;
    }
    return shuffle([A].concat(d));
  }
  /* 文字型答案（方向、单位、名称、分数……）：干扰项必须自带，至少给 1 个 */
  function optsT(ans, distractors, n){
    var want = n || 4, A = String(ans);
    var d = uniq(distractors.map(String)).filter(function(x){ return x !== A; }).slice(0, want - 1);
    return shuffle([A].concat(d));
  }
  /* 题库项 -> 题目；a 为 number 用 opts，为 string 用 optsT */
  function bankQ(t){
    var A = String(t.a);
    var o = (typeof t.a === 'number') ? opts(t.a, t.d, 4) : optsT(A, t.d, 4);
    var res = { q: t.q, options: o, answer: A };
    if (t.s) { res.speak = t.s; res.speakLang = 'zh-CN'; }
    return res;
  }
  function pickOne(arr){ return arr[rand(0, arr.length - 1)]; }

  /* ---------- 数与式工具 ---------- */
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a;}
  function fracStr(p,q){ var g=gcd(p,q)||1; var x=p/g, y=q/g; return y===1 ? String(x) : (x+'/'+y); }
  /* 分数选项：用「分子+k / 分母+k」补齐，保证一定有 3 个互不相同的干扰项 */
  function fracOpts(p,q,extra){
    var ans=fracStr(p,q), cand=(extra||[]).slice();
    for(var k=1;k<=6;k++){ cand.push(fracStr(p+k,q)); cand.push(fracStr(p,q+k)); }
    return optsT(ans,cand,4);
  }
  function ratioStr(a,b){ var g=gcd(a,b)||1; return (a/g)+':'+(b/g); }
  function ratioOpts(a,b,extra){
    var g=gcd(a,b)||1, x=a/g, y=b/g, ans=x+':'+y, cand=(extra||[]).slice();
    cand.push(y+':'+x);
    for(var k=1;k<=6;k++){ cand.push((x+k)+':'+y); cand.push(x+':'+(y+k)); }
    return optsT(ans,cand,4);
  }
  /* 小数保留 3 位并去掉浮点误差 */
  function fmt(x){ return String(Math.round(x*1000)/1000); }
  /* 小数题的通用干扰项：点错小数点、±0.1、±1（全部为正数） */
  function decD(ans){
    var d=[fmt(ans*10), fmt(ans/10), fmt(ans+0.1), fmt(ans+0.2), fmt(ans+1)];
    if(ans-0.1>0) d.unshift(fmt(ans-0.1));
    return d;
  }

  var CN_D = ['零','一','二','三','四','五','六','七','八','九'];
  function cn4(num){                             // 0 ~ 9999 读法
    if(num===0) return '零';
    var s=String(num), L=s.length, u=['','十','百','千'], out='', zero=false;
    for(var i=0;i<L;i++){
      var d=+s.charAt(i);
      if(d===0){ zero=true; }
      else { if(zero && out) out+='零'; zero=false; out+=CN_D[d]+u[L-1-i]; }
    }
    return out;
  }
  function cn8(num){                             // 万级 / 亿级读法
    if(num<10000) return cn4(num);
    if(num>=100000000){
      var y=Math.floor(num/100000000), rest=num%100000000, s0=cn4(y)+'亿';
      if(rest===0) return s0;
      if(rest<10000000) s0+='零';
      return s0+cn8(rest);
    }
    var w=Math.floor(num/10000), l=num%10000, s=cn4(w)+'万';
    if(l===0) return s;
    if(l<1000) s+='零';
    return s+cn4(l);
  }
  function kou(p){                                // 乘法口诀里的数：12 -> 十二，10 -> 一十
    if(p<10) return CN_D[p];
    if(p===10) return '一十';
    return cn4(p).replace(/^一十/,'十');
  }
  function cnDec(x){                             // 小数读法：3.06 -> 三点零六
    var p=String(x).split('.'), head=cn4(Number(p[0]));
    if(p.length<2) return head;
    var tail='';
    for(var i=0;i<p[1].length;i++) tail+=CN_D[+p[1].charAt(i)];
    return head+'点'+tail;
  }

  /* ---------- 新增题型辅助：文字应用题 / 判断选择 ---------- */
  function wordQ(build){
    // build(): 返回 { q, a, d, n, speak }
    //   q: 题干（可含 HTML）；a: 正确答案（数字或字符串）；
    //   d: 干扰项数组；n: 选项数（默认 4）；speak: 自定义朗读（默认取题干）
    var o = build(), A = String(o.a);
    var ops = (typeof o.a === 'number') ? opts(o.a, o.d || [], o.n || 4)
                                        : optsT(A, o.d || [], o.n || 4);
    return { q:o.q, options:ops, answer:A,
             speak:o.speak || String(o.q).replace(/<[^>]+>/g, ''), speakLang:'zh-CN' };
  }
  function judgeQ(q, correct, distractors, n){
    // 判断/选择：给陈述句，选项默认“对/错”，答案正确
    var A = String(correct);
    return { q:q, options:optsT(A, distractors || [], n || 2), answer:A,
             speak:q, speakLang:'zh-CN' };
  }

  window.SX_LEVELS = (window.SX_LEVELS||[]).concat([

    /* ==================== 二年级（7 关） ==================== */
    { id:'sx2_01', subject:'shuxue', grade:2, name:'表内乘法', icon:'✖️', desc:'2~9 的乘法口诀',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var a=rand(2,9), b=rand(2,9), p=a*b, t=rand(0,2);
          if(t===0){
            r.push({ q:'<b>'+a+' × '+b+' = （ ）</b>',
              options:opts(p,[p+a,p-a,p+b,p-b,p+1],4), answer:String(p),
              speak:a+'乘'+b+'等于'+p, speakLang:'zh-CN' });
          } else if(t===1){
            r.push({ q:'<b>'+a+' × （ ） = '+p+'</b>',
              options:opts(b,[b+1,b-1,a,b+2],4), answer:String(b) });
          } else {
            var big=Math.max(a,b), sml=Math.min(a,b), ansCn=kou(p);
            var de=(p<10)?'得':'';
            r.push({ q:'乘法口诀「'+CN_D[sml]+CN_D[big]+de+'（ ）」',
              options:optsT(ansCn,[kou(p+big),kou(p-big),kou(p+1),kou(p-1)],4), answer:ansCn,
              speak:CN_D[sml]+CN_D[big]+de+ansCn, speakLang:'zh-CN' });
          }
        }
        return r;
      } },

    { id:'sx2_02', subject:'shuxue', grade:2, name:'表内除法', icon:'➗', desc:'用口诀求商',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(2,9), q=rand(2,9), a=b*q, t=rand(0,2);
          if(t===0){
            r.push({ q:'<b>'+a+' ÷ '+b+' = （ ）</b>',
              options:opts(q,[q+1,q-1,q+2,b],4), answer:String(q),
              speak:a+'除以'+b+'等于'+q, speakLang:'zh-CN' });
          } else if(t===1){
            r.push({ q:'<b>'+a+' ÷ （ ） = '+q+'</b>',
              options:opts(b,[b+1,b-1,b+2,q],4), answer:String(b) });
          } else {
            r.push({ q:'把 '+a+' 个苹果平均分成 '+b+' 份，每份有（ ）个。',
              options:opts(q,[q+1,q-1,a-b,q+2],4), answer:String(q) });
          }
        }
        return r;
      } },

    { id:'sx2_03', subject:'shuxue', grade:2, name:'有余数除法', icon:'🍬', desc:'余数一定比除数小',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(3,9), q=rand(2,9), rr=rand(1,b-1), a=b*q+rr, t=rand(0,2);
          if(t===0){
            r.push({ q:'<b>'+a+' ÷ '+b+' = '+q+' …… （ ）</b>',
              options:opts(rr,[rr+1,rr+2,rr-1,b],4), answer:String(rr) });
          } else if(t===1){
            r.push({ q:'<b>'+a+' ÷ '+b+'</b> 的商是（ ）',
              options:opts(q,[q+1,q-1,q+2,rr],4), answer:String(q) });
          } else {
            r.push({ q:'把 '+a+' 根小棒每 '+b+' 根分一堆，可以分成 '+q+' 堆，还剩（ ）根。',
              options:opts(rr,[rr+1,rr+2,rr-1,b],4), answer:String(rr) });
          }
        }
        return r;
      } },

    { id:'sx2_04', subject:'shuxue', grade:2, name:'时分秒', icon:'⏰', desc:'认识钟面 · 单位换算',
      make:function(n){
        var bank=[
          { q:'分针走一圈是（ ）分。', a:60, d:[12,30,100,6] },
          { q:'秒针走一圈是（ ）秒。', a:60, d:[12,30,100,6] },
          { q:'半小时是（ ）分。', a:30, d:[60,15,50,6] },
          { q:'钟面上一共有（ ）个大格。', a:12, d:[60,24,6,10] },
          { q:'钟面上一共有（ ）个小格。', a:60, d:[12,24,30,100] },
          { q:'时针走 1 大格是（ ）时。', a:1, d:[5,12,60,2] },
          { q:'分针走 1 大格是（ ）分。', a:5, d:[1,12,60,15] },
          { q:'分针从数字 12 走到数字 3，经过了（ ）分。', a:15, d:[3,30,20,60] },
          { q:'1 时 30 分 = （ ）分。', a:90, d:[130,60,100,70] },
          { q:'跑 50 米大约要 12（ ）。', a:'秒', d:['分','时','天'] },
          { q:'一节课大约上 40（ ）。', a:'分', d:['秒','时','天'] },
          { q:'小明晚上睡觉大约睡 9（ ）。', a:'时', d:['分','秒','天'] },
          { q:'钟面上，又细又长、走得最快的针是（ ）。', a:'秒针', d:['时针','分针','大格'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var x=rand(2,5), a1=x*60;
            r.push({ q:x+' 时 = （ ）分。', options:opts(a1,[x*6,x*10,a1+60,a1-60],4), answer:String(a1) });
          } else if(t===1){ var y=rand(2,9), a2=y*60;
            r.push({ q:y+' 分 = （ ）秒。', options:opts(a2,[y*6,y*10,a2+60,a2-60],4), answer:String(a2) });
          } else if(t===2){ var z=rand(2,6), a3=z*60;
            r.push({ q:a3+' 分 = （ ）时。', options:opts(z,[a3,z*10,z+1,z-1],4), answer:String(z) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx2_05', subject:'shuxue', grade:2, name:'认识方向', icon:'🧭', desc:'东南西北 · 八个方向',
      make:function(n){
        var four=['北','东','南','西'];                 // 顺时针排列
        var eight=['东','南','西','北','东北','东南','西北','西南'];
        var opp={ '东':'西','西':'东','南':'北','北':'南','东北':'西南','西南':'东北','东南':'西北','西北':'东南' };
        var fixed=[
          { q:'早晨太阳从（ ）面升起。', a:'东' },
          { q:'傍晚太阳从（ ）面落下。', a:'西' },
          { q:'地图上一般是上北下南，那么右边是（ ）面。', a:'东' },
          { q:'地图上一般是上北下南，那么左边是（ ）面。', a:'西' },
          { q:'晚上看星星，北极星在（ ）面。', a:'北' },
          { q:'东北方向在东面和（ ）面的中间。', a:'北' },
          { q:'西南方向在西面和（ ）面的中间。', a:'南' },
          { q:'常州在南京的东南面，那么南京在常州的（ ）面。', a:'西北' }
        ];
        function dirOpts(ans){
          return optsT(ans, shuffle(eight.filter(function(x){ return x!==ans; })).slice(0,3), 4);
        }
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            var k=rand(0,3), sd=rand(0,2), nm=['右手边','后面','左手边'][sd];
            var ans=four[(k+[1,2,3][sd])%4];
            r.push({ q:'小明面向'+four[k]+'面站着，他的'+nm+'是（ ）面。', options:dirOpts(ans), answer:ans });
          } else if(t===1){
            var d1=eight[rand(0,7)], a2=opp[d1];
            r.push({ q:'和'+d1+'相对的方向是（ ）。', options:dirOpts(a2), answer:a2 });
          } else {
            var f=pickOne(fixed);
            r.push({ q:f.q, options:dirOpts(f.a), answer:f.a });
          }
        }
        return r;
      } },

    { id:'sx2_06', subject:'shuxue', grade:2, name:'万以内数的认识', icon:'🔢', desc:'读数 · 组成 · 比大小',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){
            var num=rand(1001,9800), ans=cn4(num);
            r.push({ q:'<b>'+num+'</b> 读作（ ）',
              options:optsT(ans,[cn4(num+1),cn4(num-1),cn4(num+10),cn4(num+100)],4), answer:ans,
              speak:ans, speakLang:'zh-CN' });
          } else if(t===1){
            var q1=rand(1,9), b1=rand(0,9), s1=rand(0,9), g1=rand(0,9);
            var v=q1*1000+b1*100+s1*10+g1;
            r.push({ q:'由 '+q1+' 个千、'+b1+' 个百、'+s1+' 个十、'+g1+' 个一组成的数是（ ）',
              options:opts(v,[q1*1000+b1*100+g1*10+s1, v+10, v-10, v+1],4), answer:String(v) });
          } else if(t===2){
            var num2=rand(1000,9999);
            r.push({ q:'<b>'+num2+'</b> 的最高位是（ ）',
              options:optsT('千位',['百位','十位','个位'],4), answer:'千位' });
          } else if(t===3){
            var num3=rand(1001,9998), back=rand(0,1), ans3=back?num3+1:num3-1;
            r.push({ q:'<b>'+num3+'</b> '+(back?'后面':'前面')+'的一个数是（ ）',
              options:opts(ans3,[num3, back?num3+2:num3-2, ans3+10, ans3+100],4), answer:String(ans3) });
          } else if(t===4){
            var x=rand(1000,9999), y=rand(1000,9999);
            while(y===x){ y=rand(1000,9999); }
            var ans4=(x>y)?'>':'<';
            r.push({ q:x+' ○ '+y+'，○ 里应该填（ ）',
              options:optsT(ans4,['>','<','='].filter(function(s){return s!==ans4;}),3), answer:ans4 });
          } else {
            var num5=rand(1000,9999), ans5=Math.floor(num5/100);
            r.push({ q:'<b>'+num5+'</b> 里面有（ ）个百。',
              options:opts(ans5,[Math.floor(num5/10), Math.floor(num5/1000), ans5+1, ans5-1],4), answer:String(ans5) });
          }
        }
        return r;
      } },

    { id:'sx2_07', subject:'shuxue', grade:2, name:'两三位数加减', icon:'➕', desc:'进位加 · 退位减',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          if(rand(0,1)===0){
            var a=rand(120,600), b=rand(120,999-a), s=a+b;
            r.push({ q:'<b>'+a+' + '+b+' = （ ）</b>',
              options:opts(s,[s-10,s+10,s-100,s-1,s+1],4), answer:String(s) });
          } else {
            var c=rand(300,999), d=rand(101,c-60), m=c-d;
            r.push({ q:'<b>'+c+' − '+d+' = （ ）</b>',
              options:opts(m,[m+10,m-10,m+100,m+1],4), answer:String(m) });
          }
        }
        return r;
      } },

    /* ==================== 三年级（7 关） ==================== */
    { id:'sx3_01', subject:'shuxue', grade:3, name:'两三位数乘一位数', icon:'✖️', desc:'进位乘法',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(2,9), a=(rand(0,1)===0)?rand(12,99):rand(102,499), p=a*b;
          r.push({ q:'<b>'+a+' × '+b+' = （ ）</b>',
            options:opts(p,[p-10,p+10,p-a,p+a,p+1],4), answer:String(p) });
        }
        return r;
      } },

    { id:'sx3_02', subject:'shuxue', grade:3, name:'千克和克', icon:'⚖️', desc:'1 千克 = 1000 克',
      make:function(n){
        var bank=[
          { q:'一个鸡蛋大约重 50（ ）。', a:'克', d:['千克','米','升'] },
          { q:'一袋大米大约重 25（ ）。', a:'千克', d:['克','米','毫升'] },
          { q:'一个西瓜大约重 5（ ）。', a:'千克', d:['克','厘米','毫升'] },
          { q:'一枚 1 元硬币大约重 6（ ）。', a:'克', d:['千克','米','分'] },
          { q:'二年级小朋友体重大约 32（ ）。', a:'千克', d:['克','米','厘米'] },
          { q:'1 千克棉花和 1 千克铁相比，（ ）。', a:'一样重', d:['棉花重','铁重','没法比'] },
          { q:'2000 克和 2 千克相比，（ ）。', a:'一样重', d:['2000 克重','2 千克重','没法比'] },
          { q:'称比较重的物品，一般用（ ）作单位。', a:'千克', d:['克','升','厘米'] },
          { q:'称一枚纽扣的重量，一般用（ ）作单位。', a:'克', d:['千克','升','米'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var x=rand(2,9), a1=x*1000;
            r.push({ q:x+' 千克 = （ ）克。', options:opts(a1,[x*100,x*10,a1+100,a1+10],4), answer:String(a1) });
          } else if(t===1){ var y=rand(2,9), a2=y*1000;
            r.push({ q:a2+' 克 = （ ）千克。', options:opts(y,[y*10,y*100,y+1,y-1],4), answer:String(y) });
          } else if(t===2){ var z=rand(1,8), g=rand(1,9)*100, a3=z*1000+g;
            r.push({ q:z+' 千克 '+g+' 克 = （ ）克。', options:opts(a3,[z*1000,g,a3+100,a3-100],4), answer:String(a3) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx3_03', subject:'shuxue', grade:3, name:'长方形正方形周长', icon:'📐', desc:'(长+宽)×2 · 边长×4',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            var a=rand(4,25), b=rand(2,a-1), p=(a+b)*2;
            r.push({ q:'一个长方形的长是 '+a+' 厘米，宽是 '+b+' 厘米，周长是（ ）厘米。',
              options:opts(p,[a*b,a+b,p+2,p-2,a*2+b],4), answer:String(p) });
          } else if(t===1){
            var c=rand(3,25), p2=c*4;
            r.push({ q:'一个正方形的边长是 '+c+' 厘米，周长是（ ）厘米。',
              options:opts(p2,[c*c,c*2,p2+4,p2-4],4), answer:String(p2) });
          } else if(t===2){
            var e=rand(3,25), p3=e*4;
            r.push({ q:'一个正方形的周长是 '+p3+' 厘米，它的边长是（ ）厘米。',
              options:opts(e,[p3/2,e*2,e+1,e-1],4), answer:String(e) });
          } else {
            var f=rand(5,30), w=rand(2,f-1), p4=(f+w)*2;
            r.push({ q:'一个长方形的周长是 '+p4+' 厘米，宽是 '+w+' 厘米，长是（ ）厘米。',
              options:opts(f,[p4-w,p4/2,f+1,f-1],4), answer:String(f) });
          }
        }
        return r;
      } },

    { id:'sx3_04', subject:'shuxue', grade:3, name:'两三位数除以一位数', icon:'➗', desc:'笔算除法',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(2,9);
          if(rand(0,1)===0){
            var q=rand(11, Math.floor(999/b)), a=b*q;
            r.push({ q:'<b>'+a+' ÷ '+b+' = （ ）</b>',
              options:opts(q,[q+1,q-1,q+10,q-10],4), answer:String(q) });
          } else {
            var q2=rand(11, Math.floor(980/b)), rr=rand(1,b-1), a2=b*q2+rr;
            r.push({ q:'<b>'+a2+' ÷ '+b+'</b> 的余数是（ ）',
              options:opts(rr,[rr+1,rr+2,rr-1,b],4), answer:String(rr) });
          }
        }
        return r;
      } },

    { id:'sx3_05', subject:'shuxue', grade:3, name:'分数初步', icon:'🍰', desc:'几分之一 · 比大小 · 同分母加减',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){
            var a=rand(2,9), b=rand(2,9);
            while(b===a){ b=rand(2,9); }
            var ans=(a<b)?('1/'+a):('1/'+b);
            r.push({ q:'<b>1/'+a+'</b> 和 <b>1/'+b+'</b> 相比，（ ）大。',
              options:optsT(ans,['1/'+a,'1/'+b,'一样大'],3), answer:ans });
          } else if(t===1){
            var c=rand(4,9), p=rand(1,c-1), q2=rand(1,c-1);
            while(q2===p){ q2=rand(1,c-1); }
            var ans1=(p>q2)?(p+'/'+c):(q2+'/'+c);
            r.push({ q:'<b>'+p+'/'+c+'</b> 和 <b>'+q2+'/'+c+'</b> 相比，（ ）大。',
              options:optsT(ans1,[p+'/'+c,q2+'/'+c,'一样大'],3), answer:ans1 });
          } else if(t===2){
            var d1=rand(2,9), p1=rand(1,d1-1), ans2=cn4(d1)+'分之'+cn4(p1);
            var cand=[ cn4(p1)+'分之'+cn4(d1),
                       cn4(d1)+'分之'+cn4(p1+1<d1?p1+1:1),
                       cn4(d1<9?d1+1:2)+'分之'+cn4(p1) ];
            r.push({ q:'<b>'+p1+'/'+d1+'</b> 读作（ ）',
              options:optsT(ans2,cand,4), answer:ans2, speak:ans2, speakLang:'zh-CN' });
          } else if(t===3){
            var k=rand(3,9), ansA='1/'+k;
            r.push({ q:'把一个蛋糕平均分成 '+k+' 份，每份是这个蛋糕的（ ）',
              options:optsT(ansA,['1/'+(k+1),'1/'+(k-1),(k-1)+'/'+k],4), answer:ansA });
          } else {
            var c2=rand(4,9), x1=rand(1,c2-2), y1=rand(1,c2-1-x1), sm=x1+y1;
            var ansB=sm+'/'+c2;
            r.push({ q:'<b>'+x1+'/'+c2+' + '+y1+'/'+c2+' = （ ）</b>',
              options:optsT(ansB,[sm+'/'+(c2*2),(sm+1)+'/'+c2,(sm>1?sm-1:sm+2)+'/'+c2],4), answer:ansB });
          }
        }
        return r;
      } },

    { id:'sx3_06', subject:'shuxue', grade:3, name:'平移旋转轴对称', icon:'🔄', desc:'图形的运动 · 对称轴',
      make:function(n){
        var bank=[
          { q:'推拉抽屉时，抽屉的运动是（ ）。', a:'平移', d:['旋转','轴对称','放大'] },
          { q:'钟面上指针的运动是（ ）。', a:'旋转', d:['平移','轴对称','放大'] },
          { q:'电梯上下运动是（ ）。', a:'平移', d:['旋转','轴对称','缩小'] },
          { q:'风车迎风转动是（ ）。', a:'旋转', d:['平移','轴对称','缩小'] },
          { q:'升国旗时，国旗的运动是（ ）。', a:'平移', d:['旋转','轴对称','放大'] },
          { q:'汽车方向盘的运动是（ ）。', a:'旋转', d:['平移','轴对称','缩小'] },
          { q:'摩天轮转动是（ ）。', a:'旋转', d:['平移','轴对称','放大'] },
          { q:'长方形有（ ）条对称轴。', a:2, d:[1,4,3,0] },
          { q:'正方形有（ ）条对称轴。', a:4, d:[2,1,3,0] },
          { q:'等腰三角形有（ ）条对称轴。', a:1, d:[2,3,0,4] },
          { q:'等边三角形有（ ）条对称轴。', a:3, d:[1,2,4,0] },
          { q:'圆有（ ）条对称轴。', a:'无数条', d:['1 条','2 条','4 条'] },
          { q:'下面图形中，（ ）不是轴对称图形。', a:'平行四边形', d:['长方形','正方形','圆'] },
          { q:'图形平移或旋转后，它的形状和大小（ ）。', a:'都不变', d:['形状变了','大小变了','都变了'] },
          { q:'把一张纸对折后两边能完全重合，这个图形是（ ）。', a:'轴对称图形', d:['平移图形','旋转图形','不规则图形'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){ r.push(bankQ(order[i % order.length])); }
        return r;
      } },

    { id:'sx3_07', subject:'shuxue', grade:3, name:'年月日与 24 时', icon:'📅', desc:'平年闰年 · 24 时计时法',
      make:function(n){
        var bank=[
          { q:'一年有（ ）个月。', a:12, d:[10,24,52,7] },
          { q:'一年中有（ ）个月是 31 天（大月）。', a:7, d:[5,4,6,12] },
          { q:'一年中有（ ）个月是 30 天（小月）。', a:4, d:[7,5,6,12] },
          { q:'平年全年有（ ）天。', a:365, d:[366,364,360,355] },
          { q:'闰年全年有（ ）天。', a:366, d:[365,367,360,364] },
          { q:'平年二月有（ ）天。', a:28, d:[29,30,31,27] },
          { q:'闰年二月有（ ）天。', a:29, d:[28,30,31,27] },
          { q:'一个星期有（ ）天。', a:7, d:[5,6,10,12] },
          { q:'一年分成（ ）个季度。', a:4, d:[12,2,6,3] },
          { q:'第二季度（4、5、6 月）一共有（ ）天。', a:91, d:[90,92,89,93] },
          { q:'第一季度（平年 1、2、3 月）一共有（ ）天。', a:90, d:[91,89,92,88] },
          { q:'用 24 时计时法，一天从 0 时到（ ）时。', a:24, d:[12,23,25,60] }
        ];
        var years=[2016,2020,2024,2028,2000,2004,2008,2012,2017,2018,2019,2021,2022,2023,2100,1900];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var h=rand(1,11), a1=h+12;
            r.push({ q:'下午 '+h+' 时，用 24 时计时法表示是（ ）时。',
              options:opts(a1,[h,a1+12,a1-1,a1+1],4), answer:String(a1) });
          } else if(t===1){ var h2=rand(13,23), a2=h2-12;
            r.push({ q:h2+' 时是下午（ ）时。',
              options:opts(a2,[h2,a2+1,a2+2,h2-11],4), answer:String(a2) });
          } else if(t===2){ var s=rand(6,12), e=rand(s+2,20), a3=e-s;
            r.push({ q:'从 '+s+' 时到 '+e+' 时，一共经过了（ ）小时。',
              options:opts(a3,[e+s,a3+1,a3-1,e],4), answer:String(a3) });
          } else if(t===3){ var y=pickOne(years);
            var leap=(y%4===0 && y%100!==0)||(y%400===0), a4=leap?'闰年':'平年';
            r.push({ q:y+' 年是（ ）。', options:optsT(a4,[leap?'平年':'闰年','大月','小月'],3), answer:a4 });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } }
    ,
    /* ==================== 四年级（8 关） ==================== */
    { id:'sx4_01', subject:'shuxue', grade:4, name:'升和毫升', icon:'🥤', desc:'1 升 = 1000 毫升',
      make:function(n){
        var bank=[
          { q:'一瓶矿泉水大约有 550（ ）。', a:'毫升', d:['升','克','千克'] },
          { q:'一桶食用油大约有 5（ ）。', a:'升', d:['毫升','克','千克'] },
          { q:'一小勺药水大约是 5（ ）。', a:'毫升', d:['升','千克','米'] },
          { q:'一个浴缸大约能装 300（ ）水。', a:'升', d:['毫升','克','千克'] },
          { q:'一个热水瓶的容量大约是 2（ ）。', a:'升', d:['毫升','千克','克'] },
          { q:'一只纸杯大约能装 200（ ）水。', a:'毫升', d:['升','千克','米'] },
          { q:'计量水、油等液体的多少，一般用（ ）作单位。', a:'升和毫升', d:['千克和克','米和厘米','时和分'] },
          { q:'“L”表示的单位是（ ）。', a:'升', d:['毫升','千克','厘米'] },
          { q:'“mL”表示的单位是（ ）。', a:'毫升', d:['升','克','毫米'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var x=rand(1,9), a1=x*1000;
            r.push({ q:x+' 升 = （ ）毫升。', options:opts(a1,[x*100,x*10,a1+100,a1+10],4), answer:String(a1) });
          } else if(t===1){ var y=rand(2,9), a2=y*1000;
            r.push({ q:a2+' 毫升 = （ ）升。', options:opts(y,[y*10,y*100,y+1,y-1],4), answer:String(y) });
          } else if(t===2){ var z=rand(1,8), m=rand(1,9)*100, a3=z*1000+m;
            r.push({ q:z+' 升 '+m+' 毫升 = （ ）毫升。', options:opts(a3,[z*1000,m,a3+100,a3-100],4), answer:String(a3) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx4_02', subject:'shuxue', grade:4, name:'除数是两位数的除法', icon:'➗', desc:'试商 · 调商',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var b=rand(11,49), q=rand(2,9), a=b*q;
            r.push({ q:'<b>'+a+' ÷ '+b+' = （ ）</b>', options:opts(q,[q+1,q-1,q+2,b],4), answer:String(q) });
          } else if(t===1){ var b2=rand(11,40), q2=rand(2,9), rr=rand(1,b2-1), a2=b2*q2+rr;
            r.push({ q:'<b>'+a2+' ÷ '+b2+'</b> 的商是（ ）', options:opts(q2,[q2+1,q2-1,q2+2,rr],4), answer:String(q2) });
          } else if(t===2){ var b3=rand(11,30), q3=rand(10, Math.floor(999/b3)), a3=b3*q3;
            r.push({ q:'<b>'+a3+' ÷ '+b3+' = （ ）</b>', options:opts(q3,[q3+1,q3-1,q3+10,q3-10],4), answer:String(q3) });
          } else { var b4=rand(12,40), q4=rand(3,9), a4=b4*q4;
            r.push({ q:'一共有 '+a4+' 个苹果，每箱装 '+b4+' 个，正好装（ ）箱。',
              options:opts(q4,[q4+1,q4-1,q4+2,b4],4), answer:String(q4) });
          }
        }
        return r;
      } },

    { id:'sx4_03', subject:'shuxue', grade:4, name:'观察物体', icon:'👀', desc:'从前面 / 上面 / 侧面看',
      make:function(n){
        var bank=[
          { q:'从上面观察一个圆柱，看到的是（ ）。', a:'圆', d:['长方形','正方形','三角形'] },
          { q:'从正面观察一个圆柱，看到的是（ ）。', a:'长方形', d:['圆','三角形','正方形'] },
          { q:'从任何方向观察一个球，看到的都是（ ）。', a:'圆', d:['正方形','长方形','三角形'] },
          { q:'从正面观察一个圆锥，看到的是（ ）。', a:'三角形', d:['圆','长方形','正方形'] },
          { q:'从上面观察一个圆锥，看到的是（ ）。', a:'圆', d:['三角形','长方形','正方形'] },
          { q:'从正面、右面、上面观察一个正方体，看到的都是（ ）。', a:'正方形', d:['长方形','圆','三角形'] },
          { q:'一个长方体的长、宽、高都不相等，从前面、右面、上面看到的图形（ ）。', a:'都不相同', d:['完全相同','都是正方形','都是圆'] },
          { q:'观察同一个物体，站在不同的位置看到的形状（ ）。', a:'可能不同', d:['一定相同','一定不同','和位置无关'] },
          { q:'把 3 个同样的正方体并排摆成一行，从正面看到（ ）个正方形。', a:3, d:[1,2,6] },
          { q:'把 4 个同样的正方体在桌面上摆成 2 行 2 列（只有一层），从上面看到（ ）个正方形。', a:4, d:[2,6,8] },
          { q:'把 2 个同样的正方体上下叠起来，从正面看到（ ）个正方形。', a:2, d:[1,4,6] },
          { q:'观察物体时，一般要按（ ）的顺序观察。', a:'从前面、右面到上面', d:['随便看','只看正面','只看上面'] },
          { q:'一个物体从正面看是长方形，从上面看是圆，这个物体可能是（ ）。', a:'圆柱', d:['球','正方体','圆锥'] },
          { q:'一个物体从任何方向看都是正方形，这个物体是（ ）。', a:'正方体', d:['长方体','圆柱','球'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){ r.push(bankQ(order[i % order.length])); }
        return r;
      } },

    { id:'sx4_04', subject:'shuxue', grade:4, name:'统计图与平均数', icon:'📊', desc:'条形统计图 · 求平均数',
      make:function(n){
        var bank=[
          { q:'条形统计图中，直条越长表示数量（ ）。', a:'越多', d:['越少','一样多','没关系'] },
          { q:'求平均数时，要先求出（ ）。', a:'总数', d:['最大数','最小数','份数差'] },
          { q:'平均数一定（ ）这组数中的最大数。', a:'小于或等于', d:['大于','等于','大于或等于'] },
          { q:'画条形统计图时，每一格表示的数量必须（ ）。', a:'相同', d:['不同','越来越大','随意'] },
          { q:'求平均数的方法是（ ）。', a:'总数 ÷ 份数', d:['总数 × 份数','份数 ÷ 总数','总数 − 份数'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t<=1){
            var k=rand(3,5), v=[], j;
            for(j=0;j<k;j++) v.push(rand(2,20));
            var sum=0;
            for(j=0;j<k;j++) sum+=v[j];
            var rem=sum%k;
            if(rem){ v[k-1]+=(k-rem); sum+=(k-rem); }
            var avg=sum/k, mx=v[0];
            for(j=0;j<k;j++){ if(v[j]>mx) mx=v[j]; }
            r.push({ q:'小明连续 '+k+' 天看书，页数分别是 '+v.join('、')+' 页，平均每天看（ ）页。',
              options:opts(avg,[sum,avg+1,avg-1,mx],4), answer:String(avg) });
          } else if(t===2){
            var x=rand(3,30), d2=rand(3,7), tot=x*d2;
            r.push({ q:'小红平均每天跳绳 '+x+' 个，'+d2+' 天一共跳（ ）个。',
              options:opts(tot,[x+d2,tot+x,tot-x,x],4), answer:String(tot) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx4_05', subject:'shuxue', grade:4, name:'四则混合运算', icon:'🧮', desc:'先乘除后加减 · 带括号',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5), a,b,c,ans;
          if(t===0){
            a=rand(5,60); b=rand(2,9); c=rand(2,9); ans=a+b*c;
            r.push({ q:'<b>'+a+' + '+b+' × '+c+' = （ ）</b>',
              options:opts(ans,[(a+b)*c,ans+1,ans-1,ans+10],4), answer:String(ans) });
          } else if(t===1){
            a=rand(2,9); b=rand(2,9); c=rand(5,60); ans=a*b+c;
            r.push({ q:'<b>'+a+' × '+b+' + '+c+' = （ ）</b>',
              options:opts(ans,[a*(b+c),ans+1,ans-1,ans+10],4), answer:String(ans) });
          } else if(t===2){
            b=rand(2,9); c=rand(2,9); a=rand(b*c+2,b*c+80); ans=a-b*c;
            r.push({ q:'<b>'+a+' − '+b+' × '+c+' = （ ）</b>',
              options:opts(ans,[(a-b)*c,ans+1,ans-1,ans+10],4), answer:String(ans) });
          } else if(t===3){
            a=rand(5,40); b=rand(5,40); c=rand(2,9); ans=(a+b)*c;
            r.push({ q:'<b>（'+a+' + '+b+'） × '+c+' = （ ）</b>',
              options:opts(ans,[a+b*c,ans+c,ans-c,ans+1],4), answer:String(ans) });
          } else if(t===4){
            c=rand(2,9); var k=rand(2,12); b=c*k; a=rand(5,60); ans=a+k;
            r.push({ q:'<b>'+a+' + '+b+' ÷ '+c+' = （ ）</b>',
              options:opts(ans,[a+b,ans+1,ans-1,ans+10],4), answer:String(ans) });
          } else {
            a=rand(2,9); b=rand(5,30); c=rand(5,30); ans=a*(b+c);
            r.push({ q:'<b>'+a+' × （'+b+' + '+c+'） = （ ）</b>',
              options:opts(ans,[a*b+c,ans+a,ans-a,ans+1],4), answer:String(ans) });
          }
        }
        return r;
      } },

    { id:'sx4_06', subject:'shuxue', grade:4, name:'垂线与平行线', icon:'📏', desc:'角的度量 · 垂直与平行',
      make:function(n){
        var bank=[
          { q:'直角是（ ）度。', a:90, d:[180,45,360,100] },
          { q:'平角是（ ）度。', a:180, d:[90,360,120,100] },
          { q:'周角是（ ）度。', a:360, d:[180,90,300,270] },
          { q:'1 个平角等于（ ）个直角。', a:2, d:[1,3,4,90] },
          { q:'1 个周角等于（ ）个直角。', a:4, d:[2,3,6,360] },
          { q:'两条直线相交成直角，这两条直线互相（ ）。', a:'垂直', d:['平行','相等','重合'] },
          { q:'在同一平面内，不相交的两条直线互相（ ）。', a:'平行', d:['垂直','相等','重合'] },
          { q:'从直线外一点到这条直线所画的线段中，（ ）最短。', a:'垂直线段', d:['斜的线段','最长的线段','任意线段'] },
          { q:'过直线外一点画这条直线的平行线，只能画（ ）条。', a:1, d:[2,4,0,3] },
          { q:'过一点画已知直线的垂线，只能画（ ）条。', a:1, d:[2,4,0,3] },
          { q:'用量角器量角时，量角器的中心要和角的（ ）重合。', a:'顶点', d:['一条边','中点','端点'] },
          { q:'两条互相垂直的直线，它们的交点叫（ ）。', a:'垂足', d:['顶点','中点','端点'] },
          { q:'钟面上 3 时整，时针与分针成的角是（ ）度。', a:90, d:[180,30,60,45] },
          { q:'钟面上 6 时整，时针与分针成的角是（ ）度。', a:180, d:[90,360,120,60] },
          { q:'平行线之间的距离处处（ ）。', a:'相等', d:['不等','越来越大','越来越小'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,2);
          if(t===0){
            var pick=rand(0,3), deg, ans;
            if(pick===0){ deg=rand(10,89); ans='锐角'; }
            else if(pick===1){ deg=90; ans='直角'; }
            else if(pick===2){ deg=rand(91,179); ans='钝角'; }
            else { deg=180; ans='平角'; }
            r.push({ q:'一个角是 '+deg+' 度，它是（ ）。',
              options:optsT(ans,['锐角','直角','钝角','平角'].filter(function(s){return s!==ans;}),4), answer:ans });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx4_07', subject:'shuxue', grade:4, name:'认识多位数', icon:'🔟', desc:'万 · 亿的读写 · 近似数',
      make:function(n){
        var bank=[
          { q:'1 亿 = （ ）万。', a:10000, d:[1000,100000,100,10] },
          { q:'10 个一万是（ ）。', a:100000, d:[10000,1000000,11000,20000] },
          { q:'10 个一千万是（ ）。', a:100000000, d:[10000000,1000000000,11000000,10000] },
          { q:'个级包含个位、十位、百位和（ ）。', a:'千位', d:['万位','十万位','亿位'] },
          { q:'求一个数的近似数，通常用（ ）法。', a:'四舍五入', d:['去尾','进一','平均'] },
          { q:'亿级的数位是亿位、十亿位、百亿位和（ ）。', a:'千亿位', d:['千万位','万位','十万位'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var x=rand(2,999), a1=x*10000;
            r.push({ q:x+' 万写作（ ）。', options:opts(a1,[x*1000,x*100000,a1+10000,x],4), answer:String(a1) });
          } else if(t===1){
            var w=(rand(0,1)===0)?rand(1,9):rand(20,9990);   // 避开 10~19（读作“十万”而非“一十万”）
            var low=(rand(0,1)===0)?0:rand(1000,9999);
            var num=w*10000+low, a2=cn8(num);
            r.push({ q:'<b>'+num+'</b> 读作（ ）。',
              options:optsT(a2,[cn8(num+1),cn8(num+10),cn8(num+1000),cn8(num+10000)],4), answer:a2,
              speak:a2, speakLang:'zh-CN' });
          } else if(t===2){ var num2=rand(10000,999999), a3=Math.round(num2/10000);
            r.push({ q:'把 '+num2+' 四舍五入到万位，约是（ ）万。',
              options:opts(a3,[Math.floor(num2/10000),a3+1,a3+2,Math.ceil(num2/10000)+1],4), answer:String(a3) });
          } else if(t===3){ var k=rand(5,9), lo=Math.pow(10,k-1), num3=rand(lo,lo*10-1);
            var names={5:'万位',6:'十万位',7:'百万位',8:'千万位',9:'亿位'}, a4=names[k];
            r.push({ q:'<b>'+num3+'</b> 的最高位是（ ）。',
              options:optsT(a4,['万位','十万位','百万位','千万位','亿位','千位'].filter(function(s){return s!==a4;}),4), answer:a4 });
          } else if(t===4){ var wa=rand(1,9), qa=rand(1,9), a5=wa*10000+qa*1000;
            r.push({ q:'由 '+wa+' 个万和 '+qa+' 个千组成的数是（ ）。',
              options:opts(a5,[wa*10000+qa, qa*10000+wa*1000, a5+1000, a5-1000],4), answer:String(a5) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx4_08', subject:'shuxue', grade:4, name:'运算律', icon:'🔀', desc:'交换律 · 结合律 · 分配律',
      make:function(n){
        var laws=['加法交换律','加法结合律','乘法交换律','乘法结合律','乘法分配律'];
        function lawOpts(ans){
          return optsT(ans, shuffle(laws.filter(function(s){return s!==ans;})).slice(0,3), 4);
        }
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var b=rand(2,9), a1=25*4*b;
            r.push({ q:'用简便方法计算：<b>25 × 4 × '+b+' = （ ）</b>',
              options:opts(a1,[a1+100,a1-100,25*4+b,a1+10],4), answer:String(a1) });
          } else if(t===1){ var c=rand(2,9), a2=125*8*c;
            r.push({ q:'用简便方法计算：<b>125 × 8 × '+c+' = （ ）</b>',
              options:opts(a2,[a2+1000,a2-1000,125*8+c,a2+100],4), answer:String(a2) });
          } else if(t===2){ var m=pickOne([99,101,98,102]), d2=rand(3,9), a3=m*d2;
            r.push({ q:'用简便方法计算：<b>'+m+' × '+d2+' = （ ）</b>',
              options:opts(a3,[100*d2,a3+d2,a3-d2,a3+1],4), answer:String(a3) });
          } else if(t===3){ var p=rand(11,89), q=100-p, e=rand(11,99), a4=100+e;
            r.push({ q:'用简便方法计算：<b>'+p+' + '+e+' + '+q+' = （ ）</b>',
              options:opts(a4,[a4+10,a4-10,p+q,a4+1],4), answer:String(a4) });
          } else if(t===4){ var f=pickOne([25,15,12,35]), g2=rand(11,19), a5=f*g2;
            r.push({ q:'用乘法分配律计算：<b>'+f+' × '+g2+' = （ ）</b>',
              options:opts(a5,[f*10+g2,a5+f,a5-f,a5+10],4), answer:String(a5) });
          } else {
            var items=[
              { q:'25 × 4 = 4 × 25，用的是（ ）。', a:'乘法交换律' },
              { q:'48 + 52 = 52 + 48，用的是（ ）。', a:'加法交换律' },
              { q:'(12 + 25) + 75 = 12 + (25 + 75)，用的是（ ）。', a:'加法结合律' },
              { q:'(4 × 25) × 8 = 4 × (25 × 8)，用的是（ ）。', a:'乘法结合律' },
              { q:'(20 + 5) × 4 = 20 × 4 + 5 × 4，用的是（ ）。', a:'乘法分配律' },
              { q:'102 × 6 = 100 × 6 + 2 × 6，用的是（ ）。', a:'乘法分配律' },
              { q:'a + b = b + a 表示的是（ ）。', a:'加法交换律' },
              { q:'a × b × c = a × (b × c) 表示的是（ ）。', a:'乘法结合律' }
            ];
            var it=pickOne(items);
            r.push({ q:it.q, options:lawOpts(it.a), answer:it.a });
          }
        }
        return r;
      } },

    /* ==================== 五年级（8 关） ==================== */
    { id:'sx5_01', subject:'shuxue', grade:5, name:'认识负数', icon:'🌡️', desc:'负数的意义与比大小',
      make:function(n){
        var bank=[
          { q:'比 0 小的数是（ ）。', a:'负数', d:['正数','0','自然数'] },
          { q:'0 是（ ）。', a:'既不是正数也不是负数', d:['正数','负数','最小的正数'] },
          { q:'−8 读作（ ）。', a:'负八', d:['正八','八','负八分之一'] },
          { q:'零上 5℃ 记作 +5℃，那么零下 7℃ 记作（ ）。', a:'−7℃', d:['+7℃','7℃','−70℃'] },
          { q:'电梯里地下 2 层可以记作（ ）。', a:'−2', d:['+2','2','−20'] },
          { q:'所有的负数都（ ）0。', a:'小于', d:['大于','等于','不小于'] },
          { q:'在数轴上，负数都在 0 的（ ）边。', a:'左', d:['右','上','下'] },
          { q:'存入 200 元记作 +200 元，取出 200 元记作（ ）。', a:'−200 元', d:['+200 元','200 元','−2 元'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            var x=-rand(1,20), y=(rand(0,1)===0)? -rand(1,20) : rand(1,20);
            while(y===x){ y=(rand(0,1)===0)? -rand(1,20) : rand(1,20); }
            var big=(x>y)?x:y;
            r.push({ q:'<b>'+x+'</b> 和 <b>'+y+'</b> 相比，（ ）大。',
              options:optsT(String(big),[String(x),String(y),'两数相等'],3), answer:String(big) });
          } else if(t===1){
            var a1=rand(1,20), b1=rand(1,20);
            while(b1===a1){ b1=rand(1,20); }
            var lowT='−'+((a1>b1)?a1:b1)+'℃';
            r.push({ q:'气温 <b>−'+a1+'℃</b> 和 <b>−'+b1+'℃</b> 相比，（ ）更冷。',
              options:optsT(lowT,['−'+a1+'℃','−'+b1+'℃','一样冷'],3), answer:lowT });
          } else if(t===2){
            var pool=[-rand(1,9), -rand(10,20), rand(1,9), rand(10,20)];
            var mn=pool[0], j;
            for(j=1;j<pool.length;j++){ if(pool[j]<mn) mn=pool[j]; }
            r.push({ q:'在 '+pool.join('、')+' 这几个数中，最小的是（ ）。',
              options:optsT(String(mn), uniq(pool.map(String)).filter(function(s){return s!==String(mn);}), 4), answer:String(mn) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx5_02', subject:'shuxue', grade:5, name:'平行四边形面积', icon:'▱', desc:'面积 = 底 × 高',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(3,25), h=rand(2,20), s=b*h;
          if(rand(0,2)<2){
            r.push({ q:'一个平行四边形的底是 '+b+' 厘米，高是 '+h+' 厘米，面积是（ ）平方厘米。',
              options:opts(s,[(b+h)*2,s*2,s+h,s-h],4), answer:String(s) });
          } else {
            r.push({ q:'一个平行四边形的面积是 '+s+' 平方厘米，高是 '+h+' 厘米，底是（ ）厘米。',
              options:opts(b,[s-h,s*h,b+1,b-1],4), answer:String(b) });
          }
        }
        return r;
      } },

    { id:'sx5_03', subject:'shuxue', grade:5, name:'三角形面积', icon:'🔺', desc:'面积 = 底 × 高 ÷ 2',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var b=rand(2,12)*2, h=rand(2,20), s=b*h/2;
          if(rand(0,2)<2){
            r.push({ q:'一个三角形的底是 '+b+' 厘米，高是 '+h+' 厘米，面积是（ ）平方厘米。',
              options:opts(s,[b*h,s+h,s-h,s+1],4), answer:String(s) });
          } else {
            r.push({ q:'一个三角形的面积是 '+s+' 平方厘米，高是 '+h+' 厘米，底是（ ）厘米。',
              options:opts(b,[s/h,b*2,b+1,b-1],4), answer:String(b) });
          }
        }
        return r;
      } },

    { id:'sx5_04', subject:'shuxue', grade:5, name:'梯形面积', icon:'🔻', desc:'(上底+下底) × 高 ÷ 2',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var a=rand(2,15), b=rand(a+1,20), h=rand(1,10)*2, s=(a+b)*h/2;
          if(rand(0,2)<2){
            r.push({ q:'一个梯形的上底是 '+a+' 厘米，下底是 '+b+' 厘米，高是 '+h+' 厘米，面积是（ ）平方厘米。',
              options:opts(s,[(a+b)*h,s+h,s-h,(a+b)+h],4), answer:String(s) });
          } else {
            r.push({ q:'一个梯形的面积是 '+s+' 平方厘米，上底 '+a+' 厘米，下底 '+b+' 厘米，高是（ ）厘米。',
              options:opts(h,[s/(a+b),h*2,h+1,h-1],4), answer:String(h) });
          }
        }
        return r;
      } },

    { id:'sx5_05', subject:'shuxue', grade:5, name:'小数的意义和性质', icon:'🔢', desc:'读写 · 性质 · 改写',
      make:function(n){
        var bank=[
          { q:'在小数的末尾添上 0 或去掉 0，小数的大小（ ）。', a:'不变', d:['变大','变小','变成 10 倍'] },
          { q:'小数点向右移动一位，小数就（ ）。', a:'扩大到原来的 10 倍', d:['缩小到原来的 1/10','不变','扩大到原来的 100 倍'] },
          { q:'小数点向左移动两位，小数就（ ）。', a:'缩小到原来的 1/100', d:['扩大到原来的 100 倍','不变','缩小到原来的 1/10'] },
          { q:'小数部分从左往右第二位是（ ）位。', a:'百分', d:['十分','千分','个'] },
          { q:'0.1 里面有（ ）个 0.01。', a:10, d:[100,1,1000] },
          { q:'1 里面有（ ）个 0.1。', a:10, d:[100,1,1000] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var x=rand(1,9);
            r.push({ q:'0.'+x+' 里面有（ ）个 0.1。', options:opts(x,[x*10,x*100,x+1,x-1],4), answer:String(x) });
          } else if(t===1){ var y=rand(11,99);
            r.push({ q:'0.'+y+' 里面有（ ）个 0.01。', options:opts(y,[y*10,Math.floor(y/10),y+1,y-1],4), answer:String(y) });
          } else if(t===2){
            var ip=rand(0,8), d1=rand(1,9), two=rand(0,1), d2=rand(0,9);
            var tail=d1+(two? String(d2) : '');
            var v=Number(ip+'.'+tail), a3=cnDec(v);
            var alt1=Number(ip+'.'+((d1%9)+1)+(two? String(d2):''));      // 十分位不同
            var alt2=Number((ip+1)+'.'+tail);                              // 整数部分不同
            var alt3=Number(ip+'.'+d1+(two? String((d2+1)%10) : '5'));     // 百分位不同
            r.push({ q:'<b>'+v+'</b> 读作（ ）。',
              options:optsT(a3,[cnDec(alt1),cnDec(alt2),cnDec(alt3)],4),
              answer:a3, speak:a3, speakLang:'zh-CN' });
          } else if(t===3){ var m=rand(1,9), dm=rand(1,9), a4=m*100+dm*10;
            r.push({ q:m+'.'+dm+' 米 = （ ）厘米。', options:opts(a4,[m*10+dm,a4*10,a4+10,a4-10],4), answer:String(a4) });
          } else if(t===4){ var p=rand(1,9), a5=p+'/10';
            r.push({ q:'0.'+p+' 写成分母是 10 的分数是（ ）。',
              options:optsT(a5,['10/'+p,'1/'+p,p+'/100'],4), answer:a5 });
          } else {
            var u=rand(0,3), w=rand(0,3);
            var v1=Number((u+'.'+rand(1,9)+rand(0,9))), v2=Number((w+'.'+rand(1,9)));
            if(v1===v2){ v2=v1+0.5; }
            var a6=(v1>v2)?'>':'<';
            r.push({ q:fmt(v1)+' ○ '+fmt(v2)+'，○ 里应该填（ ）。',
              options:optsT(a6,['>','<','='].filter(function(s){return s!==a6;}),3), answer:a6 });
          }
        }
        return r;
      } },

    { id:'sx5_06', subject:'shuxue', grade:5, name:'小数加减乘除', icon:'✳️', desc:'小数四则计算',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var a=rand(11,199)/10, b=rand(11,199)/10, s=Number(fmt(a+b));
            r.push({ q:'<b>'+fmt(a)+' + '+fmt(b)+' = （ ）</b>', options:opts(fmt(s),decD(s),4), answer:fmt(s) });
          } else if(t===1){ var c=rand(60,199)/10, d=rand(11,55)/10, m=Number(fmt(c-d));
            r.push({ q:'<b>'+fmt(c)+' − '+fmt(d)+' = （ ）</b>', options:opts(fmt(m),decD(m),4), answer:fmt(m) });
          } else if(t===2){ var e=rand(11,99)/10, f=rand(2,9)/10, p=Number(fmt(e*f));
            r.push({ q:'<b>'+fmt(e)+' × '+fmt(f)+' = （ ）</b>', options:opts(fmt(p),decD(p),4), answer:fmt(p) });
          } else if(t===3){ var g=rand(11,99)/10, h=rand(2,9), p2=Number(fmt(g*h));
            r.push({ q:'<b>'+fmt(g)+' × '+h+' = （ ）</b>', options:opts(fmt(p2),decD(p2),4), answer:fmt(p2) });
          } else { var q=rand(11,99)/10, dv=rand(2,9), a2=Number(fmt(q*dv));
            r.push({ q:'<b>'+fmt(a2)+' ÷ '+dv+' = （ ）</b>', options:opts(fmt(q),decD(q),4), answer:fmt(q) });
          }
        }
        return r;
      } },

    { id:'sx5_07', subject:'shuxue', grade:5, name:'简易方程', icon:'⚖️', desc:'解方程 · 列方程',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var a=rand(2,30), x=rand(2,40), b=a+x;
            r.push({ q:'解方程：<b>x + '+a+' = '+b+'</b>，x = （ ）',
              options:opts(x,[a+b,x+1,x-1,a],4), answer:String(x) });
          } else if(t===1){ var a2=rand(2,30), b2=rand(2,40), xx=a2+b2;
            r.push({ q:'解方程：<b>x − '+a2+' = '+b2+'</b>，x = （ ）',
              options:opts(xx,[b2,xx+1,xx-1,a2*b2],4), answer:String(xx) });
          } else if(t===2){ var a3=rand(2,12), x3=rand(2,20), b3=a3*x3;
            r.push({ q:'解方程：<b>'+a3+'x = '+b3+'</b>，x = （ ）',
              options:opts(x3,[a3*b3,x3+1,x3-1,b3+a3],4), answer:String(x3) });
          } else if(t===3){ var a4=rand(2,12), b4=rand(2,20), x4=a4*b4;
            r.push({ q:'解方程：<b>x ÷ '+a4+' = '+b4+'</b>，x = （ ）',
              options:opts(x4,[a4+b4,b4,x4+1,x4-1],4), answer:String(x4) });
          } else if(t===4){ var a5=rand(2,9), x5=rand(2,15), b5=rand(2,30), c5=a5*x5+b5;
            r.push({ q:'解方程：<b>'+a5+'x + '+b5+' = '+c5+'</b>，x = （ ）',
              options:opts(x5,[c5-b5,x5+1,x5-1,x5+2],4), answer:String(x5) });
          } else {
            var items=[
              { q:'小明有 x 元，用去 8 元后还剩 12 元，列出的方程是（ ）。', a:'x − 8 = 12', d:['x + 8 = 12','8 − x = 12','12 − 8 = x'] },
              { q:'一支笔 x 元，买 5 支一共 30 元，列出的方程是（ ）。', a:'5x = 30', d:['x + 5 = 30','x ÷ 5 = 30','30x = 5'] },
              { q:'一个数加上 15 等于 42，列出的方程是（ ）。', a:'x + 15 = 42', d:['x − 15 = 42','15x = 42','x ÷ 15 = 42'] },
              { q:'一个数的 3 倍是 27，列出的方程是（ ）。', a:'3x = 27', d:['x + 3 = 27','x − 3 = 27','x ÷ 3 = 27'] },
              { q:'方程两边同时加上或减去同一个数，左右两边（ ）。', a:'仍然相等', d:['不再相等','左边大','右边大'] },
              { q:'使方程左右两边相等的未知数的值，叫做方程的（ ）。', a:'解', d:['式子','结果','和'] }
            ];
            var it=pickOne(items);
            r.push({ q:it.q, options:optsT(it.a,it.d,4), answer:it.a });
          }
        }
        return r;
      } },

    { id:'sx5_08', subject:'shuxue', grade:5, name:'圆', icon:'⭕', desc:'周长 2πr · 面积 πr²（π 取 3.14）',
      make:function(n){
        var bank=[
          { q:'圆有（ ）条对称轴。', a:'无数条', d:['1 条','2 条','4 条'] },
          { q:'圆的周长与直径的比值叫（ ）。', a:'圆周率', d:['半径','直径','面积'] },
          { q:'画圆时，圆规两脚间的距离就是圆的（ ）。', a:'半径', d:['直径','周长','面积'] },
          { q:'在同一个圆里，直径是半径的（ ）倍。', a:2, d:[3,4,1] },
          { q:'圆心决定圆的（ ）。', a:'位置', d:['大小','周长','面积'] },
          { q:'半径决定圆的（ ）。', a:'大小', d:['位置','圆心','对称轴'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var r1=rand(1,10), a1=Number(fmt(2*3.14*r1));
            r.push({ q:'一个圆的半径是 '+r1+' 厘米，它的周长是（ ）厘米。（π 取 3.14）',
              options:opts(fmt(a1),[fmt(3.14*r1),fmt(3.14*r1*r1),fmt(a1+1),fmt(a1/2)],4), answer:fmt(a1) });
          } else if(t===1){ var r2=rand(1,10), a2=Number(fmt(3.14*r2*r2));
            r.push({ q:'一个圆的半径是 '+r2+' 厘米，它的面积是（ ）平方厘米。（π 取 3.14）',
              options:opts(fmt(a2),[fmt(2*3.14*r2),fmt(3.14*r2*2),fmt(a2+1),fmt(a2/2)],4), answer:fmt(a2) });
          } else if(t===2){ var d3=rand(2,20), a3=Number(fmt(3.14*d3));
            r.push({ q:'一个圆的直径是 '+d3+' 厘米，它的周长是（ ）厘米。（π 取 3.14）',
              options:opts(fmt(a3),[fmt(2*3.14*d3),fmt(3.14*d3*d3/4),fmt(a3+1),fmt(a3/2)],4), answer:fmt(a3) });
          } else if(t===3){ var r4=rand(1,15);
            if(rand(0,1)===0){
              r.push({ q:'一个圆的半径是 '+r4+' 厘米，直径是（ ）厘米。',
                options:opts(r4*2,[r4,r4*4,r4*2+1,r4*2-1],4), answer:String(r4*2) });
            } else {
              r.push({ q:'一个圆的直径是 '+(r4*2)+' 厘米，半径是（ ）厘米。',
                options:opts(r4,[r4*2,r4*4,r4+1,r4-1],4), answer:String(r4) });
            }
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } }
    ,
    /* ==================== 六年级（8 关） ==================== */
    { id:'sx6_01', subject:'shuxue', grade:6, name:'长方体正方体表面积', icon:'📦', desc:'(长宽+长高+宽高) × 2',
      make:function(n){
        var bank=[
          { q:'长方体有（ ）个面。', a:6, d:[8,12,4] },
          { q:'长方体有（ ）条棱。', a:12, d:[6,8,4] },
          { q:'长方体有（ ）个顶点。', a:8, d:[6,12,4] },
          { q:'长方体相对的两个面（ ）。', a:'完全相同', d:['大小不同','形状不同','没有关系'] },
          { q:'正方体的 6 个面（ ）。', a:'都是正方形', d:['都是长方形','形状各不同','有 2 个是圆'] },
          { q:'做一个无盖的长方体铁盒，要计算（ ）个面的面积。', a:5, d:[6,4,3] },
          { q:'表面积的单位是（ ）。', a:'平方厘米', d:['厘米','立方厘米','升'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var a=rand(2,12), b=rand(2,12), c=rand(2,12), s=2*(a*b+a*c+b*c);
            r.push({ q:'一个长方体，长 '+a+' 厘米、宽 '+b+' 厘米、高 '+c+' 厘米，表面积是（ ）平方厘米。',
              options:opts(s,[s/2,a*b*c,2*(a+b+c),s+2],4), answer:String(s) });
          } else if(t===1){ var e=rand(2,15), s2=6*e*e;
            r.push({ q:'一个正方体的棱长是 '+e+' 厘米，表面积是（ ）平方厘米。',
              options:opts(s2,[e*e,4*e*e,e*e*e,s2+6],4), answer:String(s2) });
          } else if(t===2){ var f=rand(2,15), s3=6*f*f;
            r.push({ q:'一个正方体的表面积是 '+s3+' 平方厘米，它一个面的面积是（ ）平方厘米。',
              options:opts(f*f,[f*4,s3/2,f*f+1,f*f*6],4), answer:String(f*f) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_02', subject:'shuxue', grade:6, name:'长方体正方体体积', icon:'🧊', desc:'长 × 宽 × 高 · 单位换算',
      make:function(n){
        var bank=[
          { q:'1 立方米 = （ ）立方分米。', a:1000, d:[100,10,10000] },
          { q:'1 立方分米 = （ ）立方厘米。', a:1000, d:[100,10,10000] },
          { q:'1 升 = （ ）立方分米。', a:1, d:[10,100,1000] },
          { q:'1 毫升 = （ ）立方厘米。', a:1, d:[10,100,1000] },
          { q:'1 升 = （ ）毫升。', a:1000, d:[100,10,10000] },
          { q:'体积单位中，最大的是（ ）。', a:'立方米', d:['立方分米','立方厘米','毫升'] },
          { q:'物体所占空间的大小叫做物体的（ ）。', a:'体积', d:['表面积','周长','容积'] },
          { q:'容器所能容纳物体的体积叫做它的（ ）。', a:'容积', d:['体积','表面积','棱长总和'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var a=rand(2,12), b=rand(2,12), c=rand(2,12), v=a*b*c;
            r.push({ q:'一个长方体，长 '+a+' 厘米、宽 '+b+' 厘米、高 '+c+' 厘米，体积是（ ）立方厘米。',
              options:opts(v,[2*(a*b+a*c+b*c),a+b+c,v+10,4*(a+b+c)],4), answer:String(v) });
          } else if(t===1){ var e=rand(2,12), v2=e*e*e;
            r.push({ q:'一个正方体的棱长是 '+e+' 厘米，体积是（ ）立方厘米。',
              options:opts(v2,[6*e*e,e*e,12*e,v2+1],4), answer:String(v2) });
          } else if(t===2){ var x=rand(2,9), v3=x*1000;
            r.push({ q:x+' 立方分米 = （ ）立方厘米。', options:opts(v3,[x*100,x*10,v3+100,v3+10],4), answer:String(v3) });
          } else if(t===3){ var p=rand(2,10), q2=rand(2,10), h=rand(2,10), v4=p*q2*h;
            r.push({ q:'一个长方体水箱，长 '+p+' 分米、宽 '+q2+' 分米、高 '+h+' 分米，最多能装水（ ）升。',
              options:opts(v4,[p+q2+h,2*(p*q2+p*h+q2*h),v4*10,v4+10],4), answer:String(v4) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_03', subject:'shuxue', grade:6, name:'分数乘法', icon:'🍕', desc:'分子相乘 · 分母相乘',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            var q1=rand(2,9), p1=rand(1,q1-1), q2=rand(2,9), p2=rand(1,q2-1);
            r.push({ q:'<b>'+p1+'/'+q1+' × '+p2+'/'+q2+' = （ ）</b>',
              options:fracOpts(p1*p2, q1*q2, [ (p1*p2)+'/'+(q1*q2), fracStr(p1*q2,q1*p2), fracStr(p1+p2,q1+q2) ]),
              answer:fracStr(p1*p2,q1*q2) });
          } else if(t===1){
            var q3=rand(2,9), p3=rand(1,q3-1), k=rand(2,9);
            r.push({ q:'<b>'+p3+'/'+q3+' × '+k+' = （ ）</b>',
              options:fracOpts(p3*k, q3, [ fracStr(p3,q3*k), (p3*k)+'/'+(q3*k) ]),
              answer:fracStr(p3*k,q3) });
          } else if(t===2){
            var q4=rand(2,9), p4=rand(1,q4-1), m=rand(2,12), tot=q4*m, ans=tot/q4*p4;
            r.push({ q:tot+' 的 '+p4+'/'+q4+' 是（ ）。',
              options:opts(ans,[tot*p4,tot-p4,ans+1,ans-1],4), answer:String(ans) });
          } else {
            var q5=rand(2,9), p5=rand(1,q5-1);
            r.push({ q:'<b>'+p5+'/'+q5+'</b> 的倒数是（ ）。',
              options:fracOpts(q5, p5, [ p5+'/'+q5, fracStr(q5,p5+1) ]),
              answer:fracStr(q5,p5) });
          }
        }
        return r;
      } },

    { id:'sx6_04', subject:'shuxue', grade:6, name:'分数除法', icon:'🍰', desc:'除以一个数等于乘它的倒数',
      make:function(n){
        var bank=[
          { q:'除以一个不为 0 的数，等于乘这个数的（ ）。', a:'倒数', d:['相反数','积','商'] },
          { q:'1 的倒数是（ ）。', a:'1', d:['0','2','1/2'] },
          { q:'（ ）没有倒数。', a:'0', d:['1','2','1/2'] },
          { q:'乘积是（ ）的两个数互为倒数。', a:'1', d:['0','10','100'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            var q1=rand(2,9), p1=rand(1,q1-1), q2=rand(2,9), p2=rand(1,q2-1);
            r.push({ q:'<b>'+p1+'/'+q1+' ÷ '+p2+'/'+q2+' = （ ）</b>',
              options:fracOpts(p1*q2, q1*p2, [ fracStr(p1*p2,q1*q2), (p1*q2)+'/'+(q1*p2) ]),
              answer:fracStr(p1*q2,q1*p2) });
          } else if(t===1){
            var q3=rand(2,9), p3=rand(1,q3-1), k=rand(2,9);
            r.push({ q:'<b>'+p3+'/'+q3+' ÷ '+k+' = （ ）</b>',
              options:fracOpts(p3, q3*k, [ fracStr(p3*k,q3), (p3)+'/'+(q3+k) ]),
              answer:fracStr(p3,q3*k) });
          } else if(t===2){
            var q4=rand(2,9), p4=rand(1,q4-1), m=rand(2,9);
            r.push({ q:'<b>'+m+' ÷ '+p4+'/'+q4+' = （ ）</b>',
              options:fracOpts(m*q4, p4, [ fracStr(m*p4,q4), (m*q4)+'/'+p4 ]),
              answer:fracStr(m*q4,p4) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_05', subject:'shuxue', grade:6, name:'比的认识', icon:'⚗️', desc:'化简比 · 求比值 · 按比分配',
      make:function(n){
        var bank=[
          { q:'比的前项和后项同时乘或除以相同的数（0 除外），比值（ ）。', a:'不变', d:['变大','变小','变成 0'] },
          { q:'比的后项不能是（ ）。', a:'0', d:['1','2','10'] },
          { q:'比的前项 ÷ 后项所得的商叫做（ ）。', a:'比值', d:['比例','比的前项','分数'] },
          { q:'a : b 也可以写成分数（ ）。', a:'a/b', d:['b/a','a×b','a+b'] },
          { q:'比与除法、分数相比，比的后项相当于除法中的（ ）。', a:'除数', d:['被除数','商','余数'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var g=rand(2,9), a=g*rand(2,9), b=g*rand(2,9);
            r.push({ q:'把 <b>'+a+' : '+b+'</b> 化成最简单的整数比是（ ）。',
              options:ratioOpts(a,b,[a+':'+b]), answer:ratioStr(a,b) });
          } else if(t===1){ var c=rand(2,20), d2=rand(2,20);
            r.push({ q:'<b>'+c+' : '+d2+'</b> 的比值是（ ）。',
              options:fracOpts(c,d2,[fracStr(d2,c), c+'/'+d2]), answer:fracStr(c,d2) });
          } else if(t===2){ var m=rand(2,12), f=rand(2,12);
            r.push({ q:'班里有男生 '+m+' 人、女生 '+f+' 人，男生与女生人数的最简整数比是（ ）。',
              options:ratioOpts(m,f,[m+':'+f]), answer:ratioStr(m,f) });
          } else if(t===3){
            var p=rand(1,6), q2=rand(1,6), k=rand(2,12), tot=(p+q2)*k, part=p*k;
            r.push({ q:'把 '+tot+' 个球按 '+p+' : '+q2+' 分给两个小组，第一组分到（ ）个。',
              options:opts(part,[q2*k,tot-part+1,part+1,part-1],4), answer:String(part) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_06', subject:'shuxue', grade:6, name:'百分数', icon:'💯', desc:'折扣 · 税率 · 利率',
      make:function(n){
        var fracPct=[[1,2,50],[1,4,25],[3,4,75],[1,5,20],[2,5,40],[3,5,60],[4,5,80],
                     [1,10,10],[3,10,30],[7,10,70],[1,20,5],[9,20,45],[1,25,4],[3,25,12],[1,50,2]];
        var rates=[{t:100,m:1},{t:50,m:2},{t:20,m:5},{t:25,m:4},{t:10,m:10}];
        var bank=[
          { q:'百分数又叫做（ ）。', a:'百分率', d:['小数','分数','比例尺'] },
          { q:'25% 化成小数是（ ）。', a:'0.25', d:['2.5','25','0.025'] },
          { q:'0.6 化成百分数是（ ）。', a:'60%', d:['6%','0.6%','600%'] },
          { q:'“打八折”就是按原价的（ ）出售。', a:'80%', d:['8%','20%','88%'] },
          { q:'“一成”就是（ ）。', a:'10%', d:['1%','100%','11%'] },
          { q:'求利息的公式是（ ）。', a:'本金 × 利率 × 时间', d:['本金 × 利率','本金 + 利率','本金 ÷ 时间'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,6);
          if(t===0){ var z=rand(3,9), pc=z*10, ans=pc+'%';
            r.push({ q:'打 '+z+' 折，就是按原价的（ ）出售。',
              options:optsT(ans,[z+'%',(100-pc)+'%',(pc+10)+'%',(pc>10?pc-10:pc+20)+'%'],4), answer:ans });
          } else if(t===1){ var k=rand(1,99), ans1=k+'%';
            r.push({ q:'把小数 <b>'+fmt(k/100)+'</b> 化成百分数是（ ）。',
              options:optsT(ans1,[(k*10)+'%',fmt(k/100)+'%',(k+1)+'%',(k+10)+'%'],4), answer:ans1 });
          } else if(t===2){ var fp=pickOne(fracPct), ans2=fp[2]+'%';
            r.push({ q:'把分数 <b>'+fp[0]+'/'+fp[1]+'</b> 化成百分数是（ ）。',
              options:optsT(ans2,[(fp[2]+1)+'%',(100-fp[2])+'%',(fp[2]*10)+'%',(fp[2]+5)+'%'],4), answer:ans2 });
          } else if(t===3){ var P=rand(1,20)*1000, rt=pickOne([2,3,4,5]), yr=rand(1,3), lx=P*rt/100*yr;
            r.push({ q:'把 '+P+' 元存入银行，年利率 '+rt+'%，存 '+yr+' 年，到期利息是（ ）元。',
              options:opts(lx,[P*rt/100,lx+P,lx*10,lx+10],4), answer:String(lx) });
          } else if(t===4){ var pr=rand(2,40)*10, z2=rand(5,9), now=pr*z2/10;
            r.push({ q:'一件衣服原价 '+pr+' 元，打 '+z2+' 折后卖（ ）元。',
              options:opts(now,[pr-z2,pr*z2,now+10,now-10],4), answer:String(now) });
          } else if(t===5){ var rr=pickOne(rates), tot=rr.t, live=rand(Math.ceil(tot*0.6),tot), pct=live*rr.m;
            r.push({ q:'种下 '+tot+' 棵树，活了 '+live+' 棵，成活率是（ ）%。',
              options:opts(pct,[live,tot-live,pct+1,pct-1],4), answer:String(pct) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_07', subject:'shuxue', grade:6, name:'圆柱和圆锥', icon:'🥫', desc:'圆柱 πr²h · 圆锥 πr²h÷3',
      make:function(n){
        var bank=[
          { q:'圆柱的侧面展开后是一个（ ）。', a:'长方形', d:['正方形','圆','三角形'] },
          { q:'圆柱有（ ）个底面。', a:2, d:[1,3,4] },
          { q:'圆锥有（ ）个底面。', a:1, d:[2,3,0] },
          { q:'等底等高的圆锥体积是圆柱体积的（ ）。', a:'1/3', d:['1/2','2/3','3 倍'] },
          { q:'等底等高的圆柱体积是圆锥体积的（ ）倍。', a:3, d:[2,6,9] },
          { q:'圆柱两个底面之间的距离叫做圆柱的（ ）。', a:'高', d:['半径','直径','侧面积'] },
          { q:'从圆锥的顶点到底面圆心的距离是圆锥的（ ）。', a:'高', d:['半径','母线','侧面积'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var r1=rand(1,6), h1=rand(2,10), v=Number(fmt(3.14*r1*r1*h1));
            r.push({ q:'一个圆柱，底面半径 '+r1+' 厘米，高 '+h1+' 厘米，体积是（ ）立方厘米。（π 取 3.14）',
              options:opts(fmt(v),[fmt(v/3),fmt(2*3.14*r1*h1),fmt(v+1),fmt(v/2)],4), answer:fmt(v) });
          } else if(t===1){ var r2=rand(1,6), h2=rand(1,4)*3, v2=Number(fmt(3.14*r2*r2*h2/3));
            r.push({ q:'一个圆锥，底面半径 '+r2+' 厘米，高 '+h2+' 厘米，体积是（ ）立方厘米。（π 取 3.14）',
              options:opts(fmt(v2),[fmt(v2*3),fmt(v2*2),fmt(v2+1),fmt(v2/2)],4), answer:fmt(v2) });
          } else if(t===2){ var r3=rand(1,6), h3=rand(2,10), sv=Number(fmt(2*3.14*r3*h3));
            r.push({ q:'一个圆柱，底面半径 '+r3+' 厘米，高 '+h3+' 厘米，侧面积是（ ）平方厘米。（π 取 3.14）',
              options:opts(fmt(sv),[fmt(3.14*r3*h3),fmt(3.14*r3*r3),fmt(sv+1),fmt(sv/2)],4), answer:fmt(sv) });
          } else if(t===3){ var s4=rand(5,40), h4=rand(2,12), v4=s4*h4;
            r.push({ q:'一个圆柱的底面积是 '+s4+' 平方厘米，高是 '+h4+' 厘米，体积是（ ）立方厘米。',
              options:opts(v4,[s4+h4,v4/2,v4*3,v4+10],4), answer:String(v4) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_08', subject:'shuxue', grade:6, name:'比例', icon:'🗺️', desc:'解比例 · 比例尺 · 正反比例',
      make:function(n){
        var bank=[
          { q:'在比例里，两个外项的积（ ）两个内项的积。', a:'等于', d:['大于','小于','不一定等于'] },
          { q:'表示两个比相等的式子叫做（ ）。', a:'比例', d:['比','方程','比值'] },
          { q:'路程一定，速度和时间成（ ）。', a:'反比例', d:['正比例','不成比例','相等'] },
          { q:'单价一定，总价和数量成（ ）。', a:'正比例', d:['反比例','不成比例','相等'] },
          { q:'每天看的页数一定，看的天数和总页数成（ ）。', a:'正比例', d:['反比例','不成比例','相等'] },
          { q:'总页数一定，每天看的页数和需要的天数成（ ）。', a:'反比例', d:['正比例','不成比例','相等'] },
          { q:'正方形的周长和它的边长成（ ）。', a:'正比例', d:['反比例','不成比例','相等'] },
          { q:'图上距离与实际距离的比叫做（ ）。', a:'比例尺', d:['比值','比例','线段比'] },
          { q:'比例尺 1 : 1000 表示图上 1 厘米相当于实际（ ）。', a:'10 米', d:['1000 米','100 米','1 米'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){
            var p=rand(2,9), q2=rand(2,9), m=rand(1,5), k=rand(1,5), x=p*m;
            r.push({ q:'解比例：<b>x : '+(q2*m)+' = '+(p*k)+' : '+(q2*k)+'</b>，x = （ ）',
              options:opts(x,[q2*m,p*k,x+1,x-1],4), answer:String(x) });
          } else if(t===1){
            var s=pickOne([1000,2000,5000,10000]), ansM=s/100;
            r.push({ q:'在比例尺 1 : '+s+' 的地图上，图上 1 厘米表示实际（ ）米。',
              options:opts(ansM,[s,s/10,ansM+1,ansM*10],4), answer:String(ansM) });
          } else if(t===2){
            var s2=pickOne([1000,2000,5000,10000]), cm=rand(2,9), real=cm*s2/100;
            r.push({ q:'比例尺是 1 : '+s2+'，图上距离 '+cm+' 厘米，实际距离是（ ）米。',
              options:opts(real,[cm*s2,real/10,real+10,real-10],4), answer:String(real) });
          } else if(t===3){
            var a=rand(2,9), b=rand(2,9);
            while(b===a){ b=rand(2,9); }
            var kk=rand(2,4), ans=(a*kk)+':'+(b*kk);
            r.push({ q:'下面哪个比能与 <b>'+a+' : '+b+'</b> 组成比例？（ ）',
              options:optsT(ans,[b+':'+a, a+':'+(b*kk), (a*kk)+':'+b, (a+kk)+':'+(b+kk)],4), answer:ans });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    /* ==================== 新增关卡（做厚） ==================== */
    { id:'sx2_08', subject:'shuxue', grade:2, name:'克与千克', icon:'⚖️', desc:'质量比较与估算',
      make:function(n){
        var bank=[
          { q:'一个鸡蛋大约重 60（ ）。', a:'克', d:['千克','米','升'] },
          { q:'一袋盐大约重 500（ ）。', a:'克', d:['千克','米','毫升'] },
          { q:'一头牛大约重 400（ ）。', a:'千克', d:['克','米','厘米'] },
          { q:'一瓶可乐大约重 500（ ）。', a:'克', d:['千克','升','米'] },
          { q:'1 千克 = （ ）克。', a:1000, d:[100,10,10000] },
          { q:'3 千克 = （ ）克。', a:3000, d:[300,30,30000] },
          { q:'5000 克 = （ ）千克。', a:5, d:[50,500,5000] },
          { q:'2 袋 500 克的盐一共重（ ）千克。', a:1, d:[2,10,100] },
          { q:'1 千克棉花和 1000 克铁相比，（ ）。', a:'一样重', d:['棉花重','铁重','没法比'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){
            // 用贴近生活的固定重量（随机值会让干扰项同样合理），干扰项取数量级差保证唯一解
            var objs=[['一个苹果',200],['一个桃子',150],['一块橡皮',10],['一个草莓',20],['一个鸡蛋',60],['一个橘子',100]];
            var o=pickOne(objs);
            var big=o[1]*10, small=Math.max(1,Math.round(o[1]/10)), huge=o[1]*100;
            r.push({ q:o[0]+'大约重（ ）克。',
              options:opts(o[1],[ big, small, huge ],4), answer:String(o[1]) });
          } else if(t===1){ var w=pickOne([2,3,4,5,6]);
            r.push({ q:w+' 千克 = （ ）克。', options:opts(w*1000,[ w*100, w*10, w*1000+100, w ],4), answer:String(w*1000) });
          } else if(t===2){ var g=pickOne([2000,3000,4000,5000]), k=g/1000;
            r.push({ q:g+' 克 = （ ）千克。', options:opts(k,[ g, k*10, k*100, k+1 ],4), answer:String(k) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx2_09', subject:'shuxue', grade:2, name:'倍的认识', icon:'🔁', desc:'求几倍 · 求倍数',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var base=rand(2,9), mul=rand(2,9), ans=base*mul;
            r.push(wordQ(function(){ return { q:'小明有 '+base+' 颗糖，小红的糖数是小明的 '+mul+' 倍，小红有（ ）颗。',
              a:ans, d:[ base+mul, base+mul*2, ans+1, ans-1 ], n:4 }; }));
          } else if(t===1){ var a=rand(2,9), b=rand(2,9), ans2=a*b;
            r.push({ q:'<b>'+a+' 的 '+b+' 倍是（ ）</b>', options:opts(ans2,[ a+b, a*b+1, a*b-1, a*2 ],4), answer:String(ans2), speak:a+'的'+b+'倍', speakLang:'zh-CN' });
          } else if(t===2){ var small=rand(2,6), ans3=rand(1,9), big=small*ans3;
            r.push(wordQ(function(){ return { q:big+' 是 '+small+' 的（ ）倍。', a:ans3, d:[ ans3+1, ans3-1, ans3+2, small ], n:4 }; }));
          } else if(t===3){ var unit=rand(2,6), cnt=rand(2,9), whole=unit*cnt;
            r.push(wordQ(function(){ return { q:whole+' 里面有（ ）个 '+unit+'。', a:cnt, d:[ cnt+1, cnt-1, unit, cnt+2 ], n:4 }; }));
          } else { var sm=rand(2,8), res=rand(2,8), full=sm*res;
            r.push(wordQ(function(){ return { q:'一个数的 '+sm+' 倍是 '+full+'，这个数是（ ）。', a:res, d:[ res+1, res-1, res*2, full ], n:4 }; }));
          }
        }
        return r;
      } },

    { id:'sx3_08', subject:'shuxue', grade:3, name:'两位数乘除进阶', icon:'✖️', desc:'两位数×两位数 · 估算',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var a=rand(11,99), b=rand(11,99), p=a*b;
            r.push({ q:'<b>'+a+' × '+b+' = （ ）</b>', options:opts(p,[ p-a, p-b, p+1, p-a-b ],4), answer:String(p) });
          } else if(t===1){ var a2=rand(100,999), c2=rand(11,99), p2=a2*c2;
            r.push({ q:'<b>'+a2+' × '+c2+' = （ ）</b>', options:opts(p2,[ p2-a2, p2-c2, p2+1, p2-a2-c2 ],4), answer:String(p2) });
          } else if(t===2){ var x=rand(11,99), y=rand(11,99), ex=Math.round(x/10)*10, ey=Math.round(y/10)*10, est=ex*ey;
            r.push({ q:'估算 <b>'+x+' × '+y+' ≈ （ ）</b>',
              options:opts(est,[ x*y, (ex+10)*ey, ex*(ey+10), est+10 ],4), answer:String(est) });
          } else { var d2=rand(11,99), q2=rand(2,9), a3=d2*q2;
            r.push({ q:'<b>'+a3+' ÷ '+d2+' = （ ）</b>', options:opts(q2,[ q2+1, q2-1, q2*2, d2 ],4), answer:String(q2) });
          }
        }
        return r;
      } },

    { id:'sx3_09', subject:'shuxue', grade:3, name:'小数初步·元角分', icon:'💰', desc:'元角分互化 · 小数',
      make:function(n){
        var bank=[
          { q:'1 元 = （ ）角。', a:10, d:[100,1,1000] },
          { q:'1 角 = （ ）分。', a:10, d:[100,1,1000] },
          { q:'1 元 = （ ）分。', a:100, d:[10,1000,10000] },
          { q:'2.5 元表示（ ）。', a:'2 元 5 角', d:['2 元 50 角','25 元','2 角 5 分'] },
          { q:'“元”和“角”之间的进率是（ ）。', a:10, d:[100,1000,1] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,4);
          if(t===0){ var yuan=rand(1,9), jiao=rand(1,9), total=yuan*10+jiao;
            r.push(wordQ(function(){ return { q:yuan+' 元 '+jiao+' 角 = （ ）角。', a:total, d:[ yuan+jiao, yuan*10, yuan+jiao*10, total+1 ], n:4 }; }));
          } else if(t===1){ var jl=rand(1,9)*10+rand(1,9), dec3=Number(fmt(jl/10));
            r.push({ q:jl+' 角 = （ ）元。', options:opts(fmt(dec3),[ fmt(jl), fmt(jl*10), fmt(dec3+1), fmt(dec3+0.1) ],4), answer:fmt(dec3) });
          } else if(t===2){ var a=rand(1,9), b=rand(1,9), dec=Number(fmt(a+b/10));
            r.push({ q:a+' 元 '+b+' 角 = （ ）元。', options:opts(fmt(dec),[ fmt(a+b), fmt(a/10+b), fmt(dec+1), fmt(dec+0.1) ],4), answer:fmt(dec) });
          } else if(t===3){ var c=rand(1,9), dec2=Number(fmt(c/10));
            r.push({ q:c+' 角 = （ ）元。', options:opts(fmt(dec2),[ fmt(c), fmt(c*10), fmt(dec2+0.1), fmt(dec2+1) ],4), answer:fmt(dec2) });
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx4_09', subject:'shuxue', grade:4, name:'三位数乘除', icon:'✖️', desc:'三位数×两位数 · 三位数÷两位数',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var a=rand(100,999), b=rand(2,9), p=a*b;
            r.push({ q:'<b>'+a+' × '+b+' = （ ）</b>', options:opts(p,[ p-a, p-b, p+1, p-a-b ],4), answer:String(p) });
          } else if(t===1){ var a2=rand(100,999), c2=rand(11,99), p2=a2*c2;
            r.push({ q:'<b>'+a2+' × '+c2+' = （ ）</b>', options:opts(p2,[ p2-a2, p2-c2, p2+1, p2-a2-c2 ],4), answer:String(p2) });
          } else if(t===2){ var d2=rand(12,49), q2=rand(2,20), rr=rand(1,d2-1), a3=d2*q2+rr;
            r.push({ q:'<b>'+a3+' ÷ '+d2+'</b> 的商是（ ）。', options:opts(q2,[ q2+1, q2-1, q2+2, rr ],4), answer:String(q2) });
          } else { var e=rand(100,999), dv=rand(2,9), q3=Math.floor(e/dv), rr2=e-dv*q3;
            if(rr2===0){ r.push({ q:'<b>'+e+' ÷ '+dv+' = （ ）</b>', options:opts(q3,[ q3+1, q3-1, q3+10, e ],4), answer:String(q3) }); }
            else { r.push({ q:'<b>'+e+' ÷ '+dv+'</b> 的余数是（ ）', options:opts(rr2,[ rr2+1, rr2-1, rr2+2, dv ],4), answer:String(rr2) }); }
          }
        }
        return r;
      } },

    { id:'sx4_10', subject:'shuxue', grade:4, name:'运算律简便计算', icon:'🔀', desc:'凑整 · 分配律应用',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var x=rand(2,9), a1=25*4*x;
            r.push({ q:'简便计算：<b>25 × 4 × '+x+' = （ ）</b>', options:opts(a1,[ a1+100, a1-100, 25*4+x, a1+10 ],4), answer:String(a1) });
          } else if(t===1){ var y=rand(2,9), a2=125*8*y;
            r.push({ q:'简便计算：<b>125 × 8 × '+y+' = （ ）</b>', options:opts(a2,[ a2+1000, a2-1000, 125*8+y, a2+100 ],4), answer:String(a2) });
          } else if(t===2){ var m=pickOne([99,102,98,101,49,51]), d2=rand(3,9), a3=m*d2;
            r.push(wordQ(function(){ return { q:'简便计算：'+m+' × '+d2+' = （ ）（看成整百加减几）', a:a3, d:[ 100*d2, a3+d2, a3-d2, a3+1 ], n:4 }; }));
          } else if(t===3){ var f=rand(2,9), g2=rand(11,99), a4=f*g2;
            r.push(wordQ(function(){ return { q:'用乘法分配律算：'+f+' × '+g2+' = （ ）', a:a4, d:[ f*10+g2, a4+f, a4-f, a4+10 ], n:4 }; }));
          } else if(t===4){ var p=rand(11,89), q=100-p, e=rand(11,99), a5=100+e;
            r.push(wordQ(function(){ return { q:p+' + '+e+' + '+q+' 用加法结合律 = （ ）', a:a5, d:[ a5+10, a5-10, p+q, a5+1 ], n:4 }; }));
          } else {
            var items=[
              { q:'“36 × 102”看作 36 ×（100 + 2），结果是（ ）。', a:3672, d:[3602,3692,3600] },
              { q:'“46 × 99 + 46”运用乘法分配律结果是（ ）。', a:4600, d:[4554,4646,4500] },
              { q:'“8 × 17 × 125”先算 8 × 125 = 1000，结果是（ ）。', a:17000, d:[1700,1368,100017] },
              { q:'“75 × 99 + 75”运用乘法分配律结果是（ ）。', a:7500, d:[7425,7575,750] }
            ];
            var it=pickOne(items);
            r.push({ q:it.q, options:opts(it.a,it.d,4), answer:String(it.a) });
          }
        }
        return r;
      } },

    { id:'sx5_09', subject:'shuxue', grade:5, name:'组合图形面积', icon:'🧩', desc:'割补法求面积',
      make:function(n){
        var r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,3);
          if(t===0){ var L=rand(6,15), W=rand(3,8), s=rand(2,5), a1=L*W+s*s;
            r.push(wordQ(function(){ return { q:'一个组合图形由一个长 '+L+' 厘米、宽 '+W+' 厘米的长方形和一个边长 '+s+' 厘米的正方形拼成，面积是（ ）平方厘米。',
              a:a1, d:[ L*W, s*s, a1+1, a1-1 ], n:4 }; }));
          } else if(t===1){ var Big=rand(8,15), Bh=rand(6,12), sm=rand(2,5), a2=Big*Bh - sm*sm;
            r.push(wordQ(function(){ return { q:'一个长 '+Big+' 厘米、宽 '+Bh+' 厘米的长方形，中间挖去一个边长 '+sm+' 厘米的正方形，剩下面积是（ ）平方厘米。',
              a:a2, d:[ Big*Bh, sm*sm, a2+1, a2-1 ], n:4 }; }));
          } else if(t===2){ var r1=rand(3,8), l1=rand(4,10), r2=rand(2,r1-1), r3=rand(2,6), a3=r1*l1 + r2*r3;
            r.push(wordQ(function(){ return { q:'两个长方形拼成图形：一个长 '+r1+' 厘米、宽 '+l1+' 厘米，另一个长 '+r2+' 厘米、宽 '+r3+' 厘米，总面积是（ ）平方厘米。',
              a:a3, d:[ r1*l1, r2*r3, a3+1, a3-1 ], n:4 }; }));
          } else { var side=rand(4,10), tri=rand(3,9), hgt=rand(1,4)*2, a4=side*side + tri*hgt/2;
            r.push(wordQ(function(){ return { q:'一个边长 '+side+' 厘米的正方形和一个底 '+tri+' 厘米、高 '+hgt+' 厘米的三角形拼成图形，面积是（ ）平方厘米。',
              a:a4, d:[ side*side, tri*hgt/2, a4+1, a4-1 ], n:4 }; }));
          }
        }
        return r;
      } },

    { id:'sx5_10', subject:'shuxue', grade:5, name:'因数倍数·质数合数', icon:'🔢', desc:'倍数特征 · 质合数',
      make:function(n){
        var primes=[2,3,5,7,11,13,17,19,23,29,31];
        var comps=[4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30];
        var bank=[
          { q:'最小的质数是（ ）。', a:2, d:[1,0,3] },
          { q:'最小的合数是（ ）。', a:4, d:[2,1,3] },
          { q:'（ ）既不是质数也不是合数。', a:'1', d:['0','2','3'] },
          { q:'既是 2 的倍数又是 5 的倍数的数，个位一定是（ ）。', a:'0', d:['2','5','1'] },
          { q:'2 的倍数的特征是个位上是（ ）。', a:'0、2、4、6、8', d:['1、3、5、7、9','0、5','偶数'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var p=pickOne(primes), ds=shuffle(comps).slice(0,3);
            r.push({ q:'下面哪个数是质数？（ ）', options:optsT(String(p), ds.map(String), 4), answer:String(p) });
          } else if(t===1){ var c=pickOne(comps), dp=shuffle(primes).slice(0,3);
            r.push({ q:'下面哪个数是合数？（ ）', options:optsT(String(c), dp.map(String), 4), answer:String(c) });
          } else if(t===2){ var num=rand(2,15), cnt=0;
            for(var j=1;j<=num;j++){ if(num%j===0) cnt++; }
            r.push(wordQ(function(){ return { q:num+' 的因数有（ ）个。', a:cnt, d:[ cnt+1, cnt-1, cnt+2, 2 ], n:4 }; }));
          } else if(t===3){ var base2=rand(2,9), mul=rand(2,9); while(mul===base2) mul=rand(2,9);
            var ans3=base2*mul;
            // 干扰项必须「不是」ans3 的因数，否则会出现多个正确答案
            var fac3=[]; for(var f3=1;f3<=ans3;f3++){ if(ans3%f3===0) fac3.push(f3); }
            var ds3=[], cand3=2;
            while(ds3.length<3 && cand3<=300){
              if(fac3.indexOf(cand3)<0 && ds3.indexOf(cand3)<0 && cand3!==base2) ds3.push(cand3);
              cand3++;
            }
            r.push(wordQ(function(){ return { q:ans3+' 是下面哪个数的倍数？（ ）', a:base2, d:ds3, n:4 }; }));
          } else if(t===4){ var a4=rand(2,9), b4=rand(2,9); while(b4===a4) b4=rand(2,9);
            var g=a4; while(g>1){ if(a4%g===0 && b4%g===0) break; g--; }
            r.push(wordQ(function(){ return { q:a4+' 和 '+b4+' 的最大公因数是（ ）。', a:g, d:[ g+1, g-1, a4, b4 ], n:4 }; }));
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_09', subject:'shuxue', grade:6, name:'百分数应用', icon:'💯', desc:'折扣 · 成数 · 涨跌',
      make:function(n){
        var bank=[
          { q:'“打八折”就是按原价的（ ）出售。', a:'80%', d:['8%','20%','88%'] },
          { q:'“一成”用百分数表示是（ ）。', a:'10%', d:['1%','100%','11%'] },
          { q:'“减产三成”就是比去年减少（ ）。', a:'30%', d:['3%','300%','0.3%'] },
          { q:'0.75 化成百分数是（ ）。', a:'75%', d:['7.5%','750%','0.75%'] },
          { q:'要表示部分占总体的百分率，一般用（ ）统计图。', a:'扇形', d:['折线','条形','饼'] }
        ];
        var order=shuffle(bank), r=[];
        for(var i=0;i<n;i++){
          var t=rand(0,5);
          if(t===0){ var z=rand(1,9), ans1=z*10;
            r.push(wordQ(function(){ return { q:'商品打 '+z+' 折，就是按原价的（ ）% 出售。', a:ans1, d:[ z, 100-ans1, ans1+10, ans1-10 ].filter(function(x){return x>=0;}), n:4 }; }));
          } else if(t===1){ var pr=rand(2,40)*10, z2=rand(5,9), now=pr*z2/10;
            r.push(wordQ(function(){ return { q:'一件衣服原价 '+pr+' 元，打 '+z2+' 折后卖（ ）元。', a:now, d:[ pr-z2, pr*z2, now+10, now-10 ], n:4 }; }));
          } else if(t===2){ var base=rand(2,30)*10, up=rand(1,5), after=base*(1+up/10);
            r.push(wordQ(function(){ return { q:base+' 元的东西涨价 '+up+' 成，现价是（ ）元。', a:after, d:[ base+up, base*up/10, after+10, after-10 ], n:4 }; }));
          } else if(t===3){ var pr2=rand(2,50)*10, off=rand(1,5), now2=pr2*(1-off/10);
            r.push(wordQ(function(){ return { q:'一件商品原价 '+pr2+' 元，降价 '+off+' 折优惠，现价（ ）元。', a:now2, d:[ pr2-off, pr2*off/10, now2+10, now2-10 ], n:4 }; }));
          } else if(t===4){ var tot=rand(50,200), live=rand(Math.ceil(tot*0.5),tot), pct=Math.round(live/tot*100);
            r.push(wordQ(function(){ return { q:'种了 '+tot+' 棵树，活了 '+live+' 棵，成活率约（ ）%。', a:pct, d:[ live, tot-live, pct+1, pct-1 ], n:4 }; }));
          } else {
            r.push(bankQ(order[i % order.length]));
          }
        }
        return r;
      } },

    { id:'sx6_10', subject:'shuxue', grade:6, name:'统计图读图', icon:'📈', desc:'扇形 · 折线读图',
      make:function(n){
        var bank=[
          { q:'要表示各部分占总体的百分比，一般用（ ）统计图。', a:'扇形', d:['折线','条形','圆柱'] },
          { q:'要清楚地看出数量的增减变化，一般用（ ）统计图。', a:'折线', d:['扇形','条形','饼'] },
          { q:'折线统计图中，折线上升表示数量（ ）。', a:'增加', d:['减少','不变','无法确定'] },
          { q:'扇形统计图中，所有部分的百分比之和一定是（ ）%。', a:100, d:[50,360,90] },
          { q:'从（ ）统计图能很方便地看出各部分与总数的关系。', a:'扇形', d:['折线','条形','复式'] }
        ];
        var order=shuffle(bank), r=[];
        var types=pickN([0,1,2,3,4], n), bankIdx=0;
        for(var i=0;i<n;i++){
          var t=types[i % types.length];
          if(t===0){ var pct=rand(1,9)*10, ang=pct/100*360;
            r.push(wordQ(function(){ return { q:'扇形统计图中，占总体 '+pct+'% 的部分，对应圆心角是（ ）度。', a:ang, d:[ pct, 360-pct, ang+10, ang-10 ], n:4 }; }));
          } else if(t===1){ var ang2=pickOne([36,72,90,108,144,180]), pct2=ang2/360*100;
            r.push(wordQ(function(){ return { q:'圆心角为 '+ang2+'° 的扇形，占总体的（ ）%。', a:pct2, d:[ ang2, 100-pct2, pct2+10, pct2-10 ], n:4 }; }));
          } else if(t===2){
            var arr=[], cur=rand(10,50);
            for(var j=0;j<5;j++){ cur=cur+rand(-5,8); arr.push(cur); }
            var maxV=arr[0], minV=arr[0];
            for(var j2=1;j2<arr.length;j2++){ if(arr[j2]>maxV) maxV=arr[j2]; if(arr[j2]<minV) minV=arr[j2]; }
            r.push(wordQ(function(){ return { q:'折线统计图数据：'+arr.join('、')+'，最大值是（ ）。', a:maxV, d:[ minV, Math.round((maxV+minV)/2), maxV+1, maxV-1 ], n:4 }; }));
          } else if(t===3){
            r.push(judgeQ('折线统计图的折线下坡表示数量增加。', '错', ['对']));
          } else {
            r.push(bankQ(order[bankIdx % order.length])); bankIdx++;
          }
        }
        return r;
      } }
  ]);
})();
