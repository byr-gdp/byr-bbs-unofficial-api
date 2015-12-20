# BYR-forum-unofficial-API

北邮人论坛非官方 API

## demo

1. [十大](https://dry-retreat-5114.herokuapp.com/topten)
2. [版块主题](https://dry-retreat-5114.herokuapp.com/section?board=wwwtechnology&p=1)
3. [主题详情](https://dry-retreat-5114.herokuapp.com/topic?board=wwwtechnology&id=32932&p=1)


## 十大

**/topten**


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

**/section?board={boardName}&p={page}**

* {boardName} 表示板块名
* {page} 表示页数




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

**/topic?board={boardName}&id={id}&p={page}**

* {boardName} 表示版块名称
* {id} 表示主题 id
* {page} 表示第几页



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
		

## todo



1. 维护版块名称 list
2. 容错处理
3. 回复内容优化
4. POST 相关
