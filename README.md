# smart-testing

A npm package that deals with a C++ project before running.

Installation
```
npm i smart-testing
```


###1. translate 根据平台转换代码

- filePath: 文件路径
- output: 输出文件路径

```$xslt
const pretreat = require('smart-testing')

pretreat.fuzzy(filePath, output);
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```
###2. fuzzy 设置自定义依赖文件

- filePath: 文件路径
- output: 输出文件路径
- includes: 自定义依赖文件路径

```$xslt
pretreat.custom(filePath, includes, output)
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```
###3. custom 设置依赖文件

- filePath: 文件路径
- platform: 适应平台

```$xslt
pretreat.translate(filePath, platform))
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```
