#!/usr/bin/env node

const program = require('commander');
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
  pretreat(program.args[0], program, program.output)
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
