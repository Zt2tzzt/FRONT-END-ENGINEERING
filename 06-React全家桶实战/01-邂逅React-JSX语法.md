# 认识 React？

- 相信每个做开发的人对 React 都或多或少有一些印象；
- 这里我们来看一下官方对它的解释：用于**构建用户界面的 JavaScript 库**；

React 在前端处于什么地位？react 官网。

- 目前对于前端开发来说，几乎很少直接使用原生的 JavaScript 来开发应用程序，而是选择一个 JavaScript 库（框架）。
	- 在过去的很长时间内，jQuery 是被使用最多的 JavaScript 库；
	- 在过去的一份调查中显示，全球前10,000个访问最高的网站中，有65%使用了jQuery，是当时最受欢迎的 JavaScript 库；
	- 但是，目前已经处于淘汰的边缘了；

- 而无论是国内外，最流行的其实是三大框架：Vue、React、Angular。

  <img src="NodeAssets/React在前端的地位.jpg" alt="React在前端的地位" style="zoom:80%;" />

React 与其它框架的关系。

- React 由 Facebook 来更新和维护，它是大量优秀程序员的思想结晶：
	- React 的流行不仅仅局限于普通开发工程师对它的认可；
	- 其它流行的框架或多或少也借鉴 React 的思想；
- Vue.js 框架设计之初，有很多的灵感来自 Angular 和 React。
	- 包括 Vue3 很多新的特性，也是借鉴和学习了 React；
	- 比如 React Hooks 是开创性的新功能（也是我们学习的重点）；
	- Vue Composition API 学习了 React Hooks 的思想；
- Flutter 的很多灵感都来自 React，这是来自官网的一段话：
	- 事实上 Flutter 中的 Widget – Element – RenderObject；
	- 对应 React 的就是 JSX – 虚拟DOM – 真实DOM；
- 所以 React 可以说是前端的先驱者，它总是会引领整个前端的潮流。

 Vue 和 React 如何选择？

- 首先，React 和 Vue 是前端开发人员必须掌握的两个框架。
- 下面的观点是一个目前比较普遍的共识，没有贬低任何框架的意思。
- 大中型公司选择 React 会较多，灵活和稳定；
- 中小型公司选择 Vue 会较多，易上手和代码统一；

<img src="NodeAssets/Vue和React在中大型公司中的应用.jpg" alt="Vue和React在中大型公司中的应用" style="zoom:80%;" />


# 如何学习一个新技术栈（如 React）。

<img src="NodeAssets/如何学习一个新技术栈.jpg" alt="如何学习一个新技术栈" style="zoom:80%;" />



学习 React 要具备那些基础？（什么人适合学习）

- 需要掌握前端的核心开发语言：HTML、CSS、JavaScript。
- React 本身对 JavaScript 的要求相对会更高一些，所以也需要掌握一些高级的 JavaScript 语法，比如 ES6 以上的语法、this 绑定规则等等；


# React 有哪些技术特点？

## 声明式编程：

- 声明式编程是目前整个大前端开发的模式：Vue、React、Flutter、SwiftUI；
- 它允许我们只需要维护自己的状态，当状态改变时，React 可以根据最新的状态去渲染我们的UI界面；

<img src="NodeAssets/声明时编程的模式.jpg" alt="声明时编程的模式" style="zoom:80%;" />

## 组件化开发：

- 组件化开发页面目前前端的流行趋势，我们会将复杂的界面拆分成一个个小的组件；
- 如何合理的进行组件的划分和设计也是后面我会讲到的一个重点；

<img src="NodeAssets/组件化开发模式.jpg" alt="组件化开发模式" style="zoom:80%;" />

- 多平台适配：
	- 2013年，React 发布之初主要是开发 Web 页面；
	- 2015年，Facebook 推出了 ReactNative，用于开发移动端跨平台；（虽然目前 Flutter 非常火爆，但是还是有很多公司在使用 ReactNative）；
	- 2017年，Facebook 推出 ReactVR，用于开发虚拟现实Web应用程序；（VR 也会是一个火爆的应用场景）；

	<img src="NodeAssets/React多平台视频.jpg" alt="React多平台视频" style="zoom:100%;" />


# hello World

React 的基本使用

- React 16 和 18 在渲染根对象 root 时有哪些区别？
- 在界面上通过 React 显示一个 Hello World
	- 注意：这里我们编写 React 代码的 script 标签上，必须添加 `type="text/babel"`，作用是可以让 babel 解析 jsx 的语法
- `ReactDOM.createRoot` 函数：用于创建一个 React 根，之后渲染的内容会包含在这个根中
	- 参数：将渲染的内容，挂载到哪一个HTML元素上，这里我们已经提前定义了一个 id 为 root 的div
- `root.render` 函数:
	- 参数：要渲染的根组件
