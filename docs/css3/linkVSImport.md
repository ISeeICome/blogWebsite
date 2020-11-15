# link与import的区别

- link属于XHTML定义的，而@import是css提供的一种方式
    link标签除了可以加载css外，还可以做很多其他的事情，比如定义RSS，定义rel连接属性等，@import只能加载CSS。
- 加载顺序存在差别：当一个页面被加载的时候，link引用的css会同时被加载，而@import引用的css会等到页面全部被下载完再加载。所以有时候浏览@import加载CSS的页面会没有样式（就是闪烁），特别是网速慢的时候很明显。
- 兼容性存在差别：@import是CSS2.1提出的所以老得浏览器不支持，@import只有在IE5以上的浏览器才能识别，而link标签无此问题，完全兼容。
- 使用dom控制样式时的差别：当使用javascript控制dom去改变样式的时候，只能使用link标签，因为@import不是dom可以控制的（不支持）
- @import可以在css中国呢再次引入其它样式表，比如创建一个主样式表，在主样式表中再引入其它的样式表。
