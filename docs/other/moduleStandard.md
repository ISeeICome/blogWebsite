# 模块化规范
## 目的
- 代码单元冠以命名，增强代码段的辨识度
- 建立代码之间的依赖关系，降低代码段之间的耦合
- 命名空间和上下文管理，减少代码段之间的相互冲突
- 形成模块规范，提高代码段的复用性
## 模块化规范
- CommonJS规范。同步加载。（用于node服务器）

- AMD/CMD。（用于浏览器）

    AMD(Asynchronous Module Definition)异步模块加载机制。AMD是RequireJS在推广过程中对模块定义的规范化产出。

    CMD(Common Module Definition)。CMD是SeaJS在推广过程中对模块定义的规范化产出。SeaJS已经停止维护。

- UMD(Universal Module Definition)通用模块规范。（结合commonjs与AMD）

- ES6模块化规范。

## 规范详情

### CommonJS规范
解决nodeJs的模块化问题。由于Node.js主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以CommonJS规范也是同步加载依赖模块，加载完后执行后面代码。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD CMD 解决方案。

commonsJS的加载机制，输入的是被输出值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值了。对象除外。

 简单实现req（require）函数
 ```js
    let fs=require('fs');
    //实现一个require函数
    function req(fileName){
        let content=fs.readFileSync(fileName,'utf8');
        let module={
            exports:{}
        }
        //new Function 的最后一个参数是函数体    其他的参数是形参
        let fn=new Function('exports','module','__dirname','__filename',content+' \n return module.exports');
        //等价于
        /*let fn=function(exports,module,__dirname,__filename){
            console.log(content)
            eval(content);
            return module.exports;
        }*/
        module.exports=fn(module.exports,module,__dirname,__filename);
        return module.exports;
    }
    let obja=req('./a.js');
    console.log(obja);
```
### AMD/CMD规范
CMD推崇依赖就近，可以把依赖写进你的代码中的任意一行

```js
    define(function(require, exports, module) {
        var a = require('./a')
        a.doSomething()
        var b = require('./b')
        b.doSomething()
    })
```
代码在运行时，首先是不知道依赖的，需要遍历所有的require关键字，找出后面的依赖。具体做法是将function toString后，用正则匹配出require关键字后面的依赖。显然，这是一种牺牲性能来换取更多开发便利的方法。

AMD是依赖前置的，换句话说，在解析和执行当前模块之前，模块作者必须指明当前模块所依赖的模块，表现在require函数的调用结构上为：
```js
    define(['./a','./b'],function(a,b){
        a.doSomething()
        b.doSomething()
    })
```
代码在一旦运行到此处，能立即知晓依赖。而无需遍历整个函数体找到它的依赖，因此性能有所提升，缺点就是开发者必须显式得指明依赖——这会使得开发工作量变大，比如：当你写到函数体内部几百上千行的时候，忽然发现需要增加一个依赖，你不得不回到函数顶端来将这个依赖添加进数组。

AMD和CMD的思想的关于依赖的部分还可以分为硬依赖和软依赖。以上讨论的时硬依赖。软依赖举例如下。
```js
    // 函数体内：
    if(status){
        async(['a'],function(a){
            a.doSomething()
        })
    }
}
```
    “强依赖” —— 肯定需要 和“弱依赖” —— 可能需要。

    对于强依赖，如果要性能优先，则考虑参照依赖前置的思想设计你的模块加载器；如果考虑开发成本优先，则考虑按照依赖就近的思想设计你的模块加载器。

    对于弱依赖，只需要将弱依赖的部分改写到回调函数内即可。

### UMD模块规范

    UMD的实现很简单，先判断是否支持NodeJS模块格式（exports是否存在），存在则使用NodeJS模块格式。

    再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。前两个都不存在，则将模块公开的全局（window或global）。
