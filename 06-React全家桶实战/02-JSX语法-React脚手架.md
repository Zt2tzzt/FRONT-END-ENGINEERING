# JSX 的事件绑定，

相比原生是怎样的？

- 如果原生 DOM 有一个监听事件，我们可以如何操作呢？
	- 方式一：获取原生 DOM 对象，添加监听事件；

	  ```js
	  const boxEl = document.querySelector('.box')
	  boxEl.addEventListener('click', function() {/*...*/})
	  ```

	- 方式二：在原生 DOM 对象上，直接绑定 `onclick`；

	  ```js
	  const boxEl = document.querySelector('.box')
	  boxEl.onclick = function() {/*...*/}
	  ```

- 在 React 中是如何操作呢？或者说在 JSX 中如何操作呢？这里主要有两点不同：
	- React 事件的命名采用小驼峰式（camelCase），而不是纯小写；
	- 我们需要通过 {} 传入一个事件处理函数，这个函数会在事件发生时被执行；

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
						meg: 'Hello World',
						counter: 30
					}

					this.onBtn1Click = this.onBtn1Click.bind(this)
				}

				onBtn1Click() {
					this.setState({
						counter: ++this.state.counter
					})
				}

				render() {
					const { counter } = this.state
					return (
						<div>
							<h2>{ counter }</h2>
							<button onClick={ this.onBtn1Click }>按钮1</button>
						</div>
					)
				}
			}

			const root = ReactDOM.createRoot(document.querySelector('#root'))
			root.render(<App/>)
		</script>
	</body>
	```

# JSX 中事件绑定处理函数中 this 的绑定问题

- 在事件执行后，我们可能需要获取当前类的实例对象中相关的属性，这个时候需要用到 this
	- 如果我们这里直接打印 this，也会发现它是一个undefined
- 为什么是 undefined 呢？
	- 原因是 btnClick 函数并不是我们主动调用的，而且当 button 发生改变时，React 内部调用了 btnClick 函数；
	- 而它内部调用时，并不知道要如何绑定正确的 this；
- 如何解决 this 的问题呢？
	- 方案一：bind 给 btnClick 显示绑定 this
	- 方案二：使用 ES6 class fields 语法，class 作用域中的 this 指向的是当前创建出来的实例。
	- 方案三：事件监听时传入箭头函数（个人推荐）,传递参数非常方便。

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
					meg: 'Hello World',
					counter: 30
				}
        
				this.onBtn1Click = this.onBtn1Click.bind(this)
			}

			onBtn1Click() {
				this.setState({
					counter: ++this.state.counter
				})
			}

      // 使用 ES6 class fields 语法
			onBtn2Click = () => {
				// 这里的 this，是 class 作用域中的 this 指向的是当前创建出来的实例。
				this.setState({ counter: 1000 })
			}

			onBtn3Click() {
				this.setState({ counter: 9999 })
			}

			render() {
				const { counter } = this.state
				return (
					<div>
						<h2>{ counter }</h2>

						{/* this 绑定方式一：bind 绑定 */}
						<button onClick={ this.onBtn1Click }>按钮1</button>

						{/* this 绑定方式二：ES6 class fields */}
						<button onClick={ this.onBtn2Click }>按钮2</button>

						{/* this 绑定方式三：直接传入一个箭头函数 */}
						<button onClick={ () => this.onBtn3Click() }>按钮3</button>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App/>)
	</script>
</body>
```

# JSX 事件绑定处理函数中参数的传递。

在执行事件函数时，有可能我们需要获取一些参数信息：比如 event 对象、其他参数

- 情况一：获取 event 对象（获取到的是 react 包装后的 event 对象，而非原生 event 对象）。
	- 很多时候我们需要拿到 event 对象来做一些事情（比如阻止默认行为）
	- 那么默认情况下，event 对象有被直接传入，函数就可以获取到 event 对象；
