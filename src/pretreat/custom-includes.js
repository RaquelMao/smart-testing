/**
 * 设置自定义依赖文件
 */

const path = require('path');
const fs = require('fs-extra');
const { copyFolder } = require('../utility');

/**
 * 添加自定义包含目录头文件，将自定义包含目录中的头文件复制到目标文件夹下
 * @param {String} projectPath 项目路径
 * @param {Array} includes 包含目录
 * @param {String} output 输出文件夹路径
 * @param {Array} cHeaderExtensions c头文件后缀名
 * @return {Promise}
 */
function addCustomIncludes(projectPath, includes, output, cHeaderExtensions = ['.h']) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(output)
      .then(() => {
        const promises = includes.map((include) => {
          include = path.resolve(projectPath, include);
          return copyFolder(include, output, { extensions: cHeaderExtensions });
        });
        return Promise.all(promises);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = addCustomIncludes;
