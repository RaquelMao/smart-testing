/**
 * 进行项目预处理
 */
const { translate, fuzzy, custom } = require('./pretreat');
const { copyFolder } = require('./utility');

module.exports = {
  translate,
  fuzzy,
  custom,
  copyFolder,
};
