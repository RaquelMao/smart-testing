const fs = require('fs-extra');
const path = require('path');
const { custom } = require('../../src/pretreat');
const config = require('../config');
const { projects, output } = config;

test('projectA: only one custom include', () => {
  expect.assertions(2);
  const src = path.join(projects, 'projectA');
  const tar = path.join(output, 'custom-includes');
  const includes = ['includeA'];
  return fs.emptyDir(tar)
    .then(() => custom(src, includes, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      expect(files[0]).toBe('a.h');
      expect(files.length).toBe(1);
    });
});

test('projectA: two or more than two includes', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const tar = path.join(output, 'custom-includes');
  const includes = ['includeA', 'includeB'];
  return fs.emptyDir(tar)
    .then(() => custom(src, includes, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      expect(files.length).toBe(2);
    });
});

test('projectA: if include exists same name file, preserve only one and do not overwrite', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const tar = path.join(output, 'custom-includes');
  const includes = ['includeA', 'includeB', 'includeC'];
  return fs.emptyDir(tar)
    .then(() => custom(src, includes, tar))
    .then(() => fs.readdir(tar))
    .then((files) => {
      expect(files.length).toBe(2);
    });
});
