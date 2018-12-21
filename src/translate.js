const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');


class Translator {
  constructor(platform) {
    this.platform = platform;
  }

  /**
   * 转换单个文件代码
   * @param {String} filePath 文件路径
   * @return {Promise}
   */
  translateFile(filePath) {
    return new Promise((resolve, reject) => {
      const fileInterface = readline.createInterface({
        input: fs.createReadStream(filePath),
      });
      let str = '';
      fileInterface.on('line', (line) => {
        if (this.platform === 'Linux' && line.startsWith('#include')) {
          line = line.replace(/\\/g, '/');
        }
        if (this.platform === 'Windows' && line.startsWith('#include')) {
          line = line.replace(/\//g, '\\');
        }
        str += `${line}\n`;
      })
        .on('error', (err) => {
          reject(err);
        })
        .on('close', () => {
          fs.writeFile(filePath, str).then(resolve).catch(reject);
          resolve();
        });
    });
  }

  /**
   * 转换项目代码
   * @param {String} filePath 项目路径
   * @return {Promise}
   */
  translateProject(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath)
        .then((stats) => {
          if (stats.isFile()) {
            return this.translateFile(filePath).then(resolve).catch(reject);
          }
          return fs.readdir(filePath);
        })
        .then((files) => {
          const promises = files.map((file) => {
            const fileDir = path.join(filePath, file);
            return this.translateProject(fileDir);
          });
          return Promise.all(promises);
        })
        .then(resolve)
        .catch(reject);
    });
  }
}

/**
 * 复制项目到新文件夹下，并根据平台转换
 * @param {String} filePath 文件路径
 * @param {String} platform 适应平台
 * @return {Promise}
 */
function addTranslatedProject(filePath, platform) {
  return new Promise((resolve, reject) => {
    const translator = new Translator(platform);
    translator.translateProject(filePath)
      .then(resolve)
      .catch(reject);
  });
}

module.exports = addTranslatedProject;
