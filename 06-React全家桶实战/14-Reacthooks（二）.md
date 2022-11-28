# useEffect Hook

## 认识 Effect Hook。

在计算机科学中，Effect 通常指代副作用。

事实上，类似于网络请求、手动更新DOM、一些事件的监听，都是React更新DOM的一些副作用（Side Effects）；

所以对于完成这些功能的Hook被称之为 Effect Hook；

## counter 改变更新 title 案例

需求：页面的 title 总是显示 counter 的数字，

使用 class 组件

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
	constructor() {
		super()
		this.state = {
			counter: 100
		}
	}

	componentDidMount() {
		document.title = this.state.counter
	}

	componentDidUpdate() {
		document.title = this.state.counter
	}


	render() {
		const { counter } = this.state

		return (
			<div>
				<h2>计数：{counter}</h2>
				<button onClick={e => this.setState({ counter: counter + 1 })}>+1</button>
			</div>
		)
	}
}

export default App
```

使用函数式组件集合 Hook 实现：

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useState, useEffect } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(200)

	// document.title = count // 在函数中直接修改，这样写能达到效果，但是

	useEffect(() => {
		// 当前传入的回调函数，会在组件被渲染完成后，自动执行。
		// 可做操作：网络请求/DOM操作（修改标题）/事件监听。
		document.title = count
	})

	return (
		<div>
			<h2>当前计数：{count}</h2>
			<button onClick={e => setCount(count + 1)}>+1</button>
		</div>
	)
})

export default App
```

## useEffect 的使用解析。

- 通过 useEffect 的 Hook，可以告诉 React 需要在渲染后执行某些操作； 
- useEffect 要求我们传入一个回调函数，在 React 执行完更新 DOM 操作之后，就会回调这个函数；
- 默认情况下，无论是第一次渲染之后，还是每次更新之后，都会执行这个回调函数；

## 清除 Effect 的使用。

在 class 组件的编写过程中，某些副作用的代码，我们需要在 componentWillUnmount 中进行清除：
- 比如我们之前的事件总线或 Redux 中手动调用 subscribe；都需要在 componentWillUnmount 有对应的取消订阅；

Effect Hook 通过什么方式来模拟 componentWillUnmount 呢？
- useEffect 传入的回调函数A本身可以有一个返回值，这个返回值是另外一个回调函数B： 
- `type EffectCallback = () => (void | (() => void | undefined));`
- 这样做可以将添加和移除订阅的逻辑放在一起；它们都属于 effect 的一部分；

清除 Effect 的执行时机：
- React 会在组件更新和卸载的时候执行清除操作；

使用代码模拟取消事件监听的操作

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	// 当前组件渲染完成（初次渲染或更新）后，要执行的副作用。
	useEffect(() => {
		console.log('监听 redux 中的数据变化， 监听 eventBus 中的 zzt 事件')

		// 返回值：回调函数 => 组件被重新渲染（更新）或被卸载的时候执行。
		return () => {
			console.log('取消监听 redux 中的数据变化，取消监听 eventBus 中的 zzt 事件');
		}
	})

	return (
		<div>
			<button onClick={e=> setCount(count + 1)}>+1{count}</button>
		</div>
	)
})

export default App
```

## 使用多个 useEffect

使用Hook的其中一个目的就是解决 class 中生命周期经常将很多的逻辑放在一起的问题： 
- 比如网络请求、事件监听、手动修改DOM，这些往往都会放在 componentDidMount 中；

使用 Effect Hook，我们可以将它们分离到不同的 useEffect 中： 
-  React 将按照 effect 声明的顺序依次调用组件中的每一个 effect；

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		// 1.DOM 操作，修改 document 的 title
		console.log('修改 title')
	})

	useEffect(() => {
		// 2.订阅（subscripe） redux 中状态的变化
		console.log('订阅 redux 中的状态变化')
		return () => {
			console.log('取消订阅');
		}
	})

	useEffect(() => {
		// 3.监听 eventBus 中的 zzt 事件
		console.log('监听 eventBus 中的 zzt 事件')
		return () => {
			console.log('取消监听');
		}
	})

	return (
		<div>
      <button onClick={e => setCount(count+1)}>+1({count})</button>
		</div>
	)
})

export default App
```

## Effect 的性能优化

默认情况下，useEffect 的回调函数会在每次渲染时都重新执行，但是这会导致两个问题： 
- 问题一：某些代码我们只是希望执行一次即可，类似于 componentDidMount 和 componentWillUnmount 中完成的事情；（比如网络请求、订阅和取消订阅）；
- 问题二：多次执行也会导致一定的性能问题；

我们如何决定 useEffect 在什么时候应该执行和什么时候不应该执行呢？useEffect 实际上可以传入两个参数： 
- 参数一：执行的回调函数； 
- 参数二：一个数组，数组中存放了 useEffect 中的回调函数重新执行所依赖的 state。

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)
	const [msg, setMsg] = useState('Hello World')

	// 使用 useEffect 模拟 componentDidMount 和 componentWillUnmount 生命周期，传入一个空数组。
	useEffect(() => {
		console.log('订阅 redux 中的数据')
		return () => {
			console.log('取消订阅');
		}
	}, [])

	useEffect(() => {
		console.log('监听 eventBus 的 zzt 事件')
		return () => {
			console.log(`取消监听`);
		}
	}, [])

	useEffect(() => {
		console.log('发送网络请求，从服务器获取数据')
		return () => {
			console.log('会在组件被卸载时，');
		}
	}, [])

	// 使用 useEffect 模拟 componentDidUpdate，传入一个数组，里面存放了依赖的状态
	useEffect(()=> {
		console.log('count 更新了', count);
	}, [count])


	return (
		<div>
			<button onClick={e => setCount(count + 1)}>+1{count}</button>
			<button onClick={e => setMsg('你好啊！')}>修改msg{msg}</button>
		</div>
	)
})

export default App
```
> useEffect 用来执行副作用，可以模拟生命周期，但比生命周期更强大。

6. useContext 的使用。
7. useReducer 的使用。理解闭包现阶，理解真正用途。优化的步骤结合 useRef 进行最终优化。