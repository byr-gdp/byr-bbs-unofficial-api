// 用于获取分区信息，需在浏览器 Console 运行
// 一级版块 board 表示，二级版块 section 表示

var len           = $(".title_1 > a").length;
var cnBoardName   = []; 
var enBoardName   = [];
var cnSectionName = [];
var enSectionName = [];
var cnAddition    = [];
var enAddition    = []

for(var i = 0; i < len; i++) {
  if($(".title_1 > a").eq(i).attr("href").indexOf("board") > -1) {
    cnBoardName.push($(".title_1 > a").eq(i).text().trim());
    enBoardName.push($(".title_1 > a").eq(i).attr("href").substr(7).toLowerCase());
  } else {
    cnSectionName.push($(".title_1 > a").eq(i).text().trim());
    enSectionName.push($(".title_1 > a").eq(i).attr("href").substr(9).toLowerCase());
  }
}
