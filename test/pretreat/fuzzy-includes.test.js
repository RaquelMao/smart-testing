const path = require('path');
const fs = require('fs-extra');
const { fuzzy } = require('../../src/pretreat');
const config = require('../config');
const { projects, output } = config;

test('test projectA： fuzzy finished', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const tar = path.join(output, 'fuzzy-includes-project-a');
  return fs.emptyDir(tar)
    .then(() => fuzzy(src, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      expect(files.length).toBe(6);
    });
});

test('test projectB： fuzzy finished', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectB');
  const tar = path.join(output, 'fuzzy-includes-project-b');
  return fs.emptyDir(tar)
    .then(() => fuzzy(src, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      expect(files.length).toBe(44);
    });
});