- 我们可以通过 `{}` 语法来引入外部的变量或者表达式

```jsx
<body>
	<div id="root"></div>

	<!-- 添加依赖，三个包，使用 CDN 引入，crossorigin 的属性，这个属性的目的是为了拿到跨域脚本的错误信息-->
	<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <!-- babel -->
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

	<script type="text/babel">
		// React 18 之前 ReactDOM.render
		// ReactDOM.render(<h2>Hello world</h2>, document.querySelector('#root'))

		// REact18 之后
		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<h2>Hello World</h2>)

	</script>
</body>
```

# React 的开发依赖有哪些？

- 开发 React 必须依赖三个库：
	- react：包含 react 所必须的核心代码
	- react-dom：react 渲染在不同平台所需要的核心代码
	- babel：将 jsx 转换成 React 代码的工具
- 对于 Vue 来说，我们只是依赖一个 vue.js 文件即可，但是 react 居然要依赖三个包。
	- 其实呢，这三个库是各司其职的，目的就是让每一个库只单纯做自己的事情;
	- 在 React 的0.14版本之前是没有 react-dom 这个概念的，所有功能都包含在 react 里；
- 为什么要进行拆分呢？原因就是 react-native。
	- react 包中包含了 react web 和 react-native 所共同拥有的核心代码。
	- react-dom 针对 web 和 native 所完成的事情不同：
		- web 端：react-dom 会将 jsx 最终渲染成真实的 DOM，显示在浏览器中
		- native 端：react-dom 会将 jsx 最终渲染成原生的控件（比如 Android 中的 Button，iOS 中的 UIButton）。


## 什么是 babel

- Babel 是一个工具链，最早用于在旧浏览器或环境中将 ES6+ 代码转成向后兼容的版本。
- 现在主要用于语法转换，源代码转换等。
- Babel 本质上是一个编译器。

babel 与 react 的关系是怎样的？

- 默认情况下开发 React 其实可以不使用 babel。
- 但是前提是我们自己使用 React.createElement 来编写源代码，它编写的代码非常的繁琐，可读性差。
- 那么我们就可以直接编写 jsx（JavaScript XML）的语法，并且让 babel 帮助我们转换成 React.createElement。

## 依赖的引入方式

- 方式一：直接 CDN 引入。
- 方式二：下载后，添加本地依赖。
- 方式三：通过 npm 管理（后续脚手架再使用）。

# Hello react

实现 Hello react 的案例，创建根的做法，

- 将文本定义成变量，并在 jsx 中引用。jsx 中对标识符的引用，都是用 {}
- jsx 中实现事件的监听，监听按钮的点击。
- React 在默认情况下，不会进行重新渲染。

```jsx
<body>

	<div id="root"></div>

	<!-- 引入下载到本地的依赖 -->
	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">
		const root = ReactDOM.createRoot(document.querySelector('#root'))

		// 1.将文本定义成变量
		let msg = 'Hello world'

		// 2.监听按钮的点击
		function onbtnClick() {
			msg = 'Hello React'
			render()
		}

		// 3.封装一个渲染函数
		render()
		function render() {
			// 第一个括号表示 render 方法执行，第二个括号表示 jsx 代码块整体
			root.render((
				<div>
					<h2>{ msg }</h2>
					<button onClick={ onbtnClick }>修改文本</button>
				</div>
			))
		}
	</script>
</body>
```

# React 的组件化开发

- 以上案例中，整个逻辑其实可以看做一个整体，那么我们就可以将其封装成一个组件：

	- 我们知道 root.render 参数是一个 HTML 元素或者一个组件；
	- 所以我们可以先将之前的业务逻辑封装到一个组件中，然后传入到 `root.render` 函数中的第一个参数；

- 在 React 中，封装一个组件有两种方式，**类组件**和**函数式组件**。这里我们先使用类组件。

	1. 定义一个类（类名首字母必须大写，因为组件的名称是必须大写的，小写会被认为是 HTML 元素），继承自 React.Component 
	2. 实现当前组件的 render 函数，render 当中返回的 jsx 内容，就是之后 React 会帮助我们渲染的内容

```jsx
<body>
	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">
		// 使用组件进行代码重构
		class App extends React.Component {
			constructor() {
				super()
				// 组件的状态
				this.state = {
					msg: 'Hello World',
					name: 'zzt',
					age: 18
				}

				// 为在 jsx 标签属性中使用的方法提前绑定好 this
				this.onBtnClick = this.onBtnClick.bind(this)
			}

			onBtnClick() {
				this.setState({
					msg: 'Hello React'
				})
			}

			// 渲染内容 render 方法
			render() {
				return (
					<div>
						<h2>{ this.state.msg }</h2>
						<button onClick={ this.onBtnClick }>修改文本</button>
					</div>
				)
			}
		}

		// 将组件渲染到界面上
		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App/>)
	</script>
</body>
```


