var express    = require("express");
var superagent = require("superagent");
var cheerio    = require("cheerio");
var encoding   = require("encoding");
var bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// 讨论区 board list
// TODO: 通过外部引入 board 信息
// 小尾巴 0 表示 一级目录， 1 表示存在二级目录

// 本站站务
var enBoard0_0 = ["advice", "announce", "bbshelp", "bet", "bm_market", "byr12", "cooperation", "forumcommittee", "id", "progress", "score", "sysop", "test"];
var cnBoard0_0 = ["意见与建议", "站务公告栏", "论坛使用帮助", "竞猜", "版主及助理招聘区", "北邮人论坛十二周年站庆", "业务合作与广告投放", "论坛委员会", "帐号事务管理", "更新与改进", "积分", "本站系统讨论区", "新手测试区"];
var enBoard0_1 = ["notepad", "vote", "bm_apply", "boardmanager", "outstandingbm", "board_apply", "board_document", "board_management", "byr", "byrstar", "showcase", "cnadmin", "cnannounce", "cnlists", "cntest", "byrcourt", "complain"];
var cnBoard0_1 = ["留言版记录", "各板投票情况汇总", "版主申请", "版主管理", "优秀版主展评", "版面申请", "版面文档", "版面管理", "北邮人团队大事记", "北邮人之星", "北邮人团队作品展示", "全国转信管理", "全国转信重要公告", "全国转信统计表", "转信测试", "投诉辩论区", "投诉与举报"];

// 北邮校园
var enBoard1_0 = ["academicaffairs", "aimbupt", "bupt", "buptnet", "buptpost", "byr_bulletin", "campuscard", "daonian", "eid", "focus", "graduation", "houqin", "jijianchu", "junxun", "library", "mybupt", "recommend", "securitydivision", "selfsupport", "studentaffairs", "studentquery"];
var cnBoard1_0 = ["北邮教务处", "北邮欢迎你", "北邮生活", "校园网", "北邮邮局", "北邮人公告栏", "北邮校园卡", "悼念周先生", "北邮EID", "北邮关注", "毕业生之家", "北邮后勤处", "北邮基建处", "军训快报", "北邮图书馆", "北邮记忆", "热点活动", "北邮保卫处", "助学之家", "北邮学生处", "邮问有答"];
var enBoard1_1 = ["aceteam", "buptassociation", "buptauta", "buptmstc", "buptstudentunion", "buptstv", "buptweekly", "chineseorchestra", "graduateunion", "oracleclub", "orchestra", "philharmonic", "redcross", "scda", "sica", "wowbuptguild", "buptnu", "dmda", "graduatesch", "hongfu", "intr", "ipoc", "is", "sa", "scs", "see", "sem", "sh", "shahe", "sice", "sie", "sl", "spm", "ss", "sse", "ste"];
var cnBoard1_1 = ["ACE战队专区", "北邮社团", "阿里巴巴高校技术联盟", "微软技术俱乐部", "北京邮电大学学生会", "北邮学生电视台", "北邮今周", "北邮民乐团", "北京邮电大学研究生会", "甲骨文俱乐部", "北邮管弦乐团", "爱乐家园", "红十字会", "北邮职业发展协会", "学生国际交流协会", "BUPT魔兽公会", "网络教育学院", "数字媒体与设计艺术学院", "研究生院", "宏福校区", "网络技术研究院", "信息光子学与光通信研究院", "国际学院", "自动化学院", "计算机学院", "电子工程学院", "经济管理学院", "人文学院", "沙河校区", "信息与通信工程学院", "原信息工程学院", "语言学院", "公共管理学院", "理学院", "软件学院", "电信工程学院"];

// 学术科技
var enBoard2_0 = ["acm_icpc", "bbsman_dev", "bbsopenapi", "circuit", "communications", "cpp", "database", "dotnet", "economics", "embedded_system", "hardware", "innovation", "java", "linux", "makerclub", "mathmodel", "matlab", "ml_dm", "mobileinternet", "mobileterminalat", "notebook", "officetool", "paper", "python", "searchengine", "security", "softdesign", "windows", "wwwtechnology"];
var cnBoard2_0 = ["算法与程序设计竞赛", "BBS安装管理", "北邮人开放平台", "电子电路", "通信技术", "C/C++程序设计语言", "数据库技术", ".NET程序设计", "经济学", "嵌入式系统", "电脑硬件与维修", "创新实践", "Java技术", "Linux操作系统", "创客与开源硬件", "数学建模", "Matlab实验室", "机器学习与数据挖掘", "移动互联网", "智能终端开发技术", "笔记本电脑", "办公软件", "科研与论文", "Python", "搜索引擎", "信息安全", "软件开发", "Windows操作系统", "WWW技术"];

