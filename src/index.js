/**
 * 进行项目预处理
 */
const fs = require('fs-extra');
const path = require('path');
const translate = require('./translate');
const addFuzzyIncludes = require('./fuzzy-includes');
const addCustomIncludes = require('./custom-includes');

class Pretreater {
  constructor(filePath, { fuzzy, platform, include }, output) {
    this.fuzzy = fuzzy;
    this.platform = platform;
    this.filePath = filePath;
    this.includes = include;
    this.output = output;
  }

  /**
   * 复制项目到新文件夹下，并根据平台转换
   * @param {String} output
   * @return {Promise}
   */
  addTranslatedProject(output) {
    return new Promise((resolve, reject) => {
      fs.copy(this.filePath, output)
        .then(() => this.translateProject(output))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * 转换项目代码
   * @param {String} filePath
   * @return {Promise}
   */
  translateProject(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath)
        .then((stats) => {
          if (stats.isFile()) {
            return translate(filePath, this.platform).then(resolve).catch(reject);
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

  /**
   * 创建预处理文件夹,并进行预处理操作
   * @return {Promise}
   */
  pretreatProject() {
    return new Promise((resolve, reject) => {
      const output = path.join(this.output, path.basename(this.filePath));
      const filename = path.basename(this.filePath);
      const includesPath = path.join(output, `${filename}-includes`);
      fs.ensureDir(includesPath)
        .then(() => {
          if (this.fuzzy) {
            return addFuzzyIncludes(this.filePath, includesPath);
          }
          return Promise.resolve();
        })
        .then(() => {
          if (this.includes) {
            return addCustomIncludes(this.includes, includesPath);
          }
          return Promise.resolve();
        })
        .then(() => this.addTranslatedProject(output))
        .then(resolve)
        .catch(reject);
    });
  }
}

/**
 * 进行项目预处理
 * @param {String} project
 * @param {Object} config
 * @param {String} output
 * @return {Promise}
 */
function pretreat(project, config, output) {
  return new Promise((resolve, reject) => {
    fs.emptyDir(output)
      .then(() => {
        const pretreater = new Pretreater(project, config, output);
        return pretreater.pretreatProject();
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = pretreat;
