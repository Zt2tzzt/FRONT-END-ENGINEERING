# Node.js 是什么

官方说明：

- 一个基于 V8 引擎的 JavaScript 运行时环境。

自己总结：

- 我们知道 V8 可以嵌入到任何 C++ 应用程序中，无论是 Chrome 还是 Node.js，都是嵌入了 V8 引擎来执行 JavaScript 代码；
- 在 Chrome 浏览器中，
  - 还有解析、渲染 HTML、CSS 等相关渲染引擎，
  - 还有提供支持浏览器操作的API、浏览器自己的事件循环等；
- 在 Node.js 中
  - 有文件系统读/写、网络IO、加密、压缩解压文件等操作；- Node 和 Node.js 代表的是一个意思。

-----

# Node 架构

理解浏览器和 Node.js 架构区别图。

<img src="NodeAssets/浏览器与 Node 的架构区别.jpg" style="zoom:100%;" />

-----

理解 Node.js 架构图，什么是 libuv？

- libuv（Unicorn Velociraptor—独角伶盗龙）是使用C语言编写的库；
- libuv 提供了事件循环、文件系统读写、网络IO、线程池等等内容；

<img src="NodeAssets/Node 架构图.jpg" alt="Node 架构图" style="zoom:150%;" />

说明底层是如何执行 application 中的事件的。

- 我们编写的 JavaScript 代码会经过 V8 引擎，再通过 Node.js 的 Bindings，将任务放到 Libuv 的事件循环中；
- 事件循环将阻塞操作交由线程池中的线程处理，
- 处理完成后，会将回调函数放入事件队列中，最后返回给 JS 线程执行。

-----

# Node 应用场景

Node.js 的六大应用场景。

1. 目前前端开发的库都是以 node 包的形式进行管理；（常用）
2. npm、yarn、pnpm 工具成为前端开发使用最多的工具；（常用）
3. 越来越多的公司使用 Node.js 作为 web 服务器开发、中间件、代理服务器；
4. 大量项目需要借助 Node.js 完成前后端渲染的同构应用；
5. 资深前端工程师需要为项目编写脚本工具（前端工程师编写脚本通常会使用 JavaScript，而不是 Python 或者 shell）；
6. 很多企业在使用 Electron 来开发桌面应用程序；

-----

# Node 安装

安装 Node.js 的2种方式。

1. 借助于一些操作系统上的软件管理工具，如 Mac 上的 homebrew；Linux 上的 yum、dnf 等。
2. 直接下载对应的安装包进行安装；（Windows 下 .msi 后缀代表 Microsoft install）

安装 Node.js 2点注意事项：

1. 安装过程中会配置环境变量（安装完后，可以在命令行直接使用）；
2. 会附带安装 npm（Node Package Manager）工具；

-----

安装 Node.js 有哪2个版本，分别适用于什么场景。

- LTS 版本：（Long-term support, 长期支持）相对稳定一些，生产环境使用该版本；
- Current 版本：最新的 Node 版本，包含很多新特性；学习用。

-----

# Node 版本管理工具介绍

Node 的版本管理工具有哪些（都不支持 Windows）？

- nvm：Node Version Manager；
- n：Interactively Manage Your Node.js Versions（交互式管理你的 Node.js 版本）
- nvm 提供了专门针对 Windows 的版本

它们有哪些常用命令？

```shell
nvm install latest # 安装最新的 node 版本
nvm list # 展示目前安装的所有版本
nvm use # 切换版本
```

```shell
n lts # 安装最新的 lts 版本
n latest # 安装最新的版本
n # 查看所有版本，↑ 或 ↓ 选择要用的版本
```

-----

# Node 使用

将 JS 代码交给 Node 执行的步骤。

```sheell
node xxx.js
```

给 VSCode 配置 gitbash 终端。

setting.json

```json
{
	"terminal.integrated.profiles.windows": {
		"gitbash": {
			"path": "D:/Devtools/Git-2.25.1-64-bit/Git/bin/bash.exe",
			"args": []
		}
	},
	"terminal.integrated.defaultProfile.windows": "gitbash"
}
```

