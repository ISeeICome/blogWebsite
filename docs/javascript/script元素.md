<!--
 * @Author: your name
 * @Date: 2020-12-09 21:13:34
 * @LastEditTime: 2020-12-09 22:33:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blogWebsite/docs/javascript/script元素.md
-->
# script元素

向HTML页面职工插入JavaScript中的主要办法，就是使用<script>元素。

HTML 4.01为<script>定义了下列6个属性

    - src：可选。表示包含要执行代码的外部文件
    - async：可选。表示应该立即下载脚本，但不应该妨碍页面中的其它操作，比如下载其它资源或等待还在其它脚本。只对外部脚本文件有效。
    - defer：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。IE7及更早版本对嵌入脚本也支持这个属性。只对外部脚本文件有效。
    - cahrset：可选。表示通过src属性指定的代码的字符集。由于大多数浏览器会忽略它的值，因此这个值很少人会用。
    - language：已废弃。原来用于表示编写代码使用的脚本语言（如javascript、Javascript1.2或VBScript）。大多数浏览器会忽略这个属性，因此也没有必要再用了。
    - type：可选。可以看成是language的替代属性；表示编写代码使用的脚本语言的内容类型（也称为MIME类型）。虽然text/javascript和text/ecmascript都已经不被推荐使用，但人们一直使用的都还是text/javascript。实际上，服务器在传送Javascript文件时使用的MIME类型通常都是application/x-javascript，但在type中设置这个值却可能导致脚本被忽略。另外，在非IE浏览器中还可以使用以下值：application/javascript和application/ecmascript。考虑到约定俗称和最大限度的浏览器兼容性，目前 type 属性的值依旧还是text/javascript。不过，这个属性并不是必需的，如果没有这个属性，则其默认值仍为text/javascript。

使用<script>元素的方式有两种：直接在页面中嵌入JavaScript代码和包含外部Javascript文件

在使用<script>元素嵌入Javascript代码时，只须为<script>指定type属性。然后，像下面这样把Javascript代码直接放在元素内部即可：（经过测试确定可以不用写type="text/javascript"，不写type默认就是text/javascript）

```js
  <script type="text/javascript">
    function sayHi() {
        alert('hi')
    }
  </script>
```
包含在<script>元素内部的JavaScript代码将被从上至下一次解释。就拿前面这个例子来说，解释器会解释一个函数的定义，然后将该定义保存在自己的环境当中。在解释器对<script>元素内部的所有代码求值完毕之前，页面中的其它内容都不对被浏览器加载或显示

在使用<script>嵌入Javascrit代码时，记住不要在代码中的任何地方出现“</script>”字符串。例如，浏览器在加载下面所示的代码时就会产生一个错误：
```js
<script type="text/javascript">
  function sayScript() {
      alert("</script>")
  }
</script>
```

因为按照解析嵌入式代码的规则，当浏览器遇到字符串“</script>”时，就会认为那是结束的</script>标签。而通过转义字符“\”解决这个问题，例如：
```js
<script type="text/javascript">
  function sayScript() {
      alert("<\/script>")
  }
</script>
```
这样写代码浏览器就会接受，因而也就不会导致错误了