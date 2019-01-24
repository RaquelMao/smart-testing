/**
 * 根据平台转换代码
 */

const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');

/**
 * 转换单个文件代码
 * @param {String} filePath 文件路径
 * @param {String} platform 适应平台
 * @return {Promise}
 */
function translateFile(filePath, platform) {
  return new Promise((resolve, reject) => {
    const fileInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
    });
    let str = '';
    fileInterface.on('line', (line) => {
      if (platform === 'Linux' && line.startsWith('#include')) {
        line = line.replace(/\\/g, '/');
      }
      if (platform === 'Windows' && line.startsWith('#include')) {
        line = line.replace(/\//g, '\\');
      }
      str += `${line}\n`;
    })
      .on('error', (err) => {
        reject(err);
      })
      .on('close', () => {
        fs.writeFileSync(filePath, str);
        resolve();
      });
  });
}

/**
 * 转换文件夹代码
 * @param {String} filePath 文件路径
 * @param {String} platform 适应平台
 * @return {Promise}
 */
function translateDirectory(filePath, platform) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath)
      .then((files) => {
        const promises = files.map((file) => {
          const srcPath = path.join(filePath, file);
          // eslint-disable-next-line no-use-before-define
          return translateProject(srcPath, platform);
        });
        return Promise.all(promises);
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * 根据平台转换代码
 * @param {String} filePath 文件路径
 * @param {String} platform 适应平台
 * @return {Promise}
 */
function translateProject(filePath, platform) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath)
      .then((stats) => {
        if (stats.isFile()) {
          return translateFile(filePath, platform);
        }
        return translateDirectory(filePath, platform);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = translateProject;
