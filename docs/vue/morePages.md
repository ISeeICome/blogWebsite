# 目录
- 准备工作
- [修改webpack配置](#webpack)
    - [项目目录](#catalog)
    - [utils.js文件](#utils)
    - [webpack.base.conf.js 文件](#base)
    - [webpack.dev.conf.js 文件](#dev)
    - [webpack.prod.conf.js 文件](#prod)
- 文件结构
- 页面跳转问题
- 参考地址

## 准备工作
    在本地用vue-cli新建一个项目，首先安装vue-cil，命令：

    npm install -g vue-cli

    新建一个vue项目,创建一个基于"webpack"的项目,项目名为vuedemo：

    vue init webpack vuedemo

    在执行 npm isntall 命令行之前 在package.json添加一个依赖

    glob: "^7.0.3"
## 修改webpack配置
### 项目目录
    ├── README.md
    ├── build
    │   ├── build.js
    │   ├── check-versions.js
    │   ├── dev-client.js
    │   ├── dev-server.js
    │   ├── utils.js
    │   ├── vue-loader.conf.js
    │   ├── webpack.base.conf.js
    │   ├── webpack.dev.conf.js
    │   └── webpack.prod.conf.js
    ├── config
    │   ├── dev.env.js
    │   ├── index.js
    │   └── prod.env.js
    ├── package.json
    ├── src
    │   ├── assets
    │   │   └── logo.png
    │   ├── components
    │   │   ├── Hello.vue
    │   │   └── cell.vue
    │   └── pages
    │       ├── cell
    │       │   ├── cell.html
    │       │   ├── cell.js
    │       │   └── cell.vue
    │       └── index
    │           ├── index.html
    │           ├── index.js
    │           ├── index.vue
    │           └── router
    │               └── index.js
    └── static
在这一步里我们需要改动的文件都在build文件下，分别是：

- utils.js
- webpack.base.conf.js
- webpack.dev.conf.js
- webpack.prod.conf.js

### utils.js文件
    // utils.js文件

    var path = require('path')
    var config = require('../config')
    var ExtractTextPlugin = require('extract-text-webpack-plugin')

    exports.assetsPath = function (_path) {
        var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
            config.build.assetsSubDirectory :
            config.dev.assetsSubDirectory
        return path.posix.join(assetsSubDirectory, _path)
    }

    exports.cssLoaders = function (options) {
        options = options || {}

        var cssLoader = {
            loader: 'css-loader',
            options: {
                minimize: process.env.NODE_ENV === 'production',
                sourceMap: options.sourceMap
            }
        }

        // generate loader string to be used with extract text plugin
        function generateLoaders(loader, loaderOptions) {
            var loaders = [cssLoader]
            if (loader) {
                loaders.push({
                    loader: loader + '-loader',
                    options: Object.assign({}, loaderOptions, {
                        sourceMap: options.sourceMap
                    })
                })
            }

            // Extract CSS when that option is specified
            // (which is the case during production build)
            if (options.extract) {
                return ExtractTextPlugin.extract({
                    use: loaders,
                    fallback: 'vue-style-loader'
                })
            } else {
                return ['vue-style-loader'].concat(loaders)
            }
        }

        // https://vue-loader.vuejs.org/en/configurations/extract-css.html
        return {
            css: generateLoaders(),
            postcss: generateLoaders(),
            less: generateLoaders('less'),
            sass: generateLoaders('sass', { indentedSyntax: true }),
            scss: generateLoaders('sass'),
            stylus: generateLoaders('stylus'),
            styl: generateLoaders('stylus')
        }
    }

    // Generate loaders for standalone style files (outside of .vue)
    exports.styleLoaders = function (options) {
        var output = []
        var loaders = exports.cssLoaders(options)
        for (var extension in loaders) {
            var loader = loaders[extension]
            output.push({
                test: new RegExp('\\.' + extension + '$'),
                use: loader
            })
        }
        return output
    }

    /* 这里是添加的部分 ---------------------------- 开始 */

    // glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
    var glob = require('glob')
    // 页面模板
    var HtmlWebpackPlugin = require('html-webpack-plugin')
    // 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
    var PAGE_PATH = path.resolve(__dirname, '../src/pages')
    // 用于做相应的merge处理
    var merge = require('webpack-merge')


    //多入口配置
    // 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
    // 那么就作为入口处理
    exports.entries = function () {
        var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
        var map = {}
        entryFiles.forEach((filePath) => {
            var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            map[filename] = filePath
        })
        return map
    }

    //多页面输出配置
    // 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
    exports.htmlPlugin = function () {
        let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
        let arr = []
        entryHtml.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            let conf = {
                // 模板来源
                template: filePath,
                // 文件名称
                filename: filename + '.html',
                // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
                chunks: ['manifest', 'vendor', filename],
                inject: true
            }
            if (process.env.NODE_ENV === 'production') {
                conf = merge(conf, {
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    },
                    chunksSortMode: 'dependency'
                })
            }
            arr.push(new HtmlWebpackPlugin(conf))
        })
        return arr
    }
    /* 这里是添加的部分 ---------------------------- 结束 */
### webpack.base.conf.js 文件
    // webpack.base.conf.js 文件

    var path = require('path')
    var utils = require('./utils')
    var config = require('../config')
    var vueLoaderConfig = require('./vue-loader.conf')

    function resolve(dir) {
    return path.join(__dirname, '..', dir)
    }

    module.exports = {
    /* 修改部分 ---------------- 开始 */
    entry: utils.entries(),
    /* 修改部分 ---------------- 结束 */
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
        config.build.assetsPublicPath :
        config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        'pages': resolve('src/pages'),
        'components': resolve('src/components')
        }
    },
    module: {
        rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
        },
        {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
        },
        {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
        },
        {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
        }
        ]
    }
    }