- 情况二：获取更多参数
	- 有更多参数时，我们最好的方式就是传入一个箭头函数，主动执行事件处理函数，并且传入相关的其他参数；

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
					msg: 'Hello World'
				}
			}

			onBtn1Click(event) {
				console.log('btn1 event:', event)
			}

			onBtn2Click(event) {
				console.log('btn2 event:', event)
			}

			// 通过 bind 绑定 this 后，event 参数只能作为最后一个参数传递
			onBtn3Click(name, age, event) {
				console.log('name:', name)
				console.log('age:', age)
				console.log('event:', event)
			}

			onBtn4Click(event, name, age) {
				console.log('event:', event)
				console.log('name:', name)
				console.log('age:', age)
			}

			render() {
				return (
					<div>
						{/* event 参数的传递 */}
						<button onClick={this.onBtn1Click.bind(this)}>按钮1</button>
						<button onClick={ (evnet) => this.onBtn2Click(event) }>按钮2</button>

						{/* 额外的参数传递 */}
						<button onClick={ this.onBtn3Click.bind(this, 'zzt', 18) }>按钮3（不推荐）</button>
						<button onClick={ (e) => this.onBtn4Click(e, 'zzt', 18) }>按钮4（推荐）</button>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App />)
	</script>
</body>
```

# 实现点击切换列表元素颜色的案例。

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
					movies: ['星际穿越', '大话西游', '盗梦空间', '黑客帝国'],
					currenIndex: 0
				}
			}

			onItemClick(index) {
				this.setState({ currenIndex: index })
			}

			render() {
				const { movies, currenIndex } = this.state

				return (
					<div>
						<ul>
							{
								movies.map((item, index) => (
									<li
										className={ currenIndex === index ? 'active' : '' }
										key={ item }
										onClick={ () => this.onItemClick(index) }
									>
										{ item }
									</li>
								))
							}
						</ul>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App />)
	</script>
</body>
```

理解几种重构方式，体现了了 React 的灵活性。

重构一：

```jsx
class App extends React.Component {
	constructor() {
		super()
		this.state = {
			movies: ['星际穿越', '大话西游', '盗梦空间', '黑客帝国'],
			currenIndex: 0
		}
	}

	onItemClick(index) {
		this.setState({ currenIndex: index })
	}

	render() {
		const { movies, currenIndex } = this.state

		const liEls = movies.map((item, index) => (
			<li
				className={ currenIndex === index ? 'active' : '' }
				key={ item }
				onClick={ () => this.onItemClick(index) }
			>
				{ item }
			</li>
		))

		return (
			<div>
				<ul>
					{ liEls }
				</ul>
			</div>
		)
	}
}

const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<App />)
```

重构二：

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
					movies: ['星际穿越', '大话西游', '盗梦空间', '黑客帝国'],
					currenIndex: 0
				}
			}

			onItemClick(index) {
				this.setState({ currenIndex: index })
			}

			render() {
				const { movies, currenIndex } = this.state

				const itemHandle = (item, index) => (
					<li
						className={ currenIndex === index ? 'active' : '' }
						key={ item }
						onClick={ () => this.onItemClick(index) }
					>
						{ item }
					</li>
				)

				return (
					<div>
						<ul>
							{/* 如果 itemHandle 为普通函数而非箭头函数，map 高阶函数第二个参数可以为 itemHandle 绑定 this */}
							{ movies.map(itemHandle) }
						</ul>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App />)
	</script>
</body>
```

# JSX 中的条件渲染

- 某些情况下，界面的内容会根据不同的情况显示不同的内容，或者决定是否渲染某部分内容：
	- 在 vue 中，我们会通过指令来控制：比如 v-if、v-show；
	- 在 React 中，所有的条件判断都和普通的 JavaScript 代码一致；
- 常见的条件渲染的方式有哪些呢？
	- 方式一：条件判断语句
		- 适合逻辑较多的情况。
	- 方式二：三元运算符。
		- 适合逻辑比较简单。
	- 方式三：与运算符 `&&`。
		- 适合如果条件成立，渲染某一个组件；如果条件不成立，什么内容也不渲染的情况；
	- v-show 的效果：主要是控制 display 属性是否为 none

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
					msg: 'Hello World',
					isReady: false,
					friend: null
				}
			}

			render() {
				const { isReady, friend } = this.state

				let showEle = null
				if (isReady) {
					showEle = <h2>准备开始比赛吧</h2>
				} else [
					showEle = <div>请提前做好准备</div>
				]

				return (
					<div>
						{/* 方式一：根据条件给变量赋值不同的内容 */}
						<div>{ showEle }</div>

						{/* 方式二：三元运算符 */}
						<div>{ isReady ? <h2>开始战斗</h2> : <div>赶紧准备</div> }</div>

						{/* 方式三：&& 逻辑运算符，friend 为 null 时，不会展示，JSX 的特性 */}
						<div>{ friend && friend.name + ' ' + friend.desc }</div>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App />)
	</script>
</body>
```


## 实现点击切换内容的简单案例

如何实现类似于 v-show 的效果。

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
					isShow: true
				}
			}

			onChangeClick() {
				this.setState({
					isShow: !this.state.isShow
				})
			}

			render() {
				const { isShow } = this.state

				return (
					<div>
						<button onClick={ () => this.onChangeClick() }>切换</button>
						<h2 style={{ display: isShow ? 'block' : 'none' }}>哈哈哈</h2>
					</div>
				)
			}
		}

		const root = ReactDOM.createRoot(document.querySelector('#root'))
		root.render(<App />)
	</script>
