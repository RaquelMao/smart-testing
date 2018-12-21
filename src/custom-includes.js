const fs = require('fs-extra');
const filterHeader = require('./utility');
const path = require('path');

/**
 * 添加自定义依赖文件
 * @param {Array} includes 自定义依赖文件
 * @param {String} includesPath 自定义依赖文件存放路径
 * @return {Promise}
 */
function addCustomFiles(includes, includesPath) {
  return new Promise((resolve, reject) => {
    includes.forEach((include) => {
      fs.copy(include, includesPath, { overwrite: true, filter: filterHeader })
        .then(resolve)
        .catch(reject);
    });
  });
}

/**
 * 设置自定义依赖文件路径
 * @param filePath 文件路径
 * @param includes 自定义依赖文件
 * @param output 输出文件路径
 * @returns {Promise<any>}
 */
function setCustomPath(filePath, includes, output) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(filePath);
    const includesPath = path.join(output, `${filename}-includes`);
    fs.ensureDir(includesPath)
      .then(() => addCustomFiles(includes, includesPath))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = setCustomPath;
