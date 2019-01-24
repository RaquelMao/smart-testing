/**
 * 使用函数模块
 */

const fs = require('fs-extra');
const path = require('path');
const walk = require('walk');

/**
 * 复制文件夹
 * @param {String} src 原文件夹路径
 * @param {String} tar 目标路径
 * @param {Array} extensions 文件后缀名列表
 * @returns {Promise}
 */
function copyFolder(src, tar, { extensions = null } = {}) {
  return new Promise((resolve, reject) => {
    function filter(src) {
      if (!extensions) return true;
      return extensions.indexOf(path.extname(src)) >= 0;
    }
    const copyOptions = {
      overwrite: false,
      filter,
    };
    if (!path.isAbsolute(src)) {
      src = path.resolve(src);
    }
    const walker = walk.walk(src);
    const errs = [];
    walker.on('file', (root, fileStats, next) => {
      const srcFile = path.join(root, fileStats.name);
      const tarDir = root.replace(src, tar);
      const destFile = path.join(tarDir, fileStats.name);
      fs.ensureDir(tarDir)
        .then(() => fs.copy(srcFile, destFile, copyOptions), () => Promise.resolve())
        .then(() => {
          next();
        })
        .catch((err) => {
          errs.push(err);
          next();
        });
    });
    walker.on('errors', (root, nodeStatsArray, next) => {
      nodeStatsArray.forEach((err) => {
        errs.push(err.error);
      });
      next();
    });
    walker.on('end', () => {
      errs.length > 0 ? reject(errs) : resolve();
    });
  });
}

/**
 * Export model definition object.
 */
module.exports = copyFolder;