```js
下面是一个示例
(function (root, factory) {  
    if (typeof exports === 'object') {  
        module.exports = factory();  
          
    } else if (typeof define === 'function' && define.amd) {  
        define(factory);  
          
    } else {  
        root.eventUtil = factory();  
    }  
})(this, function() {  
    // module  
    return {  
        addEvent: function(el, type, handle) {  
            //...  
        },  
        removeEvent: function(el, type, handle) {  
              
        },  
    };  
});
```
### ES6规范
ES6静态加载的设计思想，使得在编译时就可以确定模块的依赖关系，以及输入、输出的变量。ES6则在语言层面上实现了模块化，取代CommonJS、AMD、CMD成为服务端和浏览器端通用的模块解决方案。（CommonJS、AMD、CMD运行时确定依赖关系）

## node中的ES6与commonjs模块
Node对ES6模块的处理比较麻烦，因为它有自己的CommonJS模块格式，与ES6模块格式是不兼容的。目前的解决方案是，将两者分开，ES6模块和CommonJS采用各自的加载方案。

在静态分析阶段，一个模块脚本只要有一行import或export语句，Node就会认为该脚本为ES6模块，否则就为CommonJS模块。如果不输出任何接口，但是希望被Node认为是ES6模块，可以在脚本中加上如下语句。
```js
    export {};
```
上面的命令并不是输出一个空对象，而是不输出任何接口的ES6标准写法。 
如果不指定绝对路径，Node加载ES6模块会依次寻找以下脚本，与require()的规则一致（具体可看模块解析策略）。
ES6模块之中，顶层的this指向undefined，CommonJS模块的顶层this指向当前模块，这是两者的一个重大差异。
### import命令加载CommonJS模块
Node采用CommonJS模块格式，模块的输出都定义在module.exports属性上面。在Node环境中，使用import命令加载CommonJS模块，Node会自动将module.exports属性当作模块的默认输出，即等同于export default。

下面是一个CommonJS模块。
```js
// a.js
module.exports = {
  foo: 'hello',
  bar: 'world'
};

// 等同于
export default {
  foo: 'hello',
  bar: 'world'
};
```
import命令加载上面的模块，module.exports会被视为默认输出。
```js
// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法二
import {default as baz} from './a';
// baz = {foo: 'hello', bar: 'world'};
```
如果采用整体输入的写法（import * as xxx from someModule），default会取代module.exports作为输入的接口
```js
import * as baz from './a';
// baz = {
//   get default() {return module.exports;},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }
```
上面的代码中，this.default取代了module.exports。需要注意的是，Node会自动为baz添加default属性，通过baz.default获取module.exports。
```js
// b.js
module.exports = null;

// es.js
import foo from './b';
// foo = null;

import * as bar from './b';
// bar = {default:null};
```
上面的代码中，es.js采用第二种写法时，要通过bar.default这样的写法才能获取module.exports。

下面是另一个例子。
```js
// c.js
module.exports = function two() {
  return 2;
};

// es.js
import foo from './c';
foo(); // 2

import * as bar from './c';
bar.default(); // 2
bar(); // throws, bar is not a function
```
上面的代码中，bar本身是一个对象，不能当作函数调用，只能通过bar.default调用。

CommonJS模块的输出缓存机制在ES6加载方式下依然有效。
```js
// foo.js
module.exports = 123;
setTimeout(_ => module.exports = null);
```
上面的代码中，对于加载foo.js的脚本，module.exports将一直是123，而不会变成null。

由于ES6模块是编译时确定输出接口，CommonJS模块是运行时确定输出接口，所以采用import命令加载CommonJS模块时，不允许采用下面的写法。
```js
import {readfile} from 'fs';
```
上面的写法不正确，因为fs是CommonJS格式，只有在运行时才能确定readfile接口，而import命令要求编译时就确定这个接口。解决方法就是改为整体输入。
```js
import * as express from 'express';
const app = express.default();

import express from 'express';
const app = express();
```
### require命令加载ES6模块 
采用require命令加载ES6模块时，ES6模块的所有输出接口都会成为输入对象的属性。
```js
// es.js
let foo = {bar:'my-default'};
export default foo;
foo = null;

// cjs.js
const es_namespace = require('./es');
console.log(es_namespace.default);
// {bar:'my-default'}
```
上面的代码中，default接口变成了es_namespace.default属性。另外，由于存在缓存机制，es.js对foo的重新赋值没有在模块外部反映出来。
```js
// es.js
export let foo = {bar:'my-default'};
export {foo as bar};
export function f() {};
export class c {};

// cjs.js
const es_namespace = require('./es');
// es_namespace = {
//   get foo() {return foo;}
//   get bar() {return foo;}
//   get f() {return f;}
//   get c() {return c;}
// }
```
### CommonJS与ES6的循环加载
#### 循环加载
循环加载”（circular dependency）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。
```js
// a.js
var b = require('b');

// b.js
var a = require('a');
```
通常，“循环加载”表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现这种现象。

