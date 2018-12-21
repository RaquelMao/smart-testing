const fs = require('fs-extra');
const filterHeader = require('./utility');

/**
 * 添加自定义依赖文件
 * @param {Array} includes
 * @param {String} includesPath
 * @return {Promise}
 */
function addCustomIncludes(includes, includesPath) {
  return new Promise((resolve, reject) => {
    includes.forEach((include) => {
      fs.copy(include, includesPath, { overwrite: true, filter: filterHeader })
        .then(resolve)
        .catch(reject);
    });
  });
}

module.exports = addCustomIncludes;
