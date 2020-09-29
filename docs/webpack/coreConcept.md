# webpack核心概念

## 入口 （entry）

## 输出 （output）

## loader

在 webpack 的配置中 loader 有两个目标：

test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
use 属性，表示进行转换时，应该使用哪个 loader。

例子

```js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
module.exports = config;
```



## 插件 (plugin)

# 其它

## 模式 （mode）