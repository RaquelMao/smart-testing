/**
 * 进行项目预处理
 */
const translate = require('./translate');
const addFuzzy = require('./fuzzy-includes');
const addCustom = require('./custom-includes');

module.exports = {
  translate,
  fuzzy: addFuzzy,
  custom: addCustom,
};
