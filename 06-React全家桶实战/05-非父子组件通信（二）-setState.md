# 一、非父子组件通信

## 1.EventBus

03-learn-component\src\10-非父子组件通信-EventBus\utils\event-bus.js

```jsx
import mitt from 'mitt'

const mitter = mitt()
export default mitter
```

03-learn-component\src\10-非父子组件通信-EventBus\App.jsx

```jsx
import React, { Component } from 'react'
import Home from './Home'
import mitter from './utils/event-bus'

export class App extends Component {
	componentDidMount() {
		mitter.on('bannerPrev', this.handleBannerPrevClick.bind(this))
		mitter.on('bannerNext', this.handleBannerNextClick.bind(this))
	}
	componentWillUnmount() {
		mitter.all.clear()
	}
  
	render() {
		return (
			<div>
				<h3>App Component</h3>
				<Home />
			</div>
		)
	}
  
	handleBannerPrevClick(event) {
		console.log('handleBannerPrevClick event:', event, 'this:', this)
	}
	handleBannerNextClick(event) {
		console.log('handleBannerNextClick event:', event, 'this:', this)
	}
}

export default App
```

03-learn-component\src\10-非父子组件通信-EventBus\HomeBanner.jsx

```jsx
import React, { Component } from 'react'
import mitter from './utils/event-bus'

export class HomeBanner extends Component {
	onPrevClick() {
		console.log('上一个')
		mitter.emit('bannerPrev', { name: 'zzt', age: 18, height: 1.88 })
	}
	onNextClick() {
		console.log('下一个')
		mitter.emit('bannerNext', { nickname: 'kobe', level: 99 })
	}

	render() {
		return (
			<div>
				<h2>HomeBanner</h2>
				<button onClick={e => this.onPrevClick()}>上一个</button>
				<button onClick={e => this.onNextClick()}>下一个</button>
			</div>
		)
	}
}

export default HomeBanner
```

# 二、Vue 和 React 渲染流程对比

Vue 的渲染流程：

- template -> compiler 模块编译 -> render 函数（返回 createVNode（h）函数） -> VNode ( -> 渲染器 patch / 挂载 -> 真实 DOM -> 显示在页面上)

React 的渲染流程：

- render -> React.createElement -> 虚拟 DOM -> diff 算法 -> 真实 DOM -> 显示在页面上

# 三、React 中的 setState（面试）

开发中我们并不能直接通过修改 `state` 的值来让界面发生更新；

React 并没有实现类似于 Vue2 中的 `Object.defineProperty` 或者 Vue3 中的 `Proxy` 的方式来监听数据的变化；

必须通过 `setState` 来告知 React 数据已经发生了变化；

组件中并没有实现 `setState` 的方法，它是从 `Component` 中继承过来的。

> `setState` 源码位置 packages/react/src/ReactBaseClasses.js

## 1.setState 用法（3种）

03-learn-component\src\11-setState的使用\App.jsx

```jsx
import React, { Component } from 'react'

export class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			msg: 'Hello World',
		}
	}

	render() {
		const { msg } = this.state

		return (
			<div>
				<h2>msg: {msg}</h2>
				<button onClick={e => this.changeText()}>修改文本</button>
			</div>
		)
	}

	changeText() {
		// 1.setState 基本用法
		this.setState({ msg: '你好啊，李银河' })

		/**
		 * 2.setState 传入回调函数；
		 * 2点好处：
		 *  1.可在回调函数中编写新的 state 逻辑
		 *  2.当前的回调函数，会将合并后的 state 和 props 传递过来
		 */
		this.setState((state, props) => {
			console.log('state2:', state); // 第二个被打印：'你好啊，李银河·
			return {
				msg: '你好吗？银河李'
			}
		}, () => {
			console.log('state2.1:', this.state); // 第三个被打印：'我很好，李银河'
		})

		/**
		 * 3.setState 在 React 的事件处理中是异步调用的；
		 * 如果希望在数据更新（合并）之后，获取到对应的结果并执行一些逻辑代码，那么可以在 setState 中传入第二个参数
		 */
		this.setState({ msg: '我很好，李银河' }, () => {
			console.log('state3', this.state); // 第四个被打印：'我很好，李银河'
		})
		console.log('state4:', this.state) // 第一个打印：·Hello World·
	}

}

export default App
```

## 2.更新后的值获取（总结）

方式一：`setState` 的回调
- `setState` 接受两个参数：第二个参数是一个回调函数，这个回调函数会在更新后执行；
- 格式如下：`setState(partialState, callback)`

方式二：在生命周期函数获取：

```jsx
componentDidUpdate() {
  console.log(this.state.msg)
}
```


## 3.setState 设计成异步的原因

