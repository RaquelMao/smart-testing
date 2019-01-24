const path = require('path');
const fs = require('fs-extra');
const { translate } = require('../../src/pretreat');
const config = require('../config');
const { projects } = config;

test('Windows platform: translation finished, and translated path', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const platform = 'Windows';
  const srcFile = path.join(projects, 'projectA/includeA/sample1');
  return translate(src, platform)
    .then(() => fs.readFile(srcFile, 'UTF-8'))
    .then((context) => {
      expect(context).toBe('#include "a\\b\\c"\n');
    });
});

test('Windows platform: translation finished, and did not translate path', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const platform = 'Windows';
  const srcFile = path.join(projects, 'projectA/includeA/sample2');
  return translate(src, platform)
    .then(() => fs.readFile(srcFile, 'UTF-8'))
    .then((context) => {
      expect(context).toBe('a/b/c\n');
    });
});

test('Linux platform: translation finished, and translated path', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const platform = 'Linux';
  const srcFile = path.join(projects, 'projectA/includeA/sample1');
  return translate(src, platform)
    .then(() => fs.readFile(srcFile, 'UTF-8'))
    .then((context) => {
      expect(context).toBe('#include "a/b/c"\n');
    });
});

test('Linux platform: translation finished, and did not translated path', () => {
  expect.assertions(1);
  const src = path.join(projects, 'projectA');
  const platform = 'Linux';
  const srcFile = path.join(projects, 'projectA/includeA/sample2');
  return translate(src, platform)
    .then(() => fs.readFile(srcFile, 'UTF-8'))
    .then((context) => {
      expect(context).toBe('a/b/c\n');
    });
});