-----

Node 输入：运行 Node 程序传递参数的写法，

```shell
node index.js env=development zzt
```

```JavaScript
console.log('---process.argv---', process.argv)
/* [
  'D:\\Devtools\\nodejs\\node.exe',
  'D:\\Workshop\\Mobile_HDD\\coderwhy-fromt-end-system\\FRONT-END-ENGINEERING\\01-前端工程化基础\\demo.js',
  'env=devlopment',
  'zzt'
] */
```

process.argv 名称的由来。

- Node 是由 C语言编写的。
- 在C/C++程序中的 main 函数中，实际上可以获取到两个参数：
	1. argc：argument counter 的缩写，传递参数的个数；
	2. argv：argument vector（向量、矢量）的缩写，传入的具体参数。
		- vector 翻译过来是矢量的意思，在程序中表示的是一种数据结构。
		- 在 C++、Java 中都有这种数据结构，是一种数组结构；
		- 在 JavaScript 中也是一个数组，里面存储一些参数信息；

-----

Node 输出：Node 输出有哪些常用的 api。

- console.log - 最常用的输入内容的方式：
- console.clear - 清空控制台：
- console.trace - 打印函数的调用栈：

-----

什么是 Node 中的 REPL，

- REPL 是 Read-Eval-Print Loop 的简称，翻译为“读取-求值-输出”循环；
- REPL 是一个简单的、交互式的编程环境；
- 浏览器的 console 就可以看成一个REPL

在 Node 中如何使用？

1. 进入

```shell
node
```

2. 使用

```shell
00015167@cqc1000015167l3 MINGW64 /d/Workshop/Mobile_HDD/coderwhy-fromt-end-system/FRONT-END-ENGINEERING/01-前端工程化基础 (master)
$ node
Welcome to Node.js v16.13.1.
Type ".help" for more information.
> let a = 10
undefined
> let b = 20
undefined
> a + b
30
>
```

3. 退出
	- 按2次，ctrl+c
	- 输入 `.exit`

-----

Node 全局对象

有哪些特殊的全局对象？

- `__dirname`、`__filename`、`exports`、`module`、`require()`
	- `__dirname`：获取当前文件所在的路径：不包括后面的文件名。
	- `__filename`：获取当前文件所在的路径和文件名称。
- 这些全局对象，实际上是**模块中的变量**，只是每个模块都有，看来像是全局变量；
- 在命令行交互中是不可以使用的；


有哪些常见的全局对象？

- process 对象：process 提供了 Node 进程中相关的信息： 
	- 比如 Node 的运行环境、参数信息等； 
	- 后面会讲解，如何将一些环境变量读取到 process 的 env 中；
- console 对象：提供了简单的调试控制台，在前面讲解输入内容时已经学习过了。 
- 定时器函数：在 Node 中使用定时器有好几种方式： 
	- setTimeout(callback, delay[, ...args])：callback 在 delay 毫秒后执行一次； 
	- setInterval(callback, delay[, ...args])：callback 每 delay 毫秒重复执行一次； 
	- setImmediate(callback[, ...args])：callbackI / O 事件后的回调的“立即”执行；
		- 先不展开讨论它和 setTimeout(callback, 0) 之间的区别；因为涉及到事件循环的阶段问题，后续详细讲解事件循环相关的知识；
	- process.nextTick(callback[, ...args])：添加到下一次 tick 队列中； 也放到事件循环中说明；

```JavaScript
setImmediate(() => {
  console.log("setImmediate")
})
process.nextTick(() => {
  console.log("nextTick")
})
```

-----

什么是 Node.js 中的 global 对象，

- global 是一个 Node 的全局对象，前面提到的 process、console、setTimeout 等都有被放到 global 中： 
- ES11 中新增 globalThis，也是指向全局对象的；
- 类似于浏览器中的 window；

它与 window 的区别。

- 浏览器中执行 JavaScript 代码，在顶级范围内通过 var 定义的一个属性，默认会被添加到 window 对象上： 
- 在 node 中，我们通过 var 定义一个变量，它只是在当前模块中有一个变量，不会放到全局中：