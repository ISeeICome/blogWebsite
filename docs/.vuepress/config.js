const javascriptRoute = require('./sliderBar/javascript');
console.log(javascriptRoute)
module.exports = {
    title: 'ISeeICome的博客', // 设置网站标题
    description: 'Just for fun', //描述
    dest: './dist',   // 设置输出目录
    port: 80, //端口
    themeConfig: { //主题配置
    nav: [
        {
          text: "首页",
          link: "/",
        },
        {
          text: "标签",
          link: "/label/index",
        },
        {
          text: "美文",
          link: "/article/index",
        },
        {
          text: "博客日记",
          link: "/diary",
        },
        {
          text: "备忘录",
          link: "/memorandum/index",
        }
    ],
    // 为以下路由添加侧边栏
    sidebar: {
        "/": [
            {
              title: "JavaScript",
              collapsable: true,
              path: "/javascript/",
              children: [
                { title: "继承", path: "/javascript/inherit" },
                { title: "原型链", path: "/javascript/prototypeChain" },
                { title: "this的指向与绑定", path: "/javascript/this" },
                { title: "call、apply、bind区别", path: "/javascript/call_apply_bind" }
              ]
            },
            {
                title: "CSS3",
                collapsable: true,
                path: "/css3/",
                children: [
                  { title: "回流与重绘", path: "/css3/reflowAndRepaint" }
                ],
            },
            {
              title: "VUE",
              collapsable: true,
              path: "/vue/",
              children: [
                { title: "实现双向数据绑定", path: "/vue/principle" },
                { title: "多页面应用开发", path: "/vue/morePages" },
              ],
            },
            {
              title: "前端性能优化",
              collapsable: true,
              path: "/frontEndOptimization/",
              children: [
                { title: "前端页面加载速度指数", path: "/frontEndOptimization/performance" },
                { title: "谷歌的预连接、预加载、预渲染", path: "/frontEndOptimization/谷歌的预连接_预加载_预渲染" },
                { title: "谷歌浏览器实现预加载预预渲染", path: "/frontEndOptimization/谷歌浏览器实现预加载预预渲染" },
                { title: "浏览器缓存", path: "/frontEndOptimization/浏览器缓存" },
                { title: "prerender-spa-plugin预渲染", path: "/frontEndOptimization/prerender-spa-plugin预渲染" },
                { title: "文本风格", path: "/frontEndOptimization/textStyle" },
                { title: "标题的使用", path: "/frontEndOptimization/titleUsing" },
              ],
            },
            {
                title: "算法",
                collapsable: true,
                path: "/algorithm/",
                children: [
                  { title: "排序算法", path: "/algorithm/sort" }
                ],
            },
            {
              title: "jquery",
              collapsable: true,
              path: "/jquery/ps",
              children: [
                { title: "jquery注意事项", path: "/jquery/ps" }
              ],
            },
            {
              title: "webpack",
              collapsable: true,
              path: "/webpack/introduction",
              children: [
                { title: "介绍", path: "/webpack/introduction" },
                { title: "核心", path: "/webpack/coreConcept" },
              ],
            },
            {
              title: "jest",
              collapsable: true,
              path: "/jest/error",
              children: [
                { title: "错误记录", path: "/jest/error" }
              ],
            },
            {
              title: "vagrant",
              collapsable: true,
              path: "/vagrant/introduction",
              children: [
                { title: "介绍", path: "/vagrant/introduction" },
                { title: "常用命令", path: "/vagrant/vagrantCmd" },
                { title: "异常记录", path: "/vagrant/ps" },
              ],
            },
            {
              title: "恶意攻击",
              collapsable: true,
              path: "/hiddenDange/",
              children: [
                { title: "xss攻击", path: "/hiddenDange/xss" }
              ],
            },
            {
              title: "计算机基础",
              collapsable: true,
              path: "/computerBasic/",
              children: [
                { title: "计算机原理", path: "/computerBasic/computeOriginal" },
                { title: "存储单位", path: "/computerBasic/storageUnit" },
              ],
            },  
            {
                title: "其它",
                collapsable: true,
                path: "/other/",
                children: [
                  { title: "一次完整的HTTP请求发生了什么", path: "/other/httpRequest" },
                  { title: "TCP握手为什么是三次而不是两次", path: "/other/tcpHandShake" },
                  { title: "模块化规范", path: "/other/moduleStandard" },
                  { title: "linux命令", path: "/other/linuxCmd" },
                  { title: "命令规范", path: "/other/namingConventions" },
                ],
            }
        ]
      },
      footer: {
        contact: [
          {
            type: 'github',
            link: 'https://github.com/vuejs/vuepress',
          },
          {
            type: 'twitter',
            link: 'https://github.com/vuejs/vuepress',
          },
        ],
      },
      sidebarDepth: 2, // 默认 1 提取到 h2，0 为禁用，2 为 h2，h3
      displayAllHeaders: false, // 默认值：false 侧边栏只会显示由当前活动页面的标题组成的链接
      activeHeaderLinks: true, // 默认值：true 滚动时通过 hash 高亮侧边栏标题

      dateFormat: 'YYYY-MM-DD', // 日期格式
      // Git 仓库和编辑链接
      repo: 'https://github.com/ISeeICome?tab=repositories', // 你的仓库
      repoLabel: 'GitHub', // 导航栏上的文本
  
    //   editLinks: true,
    //   默认为 "Edit this page"
    //   editLinkText: '编辑此页面'
    }
}  