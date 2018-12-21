#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const pretreat = require('./index');

/**
 * 程序入口
 */
function main() {
  // 命令行参数解析
  program
    .usage('[options] <file/directory ...>')
    .option(
      '-I, --include <array>',
      'Set include directories, separate by comma(,)',
      val => val.split(',') // eslint-disable-line comma-dangle
    )
    .option('--fuzzy', 'Fuzzy pretreat, auto create includes needed')
    .option('--platform <string>', 'Translate code according to your platform: Windows or Linux')
    .option('-o, --output <string>', 'Write data to a directory')
    .parse(process.argv);

  if (program.args.length > 1) {
    console.log('Read only the first file path');
  }

  const filePath = program.args[0];
  const output = program.output;
  const includes = program.include;
  const platform = program.platform;
  const fuzzy = program.fuzzy;

  fs.ensureDir(output)
    .then(() => {
      if (fuzzy) {
        return pretreat.fuzzy(filePath, output);
      }
      return Promise.resolve();
    })
    .then(() => {
      if (platform) {
        return pretreat.custom(filePath, includes, output);
      }
      return Promise.resolve();
    })
    .then(() => fs.copy(filePath, output))
    .then(() => pretreat.translate(output, platform))
    .then(() => {
      console.log('done');
    })
    .catch((error) => {
      console.log(error);
    });
}

if (require.main === module) {
  main();
}
