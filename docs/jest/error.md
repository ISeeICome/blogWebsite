# 错误记录

## 1、TypeError: Cannot read property '$el' of undefined

      20 |   it('trigger clicks event -- turnBack', async () => {
      21 |     let router = new VueRouter();
    > 22 |     let wrapper = mount(MarkPage, {

以上错误原因是由Vue Test Utils默认添加的同步Transition Stint组件引起的。可以使用以下stubs选项将其关闭：

比如：

```js
mount（TestComponent，{
stubs: {
    transition: false
  }
```