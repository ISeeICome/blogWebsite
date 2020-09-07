
module.exports = [
    { text: '主页', link: '/' }, // 导航条
    { text: '组件文档', link: '/baseComponents/' },
    { text: '知识库', link: '/knowledge/' },
    { text: 'github',        // 这里是下拉列表展现形式。
      items: [
        { text: 'focus-outside', link: 'https://github.com/TaoXuSheng/focus-outside' },
        { text: 'stylus-converter', link: 'https://github.com/TaoXuSheng/stylus-converter' },
      ]
    }
]