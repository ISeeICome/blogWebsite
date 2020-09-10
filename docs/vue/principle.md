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