// 信息社会
var enBoard3_0 = ["aimgraduate", "bnu", "bupt_internet_club", "byratsh", "byratsz", "certification", "civilservant", "consulting", "entrepreneurship", "familylife", "financecareer", "financial", "goabroad", "home", "it", "job", "jobinfo", "jump", "netresources", "overseas", "parttimejob", "pmatbupt", "studyshare", "weather", "worklife"];
var cnBoard3_0 = ["考研专版", "学为人师，行为世范", "北邮互联网俱乐部", "北邮人在上海", "深圳邮人家", "认证考试", "公务员", "管理咨询", "创业交流", "家庭生活", "金融职场", "金融投资", "飞跃重洋", "安居乐业", "信息产业", "毕业生找工作", "招聘信息专版", "跳槽就业", "网络资源", "海外北邮人", "兼职实习信息", "产品疯人院", "学习交流区", "天气预报", "职场人生"];
var enBoard3_1 = ["ad_agent", "advertising", "booktrade", "buptdiscount", "co_buying", "computertrade", "house", "house_agent", "ticket", "btadvice", "btannounce", "btbt", "btcomic", "btcomplain", "btdocument", "btgame", "btmovie", "btmusic", "btpending", "btreward", "btshow", "btsoftware", "btsport", "bttv"];
var cnBoard3_1 = ["商务广告及代理", "跳蚤市场", "二手书交易", "北邮折扣", "拼团", "电脑数码交易", "房屋租赁", "房屋中介", "票务", "北邮人BT意见与建议", "BT公告区", "BT讨论区", "动漫种子发布区", "BT投诉区", "资料种子发布区", "游戏种子发布区", "电影种子发布区", "音乐种子发布区", "种子候选区", "BT悬赏区", "综艺种子发布区", "软件种子发布区", "体育种子发布区", "电视剧种子发布区"];

// 人文艺术
var enBoard4_0 = ["astronomy", "debate", "dv", "englishbar", "ghost", "guitar", "japanese", "koreanwind", "music", "photo", "poetry", "psyhealthonline", "quyi", "reading", "sciencefiction", "tshirt"];
var cnBoard4_0 = ["天文", "辩论", "视频制作", "英语吧", "奇闻异事", "吉他", "日语学习", "韩流吧", "音乐交流区", "摄影", "诗词歌赋", "心理健康在线", "曲苑杂谈", "书屋", "科幻奇幻", "T恤文化"];

// 生活时尚
var enBoard5_0 = ["beauty", "blessing", "clothing", "constellations", "digilife", "diylife", "environment", "feeling", "food", "friends", "health", "iwhisper", "lostandfound", "talking"];
var cnBoard5_0 = ["美容护肤", "北邮愿望树", "衣衣不舍", "星雨星愿", "数字生活", "创意生活", "环境保护", "情感的天空", "秀色可餐", "缘来如此", "健康保健", "悄悄话", "失物招领与拾金不昧", "谈天说地"];

// 休闲娱乐
var enBoard6_0 = ["automotor", "boardgame", "comic", "flash", "hero", "joke", "karaok", "killbar", "movie", "netliterature", "nvote", "pet", "picture", "plant", "radioonline", "superstar", "travel", "tv", "videocool"];
var cnBoard6_0 = ["汽车之家", "桌面游戏", "动漫交流区", "闪客帝国", "煮酒论剑", "笑口常开", "K歌之王", "杀人俱乐部", "电影", "网络文学", "北邮人投票", "宠物家园", "贴图秀", "绿色心情", "BYR在线广播", "娱乐星天地", "海天游踪", "电视剧", "视频酷"];

// 体育健身
var enBoard7_0 = ["athletics", "badminton", "basketball", "billiards", "chess", "cycling", "dancing", "football", "gspeed", "gymnasium", "kungfu", "rugby", "shuttlecock", "sk8", "skating", "swim", "tabletennis", "taekwondo", "tennis", "volleyball"];
var cnBoard7_0 = ["田径", "羽毛球", "篮球咖啡屋", "台球", "棋牌", "梦想单车", "舞蹈", "足球吧", "极速赛车", "健身房", "武术", "橄榄球", "天行毽", "滑板名堂", "北邮刷天下", "碧水情深", "乒乓球", "跆拳道", "网球", "排球"];

