/**
 * 设置依赖文件
 */

const fs = require('fs-extra');
const path = require('path');
const { copyFolder } = require('../utility');

/**
 * 添加包含目录子文件夹中的头文件，包括子文件夹
 * @param {String} subdirectory 子文件夹路径
 * @param {String} output 输出文件夹路径
 * @param {Array} cHeaderExtensions c头文件后缀名
 * @return {Promise}
 */
function addFuzzyIncludeSubdirectory(subdirectory, output, cHeaderExtensions = ['.h']) {
  return new Promise((resolve, reject) => {
    fs.lstat(subdirectory)
      .then((stats) => {
        if (!stats.isDirectory()) {
          return Promise.resolve();
        }
        // eslint-disable-next-line no-use-before-define
        return addFuzzyIncludeDirectory(subdirectory, output, cHeaderExtensions);
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * 添加包含目录文件夹中的头文件，包括子文件夹
 * @param {String} includeDirectory 包含目录文件夹路径
 * @param {String} output 输出文件夹路径
 * @param {Array} cHeaderExtensions c头文件后缀名
 * @return {Promise}
 */
function addFuzzyIncludeDirectory(includeDirectory, output, cHeaderExtensions = ['.h']) {
  return new Promise((resolve, reject) => {
    copyFolder(includeDirectory, output, { extensions: cHeaderExtensions })
      .then(() => fs.readdir(includeDirectory))
      .then((files) => {
        const promises = files.map((file) => {
          const filePath = path.join(includeDirectory, file);
          return addFuzzyIncludeSubdirectory(filePath, output, cHeaderExtensions);
        });
        return Promise.all(promises);
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * 自动添加包含目录头文件，将项目中的头文件复制到目标文件夹下，扁平化文件夹结构
 * @param {String} projectPath 项目路径
 * @param {String} output 输出文件夹路径
 * @param {Array} cHeaderExtensions c头文件后缀名
 * @return {Promise}
 */
function addFuzzyIncludes(projectPath, output, cHeaderExtensions = ['.h']) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(output)
      .then(() => addFuzzyIncludeDirectory(projectPath, output, cHeaderExtensions))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = addFuzzyIncludes;
