const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const { projects, output } = config;
const { copyFolder } = require('../../src/utility');

test('copy src does not exist', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectD');
  const tar = path.join(output, 'projectD');
  return fs.emptyDir(tar)
    .then(() => copyFolder(src, tar))
    .catch((e) => {
      expect(e[0].path).toBe(src);
    });
});

test('projectA： copy succeed', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const tar = path.join(output, 'projectA');
  let newFilesCount = 0;
  let filesCount = 0;
  return fs.emptyDir(tar)
    .then(() => copyFolder(src, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      newFilesCount = files.length;
      return fs.readdir(src);
    })
    .then((files) => {
      filesCount = files.length;
      expect(newFilesCount).toBe(filesCount);
    });
});

test('projectB： copy succeed, but some files cannot copy', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectB');
  const tar = path.join(output, 'projectB');
  return fs.emptyDir(tar)
    .then(() => copyFolder(src, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      const newFilesCount = files.length;
      expect(newFilesCount).toBe(37);
    });
});

test('projectC： copy succeed', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectC');
  const tar = path.join(output, 'projectC');
  return fs.emptyDir(tar)
    .then(() => copyFolder(src, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      const newFilesCount = files.length;
      expect(newFilesCount).toBe(5);
    });
});
