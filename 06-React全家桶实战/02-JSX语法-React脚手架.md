# JSX 的事件绑定，

相比原生是怎样的？

- 如果原生DOM原生有一个监听事件，我们可以如何操作呢？
	- 方式一：获取DOM原生，添加监听事件；

	  ```js
	  const boxEl = document.querySelector('.box')
	  boxEl.addEventListener('click', function() {/*...*/})
	  ```

	- 方式二：在HTML原生中，直接绑定onclick；

	  ```js
	  const boxEl = document.querySelector('.box')
	  boxEl.onclick = function() {/*...*/}
	  ```

- 在React中是如何操作呢？或者说在 JSX 中如何操作呢？这里主要有两点不同：
	- React 事件的命名采用小驼峰式（camelCase），而不是纯小写；
	- 我们需要通过{}传入一个事件处理函数，这个函数会在事件发生时被执行；

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

- 在事件执行后，我们可能需要获取当前类的对象中相关的属性，这个时候需要用到this
	- 如果我们这里直接打印this，也会发现它是一个undefined
- 为什么是undefined呢？
	- 原因是btnClick函数并不是我们主动调用的，而且当button发生改变时，React内部调用了btnClick函数；
	- 而它内部调用时，并不知道要如何绑定正确的this；
- 如何解决this的问题呢？
	- 方案一：bind给btnClick显示绑定this
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

在执行事件函数时，有可能我们需要获取一些参数信息：比如event对象、其他参数

- 情况一：获取event对象（获取到的是 react 包装后的 event 对象，而非原生 event 对象）。
	- 很多时候我们需要拿到event对象来做一些事情（比如阻止默认行为）
	- 那么默认情况下，event对象有被直接传入，函数就可以获取到event对象；
- 情况二：获取更多参数
	- 有更多参数时，我们最好的方式就是传入一个箭头函数，主动执行的事件函数，并且传入相关的其他参数；

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
	- 在vue中，我们会通过指令来控制：比如v-if、v-show； 
	- 在React中，所有的条件判断都和普通的JavaScript代码一致；
- 常见的条件渲染的方式有哪些呢？ 
	- 方式一：条件判断语句 
		- 适合逻辑较多的情况。
	- 方式二：三元运算符。
		- 适合逻辑比较简单
	- 方式三：与运算符&&。
		- 适合如果条件成立，渲染某一个组件；如果条件不成立，什么内容也不渲染；
	- v-show的效果：主要是控制display属性是否为none

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
						<button onClick={() => this.onChangeClick() }>切换</button>
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


* JSX 中的列表熏染。理解绑定的 key 的作用。
* 理解 JSX 的本质，理解 babel 编译后的源码。
* 理解 React 中虚拟 DOM 的创建过程。理解 JSX 代码 => 虚拟 DOM -> 真实 DOM 的过程。
* 虚拟 DOM 的最主要2点作用（面试）：
	- 更新数据时，没必要将所有数据重新渲染，有利于做 diff 算法。
	- 有利于实现跨平台，既可以做 DOM 元素的渲染，也可以通过桥接的方式，实现移动端控件的渲染（比如 React Native，Weex：Vue 和阿里维护的用于做跨平台的库，用的非常少）。
	- 官方文档中说：虚拟 DOM 帮助我们从命令式编程转为声明式编程，这也是虚拟 DOM 的作用之一。
* 理解 React 中的声明式编程
* 使用 React 实现购物车案例。
	- 在 React 中，不要直接设值 state，当我们需要设值引用类型中的属性值时，一般通过浅拷贝进行设值。
* 理解前端工程化项目的复杂性。什么是脚手架？
* 安装 react 脚手架工具 create-react-app，使用它创建一个 react 项目。目录结构分析。
* 目录结构中，有 PWA 相关的文件，什么是 PWA ？
* 利用脚手架，从0搭建一个项目。
* 如何弹出 react 项目的 webpack 配置？