</body>
```


# JSX 中的列表渲染

- 在 React 中，展示列表最多的方式就是使用数组的 map 高阶函数；
- 很多时候我们在展示一个数组中的数据之前，需要先对它进行一些处理：
	- 比如过滤掉一些内容：filter 函数
	- 比如截取数组中的一部分内容：slice 函数

理解绑定的 key 的作用。

-  key 主要的作用是为了提高 diff 算法时的效率；

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
						 students: [
							{ id: 111, name: 'zzt', score: 99 },
							{ id: 112, name: 'kobe', score: 98 },
							{ id: 113, name: 'james', score: 97 },
							{ id: 114, name: 'curry', score: 96 }
						 ]
					 }
				 }

				render() {
					const { students } = this.state

				 return (
					 <div>
						 <h2>学生列表数据</h2>
						 <div className="list">
							 {
								students.filter(item => item.score > 97)
									.slice(0, 1)
									.map(item => (
										<div className="item" key={ item.id }>
											<h2>学号：{ item.id }</h2>
											<h2>姓名：{ item.name }</h2>
											<h2>分数：{ item.score }</h2>
										</div>
									))
							}
						 </div>
					 </div>
				 )
				 }
			}

			const root = ReactDOM.createRoot(document.querySelector('#root'))
			root.render(<App/>)
		</script>
	</body>
```

# 理解 JSX 的本质，


- 实际上，jsx 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。
	- 所有的 jsx 最终都会被转换成 React.createElement 的函数调用。
- createElement 需要传递三个参数：
	- 参数一：type
		- 当前 ReactElement 的类型；
		- 如果是标签元素，那么就使用字符串表示，如 “div”；
		- 如果是组件元素，那么就直接使用组件的名称；
	- 参数二：config
		- 所有 jsx 中的属性都在 config 中以对象的属性和值的形式存储；
		- 比如传入 `className` 作为元素的 class；
	- 参数三：children
		- 存放在标签中的内容，以 children 数组的方式进行存储；
		- 当然，如果是多个元素呢？React 内部有对它们进行处理。


## 理解在 React 中 babel 编译后的源码。

Babel 编译前的代码

```jsx
// 1.定义 App 根组件
class App extends React.Component {
	constructor() {
		super()
		this.state = {
			message: "Hello World"
		}
	}

	render() {
		const { message } = this.state

		return (
			<div>
				<div className="header">Header</div>
				<div className="Content">
					<div>{ message }</div>
					<ul>
						<li>列表数据1</li>
						<li>列表数据2</li>
						<li>列表数据3</li>
						<li>列表数据4</li>
						<li>列表数据5</li>
					</ul>
				</div>
				<div className="footer">Footer</div>
			</div>
		)
	}
}

// 2.创建root并且渲染App组件
const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(<App/>)
```