### webpack.dev.conf.js 文件
    var utils = require('./utils')
    var webpack = require('webpack')
    var config = require('../config')
    var merge = require('webpack-merge')
    var baseWebpackConfig = require('./webpack.base.conf')
    var HtmlWebpackPlugin = require('html-webpack-plugin')
    var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    // add hot-reload related code to entry chunks
    Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
    })

    module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
        'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        /* 注释这个区域的文件 ------------- 开始 */
        // new HtmlWebpackPlugin({
        //   filename: 'index.html',
        //   template: 'index.html',
        //   inject: true
        // }),
        /* 注释这个区域的文件 ------------- 结束 */
        new FriendlyErrorsPlugin()

        /* 添加 .concat(utils.htmlPlugin()) ------------------ */
    ].concat(utils.htmlPlugin())
    })
### webpack.prod.conf.js 文件
    var path = require('path')
    var utils = require('./utils')
    var webpack = require('webpack')
    var config = require('../config')
    var merge = require('webpack-merge')
    var baseWebpackConfig = require('./webpack.base.conf')
    var CopyWebpackPlugin = require('copy-webpack-plugin')
    var HtmlWebpackPlugin = require('html-webpack-plugin')
    var ExtractTextPlugin = require('extract-text-webpack-plugin')
    var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

    var env = config.build.env

    var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
        'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true
        }),
        // extract css into its own file
        new ExtractTextPlugin({
        filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true
        }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin

        /* 注释这个区域的内容 ---------------------- 开始 */
        // new HtmlWebpackPlugin({
        //   filename: config.build.index,
        //   template: 'index.html',
        //   inject: true,
        //   minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        //   },
        //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //   chunksSortMode: 'dependency'
        // }),
        /* 注释这个区域的内容 ---------------------- 结束 */

        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
                path.join(__dirname, '../node_modules')
            ) === 0
            )
        }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
        }])
        /* 该位置添加 .concat(utils.htmlPlugin()) ------------------- */
    ].concat(utils.htmlPlugin())
    })

    if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(' +
            config.build.productionGzipExtensions.join('|') +
            ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
        })
    )
    }

    if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
    }

    module.exports = webpackConfig
至此，webpack的配置就结束了。

## 文件结构
    |    ├── src
    │   ├── assets
    │   │   └── logo.png
    │   ├── components
    │   │   ├── Hello.vue
    │   │   └── cell.vue
    │   └── pages
    │       ├── cell
    │       │   ├── cell.html
    │       │   ├── cell.js
    │       │   └── cell.vue
    │       └── index
    │           ├── index.html
    │           ├── index.js
    │           ├── index.vue
    │           └── router
    │               └── index.js

src就是我所使用的工程文件了，assets,components,pages分别是静态资源文件、组件文件、页面文件。

原先，入口文件只有一个main.js,但现在由于是多页面，因此入口页面多了，我目前就是两个：index和cell，之后如果打包，就会在dist文件下生成两个HTML文件：index.html和cell.html(可以参考一下单页面应用时，打包只会生成一个index.html,区别在这里)。


## 页面跳转问题
既然是多页面，肯定涉及页面之间的互相跳转，就按照我这个项目举例，从index.html文件点击a标签跳转到cell.html。

一般都认为这样写：

    <!-- index.html -->
    <a href='../cell/cell.html'></a>
但这样写，不论是在开发环境还是最后测试，都会报404，找不到这个页面。


改成这样既可：

    <!-- index.html -->
    <a href='cell.html'></a>