## 组件化的数据依赖处理。

- 组件化问题一：数据在哪里定义？ 
- 在组件中的数据，我们可以分成两类： 
	- 参与界面更新的数据：当数据变化时，需要更新组件渲染的内容； 
	- 不参与界面更新的数据：当数据变化时，不需要更新组建渲染的内容；
- 参与界面更新的数据我们也可以称之为是**参与数据流**，这个数据是定义在当前对象的 `state` 中 
	- 我们可以在构造函数中进行初始化 this.state = {定义的数据} 
	- 当我们的数据发生变化时，我们可以调用 `this.setState` 来更新数据，并且通知 React 进行 update 操作；在进行 update 操作时，就会重新调用 render 函数，并且使用最新的数据，来渲染界面
	
## 组件化的事件绑定处理。

- 组件化问题二：事件绑定中的 this 
	- 在类中直接定义一个函数，并且将这个函数绑定到元素的 onClick 事件上，当前这个函数的 this 指向的是谁呢？
- 默认情况下是 undefined 
	- 很奇怪，居然是 undefined？
	- 因为在正常的 DOM 操作中，监听点击，监听函数中的 this 其实是节点对象（比如说是 button 对象）； 
	- 这次因为 React 并不是直接渲染成真实的 DOM，我们所编写的 button 只是一个语法糖，它的本质 React 的 Element 对象； 
	- 那么在这里发生监听的时候，react 在执行函数时并没有绑定 this，默认情况下就是一个 undefined；为什么呢？
	- ES6 中使用 class，里面的实例方法默认开启严格模式；我们引用的 babel 库，其中也会开启严格模式。而在严格模式下，默认绑定会绑定 undefined。
	- jsx 代码会被 babel 编译为一段 js 代码，所以在 jsx 中引用类的实例方法，方法中的 this 默认绑定的是 undefined。
	- `setState` 方法是继承过来的。`this.setState` 做了两件事：
		1. 将 state 中 message 值修改掉；
		2. 自动重新执行 render 函数。
- 我们在绑定的函数中，可能想要使用当前对象，比如执行 `this.setState` 函数，就必须拿到当前对象的 this 
	- 我们就需要在传入函数时，给这个函数直接绑定 this
	- 类似于下面的写法：`<button onClick={ this.changeText.bind(this) }>改变文本</button>`

# 电影列表案例实现

```jsx
<body>
	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">
		// 封装 App 组件
		class App extends React.Component {
			constructor() {
				super()
				this.state = {
					movies: ['星际穿越', '大话西游', '盗梦空间', '黑客帝国']
				}
			}

			render() {
				return (
					<div>
						<h2>电影列表</h2>
						<ul>
							{ this.state.movies.map(item => <li>{ item }</li>) }
						</ul>
					</div>
				)
			}
		}
		
		// 创建 root
		const root = ReactDOM.createRoot(document.querySelector('#root'))
		// 渲染组件
		root.render(<App/>)
	</script>
</body>
```

# 计数器案例的实现

```jsx
<body>
	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">

		// 封装 App 组件
		class App extends React.Component {
			constructor() {
				super()
				this.state = {
					counter: 100
				}
				this.increment = this.increment.bind(this)
				this.decrement = this.decrement.bind(this)
			}

			increment() {
				this.setState({
					couter: ++this.state.counter
				})
			}
			decrement() {
				this.setState({
					couter: --this.state.counter
				})
			}

			render() {
				const counter = this.state.counter

				return (
					<div>
						<h2>当前计数：{ counter }</h2>
						<button onClick={ this.increment }>+1</button>
						<button onClick={ this.decrement }>-1</button>
					</div>
				)
			}
		}

		// 创建 root 对象
    const root = ReactDOM.createRoot(document.querySelector('#root'))
		// 渲染组件
		root.render(<App/>)
	</script>
</body>
```

为了方便编写 Demo，生成 VSCode 的 react 渐进式代码片段。

# 认识 JSX

什么是 jsx？

- JSX 是一种 JavaScript 的语法扩展（eXtension），也在很多地方称之为 JavaScript XML，因为看起就是一段 XML 语法； 
- 它用于描述我们的 UI 界面，并且其完全可以和 JavaScript 融合在一起使用；
- 它不同于 Vue 中的模块语法，你不需要专门学习模块语法中的一些指令（比如 v-for、v-if、v-else、v-bind）；


为什么 React 选择了 jsx？（面试）

- React 认为渲染逻辑本质上与其他 UI 逻辑存在内在耦合 
	- 比如 UI 需要绑定事件（button、a 原生等等）； 
	- 比如 UI 中需要展示数据状态； 
	- 比如在某些状态发生改变时，又需要改变 UI；
- 他们之间是密不可分，所以 React 没有将标记分离到不同的文件中，而是将它们组合到了一起，这个地方就是组件（Component）； 

