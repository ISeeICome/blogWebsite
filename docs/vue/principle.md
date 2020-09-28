# vue实现数据双向数据绑定的底层原理

```js
    <body>
        <div>
            <input type="text" id="txt">
            <p id="show"></p>
        </div>
    </body>

    <script type="text/javascript">
        var obj = {};
        Object.defineProperty(obj, 'txt', {
            get: function () {
                return obj;
            },
            set : function (newValue) {
                document.getElementById('txt').value = newValue;
                document.getElementById('show').innerHTML = newValue;
            }
        })
        document.addEventListenter('keyup', function(e) {
            obj.txt = e.target.value;
        })
    
    </script>
```

# 语法

Object.defineProperty(obj, prop, descriptor)


## 参数
- obj: 要定义属性的对象
- prop: 要定义或修改的属性的名称或 Symbol
- descriptor: 要定义或修改的属性描述符。


## 返回值
被传递给函数的对象

## 描述

该方法允许精确的添加或修改对对象的属性。

通过赋值操作添加的普通属性是可枚举的，在枚举对象属性时会被枚举到（for...in或object.keys方法），可以改变这些属性值，也可以删除这些属性值。

这个方法允许修改默认的的额外选项（或配置）。默认情况下，使用Object.defineProperty()添加的属性值是不可修改（immutable）的。

对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。
- 数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。
- 存取描述符是由getter函数和setter函数所描述的属性。
- 一个描述符只能是这两者其中之一；不能同时是两者。

这两种描述符都是对象，它们共享以下可选键值（默认值是指在使用Object.defineProperty()定义属性时的默认值）

configurable
当且仅当该属性的configurable键值为true时，该属性才会出现在对象的枚举属性中。默认为false。

enumerable
当且仅当该属性的enumerable键值为true时，该属性才会出现在对象的枚举属性中。默认为false

数据描述符还具有以下可选键值：

存取描述符还具有以下可选键值

get 属性的getter函数，如果没有getter则为undefined。当访问该属性时，会调用此函数。执行时不传入任何函数，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值
默认为undefined

set 属性的setter函数，如果没有setter，则为undefined。当属性被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的this对象
默认为undefined

描述符默认值汇总
- 拥有布尔值的键configurable、enumerable和writeable的默认值时false
- 属性值和函数的键value、get、set字段的默认值为undefined

描述符可拥有的键值

|  | configurable | enumerable | value | writeable | get | set
| --- | --- | -- | -- | -- | -- | --- | --- | 
| 数据描述符 | 可以 | 可以 | 可以 | 可以 | 不可以 | 不可以
| 存取描述符 | 可以 | 可以 | 不可以 | 不可以 | 可以 | 可以

如果一个描述符不具有value、writable、get和set中的任意一个键，那么它将被认为是一个数据描述符。如果一个数据描述符同时拥有value或writable和get或set键，则会产生一个异常。

记住，这些选项不一定是自身属性，也要考虑继承来的属性。为了确认保留这些默认值，在设置之前，可能要冻结Object.prototype，明确指定所有的选项，或者通过Object.create(null)将__proto__属性指向null。

```js
// 使用__proto__
var obj = [];
var descriptor = Object.create(null); // 没有继承的属性

// 默认没有 enumerable，没有 configurable，没有writable
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor)

//显式
Object.defineProperty(obj, 'key', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: 'static'
})

// 循环使用同一对象
function withValue(value) {
    var d = withValue.d || (
        withValue.d = {
            enumerable: false,
            writable: false,
            configurable: false,
            value: null
        }
    );
    d.value = value;
    return d;
}

// ... 并且 ...
Object.defineProperty(obj, "key", withValue("static"));

// 如果 freeze 可用，防止后续代码添加或删除对象原型的属性
// （value， get， set， enumerable, wirtable, configurable）
(Object.freeze || Object)(Object.prototype)
``` 
事例
创建属性
如果对象不存在指定的属性，Object.defineProperty会创建这个属性。当描述符中省略某些字段时，这些字段将使用它们的默认值。
```js
    var o = {};

    // 在对象中添加一个属性与数据描述符的示例
    Object.defineProperty(o, "a", {
        value: 37,
        writable: true,
        enumberable: true,
        configurable: true
    });

    // 对象 o 拥有了属性a, 值为37

    // 在对象中添加一个设置了存储描述符的示例
    var bValue = 38;
    Object.defineProperty(o, "b", {
        // 使用了方法名称缩写（ES2015特性）
        // 下面两个缩写等价于：
        // get: function() { return bValue },
        // set: function() { return bValue = newValue}

        get() { return bValue; },
        set(newValue) { bValue = newValue },
        enumerable: true,
        configurable: true
    })

    o.b;// 38
    // 对象 o 拥有了属性b，值为38
    // 现在，除非重新定义 o.b，o.b的值总是与bValue相同

    // 数据描述符和存取描述符不能混合使用

    Object.defineProperty(o, "conflict", {
        value: 0x9f91102,
        get() { return oxdeadbeef; }
    });

    // 抛出错误 typeError： value apeears only in data descriptors, get appears only in accessor descriptors
```
