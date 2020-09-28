# 原型链

javascript--原型与原型对象
## prototype
在JavaScript中，每个函数都有一个prototype属性，这个属性指向函数的原型对象。

原型的概念:每一个javascript对象（除null外）创建的时候，就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型中“继承”属性

例如
```js
function Person(age) {
    this.age = age;
}

Person.prototype.name = 'xiaoming';
const person1 = new Person();
const person2 = new Person();
console.log(person1.name)  // xiaoming
console.log(person2.name)  // xiaoming
```

上述例子中，函数的prototype指向了一个对象，而这个对象正是调用构造函数时创建的示例的原型，也就是person1和person2的原型。

## __protp__

这是每一个对象（除null）都会有的属性，叫做__proto__,这个属性会指向该对象的原型。
```js
    function Person() {

    }
    var person = Person();
    console.log(person.__proto__ === Person.prototype); // true
```

### constructor
每个原型都有一个constructor属性，指向该关联的构造函数。
```js
function() {

}
console.log(Person === Person.ptototype.constructor);
```

示例
```js
    function Person() {

    }

    var person = new Person();
    console.log(person.__ptoto__ === person.prototype) // true
    console.log(Person.prototype.constructor = Person)  // true

    console.log(Object.getPrototypeOf(person) === Person.prototype) // true
    console.log(person.constructor === Person); // true
```
当获取person.constructor时，其实person中并没有constructor属性，但不能读取到constructor属性时，会从person的原型也就是Person.prototype中读取，正好原型中有该属性，所以person.constructor === Person.prototype.constructor

## 实例与原型
当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
    function person() {

    }

    Person.prototype.name = 'xiaoming';

    const person = new person();

    person.name = 'liwei'
    console.log(person.name) // liwei

    delete person.name;
    console.log(person.name) // xiaoming
```

## 原型的原型

在前面，已经讲了原型也是一个对象，既然是对象，我们就可以用最原始的方法创建它，那就是：
```js
    const obj = new object();
    obj.name = 'xiaoming'
    console.log(obj.name) // xiaoming
```
其实原型对象就是通过Object构造函数生成的，结合之前所讲，实例的__proto__指向函数的prototype。


## 原型链



简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都不含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。
那么假如我们让原型对象等于另一个类型的实例，结果会怎样？
显然，此时的原型对象将包含一个指向另一个的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立。如此层层递进，就构成了实例与原型的链条。

Object.prototype的原型是什么呢？
```js
console.log(Object.prototype.__proto__ === null) // true
```
引用阮一峰老师的《undefined与