// 版块主题
app.get("/section", function(req, res) {
  var board    = req.query.board;
  var page     = req.query.p || 1;
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

// 帖子详情 bbs.byr.cn
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
      var niceComment = [];

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

      $(".a-nice-comment-item").each(function(i, e){
        var id = $(e).find(".a-nice-comment-id").text();
        var content = $(e).find(".a-nice-comment-content").text();
        var floor = $(e).find(".a-nice-comment-floor").text();
        niceComment.push({
          id: id,
          content: content,
          floor: floor,
        });
      });

      response.board = board;
      response.url   = url;
      response.count = items.length;
      response.page  = parseInt(page, 10);
      response.items = items;
      response.niceComment = niceComment;

      res.send(response);
    });
});