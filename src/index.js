/**
 * 进行项目预处理
 */
const fs = require('fs-extra');
const path = require('path');
const iconv = require('iconv-lite');

class Precompiler {
  constructor(filePath, { fuzzy, platform, include }) {
    this.fuzzy = fuzzy;
    this.platform = platform;
    this.filePath = filePath;
    this.includes = include;
  }


  /**
   * 筛选头文件
   * @param {String} filePath
   * @return {Promise}
   */
  static filerHeader(filePath) {
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

  /**
   * 自动添加所需头文件环境
   * @param {String} filePath
   * @param {String} output
   * @return {Promise}
   */
  addFuzzyIncludes(filePath, output) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath)
        .then((stats) => {
          if (stats.isDirectory()) {
            return fs.copy(filePath, output, { overwrite: true, filter: Precompiler.filerHeader });
          }
          const notError = new Error();
          notError.escape = true;
          return Promise.reject(notError);
        })
        .then(() => fs.readdir(filePath))
        .then((files) => {
          const promises = files.map((file) => {
            const fileDir = path.join(filePath, file);
            return this.addFuzzyIncludes(fileDir, output);
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

  /**
   * 转换单个文件代码
   * @param {String} filePath
   * @return {Promise}
   */
  translateFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath)
        .then((content) => {
          content = iconv.decode(content, 'GB2312');
          let contentTranslated = content;
          if (this.platform === 'Linux') {
            contentTranslated = content.replace(/\\/g, '/');
          }
          if (this.platform === 'Windows') {
            contentTranslated = content.replace(/\//g, '\\');
            contentTranslated = contentTranslated.replace(/\\(\*)/g, '/*');
            contentTranslated = contentTranslated.replace(/(\*)\\/g, '*/');
          }
          return fs.writeFile(filePath, contentTranslated, 'utf8');
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * 添加自定义依赖文件
   * @param {Array} includesPath
   * @return {Promise}
   */
  addCustomIncludes(includesPath) {
    return new Promise((resolve, reject) => {
      this.includes.forEach((include) => {
        fs.copy(include, includesPath, { overwrite: true, filter: Precompiler.filerHeader })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  /**
   * 创建预处理文件夹,并进行预处理操作
   * @param {String} projectPath
   * @return {Promise}
   */
  createPrecompiledDir(projectPath) {
    return new Promise((resolve, reject) => {
      const filename = path.basename(this.filePath);
      const includesPath = path.join(projectPath, `${filename}-includes`);
      fs.ensureDir(includesPath)
        .then(() => {
          if (this.fuzzy) {
            return this.addFuzzyIncludes(this.filePath, includesPath);
          }
          return Promise.resolve();
        })
        .then(() => {
          if (this.includes) {
            return this.addCustomIncludes(includesPath);
          }
          return Promise.resolve();
        })
        .then(() => this.addTranslatedProject(projectPath))
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
function precompile(project, config, output) {
  return new Promise((resolve, reject) => {
    fs.emptyDir(output)
      .then(() => {
        const projectPath = path.join(output, path.basename(project));
        const precompiler = new Precompiler(project, config);
        return precompiler.createPrecompiledDir(projectPath);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = precompile;
