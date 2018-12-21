/**
 * 使用函数模块
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * 筛选头文件
 * @param {String} filePath
 * @return {Promise}
 */
function filterHeader(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath)
      .then((stats) => {
        if (stats.isFile()) {
          resolve(path.extname(filePath) === '.h' || path.extname(filePath) === '.H');
        }
        resolve(stats.isDirectory());
      })
      .catch(reject);
  });
}

module.exports = filterHeader;