Babel 编译后的代码

> `/*#__PURE__*/` 将函数标记为纯函数，有利于做 tree shaking

```jsx
// 1.定义App根组件
class App extends React.Component {
	constructor() {
		super()
		this.state = {
			message: "Hello World"
		}
	}

	render() {
		const { message } = this.state

		const element = React.createElement(
			"div",
			null,
/*#__PURE__*/ React.createElement(
				"div",
				{
					className: "header"
				},
				"Header"
			),
/*#__PURE__*/ React.createElement(
				"div",
				{
					className: "Content"
				},
/*#__PURE__*/ React.createElement("div", null, "Banner"),
/*#__PURE__*/ React.createElement(
					"ul",
					null,
	/*#__PURE__*/ React.createElement(
						"li",
						null,
						"\u5217\u8868\u6570\u636E1"
					),
	/*#__PURE__*/ React.createElement(
						"li",
						null,
						"\u5217\u8868\u6570\u636E2"
					),
	/*#__PURE__*/ React.createElement(
						"li",
						null,
						"\u5217\u8868\u6570\u636E3"
					),
	/*#__PURE__*/ React.createElement(
						"li",
						null,
						"\u5217\u8868\u6570\u636E4"
					),
	/*#__PURE__*/ React.createElement("li", null, "\u5217\u8868\u6570\u636E5")
				)
			),
/*#__PURE__*/ React.createElement(
				"div",
				{
					className: "footer"
				},
				"Footer"
			)
		);

		console.log(element)
		return element
	}
}

// 2.创建root并且渲染App组件
const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(React.createElement(App, null))
```

由上述案例可知，当我们直接使用 `React.createElement` 编写 React 代码时，babel 相关的依赖就不需要了，

- 所以，script 标签中 `type="text/babel"` 可以被我们删除掉了；
- 所以，`<script src="../react/babel.min.js"></script>` 可以被我们删除掉了；


# 理解 React 中虚拟 DOM 的创建过程

> 我们首先明确：虚拟 DOM 本质上是一个 JS 对象，它是元素在 JS 中的一种表示。

- 我们通过 React.createElement 最终创建出来一个 ReactElement 对象：
- 这个 ReactElement 对象有什么作用呢？React 为什么要创建它呢？
	- 原因是 React 利用 ReactElement 对象组成了一个 JavaScript 的对象树；
	- JavaScript 的对象树就是虚拟 DOM（Virtual DOM）；
- 如何查看 ReactElement 的树结构呢？
	- 我们可以将之前的 jsx 返回结果进行打印；
- 而 ReactElement 最终形成的树结构就是 Virtual DOM；

> Vue 中对 template 的解析，需要对指令等特殊语法做解析。
>
> React 中，只需要使用 babel 对 JSX 进行解析，
>
> - PS：JSX 不属于 React 框架的范畴。

理解 JSX 代码 => 虚拟 DOM -> 真实 DOM 的过程。

<img src="NodeAssets/jsx代码-虚拟DOM-真实DOM.jpg" alt="jsx代码-虚拟DOM-真实DOM" style="zoom:150%;" />



# 虚拟 DOM 的最主要作用（面试）：

- 更新数据时，没必要将所有数据重新渲染，有利于做 diff 算法。
- 有利于实现跨平台，在 React 中，虚拟 DOM 既可以做 DOM 元素的渲染，也可以通过桥接的方式，实现移动端控件的渲染（比如 React Native）
  - 补充：Weex：Vue 和阿里维护的用于做跨平台的库，用的非常少）。

- React 官方文档提到：虚拟 DOM 帮助我们从命令式编程转为声明式编程，这也是虚拟 DOM 的作用之一。

# 理解 React 中的声明式编程

