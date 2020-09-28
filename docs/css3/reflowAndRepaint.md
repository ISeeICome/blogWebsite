# 回流与重绘

## 浏览器的渲染过程

- 1、解析HTML、生成DOM数，解析CSS，生成CSSOM树。
- 2、将DOM树和CSSOM树结合，生成渲染树（Render Tree）
- 3、Layout（回流）：根据生成的渲染树，进行回流（Layout），得到节点的几何信息（位置，大小）
- 4、Painting（重绘）：根据渲染树以及回流得到的几何信息，得到节点的绝对像素。
- 5、Display：将像素发送给GPU，展示在页面上。（这一步其实还有很多内容，比如会在GPU将多个合成层合并为同一个层，并展示在页面上，而css3硬件加速器的原理则是新建合成层）

注：DOM树里包含了所有HTML标签，包含display：none隐藏的标签，还有js动态添加的元素等。

为了构建渲染树，浏览器主要完成了一下工作
- 1、从DOM树的根节点开始遍历每个可见节点。
- 2、对于每个可见的节点，找到CSSOM树中对应的规则，并应用它们。
- 3、根据每个可见节点以及其对应的样式，组合成渲染树。

不可见的节点：
- 1、一些不会渲染输出的节点、比如script、meta、link等
- 2、一些通过css进行隐藏的节点。比如dusplay：none。注意visiblity和opacity隐藏的节点，还是绘显示在渲染树上的。只有display：none的节点才不会显示在渲染树上。

render tree类似于DOM tree，但也存在很大的区别，因为render tree能识别样式，render tree中每个NODE都有自己的style，而且render tree不包含隐藏的节点（display：none的节点，还有header节点），因为在这些节点都不会用于呈现，而且不会影响呈现的，所以就不会包含到render tree中。

## 什么是回流
计算DOM节点在设备视口（viewport）内的位置和大小的过程被称为回流（reflow）。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建render tree。在回流的时候，浏览器会使渲染树中收到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程称为重绘。

## 什么是重绘
把渲染树上的每个节点都转化为屏幕上的实际像素的过程称为重绘。

当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格、而不会影戏那个布局的，比如background-color。这叫重绘。

## 区别
- 回流必将引起重绘，而重绘不一定绘引起回流。
比如：颜色改变就只会发生重绘而不会发生回流。

- 但页面布局和几何属性改变时就需要回流。
比如：添加或者删除可见的DOM元素，元素位置改变，元素尺寸改变--边距、填充、边框、宽度和高度，内容改变。

## 扩展
### 浏览器的优化机制
有上文可知回流比重绘的代价要更高，回流的花销跟render tree有多少哥节点需要构建有关系。
因为这些机制的存在，所以浏览器绘帮助我们优化这些操作，浏览器会维护1各队列，把所有会引起回流、重绘的操作放入这个队列，等队列重的操作到了一定的数量或者到了一定的时间间额，浏览器就会flush队列，进行一个批处理。这样就会让多次的回流、重绘变成一次回流重绘

当获取布局信息的操作的时候，绘墙纸队列刷新。比如访问以下属性或者方法：
offsetTop、offsetLeft、offsetWidth、offsetHeight
scrollTop、scrollLeft、scrollWidth、scrollHeight
clientTop、clientLeft、clientWidth、clientHeight
getComputedStyle（）
getBoundingClientRect
以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，最好避免使用上面列出的属性，他们都会刷新渲染队列。如果要使用它们，最好将值缓存起来。

## 减少回流和重绘
### 最小化重绘和重排

由于回流和重绘的代价比较高，可以合并多次对DOM和样式的修改，让后一次处理掉。
``` js
const el = document.getElementById('test');
el.style.padding = '10px';
el.style.borderLeft = '10px';
el.style.borderRight = '10px';
```
使用cssText优化

``` js
const el = document.getElementById('test');
el.style.cssText += 'border-left:10px;border-right:10px;paddding:10px';
```

使用CSS的class优化

``` js
const el = document.getElementById('test');
el.className = 'active';
```

批量修改DOM
当我们需要对DOM对一系列修改的时候，可以通过以下步骤减少回流重绘次数：
- 1、使元素脱离文档流
- 2、对其进行多次修改
- 3、将元素带回到文档中

该过程的第一步和第三步可能会引起回流，但是进过第一步之后，对DOM的所有修改都不会引起回流，因为它已经不再渲染树了。

有三种方式可以让DOM脱离文档流

- 隐藏元素，应用修改，重新显示
- 使用文档片段（document fragment）在当前DOM之外构建一个子树，在把它拷贝回文档。
- 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素



```js
function appendDataToElement（appendToelement， data）{
    let li;
    for (let i = 0; i < data.length; i++) {
        li = document.createElement('li');
        li.textContent = 'text';
        appendToElement.appendChild(li);
    }
    const li = docuemnt.getElemetnById('list');
    ul.style.display = 'none';
    appendDataToElement(ul, data);
    ul.style.display = 'block';
}
```