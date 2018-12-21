/**
 * 设置依赖文件
 */

const fs = require('fs-extra');
const path = require('path');
const filterHeader = require('./utility');

/**
 * 自动添加所需头文件环境
 * @param {String} filePath 文件路径
 * @param {String} output 输出依赖文件路径
 * @return {Promise}
 */
function addFuzzyFiles(filePath, output) {
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
          return addFuzzyFiles(fileDir, output);
        });
        return Promise.all(promises);
      })
      .then(resolve)
      .catch((err) => {
        err.escape ? resolve() : reject(err);
      });
  });
}

/**
 * 设置依赖文件路径
 * @param filePath 文件路径
 * @param output 输出文件路径
 * @returns {Promise<any>}
 */
function setFuzzyPath(filePath, output) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(filePath);
    const includesPath = path.join(output, `${filename}-includes`);
    fs.ensureDir(includesPath)
      .then(() => addFuzzyFiles(filePath, includesPath))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = setFuzzyPath;