[React 成员，Redux 的作者 Dan Abramov 的回答](https://github.com/facebook/react/issues/11527#issuecomment-360199710%C3%AF%C2%BC%C5%82)，可总结为：

`setState` 设计为异步，可以显著的提升性能；

- 如果 `setstate` 同步更新了 `state`，并立即执行 `render` 函数，那么 `render` 函数可能会被频繁调用，界面频繁重新渲染，这样效率无疑是很低的；
- 如果 `setstate` 同步更新了 `state`，但是不立即（异步）执行 `render` 函数，那么 `state` 和子组件中的 `props` 不能保持同步；在开发中父子组件进行调试时，会产生很多的问题；

所以最好的办法应该是收集到多个 `setState` 操作后，进行批处理，做批量更新

React 中会将每次 `setState` 操作放入一个队列中，以便进行批处理。

## 4.验证 setState 执行过程

验证 `setState` 是异步的，且多次调用 `setState` 后，`render` 只执行了一次。

03-learn-component\src\11-setState的使用\02-验证setState是异步的.jsx

```jsx
import React, { Component } from 'react'

export class app extends Component {
	constructor() {
		super()
		this.state = {
			counter: 0
		}
	}
	render() {
		console.log('render 被执行了'); // 只打印了一次
		const { counter } = this.state
		return (
			<div>
				<h2>当前计数：{ counter }</h2>
				<button onClick={ e => this.increment() }>counter+1</button>
			</div>
		)
	}
	increment() {
		this.setState({ counter: this.state.counter + 1 })
		this.setState({ counter: this.state.counter + 1 })
		this.setState({ counter: this.state.counter + 1 })
		// 最终 this.state.counter 应为3，但实际为1
	}
}

export default app
```

## 5.验证 setState 合并过程

03-learn-component\src\11-setState的使用\03-验证setState的合并过程.jsx

```jsx
import React, { Component } from 'react'

export class app extends Component {
	constructor() {
		super()
		this.state = {
			counter: 0
		}
	}
	render() {
		console.log('render 被执行了'); // 只打印了一次
		const { counter } = this.state
		return (
			<div>
				<h2>当前计数：{ counter }</h2>
				<button onClick={ e => this.increment() }>counter+1</button>
			</div>
		)
	}
	increment() {
		this.setState(state => ({ counter: state.counter + 1 }))
		this.setState(state => ({ counter: state.counter + 1 }))
		this.setState(state => ({ counter: state.counter + 1 }))
		// 最终 this.state.counter 结果为3
	}
}

export default app
```

## 6.setState 一定是异步的吗？（面试）

React 18 后，所有情况都是异步的。

React 18 前，分两种情况。

- 在组件生命周期或 React 合成事件中，`setState` 是异步； 
- 在 `setTimeout` 或者原生 DOM 事件中，`setState` 是同步；

```jsx
import React, { Component } from 'react'

function Hello(props) {
	return <h2>{props.message}</h2>
}

export class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			message: 'Hello World'
		}
	}

	componentDidMount() {
		const btnEl = document.querySelector('.btn')
		// 在 react 18 之前, 原生 DOM 事件监听 中 setState 是同步操作
		// 在 react 18 之后, 原生 DOM 事件监听 中 setState 是异步操作(批处理)
		btnEl.addEventListener('click', () => {
			this.setState({ message: '你好吗？银河李' })
      console.log('message:', this.state.message)
		})
	}

	render() {
		const { message } = this.state
		console.log('render被执行')

		return (
			<div>
				<h2>message: {message}</h2>
				<button onClick={e => this.changeText()}>修改文本1</button>
				<button className="btn">修改文本2</button>
				<Hello message={message} />
			</div>
		)
	}

	changeText() {
		setTimeout(() => {
			// 在 react18 之前, setTimeout 中 setState 是同步操作
			// 在 react18 之后, setTimeout 中 setState 是异步操作(批处理)
			this.setState({ message: '你好啊, 李银河' })
			console.log('message:', this.state.message)
		}, 0)
	}
}

export default App
```

## 7.手动将 setState 改为同步

使用 `flushSync`  API

```jsx
import React, { Component } from 'react'
import { flushSync } from 'react-dom'

function Hello(props) {
	return <h2>{props.message}</h2>
}

export class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			message: 'Hello World'
		}
	}

	render() {
		const { message } = this.state
		console.log('render被执行')

		return (
			<div>
				<h2>message: {message}</h2>
				<button onClick={e => this.changeText()}>修改文本1</button>
				<Hello message={message} />
			</div>
		)
	}

	changeText() {
		flushSync(() => {
			this.setState({ message: '你好啊, 李银河' })
		})
		console.log('message:', this.state.message) // 你好啊，李银河
	}
}

export default App
```
