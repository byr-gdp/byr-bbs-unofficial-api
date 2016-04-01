var configBoardEn = require('./../config_board_en.json');
var configBoardCn = require('./../config_board_cn.json');

// test en
if (typeof configBoardEn === 'object') {
  for (var item in configBoardEn) {
    console.log(item + '|' + configBoardEn[item].length);
  }
}

// test cn
if (typeof configBoardCn === 'object') {
  for (var item in configBoardCn) {
    console.log(item + ' | ' + configBoardCn[item].length);
  }
}