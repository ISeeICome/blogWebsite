# webpack

## 安装

要安装最新版本或特定版本，请运行一下命令：

本地安装
```
npm install --save-dev webpack
npm install --save-dev webpack@<version>
```
如果使用的是webpack v4或更高版本则需要安装CLI。

全局安装
```
npm install --global webpack
```
推荐使用本地安装：这样可以在引入中断更改时更轻松地单独升级项目。

不推荐使用全局安装：全局安装会锁定到特定版本的webpack，并且在使用不同版本的项目中可能会失败。

安装webpack最新版本，使用一下命令安装beta版本，甚至可以直接从webpack储存库安装
npm install webpack@beta
npm install webpack/webpack#<tagname/branchname>
注意:安装这些前沿释放时要小心！它们可能仍然包含错误，因此不应用于生产。

