# call、apply、bind的区别
---

call、apply、bind都是为了指定当前函数的this。

---

## 区别

- 从执行结果来看，call、apply都是对函数的直接调用，bind返回值仍让是一个函数。

    举例：a.call(b)或者a.apply(b)可直接执行函数,而bind需要a.bind(b)()才能执行函数。

- 从传参数角度来看（第一个值都是this的执行）
    - call和bind传递的参数是多个，传递的参数与方法中的参数一一对应。
    - apply传参的是一个数组,数组中的元素与方法中的参数一一对应。

```js
    a.call(b, 参数1, 参数2, 参数3)
    b.apply(b, [参数1, 参数2, 参数3])

    // bind的传参数式和call相同，但又因为bind返回的是函数，所以可以像正常函数传参一样。

    a.bind(b,参数1, 参数2, 参数3)
```