const fs = require('fs-extra');
const path = require('path');
const filterHeader = require('./utility');

/**
 * 自动添加所需头文件环境
 * @param {String} filePath
 * @param {String} output
 * @return {Promise}
 */
function addFuzzyIncludes(filePath, output) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath)
      .then((stats) => {
        if (stats.isDirectory()) {
          return fs.copy(filePath, output, { overwrite: true, filter: filterHeader });
        }
        const notError = new Error();
        notError.escape = true;
        return Promise.reject(notError);
      })
      .then(() => fs.readdir(filePath))
      .then((files) => {
        const promises = files.map((file) => {
          const fileDir = path.join(filePath, file);
          return addFuzzyIncludes(fileDir, output);
        });
        return Promise.all(promises);
      })
      .then(resolve)
      .catch((err) => {
        err.escape ? resolve() : reject(err);
      });
  });
}

module.exports = addFuzzyIncludes;