但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目中很容易出现a依赖b，b依赖c，c又依赖a这样的情况。这意味着，模块加载机制必须考虑“循环加载”的情况。

对于JavaScript语言来说，目前最常见的两种模块格式CommonJS和ES6在处理“循环加载”时的方法是不一样的，返回的结果也不一样。
#### CommonJS模块的加载原理
介绍ES6如何处理“循环加载”之前，先介绍目前最流行的CommonJS模块格式的加载原理。

CommonJS的一个模块就是一个脚本文件。require命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成一个对象。
```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```
上面的代码就是Node内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。

以后需要用到这个模块时就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载时就返回第一次运行的结果，除非手动清除系统缓存。
#### CommonJS模块的循环加载
CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候就会全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

让我们来看一下Node官方文档（nodejs.org/api/modules.html#modules_cycles）里面的例子。脚本文件a.js代码如下。
```js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```
上面的代码之中，a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js。注意，此时a.js代码就停在这里，等待b.js执行完毕再往下执行。

再看b.js的代码。
```js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```
上面的代码中，b.js执行到第二行就会加载a.js，这时就发生了“循环加载”，系统会去a.js模块对应对象的exports属性中取值，可是因为a.js还没有执行完，因此从exports属性中只能取回已经执行的部分，而不是最后的值。

a.js已经执行的部分只有以下一行。
```js
exports.done = false;
```
因此，对于b.js来说，它从a.js只输入一个变量done，值为false。

然后，b.js接着执行，等到全部执行完毕，再把执行权交还给a.js。于是，a.js接着执行，直到执行完毕。下面，我们来写一个脚本main.js验证这个过程。
```js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```
执行main.js，运行结果如下。
在 b.js 之中，a.done = false 
b.js 执行完毕 
在 a.js 之中，b.done = true 
a.js 执行完毕 
在 main.js 之中, a.done=true, b.done=true

上面的代码证明了两件事。第一，在b.js之中，a.js没有执行完毕，只执行了第一行。第二，reimain.js执行到第二行时不会再次执行b.js，而是输出缓存的b.js的执行结果，即它的第四行
```js
exports.done = true;
```
总之，CommonJS输入的是被输出值的复制，而不是引用。

另外，由于CommonJS模块遇到循环加载时返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候必须非常小心。
```js
var a = require('a');               // 安全的写法
var foo = require('a').foo;         // 危险的写法

exports.good = function (arg) {
  return a.foo('good', arg);        // 使用的是a.foo的最新值
};

exports.bad = function (arg) {
  return foo('bad', arg);       // 使用的是一个部分加载时的值
};
```
上面的代码中，如果发生循环加载，require(‘a’).foo的值很可能会被改写，改用require(‘a’)会更保险一点。
#### ES6模块的循环加载
ES6处理“循环加载”与CommonJS有本质的不同。ES6模块是动态引用，如果使用import从一个模块中加载变量（即import foo from ‘foo’），那么，变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者保证在真正取值的时候能够取到值。

请看下面这个例子。
```js
// a.js如下
import {bar} from './b.js';
console.log('a.js');
console.log(bar);
export let foo = 'foo';

// b.js
import {foo} from './a.js';
console.log('b.js');
console.log(foo);
export let bar = 'bar';
```
上面的代码中，a.js加载b.js，b.js又加载a.js，构成循环加载。执行a.js，结果如下。
```js
$ babel-node a.js
b.js
undefined
a.js
Bar
```
上面的代码中，由于a.js的第一行是加载b.js，所以先执行的是b.js。而b.js的第一行又是加载a.js，这时由于a.js已经开始执行，所以不会重复执行，而是继续执行b.js，因此第一行输出的是b.js。