# jsx 的书写规范

- JSX 的顶层只能有一个根元素，所以我们很多时候会在外层包裹一个 div 元素（或者使用后面我们学习的 Fragment）； 
- 为了方便阅读，我们通常在 jsx 的外层包裹一个小括号 ()，这样可以方便阅读，并且 jsx 可以进行换行书写； 
- JSX 中的标签可以是单标签，也可以是双标签；注意：如果是单标签，必须以 `/>` 结尾（html 中可省略，jsx 中不行）；


# jsx 的使用

## 注释的写法。

```jsx
const divEl = (
	<div>
		{ /* 我是注释 */ }
		哈哈哈
	</div>
)
```

## 嵌入变量作为子元素

- 情况一：当变量是 Number、String、Array 类型时，可以直接显示 。
- 情况二：当变量是 null、undefined、Boolean 类型时，内容为空；
	- 如果希望可以显示 null、undefined、Boolean，那么需要转成字符串； 
	- 转换的方式有很多，比如 `toString` 方法、和空字符串拼接，`String(变量)` 等方式；
- 情况三：Object 对象类型不能作为子元素（not valid as a React child）在 JSX 语法中引用。

## 键入表达式。

- 运算表达式，如三元运算表达式。
- 执行一个函数。

> react 中没有计算属性，完全在 jsx 中处理。

```jsx
<body>

	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">
		class App extends React.Component {
			constructor() {
				super()
				this.state = {
					counter: 100,
					msg: 'Hello React',
					movies: ['星际穿越', '大话西游', '盗梦空间', '黑客帝国'],

					aaa: undefined,
					bbb: null,
					ccc: true,

					friend: { name: 'kobe', age: 30, address: 'LA' },

					firstname: 'jesse',
					lastname: 'lingard',
					age: 29,

				}
			}

			render() {
				// 插入标识符
				const { msg, counter } = this.state
				const { aaa, bbb, ccc } = this.state
				const { friend } = this.state

				// 对内容进行运算后显示
				const { firstname, lastname, age, movies } = this.state
				const fullName = firstname + lastname
				const liEls = movies.map(item => <li> { item } </li>)
				
				return (
					<div>
						{ /* 可直接显示出来 */ }
						<h2>{ counter }</h2>
						<h2>{ msg }</h2>
						<h2>{ movies }</h2>

						{ /* undefined / null / Boolean 显示成文本 */ }
						<h2>{ String(aaa) } 或 { aaa + '' }</h2>
						<h2>{ String(bbb) } 或 { bbb + '' }</h2>
						<h2>{ ccc.toString() }</h2>

						{ /* Object 类型不能作为 jsx 标签的子元素被引用 */ }
						<h2>{ friend.name }</h2>
						<h2>{ Object.keys(friend) }</h2>

						{ /* 插入计算结果 */ }
						<h2>{ fullName }</h2>
						<ul>{ liEls }</ul>
						{ /* 插入表达式 */ }
						<h2>{ age >= 18 ? '成年人' : '未成年人'  }</h2>

						{ /* 调用方法 */ }
						<ul>{ this.getMovieEls() }</ul>
					</div>
				)
			}

			getMovieEls() {
				console.log('this:', this)
				return this.state.movies.map(item => <li>{ item }</li>)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App/>)
	</script>
</body>
```

## 属性绑定

- 动态绑定 class 通常有3种方式
-	动态绑定 style （内联样式）有很多方式？先了解1种基本方式。

```jsx
<body>
	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>

	<script type="text/babel">
		class App extends React.Component {
			constructor() {
				super()
				this.state = {
					title: '哈哈哈',
					imgUrl: 'https://images5.alphacoders.com/109/1096785.jpg',
					isActive: true,
					styleObj: {
						color: 'red',
						fontsize: '30px'
					}
				}
			}

			render() {
				const { title, imgUrl, isActive, styleObj } = this.state

				// 绑定 class 写法一
				const classList1 = `abc cba ${ isActive ? 'active' : '' }`
				// 绑定 class 写法二
				const classList2 = ['abc', 'cba']
				if (isActive) classList2.push('active')
				// 绑定 class 写法三，第三方库 classnames，一般通过 npm install classnames 引入

				return (
					<div>
						{ /* 基本属性绑定 */ }
						<h2 title={ title }>title 属性绑定</h2>	
						<img src={ imgUrl } />

						{ /* 绑定 class 属性，最好使用 className */ }
						<h2 className={ classList1 }>绑定 class 属性</h2>
						<h2 className={ classList2.join(' ') }>绑定 class 属性</h2>

						{ /* 绑定 style 属性，即绑定对象类型 */ }
						<h2 style={ styleObj }>绑定 style 属性</h2>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App/>)
	</script>
</body>
```