// 游戏对战
var enBoard8_0 = ["buptdnf", "cstrike", "diablo", "dota", "footballmanager", "hearthstone", "lol", "onlinegame", "pcgame", "popkart", "tvgame", "we", "wow", "xyq"];
var cnBoard8_0 = ["地下城与勇士", "反恐精英", "暗黑破坏神", "Dota", "足球经理", "炉石传说", "英雄联盟", "网络游戏", "电脑游戏", "跑跑卡丁车", "电子游戏", "实况足球", "魔兽世界", "梦幻西游"];

// 相亲相爱
var enBoard9_0 = ["anhui", "cantonese", "chongqing", "fujian", "gansu", "guangxi", "guizhou", "hainan", "hebei", "henan", "hubei", "hunan", "innermongolia", "jiangsu", "jiangxi", "northeast", "peking", "qinghai", "shaanxi", "shandong", "shanxi", "sichuan", "tianjin", "xinjiang", "zhejiang"];
var cnBoard9_0 = ["情淮徽皖·安徽", "粤广茶餐厅·广东", "巴渝人家·重庆", "八闽玲珑·福建", "西凉故道·甘肃", "桂香南疆·广西", "景秀黔城·贵州", "天涯海角·海南", "燕赵情怀·河北", "豫韵悠悠·河南", "楚天邮情·湖北", "潇湘天下·湖南", "翱翔雄鹰·内蒙古", "江淮人家·江苏", "江南西道·江西", "东北一家人·东北", "北京四合院·北京", "青深似海·青海", "三秦大地·陕西", "齐鲁大地·山东", "桐叶封晋·山西", "蜀山邮侠·四川", "九河下梢·天津", "天山南北·新疆", "钱塘人家·浙江"];

var boardList = enBoard0_0.concat(enBoard0_1).concat(enBoard1_0).concat(enBoard1_1).concat(enBoard2_0).concat(enBoard3_0).concat(enBoard3_1).concat(enBoard4_0).concat(enBoard5_0).concat(enBoard6_0).concat(enBoard7_0).concat(enBoard8_0).concat(enBoard9_0);

// 判断 boardName 是否合理
function isBoardValid(boardName) {
  return boardList.indexOf(boardName.toLowerCase()) >= 0 ? true : false;
}

// GBK -> UTF8
var parser = function(res, done) {
  res.text = '';
  res.setEncoding('binary');
  res.on('data', function(chunk) { res.text += chunk });
  res.on('end', function() {
    res.text = encoding.convert(res.text, 'UTF8', 'GBK').toString();
    done();
  });
};

// 十大
app.get("/topten", function(req, res) {

  var baseUrl = "http://bbs.byr.cn/";
  var url     = baseUrl + "rss/topten";

  superagent.get(url).parse(parser).end(function(err, sres) {
    if(err) {
      // return next(err);
      console.error(err);
    }
    var $ = cheerio.load(sres.text, {
      xmlMode: true
    });
    var items = [];
    $("item").each(function(i, e) {
      var title = $(e).find("title").text().trim();
      var link = $(e).find("link").text().trim();
      var author = $(e).find("author").text().trim();
      var pubDate = $(e).find("pubDate").text().trim();
      // description format 需处理
      // var description = $(e).find("description").text().trim();
      items.push({
        title: title,
        author: author,
        link: link,
        pubDate: pubDate
        // description: description
      });
    });

    res.send(items);
  });
});