接着，b.js要打印变量foo，这时a.js还没有执行完，取不到foo的值，因此打印出来的是undefined。b.js执行完便会开始执行a.js，这时便会一切正常。

再来看一个稍微复杂的例子
```js
// a.js
import {bar} from './b.js';
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();

// b.js
import {foo} from './a.js';
export function bar() {
  console.log('bar');
  if (Math.random() > 0.5) {
    foo();
  }
}
```
按照CommonJS规范，上面的代码是无法执行的。a先加载b，然后b又加载a，这时a还没有任何执行结果，所以输出结果为null，即对于b.js来说，变量foo的值等于null，后面的foo()就会报错。

但是，ES6可以执行上面的代码。
```js
$ babel-node a.js
foo
bar
执行完毕

// 执行结果也有可能是
foo
bar
foo
bar
执行完毕
执行完毕
```
上面的代码中，a.js之所以能够执行，原因就在于ES6加载的变量都是动态引用其所在模块的。只要引用存在，代码就能执行。

下面，我们来详细分析这段代码的运行过程。
```js
// a.js

// 这一行建立一个引用，
// 从`b.js`引用`bar`
import {bar} from './b.js';

export function foo() {
  // 执行时第一行输出foo
  console.log('foo');
  // 到 b.js 执行 bar
  bar();
  console.log('执行完毕');
}
foo();

// b.js

// 建立`a.js`的`foo`引用
import {foo} from './a.js';

export function bar() {
  // 执行时，第二行输出bar
  console.log('bar');
  // 递归执行foo，一旦随机数
  // 小于等于0.5，就停止执行
  if (Math.random() > 0.5) {
    foo();
  }
}
```
## 模块解析策略
相对与非相对模块导入：
根据模块引用是相对的还是非相对的，模块导入会以不同的方式解析。
相对导入是以/，./或../开头的。 下面是一些例子：
```js
    - import Entry from "./components/Entry";
    - import { DefaultHeaders } from "../constants/http";
    - import "/mod";

    所有其它形式的导入被当作非相对的。 下面是一些例子：

    - import * as $ from "jQuery";
    - import { Component } from "angular2/core";
```
相对导入解析时是相对于导入它的文件来的，并且不能解析为一个外部模块声明。 你应该为你自己写的模块使用相对导入，这样能确保它们在运行时的相对位置。
### nodejs
Node.js模块是非常重要的。 通常，在Node.js里导入是通过require函数调用进行的。 Node.js会根据 require的是相对路径还是非相对路径做出不同的行为。

相对路径很简单。 例如，假设有一个文件路径为 /root/src/moduleA.js，包含了一个导入var x = require("./moduleB"); Node.js以下面的顺序解析这个导入：

将/root/src/moduleB.js视为文件，检查是否存在。

将/root/src/moduleB视为目录，检查是否它包含package.json文件并且其指定了一个"main"模块。 在我们的例子里，如果Node.js发现文件 /root/src/moduleB/package.json包含了{ "main": "lib/mainModule.js" }，那么Node.js会引用/root/src/moduleB/lib/mainModule.js。

将/root/src/moduleB视为目录，检查它是否包含index.js文件。 这个文件会被隐式地当作那个文件夹下的"main"模块。

你可以阅读Node.js文档了解更多详细信息：file modules 和 folder modules。

但是，非相对模块名的解析是个完全不同的过程。 Node会在一个特殊的文件夹 node_modules里查找你的模块。node_modules可能与当前文件在同一级目录下，或者在上层目录里。 Node会向上级目录遍历，查找每个node_modules直到它找到要加载的模块。

