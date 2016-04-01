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

// 从外部文件读取讨论区信息
var boardEn = require('./config_board_en.json');
var boardCn = require('./config_board_cn.json');

var boardListEn = [];
var boardListCn = [];

for (var item in boardEn) {
  boardListEn = boardListEn.concat(boardEn[item]);
}

for (var item in boardCn) {
  boardListCn = boardListCn.concat(boardCn[item]);
}

// 判断 boardName 是否合理
function isBoardValid(boardName) {
  return boardListEn.indexOf(boardName.toLowerCase()) >= 0 ? true : false;
}

// GBK -> UTF8
// bbs.byr.cn 编码方式为 GBK
// m.byr.cn 编码方式为 UTF-8
var parser = function(res, done) {
  res.text = '';
  res.setEncoding('binary');
  res.on('data', function(chunk) {res.text += chunk;});
  res.on('end', function() {
    res.text = encoding.convert(res.text, 'UTF8', 'GBK').toString();
    done();
  });
};

// 十大 from bbs.byr.cn
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

// 版块主题 from m.byr.cn
app.get("/section", function(req, res) {
  var board    = req.query.board;
  var page     = req.query.p || 1;
  var response = {};

  if(!isBoardValid(board)) {
    response.err = "无法找到该分区";
    res.send(response);
    return;
  }

  var baseUrl = "http://m.byr.cn/board/";
  var url     = baseUrl + board + "?p=" + page;

  superagent.get(url)
    .end(function(err, sres) {
      if(err) {
        console.error(err);
      }

      var $ = cheerio.load(sres.text);

      var items     = [];
      var totalPage = null;

      var strTotalPage = $('#m_main .sec.nav').eq(1).find('a.plant').eq(0).text();
      var loc = strTotalPage.indexOf('/');
      totalPage = parseInt(strTotalPage.slice(loc + 1), 10);

      $('#m_main li').each(function(i, e) {
        var strDiv = $(e).find('div').eq(0).text();
        var loc0 = strDiv.indexOf('(');
        var loc1 = strDiv.indexOf(')');
        var title = strDiv.slice(0, loc0);
        var replyCount = strDiv.slice(loc0 + 1, loc1);
        var url = $(e).find('div').eq(0).find('a').attr('href');
        url = 'http://m.byr.cn' + url;

        var strDiv1 = $(e).find('div').eq(1).text();
        var loc2 = strDiv1.indexOf('|');
        var pubDate = strDiv1.slice(0, 10);
        var author = $(e).find('div').eq(1).find('a').eq(0).text();
        var latestReplyDate = strDiv1.slice(loc2 + 1, loc2 + 11);
        var latestReplyAuthor = $(e).find('div').eq(1).find('a').eq(1).text();

        items.push({
          title: title,
          url: url,
          pubDate: pubDate,
          author: author,
          replyCount: replyCount,
          latestReplyDate: latestReplyDate,
          latestReplyAuthor: latestReplyAuthor
        });
      });

      response.count     = items.length;
      response.board     = board;
      response.page      = parseInt(page, 10);
      response.totalPage = totalPage;
      response.items     = items;

      res.send(response);
    });
});

// 帖子详情 from m.byr.cn
app.get("/topic", function(req, res) {
  var board    = req.query.board;         // 帖子分区
  var id       = req.query.id;            // 帖子 id
  var page     = req.query.p || 1;        // 分页
  var baseUrl  = 'http://m.byr.cn/article/';
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

  var url = baseUrl + board + "/" + id + "?p=" + page;

  superagent
    .get(url)
    .end(function(err, sres) {
      if(err) {
        console.error(err);
      }

      var $ = cheerio.load(sres.text);

      var title       = null;
      var items       = [];
      var totalPage   = null;
      var niceComment = [];

      console.log(sres.text);

      // IF TOPIC NOT FOUND 

      if ($('#m_main > div').eq(0).text() == '指定的文章不存在或链接错误') {
        response.err = '指定的文章不存在或链接错误';
        res.send(response);
        return;
      }

      var strTotalPage = $('#m_main .sec.nav').eq(1).find('a').eq(2).text();
      var loc = strTotalPage.indexOf('/');
      totalPage = parseInt(strTotalPage.slice(loc + 1), 10);

      // 回复
      $(".list.sec li").each(function(i, e) {
        if (i === 0) {
          title = $(e).text().slice(3);
        } else if (i === 2) {
          // console.log('found');
        } else {
          var author = $(e).find('.nav.hl a').eq(1).text();
          var content = $(e).find('.sp').text();

          items.push({
            author:  author,
            content: content
          });
        }
      });

      // 精彩评论
      // $(".a-nice-comment-item").each(function(i, e){
      //   var id = $(e).find(".a-nice-comment-id").text();
      //   var content = $(e).find(".a-nice-comment-content").text();
      //   var floor = $(e).find(".a-nice-comment-floor").text();
      //   niceComment.push({
      //     id: id,
      //     content: content,
      //     floor: floor,
      //   });
      // });

      response.board     = board;
      response.url       = url;
      response.count     = items.length;
      response.page      = page;
      response.totalPage = totalPage;
      response.title     = title;
      response.items     = items;

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
