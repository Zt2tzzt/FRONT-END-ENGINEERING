# 什么是模块化

什么是模块化？什么是模块化开发？

- 一个结构中编写属于自己的逻辑代码，有自己的作用域，定义变量名词时不会影响到其他的结构；
- 一个结构可以将自己希望暴露的变量、函数、对象等等导出给其结构使用；
- 模块化开发最终的目的是将程序划分成一个个小的结构；这个结构就是模块。
- 也可以通过某种方式，导入另外结构中的变量、函数、对象等；

-----

# JS 模块化发展历史

早期 JavaScript 存在哪些问题？

- var 定义的变量作用域问题；
- JavaScript 的面向对象并不能像常规面向对象语言一样使用 class；
- JavaScript 没有模块化；

-----

了解 JavaScript 中模块化发展的历史。

1. 早期 JavaScript 代码仅仅作为一种脚本语言，放在 \<script\> 标签中编写。
2. 随着前端和 JavaScript 发展，JavaScript 代码变得越来越复杂。
3. Node 的出现，也需要使用 JavaScript 编写复杂的后端程序，没有模块化是致命的硬伤；
4. 但是 JavaScript 本身，直到 ES6（2015）才推出了自己的模块化方案；
5. 在此之前，为了让 JavaScript 支持模块化，涌现出了很多不同的模块化规范：AMD、CMD、CommonJS 等；

-----

早期没有模块化的时候，有什么问题，

- 不同开发者开发的 JS 文件通过 \<script\> 标签引入到 HTML 文件后，会出现命名冲突的问题。

早期常见的解决方案是什么，

- 通过立即执行函数表达式（IIFE (Immediately Invoked Function Expression) 将模块中的代码包裹起来，利用函数产生的作用域，避免名命冲突的问题产生。

```javascript
var moduleA = (function () {
	var name = 'zzt'
	return {
		name: name
	}
})()
```

这样做又有什么新问题？

1. 必须记得每一个模块中返回对象的命名，如 moduleA，才能在其他模块使用过程中正确的使用；
2. 代码写起来混乱不堪，每个文件中的代码都需要包裹在一个匿名函数中来编写；
3. 在没有合适的规范情况下，每个人、每个公司都可能会任意命名、甚至出现模块名称相同的情况；

-----

# CommonJS 的介绍

CommonJS 的由来，

1. 针对以上问题，需要制定一定的规范来约束开发者去编写模块化的代码；
2. 这个规范中应该包括核心功能：模块本身可以导出暴露的属性，模块又可以导入自己需要的属性；
3. JavaScript 社区为了解决上面的问题，涌现出一系列好用的规范，其中就包括 CommonJS。
4. CommonJS 是一个规范，最初提出来是在浏览器以外的地方使用，并且当时被命名为 ServerJS，后来为了体现它 的广泛性，修改为 CommonJS，平时我们也会简称为 CJS。

常用的3个场景。

- Node 是 CommonJS 在服务器端一个具有代表性的实现；
- Browserify 是 CommonJS 在浏览器中的一种实现；
- webpack 打包工具具备对 CommonJS 的支持和转换；

-----

Node 中 CommonJS 的规范是怎样的，如何实现？

- 在 Node 中每一个 js 文件都是一个单独的模块；
- 这个模块中包括 CommonJS 规范的核心变量：`exports`（CommonJS 规范要求）、`module.exports`、`require`；
- 我们可以使用这些变量来方便的进行模块化开发；

-----

# CommonJS 的使用

CommonJS 模块化案例，导入导出实现。使用解构对其优化。

utils.js

```javascript
const UTIL_NAME = "util_name"
function formatCount() {
  return "200万"
}
function formatDate() {
  return "2022-10-10"
}
console.log(exports) // {}
exports.UTIL_NAME = UTIL_NAME
exports.formatCount = formatCount
exports.formatDate = formatDate
```

main.js

```javascript
// 1.直接获取导出的对象, 从对象中获取属性
const util = require("./util.js")
console.log(util.UTIL_NAME)
console.log(util.formatCount())
console.log(util.formatDate())
// 2.导入对象之后, 直接对其进行解构
const {
  UTIL_NAME,
  formatCount,
  formatDate
} = require("./util.js")
console.log(UTIL_NAME)
console.log(formatCount())
console.log(formatDate())
```

-----

模块化的核心是导入和导出，Node 中对其进行实现的理解。

- exports 和 module.exports 可以负责对模块中的内容进行导出；
- require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；

-----

# Node 实现 CommonJS 的本质

Node 中实现 CommonJS 导入导出的本质是什么？上面案例理解。