还是用上面例子，但假设/root/src/moduleA.js里使用的是非相对路径导入var x = require("moduleB");。 Node则会以下面的顺序去解析 moduleB，直到有一个匹配上。

    1、/root/src/node_modules/moduleB.js
    2、/root/src/node_modules/moduleB/package.json (如果指定了"main"属性)
    3、/root/src/node_modules/moduleB/index.js 

    4、/root/node_modules/moduleB.js
    5、/root/node_modules/moduleB/package.json (如果指定了"main"属性)
    6、/root/node_modules/moduleB/index.js 

    7、/node_modules/moduleB.js
    8、/node_modules/moduleB/package.json (如果指定了"main"属性)
    9、/node_modules/moduleB/index.js
    注意Node.js在步骤（4）和（7）会向上跳一级目录。

### typescript
    typescript共有两种可用的模块解析策略：Node和Classic。可以在tsconfig文件中使用 --moduleResolution标记为指定使用哪个。 默认值为 Node。

#### Classic

这种策略以前是TypeScript默认的解析策略。 现在，它存在的理由主要是为了向后兼容。

相对导入的模块是相对于导入它的文件进行解析的。 因此 /root/src/folder/A.ts文件里的import { b } from "./moduleB"会使用下面的查找流程：
```js
    /root/src/folder/moduleB.ts
    /root/src/folder/moduleB.d.ts
```
对于非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件。

比如：
有一个对moduleB的非相对导入import { b } from "moduleB"，它是在/root/src/folder/A.ts文件里，会以如下的方式来定位"moduleB"：
```js
    /root/src/folder/moduleB.ts
    /root/src/folder/moduleB.d.ts
    /root/src/moduleB.ts
    /root/src/moduleB.d.ts
    /root/moduleB.ts
    /root/moduleB.d.ts
    /moduleB.ts
    /moduleB.d.ts
```
#### Node
Node的解析策略试图在运行时模仿Node.js模块解析机制。

TypeScript是模仿Node.js运行时的解析策略来在编译阶段定位模块定义文件。 因此，TypeScript在Node解析逻辑基础上增加了TypeScript源文件的扩展名（ .ts，.tsx和.d.ts）。 同时，TypeScript在 package.json里使用字段"typings"来表示类似"main"的意义 - 编译器会使用它来找到要使用的"main"定义文件。

比如，有一个导入语句import { b } from "./moduleB"在/root/src/moduleA.ts里，会以下面的流程来定位"./moduleB"：
```js
    /root/src/moduleB.ts
    /root/src/moduleB.tsx
    /root/src/moduleB.d.ts
    /root/src/moduleB/package.json (如果指定了"typings"属性)
    /root/src/moduleB/index.ts
    /root/src/moduleB/index.tsx
    /root/src/moduleB/index.d.ts
```
回想一下Node.js先查找moduleB.js文件，然后是合适的package.json，再之后是index.js。

类似地，非相对的导入会遵循Node.js的解析逻辑，首先查找文件，然后是合适的文件夹。 因此/src/moduleA.ts文件里的import { b } from "moduleB"会以下面的查找顺序解析：
```js
    /root/src/node_modules/moduleB.ts
    /root/src/node_modules/moduleB.tsx
    /root/src/node_modules/moduleB.d.ts
    /root/src/node_modules/moduleB/package.json (如果指定了"typings"属性)
    /root/src/node_modules/moduleB/index.ts
    /root/src/node_modules/moduleB/index.tsx
    /root/src/node_modules/moduleB/index.d.ts 

    /root/node_modules/moduleB.ts
    /root/node_modules/moduleB.tsx
    /root/node_modules/moduleB.d.ts
    /root/node_modules/moduleB/package.json (如果指定了"typings"属性)
    /root/node_modules/moduleB/index.ts
    /root/node_modules/moduleB/index.tsx
    /root/node_modules/moduleB/index.d.ts 

    /node_modules/moduleB.ts
    /node_modules/moduleB.tsx
    /node_modules/moduleB.d.ts
    /node_modules/moduleB/package.json (如果指定了"typings"属性)
    /node_modules/moduleB/index.ts
    /node_modules/moduleB/index.tsx
    /node_modules/moduleB/index.d.ts
```
总结：在模块解析策略中Classic不会寻找以index结尾的文件或者package.json而Node会。