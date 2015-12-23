# BYR-forum-unofficial-API

北邮人论坛非官方 API。基于 Node.js，通过 `superagent` 抓取数据并用 `cheerio` 处理后返回 JSON 格式数据。

目前完成的功能有：

1. 获取十大信息
2. 获取版块主题列表
3. 获取主题回帖列表
4. 回复帖子

## demo

1. [获取十大信息](https://dry-retreat-5114.herokuapp.com/topten)
2. [获取版块主题列表](https://dry-retreat-5114.herokuapp.com/section?board=wwwtechnology&p=1)
3. [获取主题列表](https://dry-retreat-5114.herokuapp.com/topic?board=wwwtechnology&id=32932&p=1)
4. 回复帖子（需参数）

## Usage

目前该应用已部署到 heroic，应用地址是 `https://dry-retreat-5114.herokuapp.com`，只需要按照下面的 `PATH` 说明拼接 `URL` 即可。

若本地运行，`git clone` 以后先执行 `npm install` 安装所需依赖，再执行 `node app.js`，然后访问 `http://127.0.0.1:5000` 即可。


## 十大

### Path

**/topten**

### Method

**GET**

### Result


	[
		{
			"title": "妹子打水插队被打，大家说说谁有道理？",
			"author": "cptbtptp29",
			"link": "http://bbs.byr.cn/article/Talking/5766125",
			"pubDate": "Sun, 20 Dec 2015 14:18:58 GMT"
		},
		{
			"title": "求问大家是怎么通过第一眼来判断一个女生是否有蓝盆友呢！",
			"author": "lrb150",
			"link": "http://bbs.byr.cn/article/Feeling/2849868",
			"pubDate": "Sun, 20 Dec 2015 12:37:23 GMT"
		},
		...
	}

## 版块主题

### Path

**/section?board={boardName}&p={page}**

### Method

**GET**

### Parameters

| 参数 | 意义 |
| :---: | :---: |
| boardName| 版块名称 |
| page | 第几页 |

### Result

	{
		"count": 30,
		"board": "wwwtechnology",
		"page": "1",
		"items": [
			{
				"title": "[公告]WWW技术/WWWTechnology版治版方针",
				"link": "/article/WWWTechnology/11533",
				"pubDate": "2010-11-15",
				"author": "xw2423",
				"replyCount": "0",
				"latestReplyDate": "2010-11-15",
				"latestReplyAuthor": "xw2423"
			},
			{
				"title": "征人做网站征人帮忙请发到此处",
				"link": "/article/WWWTechnology/32869",
				"pubDate": "2015-12-16",
				"author": "Chon",
				"replyCount": "3",
				"latestReplyDate": "2015-12-18",
				"latestReplyAuthor": "leejiaxin"
			},
		...
	}
	
## 主题详情

### Path

**/topic?board={boardName}&id={id}&p={page}**

### Method

**GET**

### Parameters

| 参数 | 意义 |
| :---: | :---: |
| boardName| 版块名称 |
| id | 帖子 id |
| page | 第几页 |

### Result

	{
		"count": 30,
		"board": "job",
		"page": "1",
		"items": [
			{
				"title": "【版务】毕业生找工作/Job版黑名单",
				"link": "/article/Job/1724697",
				"pubDate": "2015-07-24",
				"author": "teath",
				"replyCount": "1",
				"latestReplyDate": "2015-11-11",
				"latestReplyAuthor": "ying0252"
			},
			{
				"title": "【版规】毕业生找工作/Job版版规20150713",
				"link": "/article/Job/1722964",
				"pubDate": "2015-07-13",
				"author": "teath",
				"replyCount": "0",
				"latestReplyDate": "2015-07-13",
				"latestReplyAuthor": "teath"
			},
			...
		]
	}
		
## 回帖

### Path

**/reply**

### Method

**POST**

### Parameter

| 参数 | 意义 |
| :---: | :---: |
| boardName| 版块名称 |
| id | 帖子 id |
| content | 回帖内容 |
| user | 论坛 id |
| pwd | 论坛 id 密码 |

### Result

成功：`发表成功`

失败：`发表失败`


## Todo

1. 维护版块名称 list
2. 容错处理
3. 优化回复内容
