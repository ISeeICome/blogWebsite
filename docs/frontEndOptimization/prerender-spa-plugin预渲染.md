# prerender-spa-plugin预渲染

    vuejs 预渲染插件 prerender-spa-plugin 生成多页面 -- SEO前端vue等框架打包的项目一般为SPA应用，而单页面是不利于SEO的，现在的解决方案有两种：

1、SSR服务器渲染
　  了解服务器渲染请进，这里不做记录。

2、预渲染模式
　  这比服务端渲染要简单很多，而且可以配合 vue-meta-info 来生成title和meta标签，基本可以满足SEO的需求 
　  TIPS: 使用预渲染vue-router必须使用history模式

    // 安装
    npm install prerender-spa-plugin --save
然后在webpack.prod.conf.js里面添加：

    // 头部引入
    const PrerenderSPAPlugin = require('prerender-spa-plugin')
    const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
在plugins里面添加：

    new PrerenderSPAPlugin({
    // 生成文件的路径，也可以与webpakc打包的一致。
    // 下面这句话非常重要！！！
    // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
    staticDir: path.join(__dirname, '../dist'),

    // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
    routes: ['/', '/a', '/b', '/c', '/d'],

    // 预渲染代理接口
    server: {
        proxy: {
        '/api': {
            target: 'http://localhost:9018',
            secure: false
        }
        }
    },

    // 这个很重要，如果没有配置这段，也不会进行预编译
    renderer: new Renderer({
        inject: {
        foo: 'bar'
        },
        headless: false,
        // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
        renderAfterDocumentEvent: 'render-event'
    })
    }),
最后在main.js里面修改：

    new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    // 添加mounted，不然不会执行预编译
    mounted () {
        document.dispatchEvent(new Event('render-event'))
    }
    })
到这里预编译的配置修改就完成了，执行 npm run build 查看打包后的dist文件。

安装 vue-meta-info 配置title和meta：

    npm install vue-meta-info --save

在main.js引入：

    import MetaInfo from 'vue-meta-info'
    Vue.use(MetaInfo)
在vue页面中配置：

    <script>
    export default {
    // 配置title和meta数据
    metaInfo: {
        title: '我是一个title',
        meta: [
        {
            name: 'keywords',
            content: '关键字1,关键字2,关键字3'
        },
        {
            name: 'description',
            content: '这是一段网页的描述'
        }
        ]
    },
    data () {
        return {}
    }
    }
    </script>
到这里 prerender-spa-plugin 与 vue-meta-info 就全部完成了
