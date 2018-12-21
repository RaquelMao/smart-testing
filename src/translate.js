const fs = require('fs-extra');
const readline = require('readline');
/**
 * 转换单个文件代码
 * @param {String} filePath
 * @param {String} platform
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
        fs.writeFile(filePath, str).then(resolve).catch(reject);
        resolve();
      });
  });
}

module.exports = translateFile;
