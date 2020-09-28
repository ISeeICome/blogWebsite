# this

**this** 是 JavaScript 语言的一个关键字。在 JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变。

- 在对象方法中，this 表示该方法所属的对象。
- 如果单独使用，this 表示全局对象。
- 在函数中，this 表示全局对象。
- 在函数中，在严格模式下，this 是未定义的(undefined)。
- 在事件中，this 表示接收事件的元素。
- 类似 call() 和 apply() 方法可以将 this 引用到任何对象。


### 方法中的this
在某个对象的方法中，this指向调用它所在方法的对象。
如下所示，this表示person对象。

``` js
    const person = {
        firstName: "John",
        lastName : "Doe",
        id       : 5566,
        fullName : function() {
            return this.firstName + " " + this.lastName;
        }
    };
```

### 单独使用this
单独使用this，则它指向全局（global）对象
在浏览器中，window就是该全局对象为[object Window];

``` js
const x = this;
```

严格模式下，如果单独使用，this也是指向全局（Global）对象。
``` js
“use strict”
const x = this;
```

### 函数中使用this

默认
在函数中，函数的所属者默认绑定到this上。
在浏览器中，window就是该全局对象为[object Window];

```js
function myFunction() {
    return this;
}
```

函数中使用this（严格模式）
严格模式下函数是没有绑定到this上，这时候this是undefined。

```js
use strict
function myFunction() {
    return this;
}
```


### 事件中的this
在HTML事件句柄中，this指向了接收事件的HTML元素：
```js
<button onclick="this.style.display='none">
点击消失
</button>
```

### 显示函数绑定this

在javascript中函数也是对象，对象则有方法，apply、call、bind就是函数对象的方法。这两个方法允许切换函数执行的上下文环境，机this绑定的对象。

```js
const person1 = {
    fullName: function(){
        return this.firstName + " " + this.lastName;
    }
}

const person2 = {
    firstName: "John",
    lastName: "Doe"
}

person1.fullName.call(person2); // "John Doe"
```


