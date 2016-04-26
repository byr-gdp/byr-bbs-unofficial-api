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

var board = {
  boardListEn: boardListEn,
  boardListCn: boardListCn,
  isBoardValid: function(boardName) {
    return boardListEn.indexOf(boardName.toLowerCase()) >= 0 ? true : false;
  }
};

exports = module.exports = board;

// exports = module.exports = function(boardName) {
//    return boardListEn.indexOf(boardName.toLowerCase()) >= 0 ? true : false;
// };