/* 二年级~六年级 英语关卡（译林版，常州·江苏）——追加到 window.YY_LEVELS */
window.YY_LEVELS = window.YY_LEVELS || [];
(function () {
  function shuffle(a){var b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t;}return b;}
  function uniq(arr){var s={},o=[];arr.forEach(function(x){if(!s[x]){s[x]=1;o.push(x);}});return o;}
  // 生成选项：保证正确答案一定在选项里、且选项互不重复
  function opts(ans, distractors, n){
    var d = uniq(distractors.filter(function(x){return String(x)!==String(ans);})).slice(0, (n||4)-1);
    while(d.length < (n||4)-1){ d.push('word'+(d.length+1)); }
    return shuffle([String(ans)].concat(d));
  }
  function rand(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

  // qkey 判定：题干 + 配图 + 朗读，用于 mk 去重（避免单轮出现重复题）
  function qkeyOf(q){ return String(q.q||'') + '@@' + String(q.sub||'') + '@@' + String(q.speak||''); }

  // 单题生成（输入已选定的条目 t，干扰项从完整 pool 取，保证不同条目生成不同题）
  function vqT(pool, t){
    var dis = pool.filter(function(x){ return x.w !== t.w; }).map(function(x){ return x.w; });
    var n = Math.min(4, pool.length);
    return { q:(t.e ? '<span class="big-emoji">'+t.e+'</span> ' : '') + '‘'+t.cn+'’ 用英语怎么说？', sub:'', options:opts(t.w, dis, n), answer:t.w, speak:t.w, speakLang:'en-US' };
  }
  function lqT(pool, t){
    var dis = pool.filter(function(x){ return String(x.cn) !== String(t.cn); }).map(function(x){ return x.cn; });
    var n = Math.min(4, pool.length);
    return { q:'🔊 听发音，选出<b>中文意思</b>', sub:(t.e ? t.e+' ' : '')+'点击喇叭听单词', options:opts(t.cn, dis, n), answer:t.cn, speak:t.w, speakLang:'en-US' };
  }
  function sqT(pool, t){
    var dis = pool.filter(function(x){ return String(x.w) !== String(t.w); }).map(function(x){ return x.w; });
    var n = Math.min(4, pool.length);
    return { q:'💬 ' + (t.cn||''), sub:'选择正确的英文句子', options:opts(t.w, dis, n), answer:t.w, speak:t.w, speakLang:'en-US' };
  }
  function oddOneT(g){
    return { q:'🧩 选出<b>不同类</b>的一个', sub:'Which one doesn\'t belong?', options:shuffle(g.items.slice(0,4)), answer:g.odd, speak:'', speakLang:'zh-CN' };
  }
  // 无放回取「恰好 n 个」不同条目：先打乱取前 n，池不足时循环补足，保证 make(n).length === n
  function pickN(pool, n){
    var base = shuffle(pool), out = [];
    for (var i=0; i<n; i++) out.push(base[i % base.length]);
    return out;
  }
  function vqN(pool, n){ return pickN(pool, n).map(function(t){ return vqT(pool, t); }); }
  function lqN(pool, n){ return pickN(pool, n).map(function(t){ return lqT(pool, t); }); }
  function sqN(pool, n){ return pickN(pool, n).map(function(t){ return sqT(pool, t); }); }
  function oddOneN(pool, n){ return pickN(pool, n).map(oddOneT); }
  // 兼容旧单题调用（供 mk 内单题生成器使用）
  function vq(pool){ return vqT(pool, pool[rand(0, pool.length-1)]); }
  function lq(pool){ return lqT(pool, pool[rand(0, pool.length-1)]); }
  function sq(pool){ return sqT(pool, pool[rand(0, pool.length-1)]); }
  function oddOne(pool){ return oddOneT(pool[rand(0, pool.length-1)]); }
  // mk：交替调用各单题生成器，逐题 qkey 去重（重复则重抽，最多重试 12 次）
  function mk(gens){ return function(n){ var r=[], used={};
    for (var i=0; i<n; i++){
      var g = gens[i % gens.length], q, tries = 0;
      do { q = g(); tries++; } while (used[qkeyOf(q)] && tries < 12);
      used[qkeyOf(q)] = 1; r.push(q);
    }
    return r;
  }; }

  /* ===================== 二年级 ===================== */
  var G2_SCHOOL = [
    {w:'schoolbag',cn:'书包',e:'🎒'},{w:'book',cn:'书',e:'📕'},{w:'pencil',cn:'铅笔',e:'✏️'},
    {w:'ruler',cn:'尺子',e:'📏'},{w:'rubber',cn:'橡皮',e:'🧽'},{w:'pencil-case',cn:'铅笔袋',e:'📦'},
    {w:'crayon',cn:'蜡笔',e:'🖍️'},{w:'eraser',cn:'橡皮擦',e:'🧼'},{w:'classroom',cn:'教室',e:'🏫'},
    {w:'desk',cn:'书桌',e:'🪑'},{w:'chair',cn:'椅子',e:'💺'},{w:'pen',cn:'钢笔',e:'🖊️'},
    {w:'bag',cn:'包',e:'👜'},{w:'sharpener',cn:'卷笔刀',e:'🌀'}
  ];
  var G2_FAMILY = [
    {w:'father',cn:'爸爸',e:'👨'},{w:'mother',cn:'妈妈',e:'👩'},{w:'brother',cn:'哥哥/弟弟',e:'👦'},
    {w:'sister',cn:'姐姐/妹妹',e:'👧'},{w:'grandpa',cn:'爷爷',e:'👴'},{w:'grandma',cn:'奶奶',e:'👵'},
    {w:'family',cn:'家庭',e:'👪'},{w:'parent',cn:'父母',e:'👨‍👩‍👧'},{w:'this',cn:'这',e:'👉'},
    {w:'that',cn:'那',e:'👈'},{w:'boy',cn:'男孩',e:'👦'},{w:'girl',cn:'女孩',e:'👧'},
    {w:'who',cn:'谁',e:'❓'},{w:'me',cn:'我',e:'🙋'},{w:'friend',cn:'朋友',e:'🤝'}
  ];
  var G2_SEASON = [
    {w:'spring',cn:'春天',e:'🌸'},{w:'summer',cn:'夏天',e:'☀️'},{w:'autumn',cn:'秋天',e:'🍂'},
    {w:'winter',cn:'冬天',e:'❄️'},{w:'sunny',cn:'晴朗的',e:'🌞'},{w:'rainy',cn:'下雨的',e:'🌧️'},
    {w:'snowy',cn:'下雪的',e:'⛄'},{w:'hot',cn:'热的',e:'🔥'},{w:'cold',cn:'冷的',e:'🥶'},
    {w:'warm',cn:'温暖的',e:'🌡️'},{w:'cool',cn:'凉爽的',e:'🍃'},{w:'windy',cn:'刮风的',e:'🌬️'},
    {w:'cloudy',cn:'多云的',e:'☁️'},{w:'weather',cn:'天气',e:'🌤️'}
  ];
  var G2_TRAFFIC = [
    {w:'car',cn:'小汽车',e:'🚗'},{w:'bus',cn:'公交车',e:'🚌'},{w:'bike',cn:'自行车',e:'🚲'},
    {w:'train',cn:'火车',e:'🚆'},{w:'plane',cn:'飞机',e:'✈️'},{w:'boat',cn:'小船',e:'⛵'},
    {w:'subway',cn:'地铁',e:'🚇'},{w:'ship',cn:'轮船',e:'🚢'},{w:'taxi',cn:'出租车',e:'🚕'},
    {w:'on foot',cn:'步行',e:'🚶'},{w:'by car',cn:'乘汽车',e:'🚙'},{w:'by bus',cn:'乘公交',e:'🚌'},
    {w:'by bike',cn:'骑自行车',e:'🚴'}
  ];
  var G2_PREP = [
    {w:'in',cn:'在…里'},{w:'on',cn:'在…上'},{w:'under',cn:'在…下'},{w:'up',cn:'向上',e:'⬆️'},
    {w:'down',cn:'向下',e:'⬇️'},{w:'left',cn:'左边',e:'⬅️'},{w:'right',cn:'右边',e:'➡️'},
    {w:'behind',cn:'在…后',e:'🔙'},{w:'between',cn:'在…之间',e:'↔️'},{w:'near',cn:'在…附近',e:'📍'},
    {w:'in front of',cn:'在…前面',e:'🔝'},{w:'beside',cn:'在…旁边',e:'➡️'},
    {w:'above',cn:'在…上方',e:'🔼'},{w:'below',cn:'在…下方',e:'🔽'}
  ];
  var G2_COLOR = [
    {w:'red',cn:'红色',e:'🟥'},{w:'blue',cn:'蓝色',e:'🟦'},{w:'yellow',cn:'黄色',e:'🟨'},
    {w:'green',cn:'绿色',e:'🟩'},{w:'black',cn:'黑色',e:'⚫'},{w:'white',cn:'白色',e:'⚪'},
    {w:'brown',cn:'棕色',e:'🟤'},{w:'purple',cn:'紫色',e:'🟪'},{w:'circle',cn:'圆形',e:'⚪'},
    {w:'square',cn:'方形',e:'◼️'},{w:'triangle',cn:'三角形',e:'🔺'},{w:'star',cn:'星形',e:'⭐'},
    {w:'heart',cn:'心形',e:'💗'},{w:'rectangle',cn:'长方形',e:'▭'},{w:'oval',cn:'椭圆形',e:'🥚'}
  ];

  /* ===================== 三年级 ===================== */
  var G3_GREET = [
    {w:'Hello',cn:'你好'},{w:'Good morning',cn:'早上好'},{w:'Good afternoon',cn:'下午好'},
    {w:'Good evening',cn:'晚上好'},{w:'Goodbye',cn:'再见'},{w:'See you',cn:'回头见'},
    {w:'I\'m...',cn:'我是…'},{w:'Nice to meet you',cn:'很高兴认识你'},{w:'How are you?',cn:'你好吗？'},
    {w:'I\'m fine.',cn:'我很好。'},{w:'Thank you.',cn:'谢谢。'},{w:'You\'re welcome.',cn:'不客气。'},
    {w:'What\'s your name?',cn:'你叫什么名字？'},{w:'My name is...',cn:'我的名字是…'}
  ];
  var G3_FRIEND = [
    {w:'he',cn:'他'},{w:'she',cn:'她'},{w:'friend',cn:'朋友'},{w:'My friend is a boy.',cn:'我的朋友是个男孩'},
    {w:'classmate',cn:'同学'},{w:'Miss',cn:'小姐'},{w:'Mr',cn:'先生'},{w:'tall',cn:'高的'},
    {w:'short',cn:'矮的'},{w:'thin',cn:'瘦的'},{w:'fat',cn:'胖的'},{w:'hair',cn:'头发'},
    {w:'good',cn:'好的'},{w:'too',cn:'也'}
  ];
  var G3_FAMILY = [
    {w:'father',cn:'爸爸'},{w:'mother',cn:'妈妈'},{w:'brother',cn:'哥哥/弟弟'},{w:'sister',cn:'姐姐/妹妹'},
    {w:'me',cn:'我'},{w:'This is my...',cn:'这是我的…'},{w:'who',cn:'谁'},{w:'grandfather',cn:'爷爷'},
    {w:'grandmother',cn:'奶奶'},{w:'family',cn:'家庭'},{w:'parents',cn:'父母'},{w:'son',cn:'儿子'},
    {w:'daughter',cn:'女儿'},{w:'baby',cn:'婴儿'}
  ];
  var G3_CLOTHES = [
    {w:'T-shirt',cn:'T恤'},{w:'skirt',cn:'短裙'},{w:'dress',cn:'连衣裙'},{w:'cap',cn:'帽子'},
    {w:'red',cn:'红色'},{w:'blue',cn:'蓝色'},{w:'What colour?',cn:'什么颜色？'},{w:'clothes',cn:'衣服'},
    {w:'new',cn:'新的'},{w:'old',cn:'旧的'},{w:'nice',cn:'好看的'},{w:'look at',cn:'看'},
    {w:'they',cn:'它们'},{w:'shirt',cn:'衬衫'}
  ];
  var G3_NUMBER = [
    {w:'thirteen',cn:'13'},{w:'fourteen',cn:'14'},{w:'fifteen',cn:'15'},{w:'sixteen',cn:'16'},
    {w:'seventeen',cn:'17'},{w:'eighteen',cn:'18'},{w:'nineteen',cn:'19'},{w:'eleven',cn:'11'},
    {w:'twelve',cn:'12'},{w:'ten',cn:'10'},{w:'one',cn:'1'},{w:'two',cn:'2'},
    {w:'three',cn:'3'},{w:'how old',cn:'几岁'}
  ];
  var G3_ANIMAL = [
    {w:'cat',cn:'猫',e:'🐱'},{w:'dog',cn:'狗',e:'🐶'},{w:'lion',cn:'狮子',e:'🦁'},
    {w:'panda',cn:'熊猫',e:'🐼'},{w:'monkey',cn:'猴子',e:'🐵'},{w:'bird',cn:'鸟',e:'🐦'},
    {w:'elephant',cn:'大象',e:'🐘'},{w:'tiger',cn:'老虎',e:'🐯'},{w:'bear',cn:'熊',e:'🐻'},
    {w:'cow',cn:'奶牛',e:'🐮'},{w:'pig',cn:'猪',e:'🐷'},{w:'duck',cn:'鸭子',e:'🦆'},
    {w:'rabbit',cn:'兔子',e:'🐰'},{w:'fish',cn:'鱼',e:'🐟'}
  ];
  var G3_FOOD = [
    {w:'apple',cn:'苹果',e:'🍎'},{w:'banana',cn:'香蕉',e:'🍌'},{w:'milk',cn:'牛奶',e:'🥛'},
    {w:'bread',cn:'面包',e:'🍞'},{w:'egg',cn:'鸡蛋',e:'🥚'},{w:'rice',cn:'米饭',e:'🍚'},
    {w:'orange',cn:'橙子',e:'🍊'},{w:'cake',cn:'蛋糕',e:'🍰'},{w:'sweet',cn:'糖果',e:'🍬'},
    {w:'pie',cn:'派',e:'🥧'},{w:'hot dog',cn:'热狗',e:'🌭'},{w:'juice',cn:'果汁',e:'🧃'},
    {w:'water',cn:'水',e:'💧'},{w:'meat',cn:'肉',e:'🍖'}
  ];

  /* ===================== 四年级 ===================== */
  var G4_CAN = [
    {w:'I can swim.',cn:'我会游泳'},{w:'I can run.',cn:'我会跑'},{w:'I can jump.',cn:'我会跳'},
    {w:'I can skate.',cn:'我会滑冰'},{w:'I can play basketball.',cn:'我会打篮球'},{w:'Can you...?',cn:'你会…吗？'},
    {w:'I can sing.',cn:'我会唱歌'},{w:'I can dance.',cn:'我会跳舞'},{w:'I can draw.',cn:'我会画画'},
    {w:'I can fly.',cn:'我会飞'},{w:'I can\'t swim.',cn:'我不会游泳'},{w:'I can\'t fly.',cn:'我不会飞'},
    {w:'Can you swim?',cn:'你会游泳吗？'},{w:'play football',cn:'踢足球'}
  ];
  var G4_HOME = [
    {w:'Where\'s...?',cn:'…在哪里？(单数)'},{w:'Where are...?',cn:'…在哪里？(复数)'},{w:'table',cn:'桌子'},
    {w:'sofa',cn:'沙发'},{w:'bed',cn:'床'},{w:'fridge',cn:'冰箱'},{w:'living room',cn:'客厅'},{w:'bedroom',cn:'卧室'},
    {w:'kitchen',cn:'厨房'},{w:'bathroom',cn:'浴室'},{w:'clock',cn:'钟'},{w:'window',cn:'窗户'},
    {w:'door',cn:'门'},{w:'chair',cn:'椅子'}
  ];
  var G4_FOOD = [
    {w:'What would you like?',cn:'你想要点什么？'},{w:'hamburger',cn:'汉堡'},{w:'sandwich',cn:'三明治'},
    {w:'rice',cn:'米饭'},{w:'noodles',cn:'面条'},{w:'ice cream',cn:'冰淇淋'},{w:'apple',cn:'苹果'},
    {w:'banana',cn:'香蕉'},{w:'eat',cn:'吃'},{w:'drink',cn:'喝'},{w:'grape',cn:'葡萄',e:'🍇'},
    {w:'orange',cn:'橙子'},{w:'cake',cn:'蛋糕'},{w:'hungry',cn:'饿的'}
  ];
  var G4_PRICE = [
    {w:'five yuan',cn:'5元'},{w:'nine yuan',cn:'9元'},{w:'twelve yuan',cn:'12元'},
    {w:'nineteen yuan',cn:'19元'},{w:'twenty yuan',cn:'20元'},{w:'thirty yuan',cn:'30元'},
    {w:'How much?',cn:'多少钱？'},{w:'one yuan',cn:'1元'},{w:'ten yuan',cn:'10元'},
    {w:'cheap',cn:'便宜的'},{w:'expensive',cn:'贵的'},{w:'fifty yuan',cn:'50元'},
    {w:'sixty yuan',cn:'60元'},{w:'How much is it?',cn:'它多少钱？'}
  ];
  var G4_CLOTHES = [
    {w:'dress',cn:'连衣裙'},{w:'shirt',cn:'衬衫'},{w:'trousers',cn:'裤子'},
    {w:'shoes',cn:'鞋子'},{w:'socks',cn:'袜子'},{w:'coat',cn:'外套'},{w:'hat',cn:'帽子'},
    {w:'sweater',cn:'毛衣'},{w:'shorts',cn:'短裤'},{w:'shoe',cn:'鞋'},{w:'glove',cn:'手套'},
    {w:'put on',cn:'穿上'},{w:'take off',cn:'脱下'},{w:'my',cn:'我的'}
  ];
  var G4_SEASON = [
    {w:'spring',cn:'春天'},{w:'summer',cn:'夏天'},{w:'autumn',cn:'秋天'},{w:'winter',cn:'冬天'},
    {w:'Which season?',cn:'哪个季节？'},{w:'It\'s...',cn:'天气是…'},{w:'I like...',cn:'我喜欢…'},
    {w:'sunny',cn:'晴朗的'},{w:'cloudy',cn:'多云的'},{w:'windy',cn:'刮风的'},{w:'cold',cn:'寒冷的'},
    {w:'hot',cn:'炎热的'},{w:'warm',cn:'温暖的'},{w:'cool',cn:'凉爽的'}
  ];
  var G4_JOB = [
    {w:'doctor',cn:'医生'},{w:'nurse',cn:'护士'},{w:'teacher',cn:'老师'},{w:'worker',cn:'工人'},
    {w:'farmer',cn:'农民'},{w:'engineer',cn:'工程师'},{w:'driver',cn:'司机'},{w:'cook',cn:'厨师'},
    {w:'policeman',cn:'警察'},{w:'student',cn:'学生'},{w:'firefighter',cn:'消防员'},{w:'writer',cn:'作家'}
  ];

  /* ===================== 五年级 ===================== */
  var G5_ANIMAL = [
    {w:'The elephant is big.',cn:'大象很大'},{w:'The rabbit is small.',cn:'兔子很小'},
    {w:'The monkey has a long tail.',cn:'猴子有长尾巴'},{w:'The dog is short.',cn:'狗很矮'},
    {w:'It has big ears.',cn:'它有大耳朵'},{w:'It has small eyes.',cn:'它有小眼睛'},
    {w:'It has a long nose.',cn:'它有长鼻子'},{w:'It has a short tail.',cn:'它有短尾巴'},
    {w:'The cat is fat.',cn:'猫很胖'},{w:'The bird is small.',cn:'鸟很小'},
    {w:'It has four legs.',cn:'它有四条腿'},{w:'Its eyes are red.',cn:'它的眼睛是红的'},
    {w:'The panda is cute.',cn:'熊猫很可爱'}
  ];
  var G5_CLOTHES = [
    {w:'try on',cn:'试穿'},{w:'shoes',cn:'鞋'},{w:'gloves',cn:'手套'},
    {w:'Whose gloves are these?',cn:'这些是谁的手套？'},{w:'These are my gloves.',cn:'这些是我的手套'},{w:'Whose...',cn:'谁的…'},
    {w:'coat',cn:'外套'},{w:'shirt',cn:'衬衫'},{w:'trousers',cn:'裤子'},{w:'sweater',cn:'毛衣'},
    {w:'too big',cn:'太大'},{w:'too small',cn:'太小'},{w:'put on',cn:'穿上'}
  ];
  var G5_FESTIVAL = [
    {w:'Christmas',cn:'圣诞节'},{w:'New Year',cn:'新年'},{w:'birthday',cn:'生日'},
    {w:'Happy birthday!',cn:'生日快乐！'},{w:'Happy New Year!',cn:'新年快乐！'},{w:'present',cn:'礼物'},
    {w:'Spring Festival',cn:'春节'},{w:'Dragon Boat Festival',cn:'端午节'},{w:'Mid-Autumn Festival',cn:'中秋节'},
    {w:'moon cake',cn:'月饼',e:'🥮'},{w:'tree',cn:'树',e:'🌲'},{w:'get together',cn:'团聚'}
  ];
  var G5_HOWMANY = [
    {w:'There is a book.',cn:'有一本书'},{w:'There are two apples.',cn:'有两个苹果'},
    {w:'How many...?',cn:'多少…？'},{w:'How many books?',cn:'多少本书？'},{w:'There is an apple.',cn:'有一个苹果'},
    {w:'There are three cats.',cn:'有三只猫'},{w:'How many boys?',cn:'多少个男孩？'},{w:'How many girls?',cn:'多少个女孩？'},
    {w:'There is a pen.',cn:'有一支笔'},{w:'There are some eggs.',cn:'有一些鸡蛋'},{w:'a lot of',cn:'许多'},
    {w:'many',cn:'很多'}
  ];
  var G5_FREQ = [
    {w:'often',cn:'经常'},{w:'usually',cn:'通常'},{w:'sometimes',cn:'有时'},{w:'always',cn:'总是'},
    {w:'never',cn:'从不'},{w:'I often read.',cn:'我经常阅读'},{w:'I usually run.',cn:'我通常跑步'},
    {w:'I sometimes swim.',cn:'我有时游泳'},{w:'every day',cn:'每天'},{w:'at weekends',cn:'在周末'},
    {w:'I always help.',cn:'我总是帮忙'},{w:'He never eats.',cn:'他从不吃'},{w:'She usually sings.',cn:'她通常唱歌'}
  ];
  var G5_MONTH = [
    {w:'January',cn:'一月'},{w:'February',cn:'二月'},{w:'March',cn:'三月'},{w:'April',cn:'四月'},
    {w:'May',cn:'五月'},{w:'June',cn:'六月'},{w:'July',cn:'七月'},{w:'August',cn:'八月'},
    {w:'September',cn:'九月'},{w:'October',cn:'十月'},{w:'November',cn:'十一月'},{w:'December',cn:'十二月'},
    {w:'Mother\'s Day',cn:'母亲节'},{w:'Children\'s Day',cn:'儿童节'}
  ];
  var G5_WAY = [
    {w:'Where\'s the library?',cn:'图书馆在哪里？'},{w:'How do I get to the park?',cn:'我怎么去公园？'},
    {w:'Go along this street.',cn:'沿着这条街走'},{w:'Turn left.',cn:'向左转'},{w:'Turn right.',cn:'向右转'},
    {w:'bus stop',cn:'公交站'},{w:'metro',cn:'地铁'},{w:'near',cn:'在附近'},{w:'far',cn:'远的'},
    {w:'Excuse me',cn:'打扰一下'},{w:'go straight',cn:'直走'},{w:'at the corner',cn:'在拐角'}
  ];

  /* ===================== 六年级 ===================== */
  var G6_PAST = [
    {q:'I ___ at school yesterday.', a:'was', cn:'我昨天在学校'},
    {q:'They ___ happy.', a:'were', cn:'他们很开心'},
    {q:'He ___ his homework.', a:'did', cn:'他做了作业'},
    {q:'We ___ at home.', a:'were', cn:'我们在家'},
    {q:'She ___ a student.', a:'was', cn:'她是个学生'},
    {q:'You ___ late.', a:'were', cn:'你迟到了'},
    {q:'I ___ the housework.', a:'did', cn:'我做了家务'}
  ];
  var G6_FUTURE = [
    {q:'I ___ go to the park.', a:'will', cn:'我要去公园'},
    {q:'I\'m ___ to swim.', a:'going', cn:'我打算去游泳'},
    {q:'He ___ play football.', a:'will', cn:'他要踢足球'},
    {q:'She is ___ to sing.', a:'going', cn:'她打算唱歌'},
    {q:'We ___ visit grandma.', a:'will', cn:'我们要去看奶奶'},
    {q:'They are ___ to read.', a:'going', cn:'他们打算读书'}
  ];
  var G6_HOBBY = [
    {w:'I like reading.',cn:'我喜欢阅读'},{w:'My hobby is drawing.',cn:'我的爱好是画画'},
    {w:'I want to be a teacher.',cn:'我想当老师'},{w:'I want to be a doctor.',cn:'我想当医生'},
    {w:'My dream is to fly.',cn:'我的梦想是飞'},{w:'What\'s your hobby?',cn:'你的爱好是什么？'},
    {w:'I like dancing.',cn:'我喜欢跳舞'},{w:'I like skating.',cn:'我喜欢滑冰'},{w:'He likes singing.',cn:'他喜欢唱歌'},
    {w:'play the piano',cn:'弹钢琴'},{w:'collect stamps',cn:'集邮'},{w:'make friends',cn:'交朋友'},
    {w:'both',cn:'两者都'}
  ];
  var G6_HEALTH = [
    {w:'You should drink water.',cn:'你应该喝水'},{w:'You should eat fruit.',cn:'你应该吃水果'},
    {w:'You shouldn\'t eat too much.',cn:'你不应该吃太多'},{w:'You should sleep early.',cn:'你应该早点睡'},
    {w:'You shouldn\'t watch TV.',cn:'你不应该看电视'},{w:'brush your teeth',cn:'刷牙'},
    {w:'wash your hands',cn:'洗手'},{w:'do exercise',cn:'锻炼'},{w:'eat vegetables',cn:'吃蔬菜'},
    {w:'go to bed early',cn:'早点睡觉'},{w:'drink milk',cn:'喝牛奶'},{w:'tired',cn:'累的'}
  ];
  var G6_FESTACT = [
    {w:'We have a Christmas party.',cn:'我们有圣诞派对'},{w:'We have a sports meeting.',cn:'我们有运动会'},
    {w:'We have a picnic.',cn:'我们去野餐'},{w:'Merry Christmas!',cn:'圣诞快乐！'},{w:'We have a big dinner.',cn:'我们吃大餐'},
    {w:'fireworks',cn:'烟花',e:'🎆'},{w:'get presents',cn:'收礼物'},{w:'sing songs',cn:'唱歌'},
    {w:'make a cake',cn:'做蛋糕'},{w:'watch fireworks',cn:'看烟花'},{w:'Halloween',cn:'万圣节'}
  ];
  var G6_NATURE = [
    {w:'sun',cn:'太阳',e:'☀️'},{w:'moon',cn:'月亮',e:'🌙'},{w:'star',cn:'星星',e:'⭐'},
    {w:'wind',cn:'风',e:'🌬️'},{w:'flower',cn:'花',e:'🌸'},{w:'tree',cn:'树',e:'🌳'},
    {w:'mountain',cn:'山',e:'⛰️'},{w:'river',cn:'河',e:'🌊'},{w:'lake',cn:'湖',e:'🏞️'},
    {w:'hill',cn:'小山',e:'🏔️'},{w:'grass',cn:'草',e:'🌿'},{w:'leaf',cn:'叶子',e:'🍃'}
  ];
  var G6_PLACE = [
    {w:'the Great Wall',cn:'长城'},{w:'Summer Palace',cn:'颐和园'},{w:'the Changjiang River',cn:'长江'},{w:'the West Lake',cn:'西湖'},
    {w:'Tian\'anmen',cn:'天安门'},{w:'the Bund',cn:'外滩'},{w:'the Palace Museum',cn:'故宫'},
    {w:'Tianning Temple',cn:'天宁寺'},{w:'Hongmei Park',cn:'红梅公园'},{w:'Dinosaur Park',cn:'恐龙园'},
    {w:'Yancheng',cn:'淹城'},{w:'Confucius Temple',cn:'夫子庙'}
  ];

  /* ===================== 二年级新增池 ===================== */
  var G2_ANIMALS = [
    {w:'cat',cn:'猫',e:'🐱'},{w:'dog',cn:'狗',e:'🐶'},{w:'fish',cn:'鱼',e:'🐟'},
    {w:'bird',cn:'鸟',e:'🐦'},{w:'rabbit',cn:'兔子',e:'🐰'},{w:'duck',cn:'鸭子',e:'🦆'},
    {w:'cow',cn:'奶牛',e:'🐮'},{w:'pig',cn:'猪',e:'🐷'},{w:'tiger',cn:'老虎',e:'🐯'},
    {w:'lion',cn:'狮子',e:'🦁'},{w:'panda',cn:'熊猫',e:'🐼'},{w:'monkey',cn:'猴子',e:'🐵'},
    {w:'elephant',cn:'大象',e:'🐘'},{w:'bear',cn:'熊',e:'🐻'},{w:'bee',cn:'蜜蜂',e:'🐝'},
    {w:'butterfly',cn:'蝴蝶',e:'🦋'}
  ];
  var G2_FOOD = [
    {w:'apple',cn:'苹果',e:'🍎'},{w:'banana',cn:'香蕉',e:'🍌'},{w:'egg',cn:'鸡蛋',e:'🥚'},
    {w:'milk',cn:'牛奶',e:'🥛'},{w:'bread',cn:'面包',e:'🍞'},{w:'rice',cn:'米饭',e:'🍚'},
    {w:'water',cn:'水',e:'💧'},{w:'juice',cn:'果汁',e:'🧃'},{w:'cake',cn:'蛋糕',e:'🍰'},
    {w:'orange',cn:'橙子',e:'🍊'},{w:'pear',cn:'梨',e:'🍐'},{w:'meat',cn:'肉',e:'🍖'},
    {w:'fish',cn:'鱼',e:'🐟'},{w:'sweet',cn:'糖果',e:'🍬'}
  ];
  var G2_ODD_ANIMALS = [
    {items:['cat','dog','bird','apple'], odd:'apple'},
    {items:['lion','tiger','panda','car'], odd:'car'},
    {items:['fish','duck','pig','book'], odd:'book'},
    {items:['cow','sheep','rabbit','pen'], odd:'pen'},
    {items:['monkey','bear','bee','desk'], odd:'desk'}
  ];

  /* ===================== 三年级新增池 ===================== */
  var G3_SUBJECT = [
    {w:'Chinese',cn:'语文'},{w:'Maths',cn:'数学'},{w:'English',cn:'英语'},{w:'Music',cn:'音乐'},
    {w:'Art',cn:'美术'},{w:'PE',cn:'体育'},{w:'Science',cn:'科学'},{w:'Computer Studies',cn:'计算机课'},
    {w:'subject',cn:'科目'},{w:'class',cn:'课'},{w:'timetable',cn:'课程表'},{w:'lesson',cn:'课程'},
    {w:'we',cn:'我们'},{w:'have',cn:'有'}
  ];
  var G3_BODY = [
    {w:'eye',cn:'眼睛',e:'👁️'},{w:'ear',cn:'耳朵',e:'👂'},{w:'nose',cn:'鼻子',e:'👃'},
    {w:'mouth',cn:'嘴巴',e:'👄'},{w:'face',cn:'脸'},{w:'hair',cn:'头发',e:'💇'},
    {w:'head',cn:'头'},{w:'hand',cn:'手',e:'✋'},{w:'arm',cn:'手臂',e:'💪'},
    {w:'leg',cn:'腿',e:'🦵'},{w:'foot',cn:'脚',e:'🦶'},{w:'body',cn:'身体'},
    {w:'big',cn:'大的'},{w:'small',cn:'小的'},{w:'long',cn:'长的'},{w:'short',cn:'短的'}
  ];
  var G3_ODD_BODY = [
    {items:['eye','ear','nose','apple'], odd:'apple'},
    {items:['hand','arm','leg','dog'], odd:'dog'},
    {items:['head','face','mouth','car'], odd:'car'},
    {items:['hair','foot','leg','book'], odd:'book'},
    {items:['eye','ear','nose','ruler'], odd:'ruler'}
  ];

  /* ===================== 四年级新增池 ===================== */
  var G4_ROUTINE = [
    {w:'get up',cn:'起床'},{w:'go to school',cn:'去上学'},{w:'have lunch',cn:'吃午饭'},
    {w:'go home',cn:'回家'},{w:'do homework',cn:'做作业'},{w:'go to bed',cn:'睡觉'},
    {w:'when',cn:'什么时候'},{w:'time',cn:'时间'},{w:'clock',cn:'钟',e:'🕐'},
    {w:'seven',cn:'七'},{w:'eight',cn:'八'},{w:'in the morning',cn:'在早上'},
    {w:'in the afternoon',cn:'在下午'},{w:'at night',cn:'在晚上'}
  ];
  var G4_WEEKEND = [
    {w:'go to the park',cn:'去公园'},{w:'watch TV',cn:'看电视'},{w:'do homework',cn:'做作业'},
    {w:'fly a kite',cn:'放风筝'},{w:'have a picnic',cn:'野餐'},{w:'play football',cn:'踢足球'},
    {w:'weekend',cn:'周末'},{w:'Saturday',cn:'星期六'},{w:'Sunday',cn:'星期天'},
    {w:'go swimming',cn:'去游泳'},{w:'read books',cn:'读书'},{w:'see a film',cn:'看电影'}
  ];

  /* ===================== 五年级新增池 ===================== */
  var G5_SHOPPING = [
    {w:'Can I help you?',cn:'我能帮您吗？'},{w:'I\'d like a dress.',cn:'我想要一条连衣裙。'},
    {w:'How much is it?',cn:'它多少钱？'},{w:'yuan',cn:'元'},{w:'cheap',cn:'便宜的'},
    {w:'expensive',cn:'贵的'},{w:'try on',cn:'试穿'},{w:'a pair of',cn:'一双'},
    {w:'shoe',cn:'鞋'},{w:'sock',cn:'袜子'},{w:'fifty yuan',cn:'50元'},
    {w:'too expensive',cn:'太贵了'},{w:'Here you are.',cn:'给您。'},{w:'What about this?',cn:'这个怎么样？'}
  ];
  var G5_ABILITY = [
    {w:'I can swim.',cn:'我会游泳'},{w:'I can sing.',cn:'我会唱歌'},{w:'I can dance.',cn:'我会跳舞'},
    {w:'I can jump.',cn:'我会跳'},{w:'I can run.',cn:'我会跑'},{w:'I can\'t fly.',cn:'我不会飞'},
    {w:'What can you do?',cn:'你会做什么？'},{w:'I can draw.',cn:'我会画画'},
    {w:'well',cn:'好'},{w:'can',cn:'能'},{w:'can\'t',cn:'不能'},
    {w:'play basketball',cn:'打篮球'},{w:'skate',cn:'滑冰'}
  ];

  /* ===================== 六年级新增池 ===================== */
  var G6_TRAVEL = [
    {w:'by plane',cn:'乘飞机',e:'✈️'},{w:'by train',cn:'乘火车',e:'🚆'},{w:'by bus',cn:'乘公交',e:'🚌'},
    {w:'visit',cn:'参观'},{w:'museum',cn:'博物馆',e:'🏛️'},{w:'holiday',cn:'假期'},
    {w:'travel',cn:'旅行'},{w:'take a photo',cn:'拍照',e:'📷'},{w:'summer holiday',cn:'暑假'},
    {w:'go to',cn:'去'},{w:'interesting',cn:'有趣的'},{w:'the Great Wall',cn:'长城'},
    {w:'plan',cn:'计划'},{w:'far from',cn:'离…远'}
  ];
  var G6_FESTIVAL = [
    {w:'Spring Festival',cn:'春节',e:'🧧'},{w:'Christmas',cn:'圣诞节',e:'🎄'},
    {w:'Dragon Boat Festival',cn:'端午节'},{w:'Mid-Autumn Festival',cn:'中秋节',e:'🌕'},
    {w:'Halloween',cn:'万圣节',e:'🎃'},{w:'festival',cn:'节日'},{w:'get together',cn:'团聚'},
    {w:'eat dumplings',cn:'吃饺子',e:'🥟'},{w:'watch fireworks',cn:'看烟花',e:'🎆'},
    {w:'favourite',cn:'最喜欢的'},{w:'we',cn:'我们'},{w:'rice cake',cn:'年糕'},
    {w:'zongzi',cn:'粽子',e:'🍙'},{w:'give presents',cn:'送礼物'}
  ];

  function pastQ(t){
    var forms = ['was','were','did'];
    var full = t.q.replace('___', t.a);
    return { q: t.q, sub:'💡 '+t.cn, options: opts(t.a, forms.filter(function(x){return x!==t.a;}), 3), answer: t.a, speak: full, speakLang:'en-US' };
  }
  function futureQ(t){
    var forms = ['will','going','can','do'];
    var full = t.q.replace('___', t.a);
    return { q: t.q, sub:'💡 '+t.cn, options: opts(t.a, forms.filter(function(x){return x!==t.a;}), 4), answer: t.a, speak: full, speakLang:'en-US' };
  }

  window.YY_LEVELS = (window.YY_LEVELS||[]).concat([
    /* ===== 二年级（6 关） ===== */
    { id:'yy2_01', subject:'yingyu', grade:2, name:'学校用品', icon:'🎒', desc:'bag·book·pencil·ruler·rubber',
      make:function(n){ return vqN(G2_SCHOOL, n); } },
    { id:'yy2_02', subject:'yingyu', grade:2, name:'家庭成员', icon:'👪', desc:'father·mother·brother·sister',
      make:function(n){ return vqN(G2_FAMILY, n); } },
    { id:'yy2_03', subject:'yingyu', grade:2, name:'季节与天气', icon:'🌤️', desc:'spring·summer·sunny·rainy',
      make:function(n){ return vqN(G2_SEASON, n); } },
    { id:'yy2_04', subject:'yingyu', grade:2, name:'交通工具', icon:'🚗', desc:'car·bus·bike·train·plane·boat',
      make:function(n){ return vqN(G2_TRAFFIC, n); } },
    { id:'yy2_05', subject:'yingyu', grade:2, name:'方位介词', icon:'🧭', desc:'in·on·under·up·down·left·right',
      make:function(n){ return vqN(G2_PREP, n); } },
    { id:'yy2_06', subject:'yingyu', grade:2, name:'颜色与形状', icon:'🎨', desc:'red·blue·circle·square·triangle',
      make:function(n){ return vqN(G2_COLOR, n); } },

    /* ===== 三年级（7 关） ===== */
    { id:'yy3_01', subject:'yingyu', grade:3, name:'问候与自我介绍', icon:'👋', desc:'Hello·Good morning·Nice to meet you',
      make:function(n){ return vqN(G3_GREET, n); } },
    { id:'yy3_02', subject:'yingyu', grade:3, name:'朋友', icon:'🤝', desc:'he·she·friend',
      make:function(n){ return vqN(G3_FRIEND, n); } },
    { id:'yy3_03', subject:'yingyu', grade:3, name:'家庭', icon:'🏠', desc:'father·mother·This is my...',
      make:function(n){ return vqN(G3_FAMILY, n); } },
    { id:'yy3_04', subject:'yingyu', grade:3, name:'服装与颜色', icon:'👕', desc:'T-shirt·skirt·What colour?',
      make:function(n){ return vqN(G3_CLOTHES, n); } },
    { id:'yy3_05', subject:'yingyu', grade:3, name:'数字 13~19', icon:'🔟', desc:'thirteen·fourteen·…·nineteen',
      make:function(n){ return vqN(G3_NUMBER, n); } },
    { id:'yy3_06', subject:'yingyu', grade:3, name:'动物', icon:'🐾', desc:'cat·dog·lion·panda·monkey·bird',
      make:function(n){ return vqN(G3_ANIMAL, n); } },
    { id:'yy3_07', subject:'yingyu', grade:3, name:'食物饮料', icon:'🍎', desc:'apple·banana·milk·bread·egg·rice',
      make:function(n){ return vqN(G3_FOOD, n); } },

    /* ===== 四年级（7 关） ===== */
    { id:'yy4_01', subject:'yingyu', grade:4, name:'能力 can', icon:'💪', desc:'I can swim·Can you...?',
      make:function(n){ return vqN(G4_CAN, n); } },
    { id:'yy4_02', subject:'yingyu', grade:4, name:'家居与位置', icon:'🛋️', desc:'Where\'s...?·table·bedroom',
      make:function(n){ return vqN(G4_HOME, n); } },
    { id:'yy4_03', subject:'yingyu', grade:4, name:'点餐', icon:'🍔', desc:'What would you like?·hamburger·noodles',
      make:function(n){ return vqN(G4_FOOD, n); } },
    { id:'yy4_04', subject:'yingyu', grade:4, name:'价格', icon:'💰', desc:'How much?·nineteen yuan',
      make:function(n){ return vqN(G4_PRICE, n); } },
    { id:'yy4_05', subject:'yingyu', grade:4, name:'衣物', icon:'👚', desc:'dress·shirt·trousers·shoes·coat',
      make:function(n){ return vqN(G4_CLOTHES, n); } },
    { id:'yy4_06', subject:'yingyu', grade:4, name:'季节天气', icon:'🌦️', desc:'Which season?·spring·I like...',
      make:function(n){ return vqN(G4_SEASON, n); } },
    { id:'yy4_07', subject:'yingyu', grade:4, name:'职业', icon:'👨‍⚕️', desc:'doctor·nurse·teacher·worker·farmer',
      make:function(n){ return vqN(G4_JOB, n); } },

    /* ===== 五年级（7 关） ===== */
    { id:'yy5_01', subject:'yingyu', grade:5, name:'动物特征', icon:'🐘', desc:'It has...·big·small·long',
      make:function(n){ return vqN(G5_ANIMAL, n); } },
    { id:'yy5_02', subject:'yingyu', grade:5, name:'服饰', icon:'🧤', desc:'try on·shoes·Whose...?',
      make:function(n){ return vqN(G5_CLOTHES, n); } },
    { id:'yy5_03', subject:'yingyu', grade:5, name:'节日', icon:'🎉', desc:'Christmas·birthday·Happy...',
      make:function(n){ return vqN(G5_FESTIVAL, n); } },
    { id:'yy5_04', subject:'yingyu', grade:5, name:'数量 how many', icon:'🔢', desc:'There is/are·How many...?',
      make:function(n){ return vqN(G5_HOWMANY, n); } },
    { id:'yy5_05', subject:'yingyu', grade:5, name:'活动频率', icon:'⏰', desc:'often·usually·sometimes·never',
      make:function(n){ return vqN(G5_FREQ, n); } },
    { id:'yy5_06', subject:'yingyu', grade:5, name:'月份与节日', icon:'📅', desc:'January~December·Children\'s Day',
      make:function(n){ return vqN(G5_MONTH, n); } },
    { id:'yy5_07', subject:'yingyu', grade:5, name:'问路', icon:'🗺️', desc:'Where\'s...?·Go along...',
      make:function(n){ return vqN(G5_WAY, n); } },

    /* ===== 六年级（7 关） ===== */
    { id:'yy6_01', subject:'yingyu', grade:6, name:'过去时', icon:'⏳', desc:'was·were·did',
      make:function(n){ return pickN(G6_PAST, n).map(pastQ); } },
    { id:'yy6_02', subject:'yingyu', grade:6, name:'将来时', icon:'🔮', desc:'will·be going to',
      make:function(n){ return pickN(G6_FUTURE, n).map(futureQ); } },
    { id:'yy6_03', subject:'yingyu', grade:6, name:'爱好与梦想', icon:'🌟', desc:'hobby·dream·I want to be...',
      make:function(n){ return vqN(G6_HOBBY, n); } },
    { id:'yy6_04', subject:'yingyu', grade:6, name:'健康建议', icon:'🥗', desc:'should·shouldn\'t',
      make:function(n){ return vqN(G6_HEALTH, n); } },
    { id:'yy6_05', subject:'yingyu', grade:6, name:'节日活动', icon:'🎄', desc:'We have...·picnic·sports meeting',
      make:function(n){ return vqN(G6_FESTACT, n); } },
    { id:'yy6_06', subject:'yingyu', grade:6, name:'自然', icon:'🌿', desc:'sun·moon·star·wind·flower·tree',
      make:function(n){ return vqN(G6_NATURE, n); } },
    { id:'yy6_07', subject:'yingyu', grade:6, name:'著名景点', icon:'🏯', desc:'长城·颐和园·长江',
      make:function(n){ return vqN(G6_PLACE, n); } },

    /* ===== 二年级新增（2 关） ===== */
    { id:'yy2_07', subject:'yingyu', grade:2, name:'动物乐园', icon:'🦁', desc:'听音/选词/不同类·动物词汇',
      make: mk([function(){return vq(G2_ANIMALS);}, function(){return oddOne(G2_ODD_ANIMALS);}]) },
    { id:'yy2_08', subject:'yingyu', grade:2, name:'饮食入门', icon:'🍎', desc:'听音选义·食物与饮料',
      make: mk([function(){return vq(G2_FOOD);}, function(){return lq(G2_FOOD);}]) },

    /* ===== 三年级新增（2 关） ===== */
    { id:'yy3_08', subject:'yingyu', grade:3, name:'学校课程', icon:'📚', desc:'选词/选句·学科名称',
      make: mk([function(){return vq(G3_SUBJECT);}, function(){return sq(G3_SUBJECT);}]) },
    { id:'yy3_09', subject:'yingyu', grade:3, name:'身体与特征', icon:'🧍', desc:'选词/不同类·身体部位',
      make: mk([function(){return vq(G3_BODY);}, function(){return oddOne(G3_ODD_BODY);}]) },

    /* ===== 四年级新增（2 关） ===== */
    { id:'yy4_08', subject:'yingyu', grade:4, name:'日常作息', icon:'⏰', desc:'选词/选句·时间作息',
      make: mk([function(){return vq(G4_ROUTINE);}, function(){return sq(G4_ROUTINE);}]) },
    { id:'yy4_09', subject:'yingyu', grade:4, name:'周末活动', icon:'🎡', desc:'选词/选句·周末安排',
      make: mk([function(){return vq(G4_WEEKEND);}, function(){return sq(G4_WEEKEND);}]) },

    /* ===== 五年级新增（2 关） ===== */
    { id:'yy5_08', subject:'yingyu', grade:5, name:'购物场景', icon:'🛒', desc:'选句/选词·购物用语',
      make: mk([function(){return sq(G5_SHOPPING);}, function(){return vq(G5_SHOPPING);}]) },
    { id:'yy5_09', subject:'yingyu', grade:5, name:'能力表达', icon:'🤸', desc:'听音/选句·can/can\'t',
      make: mk([function(){return sq(G5_ABILITY);}, function(){return lq(G5_ABILITY);}]) },

    /* ===== 六年级新增（2 关） ===== */
    { id:'yy6_08', subject:'yingyu', grade:6, name:'旅行出游', icon:'✈️', desc:'选词/选句·travel·holiday',
      make: mk([function(){return vq(G6_TRAVEL);}, function(){return sq(G6_TRAVEL);}]) },
    { id:'yy6_09', subject:'yingyu', grade:6, name:'节日文化', icon:'🏮', desc:'选词/选句·中西方节日',
      make: mk([function(){return vq(G6_FESTIVAL);}, function(){return sq(G6_FESTIVAL);}]) }
  ]);
})();
