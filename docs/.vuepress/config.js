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
                { title: "this的指向与绑定", path: "/javascript/this" }
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
                { title: "实现双向数据绑定", path: "/vue/principle" }
              ],
            },
            {
                title: "算法",
                collapsable: true,
                path: "/algorithm/",
                children: [
                  { title: "排序算法", path: "/algorithm/sort" }
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