- 虚拟 DOM 帮助我们从命令式编程转到了声明式编程的模式
- React 官方的说法：Virtual DOM 是一种编程理念。
	- 在这个理念中，UI 以一种理想化或者说虚拟化的方式保存在内存中，并且它是一个相对简单的 JavaScript 对象
	- 我们可以通过 root.render 让 虚拟 DOM 和真实 DOM 同步起来，这个过程中叫做协调（Reconciliation）；
- 这种编程的方式赋予了 React 声明式的 API：
	- 你只需要告诉 React 希望让 UI 是什么状态；
	- React 来确保 DOM 和这些状态是匹配的；
	- 你不需要直接进行 DOM 操作，就可以从手动更改 DOM、属性操作、事件处理中解放出来；

# React 实现购物车案例。

- 在 React 中，不要直接设值 state，当我们需要设值引用类型中的属性值时，一般通过浅拷贝进行设值。

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>购物车</title>
	<style>
		table {
			border-collapse: collapse;
			text-align: center;
		}
		thead {
			background-color: #f2f2f2;
		}
		td, th {
			padding: 10px 16px;
			border: 1px #aaa solid;
		}

	</style>
</head>
<body>
	<div id="root"></div>

	<script src="../../lib/react.development.js"></script>
	<script src="../../lib/react-dom.development.js"></script>
	<script src="../../lib/babel.min.js"></script>
	<script src="./data.js"></script>
	<script src="./format.js"></script>

 <script type="text/babel">
	 class App extends React.Component {
		 constructor() {
			 super()
			 this.state = {
				 books: books
			 }
		 }

		onChangeCountClick(index, count) {
			const books = [...this.state.books]
			books[index].count += count
			this.setState({ books })
		}

		onRemoveItemClick(index) {
			const books = [...this.state.books]
			books.splice(index, 1)
			this.setState({ books })
		}

		getTotalPrice() {
			return this.state.books.reduce((accumulator, item) => {
				accumulator += item.price * item.count
				return accumulator
			}, 0)
		}

		renderBookList(books) {
			return (
				<div>
					<table>
						<thead>
							<tr>
								<th>序号</th>
								<th>书籍名称</th>
								<th>出版日期</th>
								<th>价格</th>
								<th>购买数量</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{
								books.map((item, index) => (
									<tr key={ item.id }>
										<td>{ index + 1 }</td>
										<td>{ item.name }</td>
										<td>{ item.date }</td>
										<td>{ formatPrice(item.price) }</td>
										<td>
											<button
												onClick={ () => this.onChangeCountClick(index, -1) }
												disabled={ item.count <= 1}>
												-
											</button>
											{ item.count }
											<button onClick={ () => this.onChangeCountClick(index, 1) }>
												+
											</button>
										</td>
										<td>
											<button onClick={ () => this.onRemoveItemClick(index) }>删除</button>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
					<h2>总价格：{ formatPrice(this.getTotalPrice()) }</h2>
				</div>
			)
		}

		renderBookEmpty() {
			return <div><h2>购物车为空</h2></div>
		}

		render() {
			const { books } = this.state
			return books.length ? this.renderBookList(books) : this.renderBookEmpty()
		 }
	}

	const root = ReactDOM.createRoot(document.querySelector('#root'))
	root.render(<App/>)
 </script>
</body>
</html>
```

# 理解前端工程化项目的复杂性

- 如果我们只是开发几个小的 demo 程序，那么永远不需要考虑一些复杂的问题：
	- 比如目录结构如何组织划分；
	- 比如如何管理文件之间的相互依赖；
	- 比如如何管理第三方模块的依赖；
	- 比如项目发布前如何压缩、打包项目；
	- 等等...
- 现代的前端项目已经越来越复杂了：
	- 不会再是在HTML中引入几个 css 文件，引入几个编写的 js 文件或者第三方的 js 文件这么简单；
	- 比如 css 可能是使用 less、sass 等预处理器进行编写，我们需要将它们转成普通的 css 才能被浏览器解析；
	- 比如 JavaScript 代码不再只是编写在几个文件中，而是通过模块化的方式，被组成在成百上千个文件中，我们需要通过模块化的技术来管理它们之间的相互依赖；
	- 比如项目需要依赖很多的第三方库，如何更好的管理它们（比如管理它们的依赖、版本升级等）；
- 为了解决上面这些问题，我们需要再去学习一些工具：
	- 比如 babel、webpack、gulp，配置它们转换规则、打包依赖、热更新等等一些的内容；
	- 脚手架的出现，就是帮助我们解决这一系列问题的；

# 什么是脚手架？

- 传统的脚手架指的是建筑学的一种结构：在搭建楼房、建筑物时，临时搭建出来的一个框架；
- 编程中提到的脚手架（Scaffold），其实是一种工具，帮我们可以快速生成项目的工程化结构；
	- 每个项目作出完成的效果不同，但是它们的基本工程化结构是相似的；
	- 既然相似，就没有必要每次都从零开始搭建，完全可以使用一些工具，帮助我们生产基本的工程化模板；
	- 不同的项目，在这个模板的基础之上进行项目开发或者进行一些配置的简单修改即可；
	- 这样也可以间接保证项目的基本机构一致性，方便后期的维护；
- 总结：脚手架让项目从搭建到开发，再到部署，整个流程变得快速和便捷；

## 安装 react 脚手架工具，创建项目

1. 安装 Node 环境。

2. 安装 react 脚手架工具

   ```shell
   npm install create-react-app -g
   ```

3. 创建一个 React 项目。

   ```shell
   create-react-app [项目名称] # 项目名称不能有大写英文字母
   ```

# React 项目目录结构分析

<img src="NodeAssets/React项目目录结构分析.jpg" alt="React项目目录结构分析" style="zoom:150%;" />

实际开发中，我们根据自身情况，删除掉项目中不必要的文件。

目录结构中，有 PWA 相关的文件。

## 什么是 PWA ？

- 整个目录结构都非常好理解，只是有一个 PWA 相关的概念：
	- PWA 全称 Progressive Web App，即渐进式 WEB 应用；
	- 一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用；
	- 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能；
	- 这种 Web 存在的形式，我们也称之为是 Web App；
- PWA 解决了哪些问题呢？
	- 可以添加至主屏幕，点击主屏幕图标可以实现启动动画以及隐藏地址栏；
	- 实现离线缓存功能，即使用户手机没有网络，依然可以使用一些离线功能；
	- 实现了消息推送；
	- 等等一系列类似于 Native App 相关的功能；
- 更多 PWA 相关的知识，可以自行去学习更多；
	- https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps

# 利用脚手架，从零搭建一个项目

02-learn-scaffold\src\index.js

```js
import ReactDOM from 'react-dom/client'

import App from './App'

const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<App/>)
```

02-learn-scaffold\src\App.jsx

```jsx
import React from 'react'
import HelloWorld from './components/HelloWorld'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			msg: 'Hello React Scaffold'
		}
	}

	render() {
		const { msg } = this.state

		return (
			<div>
				<h2>{ msg }</h2>
				<HelloWorld />
			</div>
		)
	}
}

export default App
```

02-learn-scaffold\src\components\HelloWorld.jsx

```jsx
import React from 'react'

class HelloWorld extends React.Component {
	render() {
		return (
			<div>
				<h2>Hello World</h2>
				<p>Hello World，你好，师姐</p>
			</div>
		)
	}
}

export default HelloWorld
```

# 如何弹出 react 项目的 webpack 配置？

- React 脚手架默认是基于 Webpack 来开发的；
- 但是，很奇怪：我们并没有在目录结构中看到任何 webpack 相关的内容？
	
	- 原因是 React 脚手架将 webpack 相关的配置隐藏起来了（其实从 Vue CLI3 开始，也是进行了隐藏）；
- 如果我们希望看到 webpack 的配置信息，应该怎么来做呢？
	- 我们可以执行一个 package.json 文件中的一个脚本："eject": "react-scripts eject"
	
	  ```shell
	  npm run eject
	  ```
	
	- 这个操作是不可逆的，所以在执行过程中会给与我们提示；