- 意味着 main.js 中的 `util` 变量等于 utils.js 中的 `exports` 对象；
- 也就是 require 通过各种查找方式，最终找到了 exports 这个对象；
- 并且将这个 exports 对象赋值给了 util 变量；
- util 变量就是 exports 对象了；

-----

Node 中本质上是导出 module.exports，而 CommonJS 的规范中要求通过 exports 导出。
代码体现 module.exports 和 exports 内存关系。

```javascript
exports === module.exports // true，exports 和 module.exports 在内存中默认指向同一个对象。
module.exports = {} // 新建了一个对象赋值给 module.exports，Node 中本质上会导出这个对象。
exports === module.exports // false
exports.aaa = 'aaa'; // 此时 exports 中的属性不会被导出。没有意义
```

- CommonJS 中是没有 module.exports 的概念的；
- 但是为了实现模块的导出，Node 中使用的是 Module 的类，每一个模块都是 Module 的一个实例，也就是 module；（Node 中实现了一个类 `function Module`. 每个 js 文件，都是这个类的实例）。
- 所以在 Node 中真正用于导出的其实根本不是 exports，而是 module.exports；
- 因为 module 才是导出的真正实现者；

-----

在 Node 中导出的变量被修改，会影响原模块中的该变量，但在开发中切记不要这么做。

-----

在 Node 中导入使用的 require 函数的规则。分3种情况, `require(X)` 举例

1. X 是 Node 核心模块如 path、http，直接返回核心模块并停止查找。
2. X 是以 ./ 或 /（根目录） 形式开头的：
	- 当作一个文件：
		- 有后缀名，查找对应的文件
		- 没有后缀名，查找文件 X，查找文件 X.js, 查找文件 X.json，查找文件 X.node
	- 没有找到对应的文件，将 X 当作目录：
		- 查找 x/index.js，查找 x/index.json，查找 x/index.node.
	- 仍未找到，报错 not found
3. X 没有路径，并且不是一个核心模块
	- 会找执行命令的目录（没找到则在上一层查找，直到根目录）下 node_module 文件夹下的同名目录,查找原则同情况二

-----

在 Node 中模块加载过程中的3点结论。

1. 模块在被第一次引入时，模块中的 js 代码会被运行一次
2. 模块被多次引入时，会缓存，最终只加载（运行）一次
	- 这是因为每个模块对象 module 都有一个属性：`loaded`。该属性为 false 表示还没有加载，为 true 表示已经加载；
3. 如果有循环引入，那么加载顺序是什么？ 比如，如果出现下图模块的引用关系，那么加载顺序是什么呢？
	- 这个其实是一种数据结构：图结构；
	- 图结构在遍历的过程中，有深度优先搜索（DFS, depth first search）和广度优先搜索（BFS, breadth first search）；
	- Node 采用的是**深度优先算法**：main -> aaa -> ccc -> ddd -> eee ->bbb

<img src="NodeAssets/Node 中图结构的模块引入模型.jpg" alt="Node 中图结构的模块引入模型" style="zoom:50%;" />

-----

# CommonJS 的缺点

CommonJS 规范的缺点是什么？有什么影响？

- CommonJS 加载模块是同步的：
  1. 意味着只有等到对应的模块加载完毕，当前模块中的内容才能被运行；
  2. 这个在服务器不会有什么问题，因为服务器加载的 js 文件都是本地文件，加载速度非常快；执行 JS 的耗时操作也都会交给其它线程处理，只需要执行相应的回调即可。
- 如果将它应用于浏览器呢？
	1. 浏览器加载 js 文件需要先从服务器将文件下载下来，之后再加载运行；
	2. 那么同步的加载策略就意味着后续的 js 代码都无法正常运行，即使是一些简单的 DOM 操作；
	3. 所以在浏览器中，我们通常不使用 CommonJS 规范：
- 当然在 webpack 中使用 CommonJS 是另外一回事；
  1. 在 webpack 中会对代码进行打包，如果没有分包，会将代码打包到一个 JS 文件中。浏览器只需要请求这一个 js 文件。
  2. webpack 会将我们的代码转成浏览器可以直接执行的代码；
  3. 不需要使用 `<script src="xxx" type="module"></script>` 来声明是引入 ES Module 文件。
- 在早期为了可以在浏览器中使用模块化，通常会采用 AMD 或 CMD：
	- 但是目前一方面现代的浏览器已经支持 ES Modules，另一方面借助于 webpack 等工具可以实现对 CommonJS 或者 ES Module 代码的转换；
	- AMD（Asynchronous Module Definition 异步模块定义） 和 CMD （Common Module Definition 通用模块定义）已经使用非常少了；