// 分版块查询
app.get("/section", function(req, res) {
  var board = req.query.board;
  var page  = req.query.p || 1;
  var response = {};

  if(!isBoardValid(board)) {
    response.err = "无法找到该分区";
    res.send(response);
    return;
  }

  var baseUrl = "http://bbs.byr.cn/board/";
  var url     = baseUrl + board + "?p=" + page;

  superagent.get(url)
    .set("Host", "bbs.byr.cn")
    .set("Origin", "http://bbs.byr.cn")
    .set("X-Requested-With", "XMLHttpRequest")
    .set("User-Agent", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36")
    .set("connection", "keep-alive")
    .set("Referer", "http://bbs.byr.cn/")
    .parse(parser)
    .end(function(err, sres) {
      if(err) {
        console.error(err);
      }

      var $     = cheerio.load(sres.text);
      var items = [];

      $("tbody > tr").each(function(i, e) {
        var title = $(e).find(".title_9").text().trim();
        var link = $(e).find(".title_9 a").attr("href");
        var pubDate = $(e).find(".title_10").eq(0).text().trim();
        var author = $(e).find(".title_12 a").eq(0).text().trim();
        var replyCount = $(e).find(".title_11").text().trim();
        var latestReplyDate = $(e).find(".title_10").eq(1).text().trim();
        var latestReplyAuthor = $(e).find(".title_12 a").eq(1).text().trim();

        items.push({
          title: title,
          link: link,
          pubDate: pubDate,
          author: author,
          replyCount: replyCount,
          latestReplyDate: latestReplyDate,
          latestReplyAuthor: latestReplyAuthor
        });
      });

      response.count = items.length;
      response.board = board;
      response.page  = page;
      response.items = items;

      res.send(response);

    });
});

// 帖子详情
app.get("/topic", function(req, res) {
  var board   = req.query.board;         // 帖子分区
  var id      = req.query.id;            // 帖子 id
  var page    = req.query.p || 1;        // 分页
  var baseUrl = "http://bbs.byr.cn/article/";
  var response = {};

  if(!isBoardValid(board)) {
    response.err = "无法找到该分区";
    res.send(response);
    return;
  }

  if(!id) {
    response.err = "缺少主题参数";
    res.send(response);
    return;
  }

  // TODO: 帖子 id 不存在处理

  var url = baseUrl + board + "/" + id + "?p=" + page;

  superagent
    .get(url)
    .set("Host", "bbs.byr.cn")
    .set("Origin", "http://bbs.byr.cn")
    .set("X-Requested-With", "XMLHttpRequest")
    .set("User-Agent", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36")
    .set("connection", "keep-alive")
    .set("Referer", "http://bbs.byr.cn/")
    .parse(parser)
    .end(function(err, sres) {
      if(err) {
        console.error(err);
      }

      var $        = cheerio.load(sres.text);
      var items    = [];

      if($("*").hasClass("error")) {
        response.err = "指定的文章不存在或链接错误";
        res.send(response);
        return;
      }

      $(".a-wrap.corner").each(function(i, e) {
        var author = $(e).find(".a-u-name").text().trim();
        var content = $(e).find(".a-content-wrap").text();
        var start = content.indexOf("站内") + 2;
        var end = content.indexOf("--※");
        content = content.substring(start, end);
        items.push({
          author:  author,
          content: content
        });
      });

      response.board = board;
      response.url   = url;
      response.count = items.length;
      response.page  = page;
      response.items = items;

      res.send(response);
    });
});


// 回复帖子
// 需要参数：boardName id content user pwd 
// boardName 版块名称
// id        主题 id
// content   回复内容
// user      论坛 id
// pwd       论坛 密码
app.post("/reply", function(req, res) {
  var boardName = req.body.boardName;
  var id        = req.body.id;
  var content   = req.body.content;
  var user      = req.body.user;
  var pwd       = req.body.pwd;

  var url_login = "http://bbs.byr.cn/user/ajax_login.json";
  var url_post  = "http://bbs.byr.cn/article/" + boardName + "/ajax_post.json";

  var body_login = "id=" + user + "&passwd=" + pwd;
  var body_post  = "content=" + content + "&id=" + id + "&subject=subject";

  // 模拟登录，拿到 Cookie
  superagent
    .post(url_login)
    .send(body_login)
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Accept', 'application/json')
    .parse(parser)
    .end(function(err, sres){
      var headers     = sres.headers;
      var str         = JSON.stringify(headers);
      var cookieStart = str.indexOf('set-cookie') + 13;
      var cookieEnd   = str.indexOf('expires') - 3;

      var cookie = str.substring(cookieStart, cookieEnd);
      var cookies = cookie.split(",");
      var result = "";
      for(var i = 0; i < cookies.length; i++) {
        var pos = cookies[i].indexOf(";");
        var tmp = cookies[i].substring(1, pos);
        result += tmp + ";";
      }
      // 利用刚才拿到的 Cookie 发帖
      superagent
        .post(url_post)
        .send(body_post)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Accept', 'application/json')
        .set('Cookie', result)
        .parse(parser)
        .end(function(err, ssres){
          var response = JSON.stringify(ssres.text);
          if(response.indexOf("发表成功")) {
            res.send("发表成功");
          } else {
            res.send("发表失败");
          }
        });
    });
});

app.listen(process.env.PORT || 5000, function() {
  console.log("listen at port 5000");
});